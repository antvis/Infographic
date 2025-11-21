---
title: 内置组件
---

AntV Infographic 导出了以下组件，便于规范化设计，并保持信息图之间的一致性。在自定义[结构](/learn/design#structure)和[数据项](/learn/design#item)时，可以直接使用这些组件。

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

组件内部会写入 `data-element-type`、`data-indexes` 等标识，渲染器与编辑器会据此完成数据绑定、风格化与交互。

## 按钮 {#btn}

用于在编辑模式下新增或删除数据项。`indexes: number[]` 用于描述操作的目标数据路径（如 `[0]` 表示第 0 条数据，`[1, 2]` 表示层级数据中的第 2 个子节点）。

<Note>非编辑状态下，渲染器会默认隐藏按钮</Note>

### 添加按钮 {#btn-add}

`BtnAdd` 被渲染为一个 `20 × 20` 的矩形（该矩形会被渲染器渲染为实际的按钮组件），`data-element-type="btn-add"`。传入常规 `Rect` 属性可调整位置、尺寸与样式。

```tsx
<BtnAdd indexes={[0]} x={120} y={40} width={24} height={24} rx={4} />
```

### 删除按钮 {#btn-remove}

`BtnRemove` 与 `BtnAdd` 用法一致，`data-element-type="btn-remove"`。

```tsx
<BtnRemove indexes={[1]} x={120} y={80} />
```

### 按钮分组 {#btns-group}

`BtnsGroup` 是带有 `data-element-type="btns-group"` 的 `Group`，默认宽高为 `0`，用于统一组织多个按钮的位置，并不参与布局计算。

```tsx
<BtnsGroup>
  <BtnAdd indexes={[0]} x={0} y={0} />
  <BtnRemove indexes={[0]} x={36} y={0} />
</BtnsGroup>
```

## 标题 {#title}

`Title` 负责渲染主标题与描述文案，使用 `FlexLayout` 垂直排列，自动计算整体高度。关键属性：

- `title`、`desc`：主标题与副标题文案（可选，二者都为空时返回 `null`）。
- `alignHorizontal`：水平对齐方式，默认为 `center`。
- `width`：文本宽度，默认 `720`。
- `descLineNumber`：描述行数，控制自动高度。
- `themeColors`：必填，用于应用主题色（`title` 使用 `colorPrimaryText`，`desc` 使用 `colorTextSecondary`）。

```tsx
<Title
  x={40}
  y={24}
  width={640}
  alignHorizontal="left"
  title="市场概览"
  desc="自动换行并按照 descLineNumber 计算高度"
  descLineNumber={2}
  themeColors={themeColors}
/>
```

## 占位符 {#gap}

`Gap` 是一个不会渲染任何图形的占位组件，仅用于布局时制造空隙，例如在 `FlexLayout` 中插入间距。必须直接写成 `<Gap />`，注意不要先赋值给变量再使用。

```tsx
<FlexLayout flexDirection="row" gap={12}>
  <ItemLabel indexes={[0]}>标题</ItemLabel>
  <Gap width={8} />
  <ItemValue indexes={[0]} value={32} />
</FlexLayout>
```

## 插图 {#illus}

插图组件，将 SVG 区域替换为数据中的插图资源（图片或外部 SVG）。默认填充为浅灰色以提示位置。传入 `indexes` 时会标记为数据项的插图(`data-element-type="item-illus"`)，否则视为全局插图(`data-element-type="illus"`)。

```tsx
<Illus x={40} y={20} width={200} height={120} rx={12} />
<Illus indexes={[1]} x={0} y={0} width={96} height={96} />
```

## 数据项标题 {#item-label}

数据项标题文本，默认宽度 `100`，字号 `18`、加粗、行高 `1.4`，自动计算高度并写入 `data-element-type="item-label"`。必须传入 `indexes` 以完成数据绑定。

```tsx
<ItemLabel indexes={[index]} width={160} fill="#222">
  {datum.label}
</ItemLabel>
```

## 数据项描述 {#item-desc}

数据项描述文本，默认宽度 `100`，字号 `14`，字色 `#666`，`wordWrap` 开启。通过 `lineNumber` 控制最大行数（默认 2 行）并据此自动计算高度。未传入 `children` 时返回 `null`。

```tsx
<ItemDesc indexes={[index]} width={220} lineNumber={3}>
  {datum.desc}
</ItemDesc>
```

## 数据项图标 {#item-icon}

方形图标占位，默认尺寸 `32 × 32`、浅灰填充，可通过 `size` 或 `width/height` 修改，`data-element-type="item-icon"`。

### 圆形图标 {#item-icon-circle}

`ItemIconCircle` 额外提供圆形背景（`fill`）与内部方形图标背景色（`colorBg`，默认白色），默认整体尺寸为 `50`。内部正方形尺寸约为外圈的 `90%`，居中摆放。

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

## 数据项值 {#item-value}

数据项的数值文本，必填 `value: number`，可用 `formatter` 控制展示格式（默认 `String(value)`）。默认字号 `14`、行高 `1.4`，自动计算高度，并写入 `data-value` 便于运行时取数。

```tsx
<ItemValue
  indexes={[index]}
  value={datum.value}
  formatter={(v) => `${v}%`}
  fontSize={20}
  fontWeight="bold"
/>
```

## 数据项分组 {#items-group}

基于 `Group` 的容器，`data-element-type="items-group"`，通常在 `structure` 中用于统一放置 `Item` 组件，配合布局算法计算整体尺寸。

## 图形分组 {#shapes-group}

`ShapesGroup` 与 `Group` 用法一致，但带有 `data-element-type="shapes-group"` 标记，便于主题风格化批量作用于组内的几何形状。
