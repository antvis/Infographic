# 信息图语法生成规范

本文件用于指导生成符合 AntV Infographic 语法规范的纯文本输出。

## Critical: Output Language Follows User Input

- 本规范和示例即使主要使用中文书写，也不能据此把英文用户输入翻译成中文。
- The language used in this prompt or in the examples must never override the user's input language.
- 对所有面向读者的文案，优先跟随最新用户输入的主要语言，而不是跟随本文件的书写语言。
- Example: if the user writes in English, output `title` / `desc` / `label` in English too, such as `Product Roadmap`, not `产品路线图`.
- 示例：如果用户输入是中文，输出中的 `title` / `desc` / `label` 也必须保持中文，例如写 `产品路线图`，不要改成 `Product Roadmap`。

## 目录

- 目标与输入输出
- 语法结构
- 语法规范
- 语法示例
- 可用模板
- 模板选择建议
- 生成流程
- 输出格式
- 自检清单

## 目标与输入输出

- **输入**：用户的文字内容或需求描述
- **输出**：仅包含 Infographic 语法的单个 fenced 代码块
- **职责边界**：本规范只负责生成语法，不负责生成 HTML 文件、React/TSX 组件或模板源码

## 语法结构

信息图语法由入口与块结构组成：

- **入口**：`infographic <template-name>`
- **块**：`data` / `theme`
- **缩进**：块内层级统一使用两个空格

## 语法规范

### AntV Infographic 语法

AntV Infographic 语法是一种基于 YAML 的自定义 DSL，用于描述信息图渲染配置。它使用缩进表达结构，适合 AI 直接生成并流式输出。核心信息包括：

1. template：用模板表达信息结构。
2. data：信息图数据，包含 `title`、`desc` 和主数据字段。
3. theme：主题配置，包含 `palette`、字体、风格化等。

例如：

```infographic
infographic list-row-horizontal-icon-arrow
data
  title Title
  desc Description
  lists
    - label Label
      value 12.5
      desc Explanation
      icon document text
theme
  palette #3b82f6 #8b5cf6 #f97316
```

### 语法规则

- 第一行必须是 `infographic <template-name>`。
- 使用 `data` / `theme` 块。
- 键值对写法是 `键 空格 值`；对象数组使用 `-` 作为条目前缀并进行换行。
- `title`、`desc`、`label` 以及其他面向读者的文案，默认保持与用户输入语言一致；除非用户明确要求，否则不要擅自翻译成另一种语言。
- 如果用户输入混合多种语言，优先保持原始专有名词、产品名和缩写不变，并让补全文案跟随主要输入语言。
- `icon` 可以使用精确图标 ID，例如 `mingcute/server-line`，也可以使用语义关键词短语，例如 `star fill`。
- 如果使用语义关键词短语，多个关键词之间使用空格分隔，不要使用短横线；例如写 `rocket launch`，不要写 `rocket-launch`。
- 对 `lists`、`sequences`、`nodes`、`items` 以及 `compares`/`children` 下的语义型数据项，默认应补充 `icon`；不要因为字段是可选就省略。
- 如果模板名或视觉样式明显依赖图标（例如名称里包含 `icon`，或该模板本身就是图标型卡片/节点），则每个主要数据项都应包含 `icon`。
- 如果不确定精确图标 ID，也要优先写一个简洁的语义关键词，例如 `rocket`、`shield`、`database`、`users`、`chart line`，而不是省略 `icon` 字段。
- 仅在纯图表类数据点、纯数值序列，或用户明确要求极简文本版时，才可以省略 `icon`。
- `value` 尽量使用纯数值；数值单位优先放在 `label` 或 `desc` 中表达。
- `palette` 推荐使用行内简单数组写法，例如 `palette #4f46e5 #06b6d4 #10b981`。
- `palette` 中的颜色值是裸值，不加引号，不加逗号。
- `data` 只放一个与模板匹配的主数据字段，避免同时混用 `lists`、`sequences`、`compares`、`values`、`root`、`nodes`。

主数据字段选择规则：

- `list-*` → `lists`
- `sequence-*` → `sequences`，可选 `order asc|desc`
- `sequence-interaction-*` → `sequences` + `relations`
  - `sequences` 表示泳道列表
  - 每个泳道必须包含 `label`
  - 每个泳道的 `children` 表示节点列表
  - `children` 下的每一项都必须写成对象条目，并包含 `label`
  - 节点可选 `id`、`icon`、`step`、`desc`、`value`
  - `step` 用于表示时间层级；相同 `step` 处于同一高度
- `compare-*` → `compares`
  - `compare-binary-*` / `compare-hierarchy-left-right-*`
    - `compares` 第一层必须且只能有两个根节点，分别表示对比双方
    - 两个根节点都应包含 `children`
    - 真正的对比项写在各自的 `children` 下
    - `children` 下的每一项都必须写成对象条目，并包含 `label`
    - 即使每一侧只有 1 个指标，也要写成 `children` 内含 1 个对象条目
  - `compare-swot`
    - `compares` 可直接放多个根节点
    - 每个根节点下可选 `children`
  - `compare-quadrant-*`
    - `compares` 直接放 4 个象限根节点
