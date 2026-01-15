---
title: 数据
---

AntV Infographic 的数据配置既简单又灵活，内置支持**列表**、**序列**、**层级**、**对比**、**关系**、**统计**等结构数据，并预留扩展空间。

数据类型定义：

```ts
export interface BaseData {
  title?: string;
  desc?: string;
  items?: ItemDatum[];
  illus?: Record<string, string | ResourceConfig>;
  attributes?: Record<string, object>;
  [key: string]: any;
}

export type Data =
  | ListData
  | SequenceData
  | HierarchyData
  | CompareData
  | RelationData
  | StatisticsData;

export type ItemDatum =
  | ListDatum
  | SequenceDatum
  | HierarchyDatum
  | CompareDatum
  | RelationNodeDatum
  | StatisticsDatum;
```

`Data` 是多种结构数据的联合类型，`BaseData` 提供标题、描述、数据项列表与插图映射等通用字段；`ItemDatum` 则是多种数据项的联合类型。完整说明见 [Data](/reference/infographic-types#data) 与 [ItemDatum](/reference/infographic-types#item-datum)。

## 一维数据/列表数据 {#flat-data}

一维数据示例：

```syntax
data
  title 信息图标题
  desc 这是信息图的描述文本
  items
    - icon https://example.com/icon1.svg
      label 数据项 1
      desc 这是数据项 1 的描述
    - icon https://example.com/icon2.svg
      label 数据项 2
      desc 这是数据项 2 的描述
```

## 序列数据 {#sequence-data}

序列数据强调先后顺序，常用 `sequences` 字段描述：

```syntax
data
  title 迭代流程
  desc 这是一个简单的序列示例
  sequences
    - label 需求评审
    - label 开发实现
    - label 联调测试
  order asc
```

## 层级数据 {#hierarchical-data}

层级数据可通过 `root` 设置根节点，并在节点上用 `children` 递归嵌套：

```syntax
data
  title 信息图标题
  desc 这是信息图的描述文本
  root
    label 一级数据项 1
    children
      - label 二级数据项 1-1
      - label 二级数据项 1-2
```

## 对比数据 {#compare-data}

对比数据强调并列对比，可使用 `compares`：

```syntax
data
  title 方案对比
  compares
    - label 方案 A
      value 80
    - label 方案 B
      value 65
```

## 关系数据 {#relation-data}

关系数据用于描述节点与节点之间的连接关系，使用 `nodes` 定义节点，`relations` 定义连线：

```syntax
data
  title 系统关系
  nodes
    - id api
      label API
    - id db
      label DB
  relations
    - from api
      to db
      direction forward
```

更多关系字段说明见 [信息图语法](/learn/infographic-syntax#relation-data)。

## 统计数据 {#statistics-data}

统计数据通过 `values` 提供数值项：

```syntax
data
  title 访问来源占比
  values
    - label 搜索
      value 62
    - label 直达
      value 38
```

<Note>
  #### 数据使用请注意以下事项： {#数据使用请注意以下事项}

  - 结构/数据项未必消费全部字段；缺失必需字段可能影响渲染，使用前请查阅[结构](/reference/built-in-structures)与[数据项](/reference/built-in-items)说明
  - 扩展字段需在自定义结构或数据项中手动访问并映射
  - 使用资源字段前请阅读[资源](/learn/resources)

</Note>
