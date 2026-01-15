---
title: Data
---

AntV Infographic's data configuration is both simple and flexible, with built-in support for **list**, **sequence**, **hierarchy**, **comparison**, **relation**, and **statistics** data, with room for extension.

Data type definitions:

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

`Data` is a union of structure-specific data types, while `BaseData` provides common fields such as title, description, item list, and illustration map. `ItemDatum` is a union of multiple item shapes. See [Data](/reference/infographic-types#data) and [ItemDatum](/reference/infographic-types#item-datum) for complete specs.

## One-dimensional Data / List Data {#flat-data}

One-dimensional data example:

```syntax
data
  title Infographic Title
  desc This is the description text of the infographic
  items
    - icon https://example.com/icon1.svg
      label Data Item 1
      desc This is the description of data item 1
    - icon https://example.com/icon2.svg
      label Data Item 2
      desc This is the description of data item 2
```

## Sequence Data {#sequence-data}

Sequence data emphasizes order and typically uses the `sequences` field:

```syntax
data
  title Iteration Flow
  desc A simple sequence example
  sequences
    - label Requirements Review
    - label Development
    - label Integration Testing
  order asc
```

## Hierarchical Data {#hierarchical-data}

Hierarchical data uses `root` as the entry node and nests via `children`:

```syntax
data
  title Infographic Title
  desc This is the description text of the infographic
  root
    label Level 1 Item 1
    children
      - label Level 2 Item 1-1
      - label Level 2 Item 1-2
```

## Comparison Data {#compare-data}

Comparison data highlights side-by-side differences and uses `compares`:

```syntax
data
  title Plan Comparison
  compares
    - label Plan A
      value 80
    - label Plan B
      value 65
```

## Relation Data {#relation-data}

Relation data describes connections between nodes, using `nodes` for nodes and `relations` for edges:

```syntax
data
  title System Relations
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

See [Infographic Syntax](/learn/infographic-syntax#relation-data) for relation fields.

## Statistics Data {#statistics-data}

Statistics data uses `values` for numeric entries:

```syntax
data
  title Traffic Sources
  values
    - label Search
      value 62
    - label Direct
      value 38
```

<Note>
  #### Please note the following when using data: {#please-note-the-following-when-using-data}

  - Structures/items may not consume all fields; missing required fields may affect rendering. Please consult [structures](/reference/built-in-structures) and [items](/reference/built-in-items) documentation before use
  - Extended fields need to be manually accessed and mapped in custom structures or items
  - Please read [Resources](/learn/resources) before using resource fields

</Note>
