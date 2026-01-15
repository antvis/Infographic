---
title: 信息图语法
---

信息图语法是一套类 Mermaid 的语法，用于描述模板、设计、数据与主题。它适合 AI 流式输出，也适合人工编写，并通过 `Infographic` 的 `render(syntax)` 直接渲染。

<InfographicStreamRunner>

```plain
infographic list-row-horizontal-icon-arrow
data
  title 客户增长引擎
  desc 多渠道触达与复购提升
  lists
    - label 线索获取
      value 18.6
      desc 渠道投放与内容获客
      icon mdi/rocket-launch
    - label 转化提效
      value 12.4
      desc 线索评分与自动跟进
      icon mdi/progress-check
    - label 复购提升
      value 9.8
      desc 会员体系与权益运营
      icon mdi/account-sync
    - label 口碑传播
      value 6.2
      desc 社群激励与推荐裂变
      icon mdi/account-group
    - label 客户成功
      value 7.1
      desc 培训支持与使用激活
      icon mdi/book-open-page-variant
    - label 产品增长
      value 10.2
      desc 试用转化与功能引导
      icon mdi/chart-line
    - label 数据洞察
      value 8.5
      desc 关键指标与归因分析
      icon mdi/chart-areaspline
    - label 生态合作
      value 5.4
      desc 联合营销与资源互换
      icon mdi/handshake
```

</InfographicStreamRunner>

信息图语法受到 AntV G2、G6 的图形语法启发，并结合[信息图理论](/learn/infographic-theory)和[设计原则](/learn/infographic-design)。它的目标是让你专注于内容和视觉，不必陷入底层细节。

我们将信息图表示为：<Math>信息图 = 信息结构 + 图形表意</Math>

<img
  src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Ir9aTL5mKQYAAAAARVAAAAgAemJ7AQ/original"
  width="50%"
/>

信息结构对应数据的抽象，决定内容与层级；图形表意对应设计的抽象，决定视觉呈现与风格。

## 语法结构 {#语法结构}

入口使用 `infographic [template-name]`，之后通过块（block）描述 template、design、data、theme。

```plain
infographic list-row-horizontal-icon-arrow
data
  title 客户增长引擎
  desc 多渠道触达与复购提升
  lists
    - label 线索获取
      value 18.6
      desc 渠道投放与内容获客
      icon company-021_v1_lineal
    - label 转化提效
      value 12.4
      desc 线索评分与自动跟进
      icon antenna-bars-5_v1_lineal
```

## 语法规范 {#语法规范}

- 入口使用 `infographic [template-name]`
- 键值对使用空格分隔，缩进使用两个空格
- `structure [name]`、`item [name]`、`title [name]` 省略 `type`
- 对象数组使用 `-` 换行（如 `data.lists`），简单数组使用行内写法（如 `palette`）
- 容器相关配置写在 `new Infographic({ ... })`（如 `width`、`height`、`padding`、`editable`），语法中只写 `template`/`design`/`theme`

### template {#template}

模板在入口处直接指定。

```plain
infographic <template-name>
```

### design {#design}

设计块用于选择结构、卡片与标题等模块。

```plain
design
  structure <structure-name>
    gap 12
  item <item-name>
    showIcon true
  title default
    align center
```

### data {#data}

数据块是信息结构的核心，通常包含标题(`title`)、描述(`desc`)与数据项，其中数据项包含以下可选通用字段：

- label: 展示文本
- desc: 描述文本
- value: 数值
- icon: 关键词(会基于关键词自动使用相应的图标)

> 数据项指 `lists`、`sequences`、`values`、`nodes` 等字段下的对象。

通常来说使用数据项与选择的模版具有对应关系，例如模版 `list-row-horizontal-icon-arrow` 适合使用 `lists` 数据项，而模版 `relation-dagre-flow-tb-simple-circle-node` 适合使用 `nodes` 与 `relations` 数据项。

> 如果难以确定使用哪种数据项，可以采用 `items` 进行通用描述，模版会根据实际情况进行适配。

#### 列表数据 {#列表数据}

列表数据用于表示一组同类项，项与项之间没有顺序、先后关系，常见于清单、功能列表等场景。使用 `lists` 字段描述列表数据项。

```plain
infographic list-grid-compact-card
data
  title 购买水果清单
  lists
    - label 西瓜
      icon watermelon
    - label 苹果
      icon apple
    - label 香蕉
      icon banana
```

#### 序列数据 {#序列数据}

序列数据与列表数据基本一致，用于表示有序项，常见于时间线、步骤等场景。使用 `sequences` 字段描述序列数据项。

```plain
infographic sequence-steps-simple
data
  sequences
    - label 步骤一
    - label 步骤二
    - label 步骤三
```

使用 `order` 字段显式指定排序方式（`asc` 或 `desc`），下面的例子中通过 `order asc` 表明 sequences 中的项是按升序排列。

```plain
infographic sequence-stairs-front-pill-badge
data
  title 职级序列
  sequences
    - label P7
    - label P6
    - label P5
  order desc
```

#### 层级数据 {#层级数据}

层级数据用于表示树状结构，常见于组织结构、分类体系等场景。使用 `root` 字段描述根节点，子节点通过 `children` 字段递归定义。

```plain
infographic hierarchy-structure
data
  root
    label 公司
    children
      - label 部门一
      - label 部门二
```

#### 对比数据 {#对比数据}

对比数据用于并列或分组对比（例如四象限图），使用 `compares` 字段描述对比项：

```plain
infographic quadrant-quarter-simple-card
data
  compares
    - label 高价值高增长
      icon star
    - label 高价值低增长
      icon diamond
    - label 低价值高增长
      icon rocket
    - label 低价值低增长
      icon down
```

