---
title: 数据
---

AntV Infographic 设计了一种灵活且易用的数据配置方式，它能够简单的表达**一维数据**和**层级数据**，并支持一定程度的扩展性。后续我们会完善对于**关系数据**等复杂数据结构的支持。

以下为数据的类型定义：

```ts
export interface Data {
  title?: string;
  desc?: string;
  items: ItemDatum[];
  [key: string]: any;
}

export interface ItemDatum {
  icon?: string | ResourceConfig;
  label?: string;
  desc?: string;
  value?: number;
  illus?: string | ResourceConfig;
  children?: ItemDatum[];
  [key: string]: any;
}
```

其中 `Data` 包含标题、描述和数据项列表，并支持扩展其他字段。`ItemDatum` 列表支持配置图标、标题、描述、数值、插图和子项等字段，也支持扩展其他字段。完整的数据说明请查阅[Data](/reference/types#data)

## 一维数据/列表数据 {#flat-data}

下面是一个简单的一维数据示例：

```js
new Infographic({
  // 其他配置项...
  data: {
    title: '信息图标题',
    desc: '这是信息图的描述文本',
    items: [
      {
        icon: 'https://example.com/icon1.svg',
        label: '数据项 1',
        desc: '这是数据项 1 的描述',
      },
      {
        icon: 'https://example.com/icon2.svg',
        label: '数据项 2',
        desc: '这是数据项 2 的描述',
      },
    ],
  },
});
```

## 层级数据 {#hierarchical-data}

当需要表达层级结构数据时，可以通过 `children` 字段进行嵌套，例如：

```js
new Infographic({
  // 其他配置项...
  data: {
    title: '信息图标题',
    desc: '这是信息图的描述文本',
    items: [
      {
        label: '一级数据项 1',
        children: [
          {
            label: '二级数据项 1-1',
          },
          {
            label: '二级数据项 1-2',
          },
        ],
      },
      {
        label: '一级数据项 2',
        children: [
          {
            label: '二级数据项 2-1',
          },
        ],
      },
    ],
  },
});
```

<Note>
  #### 数据使用请注意以下事项： {#数据使用请注意以下事项}
  
  - 并非所有结构和数据项设计都会消费传入的全部数据字段，这取决于其具体实现，通常多余的字段不会有影响，但缺失数据字段可能会导致渲染效果异常。使用前请查阅具体的[结构](/reference/built-in-structures)和[数据项](/reference/built-in-items)设计说明
  - 扩展字段需要在自定义结构或数据项中进行访问并映射到视觉元素
  - 数据中关于资源的使用请阅读[资源](/learn/resources)

</Note>
