---
title: Built-in Structures
---

Below are the styling features and parameter types for built-in structures (unlisted props inherit from [BaseStructureProps](/reference/infographic-types#base-structure-props)).

Use the `id` below to specify them.

## ChartColumn {#chart-column}

**id**: `chart-column`

Vertical bar chart, supports positive and negative values with values displayed above/below bars, data items arranged at the bottom.

```ts
export interface ChartColumnProps extends BaseStructureProps {
  columnGap?: number; // Gap between columns
  columnWidth?: number; // Column width
  padding?: Padding; // Outer padding
  showValue?: boolean; // Whether to show values
  valueFormatter?: (value: number, datum: ItemDatum) => string; // Value formatter
}
```

## CompareBinaryHorizontal {#compare-binary-horizontal}

**id**: `compare-binary-horizontal`

Left-right symmetric binary comparison structure, can insert "VS" or other separators in the middle, sub-items arranged vertically on each side.

```ts
export interface CompareBinaryHorizontalProps extends BaseStructureProps {
  gap?: number; // Gap between sub-items on same side
  groupGap?: number; // Distance from sub-item group to separator
  opposite?: boolean; // Whether left and right are opposite
  flipped?: boolean; // Whether to flip left-right entirely
  dividerType?: string; // Separator type
}
```

## CompareHierarchyLeftRight {#compare-hierarchy-left-right}

**id**: `compare-hierarchy-left-right`

Comparison of two hierarchical trees on left and right, can choose surround layout or flat layout, supports decorations like dots/dividing lines.

```ts
export interface CompareHierarchyLeftRightProps extends BaseStructureProps {
  gap?: number; // Vertical gap between nodes on same side
  groupGap?: number; // Gap between left and right root nodes
  surround?: boolean; // Whether child nodes surround root node
  decoration?: 'none' | 'dot-line' | 'arc-dot' | 'split-line'; // Decoration style
  flipRoot?: boolean; // Flip root node direction
  flipLeaf?: boolean; // Flip leaf node direction
}
```

## CompareHierarchyRow {#compare-hierarchy-row}

**id**: `compare-hierarchy-row`

Horizontal multi-column hierarchical list, top level as column headers, sub-items arranged vertically within columns, can enable light column backgrounds.

```ts
export interface CompareHierarchyRowProps extends BaseStructureProps {
  gap?: number; // Gap between columns
  itemGap?: number; // Vertical gap between sub-items
  columnWidth?: number; // Column width
  itemPadding?: number; // Sub-item left-right padding
  showColumnBackground?: boolean; // Whether to show column background
  columnBackgroundAlpha?: number; // Background opacity
}
```

## HierarchyTree {#hierarchy-tree}

**id**: `hierarchy-tree`

Configurable tree structure, supports straight/curved connections, arrow/node markers, branch/level coloring, and other rich styles.

```ts
export interface HierarchyTreeProps extends BaseStructureProps {
  levelGap?: number; // Parent-child vertical gap
  nodeGap?: number; // Horizontal gap at same level
  edgeType?: 'straight' | 'curved'; // Connection line type
  edgeColorMode?: 'solid' | 'gradient'; // Line color mode
  edgeWidth?: number; // Line width
  edgeStyle?: 'solid' | 'dashed'; // Line style
  edgeDashPattern?: string; // Custom dash pattern
  edgeCornerRadius?: number; // Straight line corner radius
  edgeOffset?: number; // Gap between line and node
  edgeOrigin?: 'center' | 'distributed'; // Origin mode
  edgeOriginPadding?: number; // Distributed origin padding
  edgeMarker?: 'none' | 'dot' | 'arrow'; // Marker style
  markerSize?: number; // Marker size
  colorMode?: 'level' | 'branch' | 'node-flat'; // Node coloring mode
}
```

## ListRow {#list-row}

**id**: `list-row`

Horizontal list layout, optional staggered (zigzag) up-down alignment.

```ts
export interface ListRowProps extends BaseStructureProps {
  gap?: number; // Gap between data items
  zigzag?: boolean; // Whether to stagger up-down
}
```

## ListColumn {#list-column}

**id**: `list-column`

Vertical list layout, optional width and left-right flipped zigzag effect.

```ts
export interface ListColumnProps extends BaseStructureProps {
  width?: number; // Width
  gap?: number; // Gap between data items
  zigzag?: boolean; // Whether to stagger left-right
}
```

## ListGrid {#list-grid}

**id**: `list-grid`

Regular grid list, supports column count and gap configuration, optional staggered vertical flip.

```ts
export interface ListGridProps extends BaseStructureProps {
  columns?: number; // Number of columns
  gap?: number; // Grid gap
  zigzag?: boolean; // Whether to stagger with vertical flip
}
```

## ListPyramid {#list-pyramid}

**id**: `list-pyramid`

Pyramid-style layered grid, data items centered at each level, adjustable gap between levels.

```ts
export interface ListPyramidProps extends BaseStructureProps {
  gap?: number; // Gap within same level
  levelGap?: number; // Gap between levels
}
```

## ListWaterfall {#list-waterfall}

**id**: `list-waterfall`

"Waterfall" layout, divided evenly by columns with staggered step offsets.

```ts
export interface ListWaterfallProps extends BaseStructureProps {
  columns?: number; // Number of columns
  gap?: number; // Gap between data items
  stepOffset?: number; // Step offset
}
```

## ListSector {#list-sector}

**id**: `list-sector`

Circular/sector partition, each sector contains a data item, center area for title.

```ts
export interface ListSectorProps extends BaseStructureProps {
  outerRadius?: number; // Outer radius
  innerRadius?: number; // Inner radius
  startAngle?: number; // Start angle
  endAngle?: number; // End angle
  gapAngle?: number; // Gap angle
}
```

## Quadrant {#quadrant}

**id**: `quadrant`

Four-quadrant layout, optional axis and dashed line styles.

```ts
export interface QuadrantProps extends BaseStructureProps {
  quadrantWidth?: number; // Single quadrant width
  quadrantHeight?: number; // Single quadrant height
  showAxis?: boolean; // Whether to show axis
  dashedAxis?: boolean; // Whether axis is dashed
}
```

## RelationCircle {#relation-circle}

**id**: `relation-circle`

Circular relationship diagram, nodes distributed along circumference, can start from top or equally spaced.

```ts
export interface RelationCircleProps extends BaseStructureProps {
  radius?: number; // Circle radius
  startMode?: 'top' | 'equal'; // Start angle mode
}
```

## RelationNetwork {#relation-network}

**id**: `relation-network`

Force-directed relationship network, center node radiating outward, can toggle connection lines.

```ts
export interface RelationNetworkProps extends BaseStructureProps {
  spacing?: number; // Node spacing (force-directed distance)
  showConnections?: boolean; // Whether to show connections
}
```

## SequenceAscendingStairs3d {#sequence-ascending-stairs3d}

**id**: `sequence-ascending-stairs3d`

3D stepped blocks ascending from left-back to right-front, data items displayed on right side of blocks.

```ts
export interface SequenceAscendingStairs3dProps extends BaseStructureProps {
  cubeWidth?: number; // Block width (affects overall scaling)
}
```

## SequenceAscendingSteps {#sequence-ascending-steps}

**id**: `sequence-ascending-steps`

Upper-right staircase-style timeline, nodes rise with step size.

```ts
export interface SequenceAscendingStepsProps extends BaseStructureProps {
  hGap?: number; // Horizontal step
  vGap?: number; // Vertical step
}
```

## SequenceCircleArrows {#sequence-circle-arrows}

**id**: `sequence-circle-arrows`

Circular path connecting arrows, nodes distributed along arc.

```ts
export interface SequenceCircleArrowsProps extends BaseStructureProps {
  radius?: number; // Circle radius
  arrowSize?: number; // Arrow size
  strokeWidth?: number; // Line width
}
```

## SequenceCircular {#sequence-circular}

**id**: `sequence-circular`

Concentric arc slices (like circular progress), data items and icons suspended above sectors on outer circle.

```ts
export interface SequenceCircularProps extends BaseStructureProps {
  outerRadius?: number; // Outer arc radius
  innerRadius?: number; // Inner arc radius
  itemDistance?: number; // Distance of data items from center
  gapAngle?: number; // Gap angle between sectors
  iconRadius?: number; // Icon circle radius
  iconBgRadius?: number; // Icon background radius
  iconSize?: number; // Icon size
}
```

## SequenceColorSnakeSteps {#sequence-color-snake-steps}

**id**: `sequence-color-snake-steps`

Colorful serpentine fold-back path, rows connected by arc lines, configurable circle stroke.

```ts
export interface SequenceColorSnakeStepsProps extends BaseStructureProps {
  gap?: number; // Gap between data items in same row
  itemsPerRow?: number; // Number per row
  rowGap?: number; // Gap between rows
  columnGap?: number; // Horizontal offset at row start
  circleStrokeWidth?: number; // Arc stroke width
}
```

## SequenceCylinders3d {#sequence-cylinders3d}

**id**: `sequence-cylinders3d`

3D cylinders alternating front-back, gradually increasing height with sequence number, controllable depth and text alignment.

```ts
export interface sequenceCylinders3dProps extends BaseStructureProps {
  cylinderRx?: number; // Cylinder horizontal radius
  cylinderRy?: number; // Cylinder vertical radius
  baseHeight?: number; // Starting height
  heightIncrement?: number; // Height increment
  horizontalSpacing?: number; // Left-right spacing
  depthSpacing?: number; // Front-back layer spacing
  itemVerticalAlign?: 'top' | 'center' | 'bottom'; // Text vertical alignment
  itemVerticalOffset?: number; // Text vertical offset
  firstDecorationWidth?: number; // Left decoration width
}
```

## SequenceFilterMesh {#sequence-filter-mesh}

**id**: `sequence-filter-mesh`

Filter mesh style, arrow passing through funnel, internal particles rendered with colors.

```ts
export interface SequenceFilterMeshProps extends BaseStructureProps {
  gap?: number; // Gap between data items
}
```

## SequenceHorizontalZigzag {#sequence-horizontal-zigzag}

**id**: `sequence-horizontal-zigzag`

Horizontal card polyline timeline, odd-even nodes jump up-down with dot indicators.

```ts
export interface SequenceHorizontalZigzagProps extends BaseStructureProps {
  gap?: number; // Gap between cards
  cardPadding?: number; // Card padding
}
```

## SequenceMountain {#sequence-mountain}

**id**: `sequence-mountain`

Progressive mountain contour, increases in height and width with sequence, sun and cloud decorations on top.

```ts
export interface SequenceMountainProps extends BaseStructureProps {
  gap?: number; // Gap between peaks
  minHeight?: number; // Minimum height
  maxHeight?: number; // Maximum height
  minWidth?: number; // Minimum width
  maxWidth?: number; // Maximum width
}
```

## SequencePyramid {#sequence-pyramid}

**id**: `sequence-pyramid`

Right-side text + left-side pyramid layers, layer width narrows progressively with gradient fill.

```ts
export interface SequencePyramidProps extends BaseStructureProps {
  gap?: number; // Gap between layers
  width?: number; // Total width
  pyramidWidth?: number; // Pyramid width
  itemHeight?: number; // Text area height
}
```

## SequenceRoadmapVertical {#sequence-roadmap-vertical}

**id**: `sequence-roadmap-vertical`

Vertical road-style roadmap, alternating left-right nodes with numbered icons.

```ts
export interface SequenceRoadmapVerticalProps extends BaseStructureProps {
  spacing?: number; // Node spacing
  flipped?: boolean; // Whether to flip left-right
}
```

## SequenceSnakeSteps {#sequence-snake-steps}

**id**: `sequence-snake-steps`

Serpentine grid path, rows connected by arrows, odd-even rows in reverse order.

```ts
export interface SequenceSnakeStepsProps extends BaseStructureProps {
  gap?: number; // Gap within same row
  itemsPerRow?: number; // Number per row
  rowGap?: number; // Gap between rows
}
```

## SequenceSteps {#sequence-steps}

**id**: `sequence-steps`

Straight step arrow chain, nodes equally spaced horizontally.

```ts
export interface SequenceStepsProps extends BaseStructureProps {
  gap?: number; // Gap between data items
}
```

## SequenceTimeline {#sequence-timeline}

**id**: `sequence-timeline`

Vertical timeline, left side gradient main line, nodes marked with STEP labels.

```ts
export interface SequenceTimelineProps extends BaseStructureProps {
  gap?: number; // Gap between data items
  lineOffset?: number; // Axis line offset
}
```

## SequenceZigzagPucks3d {#sequence-zigzag-pucks3d}

**id**: `sequence-zigzag-pucks3d`

3D disks in staggered arrangement, numbered on top, text alternates above/below disks.

```ts
export interface SequenceZigzagPucks3dProps extends BaseStructureProps {
  gap?: number; // Gap between disks
}
```

## SequenceZigzagSteps {#sequence-zigzag-steps}

**id**: `sequence-zigzag-steps`

"W" shaped polyline path, nodes with glow and decorative patterns, supports custom step size and icon size.

```ts
export interface SequenceZigzagStepsProps extends BaseStructureProps {
  dx?: number; // Horizontal step
  dy?: number; // Vertical step
  iconSize?: number; // Icon size
}
```
