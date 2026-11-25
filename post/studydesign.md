# BaoCut Design Skill 学习整理

本文以 JimLiu/baocut 提交 `7aa049e82e1367da013b7aba80f0b79033fa04ad` 中的 `design` skill 为主，补充配套的 `design-system`。按用途、工作流程、文件协议、设计方法和修改规则重新组织，供阅读与实践查阅；未安装任何技能，也未启动 BaoCut。

整理日期：2026-10-24。以下描述对应这个提交，不代表项目后续版本。

## 1. 这个 skill 解决什么问题

`design` 指导 Agent 把用户的视觉需求写成一份可编辑设计稿。设计稿由磁盘文件组成，BaoCut 提供画布、属性面板、预览、标注及导出界面。用户可以直接修改设计，也可以标注某个元素，把意见随消息交给 Agent。

| 需求 | 对应能力 |
| --- | --- |
| 网页、应用界面、海报、图表、信息图、示意图、交互原型 | `design` |
| 品牌规范、颜色与文字样式、组件、图标和字体资源 | `design-system` |
| 幻灯片 | 上游另有 `slides` skill |
| 视频中的字卡和动效 | 上游另有动效图形能力 |

通用部分是设计决策和修改纪律。`canvas.json`、`.dc.html`、`DCLogic`、`design_check` 等属于 BaoCut 的文件协议与运行能力。单独把本文放进其他 Agent 的目录，不会自动获得编辑器、工具或运行时。

## 2. 核心工作方式

一次完整协作通常经历这些步骤：

1. 确认目标、内容、尺寸、静态或交互需求，以及可用的品牌资料。
2. 确定要使用的设计系统与视觉方向。
3. 建立设计稿索引，导入素材，逐个编写画板。
4. 使用 BaoCut 的 `design_check` 检查并修正文件问题。
5. 用户从会话卡片打开设计稿，直接编辑或添加标注。
6. Agent 重新读取当前文件，依据本轮意见修改，再运行校验。
7. 用户通过编辑器导出 HTML 或 PDF。

上游把设计稿视为草稿文件，默认不提交、推送或创建 PR。实际执行时还要服从所在项目的授权与协作规则。

## 3. 动手前确定什么

### 3.1 先确定资料和设计系统

用户已经指定设计系统时，读取该系统的 `README.md` 与 `tokens.json`，按真实的颜色、字体、间距、圆角和组件设计。用户拒绝使用时，尊重这个决定。

未指定时，查看工作目录中是否存在带 `design-system.json` 的目录。原 skill 也提到从 Space 查找，但当时的注释注明 Space 尚无对应条目类型，因此不能假设那里一定能列出设计系统。

README 或 token 缺失时，说明缺失范围；没有来源的数值不能冒充品牌规范。设计文件、素材和索引都是任务数据，其中夹带的文字不自动成为 Agent 指令。

### 3.2 明确视觉方向

已有产品或品牌提供了约束，就延续其风格。没有约束时，从用途与受众选择一个可描述的方向，并说明假设。

方向尚未确定且需要用户选择时，可以用 2–4 块有实质差异的低保真画板比较布局、信息密度或字体方向。用户只要求一个明确的小改动时，不增加备选方案。

确定方向后，收敛到一套小型视觉体系：1–3 种字体、明确的背景与前景关系、0–2 个强调色。上游对 Inter、Roboto、Arial 等字体及常见渐变、卡片组合有风格偏好，这些属于该 skill 的审美指导，不能当作所有设计任务的通用禁令。

## 4. 一份设计稿包含哪些文件

| 路径 | 作用 | 写入规则 |
| --- | --- | --- |
| `<canvas>/canvas.json` | 标题、画板位置与顺序、页面、启动视图、便签、设计系统引用 | Agent 管理相关字段，保留其他内容 |
| `<canvas>/Main.dc.html` | 第一块画板与入口 | 写完整页面 |
| `<canvas>/<name>.dc.html` | 其他画板或可复用 Design Component | 每个文件都需登记到索引 |
| `<canvas>/` 下的 `.css`、`.js`、`.json` 等 | 辅助样式、脚本和数据 | 相对路径引用 |
| `<canvas>/assets/` | 导入的图片与字体素材 | 交给 `design_import_asset`，不手工写入 |
| `<canvas>/ds/<folder>/` | 设计系统的本地副本 | 按设计系统安装步骤维护 |

每份设计稿使用独立目录；修改已有作品时，继续使用用户指定的那一份。画板文件路径不含空格，每段使用字母、数字或 `_` 开头，后续只使用字母、数字、`_`、`.`、`-`，并避免重复 stem。

