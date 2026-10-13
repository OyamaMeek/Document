# 网盘式索引验证标准

- `python3 -m unittest discover -s tests -v`：保留层级、特殊字符、安全转义、未跟踪文件排除、增删、排序、空仓库与重复生成测试；新增类型、真实字节数、自身索引大小稳定性和可访问控件验证。
- 实际仓库：每个文件链接对应一个跟踪文件且目标存在；连续生成字节一致。
- JavaScript 语法检查；真实浏览器 DOM 验证根目录、嵌套导航、面包屑、返回上级、全局搜索、无结果状态、文件链接和键盘操作。
- `actionlint`、`git diff --check`、提交内容检查、普通推送与远端提交核对；检查云端 Actions 状态。
- 不截图，不执行视觉检查，不启用 Pages；浏览器交互检查不作为视觉验证证据。

## 已执行检查

- 新增 3 项测试先失败；完成实现后完整 9 项测试通过。
- `.agent/validation/check_drive.py`：36 个真实文件的链接、层级和大小均正确，重复生成字节一致，`node --check` 检查生成页面内 JavaScript 通过。
- ego-browser 实际验证 9 组行为：根目录和大小、嵌套目录与面包屑、浏览器前进后退、返回上级、全局搜索、无结果与清除、键盘和侧栏、深链接与刷新及实际跳转、无效目录与返回路径。
- `actionlint .github/workflows/update-index.yml` 及 `git diff --check` 均通过。
- 提交 `af91061` 普通推送成功，远端哈希一致；[云端运行 38425449859](https://github.com/OyamaMeek/Document/actions/runs/38425449859) 完成，结论为 `success`，新模板已由 Actions 实际生成。
