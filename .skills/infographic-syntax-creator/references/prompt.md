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

## 语法规范

- 第一行必须是 `infographic <template-name>`，模板从下方列表中选择
- 键值对使用「键 空格 值」
- 数组使用 `-` 作为条目前缀（行内写法仅在用户明确要求时使用）
- `data` 常见字段：
  - `title`(string) / `desc`(string) / `items`(array)
- `data.items` 常见字段：
  - `label`(string) / `value`(number) / `desc`(string) / `icon`(string) / `children`(array)
- 对比类模板（名称以 `compare-` 开头）必须构建两个根节点，所有对比项作为这两个根节点的 children
- `hierarchy-structure` 模板最多支持 3 层（根层 → 分组 → 子项），且 `data.items` 顺序即从上到下的层级顺序（第 1 个在最上）
- `theme` 可用 `theme <theme-name>`，或使用 block 自定义 `palette` 等；不写即默认主题，可选主题名：`dark`、`hand-drawn`
- icon 直接使用图标名（如 `mdi/chart-line`）
- 禁止输出 JSON、Markdown 或解释性文字

## 模板选择

**选择原则**：
- 列表类信息 → `list-*`
- 顺序/流程/阶段 → `sequence-*`
- 二元或多元对比 → `compare-*`
- 层级关系 → `hierarchy-*`
- 数据统计 → `chart-*`
- 象限 → `quadrant-*`
- 关系 → `relation-*`

**可用模板**：

- sequence-zigzag-steps-underline-text
- sequence-horizontal-zigzag-underline-text
- sequence-horizontal-zigzag-simple-illus
- sequence-circular-simple
- sequence-filter-mesh-simple
- sequence-mountain-underline-text
- sequence-cylinders-3d-simple
- sequence-color-snake-steps-horizontal-icon-line
- sequence-pyramid-simple
- sequence-funnel-simple
- sequence-roadmap-vertical-simple
- sequence-roadmap-vertical-plain-text
- sequence-zigzag-pucks-3d-simple
- sequence-ascending-steps
- sequence-ascending-stairs-3d-underline-text
- sequence-snake-steps-compact-card
- sequence-snake-steps-underline-text
- sequence-snake-steps-simple
- sequence-stairs-front-compact-card
- sequence-stairs-front-pill-badge
- sequence-timeline-simple
- sequence-timeline-rounded-rect-node
- sequence-timeline-simple-illus
- compare-binary-horizontal-simple-fold
- compare-hierarchy-left-right-circle-node-pill-badge
- compare-swot
- quadrant-quarter-simple-card
- quadrant-quarter-circular
- quadrant-simple-illus
- relation-circle-icon-badge
- relation-circle-circular-progress
- compare-binary-horizontal-badge-card-arrow
- compare-binary-horizontal-underline-text-vs
- hierarchy-tree-tech-style-capsule-item
- hierarchy-tree-curved-line-rounded-rect-node
- hierarchy-tree-tech-style-badge-card
- hierarchy-structure
- chart-column-simple
- chart-bar-plain-text
- chart-line-plain-text
- chart-pie-plain-text
- chart-pie-compact-card
- chart-pie-donut-plain-text
- chart-pie-donut-pill-badge
- chart-wordcloud
- list-grid-badge-card
- list-grid-candy-card-lite
- list-grid-ribbon-card
- list-row-horizontal-icon-arrow
- list-row-simple-illus
- list-sector-plain-text
- list-column-done-list
- list-column-vertical-icon-arrow
- list-column-simple-vertical-arrow
- list-zigzag-down-compact-card
- list-zigzag-down-simple
- list-zigzag-up-compact-card
- list-zigzag-up-simple

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
  items
    - label 条目
      value 12.5
      desc 说明
      icon mdi/rocket-launch
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