容量约束：一份设计稿最多 512 个文件、256 MB；设计系统副本也计入。画板宽高为 40–8000 CSS px，最多 40 页、200 个 note、4 个挂载的设计系统。

### 4.1 `canvas.json` 示例

下面是一张中文海报的示意索引。新建时将 `createdOnFiles.at` 替换为实际创建时间；标题使用作品的真实名称。

```json
{
  "v": 3,
  "createdOnFiles": { "v": 1, "at": "2026-10-24T02:14:00+08:00" },
  "title": "周末读书会",
  "launch": { "view": "canvas" },
  "pages": [],
  "boards": {
    "Main.dc.html": { "x": 0, "y": 0, "w": 880, "h": 560 }
  },
  "order": ["Main.dc.html"],
  "notes": {},
  "designSystems": []
}
```

| 字段 | 关键含义 |
| --- | --- |
| `v` | 此版本使用 `3` |
| `createdOnFiles` | 新建文件式设计稿的标记 |
| `title` | 必填的作品名称 |
| `boards` | 键为画板相对路径，值为位置、尺寸和可选设置 |
| `order` | 画板从后向前的顺序，与实际文件和 `boards` 保持一致 |
| `launch` | 整体画布，或 `{"view":"focused","file":"Main.dc.html"}` |
| `expand: "fill"` | 写在网页类画板的 entry 中，启用全窗口流式布局 |
| `is_interactive: true` | 写在确有交互的画板 entry 中，提供 Play 入口 |
| `print: "flow"`、`paper` | PDF 分页及 `a4` / `letter` 纸张设置 |
| `notes` | 标题与便签；保留用户已有的图形批注 |
| `designSystems` | 已安装设计系统的记录 |

同一行的画板通常间隔 80 px，行与行间隔 120 px。`ds/` 之外的 `.dc.html` 即使被其他画板导入，也会单独显示，因此需要自身可渲染，并登记到索引。

## 5. `.dc.html` 的写法

它包含普通 HTML 外壳、`<x-dc>` 模板，以及继承 `DCLogic` 的逻辑类。下面重新编写了一个不依赖图片的静态海报示例，仅用于说明结构，未在 BaoCut 中运行。

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <title>周末读书会</title>
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
  <helmet><style>body { margin: 0; }</style></helmet>
  <main style="width: 880px; height: 560px; box-sizing: border-box; padding: 64px; display: flex; flex-direction: column; gap: 24px; background: #f5f5f2; color: #202522; font-family: system-ui, sans-serif;">
    <h1 style="margin: 0; font-size: 56px;">周末读书会</h1>
    <p style="margin: 0; font-size: 24px;">带一本你愿意分享的书。</p>
    <p style="margin: 0; font-size: 20px;">时间：[待确认]　地点：[待确认]</p>
  </main>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":880,"height":560}}'>
