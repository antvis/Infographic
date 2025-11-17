/** @jsxImportSource @antv/infographic-jsx */
import type { ComponentType, JSXElement } from '@antv/infographic-jsx';
import { Defs, Group, Point, Polygon, Rect } from '@antv/infographic-jsx';
import roundPolygon, { getSegments } from 'round-polygon';
import tinycolor from 'tinycolor2';
import { BtnsGroup, ItemIcon, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { getPaletteColor, getThemeColors } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface SequencePyramidProps extends BaseStructureProps {
  gap?: number;
  width?: number;
  pyramidWidth?: number;
  itemHeight?: number;
}

export const SequencePyramid: ComponentType<SequencePyramidProps> = (props) => {
  const {
    Title,
    Item,
    data,
    gap = 10,
    width = 700,
    pyramidWidth,
    itemHeight = 60,
    options,
  } = props;
  const { title, desc, items = [] } = data;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  if (items.length === 0) {
    return (
      <FlexLayout
        id="infographic-container"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {titleContent}
      </FlexLayout>
    );
  }

  const radius = 5;
  const themeColors = getThemeColors(options.themeConfig);
  const iconSize = 30;

  const itemElements: JSXElement[] = [];
  const pyramidElements: JSXElement[] = [];
  const backgroundElements: JSXElement[] = [];
  const iconElements: JSXElement[] = [];

  // Calculate dimensions
  const actualPyramidWidth = pyramidWidth ?? width * 0.6;
  const itemAreaWidth = width - actualPyramidWidth;

  // Pyramid layer height should be greater than itemHeight
  const pyramidLayerHeight = itemHeight * 1.2; // Magic number: 20% larger than itemHeight
  const totalHeight =
    items.length * pyramidLayerHeight + (items.length - 1) * gap;

  items.forEach((item, index) => {
    const indexes = [index];
    const isFirst = index === 0;

    // Get color from palette for this item
    const color = getPaletteColor(options, [index]) || themeColors.colorPrimary;

    const { points, topWidth, bottomWidth } = calculateTriangleSegment(
      actualPyramidWidth,
      pyramidLayerHeight,
      gap,
      items.length,
      index,
    );

    const rounded = roundPolygon(points, radius);
    const segments = getSegments(rounded, 'AMOUNT', 10);

    const pyramidCenterX = actualPyramidWidth / 2;
    const pyramidY = index * (pyramidLayerHeight + gap);

    // Background positioning - centered vertically with pyramid layer
    const backgroundYOffset = (pyramidLayerHeight - itemHeight) / 2;
    const backgroundY = pyramidY + backgroundYOffset;

    const rightTopX = pyramidCenterX + topWidth / 2;
    const rightBottomX = pyramidCenterX + bottomWidth / 2;
    const overlapWidth = radius;

    // Background - fixed width from top edge
    const backgroundX = rightTopX - overlapWidth;
    const backgroundWidth = itemAreaWidth + radius;
    const backgroundHeight = itemHeight;
    const backgroundRightEdge = backgroundX + backgroundWidth;

    const iconX = pyramidCenterX - iconSize / 2;
    const iconY =
      pyramidY + pyramidLayerHeight / 2 - iconSize / 2 + (isFirst ? 8 : 0);

    // Item positioning - from current layer's right edge to background's right edge
    const itemX = rightBottomX;
    const itemWidth = backgroundRightEdge - rightBottomX;
    const itemY = backgroundY;

    // Background
    backgroundElements.push(
      <Rect
        x={backgroundX}
        y={backgroundY}
        width={backgroundWidth}
        height={backgroundHeight}
        ry="10"
        fill={themeColors.colorPrimaryBg}
        data-element-type="shape"
      />,
    );

    // Pyramid segment
    const pyramidColorId = `${color}-pyramid-${index}`;
    pyramidElements.push(
      <Defs>
        <linearGradient id={pyramidColorId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0" stop-color={color} />
          <stop
            offset="100%"
            stop-color={tinycolor.mix(color, '#fff', 40).toHexString()}
          />
        </linearGradient>
      </Defs>,
      <Polygon
        points={segments}
        fill={`url(#${pyramidColorId})`}
        y={pyramidY}
        data-element-type="shape"
      />,
    );

    // Icon
    iconElements.push(
      <ItemIcon
        indexes={indexes}
        x={iconX}
        y={iconY}
        size={iconSize}
        fill="#fff"
      />,
    );

    // Item
    itemElements.push(
      <Item
        indexes={indexes}
        datum={item}
        data={data}
        x={itemX}
        y={itemY}
        width={itemWidth}
        height={itemHeight}
        positionV="middle"
      />,
    );
  });

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {titleContent}
      <Group width={width} height={totalHeight}>
        <Group>{backgroundElements}</Group>
        <Group>{pyramidElements}</Group>
        <Group>{iconElements}</Group>
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup />
      </Group>
    </FlexLayout>
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
    const p1: Point = { x: centerX, y: 0 };
    const p2: Point = { x: centerX + bottomWidth / 2, y: height };
    const p3: Point = { x: centerX - bottomWidth / 2, y: height };
    points = [p1, p2, p3];
  } else {
    const p1: Point = { x: centerX + topWidth / 2, y: 0 };
    const p2: Point = { x: centerX + bottomWidth / 2, y: height };
    const p3: Point = { x: centerX - bottomWidth / 2, y: height };
    const p4: Point = { x: centerX - topWidth / 2, y: 0 };
    points = [p1, p2, p3, p4];
  }

  return { points, topWidth, bottomWidth };
}

registerStructure('sequence-pyramid', {
  component: SequencePyramid,
  composites: ['title', 'item'],
});
