---
title: Built-in Components
---

AntV Infographic exports the following components to facilitate standardized design and maintain consistency across infographics. These components can be directly used when customizing [structure](/learn/design#structure) and [data items](/learn/design#item).

```tsx
import {
  BtnAdd,
  BtnRemove,
  BtnsGroup,
  Gap,
  Illus,
  ItemDesc,
  ItemIcon,
  ItemIconCircle,
  ItemLabel,
  ItemValue,
  ItemsGroup,
  ShapesGroup,
  Title,
} from '@antv/infographic';
```

Internally, components write identifiers like `data-element-type` and `data-indexes`, which the renderer and editor use for data binding, styling, and interaction.

## Buttons {#btn}

Used to add or remove data items in edit mode. `indexes: number[]` describes the target data path for the operation (e.g., `[0]` represents the 0th data item, `[1, 2]` represents the 2nd child node in hierarchical data).

<Note>In non-edit mode, the renderer will hide buttons by default</Note>

### Add Button {#btn-add}

`BtnAdd` is rendered as a `20 × 20` rectangle (this rectangle will be rendered as an actual button component by the renderer), with `data-element-type="btn-add"`. You can pass regular `Rect` attributes to adjust position, size, and style.

```tsx
<BtnAdd indexes={[0]} x={120} y={40} width={24} height={24} rx={4} />
```

### Remove Button {#btn-remove}

`BtnRemove` is used the same way as `BtnAdd`, with `data-element-type="btn-remove"`.

```tsx
<BtnRemove indexes={[1]} x={120} y={80} />
```

### Button Group {#btns-group}

`BtnsGroup` is a `Group` with `data-element-type="btns-group"`, with default width and height of `0`, used to uniformly organize the position of multiple buttons without participating in layout calculations.

```tsx
<BtnsGroup>
  <BtnAdd indexes={[0]} x={0} y={0} />
  <BtnRemove indexes={[0]} x={36} y={0} />
</BtnsGroup>
```

## Title {#title}

`Title` is responsible for rendering the main title and description text, using `FlexLayout` for vertical arrangement and automatically calculating the overall height. Key properties:

- `title`, `desc`: Main title and subtitle text (optional, returns `null` when both are empty).
- `alignHorizontal`: Horizontal alignment, defaults to `center`.
- `width`: Text width, defaults to `720`.
- `descLineNumber`: Number of description lines, controls automatic height.
- `themeColors`: Required, used to apply theme colors (`title` uses `colorPrimaryText`, `desc` uses `colorTextSecondary`).

```tsx
<Title
  x={40}
  y={24}
  width={640}
  alignHorizontal="left"
  title="Market Overview"
  desc="Auto-wrap and calculate height according to descLineNumber"
  descLineNumber={2}
  themeColors={themeColors}
/>
```

## Gap {#gap}

`Gap` is a placeholder component that doesn't render any graphics, used only for creating spacing in layouts, such as inserting gaps in `FlexLayout`. It must be written directly as `<Gap />`, and should not be assigned to a variable before use.

```tsx
<FlexLayout flexDirection="row" gap={12}>
  <ItemLabel indexes={[0]}>Title</ItemLabel>
  <Gap width={8} />
  <ItemValue indexes={[0]} value={32} />
</FlexLayout>
```

## Illustration {#illus}

Illustration component that replaces an SVG area with illustration resources from data (image or external SVG). Defaults to light gray fill to indicate position. When `indexes` is passed, it's marked as an item illustration (`data-element-type="item-illus"`), otherwise treated as a global illustration (`data-element-type="illus"`).

```tsx
<Illus x={40} y={20} width={200} height={120} rx={12} />
<Illus indexes={[1]} x={0} y={0} width={96} height={96} />
```

## Item Label {#item-label}

Data item label text, with default width `100`, font size `18`, bold, line height `1.4`, automatically calculates height and writes `data-element-type="item-label"`. Must pass `indexes` for data binding.

```tsx
<ItemLabel indexes={[index]} width={160} fill="#222">
  {datum.label}
</ItemLabel>
```

## Item Description {#item-desc}

Data item description text, with default width `100`, font size `14`, text color `#666`, `wordWrap` enabled. Controls maximum lines through `lineNumber` (defaults to 2 lines) and automatically calculates height accordingly. Returns `null` when `children` is not passed.

```tsx
<ItemDesc indexes={[index]} width={220} lineNumber={3}>
  {datum.desc}
</ItemDesc>
```

## Item Icon {#item-icon}

Square icon placeholder, with default size `32 × 32` and light gray fill, can be modified through `size` or `width/height`, `data-element-type="item-icon"`.

### Circle Icon {#item-icon-circle}

`ItemIconCircle` additionally provides a circular background (`fill`) and an internal square icon background color (`colorBg`, defaults to white), with a default overall size of `50`. The internal square size is approximately `90%` of the outer circle, centered.

```tsx
<ItemIconCircle
  indexes={[index]}
  x={0}
  y={0}
  size={48}
  fill={themeColors.colorPrimary}
  colorBg="#fff8e6"
/>
```

## Item Value {#item-value}

Numeric text for data items, requires `value: number`, can use `formatter` to control display format (defaults to `String(value)`). Default font size `14`, line height `1.4`, automatically calculates height, and writes `data-value` for runtime data retrieval.

```tsx
<ItemValue
  indexes={[index]}
  value={datum.value}
  formatter={(v) => `${v}%`}
  fontSize={20}
  fontWeight="bold"
/>
```

## Items Group {#items-group}

A container based on `Group`, `data-element-type="items-group"`, typically used in `structure` to uniformly place `Item` components, working with layout algorithms to calculate overall size.

## Shapes Group {#shapes-group}

`ShapesGroup` is used the same way as `Group`, but with `data-element-type="shapes-group"` marker, facilitating theme styling to apply to geometric shapes within the group in batches.