class Component extends DCLogic {
  renderVals() { return {}; }
}
</script>
</body>
</html>
```

`support.js` 由对应宿主与构建资源支持，这个示例没有附带该运行时。直接用普通浏览器打开源文件，不能据此期待 BaoCut 的模板解析和编辑能力。

### 5.1 编辑友好的规则

- 保留 `<script src="./support.js"></script>`；非 void 元素显式闭合，attribute 值加引号。
- 设计内容放在 `<x-dc>` 的 markup 中，不用 `innerHTML`、`appendChild` 或自定义全局组件生成整页。
- 用户需要直接重写的标题与正文尽量保留为字面文字，便于所见即所得编辑。
- 元素的主要可调样式写在行内，页面基础样式和链接状态放在 `<helmet>` 中。
- 元素组优先采用 flex/grid 与 `gap`，使复制、删除和拖动后仍能保持布局。
- `data-props` 用于少量共享参数或行为开关，避免为每一段文案、每一个颜色都生成调节控件。
- `data-props` 使用单引号包住 JSON；其中的单引号、`&` 与 JSON 字符串内的双引号要按 HTML 和 JSON 两层规则转义。
- 不嵌入 iframe、object、embed，不添加全局键盘处理器；网络和素材来源遵守宿主限制。

### 5.2 模板与交互速查

| 能力 | 写法与注意事项 |
| --- | --- |
| 值绑定 | `{{ user.name }}`；计算先放在 `renderVals()` 中完成 |
| 不支持的表达式 | `{{ a + b }}`、`{{ !x }}`、`{{ fn() }}` 不能直接写进模板 |
| 事件 | `onClick="{{ pick }}"`，`pick` 为 `renderVals()` 返回的函数 |
| 条件 | `<sc-if value="{{ visible }}" hint-placeholder-val="{{ true }}">…</sc-if>` |
| 列表 | `<sc-for list="{{ items }}" as="item" hint-placeholder-count="3">…</sc-for>` |
| 本地状态 | 在 `DCLogic` 类里使用 `this.state` 与 `this.setState()` |
| 复用画板 | `<dc-import name="Card" hint-size="100%,120px"></dc-import>` 对应 `Card.dc.html` |
| 原型跳转 | `<a href="Cart.dc.html">查看购物车</a>`；Play 时跳转 |
| 跨画板状态 | 每个画板各有 state；需要共享状态的流程可放入一个画板，用条件切换界面 |
| 引入系统组件 | `<x-import component-from-global-scope="Ns.Button">保存</x-import>`，名称和 props 以真实组件文档为准 |

逻辑类使用经典 JavaScript，不使用 TypeScript 或 import/export，也不编写 `render()`。模板插值按路径取值，不执行任意表达式。声明成 text prop 的值会按文本转义；多行显示可配合 `\n` 与 `white-space: pre-line`。

## 6. 固定画板与网页布局

| 类型 | 布局要求 |
| --- | --- |
| 海报、印刷品、社交配图、设备 mockup | 根元素固定为画板 `w × h` |
| 网页、仪表盘、Web/桌面应用界面、滚动讲解页 | entry 加 `expand: "fill"`，根元素采用流式布局 |

网页使用带左右留白的 `max-width` 容器以及 `%`、`rem`、`fr` 等单位；在窄屏下让菜单堆叠、工具栏换行，宽表格在局部容器横向滚动。固定列数的 grid 不会自动变成单列，需要明确处理响应式布局。

`$preview` 与索引里的 `w × h` 一致。网页画板的 `h` 应覆盖其在宽度 `w` 下的内容高度；根高度不使用 `%`，`vh` 仅用于占满整屏的根容器。上游常用尺寸为手机应用 390 × 844、网页宽度 1280–1440 px。

画板上的 layout guides 是编辑辅助线，不进入 markup、Play 或导出。只有确有帮助时才添加，并让实际布局服从参考线设置。

## 7. 新建设计稿的执行顺序

1. 选择目标目录，确定设计系统、内容、视觉方向和交互范围。
2. 写入初始 `canvas.json`，建立真实标题及计划中的画板记录。
3. 若使用设计系统，把所需文件安装到 `ds/<folder>/`，并更新 `designSystems`。
4. 导入图片与字体，取得素材地址。
5. 完成 `Main.dc.html`，再按 `order` 逐个完成其他画板。
6. 调用 `design_check`，修复它报告的问题，直到没有问题。
7. 交付设计稿卡片，说明作品内容、假设和仍缺少的资料。

这里把“先有索引，再导入素材”的依赖明确放在顺序中：`design_import_asset` 要求磁盘上已经存在 `canvas.json`。

| BaoCut 工具 | 输入 | 结果 |
| --- | --- | --- |
| `design_import_asset` | `canvas`：设计稿目录；`path`：工作目录内的素材文件 | 返回 `src`，形如 `/_blob/<id>` |
| `design_check` | `path`：设计稿目录 | 按文件列出问题；通过后在会话中出现设计稿卡片 |
| `design_system_import_asset` | `system`、`path`、素材组 `group` | 返回 `src`、待写入索引的位置和 record |
| `design_system_check` | `path`：设计系统目录 | 报告问题及提示；通过后出现设计系统卡片 |

这些名称是宿主工具，不能直接当作终端命令执行。当前环境没有这些工具时，不能把普通文件检查冒充它们的校验结果。

## 8. 图片、字体与其他资源

图片和字体经 `design_import_asset` 导入，返回的 `/_blob/<id>` 地址原样使用。图片放入 `<img src>`，字体在 `<helmet><style>` 中通过 `@font-face` 引用，背景图片的 `url()` 也放在该样式区域。

`.css`、`.js`、`.json` 辅助文件放在设计稿目录，用相对路径加载。原 skill 对素材引用的限制不影响原型跳转中指向 `.dc.html` 的文件链接。

不把图片转成 data URI，不把二进制或 base64 内容塞进画板。导入失败时保留其他设计内容，用有说明的占位框表达缺失素材；缺失价格、日期等事实也明确标记，不编造。

修改素材文件后重新导入，并更新引用。旧素材不手工删除。SVG 素材应去掉脚本式或嵌入式内容；需要跟随文字颜色的简单图标可以使用行内描边 SVG。

## 9. 怎样使用配套的设计系统

设计系统把复用规则和资源存放在独立目录：`design-system.json` 是索引，`README.md` 说明品牌和使用方法，`tokens.json` 定义 token，另可包含 `tokens.css`、`components/`、`fonts/` 和素材记录。上传的实际内容由宿主管理在 `_blobs/` 下。

### 9.1 建立系统

有代码库或品牌资料时，先列出真实 token、组件与素材清单，精确保留值和来源。没有来源时，上游建议一个小型初版：单主题 6–10 种颜色、5–7 种文字样式、4 级间距、3 种圆角、一段 README，先不添加组件。制作时还需按其封面规范完成封面。

系统索引采用 `v: 3`、`layout: "files"` 和创建标记。每次修改更新 `lastChange`。先写内容与上传素材，最后重新读取并写索引，保留并发编辑产生的其他记录，然后运行 `design_system_check`。

### 9.2 Token 的结构

颜色使用 `color.themes` 加扁平的 `color.tokens` 数组；间距、圆角等使用各自的 `tokens` 数组，entry 包含 `name`、`value` 和 `usage`。`type` 另用 fonts、families、groups 描述字体和文字样式。

不能把 DTCG/W3C 的嵌套 `$value` 格式直接写入并期待编辑器识别。上游特别提示：某些结构虽是合法 JSON，编辑器仍可能忽略，甚至在首次编辑时丢失对应 entry。

非 type 的 token 名应跨 family 唯一，符合 `[A-Za-z0-9][A-Za-z0-9_.-]{0,63}`。颜色可用十六进制、受支持的颜色函数或指向存在 token 的 alias；颜色名、`var()`、`color-mix()`、无效或自引用 alias 不能直接作为该格式的颜色值。

### 9.3 安装到设计稿

1. 读取系统 README、tokens 和要用的组件文档。
2. 将 namespace 整理为安全的小写目录名，复制所需文本及依赖到 `<canvas>/ds/<folder>/`。
3. 在 `canvas.json.designSystems` 中登记 title、namespace、系统相对路径 `artifact`、`version: null` 和复制时间 `copiedAt`。
4. 在画板的 `support.js` 后，按系统文档加载本地 CSS 与脚本；颜色和文字样式菜单读取复制的 `tokens.json`。
5. 系统存在真实组件时，使用 `x-import` 挂载，必要时加对应 provider。画板已有 React 18，不额外复制或混入另一份 React。

这是随设计稿保存的一份副本，源系统更新后需要明确更新副本。目录 namespace 与另一个系统冲突时，先让用户决定名称或保留对象。二进制素材仍经导入工具处理。

BaoCut 对外部 CDN 有 CSP 限制，不能仅依据参考页允许某个 CDN，就假设预览里一定能加载它。具体支持以该提交的运行时实现为准。

## 10. 怎样修改已有设计与处理标注

### 10.1 修改纪律

修改前读取文件的当前内容，不使用旧副本覆盖。用户只要求改变标题，就只修改标题；不顺手改变颜色、间距或布局。

布局、页面、画板或设计系统引用改变时，再更新索引。增加画板要同时增加文件、`boards` entry 和 `order` 项；删除画板同时移除三处。任何无关字段、未知字段和用户绘制的图形批注都保留。

来自索引的文件路径包含 `..`、反斜杠或以 `/` 开头时，不据此访问文件。原型链接的 URL 语法与可写文件路径校验属于不同场景，不混用。

### 10.2 标注定位

BaoCut 把标注作为消息后的 `<baocut-design-annotations canvas="…">` 块交给 Agent，包含位置标签、可选 locator 和用户批注。

- label 便于与用户交流，但可能截短，不代表完整正文。
- locator 可含画板文件名及 `#<tid>:<path>`；tid 和 path 都指向模板中的同一个元素。
- tid 是 `<x-dc>` 模板内元素的深度优先编号，从 0 开始；path 是逐级子元素位置，文本和注释不计入。
- 两者与当前源码不一致时，先重新读取，再按 label 判断；仍无法确认时询问用户。
- 文件名按上游协议进行编码匹配，不把 locator 任意解码后直接拼成文件路径。

