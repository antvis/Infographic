/** @jsxImportSource @antv/infographic-jsx */
import {
  getElementBounds,
  Group,
  Path,
  Text,
  type ComponentType,
  type JSXElement,
} from '@antv/infographic-jsx';
import { ItemIconCircle } from '../components';
import { Triangle } from '../decorations';
import { FlexLayout } from '../layouts';
import { getPaletteColor } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface SequenceRoadmapVerticalProps extends BaseStructureProps {
  /** Item spacing */
  spacing?: number;
  flipped?: boolean;
}

const CONFIG = {
  iconSize: 50,
  roadWidth: 24,
  outerRadius: 60,
  rowWidth: 400,
  spacing: 30,
  colorDefault: '#666666',
};

const moveTo = (x: number, y: number) => `M ${x} ${y}`;
const lineTo = (x: number, y: number) => `L ${x} ${y}`;
const arcTo = (r: number, sweep: 0 | 1, x: number, y: number) =>
  `A ${r} ${r} 0 0 ${sweep} ${x} ${y}`;

const getYPositions = (
  i: number,
  {
    roadWidth,
    innerRadius,
    outerRadius,
  }: { roadWidth: number; innerRadius: number; outerRadius: number },
) => {
  const y1 = (roadWidth + innerRadius * 2) * i;
  return {
    y1,
    y2: y1 + roadWidth,
    y3: y1 + roadWidth + innerRadius,
    y4: y1 + roadWidth + innerRadius * 2,
    y5: y1 + outerRadius * 2,
  };
};

function renderItemRow({
  i,
  direction,
  x,
  y,
  color,
  data,
  itemBounds,
  item,
  Item,
  flipped,
}: any) {
  const { iconSize } = CONFIG;
  const isLeft = direction === 'left';

  const iconX = isLeft ? x.x4 - iconSize / 2 : x.x3 - iconSize / 2;
  const iconY = y.y3 - iconSize / 2;
  const itemX = isLeft
    ? x.x6 + CONFIG.spacing
    : x.x1 - CONFIG.spacing - itemBounds.width;
  const itemY = y.y3 - itemBounds.height / 2;

  // 根据 flipped 参数决定 positionH
  const positionH = isLeft
    ? flipped
      ? 'flipped'
      : 'normal'
    : flipped
      ? 'normal'
      : 'flipped';

  return {
    icon: (
      <ItemIconCircle
        indexes={[i]}
        x={iconX}
        y={iconY}
        size={iconSize}
        fill={color}
      />
    ),
    label: (
      <Text
        x={isLeft ? iconX - 10 : iconX + iconSize + 10}
        y={iconY + iconSize / 2 - 15}
        fontSize={30}
        fill={color}
        alignHorizontal={isLeft ? 'right' : 'left'}
      >
        {String(i + 1).padStart(2, '0')}
      </Text>
    ),
    item: (
      <Item
        indexes={[i]}
        data={data}
        datum={item}
        x={itemX}
        y={itemY}
        positionH={positionH}
      />
    ),
  };
}

function buildDecorations({ direction, x, y, color, elements }: any) {
  const isLeft = direction === 'left';
  elements.push(
    <Triangle
      x={isLeft ? x.x6 + 10 : x.x1 - 20}
      y={y.y3 - 5}
      width={10}
      height={8}
      rotation={isLeft ? 90 : -90}
      colorPrimary={color}
      data-element-type="shape"
    />,
  );
}

export const SequenceRoadmapVertical: ComponentType<
  SequenceRoadmapVerticalProps
