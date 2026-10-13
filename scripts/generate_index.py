import subprocess
from html import escape
from pathlib import Path
from urllib.parse import quote


FILE_TYPES = {
    ".pdf": ("PDF 文档", "pdf"),
    ".epub": ("电子书", "book"),
    ".xlsx": ("电子表格", "sheet"),
    ".xls": ("电子表格", "sheet"),
    ".html": ("网页", "web"),
    ".md": ("Markdown 文档", "text"),
    ".txt": ("文本文件", "text"),
    ".py": ("Python 源码", "code"),
    ".js": ("JavaScript 源码", "code"),
    ".json": ("JSON 文件", "code"),
    ".yml": ("YAML 配置", "code"),
    ".yaml": ("YAML 配置", "code"),
    ".png": ("图片", "image"),
    ".jpg": ("图片", "image"),
    ".svg": ("矢量图片", "image"),
    ".zip": ("压缩文件", "archive"),
}


def render_tree(tree, prefix=""):
    lines = ["<ul>"]
    entries = sorted(
        tree.items(), key=lambda item: (item[1] is None, item[0].casefold(), item[0])
    )
    for name, children in entries:
        path = prefix + name
        label = escape(name)
        if children is None:
            file_type, icon = FILE_TYPES.get(Path(name).suffix.lower(), ("文件", "file"))
            size = "" if path == "index.html" else str(Path(path).stat().st_size)
            action = f'<a class="file-row" href="./{quote(path, safe="/")}">'
            metadata = f'data-kind="file" data-type="{file_type}" data-size="{size}"'
            size_label = f"{int(size):,} B" if size else "—"
        else:
            file_type, icon = "文件夹", "folder"
            metadata = 'data-kind="folder" data-type="文件夹" data-size=""'
            action = '<details open><summary class="file-row">'
            size_label = f"{len(children)} 项"
        lines.append(f'<li data-path="{escape(path)}" {metadata}>')
        lines.append(action)
        lines.append(
            f'<span class="row-name"><span class="file-icon icon-{icon}" aria-hidden="true">'
            f'<svg viewBox="0 0 32 32"><use href="#icon-{"folder" if children is not None else "file"}"></use></svg>'
            f'</span><span class="name-group"><span class="filename" title="{label}">{label}</span>'
            f'</span></span><span class="row-type">{file_type}</span><span class="row-size">{size_label}</span>'
        )
        if children is None:
            lines.append("</a></li>")
        else:
            lines.append("</summary>")
            lines.append(render_tree(children, path + "/"))
            lines.append("</details></li>")
    lines.append("</ul>")
    return "\n".join(lines)


def generate_index():
    result = subprocess.run(
        ["git", "ls-files", "-z"], check=True, capture_output=True
    )
    paths = result.stdout.decode("utf-8").split("\0")[:-1]
    tree = {}
    for path in paths:
        parts = path.split("/")
        directory = tree
        for name in parts[:-1]:
            directory = directory.setdefault(name, {})
        directory[parts[-1]] = None

    template = Path(__file__).with_name("index.template.html").read_text(encoding="utf-8")
    page = template.replace("<!-- FILE_COUNT -->", str(len(paths))).replace(
        "<!-- FILE_TREE -->", render_tree(tree)
    )
    Path("index.html").write_text(page, encoding="utf-8")
    print(f"已生成 index.html，共 {len(paths)} 个文件。")


if __name__ == "__main__":
    generate_index()
