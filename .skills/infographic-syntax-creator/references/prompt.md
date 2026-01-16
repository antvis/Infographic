# 信息图语法生成规范

本文件用于指导生成符合 AntV Infographic 语法规范的纯文本输出。

## 目录

- 目标与输入输出
- 语法结构
- 语法规范
- 模板选择
- 生成流程
- 输出格式
- 常见问题与最佳实践

## 目标与输入输出

- **输入**：用户的文字内容或需求描述
- **输出**：仅包含 Infographic 语法的 `plain` 代码块

## 语法结构

信息图语法由入口与块结构组成：

- **入口**：`infographic <template-name>`
- **块**：`data` / `theme`
  - 块内层级使用两个空格缩进

## 规范

### AntV Infographic 语法

AntV Infographic 语法是一种自定义的 DSL，用于描述信息图渲染配置。它使用缩进描述信息，具有较强鲁棒性，便于 AI 流式输出并渲染信息图。主要包含以下信息：

1. template：用模板表达文字信息结构。
2. data：信息图数据，包含 title、desc、数据项等。数据项通常包含 label、desc、icon 等字段。
3. theme：主题包含 palette、font 等样式配置。

例如：

```plain
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

### 语法规范

- 第一行必须是 `infographic <template-name>`，模板从下方列表中选择（见“可用模板”部分）。
- 使用 `data` / `theme` 块，块内用两个空格缩进。
- 键值对使用「键 空格 值」；数组使用 `-` 作为条目前缀。
- icon 使用图标关键词（如 `star fill`）。
- `data` 应包含 title/desc + 模板对应的主数据字段（不一定是 `items`）。
- 主数据字段选择（只用一个，避免混用）：
  - `list-*` → `lists`
  - `sequence-*` → `sequences`（可选 `order asc|desc`）
  - `compare-*` → `compares`（支持 `children` 分组对比），可包含多个对比项
  - `hierarchy-structure` → `items`（每一项对应一个独立层级，每一层级可以包含子项，最多可嵌套 3 层）
  - `hierarchy-*` → 单一 `root`（树结构，通过 `children` 嵌套）；
  - `relation-*` → `nodes` + `relations`；简单关系图可省略 `nodes`，在 relations 中用箭头语法
  - `chart-*` → `values`（数值统计，可选 `category`）
  - 不确定时再用 `items` 兜底
- `compare-binary-*` / `compare-hierarchy-left-right-*` 二元模板：必须两个根节点，所有对比项挂在这两个根节点的 children
- `hierarchy-*`：使用单一 `root`，通过 `children` 嵌套（不要重复 `root`）
- `theme` 用于自定义主题（palette、font 等）
  例如：暗色主题 + 自定义配色
  ```plain
  infographic list-row-simple-horizontal-arrow
  theme dark
    palette
      - #61DDAA
      - #F6BD16
      - #F08BB4
  ```
- 使用 `theme.base.text.font-family` 指定字体，如手写风格 `851tegakizatsu`
- 使用 `theme.stylize` 选择内置风格并传参
  常见风格：
  - `rough`：手绘效果
  - `pattern`：图案填充
  - `linear-gradient` / `radial-gradient`：线性/径向渐变

  例如：手绘风格（rough）

  ```plain
  infographic list-row-simple-horizontal-arrow
  theme
    stylize rough
    base
      text
        font-family 851tegakizatsu
  ```

- 禁止输出 JSON、Markdown 或解释性文字

### 数据语法示例

按模板类别的数据语法示例（使用对应字段，避免同时添加 `items`）：

- `list-*` 模版

```plain
infographic list-grid-badge-card
data
  title Feature List
  lists
    - label Fast
      icon flash fast
    - label Secure
      icon secure shield check
```

- `sequence-*` 模版

```plain
infographic sequence-steps-simple
data
  sequences
    - label Step 1
    - label Step 2
    - label Step 3
  order asc
