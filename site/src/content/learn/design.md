---
title: 设计
---

**设计(Design)** 定义了信息图的视觉呈现方式,对应配置对象中的 `design` 字段。设计包含三个核心元素:

- 结构(**structure**): 定义信息图的布局和组织方式。
- 标题(**title**): 定义信息图的标题样式设计。
- 数据项(**items** / **items**): 定义信息图中各个数据项的视觉样式。

**所有设计资产本质上都是 JSX 组件**，AntV Infographic 实现了一套 [JSX 渲染引擎](/reference/jsx)，支持通过 JSX 来描述设计资产，同时框架提供了内置的组件库，支持用户注册自定义组件来扩展设计。

## 结构 {#structure}

**结构**是信息图的视觉骨架，决定了信息图整体的布局，并承载了标题和数据项等其他设计元素，同时能够根据设计需求添加装饰性元素。

结构通过在 AntV Infographic 中通过 `options.design.structure` 来进行配置，例如：

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

<Note>如果不需要额外配置结构，那么也可以简写为 `structure: 'list-row'`。</Note>

下面两图中采用了相同的数据项设计，但结构不同，图 1 采用了`list-grid`网格结构，右侧采用了`list-pyramid`金字塔形结构，从而呈现出不同的视觉效果。

<img
  src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*QQ4KTbYpHQ0AAAAASPAAAAgAemJ7AQ/fmt.webp"
  width="45%"
/>

<img
  src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*5P9MR7t6p64AAAAARzAAAAgAemJ7AQ/fmt.webp"
  width="45%"
/>

<Note>
  由于结构设计的多样性，因此没有统一的配置项，而是通过注册不同的结构组件来实现。
  框架内置了一些常用的结构组件，如果要了解如何使用这些组件，可以查阅[内置结构](/reference/built-in-structures)。
</Note>

## 标题 {#title}

标题是一段文本，在信息图中起到引导和说明的作用。目前 AntV Infographic 提供了默认的标题，包含标题文本(`title`)和标题描述(`desc`)两部分，用户可以根据需求进行配置。

标题的设计通过 `options.design.title` 来进行配置，具体的标题内容则是通过 `options.data.title` 和 `options.data.desc` 来进行配置，例如：

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

> AntV Infographic 后续会推出更多的标题设计，敬请期待！

## 数据项 {#item}

**数据项组件**用于展示具体的数据内容,是信息图中的最小可视化单元。

细心的你可以发现，`options.design` 支持配置 `item` 和 `items` 两种形式，绝大多数情况下，我们使用 `item` 来配置数据项设计，使用方式和`结构`类似，例如：

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
  如果不需要额外配置数据项，那么也可以简写为 `item: 'simple-horizontal-arrow'`。
</Note>

对于一些特殊的结构设计，尤其是层级结构设计，可能需要对不同层级的数据项使用不同的设计，这时就可以使用 `items` 来进行配置，例如：

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
  当同时配置了 `item` 和 `items` 时，`items` 的优先级更高，会覆盖 `item`
  的配置。
</Note>

下图中展示了两种方案对比，一级数据项采用了圆形设计(`circle-node`)，二级数据项采用了圆角矩形+文本的设计(`pill-badge`)。

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ig8OSZC9GywAAAAAdyAAAAgAemJ7AQ/fmt.avif" />
