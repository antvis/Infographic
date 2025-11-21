---
title: 内置数据项
---

以下为内置数据项的样式特点与参数类型（未列出的 props 继承自 [BaseItemProps](/reference/infographic-types#base-item-props)）。

使用时通过下方 `id` 指定。

## BadgeCard {#badge-card}

**id**: `badge-card`

卡片 + 徽章（径向渐变），支持数值与描述。

```ts
interface BadgeCardProps extends BaseItemProps {
  width?: number; // 背景宽度，默认 200
  height?: number; // 背景高度，默认 80
  iconSize?: number; // 徽章内图标尺寸，默认 24
  badgeSize?: number; // 徽章外圈尺寸，默认 32
  gap?: number; // 徽章与内容间距，默认 8
}
```

## CandyCardLite {#candy-card-lite}

**id**: `candy-card-lite`

圆角卡片，右上白色切角 + 图标，左侧标题/描述。

```ts
interface CandyCardLiteProps extends BaseItemProps {
  width?: number; // 卡片宽度，默认 280
  height?: number; // 卡片高度，默认 140
}
```

## CapsuleItem {#capsule-item}

**id**: `capsule-item`

胶囊背景，图标与文本可左右切换。

```ts
interface CapsuleItemProps extends BaseItemProps {
  width?: number; // 胶囊宽度，默认 300
  height?: number; // 胶囊高度，默认 80
  gap?: number; // 文本上下间距，默认 12
  iconPadding?: number; // 图标相对圆形背景的内边距，默认 height/10
}
```

## CircleNode {#circle-node}

**id**: `circle-node`

双层渐变圆节点，文本居中。

```ts
interface CircleNodeProps extends BaseItemProps {
  width?: number; // 直径优先使用 min(width, height)，默认 240
  height?: number;
}
```

## CircularProgress {#circular-progress}

**id**: `circular-progress`

圆环进度条，中心数值+底部标签。

```ts
interface CircularProgressProps extends BaseItemProps {
  size?: number; // 组件整体尺寸，默认 120
  strokeWidth?: number; // 圆环粗细，默认 12
  gap?: number; // 圆环与底部标签的间距，默认 8
}
```

## CompactCard {#compact-card}

**id**: `compact-card`

小卡片，左侧竖条+图标，右侧标题和可选数值/描述。

```ts
interface CompactCardProps extends BaseItemProps {
  width?: number; // 卡片宽度，默认 200
  height?: number; // 卡片高度，默认 60
  iconSize?: number; // 图标尺寸，默认 20
  gap?: number; // 内部间距，默认 8
}
```

## DoneList {#done-list}

**id**: `done-list`

勾选形状 + 标题横排，适合步骤/完成项。

```ts
interface DoneListProps extends BaseItemProps {
  width?: number; // 总宽度，默认 300
  height?: number; // 总高度，默认 30
  iconSize?: number; // 勾选形状尺寸，默认 30
  gap?: number; // 图标与文本间距，默认 5
}
```

## HorizontalIconArrow {#horizontal-icon-arrow}

**id**: `horizontal-icon-arrow`

竖向排布：标签/描述 + 点线 + 图标 + 箭头（可上下翻转）。

```ts
interface HorizontalIconArrowProps extends BaseItemProps {
  width?: number; // 组件宽度，默认 140
}
```

## HorizontalIconLine {#horizontal-icon-line}

**id**: `horizontal-icon-line`

时间线样式：横线节点，标签/描述与图标/时间可上下切换。

```ts
interface HorizontalIconLineProps extends BaseItemProps {
  width?: number; // 组件宽度，默认 160
}
```

## IconBadge {#icon-badge}

**id**: `icon-badge`

圆形渐变徽章，居中图标，右上数值角标，底部标签。

```ts
interface IconBadgeProps extends BaseItemProps {
  size?: number; // 主徽章尺寸，默认 80
  iconSize?: number; // 中心图标尺寸，默认 28
  badgeSize?: number; // 右上角标尺寸，默认 24
  gap?: number; // 徽章与标签的间距，默认 8
}
```

## IndexedCard {#indexed-card}

**id**: `indexed-card`

左上编号角标，支持标题与描述。

```ts
interface IndexedCardProps extends BaseItemProps {
  width?: number; // 卡片宽度，默认 200
  borderRadius?: number; // 卡片圆角，默认 12
  padding?: number; // 内边距，默认 16
  separatorHeight?: number; // 标题分隔线高度，默认 2
  indexFontSize?: number; // 序号字体，默认 20
  labelFontSize?: number; // 标题字体，默认 16
  gap?: number; // 序号与标题间距，默认 8
}
```

## LCornerCard {#l-corner-card}

**id**: `l-corner-card`

左上弯角色块包裹图标，右侧标题/描述。

```ts
interface LCornerCardProps extends BaseItemProps {
  width?: number; // 卡片宽度，默认 140
  iconSize?: number; // 角落图标尺寸，默认 24
}
```

## LetterCard {#letter-card}

**id**: `letter-card`

可选渐变/斜纹/底部阴影的字母卡片。

```ts
interface LetterCardProps extends BaseItemProps {
  width?: number; // 卡片宽度，默认 280
  height?: number; // 卡片高度，默认 160
  showStripe?: boolean; // 是否显示斜纹
  showGradient?: boolean; // 是否显示背景渐变
  showBottomShade?: boolean; // 是否显示底部阴影
}
```

## PillBadge {#pill-badge}

**id**: `pill-badge`

胶囊标签 + 说明文本，可控制胶囊尺寸。

```ts
interface PillBadgeProps extends BaseItemProps {
  width?: number; // 组件最大宽度，默认 300（无描述时等于 pillWidth）
  pillWidth?: number; // 胶囊宽度，默认 120
  pillHeight?: number; // 胶囊高度，默认 36
  gap?: number; // 胶囊与描述间距，默认 16
}
```

## PlainText {#plain-text}

**id**: `plain-text`

仅渲染单行或格式化后的文本，受 `positionH` 控制对齐。

```ts
interface LabelTextProps extends BaseItemProps {
  width?: number; // 文本宽度，默认 120
  formatter?: (text?: string) => string; // 文案格式化，默认原样
  usePaletteColor?: boolean; // 是否使用主色，默认 false
}
```

## ProgressCard {#progress-card}

**id**: `progress-card`

水平进度条卡片：标签/数值/描述 + 底部渐变进度条。

```ts
interface ProgressCardProps extends BaseItemProps {
  width?: number; // 卡片宽度，默认 280
  height?: number; // 卡片高度，默认 120
  iconSize?: number; // 左侧图标大小，默认 32
  gap?: number; // 内部间距，默认 12
  progressHeight?: number; // 进度条高度，默认 8
  borderRadius?: number; // 卡片圆角，默认 12
}
```

## QuarterCircular {#quarter-circular}

**id**: `quarter-circular`

扇形装饰+序号圆点的分块卡片。

```ts
interface QuarterCircularProps extends BaseItemProps {
  width?: number; // 卡片宽度，默认 280
  height?: number; // 卡片高度，默认 120
  iconSize?: number; // 图标尺寸，默认 30
  circleRadius?: number; // 扇形参考圆半径，默认 80
}
```

## QuarterSimpleCard {#quarter-simple-card}

**id**: `quarter-simple-card`

简洁矩形卡，左上圆点序号 + 标题/描述。

```ts
interface QuarterSimpleCardProps extends BaseItemProps {
  width?: number; // 卡片宽度，默认 150
  height?: number; // 卡片高度，默认 150
  iconSize?: number; // 圆点或图标尺寸，默认 30
  padding?: number; // 内边距，默认 20
  borderRadius?: number; // 圆角，默认 16
}
```

## RibbonCard {#ribbon-card}

**id**: `ribbon-card`

顶部彩带横幅 + 图标行。

```ts
interface RibbonCardProps extends BaseItemProps {
  width?: number; // 卡片宽度，默认 240
  height?: number; // 卡片高度，默认 140
  iconSize?: number; // 图标尺寸，默认 28
  gap?: number; // 内容间距，默认 12
  ribbonHeight?: number; // 彩带高度，默认 32
}
```

## RoundedRectNode {#rounded-rect-node}

**id**: `rounded-rect-node`

胶囊矩形节点，描边 + 居中文本。

```ts
interface RoundedRectNodeProps extends BaseItemProps {
  width?: number; // 节点宽度，默认 300
  height?: number; // 节点高度，默认 40
  padding?: number; // 文本内边距，默认 4
}
```

## SimpleHorizontalArrow {#simple-horizontal-arrow}

**id**: `simple-horizontal-arrow`

上下文本 + 中间水平箭头，序号/时间在箭头中央，可上下翻转。

```ts
interface SimpleHorizontalArrowProps extends BaseItemProps {
  width?: number; // 箭头和文本宽度，默认 140
  flipped?: boolean; // 是否翻转上下（语义等价 positionV），默认 false
}
```

## SimpleIllusItem {#simple-illus-item}

**id**: `simple-illus-item`

上方插图，居中标题 + 描述，可启用主色。

```ts
interface SimpleIllusItemProps extends BaseItemProps {
  width?: number; // 组件宽度，默认 180
  illusSize?: number; // 插图尺寸，默认等于 width
  gap?: number; // 元素间距，默认 8
  usePaletteColor?: boolean; // 是否使用主色渲染文字，默认 false
}
```

## SimpleItem {#simple-item}

**id**: `simple-item`

常用列表项：可选图标（方形/圆形）、标题、描述，可自定尺寸与主色。

```ts
interface SimpleItemProps extends BaseItemProps {
  width?: number; // 组件宽度，默认 200
  height?: number; // 固定高度（可选）
  gap?: number; // 元素间距，默认 4
  showIcon?: boolean; // 是否显示图标，默认 true
  iconSize?: number; // 图标尺寸，默认 30
  iconType?: 'default' | 'circle'; // 图标形态，默认 'default'
  usePaletteColor?: boolean; // 标签是否用主色，默认 false
}
```

## SimpleVerticalArrow {#simple-vertical-arrow}

**id**: `simple-vertical-arrow`

左右文本 + 垂直箭头，序号在箭头内，可左右翻转。

```ts
interface SimpleVerticalArrowProps extends BaseItemProps {
  height?: number; // 组件高度，默认 140
  flipped?: boolean; // 是否左右翻转（语义等价 positionH），默认 false
}
```

## UnderlineText {#underline-text}

**id**: `underline-text`

标题 + 下划线装饰，可选描述。

```ts
interface UnderlineTextProps extends BaseItemProps {
  width?: number; // 组件宽度，默认 200
  gap?: number; // 文本与下划线/描述间距，默认 4
}
```

## VerticalIconArrow {#vertical-icon-arrow}

**id**: `vertical-icon-arrow`

左右文本/图标 + 垂直箭头，带点状连接线，可左右翻转。

```ts
interface VerticalIconArrowProps extends BaseItemProps {
  height?: number; // 组件高度，默认 140
  flipped?: boolean; // 是否左右翻转（语义等价 positionH），默认 false
}
```