```

- `hierarchy-*` 模版

```plain
infographic hierarchy-structure
data
  root
    label Company
    children
      - label Dept A
      - label Dept B
```

- `compare-*` 模版

```plain
infographic compare-swot
data
  compares
    - label Strengths
      children
        - label Strong brand
        - label Loyal users
    - label Weaknesses
      children
        - label High cost
        - label Slow release
```

四象限图

```plain
infographic compare-quadrant-quarter-simple-card
data
  compares
    - label High Impact & Low Effort
    - label High Impact & High Effort
    - label Low Impact & Low Effort
    - label Low Impact & High Effort
```

- `chart-*` 模版

```plain
infographic chart-column-simple
data
  values
    - label Visits
      value 1280
    - label Conversion
      value 12.4
```

- `relation-*` 模版

> 边标签写法：A -label-> B 或 A -->|label| B

```plain
infographic relation-dagre-flow-tb-simple-circle-node
data
  nodes
    - id A
      label Node A
    - id B
      label Node B
  relations
    A - approves -> B
    A -->|blocks| B
```

- 兜底 `items` 示例

```plain
infographic list-row-horizontal-icon-arrow
data
  items
    - label Item A
      desc Description
      icon sun
    - label Item B
      desc Description
      icon moon
```

### 可用模板

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

**模板选择建议：**

- 严格顺序（流程/步骤/发展趋势）→ `sequence-*`
  - 时间线 → `sequence-timeline-*`
  - 阶梯图 → `sequence-stairs-*`
  - 路线图 → `sequence-roadmap-vertical-*`
  - 折线路径 → `sequence-zigzag-*`
  - 环形进度 → `sequence-circular-simple`
  - 彩色蛇形步骤 → `sequence-color-snake-steps-*`
  - 金字塔 → `sequence-pyramid-simple`
- 观点列举 → `list-row-*` 或 `list-column-*`
- 二元对比（利弊）→ `compare-binary-*`
- SWOT → `compare-swot`
- 层级结构（树图）→ `hierarchy-tree-*`
- 数据图表 → `chart-*`
- 象限分析 → `quadrant-*`
- 网格列表（要点）→ `list-grid-*`
- 关系展示 → `relation-*`
- 词云 → `chart-wordcloud`
- 思维导图 → `hierarchy-mindmap-*`

### 示例

绘制互联网技术演进信息图

```plain
infographic list-row-horizontal-icon-arrow
data
  title Internet Technology Evolution
  desc From Web 1.0 to AI era, key milestones
  lists
    - time 1991
      label Web 1.0
      desc Tim Berners-Lee published the first website, opening the Internet era
      icon web
    - time 2004
      label Web 2.0
      desc Social media and user-generated content become mainstream
      icon account multiple
    - time 2007
      label Mobile
      desc iPhone released, smartphone changes the world
      icon cellphone
    - time 2015
      label Cloud Native
      desc Containerization and microservices architecture are widely used
      icon cloud
    - time 2020
      label Low Code
      desc Visual development lowers the technology threshold
      icon application brackets
    - time 2023
      label AI Large Model
      desc ChatGPT ignites the generative AI revolution
      icon brain
```

## 生成流程

1. 提取用户内容中的标题、描述、条目与层级关系
2. 匹配结构类型并选择模板
3. 组织 `data`：为每个条目提供 `label/desc/value/icon` 中的必要字段
4. 用户指定风格或色彩时，补充 `theme`
5. 输出纯语法文本的 `plain` 代码块

## 输出格式

只输出一个 `plain` 代码块，不添加任何解释性文字：

```plain
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
  palette
    - #3b82f6
    - #8b5cf6
    - #f97316
```

## 常见问题与最佳实践

- 信息不足时，可合理补全，但避免编造与主题无关内容
- `value` 为数值类型，若无明确数值可省略
- `children` 用于层级结构，避免层级与模板类型不匹配
- 输出必须严格遵守缩进规则，便于流式渲染
