---
title: 内置结构
---

以下为内置结构的样式特点与参数类型（未列出的 props 继承自 [BaseStructureProps](/reference/infographic-types#base-structure-props)）。

使用时通过下方 `id` 指定。

## ChartColumn {#chart-column}

**id**: `chart-column`

垂直柱状图，支持正负值并在柱体上方/下方显示数值，底部排列数据项。

```ts
export interface ChartColumnProps extends BaseStructureProps {
  columnGap?: number; // 柱间距
  columnWidth?: number; // 柱宽
  padding?: Padding; // 外边距
  showValue?: boolean; // 是否显示数值
  valueFormatter?: (value: number, datum: ItemDatum) => string; // 数值格式化
}
```

## CompareBinaryHorizontal {#compare-binary-horizontal}

**id**: `compare-binary-horizontal`

左右对称的二元对比结构，中间可插入 "VS" 等分隔符，左右子项纵向排列。

```ts
export interface CompareBinaryHorizontalProps extends BaseStructureProps {
  gap?: number; // 同侧子项间距
  groupGap?: number; // 子项组到分隔符距离
  opposite?: boolean; // 左右是否相对
  flipped?: boolean; // 是否整体翻转左右
  dividerType?: string; // 分隔符类型
}
```

## CompareHierarchyLeftRight {#compare-hierarchy-left-right}

**id**: `compare-hierarchy-left-right`

左右两棵层级树的对比，可选择环绕式布局或平铺，支持圆点/分割线等装饰。

```ts
export interface CompareHierarchyLeftRightProps extends BaseStructureProps {
  gap?: number; // 同侧节点垂直间距
  groupGap?: number; // 左右根节点间距
  surround?: boolean; // 子节点是否环绕根节点
  decoration?: 'none' | 'dot-line' | 'arc-dot' | 'split-line'; // 装饰样式
  flipRoot?: boolean; // 根节点方向翻转
  flipLeaf?: boolean; // 叶子节点方向翻转
}
```

## CompareHierarchyRow {#compare-hierarchy-row}

**id**: `compare-hierarchy-row`

横排的多列层级列表，顶层作为列头，子项在列内纵向排列，可开启浅色列背景。

```ts
export interface CompareHierarchyRowProps extends BaseStructureProps {
  gap?: number; // 列间距
  itemGap?: number; // 子项垂直间距
  columnWidth?: number; // 列宽
  itemPadding?: number; // 子项左右内边距
  showColumnBackground?: boolean; // 是否显示列背景
  columnBackgroundAlpha?: number; // 背景透明度
}
```

## HierarchyTree {#hierarchy-tree}

**id**: `hierarchy-tree`

可配置的树形结构，支持直线/曲线连线、箭头/节点标记、分支/层级着色等丰富样式。

```ts
export interface HierarchyTreeProps extends BaseStructureProps {
  levelGap?: number; // 父子垂直间距
  nodeGap?: number; // 同层水平间距
  edgeType?: 'straight' | 'curved'; // 连接线类型
  edgeColorMode?: 'solid' | 'gradient'; // 线条颜色模式
  edgeWidth?: number; // 线宽
  edgeStyle?: 'solid' | 'dashed'; // 线型
  edgeDashPattern?: string; // 自定义虚线
  edgeCornerRadius?: number; // 直线圆角
  edgeOffset?: number; // 线与节点间距
  edgeOrigin?: 'center' | 'distributed'; // 起点模式
  edgeOriginPadding?: number; // 分布式起点内边距
  edgeMarker?: 'none' | 'dot' | 'arrow'; // 标记样式
  markerSize?: number; // 标记尺寸
  colorMode?: 'level' | 'branch' | 'node-flat'; // 节点着色模式
}
```

## ListRow {#list-row}

**id**: `list-row`

水平排布的列表，可选交错（zigzag）上下对齐。

```ts
export interface ListRowProps extends BaseStructureProps {
  gap?: number; // 数据项间距
  zigzag?: boolean; // 是否上下交错
}
```

## ListColumn {#list-column}

**id**: `list-column`

竖向排布的列表，可选宽度和左右翻转的锯齿效果。

```ts
export interface ListColumnProps extends BaseStructureProps {
  width?: number; // 宽度
  gap?: number; // 数据项间距
  zigzag?: boolean; // 是否左右交错
}
```

## ListGrid {#list-grid}

**id**: `list-grid`

规则网格列表，支持列数和间距配置，可选交错垂直翻转。

```ts
export interface ListGridProps extends BaseStructureProps {
  columns?: number; // 列数
  gap?: number; // 网格间距
  zigzag?: boolean; // 是否垂直翻转交错
}
```

## ListPyramid {#list-pyramid}

**id**: `list-pyramid`

金字塔式分层网格，每层数据项居中放置，层间距可调。

```ts
export interface ListPyramidProps extends BaseStructureProps {
  gap?: number; // 同层间距
  levelGap?: number; // 层间距
}
```

## ListWaterfall {#list-waterfall}

**id**: `list-waterfall`

"瀑布流"布局，按列均分并叠加阶梯偏移。

```ts
export interface ListWaterfallProps extends BaseStructureProps {
  columns?: number; // 列数
  gap?: number; // 数据项间距
  stepOffset?: number; // 阶梯偏移
}
```

## ListSector {#list-sector}

**id**: `list-sector`

环形/扇形分区，每个扇区内放置数据项，中心区域用于标题。

```ts
export interface ListSectorProps extends BaseStructureProps {
  outerRadius?: number; // 外半径
  innerRadius?: number; // 内半径
  startAngle?: number; // 起始角
  endAngle?: number; // 结束角
  gapAngle?: number; // 间隔角
}
```

## Quadrant {#quadrant}

**id**: `quadrant`

四象限布局，可选坐标轴与虚线样式。

```ts
export interface QuadrantProps extends BaseStructureProps {
  quadrantWidth?: number; // 单象限宽度
  quadrantHeight?: number; // 单象限高度
  showAxis?: boolean; // 是否显示坐标轴
  dashedAxis?: boolean; // 坐标轴是否虚线
}
```

## RelationCircle {#relation-circle}

**id**: `relation-circle`

环形关系图，节点沿圆周分布，可从顶部或等距起始。

```ts
export interface RelationCircleProps extends BaseStructureProps {
  radius?: number; // 圆半径
  startMode?: 'top' | 'equal'; // 起始角模式
}
```

## RelationNetwork {#relation-network}

**id**: `relation-network`

力导向关系网络，中心节点向外辐射，可切换是否显示连线。

```ts
export interface RelationNetworkProps extends BaseStructureProps {
  spacing?: number; // 节点间距（力导向距离）
  showConnections?: boolean; // 是否显示连线
}
```

## SequenceAscendingStairs3d {#sequence-ascending-stairs3d}

**id**: `sequence-ascending-stairs3d`

3D 阶梯方块从左后向右前递增，方块右侧展示数据项。

```ts
export interface SequenceAscendingStairs3dProps extends BaseStructureProps {
  cubeWidth?: number; // 方块宽度（影响整体缩放）
}
```

## SequenceAscendingSteps {#sequence-ascending-steps}

**id**: `sequence-ascending-steps`

右上走向的阶梯式时间线，节点随步长上升。

```ts
export interface SequenceAscendingStepsProps extends BaseStructureProps {
  hGap?: number; // 水平步长
  vGap?: number; // 垂直步长
}
```

## SequenceCircleArrows {#sequence-circle-arrows}

**id**: `sequence-circle-arrows`

圆环路径串联箭头，节点贴着弧形分布。

```ts
export interface SequenceCircleArrowsProps extends BaseStructureProps {
  radius?: number; // 圆半径
  arrowSize?: number; // 箭头大小
  strokeWidth?: number; // 线条宽度
}
```

## SequenceCircular {#sequence-circular}

**id**: `sequence-circular`

同心圆弧切片（类似环形进度），扇形上方外圈悬挂数据项与图标。

```ts
export interface SequenceCircularProps extends BaseStructureProps {
  outerRadius?: number; // 外弧半径
  innerRadius?: number; // 内弧半径
  itemDistance?: number; // 数据项离中心距离
  gapAngle?: number; // 扇区间隙角
  iconRadius?: number; // 图标圆半径
  iconBgRadius?: number; // 图标背景半径
  iconSize?: number; // 图标大小
}
```

## SequenceColorSnakeSteps {#sequence-color-snake-steps}

**id**: `sequence-color-snake-steps`

彩色折返蛇形路径，行间用弧线连接，可配圆环描边。

```ts
export interface SequenceColorSnakeStepsProps extends BaseStructureProps {
  gap?: number; // 同行数据项间距
  itemsPerRow?: number; // 每行数量
  rowGap?: number; // 行间距
  columnGap?: number; // 行首水平偏移
  circleStrokeWidth?: number; // 圆弧描边宽度
}
```

## SequenceCylinders3d {#sequence-cylinders3d}

**id**: `sequence-cylinders3d`

3D 圆柱正反交错排列，随序号逐步加高，可控制深度与文本对齐。

```ts
export interface sequenceCylinders3dProps extends BaseStructureProps {
  cylinderRx?: number; // 圆柱横向半径
  cylinderRy?: number; // 圆柱纵向半径
  baseHeight?: number; // 起始高度
  heightIncrement?: number; // 高度增量
  horizontalSpacing?: number; // 左右间距
  depthSpacing?: number; // 前后层间距
  itemVerticalAlign?: 'top' | 'center' | 'bottom'; // 文本垂直对齐
  itemVerticalOffset?: number; // 文本垂直偏移
  firstDecorationWidth?: number; // 左侧装饰宽度
}
```

## SequenceFilterMesh {#sequence-filter-mesh}

**id**: `sequence-filter-mesh`

过滤网格样式，箭头穿过滤斗，内部粒子随颜色渲染。

```ts
export interface SequenceFilterMeshProps extends BaseStructureProps {
  gap?: number; // 数据项间距
}
```

## SequenceHorizontalZigzag {#sequence-horizontal-zigzag}

**id**: `sequence-horizontal-zigzag`

水平卡片折线时间线，奇偶节点上下跳跃并带圆点指示。

```ts
export interface SequenceHorizontalZigzagProps extends BaseStructureProps {
  gap?: number; // 卡片间距
  cardPadding?: number; // 卡片内边距
}
```

## SequenceMountain {#sequence-mountain}

**id**: `sequence-mountain`

渐进山脉轮廓，随序号升高变宽，并在顶部叠加阳光、云朵等装饰。

```ts
export interface SequenceMountainProps extends BaseStructureProps {
  gap?: number; // 山峰间距
  minHeight?: number; // 最小高度
  maxHeight?: number; // 最大高度
  minWidth?: number; // 最小宽度
  maxWidth?: number; // 最大宽度
}
```

## SequencePyramid {#sequence-pyramid}

**id**: `sequence-pyramid`

右侧文本 + 左侧金字塔分层，层宽逐级收窄并填充渐变。

```ts
export interface SequencePyramidProps extends BaseStructureProps {
  gap?: number; // 层间距
  width?: number; // 总宽
  pyramidWidth?: number; // 金字塔宽度
  itemHeight?: number; // 文本区域高度
}
```

## SequenceRoadmapVertical {#sequence-roadmap-vertical}

**id**: `sequence-roadmap-vertical`

垂直公路样式的路线图，左右交替的节点与图标编号。

```ts
export interface SequenceRoadmapVerticalProps extends BaseStructureProps {
  spacing?: number; // 节点间距
  flipped?: boolean; // 是否左右反转
}
```

## SequenceSnakeSteps {#sequence-snake-steps}

**id**: `sequence-snake-steps`

蛇形网格路径，行内用箭头串联，奇偶行反向排列。

```ts
export interface SequenceSnakeStepsProps extends BaseStructureProps {
  gap?: number; // 同行间距
  itemsPerRow?: number; // 每行数量
  rowGap?: number; // 行间距
}
```

## SequenceSteps {#sequence-steps}

**id**: `sequence-steps`

直线步骤箭头链，节点等距水平排列。

```ts
export interface SequenceStepsProps extends BaseStructureProps {
  gap?: number; // 数据项间距
}
```

## SequenceTimeline {#sequence-timeline}

**id**: `sequence-timeline`

垂直时间轴，左侧渐变主线，节点标有 STEP 标签。

```ts
export interface SequenceTimelineProps extends BaseStructureProps {
  gap?: number; // 数据项间距
  lineOffset?: number; // 轴线偏移
}
```

## SequenceZigzagPucks3d {#sequence-zigzag-pucks3d}

**id**: `sequence-zigzag-pucks3d`

3D 圆盘交错排列，顶部带序号，文字在圆盘上方/下方交替。

```ts
export interface SequenceZigzagPucks3dProps extends BaseStructureProps {
  gap?: number; // 圆盘间距
}
```

## SequenceZigzagSteps {#sequence-zigzag-steps}

**id**: `sequence-zigzag-steps`

"W" 型折线路径，节点配光晕与装饰图案，支持自定义步长与图标尺寸。

```ts
export interface SequenceZigzagStepsProps extends BaseStructureProps {
  dx?: number; // 水平步长
  dy?: number; // 垂直步长
  iconSize?: number; // 图标尺寸
}
```
