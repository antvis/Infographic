---
title: Design
---

**Design** defines the visual presentation of infographics, corresponding to the `design` field in the configuration object. It consists of three core elements:

- **Structure**: Layout and organization method
- **Title**: Title style design
- **Item/Items**: Visual style of data units

All design assets are essentially JSX components. The framework provides a [JSX rendering engine](/reference/jsx) and built-in component library, with support for registering custom components.

## Structure {#structure}

Structure is the visual skeleton of the infographic, determining the overall layout and carrying design elements such as title and data items, with decorations added as needed.

Configure structure through `options.design.structure`, for example:

```syntax
design
  structure list-row
    # Other structure configuration options...
# Other configuration options...
```

The following images show the same data items in two different structures: left is `list-grid` grid, right is `list-pyramid` pyramid.

<img
  src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*QQ4KTbYpHQ0AAAAASPAAAAgAemJ7AQ/fmt.webp"
  width="45%"
/>

<img
  src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*5P9MR7t6p64AAAAARzAAAAgAemJ7AQ/fmt.webp"
  width="45%"
/>

<Note>
  Structures vary greatly in design and have no unified configuration options. They can be implemented by registering different structure components. See [Built-in Structures](/reference/built-in-structures) for built-in structures.
</Note>

## Title {#title}

Title is used for guidance and explanation. The default title includes text `title` and description `desc`, which can be configured as needed.

Title style is configured through `options.design.title`, with specific text passed through `options.data.title` and `options.data.desc`:

```syntax
design
  title default
    align-horizontal left
    desc-line-number 2
    # Other title design configuration options...
  # Other design configuration options...
data
  title Infographic Title
  desc This is the description text of the infographic
  # Other data...
```

> More title designs will be continuously added.

## Data Item {#item}

Data item components are used to display specific content and are the smallest visualization unit of infographics. `options.design` supports both `item` and `items` forms. Commonly use `item` to configure a single data item design:

```syntax
design
  item simple-horizontal-arrow
    # Other data item design configuration options...
# Other configuration options...
```

In hierarchical structure scenarios, you can use `items` to set different designs for different levels:

```syntax
design
  items
    - level-1-item # First level data item design
    - level-2-item # Second level data item design
```

<Note>When both `item` and `items` exist, `items` has higher priority.</Note>

The following image shows an example of two-level design: first-level data items use `circle-node`, and second-level uses rounded rectangle text `pill-badge`.

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ig8OSZC9GywAAAAAdyAAAAgAemJ7AQ/fmt.avif" />
