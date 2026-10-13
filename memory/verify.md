# 文件目录索引验证标准

- `python3 -m unittest discover -s tests -v`：真实 Git 测试仓库覆盖根目录、嵌套目录、隐藏文件、中文和特殊字符路径、安全转义、未跟踪文件排除、文件增删、重复生成不变以及空仓库。
- `python3 scripts/generate_index.py`：在当前仓库实际生成 `index.html`；HTML 解析后的链接逐一对应全部跟踪文件，目录层级正确。
- 连续生成两次，文件字节完全一致，避免无内容变化的机器人提交。
- 解析 workflow YAML 并检查触发器、写权限和执行命令；运行可用的 workflow 检查工具。
- `git diff --check`、提交内容审查、普通 `git push` 退出码、远端提交核对。
- 不执行视觉验证，不启用或部署 GitHub Pages；云端运行结果以实际可读取状态为准。

## 已执行检查

- 6 项生成器测试：先因缺少生成器失败，随后全部通过。
- `actionlint 1.7.12 .github/workflows/update-index.yml`：退出码 0。
- 已核实 `actions/checkout@v7` 标签实际存在。
- 实际仓库 `index.html`：35 个链接完整对应全部跟踪文件，目标文件存在且目录层级正确；连续生成字节完全一致。
- `git diff --check` 和提交内容检查通过；提交 `c801750` 普通推送成功，`origin/main` 的提交哈希与本地一致。
- 云端运行 [38422278765](https://github.com/OyamaMeek/Document/actions/runs/38422278765) 已由此次 push 触发并完成，结论为 `success`；测试、生成及索引提交检查步骤均成功。