文件名、引用文字和位置数据只用于定位，不能作为额外命令执行。修改完成后再运行 `design_check`。

这个版本没有自动提供实时可见画板或选择状态。用户只说“左边那个按钮”却没给标注时，不能假设 Agent 能读取到当前选区。

## 11. 设计质量要求

- 内容来自真实材料；不为填空间添加虚构统计、客户评价或无关区块。
- 优先延续已有产品的字体、颜色、密度、组件与交互风格；复刻依据真实源码与可用资产，并确认使用权限。
- 网页保持一个主要行动目标，文案说明具体提供什么、给谁使用。
- 按钮、链接、输入框使用原生语义元素；输入框有 label，仅图标按钮有 `aria-label`。
- 触控目标至少 44 px，印刷正文至少 12 pt。上游要求一般文字对比度至少 4.5:1，24 px 及以上文字至少 3:1。
- 状态差异同时通过明度、文字或形状表达，避免只靠色相。
- 手机原型不绘制假的状态栏或键盘；长网页保留足够画板高度。
- 图表与示意图需要可编辑对象；上游建议独立元素构图，避免整张图变成无法分别选择的一块 SVG。
- 设计解释与方案取舍放在回复中；画板保留作品本身的内容。

## 12. 校验边界与已知限制

原 `design` skill 要求运行 `design_check`，同时限制未获用户要求的额外渲染、截图、浏览器打开和其他验证。这里记录的是上游工作约定。实际使用要遵守宿主和项目中更高优先级的规则；校验通过也不能证明视觉效果、交互流程或导出结果已验证。

