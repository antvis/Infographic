/** @jsxImportSource @antv/infographic-jsx */
import {
  ComponentType,
  Defs,
  getElementBounds,
  Group,
  Point,
  Polygon,
  Rect,
} from '@antv/infographic-jsx';
import roundPolygon, { getSegments } from 'round-polygon';
import tinycolor from 'tinycolor2';
import { ItemDesc, ItemIcon, ItemLabel } from '../components';
import { getItemId, getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface PyramidProps extends BaseItemProps {
  gap?: number;
  width?: number;
  height?: number;
  iconSize?: number;
  pyramidWidth?: number;
}

export const Pyramid: ComponentType<PyramidProps> = (props) => {
  const [
    {
      datum,
      data,
      indexes,
      gap = 5,
      width = 300,
      height = 60,
      iconSize = 30,
      pyramidWidth = width * 0.6,
      themeColors,
    },
    restProps,
  ] = getItemProps(props, [
    'gap',
    'width',
    'height',
    'iconSize',
    'pyramidWidth',
  ]);

  const radius = 5;
  const { points, topWidth, bottomWidth } = calculateTriangleSegment(
    pyramidWidth,
    height,
    gap,
    data.items.length,
    indexes[0],
  );

  const rounded = roundPolygon(points, radius);

  const segments = getSegments(rounded, 'AMOUNT', 10);

  const isFirst = indexes[0] === 0;
  const pyramidCenterX = pyramidWidth / 2;
  const rightTopX = pyramidCenterX + topWidth / 2;
  const rightCenterX = rightTopX + (bottomWidth - topWidth) / 4;
  const rightBottomX = pyramidCenterX + bottomWidth / 2;
  const overlapWidth = radius;
  const backgroundX = rightTopX - overlapWidth; // radius is overlap
  const backgroundY = radius;
  const backgroundWidth = width - pyramidWidth + radius;
  const backgroundHeight = height - overlapWidth * 2;
  const iconX = pyramidCenterX - iconSize / 2;
  const iconY = height / 2 - iconSize / 2 + (isFirst ? 10 : 0);
  const labelX = rightCenterX;
  const descX = rightBottomX;
  const textWidth = width - pyramidWidth - 40;

  const itemLabelContent = (
    <ItemLabel
      indexes={indexes}
      x={labelX}
      y={10}
      width={textWidth}
      fontSize={14}
      fill={themeColors.colorPrimary}
    >
      {datum.desc}
    </ItemLabel>
  );

  const itemLabelBounds = getElementBounds(itemLabelContent);
  const descY = itemLabelBounds.y + itemLabelBounds.height + 5;

  const pyramidColorId = `${themeColors.colorPrimary}-white`;

  return (
    <Group width={width} height={height} {...restProps}>
      <Defs>
        <linearGradient id={pyramidColorId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0" stop-color={themeColors.colorPrimary} />
          <stop
            offset="100%"
            stop-color={tinycolor
              .mix(themeColors.colorPrimary, '#fff', 40)
              .toHexString()}
          />
        </linearGradient>
      </Defs>
      <Group
        width={width}
        height={height}
        id={getItemId(indexes, 'shapes-group')}
      >
        <Rect
          id={getItemId(indexes, 'static', 'background')}
          x={backgroundX}
          width={backgroundWidth}
          y={backgroundY}
          height={backgroundHeight}
          ry="10"
          fill={themeColors.colorPrimaryBg}
        />
        <Polygon
          id={getItemId(indexes, 'static', 'pyramid')}
          points={segments}
          fill={`url(#${pyramidColorId})`}
        />
        <ItemIcon
          indexes={indexes}
          x={iconX}
          y={iconY}
          size={iconSize}
          fill="#fff"
        />
        {itemLabelContent}
        <ItemDesc
          indexes={indexes}
          x={descX}
          y={descY}
          width={textWidth}
          lineHeight={1}
          lineNumber={1}
          fill={themeColors.colorTextSecondary}
        >
          {datum.desc}
        </ItemDesc>
      </Group>
    </Group>
  );
};

function calculateTriangleSegment(
  width: number,
  height: number,
  gap: number,
  counts: number,
  index: number,
) {
  const centerX = width / 2;

  const triangleHeight = counts * height + (counts - 1) * gap;

  const rectTop = index * (height + gap);
  const rectBottom = rectTop + height;

  const topWidth = (rectTop / triangleHeight) * width;
  const bottomWidth = (rectBottom / triangleHeight) * width;

  let points: Point[];

  if (index === 0) {
    const p1: Point = { x: centerX, y: 0 }; // 三角形顶点
    const p2: Point = { x: centerX + bottomWidth / 2, y: height }; // 右下
    const p3: Point = { x: centerX - bottomWidth / 2, y: height }; // 左下
    points = [p1, p2, p3];
  } else {
    const p1: Point = { x: centerX + topWidth / 2, y: 0 }; // 右上
    const p2: Point = { x: centerX + bottomWidth / 2, y: height }; // 右下
    const p3: Point = { x: centerX - bottomWidth / 2, y: height }; // 左下
    const p4: Point = { x: centerX - topWidth / 2, y: 0 }; // 左上
    points = [p1, p2, p3, p4];
  }

  return { points, topWidth, bottomWidth };
}

registerItem('pyramid', {
  component: Pyramid,
  composites: ['icon', 'label', 'desc'],
});