- `hierarchy-structure` → `items`
- `hierarchy-*` → 单一 `root`，通过 `children` 递归嵌套
- `relation-*` → `nodes` + `relations`
  - 简单关系也可直接用箭头语法表达关系
- `chart-*` → `values`
  - `chart-line-plain-text` / `chart-bar-plain-text` / `chart-column-simple` 都使用单条有序 `values`
  - 每个数据点使用 `label` 表示类目，使用 `value` 表示数值
  - 折线图的顺序由 `values` 中条目的排列顺序表达
- 结构无法明确判断时，再用 `items` 兜底

主题规则：

- `theme` 用于自定义主题，例如 `palette`、`base`、`stylize`
- 使用 `theme.base.text.font-family` 指定全局字体，如 `851tegakizatsu`、`AliPuHuiTi`
- 使用 `theme.stylize` 选择内置风格并传参
  - `rough`：手绘效果
  - `pattern`：图案填充
  - `linear-gradient` / `radial-gradient`：渐变风格
- 仅输出 Infographic 语法本身，不输出 JSON、解释性文字或额外 Markdown 段落

## 数据语法示例

- `list-*` 模板

```infographic
infographic list-grid-badge-card
data
  title Feature List
  lists
    - label Fast
      icon flash fast
    - label Secure
      icon shield check
```

- `sequence-*` 模板

```infographic
infographic sequence-ascending-steps
data
  title 发布流程
  sequences
    - label 需求确认
      icon clipboard check
    - label 开发实现
      icon code
    - label 发布上线
      icon rocket
  order asc
```

- `sequence-interaction-*` 模板

```infographic
infographic sequence-interaction-compact-animated-badge-card
data
  title 登录校验流程
  sequences
    - label 用户
      icon user
      children
        - label 发起登录
          id user-login
          step 0
          icon login
        - label 收到结果
          id user-result
          step 2
          icon inbox check
    - label 服务端
      icon server
      children
        - label 校验凭证
          id server-verify
          step 1
          icon shield check
        - label 返回结果
          id server-return
          step 2
          icon send
  relations
    user-login - 提交账号密码 -> server-verify
    server-verify - 生成结果 -> server-return
    server-return - 返回结果 -> user-result
```

- `hierarchy-*` 模板

```infographic
infographic hierarchy-tree-curved-line-rounded-rect-node
data
  title 组织结构
  root
    label 公司
    children
      - label 产品部
      - label 技术部
```

- `compare-swot` 模板

```infographic
infographic compare-swot
data
  title 产品 SWOT
  compares
    - label Strengths
      icon trophy
      children
        - label 品牌认知高
          icon star
    - label Weaknesses
      icon alert circle
      children
        - label 成本压力大
          icon wallet
```

- `compare-quadrant-*` 模板

```infographic
infographic compare-quadrant-quarter-simple-card
data
  title 任务优先级
  compares
    - label 高价值低成本
    - label 高价值高成本
    - label 低价值低成本
    - label 低价值高成本
```

- `compare-*` 模板

使用 `children` 形成对比层级，其中每个根节点表示一个对比对象，子节点表示该对象的具体指标，例如：

```infographic
infographic compare-binary-horizontal-simple-fold
data
  title 年度大促优惠
  compares
    - label 平日
      icon calendar
      children
        - label 原价 500
          icon tag
        - label 最高 9 折
          icon percent
    - label 大促
      icon megaphone
      children
        - label 实际支付 450
          icon wallet
        - label 最高 8 折
          icon badge percent
```

- `chart-*` 模板

values 下平铺每个数据项，例如：

```infographic
infographic chart-line-plain-text
data
  title 模型 A 准确率变化
  desc 第 4 周提升最明显
  values
    - label Week1
      value 86.5
    - label Week2
      value 87.3
    - label Week3
      value 89.1
    - label Week4
      value 91.2
theme
  palette #4f46e5 #db2777 #14b8a6
```

- `relation-*` 模板

```infographic
infographic relation-dagre-flow-tb-simple-circle-node
data
  title 系统关系
  nodes
    - label API
      icon api
    - id db
      label DB
      icon database
  relations
    API - 读写 -> db
```

- 兜底 `items` 示例

如果不明确使用哪个数据字段，或者信息结构比较简单，可以直接用 `items` 列表表达，例如：

```infographic
infographic list-row-horizontal-icon-arrow
data
  title 要点总结
  items
    - label 效率优先
      desc 聚焦关键动作
    - label 结果导向
      desc 输出可执行结论
```

### 可用模板

以下列出常用模板名，而不是完整模板全集；实际输出时首行必须写 `infographic <template-name>`：

