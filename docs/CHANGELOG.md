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
  - 未执行视觉验证；仓库未启用 GitHub Pages，本任务不包含部署。

- **涉及文件**：
  - `.github/workflows/update-index.yml`
  - `scripts/generate_index.py`
  - `tests/test_generate_index.py`
  - `index.html`
  - `.gitignore`
  - `memory/agents.md`、`memory/plan.md`、`memory/progress.md`、`memory/verify.md`、`memory/gotchas.md`
  - `docs/CHANGELOG.md`

- **Git 提交**：待提交；完成普通推送后补记实际提交哈希。

---
