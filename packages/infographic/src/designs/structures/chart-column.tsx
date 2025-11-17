/** @jsxImportSource @antv/infographic-jsx */
import type { ComponentType, JSXElement } from '@antv/infographic-jsx';
import { Defs, Group, Rect, Text } from '@antv/infographic-jsx';
import { scaleLinear } from 'd3';
import tinycolor from 'tinycolor2';
import { ItemDatum, Padding } from '../../types';
import { parsePadding } from '../../utils';
import { ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { getPaletteColor, getThemeColors } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface ChartColumnProps extends BaseStructureProps {
  columnGap?: number;
  columnWidth?: number;
  padding?: Padding;
  showValue?: boolean;
  valueFormatter?: (value: number, datum: ItemDatum) => string;
}

export const ChartColumn: ComponentType<ChartColumnProps> = (props) => {
  const {
    Title,
    Item,
    data,
    columnGap = 60,
    columnWidth = 50,
    padding = 20,
    showValue = true,
    options,
    valueFormatter = (value) => value.toString(),
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

  const themeColors = getThemeColors(options.themeConfig);

  const values = items.map((item) => item.value ?? 0);
  const sortedValues = [...values, 0].sort((a, b) => a - b);
  const hasNegative = sortedValues[0] < 0;

  const chartWidth =
    items.length * columnWidth + (items.length - 1) * columnGap;
  const chartHeight = 300;

  const [paddingTop, paddingRight, paddingBottom, paddingLeft] =
    parsePadding(padding);

  // Add extra space for negative value labels if needed
  const valueTextHeight = showValue ? 24 : 0; // Estimated height for value text
  const itemGap = 10;
  const extraBottomSpace =
    hasNegative && showValue ? valueTextHeight + itemGap : itemGap;

  const totalWidth = chartWidth + paddingLeft + paddingRight;
  const totalHeight =
    chartHeight + paddingTop + paddingBottom + extraBottomSpace;

  const yScale = scaleLinear()
    .domain([sortedValues[0], sortedValues[sortedValues.length - 1]])
    .range([chartHeight, 0]);

  const zeroY = yScale(0);

  const columnElements: JSXElement[] = [];
  const valueElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];
  const gradientDefs: JSXElement[] = [];

  items.forEach((item, index) => {
    const indexes = [index];
    const value = item.value ?? 0;
    const columnX = paddingLeft + index * (columnWidth + columnGap);
    const columnY = value >= 0 ? yScale(value) : zeroY;
    const columnHeight = Math.abs(yScale(value) - zeroY);

    // Get color from palette for this item
    const color = getPaletteColor(options, [index]) || themeColors.colorPrimary;
    const gradientPositiveId = `${color}-column-positive-${index}`;
    const gradientNegativeId = `${color}-column-negative-${index}`;

    // Create gradient definition for this column
    gradientDefs.push(
      <linearGradient
        id={value >= 0 ? gradientPositiveId : gradientNegativeId}
        x1="0%"
        y1={value >= 0 ? '0%' : '100%'}
        x2="0%"
        y2={value >= 0 ? '100%' : '0%'}
      >
        <stop offset="0%" stopColor={color} />
        <stop
          offset="100%"
          stopColor={tinycolor.mix(color, '#fff', 40).toHexString()}
        />
      </linearGradient>,
    );

    // Column
    columnElements.push(
      <Rect
        x={columnX}
        y={paddingTop + columnY}
        width={columnWidth}
        height={columnHeight}
        fill={`url(#${value >= 0 ? gradientPositiveId : gradientNegativeId})`}
        rx={8}
        ry={8}
        data-element-type="shape"
      />,
    );

    // Value text
    if (showValue) {
      valueElements.push(
        <Text
          x={columnX + columnWidth / 2}
          y={
            value >= 0
              ? paddingTop + columnY - 10
              : paddingTop + columnY + columnHeight + 20
          }
          fontSize={16}
          fontWeight="bold"
          alignHorizontal="center"
          alignVertical={value >= 0 ? 'bottom' : 'top'}
          fill={color}
        >
          {valueFormatter(value, item)}
        </Text>,
      );
    }

    // Item (label)
    const itemWidth = columnWidth + columnGap;
    const itemY = paddingTop + chartHeight + extraBottomSpace;
    itemElements.push(
      <Item
        indexes={indexes}
        datum={item}
        data={data}
        x={columnX + columnWidth / 2 - itemWidth / 2}
        y={itemY}
        width={itemWidth}
        positionH="center"
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
      <Group width={totalWidth} height={totalHeight}>
        <Defs>{gradientDefs}</Defs>
        <Group>{columnElements}</Group>
        <Group>{valueElements}</Group>
        <ItemsGroup>{itemElements}</ItemsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('chart-column', {
  component: ChartColumn,
  composites: ['title', 'item'],
});
