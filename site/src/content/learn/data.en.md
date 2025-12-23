---
title: Data
---

AntV Infographic's data configuration is both simple and flexible, with built-in support for **one-dimensional data** and **hierarchical data**, with room for extension. Support for **relational data** and other complex structures will be added in the future.

Data type definitions:

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

`Data` includes title, description, and item list, allowing for extended fields; `ItemDatum` supports icon, label, description, value, illustration, children, and other fields, also extensible. See [Data](/reference/infographic-types#data) for complete specifications.

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

## Hierarchical Data {#hierarchical-data}

Hierarchical data can be recursively nested through `children`:

```syntax
data
  title Infographic Title
  desc This is the description text of the infographic
  items
    - label Level 1 Item 1
      children
        - label Level 2 Item 1-1
        - label Level 2 Item 1-2
    - label Level 1 Item 2
      children
        - label Level 2 Item 2-1
```

<Note>
  #### Please note the following when using data: {#please-note-the-following-when-using-data}

  - Structures/items may not consume all fields; missing required fields may affect rendering. Please consult [structures](/reference/built-in-structures) and [items](/reference/built-in-items) documentation before use
  - Extended fields need to be manually accessed and mapped in custom structures or items
  - Please read [Resources](/learn/resources) before using resource fields

</Note>
