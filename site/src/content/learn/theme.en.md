---
title: Themes
---

Themes control the overall look and feel of infographics, providing capabilities including:

- Configure primary color, palette, background, etc.
- Adjust styles for specific parts like text and graphics
- Apply stylization effects

Can be configured through [options.theme](/reference/infographic-types#theme-config): the former specifies a registered theme name, the latter provides fine-grained overrides.

## Primary Color and Background Color {#color-primary-and-bg}

`colorPrimary` / `colorBg` determine the primary color and background color. The primary color is commonly used for decorative elements (such as icons, connecting lines), and also serves as the default color for data items when no palette is configured.

In the example below, the default primary color <span style={{background: '#FF356A',color: '#fff', borderRadius: 4}}>&nbsp;#FF356A&nbsp;</span> is used, with a white background.

<InfographicStreamRunner>

```syntax
infographic list-row-simple-horizontal-arrow
data
  items
    - label Step 1
      desc Start
    - label Step 2
      desc In Progress
    - label Step 3
      desc Complete
```

</InfographicStreamRunner>

In the example below, a custom primary color <span style={{background: '#61DDAA',color: '#fff', borderRadius: 4}}>&nbsp;#61DDAA&nbsp;</span> is used, with a dark background <span style={{background: '#1F1F1F',color: '#fff', borderRadius: 4}}>&nbsp;#1F1F1F&nbsp;</span>.

<InfographicStreamRunner>

```syntax
infographic list-row-simple-horizontal-arrow
theme dark
  colorPrimary #61DDAA
  colorBg #1F1F1F
data
  items
    - label Step 1
      desc Start
    - label Step 2
      desc In Progress
    - label Step 3
      desc Complete
```

</InfographicStreamRunner>

## Palette {#palette}

Palettes provide color sets for data items, commonly used to distinguish categories. Configure through `theme.palette`.

See [Palette](/reference/infographic-types#palette) for palette type definitions, which supports `string`, `string[]`, and function types.

When passing a `string`, it indicates using a [built-in](/reference/built-in-palettes) or [custom](/learn/custom-palette) palette name. In the example below, the built-in AntV palette is used.

<InfographicStreamRunner>

```syntax
infographic list-row-simple-horizontal-arrow
theme
  palette antv
data
  items
    - label Step 1
      desc Start
    - label Step 2
      desc In Progress
    - label Step 3
      desc Complete
```

</InfographicStreamRunner>

When passing a `string[]`, it indicates using a specified color array as the palette. In the example below, three colors are used as the palette.

<InfographicStreamRunner>

```syntax
infographic list-row-simple-horizontal-arrow
theme
  palette
    - #61DDAA
    - #F6BD16
    - #F08BB4
data
  items
    - label Step 1
      desc Start
    - label Step 2
      desc In Progress
    - label Step 3
      desc Complete
```

</InfographicStreamRunner>
