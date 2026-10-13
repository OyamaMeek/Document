import subprocess
from html import escape
from pathlib import Path
from urllib.parse import quote


def render_tree(tree, prefix=""):
    lines = ["<ul>"]
    entries = sorted(
        tree.items(), key=lambda item: (item[1] is None, item[0].casefold(), item[0])
    )
    for name, children in entries:
        path = prefix + name
        label = escape(name)
        if children is None:
            lines.append(f'<li><a href="./{quote(path, safe="/")}">{label}</a></li>')
        else:
            lines.append(f"<li><details open><summary>{label}/</summary>")
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

    page = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Document · 文件目录</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 960px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; }
    ul { list-style: none; padding-left: 1.25rem; }
    nav > ul { padding-left: 0; }
    ul ul { border-left: 1px solid #ddd; margin-left: .35rem; }
    li { margin: .3rem 0; }
    summary { cursor: pointer; font-weight: 600; overflow-wrap: anywhere; }
    a { color: #0969da; overflow-wrap: anywhere; }
    a:hover { text-decoration-thickness: 2px; }
  </style>
</head>
<body>
  <h1>Document 文件目录</h1>
  <p>点击文件夹可展开或收起，点击文件名可打开文件。共 FILE_COUNT 个文件。</p>
  <nav aria-label="文件目录">
FILE_TREE
  </nav>
</body>
</html>
""".replace("FILE_COUNT", str(len(paths))).replace("FILE_TREE", render_tree(tree))
    Path("index.html").write_text(page, encoding="utf-8")
    print(f"已生成 index.html，共 {len(paths)} 个文件。")


if __name__ == "__main__":
    generate_index()
