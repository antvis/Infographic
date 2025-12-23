---
title: Primitive Nodes
---

The Infographic JSX engine provides a set of primitive nodes. Unlike raw SVG elements, the graphic primitives (`GraphicsElement`) share consistent geometric parameters such as `x`, `y`, `width`, and `height`, which makes it easier to reason about layout.

## Common Props {#common-props}

All primitives accept the geometric and SVG props defined in `BaseGeometryProps`. Common parameters:

| Prop         | Type            | Default     | Description                                                                 |
| ------------ | --------------- | ----------- | --------------------------------------------------------------------------- |
| `x`         | `number`        | `undefined` | X coordinate of the top-left corner (some components derive `transform`). |
| `y`         | `number`        | `undefined` | Y coordinate of the top-left corner.                                       |
| `width`     | `number`        | `undefined` | Width of the element.                                                       |
| `height`    | `number`        | `undefined` | Height of the element.                                                      |
| `transform` | `string`        | `undefined` | Custom transform. If the component auto-generates `transform`, the provided value is merged or skipped (see component docs). |
| Others      | `SVGAttributes` | -           | Native SVG attributes like `fill`, `stroke`, `opacity`, `id`, `className`, `style`, etc. |
| `data-*`    | `any`           | -           | Custom data attributes for runtime debugging.                               |

## Defs {#defs}

`Defs` defines reusable references such as gradients or filters. You can include primitive nodes, SVG elements, or custom components.

| Prop        | Type      | Default | Description                                       |
| ------------ | --------- | ------- | ------------------------------------------------- |
| `children`   | `JSXNode` | Required | Gradient, filter, or pattern definitions with an `id` for referencing elsewhere. |

```jsx
<Defs>
  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stopColor="#ff0000" />
    <stop offset="100%" stopColor="#0000ff" />
  </linearGradient>

  <radialGradient id="gradient2" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stopColor="#ffffff" />
    <stop offset="100%" stopColor="#000000" />
  </radialGradient>

  <filter id="shadow">
    <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000000" />
  </filter>
</Defs>

<Rect fill="url(#gradient1)" width={100} height={50} />
<Ellipse fill="url(#gradient2)" width={80} height={80} />
<Rect filter="url(#shadow)" width={100} height={50} />
```

Objects inside `Defs` are referenced by `id`. If multiple definitions share the same `id`, the last one wins.

## Group {#group}

`Group` behaves like SVG's `<g>` element, grouping multiple graphics and supporting `x`, `y`, `width`, `height`, etc.

Providing `x` or `y` auto-generates `transform="translate(x, y)"`, making it easy to move the group.

| Prop        | Type      | Default     | Description                                  |
| ----------- | --------- | ----------- | -------------------------------------------- |
| `children`  | `JSXNode` | `undefined` | Any nodes inside the group.                  |
| `x` `y`     | `number`  | `0`         | `translate(x, y)` applied when non-zero and no manual `transform`. |

```jsx
<Group
  x={10}
  y={10}
  width={200}
  height={100}
  transform="rotate(45)"
  opacity={0.8}>
  {children}
</Group>
```

> The `width`/`height` of `Group` are only used for bounds calculations and do not constrain children. If omitted, they are derived from the children automatically.

## Rect {#rect}

`Rect` maps to SVG's `<rect>`. Control position and size through geometry props.

```jsx
<Rect
  x={0}
  y={0}
  width={100}
  height={50}
  fill="blue"
  stroke="black"
  strokeWidth={2}
  rx={5}
  ry={5}
  opacity={0.8}
/>
```

| Prop                     | Type        | Default | Description                      |
| ------------------------ | ----------- | ------- | -------------------------------- |
| `x` `y` `width` `height` | `number`    | -       | Geometric bounds                 |
| `rx` `ry`                | `number`    | -       | Corner radii                     |
| Others                   | `RectProps` | -       | Native `<rect>` attributes       |

## Ellipse {#ellipse}

Ellipse draws an oval; equal width and height create a circle.

```jsx
<Ellipse
  x={0}
  y={0}
  width={100}
  height={60}
  fill="red"
  stroke="black"
  strokeWidth={2}
/>
<Ellipse x={200} y={20} width={100} height={100} fill="#4ECB73" stroke="#1B4224" />
```

