# 开发记录

## [2026-10-13 23:25] 每次 push 自动生成文件目录索引

- **需求/问题描述**：
  > 创建 GitHub Actions，在每次 push 时将各文件夹中的全部文件生成结构树，写入 index.html，方便点击跳转。

- **实际实现的功能与改动**：
  - 使用 Python 标准库生成所有 Git 跟踪文件的目录树，保留目录层级、隐藏文件和根目录文件，目录可展开，文件使用可点击相对链接。
  - 对文件名做 HTML 转义、对链接做 URL 编码，支持中文、空格和特殊字符；输出保持稳定。
  - Actions 在全部分支 push 后运行测试、生成索引，仅有变化时自动提交和普通推送 `index.html`，同一分支串行运行。
  - 测试：先运行缺少生成器时的失败测试，实现后 6 项集成测试全部通过；`actionlint 1.7.12` 检查通过。
  - 实际仓库验证：35 个跟踪文件均有正确链接和目录层级，连续生成的页面字节完全一致。
  - 云端验证：[Actions 运行 38422278765](https://github.com/OyamaMeek/Document/actions/runs/38422278765) 完成且结论为 `success`，各步骤均成功。
  - 未执行视觉验证；仓库未启用 GitHub Pages，本任务不包含部署。

- **涉及文件**：
  - `.github/workflows/update-index.yml`
  - `scripts/generate_index.py`
  - `tests/test_generate_index.py`
  - `index.html`
  - `.gitignore`
  - `memory/agents.md`、`memory/plan.md`、`memory/progress.md`、`memory/verify.md`、`memory/gotchas.md`
  - `docs/CHANGELOG.md`

- **Git 提交**：`c801750 feat: generate clickable file index on push`，已普通推送至 `origin/main`，远端提交哈希已核对；本次哈希补记通过后续文档提交保存。

---

## [2026-10-13 23:49] Apple 风格的网盘文件浏览界面

- **需求/问题描述**：
  > 使用 apple-design 优化 index.html，显示效果像网盘，并保证以后每次 push 自动生成的页面保持相同效果。

- **实际实现的功能与改动**：
  - 新增独立 HTML 模板，采用系统字体、浅灰背景、半透明侧栏、蓝色文件夹和分类文件图标，显示文件名称、类型与真实大小。
  - 支持侧栏目录导航、嵌套目录、面包屑、返回上级、浏览器前进后退、全局即时搜索、清除搜索、键盘操作、目录深链接和无结果提示。
  - 保留安全转义、URL 编码及全部 Git 跟踪文件；无 JavaScript 时仍可展开文件树并直接打开文件。
  - 模板内置移动端、深色模式和辅助功能偏好样式；生成器读取此模板，现有 Actions 每次 push 自动使用新界面。
  - 验证：新增 3 项测试先失败，实现后全部 9 项 Python 测试通过；36 个实际文件的链接、层级与大小正确，连续生成字节一致；JavaScript 语法、actionlint 和 git diff 检查通过。
  - 真实浏览器：9 组目录、搜索、键盘、刷新和文件跳转检查通过，未执行截图或视觉验证。
  - 云端：[Actions 运行 38425449859](https://github.com/OyamaMeek/Document/actions/runs/38425449859) 完成且结论为 `success`，已实际使用新模板生成页面。

- **涉及文件**：
  - `scripts/index.template.html`、`scripts/generate_index.py`
  - `tests/test_generate_index.py`、`index.html`
  - `memory/agents.md`、`memory/plan.md`、`memory/progress.md`、`memory/verify.md`
  - `docs/CHANGELOG.md`

- **Git 提交**：`af91061 feat: add Apple-style file browser to generated index`，已普通推送至 `origin/main`，远端哈希一致；哈希补记通过后续文档提交保存。

---

## [2026-10-14 00:09] root 文件夹与右键复制直链

- **需求/问题描述**：
  > 增加 root 文件夹显示根目录文件，每个文件右键支持复制直链，后续 push 自动生成的页面也保持这些功能。

- **实际实现的功能与改动**：
  - 新增虚拟 root 文件夹和侧栏入口，集中展示 13 个根目录文件；实际文件路径保持不变，支持面包屑、返回上级和刷新恢复。
  - 全部文件继续参与搜索，原有目录导航保持可用；独立 `#view=root` 避免与真实 root 目录冲突。
  - 根据 GitHub origin 和当前分支，为全部文件生成编码后的原始文件直链，支持 HTTPS 与 SSH origin。
  - 文件右键提供复制直链，支持 Shift+F10、Escape、焦点恢复和成功提示；自动复制失败时显示可手动复制的链接。
  - 修改生成器与源模板，现有 Actions 每次 push 自动使用这些功能。
  - 验证：新增 3 项测试先失败，实现后全部 12 项 Python 测试通过；36 个实际文件的链接、层级、大小和重复生成正确，JavaScript 语法与 actionlint 通过。
  - 真实浏览器：7 组主要交互检查通过，包含实际右键复制与系统剪贴板粘贴核对，未截图。
  - 受限复制场景发现长链接选中时输入框滚动关闭菜单，已修正；浏览器测试空间由用户接管，此修正尚未复测。

- **涉及文件**：
  - `scripts/generate_index.py`、`scripts/index.template.html`、`tests/test_generate_index.py`、`index.html`
  - `memory/plan.md`、`memory/progress.md`、`memory/verify.md`、`docs/CHANGELOG.md`

- **Git 提交**：待提交。

---
