# root 与直链验证标准

- 保留原有 9 项 Python 集成测试，新增 root 与复制控件、编码直链和当前分支选择；先失败后通过。
- 实际文件保持相对链接、层级和大小，直链指向当前仓库与分支；连续生成字节一致。
- 真实浏览器检查 root 仅包含根目录文件、导航、刷新、搜索、右键与键盘菜单、实际剪贴板写入、退出和焦点恢复；复制受限时提供手动复制入口。
- JavaScript 语法、actionlint、git diff --check；提交内容检查、普通推送与云端运行核对。
- 不执行截图或视觉检查，不启用 Pages。

## 当前任务已执行检查

- 新增 3 项先失败，实现后全部 12 项 Python 集成测试通过。
- 实际仓库 36 个文件的相对链接、直链、层级、大小及稳定生成正确，JavaScript 语法、actionlint 和 git diff --check 通过。
- 8 组真实浏览器行为检查通过，包含真实鼠标右键、Clipboard API 写入及系统剪贴板粘贴核对；记录为 `.agent/validation/root-links-browser-result.json`。
- 手动链接输入框滚动关闭菜单的问题已修正；实际 HTTP Permissions-Policy 限制下，自动复制拒绝提示、链接选中及手动复制粘贴复测通过。测试空间已关闭。
- 提交 `66b7f98` 已普通推送，远端哈希一致；[Actions 运行 38428277978](https://github.com/OyamaMeek/Document/actions/runs/38428277978) 完成且结论为 `success`。

# 已完成：网盘式索引验证标准

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
