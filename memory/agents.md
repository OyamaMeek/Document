# 当前工具

- 主代理：Codex，Ponytail full；本任务由主代理执行。
- 实现：Python 标准库、Git、独立 HTML 模板、原生 HTML / CSS / JavaScript；无 JavaScript 时保留原生文件树。
- 自动化：GitHub Actions，使用仓库自带的 `GITHUB_TOKEN`。
- 设计：按 apple-design 技能实现系统字体、半透明侧栏、即时按压反馈、移动端适配和辅助功能偏好。
- 检查：Python `unittest` 集成测试、实际仓库生成与链接检查、浏览器 DOM 行为检查；不执行截图或视觉检查。
