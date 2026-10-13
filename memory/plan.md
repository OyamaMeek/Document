# 文件目录自动索引计划

目标：每次分支 push 后，将所有 Git 跟踪文件按目录层级生成到根目录 `index.html`，提供可展开目录和可点击文件链接。

## 范围与设计

- 新增 `scripts/generate_index.py`，以 `git ls-files -z` 为唯一文件来源，保留隐藏文件和根目录文件；不读取文件内容、不列出 `.git` 或未跟踪文件。
- 文件名使用 HTML 转义，相对链接使用 URL 编码并以 `./` 开头；目录排在文件前，同类按文件名稳定排序。
- 新增 `.github/workflows/update-index.yml`，在所有分支 push 时测试、生成，仅有变化时提交并普通推送 `index.html`；同一分支串行执行。
- 修改根目录 `index.html`；新增 `tests/test_generate_index.py` 和 `.gitignore`；初始化 `memory/` 并记录 `docs/CHANGELOG.md`。
- 仓库没有既有调用者、导出、测试、Actions 或 Pages 配置；不启用 Pages，不修改现有文档和配置文件。
- 风险：分支保护或 Actions 写权限可能阻止机器人提交；并发人工 push 可能导致普通推送失败，不能强制覆盖。

## 执行步骤

- [x] 编写实际 Git 仓库中的生成器测试，确认缺少生成器时 6 项测试失败。
- [x] 实现生成器与 workflow；6 项测试覆盖层级、特殊字符、未跟踪文件、增删和重复生成。
- [x] 对实际仓库生成索引，35 个文件链接及目录层级全部正确；重复生成字节一致，workflow 语法检查通过。
- [ ] 更新记录，只提交本任务文件，普通推送至既有 `origin/main`；记录实际提交哈希。
