---
title: 数据
---

AntV Infographic 的数据配置既简单又灵活，内置支持**一维数据**与**层级数据**，并预留扩展空间；后续会补充对**关系数据**等复杂结构的支持。

数据类型定义：

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

`Data` 包含标题、描述、数据项列表，并允许扩展字段；`ItemDatum` 支持图标、标题、描述、数值、插图、子项等字段，同样可扩展。完整说明见 [Data](/reference/infographic-types#data)。

## 一维数据/列表数据 {#flat-data}

一维数据示例：

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

层级数据可通过 `children` 递归嵌套：

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

  - 结构/数据项未必消费全部字段；缺失必需字段可能影响渲染，使用前请查阅[结构](/reference/built-in-structures)与[数据项](/reference/built-in-items)说明
  - 扩展字段需在自定义结构或数据项中手动访问并映射
  - 使用资源字段前请阅读[资源](/learn/resources)

</Note>
