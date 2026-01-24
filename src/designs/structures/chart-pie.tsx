import { arc, pie, type PieArcDatum } from 'd3';
import { ElementTypeEnum } from '../../constants';
import type { ComponentType, JSXElement } from '../../jsx';
import { getElementBounds, Group, Path, Text } from '../../jsx';
import { ItemDatum } from '../../types';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import {
  getColorPrimary,
  getPaletteColor,
  getThemeColors,
  normalizePercent,
} from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

// === 连线布局常量 ===
/** 连线水平拉伸系数：控制拐点相对于外半径的延伸比例 */
const EXTENSION_FACTOR = 1.35;
/** 文本与连线终点之间的水平间距 */
const TEXT_GAP = 8;
/** 平滑系数：控制 Y 轴偏移对 X 轴补偿的影响幅度 */
const SMOOTH_FACTOR = 0.3;
/** 最大预期偏移系数：相对于外半径的比例 */
const MAX_EXPECTED_SHIFT_FACTOR = 0.2;
/** 文本锚点与拐点之间的固定间距 */
const FIXED_TEXT_RADIUS_GAP = 20;
/** 连线拐点半径系数：相对于外半径的比例 */
const ELBOW_RADIUS_FACTOR = 1.15;
/** 百分比文本位置系数：从内半径到外半径的比例 (0.5 = 中间) */
const PERCENT_TEXT_POSITION = 0.5;
/** 删除按钮半径系数：相对于外半径的比例 */
const DELETE_BUTTON_RADIUS_FACTOR = 0.85;
/** 添加按钮半径系数：相对于外半径的比例 */
const ADD_BUTTON_RADIUS_FACTOR = 1.0;

export interface ChartPieProps extends BaseStructureProps {
  radius?: number;
  innerRadius?: number;
  padding?: number;
  showPercentage?: boolean;
  avoidLabelOverlap?: boolean;
  minShowLabelPercent?: number | string;
}