| Prop                     | Type        | Default | Description                          |
| ------------------------ | ----------- | ------- | ------------------------------------ |
| `x` `y` `width` `height` | `number`    | `0`     | Bounding box geometry (top-left).     |
| Others                   | `EllipseProps` | -       | `<ellipse>` attributes               |

> `x`/`y` denote the top-left corner of the bounding box, not the center.

## Path {#path}

Path corresponds to `<path>`; define arbitrary outlines with the `d` attribute.

```jsx
<Path
  d="M 0 0 L 100 100 L 100 0 Z"
  fill="green"
  stroke="black"
  strokeWidth={2}
  width={100}
  height={100}
/>
```

When `x` or `y` is provided, the component auto-translates the path, emitting `transform="translate(x, y)"`.

| Prop    | Type        | Default     | Description                                                                 |
| ------- | ----------- | ----------- | --------------------------------------------------------------------------- |
| `d`     | `string`    | Required    | Path data.                                                                   |
| `x` `y` | `number`    | `undefined` | Overrides `transform`. Use a manual `transform` string when combining transforms. |
| Others  | `PathProps` | -           | Native `<path>` attributes.                                                  |

## Polygon {#polygon}

Polygon wraps `<polygon>` and accepts a list of point objects.

```jsx
<Polygon
  points={[
    {x: 0, y: 0},
    {x: 100, y: 0},
    {x: 50, y: 100},
  ]}
  fill="purple"
  stroke="black"
  strokeWidth={2}
/>
```

> `points` must be an array of objects (`{x, y}[]`), not a string.

| Prop     | Type                         | Default     | Description                            |
| -------- | ---------------------------- | ----------- | -------------------------------------- |
| `points` | `{ x: number; y: number }[]` | `[]`        | Converted to `points="x1,y1 x2,y2..."`. |
| `x` `y`  | `number`                     | `undefined` | Generates `translate(x, y)` if present. |
| Others   | `PolygonProps`               | -           | Native `<polygon>` attributes           |

## Text {#text}

Render text similarly to `<text>`. Supports alignment, background, and wrapping.

```jsx
<Text
  x={0}
  y={0}
  width={200}
  height={100}
  fontSize={14}
  fontWeight="bold"
  fontFamily="Arial"
  alignHorizontal="center"
  alignVertical="middle"
  lineHeight={1.5}
  wordWrap={true}
  fill="#000000"
  backgroundColor="#ffff00"
>
  Multi-line text supported
</Text>
```

When `backgroundColor` is set to a value other than `none`, the output wraps the text and a background rectangle inside a `<g>`.

| Prop                             | Type                            | Default             | Description                                |
| -------------------------------- | ------------------------------- | ------------------- | ------------------------------------------ |
| `x` `y` `width` `height`         | `number`                        | `0`                 | Text frame dimensions.                     |
| `alignHorizontal`                | `'left' \| 'center' \| 'right'` | `left`              | Horizontal alignment.                      |
| `alignVertical`                  | `'top' \| 'middle' \| 'bottom'` | `top`               | Vertical alignment.                        |
| `fontSize`                       | `number`                        | `14`                | Font size.                                 |
| `fontFamily` `fontStyle` `fontWeight` `textDecoration` | `string`            | -                   | Font styling props.                        |
| `letterSpacing` `wordSpacing`    | `number`                        | -                   | Letter and word spacing.                   |
| `lineHeight`                     | `number`                        | -                   | Multiplier that adjusts baseline when > 1. |
| `wordWrap`                       | `boolean`                       | -                   | Enable automatic wrapping.                 |
| `opacity` `fill`                | -                               | `opacity=1` `fill='black'` | Fill color and transparency.          |
| `backgroundColor`               | `string`                        | `none`              | Non-`none` values emit a background rect.   |
| `backgroundOpacity`             | `number`                        | `1`                 | Background opacity.                        |
| `backgroundRadius`              | `number`                        | `0`                 | Background corner radius.                  |
| `children`                      | `string \| number`              | Required            | The text content.                          |
