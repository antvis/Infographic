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
  items
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
  items
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
- 对象数组使用 `-` 换行（如 `data.items`），简单数组使用行内写法（如 `palette`）
- 容器相关配置写在 `new Infographic({ ... })`（如 `width`、`height`、`padding`、`editable`），语法中只写 `template`/`design`/`theme`
- 也可以在首行直接写模板名（需为已注册模板），等同于 `infographic <template-name>`

### template {#template}

模板在入口处直接指定。

```plain
infographic <template-name>
```

首行直接写模板名的简写方式：

```plain
list-row-horizontal-icon-arrow
data
  items
    - label Step 1
      desc Start
    - label Step 2
      desc In Progress
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

数据块是信息结构的核心，通常包含标题、描述与列表项，支持嵌套层级。

```plain
data
  title 组织结构
  desc 产品增长团队
  items
    - label 产品增长
      icon company-021_v1_lineal
      children
        - label 增长策略
          desc 指标与实验设计
          icon antenna-bars-5_v1_lineal
        - label 用户运营
          desc 生命周期运营
          icon activities-037_v1_lineal
```

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
  items
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
  '  items\n    - label 线索获取\n      value 18.6\n',
  '      desc 渠道投放与内容获客\n      icon company-021_v1_lineal\n',
];

let buffer = '';
for (const chunk of chunks) {
  buffer += chunk;
  instance.render(buffer);
}
```