export const ChartPie: ComponentType<ChartPieProps> = (props) => {
  const {
    Title,
    Item,
    data,
    radius = 140,
    innerRadius = 0,
    padding = 30,
    showPercentage = true,
    avoidLabelOverlap = false,
    minShowLabelPercent: rawMinShowLabelPercent = 0,
    options,
  } = props;

  // 规范化百分比阈值
  const minShowLabelPercent = normalizePercent(rawMinShowLabelPercent);

  const { title, desc, items = [] } = data;
  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);

  // 获取 Item 的预估尺寸
  const sampleDatum: ItemDatum = items[0] ?? { label: '', value: 0 };
  const itemBounds = getElementBounds(
    <Item
      indexes={[0]}
      datum={sampleDatum}
      data={data}
      positionH="center"
      positionV="middle"
    />,
  );

  const labelWidth = itemBounds.width || 140;
  const labelHeight = itemBounds.height || 32;

  // 基础半径设置
  const outerRadius = Math.max(radius, 60);

  // 计算画布中心和总尺寸
  // 水平方向：半径 * 系数 + 间距 + 标签宽度 + 边缘padding
  const maxHorizontalDistance =
    outerRadius * EXTENSION_FACTOR + TEXT_GAP + labelWidth;
  const maxVerticalDistance = outerRadius;

  const centerX = padding + maxHorizontalDistance;
  const centerY = padding + maxVerticalDistance;

  const totalWidth = centerX * 2;
  const totalHeight = centerY * 2;

  // 空数据处理
  if (items.length === 0) {
    return (
      <FlexLayout
        id="infographic-container"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {titleContent}
        <Group width={totalWidth} height={totalHeight}>
          <BtnsGroup>
            <BtnAdd
              indexes={[0]}
              x={centerX - btnBounds.width / 2}
              y={centerY - btnBounds.height / 2}
            />
          </BtnsGroup>
        </Group>
      </FlexLayout>
    );
  }

  const totalValue = items.reduce(
    (sum, item) => sum + Math.max(item.value ?? 0, 0),
    0,
  );
  const colorPrimary = getColorPrimary(options);
  const themeColors = getThemeColors(options.themeConfig);

  // 1. 饼图生成器
  const pieGenerator = pie<ItemDatum>()
    .value((item) => Math.max(item.value ?? 0, 0))
    .sort(null)
    .startAngle(0)
    .endAngle(Math.PI * 2);

  const arcData = pieGenerator(items);

  // 2. 弧形生成器
  const arcGenerator = arc<PieArcDatum<ItemDatum>>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(2);

  // 连线起点
  const innerArc = arc<PieArcDatum<ItemDatum>>()
    .innerRadius(outerRadius)
    .outerRadius(outerRadius);

  // 连线拐点
  const outerArc = arc<PieArcDatum<ItemDatum>>()
    .innerRadius(outerRadius * ELBOW_RADIUS_FACTOR)
    .outerRadius(outerRadius * ELBOW_RADIUS_FACTOR);

  const percentTextRadius =
    innerRadius + (outerRadius - innerRadius) * PERCENT_TEXT_POSITION;
  const percentageArc = arc<PieArcDatum<ItemDatum>>()
    .innerRadius(percentTextRadius)
    .outerRadius(percentTextRadius);

  // 删除按钮位置
  const deleteButtonArc = arc<PieArcDatum<ItemDatum>>()
    .innerRadius(outerRadius * DELETE_BUTTON_RADIUS_FACTOR)
    .outerRadius(outerRadius * DELETE_BUTTON_RADIUS_FACTOR);

  const sliceElements: JSXElement[] = [];
  const percentElements: JSXElement[] = [];
  const connectorElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];
  const btnElements: JSXElement[] = [];
  const labelItems: LabelItem[] = [];

  // 3. 遍历生成图形
  arcData.forEach((arcDatum) => {
    const originalIndex = arcDatum.index;

    const color =
      getPaletteColor(options, [originalIndex]) ||
      themeColors.colorPrimary ||
      colorPrimary;

    // --- 绘制扇形 ---
    const pathD = arcGenerator(arcDatum) || '';
    sliceElements.push(
      <Path
        d={pathD}
        fill={color}
        stroke={themeColors.colorBg}
        strokeWidth={1}
        data-element-type="shape"
        width={outerRadius * 2}
        height={outerRadius * 2}
      />,
    );

    // --- 计算关键点 ---
    const midAngle =
      arcDatum.startAngle + (arcDatum.endAngle - arcDatum.startAngle) / 2;

    const normalizedAngle = midAngle < 0 ? midAngle + Math.PI * 2 : midAngle;
    const isRight = normalizedAngle < Math.PI;

    // 计算扇形占比，如果小于 minShowLabelPercent 则跳过生成连线和标签
    const slicePercent =
      totalValue > 0 ? (arcDatum.value / totalValue) * 100 : 0;
    if (slicePercent < minShowLabelPercent) {
      return;
    }

    const centroid = outerArc.centroid(arcDatum);

    labelItems.push({
      arcDatum,
      originalIndex,
      x: centroid[0],
      y: centroid[1], // 中心点 Y 坐标
      height: labelHeight,
      isRight,
      color,
    });
  });
  let finalLabels: LabelItem[] = labelItems;

  if (avoidLabelOverlap) {
    // 标签中心点的上下边界（中心点不能超出此范围）
    const labelMinY = -maxVerticalDistance * EXTENSION_FACTOR;
    const labelMaxY = maxVerticalDistance * EXTENSION_FACTOR;

    const leftItems = labelItems.filter((item) => !item.isRight);
    const rightItems = labelItems.filter((item) => item.isRight);

    const labelSpacing = labelHeight;

    const adjustedRight = distributeLabels(
      rightItems,
      labelSpacing,
      labelMinY,
      labelMaxY,
    );
    const adjustedLeft = distributeLabels(
      leftItems,
      labelSpacing,
      labelMinY,
      labelMaxY,
    );

    finalLabels = [...adjustedLeft, ...adjustedRight];
  }

  finalLabels.forEach((item) => {
    const { arcDatum, originalIndex, isRight, color, y: adjustedY } = item;

    // 1. P0: 连线起点 (内部扇形质心)
    const p0 = innerArc.centroid(arcDatum);

    // 2. P1: 第一拐点 (外部扇形质心)
    const p1 = outerArc.centroid(arcDatum);

    // 计算因避障算法导致的 Y 轴偏移量
    // adjustedY 已经是中心点坐标
    const labelCenterY = adjustedY;
    const deltaY = Math.abs(labelCenterY - p1[1]);

    // --- 动态补偿策略 (Dynamic Compensation) ---
    // 根据 Y 轴的偏移量动态向外推移 X 轴，以缓解连线折角过于陡峭的问题
    const dynamicShift = deltaY * SMOOTH_FACTOR;

    // 计算基础拐点半径
    const baseElbowRadius = outerRadius * EXTENSION_FACTOR;

    // 计算实际拐点半径 (基础半径 + 动态补偿)
    const currentElbowRadius = baseElbowRadius + dynamicShift;

    // 设定文本锚点的固定半径，确保所有标签在垂直方向上对齐
    const maxExpectedShift = outerRadius * MAX_EXPECTED_SHIFT_FACTOR;
    const fixedTextRadius =
      baseElbowRadius + maxExpectedShift + FIXED_TEXT_RADIUS_GAP;

    // 计算 P2 X 坐标 (注意方向性)
    // 限制 Elbow X 不超过文本锚点半径，防止连线出现回折
    const elbowRadiusClamped = Math.min(currentElbowRadius, fixedTextRadius);
    const elbowX = elbowRadiusClamped * (isRight ? 1 : -1);

    // 计算文本锚点 X 坐标 (始终对齐)
    const textX = fixedTextRadius * (isRight ? 1 : -1);

    // 3. P2: 第二拐点 (动态调整后的 Elbow 位置)
    // 连线终点对齐标签垂直中心
    const p2 = [elbowX, labelCenterY];

    // 4. P3: 终点 (文本锚点)
    const p3 = [textX, labelCenterY];

    // --- 绘制连线 ---
    connectorElements.push(
      <Path
        d={`M${centerX + p0[0]} ${centerY + p0[1]} 
        L${centerX + p1[0]} ${centerY + p1[1]} 
        L${centerX + p2[0]} ${centerY + p2[1]}
        L${centerX + p3[0]} ${centerY + p3[1]}
        `}
        stroke={color}
        strokeOpacity={0.45}
        strokeWidth={2}
        fill="none"
        data-element-type="shape"
      />,
    );

    // --- 绘制 Item ---
    const itemX =
      centerX + p3[0] + (isRight ? TEXT_GAP : -TEXT_GAP - labelWidth);
    const itemY = centerY + adjustedY - labelHeight / 2; // 转换为顶部坐标用于渲染

    itemElements.push(
      <Item
        indexes={[originalIndex]}
        datum={arcDatum.data}
        data={data}
        x={itemX}
        y={itemY}
        width={labelWidth}
        height={labelHeight}
        positionH={isRight ? 'normal' : 'flipped'}
        positionV="middle"
        themeColors={getThemeColors({ colorPrimary: color }, options)}
      />,
    );

    // --- 绘制百分比 ---
    if (showPercentage && totalValue > 0) {
      const percentPos = percentageArc.centroid(arcDatum);
      const value = Math.max(arcDatum.value, 0);
      const percentText = ((value * 100) / totalValue).toFixed(1);

      // 定义文本框尺寸
      const textWidth = 50;
      const textHeight = 20;

      percentElements.push(
        <Text
          x={centerX + percentPos[0] - textWidth / 2}
          y={centerY + percentPos[1] - textHeight / 2}
          width={textWidth}
          height={textHeight}
          alignHorizontal="center"
          alignVertical="middle"
          fontSize={12}
          fontWeight="bold"
          fill="#ffffff"
          data-value={value}
          data-indexes={[originalIndex]}
          data-element-type={ElementTypeEnum.ItemValue}
        >
          {`${percentText}%`}
        </Text>,
      );
    }

    // --- 绘制删除按钮 ---
    const deletePos = deleteButtonArc.centroid(arcDatum);
    btnElements.push(
      <BtnRemove
        indexes={[originalIndex]}
        x={centerX + deletePos[0] - btnBounds.width / 2}
        y={centerY + deletePos[1] - btnBounds.height / 2}
      />,
    );
  });

  // --- 绘制添加按钮 ---
  arcData.forEach((arcDatum, index) => {
    const nextIndex = (index + 1) % arcData.length;
    const currentEnd = arcDatum.endAngle;
    const nextStart =
      arcData[nextIndex].startAngle + (nextIndex === 0 ? Math.PI * 2 : 0);
    const midAngle = (currentEnd + nextStart) / 2;

    const btnR = outerRadius * ADD_BUTTON_RADIUS_FACTOR;
    const btnX = Math.sin(midAngle) * btnR;
    const btnY = -Math.cos(midAngle) * btnR;

    btnElements.push(
      <BtnAdd
        indexes={[index + 1]}
        x={centerX + btnX - btnBounds.width / 2}
        y={centerY + btnY - btnBounds.height / 2}
      />,
    );
  });

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={30}
    >
      {titleContent}
      <Group width={totalWidth} height={totalHeight}>
        <Group x={centerX} y={centerY}>
          {sliceElements}
        </Group>
        <Group>{connectorElements}</Group>
        <Group>{percentElements}</Group>
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup>{btnElements}</BtnsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('chart-pie', {
  component: ChartPie,
  composites: ['title', 'item'],
});

