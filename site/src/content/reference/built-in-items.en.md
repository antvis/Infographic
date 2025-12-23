---
title: Built-in Items
---

Below are the styling features and parameter types for built-in data items (unlisted props inherit from [BaseItemProps](/reference/infographic-types#base-item-props)).

Use the `id` below to specify them.

## BadgeCard {#badge-card}

**id**: `badge-card`

Card + badge (radial gradient), supports value and description.

```ts
interface BadgeCardProps extends BaseItemProps {
  width?: number; // Background width, defaults to 200
  height?: number; // Background height, defaults to 80
  iconSize?: number; // Icon size inside badge, defaults to 24
  badgeSize?: number; // Outer badge size, defaults to 32
  gap?: number; // Gap between badge and content, defaults to 8
}
```

## CandyCardLite {#candy-card-lite}

**id**: `candy-card-lite`

Rounded card, white cut corner on top-right + icon, left side title/description.

```ts
interface CandyCardLiteProps extends BaseItemProps {
  width?: number; // Card width, defaults to 280
  height?: number; // Card height, defaults to 140
}
```

## CapsuleItem {#capsule-item}

**id**: `capsule-item`

Capsule background, icon and text can switch left-right.

```ts
interface CapsuleItemProps extends BaseItemProps {
  width?: number; // Capsule width, defaults to 300
  height?: number; // Capsule height, defaults to 80
  gap?: number; // Text vertical spacing, defaults to 12
  iconPadding?: number; // Icon padding relative to circle background, defaults to height/10
}
```

## CircleNode {#circle-node}

**id**: `circle-node`

Double-layer gradient circle node, text centered.

```ts
interface CircleNodeProps extends BaseItemProps {
  width?: number; // Diameter uses min(width, height), defaults to 240
  height?: number;
}
```

## CircularProgress {#circular-progress}

**id**: `circular-progress`

Circular progress bar, center value + bottom label.

```ts
interface CircularProgressProps extends BaseItemProps {
  size?: number; // Overall component size, defaults to 120
  strokeWidth?: number; // Ring thickness, defaults to 12
  gap?: number; // Gap between ring and bottom label, defaults to 8
}
```

## CompactCard {#compact-card}

**id**: `compact-card`

Small card, left vertical bar + icon, right title and optional value/description.

```ts
interface CompactCardProps extends BaseItemProps {
  width?: number; // Card width, defaults to 200
  height?: number; // Card height, defaults to 60
  iconSize?: number; // Icon size, defaults to 20
  gap?: number; // Internal spacing, defaults to 8
}
```

## DoneList {#done-list}

**id**: `done-list`

Check shape + title horizontal row, suitable for steps/completed items.

```ts
interface DoneListProps extends BaseItemProps {
  width?: number; // Total width, defaults to 300
  height?: number; // Total height, defaults to 30
  iconSize?: number; // Check shape size, defaults to 30
  gap?: number; // Gap between icon and text, defaults to 5
}
```

## HorizontalIconArrow {#horizontal-icon-arrow}

**id**: `horizontal-icon-arrow`

Vertical layout: label/description + dotted line + icon + arrow (can flip up-down).

```ts
interface HorizontalIconArrowProps extends BaseItemProps {
  width?: number; // Component width, defaults to 140
}
```

## HorizontalIconLine {#horizontal-icon-line}

**id**: `horizontal-icon-line`

Timeline style: horizontal line node, label/description and icon/time can switch up-down.

```ts
interface HorizontalIconLineProps extends BaseItemProps {
  width?: number; // Component width, defaults to 160
}
```

## IconBadge {#icon-badge}

**id**: `icon-badge`

Circular gradient badge, centered icon, top-right value corner badge, bottom label.

```ts
interface IconBadgeProps extends BaseItemProps {
  size?: number; // Main badge size, defaults to 80
  iconSize?: number; // Center icon size, defaults to 28
  badgeSize?: number; // Top-right corner badge size, defaults to 24
  gap?: number; // Gap between badge and label, defaults to 8
}
```

## IndexedCard {#indexed-card}

**id**: `indexed-card`

Top-left numbered corner badge, supports title and description.

```ts
interface IndexedCardProps extends BaseItemProps {
  width?: number; // Card width, defaults to 200
  borderRadius?: number; // Card border radius, defaults to 12
  padding?: number; // Inner padding, defaults to 16
  separatorHeight?: number; // Title separator height, defaults to 2
  indexFontSize?: number; // Index font size, defaults to 20
  labelFontSize?: number; // Title font size, defaults to 16
  gap?: number; // Gap between index and title, defaults to 8
}
```

## LCornerCard {#l-corner-card}

**id**: `l-corner-card`

Top-left curved color block wrapping icon, right side title/description.

```ts
interface LCornerCardProps extends BaseItemProps {
  width?: number; // Card width, defaults to 140
  iconSize?: number; // Corner icon size, defaults to 24
}
```

## LetterCard {#letter-card}

**id**: `letter-card`

Optional gradient/stripe/bottom shadow letter card.

```ts
interface LetterCardProps extends BaseItemProps {
  width?: number; // Card width, defaults to 280
  height?: number; // Card height, defaults to 160
  showStripe?: boolean; // Whether to show stripes
  showGradient?: boolean; // Whether to show background gradient
  showBottomShade?: boolean; // Whether to show bottom shadow
}
```

## PillBadge {#pill-badge}

**id**: `pill-badge`

Pill badge + description text, can control pill size.

```ts
interface PillBadgeProps extends BaseItemProps {
  width?: number; // Component max width, defaults to 300 (equals pillWidth when no description)
  pillWidth?: number; // Pill width, defaults to 120
  pillHeight?: number; // Pill height, defaults to 36
  gap?: number; // Gap between pill and description, defaults to 16
}
```

## PlainText {#plain-text}

**id**: `plain-text`

Renders only single line or formatted text, alignment controlled by `positionH`.

```ts
interface LabelTextProps extends BaseItemProps {
  width?: number; // Text width, defaults to 120
  formatter?: (text?: string) => string; // Text formatter, defaults to original
  usePaletteColor?: boolean; // Whether to use primary color, defaults to false
}
```

## ProgressCard {#progress-card}

**id**: `progress-card`

Horizontal progress card: label/value/description + bottom gradient progress bar.

```ts
interface ProgressCardProps extends BaseItemProps {
  width?: number; // Card width, defaults to 280
  height?: number; // Card height, defaults to 120
  iconSize?: number; // Left icon size, defaults to 32
  gap?: number; // Internal spacing, defaults to 12
  progressHeight?: number; // Progress bar height, defaults to 8
  borderRadius?: number; // Card border radius, defaults to 12
}
```

## QuarterCircular {#quarter-circular}

**id**: `quarter-circular`

Sector decoration + numbered dot block card.

```ts
interface QuarterCircularProps extends BaseItemProps {
  width?: number; // Card width, defaults to 280
  height?: number; // Card height, defaults to 120
  iconSize?: number; // Icon size, defaults to 30
  circleRadius?: number; // Sector reference circle radius, defaults to 80
}
```

## QuarterSimpleCard {#quarter-simple-card}

**id**: `quarter-simple-card`

Simple rectangular card, top-left dot number + title/description.

```ts
interface QuarterSimpleCardProps extends BaseItemProps {
  width?: number; // Card width, defaults to 150
  height?: number; // Card height, defaults to 150
  iconSize?: number; // Dot or icon size, defaults to 30
  padding?: number; // Inner padding, defaults to 20
  borderRadius?: number; // Border radius, defaults to 16
}
```

## RibbonCard {#ribbon-card}

**id**: `ribbon-card`

Top ribbon banner + icon row.

```ts
interface RibbonCardProps extends BaseItemProps {
  width?: number; // Card width, defaults to 240
  height?: number; // Card height, defaults to 140
  iconSize?: number; // Icon size, defaults to 28
  gap?: number; // Content spacing, defaults to 12
  ribbonHeight?: number; // Ribbon height, defaults to 32
}
```

## RoundedRectNode {#rounded-rect-node}

**id**: `rounded-rect-node`

Capsule rectangle node, stroke + centered text.

```ts
interface RoundedRectNodeProps extends BaseItemProps {
  width?: number; // Node width, defaults to 300
  height?: number; // Node height, defaults to 40
  padding?: number; // Text padding, defaults to 4
}
```

## SimpleHorizontalArrow {#simple-horizontal-arrow}

**id**: `simple-horizontal-arrow`

Top-bottom text + middle horizontal arrow, index/time in center of arrow, can flip up-down.

```ts
interface SimpleHorizontalArrowProps extends BaseItemProps {
  width?: number; // Arrow and text width, defaults to 140
  flipped?: boolean; // Whether to flip up-down (semantically equivalent to positionV), defaults to false
}
```

## SimpleIllusItem {#simple-illus-item}

**id**: `simple-illus-item`

Top illustration, centered title + description, can enable primary color.

```ts
interface SimpleIllusItemProps extends BaseItemProps {
  width?: number; // Component width, defaults to 180
  illusSize?: number; // Illustration size, defaults to width
  gap?: number; // Element spacing, defaults to 8
  usePaletteColor?: boolean; // Whether to use primary color for text rendering, defaults to false
}
```

## SimpleItem {#simple-item}

**id**: `simple-item`

Common list item: optional icon (square/circle), title, description, can customize size and primary color.

```ts
interface SimpleItemProps extends BaseItemProps {
  width?: number; // Component width, defaults to 200
  height?: number; // Fixed height (optional)
  gap?: number; // Element spacing, defaults to 4
  showIcon?: boolean; // Whether to show icon, defaults to true
  iconSize?: number; // Icon size, defaults to 30
  iconType?: 'default' | 'circle'; // Icon type, defaults to 'default'
  usePaletteColor?: boolean; // Whether label uses primary color, defaults to false
}
```

## SimpleVerticalArrow {#simple-vertical-arrow}

**id**: `simple-vertical-arrow`

Left-right text + vertical arrow, index inside arrow, can flip left-right.

```ts
interface SimpleVerticalArrowProps extends BaseItemProps {
  height?: number; // Component height, defaults to 140
  flipped?: boolean; // Whether to flip left-right (semantically equivalent to positionH), defaults to false
}
```

## UnderlineText {#underline-text}

**id**: `underline-text`

Title + underline decoration, optional description.

```ts
interface UnderlineTextProps extends BaseItemProps {
  width?: number; // Component width, defaults to 200
  gap?: number; // Gap between text and underline/description, defaults to 4
}
```

## VerticalIconArrow {#vertical-icon-arrow}

**id**: `vertical-icon-arrow`

Left-right text/icon + vertical arrow, with dotted connecting line, can flip left-right.

```ts
interface VerticalIconArrowProps extends BaseItemProps {
  height?: number; // Component height, defaults to 140
  flipped?: boolean; // Whether to flip left-right (semantically equivalent to positionH), defaults to false
}
```
