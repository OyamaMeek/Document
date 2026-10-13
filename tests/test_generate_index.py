import subprocess
import sys
import tempfile
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote


ROOT = Path(__file__).resolve().parents[1]
GENERATOR = ROOT / "scripts" / "generate_index.py"


class FileTreeParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.depth = 0
        self.open_directories = 0
        self.entries = {}
        self.controls = {}

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == "li" and "data-path" in attributes:
            self.entries[attributes["data-path"]] = attributes
        if "id" in attributes:
            self.controls[attributes["id"]] = attributes
        if tag == "details":
            self.depth += 1
            self.open_directories += "open" in attributes
        if tag == "a":
            self.links.append((attributes["href"], self.depth))

    def handle_endtag(self, tag):
        if tag == "details":
            self.depth -= 1


class GenerateIndexTests(unittest.TestCase):
    def setUp(self):
        workspace = ROOT / ".agent" / "test-workspace"
        workspace.mkdir(parents=True, exist_ok=True)
        self.directory = tempfile.TemporaryDirectory(dir=workspace)
        self.addCleanup(self.directory.cleanup)
        self.repository = Path(self.directory.name)
        self.git("init", "--quiet")

    def git(self, *args):
        result = subprocess.run(
            ["git", *args], cwd=self.repository, capture_output=True, text=True
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        return result

    def track(self, name, content="test"):
        path = self.repository / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        self.git("add", "--", name)

    def generate(self):
        result = subprocess.run(
            [sys.executable, str(GENERATOR)],
            cwd=self.repository,
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        page = (self.repository / "index.html").read_text(encoding="utf-8")
        parser = FileTreeParser()
        parser.feed(page)
        return page, parser

    def test_root_nested_and_hidden_files_have_correct_directory_depth(self):
        for name in ("root.md", "folder/deep/file.pdf", ".github/workflow.yml"):
            self.track(name)
        page, parser = self.generate()
        self.assertCountEqual(
            parser.links,
            [("./root.md", 0), ("./folder/deep/file.pdf", 2),
             ("./.github/workflow.yml", 1)],
        )
        self.assertEqual(parser.open_directories, 3)
        self.assertIn('lang="zh-CN"', page)

    def test_special_characters_are_safe_and_links_round_trip(self):
        name = '中文 目录/<script> & "a" #?%\n.txt'
        self.track(name)
        self.track("javascript:alert(1).txt")
        page, parser = self.generate()
        self.assertCountEqual(
            [unquote(href[2:]) for href, _ in parser.links],
            [name, "javascript:alert(1).txt"],
        )
        for href, _ in parser.links:
            self.assertTrue(href.startswith("./"))
            self.assertNotRegex(href, r'[<>"\s#?]')
        self.assertIn("&lt;script&gt; &amp; &quot;a&quot;", page)
        self.assertNotIn("<script>", page)

    def test_untracked_and_git_internal_files_are_excluded(self):
        self.track("tracked.md")
        (self.repository / "untracked.txt").write_text("local", encoding="utf-8")
        _, parser = self.generate()
        self.assertEqual(parser.links, [("./tracked.md", 0)])

    def test_additions_and_deletions_update_the_tree(self):
        self.track("old/file.txt")
        self.git(
            "-c", "user.name=Index test", "-c", "user.email=index-test@example.com",
            "commit", "--quiet", "-m", "test fixture",
        )
        self.generate()
        self.git("rm", "--", "old/file.txt")
        self.track("new/file.txt")
        _, parser = self.generate()
        self.assertEqual(parser.links, [("./new/file.txt", 1)])

    def test_directories_sort_first_and_regeneration_is_identical(self):
        for name in ("z.txt", "a.txt", "Zoo/file.txt", "Alpha/file.txt", "index.html"):
            self.track(name)
        first, parser = self.generate()
        second, _ = self.generate()
        self.assertEqual(first, second)
        self.assertEqual(
            [href for href, _ in parser.links],
            ["./Alpha/file.txt", "./Zoo/file.txt", "./a.txt", "./index.html", "./z.txt"],
        )

    def test_empty_repository_generates_a_valid_empty_index(self):
        page, parser = self.generate()
        self.assertEqual(parser.links, [])
        self.assertIn("<!DOCTYPE html>", page)

    def test_drive_rows_include_real_size_and_file_type(self):
        self.track("资料/报告.pdf", "你好")
        self.track("site.html")
        _, parser = self.generate()
        self.assertIn("资料", parser.entries)
        self.assertEqual(parser.entries["资料"]["data-kind"], "folder")
        self.assertEqual(parser.entries["资料/报告.pdf"]["data-size"], "6")
        self.assertEqual(parser.entries["资料/报告.pdf"]["data-type"], "PDF 文档")
        self.assertEqual(parser.entries["site.html"]["data-type"], "网页")

    def test_index_size_does_not_depend_on_previous_generated_page(self):
        self.track("index.html", "old page")
        first, parser = self.generate()
        second, _ = self.generate()
        self.assertIn("index.html", parser.entries)
        self.assertEqual(parser.entries["index.html"]["data-size"], "")
        self.assertEqual(first, second)

    def test_accessible_drive_navigation_and_search_controls_are_generated(self):
        _, parser = self.generate()
        self.assertIn("file-search", parser.controls)
        self.assertEqual(parser.controls["file-search"]["type"], "search")
        self.assertEqual(parser.controls["file-search"]["aria-label"], "搜索全部文件和文件夹")
        self.assertEqual(parser.controls["breadcrumbs"]["aria-label"], "当前位置")
        self.assertEqual(parser.controls["folder-up"]["aria-label"], "返回上级目录")


if __name__ == "__main__":
    unittest.main()