对比项也支持 `children` 形成对比层级，其中每个根节点表示一个对比对象，子节点表示该对象的具体指标，例如：

```plain
infographic compare-swot
data
  compares
    - label 方案 A
      value 68
      children
        - label 转化率高
        - label 客单价高
    - label 方案 B
      value 82
      children
        - label 转化率低
        - label 客单价一般
```

#### 统计数据 {#统计数据}

统计数据用于展示指标类数据，使用 `values` 字段描述数据项：

```plain
infographic chart-column-simple
data
  values
    - label 访问量
      value 1280
    - label 转化率
      value 12.4
    - label 客单价
      value 256
```

对于分组数据，可用 `category` 标识分类（需选择适配的模版），例如：

```plain
infographic chart-column-grouped-simple
data
  title 降雨量数据
  values
    - label 一月
      value 18.9
      category 重庆
    - label 一月
      value 12.4
      category 北京
    - label 二月
      value 15.6
      category 重庆
    - label 二月
      value 10.2
      category 北京
```

#### 关系数据 {#关系数据}

关系数据用于表示节点与节点之间的关系，常见于流程图、网络图等场景。使用 `nodes` 字段描述节点，使用 `relations` 字段描述关系。

- node 节点包含以下属性：
  - id：节点唯一标识，没有 `id` 时以 `label` 作为节点 id；当多个节点 id 重复时，以最后一个节点为准
  - label：节点的展示文本，没有 `label` 时以 `id` 作为节点展示文本
  - group：节点分组标识，便于对同组节点进行统一着色
- relations 边包含以下属性：
  - from：起始节点 id
  - to：目标节点 id
  - label：关系的展示文本
  - direction：边的方向，可选值有 `forward`（单向，从 from 指向 to）、`both`（双向）和 `none`（无向），默认为 `forward`
  - showArrow：是否显示箭头，布尔值
  - arrowType：箭头样式，可选值有 `arrow` （箭头型）、`triangle`（三角型）和 `diamond`（菱形）

**YAML 风格写法：**

```plain
infographic relation-dagre-flow-tb-simple-circle-node
data
  title Relation Graph
  nodes
    - id A
      label Node A
    - id B
      label Node B
  relations
    - from A
      to B
```

**Mermaid 风格写法（类似 flowchart）：**

可以使用 `->` 符号来描述节点关系，例如：

```plain
infographic relation-dagre-flow-tb-simple-circle-node
data
  nodes
    - id A
      label Node A
    - id B
      label Node B
    - id C
      label Node C
  relations
    A -> B
    A <- C
    A -> B -> C -> A
```

如果是简单的关系图，也可以省略 `nodes`，在 `relations` 中直接定义节点和关系：

```plain
infographic relation-dagre-flow-tb-simple-circle-node
data
  relations
    A - The Edge Between A and B -> B
    B -> C[Label of C]
    C -->|The Edge Between C and D| D
```

下面是完整的关系边语法定义：

| 语法示例                    | 说明                                              |
| --------------------------- | ------------------------------------------------- |
| `A -> B`                    | from A to B                                       |
| `A <- B`                    | from B to A                                       |
| `A -- B`                    | 表示无向边，即 `direction none`                   |
| `A<->B`                     | 表示双向边，即 `direction both`                   |
| `A -relation label-> B`     | 指定关系的标签(`label`)，不可使用特殊符号         |
| `A -->\|relation label\| B` | 同上，指定关系的标签(`label`)，但允许使用特殊符号 |
| `A --> B[label]`            | 指定节点的标签(`label`)                           |

注意事项：

- 多余的 `-`（如 `A ----> B`）、`-.-`、`==>`、`--x`、`--o` 等特殊表示均被视为 `--` 或 `->`；
- `id1(label)` / `id1([label])` 等节点样式等价于 `id1[label]`；
- `id@{...}` 的属性会被忽略。

### theme {#theme}

主题块用于切换主题与调整色板、字体与风格化能力。

使用预设主题：

```plain
theme <theme-name>
```

搭配自定义主题：

```plain
theme
  colorBg #0b1220
  colorPrimary #ff5a5f
  palette #ff5a5f #1fb6ff #13ce66
  stylize rough
    roughness 0.3
```

## 使用案例 {#使用案例}

### 常规渲染 {#常规渲染}

直接一次性渲染完整语法。

```ts
import {Infographic} from '@antv/infographic';

const instance = new Infographic({
  container: '#container',
  width: 900,
  height: 540,
  padding: 24,
});

const syntaxText = `
infographic list-row-horizontal-icon-arrow
data
  title 客户增长引擎
  desc 多渠道触达与复购提升
  lists
    - label 线索获取
      value 18.6
      desc 渠道投放与内容获客
      icon company-021_v1_lineal
    - label 转化提效
      value 12.4
      desc 线索评分与自动跟进
      icon antenna-bars-5_v1_lineal
`;

instance.render(syntaxText);
```

### 流式渲染 {#流式渲染}

模型输出片段后持续调用 `render` 更新（伪代码）。每次收到新的语法片段，就追加到缓冲区并重新渲染，让画面与输出同步更新。

```ts
import {Infographic} from '@antv/infographic';

const instance = new Infographic({
  container: '#container',
  width: 900,
  height: 540,
  padding: 24,
});

const chunks = [
  'infographic list-row-horizontal-icon-arrow\n',
  'data\n  title 客户增长引擎\n  desc 多渠道触达与复购提升\n',
  '  lists\n    - label 线索获取\n      value 18.6\n',
  '      desc 渠道投放与内容获客\n      icon company-021_v1_lineal\n',
];

let buffer = '';
for (const chunk of chunks) {
  buffer += chunk;
  instance.render(buffer);
}
```