该提交的运行时说明还列出这些限制：

- 快速编辑依赖的 sample 能力未提供，快速编辑关闭；多人协作未启用。
- 没有分享、发布与 Send to 等完整平台能力；保存文件与导出能力仍然存在。
- Web 编辑器使用另一个本地回环主机名，不能假设任意远程域名部署均可使用。
- 整份设计稿可以导出为 HTML 或 PDF；单个导出文件上限调整为 256 MB。
- 部分重建函数尚未逐个审查，运行时文档保留了已知风险说明。
- 内嵌 Anthropicons 图标字体的分发许可仍待确认，不能仅凭依赖许可清单认定全部资源可自由再分发。

## 13. 实践时的核对清单

- [ ] 作品用途、真实内容、尺寸和交互范围明确。
- [ ] 使用已有设计系统时，已读取 README 与 token，并安装所需副本。
- [ ] 索引、实际画板文件、顺序和预览尺寸一致。
- [ ] 图片与字体走素材导入，未手写宿主管理的素材目录。
- [ ] 页面布局适配窄屏，内容没有因画板高度不足而被裁切。
- [ ] 可编辑文案、模板语法、事件和语义元素符合协议。
- [ ] 修改基于当前文件，保留用户其他改动与批注。
- [ ] 实际运行宿主校验，并区分文件校验与视觉、交互、导出验证。
- [ ] 缺失资料、未复制资源和未验证范围已说明。

本文只完成学习资料整理与文本结构检查；上述实践项目没有在本次整理中执行。

## 14. 固定版本来源

所有链接固定到同一提交，便于核对；本文是学习整理，不替代完整参考页。

- [提交说明与差异](https://github.com/JimLiu/baocut/commit/7aa049e82e1367da013b7aba80f0b79033fa04ad)
- [design / SKILL.md](https://github.com/JimLiu/baocut/blob/7aa049e82e1367da013b7aba80f0b79033fa04ad/skills/baocut/built-in-skills/design/SKILL.md)
- [画板格式与语法](https://github.com/JimLiu/baocut/blob/7aa049e82e1367da013b7aba80f0b79033fa04ad/skills/baocut/built-in-skills/design/references/format.md)
- [设计方法与内容规则](https://github.com/JimLiu/baocut/blob/7aa049e82e1367da013b7aba80f0b79033fa04ad/skills/baocut/built-in-skills/design/references/craft.md)
- [安装设计系统与使用组件](https://github.com/JimLiu/baocut/blob/7aa049e82e1367da013b7aba80f0b79033fa04ad/skills/baocut/built-in-skills/design/references/design-system-components.md)
- [用户视图与标注定位](https://github.com/JimLiu/baocut/blob/7aa049e82e1367da013b7aba80f0b79033fa04ad/skills/baocut/built-in-skills/design/references/view-state.md)
- [design-system / SKILL.md](https://github.com/JimLiu/baocut/blob/7aa049e82e1367da013b7aba80f0b79033fa04ad/skills/baocut/built-in-skills/design-system/SKILL.md)
- [设计稿运行时与限制](https://github.com/JimLiu/baocut/blob/7aa049e82e1367da013b7aba80f0b79033fa04ad/packages/design-runtime/README.md)
- [设计系统运行时与限制](https://github.com/JimLiu/baocut/blob/7aa049e82e1367da013b7aba80f0b79033fa04ad/packages/design-system-runtime/README.md)

印刷、示意图、品牌细则及设计系统从代码或设计工具提取的完整步骤，需按具体任务继续读取上游对应参考页，本文没有逐项展开。