> = (props) => {
  const {
    Title,
    Item,
    data,
    spacing = CONFIG.spacing,
    options,
    flipped = false,
  } = props;
  const { title, desc, items = [] } = data;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;
  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} positionH="center" />,
  );

  const { roadWidth, outerRadius, rowWidth, colorDefault } = CONFIG;
  const halfRoadWidth = roadWidth / 2;
  const innerRadius = outerRadius - roadWidth;

  const totalWidth = (itemBounds.width + spacing) * 2 + rowWidth;

  const x1 = itemBounds.width + spacing;
  const x3 = x1 + outerRadius;
  const x4 = x1 + rowWidth - outerRadius;
  const x5 = x4 + innerRadius;
  const x6 = x5 + roadWidth;
  const xMid = x1 + rowWidth / 2;

  const midPath: string[] = [];
  const positivePath: string[] = [];
  const negativePath: string[] = [];

  const itemIcons: JSXElement[] = [];
  const seriesNumber: JSXElement[] = [];
  const itemElements: JSXElement[] = [];
  const decorationElements: JSXElement[] = [];

  for (let i = 0; i < items.length; i++) {
    const color = getPaletteColor(options, [i]) || colorDefault;
    const direction = i % 2 === 0 ? 'right' : 'left';
    const isFirst = i === 0;
    const isLast = i === items.length - 1;
    const y = getYPositions(i, { roadWidth, innerRadius, outerRadius });

    if (direction === 'right') {
      const p1: [number, number] = isFirst ? [x6, y.y1] : [x4, y.y1];
      const p2: [number, number] = [x3, y.y1];
      const p3: [number, number] = [x3, y.y5];
      const p4: [number, number] = isFirst ? [x6, y.y2] : [x4, y.y2];
      const p5: [number, number] = [x3, y.y2];

      midPath.push(
        isFirst
          ? moveTo(x6, y.y1 + halfRoadWidth)
          : lineTo(x4, y.y1 + halfRoadWidth),
        lineTo(x3, y.y1 + halfRoadWidth),
        arcTo(outerRadius - halfRoadWidth, 0, x3, y.y4 + halfRoadWidth),
      );

      positivePath.push(
        isFirst ? moveTo(...p1) : lineTo(...p1),
        lineTo(...p2),
        arcTo(outerRadius, 0, ...p3),
      );

      negativePath.push(
        lineTo(...p4),
        lineTo(...p5),
        arcTo(innerRadius, 1, ...p5),
      );

      if (isLast) {
        const s = roadWidth / 2;
        positivePath.push(
          lineTo(xMid, y.y5),
          lineTo(xMid, y.y5 + s),
          lineTo(xMid + roadWidth, y.y5 - s),
          lineTo(xMid, y.y4 - s),
          lineTo(xMid, y.y4),
          lineTo(x3, y.y4),
        );
        midPath.push(lineTo(xMid, y.y4 + halfRoadWidth));
      }
    } else {
      const p1: [number, number] = [x3, y.y2];
      const p2: [number, number] = [x4, y.y2];
      const p3: [number, number] = [x4, y.y4];
      const p4: [number, number] = [x3, y.y1];
      const p5: [number, number] = [x4, y.y1];

      midPath.push(
        lineTo(x4, y.y1 + halfRoadWidth),
        arcTo(outerRadius - halfRoadWidth, 1, x4, y.y4 + halfRoadWidth),
      );
      positivePath.push(
        lineTo(...p1),
        lineTo(...p2),
        arcTo(innerRadius, 1, ...p3),
      );
      negativePath.push(
        lineTo(...p4),
        lineTo(...p5),
        arcTo(outerRadius, 0, ...p5),
      );

      if (isLast) {
        const s = roadWidth / 2;
        positivePath.push(
          lineTo(xMid, y.y4),
          lineTo(xMid, y.y4 - s),
          lineTo(xMid - roadWidth, y.y4 + s),
          lineTo(xMid, y.y5 + s),
          lineTo(xMid, y.y5),
          lineTo(x4, y.y5),
        );
        midPath.push(lineTo(xMid, y.y4 + halfRoadWidth));
      }
    }

    // 装饰
    buildDecorations({
      direction,
      x: { x1, x4, x6 },
      y,
      color,
      elements: decorationElements,
    });

    // 元素
    const { icon, label, item } = renderItemRow({
      i,
      direction,
      x: { x1, x3, x4, x6 },
      y,
      color,
      data,
      itemBounds,
      item: items[i],
      Item,
      flipped,
    });
    itemIcons.push(icon);
    seriesNumber.push(label);
    itemElements.push(item);
  }

  const pathArr = [...positivePath, ...negativePath.reverse(), 'Z'];
  const roadmapHeight =
    items.length * (roadWidth + innerRadius * 2) + roadWidth * 1.5;

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {titleContent}
      <Group
        width={totalWidth}
        height={
          itemBounds.height <= outerRadius * 2
            ? roadmapHeight
            : roadmapHeight + itemBounds.height - outerRadius * 2
        }
      >
        <Path
          width={rowWidth}
          height={roadmapHeight}
          d={pathArr.join(' ')}
          fill={colorDefault}
          stroke={colorDefault}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-element-type="shape"
        />
        <Path
          d={midPath.join(' ')}
          stroke="white"
          fill="none"
          strokeWidth="3"
          strokeDasharray="8 8"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-element-type="shape"
        />
        <>
          {itemIcons}
          {seriesNumber}
          {itemElements}
          {decorationElements}
        </>
      </Group>
    </FlexLayout>
  );
};

registerStructure('sequence-roadmap-vertical', {
  component: SequenceRoadmapVertical,
  composites: ['title', 'item'],
});