export interface LabelItem {
  arcDatum: PieArcDatum<ItemDatum>;
  originalIndex: number;
  /** 标签中心点 Y 坐标 */
  y: number;
  x: number;
  height: number;
  isRight: boolean;
  color: string;
}

/**
 * 核心避障逻辑：蜘蛛腿算法 (Spider Leg Layout)
 *
 * 注意：y 坐标表示标签的中心点坐标
 *
 * @param items 待处理的标签数组（y 为中心点坐标）
 * @param spacing 垂直最小间距（标签边缘之间的间距）
 * @param minY 标签中心点的上边界
 * @param maxY 标签中心点的下边界
 */
export function distributeLabels(
  items: LabelItem[],
  spacing: number,
  minY: number,
  maxY: number,
): LabelItem[] {
  // 避免除零风险
  if (items.length <= 1) return items.map((item) => ({ ...item }));

  // 按照 Y 坐标排序 (从上到下)
  const sorted = items.map((item) => ({ ...item })).sort((a, b) => a.y - b.y);

  // === 预检测：是否需要退避 ===
  // 检查是否有任何标签重叠或超出边界
  const hasOverlap = sorted.some((item, i) => {
    if (i === 0) return false;
    const prev = sorted[i - 1];
    // 中心点间距 < 两个半高度之和 → 有重叠
    return item.y - prev.y < (prev.height + item.height) / 2;
  });

  const firstItem = sorted[0];
  const lastItem = sorted[sorted.length - 1];
  const isOutOfBounds =
    firstItem.y - firstItem.height / 2 < minY ||
    lastItem.y + lastItem.height / 2 > maxY;

  // 如果没有重叠且都在边界内，直接返回原位置
  if (!hasOverlap && !isOutOfBounds) {
    return sorted;
  }

  // === 第一步：计算总高度需求，动态调整间距 ===
  const totalLabelsHeight = sorted.reduce((sum, item) => sum + item.height, 0);
  const availableSpace = maxY - minY;
  const requiredSpaceWithIdealSpacing =
    totalLabelsHeight + spacing * (sorted.length - 1);

  // 如果理想间距放不下，动态压缩间距（最小为0）
  let actualSpacing = spacing;
  if (requiredSpaceWithIdealSpacing > availableSpace) {
    const excessSpace = availableSpace - totalLabelsHeight;
    actualSpacing = Math.max(0, excessSpace / (sorted.length - 1));
  }

  // === 第二步：向下挤压 (Downwards push) ===
  // y 为中心点坐标
  // 当前标签中心 必须 >= 前一标签中心 + 两个半高度之和 + 间距
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];

    const minAllowedY =
      prev.y + (prev.height + curr.height) / 2 + actualSpacing;
    if (curr.y < minAllowedY) {
      curr.y = minAllowedY;
    }
  }

  // === 第三步：边界钳制 + 向上回推 (Upwards push) ===
  // 如果最后一个标签超出下边界，从下往上回推
  const lastIdx = sorted.length - 1;
  const last = sorted[lastIdx];
  if (last.y + last.height / 2 > maxY) {
    // 先把最后一个钳制到边界内（中心点 = 下边界 - 半高度）
    last.y = maxY - last.height / 2;

    // 然后从下往上检查，如果上一个标签被挤到了，就往上推
    for (let i = lastIdx - 1; i >= 0; i--) {
      const next = sorted[i + 1];
      const curr = sorted[i];

      const maxAllowedY =
        next.y - (next.height + curr.height) / 2 - actualSpacing;
      if (curr.y > maxAllowedY) {
        curr.y = maxAllowedY;
      }
    }
  }

  // === 第四步：上边界钳制 ===
  // 如果向上回推后，第一个标签超出上边界，整体往下移
  const first = sorted[0];
  if (first.y - first.height / 2 < minY) {
    const shift = minY - (first.y - first.height / 2);
    sorted.forEach((item) => (item.y += shift));
  }

  return sorted;
}