- chart-bar-plain-text
- chart-column-simple
- chart-line-plain-text
- chart-pie-compact-card
- chart-pie-donut-pill-badge
- chart-pie-donut-plain-text
- chart-pie-plain-text
- chart-wordcloud
- compare-binary-horizontal-badge-card-arrow
- compare-binary-horizontal-simple-fold
- compare-binary-horizontal-underline-text-vs
- compare-hierarchy-left-right-circle-node-pill-badge
- compare-quadrant-quarter-circular
- compare-quadrant-quarter-simple-card
- compare-swot
- hierarchy-mindmap-branch-gradient-capsule-item
- hierarchy-mindmap-level-gradient-compact-card
- hierarchy-structure
- hierarchy-tree-curved-line-rounded-rect-node
- hierarchy-tree-tech-style-badge-card
- hierarchy-tree-tech-style-capsule-item
- list-column-done-list
- list-column-simple-vertical-arrow
- list-column-vertical-icon-arrow
- list-grid-badge-card
- list-grid-candy-card-lite
- list-grid-ribbon-card
- list-row-horizontal-icon-arrow
- list-sector-plain-text
- list-waterfall-badge-card
- list-waterfall-compact-card
- list-zigzag-down-compact-card
- list-zigzag-down-simple
- list-zigzag-up-compact-card
- list-zigzag-up-simple
- relation-dagre-flow-tb-animated-badge-card
- relation-dagre-flow-tb-animated-simple-circle-node
- relation-dagre-flow-tb-badge-card
- relation-dagre-flow-tb-simple-circle-node
- sequence-ascending-stairs-3d-underline-text
- sequence-ascending-steps
- sequence-circular-simple
- sequence-color-snake-steps-horizontal-icon-line
- sequence-cylinders-3d-simple
- sequence-filter-mesh-simple
- sequence-funnel-simple
- sequence-horizontal-zigzag-underline-text
- sequence-mountain-underline-text
- sequence-pyramid-simple
- sequence-roadmap-vertical-plain-text
- sequence-roadmap-vertical-simple
- sequence-snake-steps-compact-card
- sequence-snake-steps-simple
- sequence-snake-steps-underline-text
- sequence-stairs-front-compact-card
- sequence-stairs-front-pill-badge
- sequence-timeline-rounded-rect-node
- sequence-timeline-simple
- sequence-zigzag-pucks-3d-simple
- sequence-zigzag-steps-underline-text
- sequence-interaction-default-badge-card
- sequence-interaction-default-animated-badge-card
- sequence-interaction-default-compact-card
- sequence-interaction-default-capsule-item
- sequence-interaction-default-rounded-rect-node

## 模板选择建议

- 严格顺序、步骤推进、阶段演进 → `sequence-*`
- 多角色或多系统交互 → `sequence-interaction-*`
- 并列要点列举 → `list-row-*` / `list-column-*` / `list-grid-*`
- 双方对比、方案对比、前后对比 → `compare-*`
  - 先确定双方是谁
  - 再为双方分别展开 `children`
- SWOT 分析 → `compare-swot`
- 象限分析 → `compare-quadrant-*`
- 层级树结构 → `hierarchy-tree-*`
- 统计趋势、单条序列变化 → `chart-line-plain-text`
- 统计对比、单组数值比较 → `chart-bar-plain-text` / `chart-column-simple`
- 节点关系、流程依赖 → `relation-*`
- 词频主题展示 → `chart-wordcloud`
- 思维导图 → `hierarchy-mindmap-*`

## 生成流程

1. 提取用户内容中的标题、描述、条目、顺序和层级关系。
2. 如果用户明确指定了模板名，且该模板与内容结构兼容，则优先使用该模板。
3. 如果用户只指定了模板系列，则在该系列内选择最匹配的模板。
4. 否则判断信息结构，选择匹配的模板系列。
5. 组织 `data`，只保留与模板对应的主数据字段。
6. 为语义明确的主要数据项补充 `icon`；如果模板本身偏图标化，默认不要省略。
7. 保持 `title`、`desc`、`label` 等文案与用户输入语言一致；仅在用户明确要求时做翻译或双语化。
8. 用户指定风格、配色、字体时，再补充 `theme`。
9. 输出单个代码块，内容只包含 Infographic 语法。

## 输出格式

只输出一个代码块，不添加任何解释性文字：

```infographic
infographic list-row-horizontal-icon-arrow
data
  title 标题
  desc 描述
  lists
    - label 条目
      value 12.5
      desc 说明
      icon document text
theme
  palette #3b82f6 #8b5cf6 #f97316
```

## 自检清单

输出前检查以下事项：

- 首行是否为 `infographic <template-name>`
- 是否只使用了一个与模板匹配的主数据字段
- 主要数据项是否都带有合理的 `icon`，尤其是列表、步骤、节点、对比项与名称中含 `icon` 的模板
- 文案语言是否与用户输入语言一致，且没有无故翻译
- `palette` 是否为裸颜色值，且没有引号和逗号
- `sequence-interaction-*` 的泳道节点是否都写成 `children -> - label ...`
- `compare-binary-*` / `compare-hierarchy-left-right-*` 是否只有两个根节点，且两侧内容都放在各自的 `children` 下
- `children` 下的每一项是否都显式包含 `label`
- `chart-line-plain-text` 是否使用单条有序 `values`
- 输出中是否没有 JSON、解释文字或多余代码块
