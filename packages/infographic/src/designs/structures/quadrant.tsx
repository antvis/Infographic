/** @jsxImportSource @antv/infographic-jsx */
import type { ComponentType, JSXElement } from '@antv/infographic-jsx';
import { getElementBounds, Group, Path } from '@antv/infographic-jsx';
import { ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface QuadrantProps extends BaseStructureProps {
  /** 象限尺寸 */
  quadrantSize?: number;
  /** 是否显示坐标轴 */
  showAxis?: boolean;
  /** 是否使用虚线样式，默认为true */
  dashedAxis?: boolean;
  /** 象限项间距 */
  itemSpacing?: number;
}

// 配置常量
const QUADRANT_CONFIG = {
  axisColor: '#D9D9D9',
  axisArrowSize: 5,
  strokeWidth: 1,
  dashArray: '4,2', // 虚线样式：4px线段，2px间隔
} as const;

export const Quadrant: ComponentType<QuadrantProps> = (props) => {
  const {
    Title,
    Item,
    data,
    quadrantSize = 180,
    showAxis = true,
    dashedAxis = true,
    itemSpacing = 8,
  } = props;

  const { title, desc, items = [] } = data;
  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  // 限制只显示4个象限数据，不足时填充空值
  const quadrantItems = Array.from({ length: 4 }, (_, i) => items[i]);

  // 计算单个象限项的尺寸 - 使用可选链处理空值
  const itemBounds = quadrantItems[0]
    ? getElementBounds(
        <Item indexes={[0]} data={data} datum={quadrantItems[0]} />,
      )
    : { width: 0, height: 0 };

  // 计算象限位置
  const quadrantPositions = calculateQuadrantPositions(
    quadrantSize,
    itemBounds,
    itemSpacing,
  );

  // itemElements
  const itemElements = quadrantItems
    .map((item, index) => {
      if (!item) return null;

      const position = quadrantPositions[index];
      return (
        <Item
          indexes={[index]}
          datum={item}
          data={data}
          x={position.x}
          y={position.y}
          positionH={index % 2 ? 'flipped' : 'normal'}
          positionV={index < 2 ? 'normal' : 'flipped'}
        />
      );
    })
    .filter(Boolean); // 过滤掉 null 值

  // createAxisElements
  const axisElements = createAxisElements(quadrantSize, showAxis, dashedAxis);

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {titleContent}
      <Group width={quadrantSize * 2} height={quadrantSize * 2}>
        {axisElements}
        <ItemsGroup>{itemElements}</ItemsGroup>
      </Group>
    </FlexLayout>
  );
};

// 坐标轴绘制函数
function createAxisElements(
  quadrantSize: number,
  showAxis: boolean,
  dashedAxis: boolean,
): JSXElement[] {
  if (!showAxis) return [];

  const { axisColor, axisArrowSize, strokeWidth, dashArray } = QUADRANT_CONFIG;
  const center = quadrantSize;
  const max = quadrantSize * 2;
  const strokeDasharray = dashedAxis ? dashArray : undefined;

  return [
    // X 轴
    <Path
      d={`M 0 ${center} L ${max} ${center}`}
      stroke={axisColor}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      fill="none"
    />,
    // X 轴正方向箭头（右侧）
    <Group transform={`translate(${max}, ${center})`}>
      <Path
        d={`M 0 0 L ${-axisArrowSize} ${-axisArrowSize / 2}`}
        stroke={axisColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Path
        d={`M 0 0 L ${-axisArrowSize} ${axisArrowSize / 2}`}
        stroke={axisColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
    </Group>,
    // X 轴负方向箭头（左侧）
    <Group transform={`translate(0, ${center})`}>
      <Path
        d={`M 0 0 L ${axisArrowSize} ${-axisArrowSize / 2}`}
        stroke={axisColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Path
        d={`M 0 0 L ${axisArrowSize} ${axisArrowSize / 2}`}
        stroke={axisColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
    </Group>,
    // Y 轴
    <Path
      d={`M ${center} 0 L ${center} ${max}`}
      stroke={axisColor}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      fill="none"
    />,
    // Y 轴正方向箭头（上方）
    <Group transform={`translate(${center}, 0)`}>
      <Path
        d={`M 0 0 L ${-axisArrowSize / 2} ${axisArrowSize}`}
        stroke={axisColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Path
        d={`M 0 0 L ${axisArrowSize / 2} ${axisArrowSize}`}
        stroke={axisColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
    </Group>,
    // Y 轴负方向箭头（下方）
    <Group transform={`translate(${center}, ${max})`}>
      <Path
        d={`M 0 0 L ${-axisArrowSize / 2} ${-axisArrowSize}`}
        stroke={axisColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Path
        d={`M 0 0 L ${axisArrowSize / 2} ${-axisArrowSize}`}
        stroke={axisColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
    </Group>,
  ];
}

// 象限位置计算函数
function calculateQuadrantPositions(
  quadrantSize: number,
  itemBounds: { width: number; height: number },
  itemSpacing: number,
  isCenter = false,
): Array<{ x: number; y: number }> {
  if (!isCenter) {
    return [
      {
        x: quadrantSize - itemBounds.width - itemSpacing,
        y: quadrantSize - itemBounds.height - itemSpacing,
      }, // 第一象限 (左上)
      {
        x: quadrantSize + itemSpacing,
        y: quadrantSize - itemBounds.height - itemSpacing,
      }, // 第二象限 (右上)
      {
        x: quadrantSize - itemBounds.width - itemSpacing,
        y: quadrantSize + itemSpacing,
      }, // 第三象限 (左下)
      { x: quadrantSize + itemSpacing, y: quadrantSize + itemSpacing }, // 第四象限 (右下)
    ];
  }

  const halfSize = quadrantSize / 2;
  const offsetX = halfSize - itemBounds.width / 2;
  const offsetY = halfSize - itemBounds.height / 2;

  return [
    { x: offsetX, y: offsetY }, // 第一象限 (左上)
    { x: quadrantSize + offsetX, y: offsetY }, // 第二象限 (右上)
    { x: offsetX, y: quadrantSize + offsetY }, // 第三象限 (左下)
    { x: quadrantSize + offsetX, y: quadrantSize + offsetY }, // 第四象限 (右下)
  ];
}

registerStructure('quadrant', { component: Quadrant });
