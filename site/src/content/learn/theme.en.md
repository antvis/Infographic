---
title: Themes
---

Themes control the overall look and feel of infographics, providing capabilities including:

- Configure primary color, palette, background, etc.
- Adjust styles for specific parts like text and graphics
- Apply stylization effects

You can configure this through [options.theme](/reference/infographic-types#theme-config): the former specifies a registered theme name, the latter provides fine-grained overrides.

## Primary Color and Background Color {#color-primary-and-bg}

`colorPrimary` / `colorBg` determine the primary color and background color. The primary color is commonly used for decorative elements (such as icons, connecting lines), and also serves as the default color for data items when no palette is configured.

In the example below, the default primary color <span style={{background: '#FF356A',color: '#fff', borderRadius: 4}}>&nbsp;#FF356A&nbsp;</span> is used, with a white background.

<InfographicStreamRunner>

```syntax
infographic list-row-simple-horizontal-arrow
data
  lists
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
  lists
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
  lists
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
  lists
    - label Step 1
      desc Start
    - label Step 2
      desc In Progress
    - label Step 3
      desc Complete
```

</InfographicStreamRunner>

<Note>

When the number of data items exceeds the palette length, the palette colors are used cyclically. For example, if the palette has 3 colors and there are 5 data items, the 4th item uses the 1st color and the 5th item uses the 2nd color.

</Note>

When passing a function, similar to D3 [color interpolation functions](https://d3js.org/d3-interpolate), colors can be generated dynamically based on data. In the example below, a simple color generator is used to create a gradient based on the item index and total count.

<CodeRunner>

```js
import {Infographic, registerPalette} from '@antv/infographic';

registerPalette('smooth-gradient', (ratio) => {
  // Gradient from blue to green
  const hue = Math.floor(ratio * 120 + 180); // 180-300 degrees
  const saturation = 75;
  const lightness = 55;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
});

const infographic = new Infographic({
  container: '#container',
  width: '100%',
  height: '100%',
  padding: 30,
});

infographic.render(`
infographic list-row-simple-horizontal-arrow
theme
  palette smooth-gradient
data
  lists
    - label Step 1
      desc Start
    - label Step 2
      desc In Progress
    - label Step 3
      desc Complete
`);
```

</CodeRunner>

## Specific Part Styles {#specific-style}

The following configuration items in `theme` are used to adjust styles for specific parts of the infographic:

| Option         | Description                        |
| -------------- | ---------------------------------- |
| base.`global`  | Configure global graphic styles    |
| base.`text`    | Configure global text styles       |
| base.`shape`   | Configure global `shape` styles    |
| title          | Infographic title styles           |
| desc           | Infographic description styles     |
| shape          | `shape` graphic styles             |
| item.`icon`    | Data item icon styles              |
| item.`label`   | Data item label styles             |
| item.`desc`    | Data item description styles       |
| item.`value`   | Data item value styles             |

<Note>
  A `shape` refers to graphics that set `data-element-type="shape"` when defining custom `structures` or `items`.
</Note>

In the example below, the background is set to dark, the global font is changed to a handwritten font, and the data item label color is set to <span style={{background: '#FF356A',color: '#fff', borderRadius: 4}}>&nbsp;#FF356A&nbsp;</span>.

<InfographicStreamRunner>

```syntax
infographic list-row-horizontal-icon-arrow
theme dark
  colorBg #1F1F1F
  base
    text
      font-family 851tegakizatsu
  item
    label
      fill #FF356A
data
  lists
    - label Step 1
      desc Start
      icon mdi/rocket-launch
    - label Step 2
      desc In Progress
      icon mdi/progress-clock
    - label Step 3
      desc Complete
      icon mdi/trophy
```

</InfographicStreamRunner>
