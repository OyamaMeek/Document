# Vibe 知识大赏公开样本调研

调研日期为 2026 年 11 月 11 日。以抖音公开活动和投稿页为主，参照 B 站公开视频索引，按主题词、口语标题、机制词和活动标签查询。搜索结果用于识别同题与相邻作品。使用量、行业规模、相邻作品反馈分别代表不同强度的需求信号。平台公开索引覆盖有限，热度判断属于选题预测。

抖音在 10 月 27 日的公告中公布 9 万人参与、4 万个知识点和 19 亿次流动，投稿截止 11 月 30 日。投稿须带 `#vibe知识大赏`，热点科普可带 `#vibe热点新知计划`。上述数字沿用活动自身口径。已看到相对论、圆周率、傅里叶与区块链原理等同标签作品。一位傅里叶视频观众留言，先了解过才容易看懂，可作为面向零基础设计开场的依据之一。[抖音活动公告](https://www.douyin.com/video/7701282040913661211) · [相对论作品](https://www.douyin.com/video/7698508437046480171) · [圆周率作品](https://www.douyin.com/video/7699290944901795114) · [傅里叶作品与留言](https://www.douyin.com/video/7693324562347363599) · [区块链作品](https://www.douyin.com/video/7691803902543785978)

## 推荐选题

| 顺序 | 可直接用的标题 | 需求与已见供给 | Opus 5.5 可以写出的核心画面 |
| --- | --- | --- | --- |
| 1 | **手机没网，地铁闸机凭什么放你进去？** | 腾讯称乘车码已覆盖 170 多个城市，青岛地铁已有离线码用法说明。搜索命中服务说明、专利、产品文章，公开样本未检到同角度的高互动 Vibe 动画。 | 三栏并排呈现手机、闸机和服务端。手机飞行模式，示例票在闸机本地通过验签。时间戳过期或票面被篡改时变红。最后联网同步交易记录。让示例程序真实签名和验签，动画直接读结果。 |
| 2 | **快递离我两公里，为什么又往反方向跑？** | 适逢双十一。国家邮政局公布 2025 年双十一期间全国快递业务量累计 139.38 亿件。公开索引可见临沂绕道报道和分拣探访。较少看到用同一批包裹比较直送与分拨的同题作品。 | 从物流轨迹的逆向跳转进入六个网点。跑同一组包裹的两种网络，画面同步统计线路数、车辆利用率、单个包裹到达时间。六个端点的全连通需要 15 条无向线路，经一个额外中心只需 6 条，标注简化模型。 |
| 3 | **我在 8 楼，为什么 7 楼的电梯不来，1 楼的先来了？** | B 站有电梯群控课程与仿真，网上有电梯调度交互文章。抖音的电梯按钮内容可见观众讨论运行方向，同标签有电梯关门键的 3D 作品。可主打用倒计时跑出同一栋楼两种决策的差异。 | 两部电梯同时开跑，7 楼电梯继续下行并处理已登记请求，1 楼电梯直达。并排展示按当前楼层距离与按预计到达时间得到的两种结果。 |
| 4 | **开了两倍速，主播怎么没变成松鼠声？** | 抖音和 B 站索引主要命中剪辑设置教程。抖音同问题教程可见四项页面互动计数 1819、36、1497、214，快照缺少各项名称，适合作为相邻内容有互动的信号。 | 原声、直接快放、保留音高的快放连续试听。纯音示范用 440 Hz，直接快放主频到 880 Hz。放大局部波形演示重叠拼接，再给实际语音试听。这个选题需要声音才能发挥最大效果。 |
| 5 | **进隧道没有 GPS，导航凭什么还能走？** | 高德发布过手机隧道导航功能，B 站有北斗案例和导航对比，荣耀论坛可见网约车司机直接反馈进隧道后定位漂移。公开样本未检到以三条轨迹解释误差的同题 Vibe 视频。 | GPS 数据在洞口中断，保留最后一帧已知位置。用相同路线同步画真实轨迹、只靠惯性估计的轨迹、地图约束后的估计。岔路处展示即使吸附到路网也可能选错，出隧道后重新校准。 |
| 6 | **给我一张打印纸，45 秒读出它的打印时间** | B 站差评君已有打印机黄点科普，查询时公开接口返回 549,808 次播放、24,962 次点赞。已有直接竞争，数据支持公众对题材的兴趣。可做现场解码实验。 | 用 EFF 示例从白纸放大到 15×8 网格，再根据公开布局读出日期、时间和设备序列号，保留字段校验。标题或正文交代涉及特定彩色激光机型。 |
| 7 | **同一份简历，你看到两栏，系统读到什么？** | 中文检索出现求职文章、简历课程及 HR 用 AI 筛选的内容。Greenhouse 把多栏等版式列为可能解析失败的原因，Bullhorn 已公布针对多栏改进。可切入求职人群的具体问题，暂无同角度的可比播放数据。 | 现场生成同内容的双栏、单栏及图片 PDF。跑开源解析器，以光标动画显示真实文本抽取顺序。给出具体样例输出和工具名称。只说明测试中的解析行为，系统的招聘判断要另有证据。 |

## 题材事实与来源

- **乘车码。** 腾讯产品页公布覆盖范围与先乘后付。微信支付方案公开双离线的行业方案。青岛地铁公告给出恢复网络后延迟扣费的明确实例。腾讯专利描述手机与闸机离线验签的一种可行设计。视频应把实际代码验证标为原理示范，将专利与具体线路当前部署区分开。[腾讯乘车码](https://www.tencent.net.cn/zh-cn/products/transit-qr-code/) · [微信支付地铁解决方案](https://pay.wechatpay.cn/static/solution/solution_detail_subway.shtml) · [青岛地铁公告](https://www.qd-metro.com/news/view.php?id=6500) · [腾讯专利](https://patents.google.com/patent/CN106846506A/zh)
- **快递分拨。** 顺丰科技明确说明陆运网络会结合场地、线路、运力和产能共同规划。模型中可以用一个低流量的节点对演示为什么绕行也有可能更早到达，例如枢纽班次更密。此处应明确这是参数条件下的结果。单个真实包裹的具体路线原因须以承运方信息为准。[国家邮政局 2025 年双十一统计](https://www.spb.gov.cn/gjyzj/2022wjmtbdbp/202511/91d0362c088b400c867b18fcde260aba.shtml) · [顺丰网络规划](https://www.sf-tech.com.cn/tech/?type=%E5%A4%A7%E6%95%B0%E6%8D%AE) · [临沂绕道报道](https://m.thepaper.cn/newsDetail_forward_32431141)
- **电梯调度。** 三菱研究团队给出群控计算期望等候时间的算法。东芝的产品可以提前利用乘客目的楼层，现代电梯官方也描述了按预计最早到达来分配轿厢。先按单个乘客的预计到达时间构造示例，若加入其他乘客则应明确调度目标。[三菱研究](https://www.merl.com/publications/TR2004-148) · [东芝群控产品](https://www.toshiba-elevator.co.jp/elv/infoeng/products/floornavi/index.html) · [现代电梯群控](https://www.hyundaielevator.co.kr/en/technology/environment/ai-management-system) · [相邻互动文章](https://actpi.com/articles/2026/elevator-algorithm.html)
- **隧道导航。** 华为支持文档列出其隧道车道级导航的实现和条件。高德的功能发布和 B 站的北斗案例属于相邻作品。脚本应区分卫星信号受遮挡、移动网络状态、手机传感器融合和部分隧道里的地面定位设施。[华为支持](https://consumer.huawei.com/cn/support/content/zh-cn16053683/) · [高德抖音](https://www.douyin.com/video/7218055384680992059) · [B 站北斗案例](https://www.bilibili.com/video/BV1eLW2zwEmU/) · [荣耀论坛反馈](https://club.honor.com/cn/opinion_thread-list.html?filter=dateline&page=18&type=11)
- **倍速音频。** HTML 媒体元素可以按设置补偿播放速率改变造成的音高变化。mpv 的公开文档描述其 WSOLA 实现。脚本可展示该算法的原理，平台使用的具体算法取决于播放器。[MDN preservesPitch](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/preservesPitch) · [mpv 音频过滤文档](https://github.com/mpv-player/mpv/blob/master/DOCS/man/af.rst) · [抖音相邻教程](https://www.douyin.com/video/7381784237994724634)
- **简历抽取。** PyMuPDF 默认文本抽取顺序取决于文档的原始顺序，提供重新排序选项。Greenhouse 与 Bullhorn 的文档说明不同产品对版式的支持会变化。[PyMuPDF 文档](https://pymupdf.readthedocs.io/en/latest/app1.html) · [Greenhouse 解析失败说明](https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse) · [Bullhorn 更新说明](https://kb.bullhorn.com/ats/Content/BHATS/Topics/parsingUpdates.htm) · [抖音相邻作品](https://www.douyin.com/video/7666753111147400186)
- **打印黄点。** EFF 自行收集样本并研究了 DocuColor 彩色输出中的黄色点阵，发布了说明和示例。[EFF 原始解码指南](https://w2.eff.org/Privacy/printers/docucolor/) · [差评君同题作品](https://www.bilibili.com/video/BV1SL4y137rc/) · [B 站公开接口](https://api.bilibili.com/x/web-interface/view?bvid=BV1SL4y137rc)

## 同题核查

- 公交串车已有近期抖音同题，索引也关联到毕导的既有作品。[抖音同题](https://www.douyin.com/video/7693087889256680723)
- 电梯关门键已有同标签 3D 作品。可以用“为什么系统派来更远的那部？”这道题切入。三菱官方群控资料可支持对位置、载荷与运行效率的示例设计。[关门键同话题](https://www.douyin.com/video/7698375295766605923) · [B 站群控仿真](https://www.bilibili.com/video/BV1uC4y1p7Fs/) · [三菱群控产品说明](https://www.mitsubishielevator.co.th/2018/assets/ebook/modern_elemotion.pdf)
- 外卖派单已有美团的一手图文和 B 站长课。适合用晚出餐、骑手已接多单或不可穿越的隔离栏解释“更近”和“更顺路”的差异。现有公开资料足以支持简化模型，真实分配决策须以平台公布的规则为准。[美团派单说明](https://www.meituan.com/news/NN25011005301105X) · [美团 2026 年算法机制说明](https://www.meituan.com/news/NN260508192002553) · [B 站相邻长课](https://www.bilibili.com/video/BV1yL411g7BM/)

## 首发建议

《手机没网，地铁闸机凭什么放你进去？》适合先做成 45 秒的竖屏视频。第一句可以用「手机已经开了飞行模式。闸机扫一下，门却开了。它凭什么信你？」

开场用手机飞行模式和闸机亮灯建立问题。接着切到手机、闸机和后台的三栏画面，展示用演示密钥签发的示例票在本地通过验证。随后分别篡改票面和推进到过期时刻，用程序输出区分签名校验失败和有效期校验失败。最后画出记录同步与后续扣费。示例使用自制票据格式。 [深圳交通运输局离线乘车说明](https://jtys.sz.gov.cn/zwgk/ztzl/ggqsydw/jt/szt/ywxx/cjwt/content/post_12827741.html) · [微信支付双离线方案](https://pay.wechatpay.cn/static/solution/solution_detail_subway.shtml)

可用 Claude Opus 5.5 写验证和动画代码，用 HyperFrames 把页面动画渲染成视频。赶双十一时也可先发快递分拨，画面保留仿真的班次和线路参数。[Anthropic 模型公告](https://www.anthropic.com/claude-opus-5-5) · [HyperFrames 源码与用法](https://github.com/heygen-com/hyperframes)

平台公开页有空正文和 412 响应的情况，排重基于可见公开索引，未取得完整站内榜单和推荐流数据。
