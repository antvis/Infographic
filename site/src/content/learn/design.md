---
title: 设计
---

**设计（Design）** 定义信息图的视觉呈现，对应配置对象中的 `design` 字段。它由三个核心元素组成：

- **结构（structure）**：布局与组织方式
- **标题（title）**：标题样式设计
- **数据项（item/items）**：数据单元的视觉样式

所有设计资产本质上都是 JSX 组件。框架提供 [JSX 渲染引擎](/reference/jsx) 及内置组件库，并支持注册自定义组件。

## 结构 {#structure}

结构是信息图的视觉骨架，决定整体布局并承载标题、数据项等设计元素，也可按需求加入装饰。

通过 `options.design.structure` 配置结构，例如：

```js
new Infographic({
  // 其他配置项...
  design: {
    // 其他设计配置项...
    structure: {
      type: 'list-row', // 使用横向分布的列表结构
      // 其他结构配置项...
    },
  },
});
```

<Note>无需额外参数时，可简写为 `structure: 'list-row'`。</Note>

下图展示相同数据项在两种结构下的差异：左为 `list-grid` 网格，右为 `list-pyramid` 金字塔。

<img
  src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*QQ4KTbYpHQ0AAAAASPAAAAgAemJ7AQ/fmt.webp"
  width="45%"
/>

<img
  src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*5P9MR7t6p64AAAAARzAAAAgAemJ7AQ/fmt.webp"
  width="45%"
/>

<Note>
  结构设计差异较大，没有统一配置项，可通过注册不同结构组件实现。内置结构见[内置结构](/reference/built-in-structures)。
</Note>

## 标题 {#title}

标题用于引导与说明。默认标题包含文本 `title` 与描述 `desc`，可按需配置。

标题样式通过 `options.design.title` 配置，具体文案通过 `options.data.title` 与 `options.data.desc` 传入：

```js
new Infographic({
  // 其他配置项...
  design: {
    title: {
      type: 'default', // 使用默认标题设计
      alignHorizontal: 'left', // 左对齐
      descLineNumber: 2, // 描述文本最多显示两行
      // 其他标题设计配置项...
    },
  },
  data: {
    title: '信息图标题',
    desc: '这是信息图的描述文本',
    // 其他数据配置项...
  },
});
```

> 更多标题设计会持续增加。

## 数据项 {#item}

数据项组件用于展示具体内容，是信息图的最小可视化单元。`options.design` 支持 `item` 与 `items` 两种形式，常用 `item` 配置单一数据项设计：

```js
new Infographic({
  // 其他配置项...
  design: {
    item: {
      type: 'simple-horizontal-arrow', // 使用简单的水平箭头数据项设计
      // 其他数据项设计配置项...
    },
  },
});
```

<Note>
  无需额外参数时，可简写为 `item: 'simple-horizontal-arrow'`。
</Note>

在层级结构等场景，可用 `items` 为不同层级设置不同设计：

```js
new Infographic({
  // 其他配置项...
  design: {
    items: [
      {
        type: 'level-1-item', // 第一层级数据项设计
        // 其他第一层级数据项设计配置项...
      },
      {
        type: 'level-2-item', // 第二层级数据项设计
        // 其他第二层级数据项设计配置项...
      },
      // 其他层级数据项设计...
    ],
  },
});
```

<Note>
  同时存在 `item` 与 `items` 时，`items` 优先级更高。
</Note>

下图为两种层级设计示例：一级数据项使用 `circle-node`，二级使用圆角矩形文本 `pill-badge`。

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ig8OSZC9GywAAAAAdyAAAAgAemJ7AQ/fmt.avif" />
