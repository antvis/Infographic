import { scaleLinear } from 'd3';
import type { ComponentType, JSXElement } from '../../jsx';
import { getElementBounds, Group, Path, Rect, Text } from '../../jsx';
import { ItemDatum, Padding } from '../../types';
import { parsePadding } from '../../utils';
import { ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { getColorPrimary, getPaletteColor, getThemeColors } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface ChartBarProps extends BaseStructureProps {
  width?: number;
  gap?: number;
  barGap?: number;
  barHeight?: number;
  barAreaWidth?: number;
  labelGap?: number;
  padding?: Padding;
  showValue?: boolean;
  valueFormatter?: (value: number, datum: ItemDatum) => string;
}

export const ChartBar: ComponentType<ChartBarProps> = (props) => {
  const {
    Title,
    Item,
    data,
    width,
    gap,
    barGap,
    barHeight = 28,
    barAreaWidth,
    labelGap = 16,
    padding = 24,
    showValue = true,
    options,
    valueFormatter = (value) => value.toString(),
  } = props;

  const resolvedBarAreaWidth = barAreaWidth ?? width ?? 480;
  const { title, desc, items = [], xTitle, yTitle } = data;

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

  const [paddingTop, paddingRight, paddingBottom, paddingLeft] =
    parsePadding(padding);

  const sampleDatum = items[0] ?? { label: '', value: 0 };
  const itemBounds = getElementBounds(
    <Item indexes={[0]} datum={sampleDatum} data={data} />,
  );

  const labelWidth = itemBounds.width || 140;
  const labelHeight = itemBounds.height || barHeight;
  const rowHeight = Math.max(barHeight, labelHeight);
  const gapByHeight = Math.max(12, rowHeight * 0.35);
  const resolvedGap = barGap ?? gap ?? gapByHeight;

  const values = items.map((item) => item.value ?? 0);
  const maxValue = Math.max(...values, 0);
  const minValue = Math.min(...values, 0);

  const domainMin = minValue < 0 ? minValue * 1.1 : 0;
  let domainMax = maxValue > 0 ? maxValue * 1.1 : 0;

  if (domainMax === domainMin) {
    domainMax = domainMin + 1;
  }

  const scale = scaleLinear()
    .domain([domainMin, domainMax])
    .range([0, resolvedBarAreaWidth]);

  const zeroX = Math.min(Math.max(scale(0), 0), resolvedBarAreaWidth);
  const minBarWidth = Math.max(2, resolvedBarAreaWidth * 0.02);

  const chartHeight = items.length * (rowHeight + resolvedGap) - resolvedGap;
  const yTitleSpace = yTitle ? 24 : 0;
  const xTickSpace = 20;
  const xTitleSpace = xTitle ? 24 : 0;
  const yStart = paddingTop + yTitleSpace;
  const barStartX = paddingLeft + labelWidth + labelGap;
  const valueSpace = showValue ? 80 : 0;
  const axisGap = Math.max(8, rowHeight * 0.2);
  const totalWidth =
    barStartX + resolvedBarAreaWidth + valueSpace + paddingRight;
  const totalHeight =
    yStart + chartHeight + axisGap + xTickSpace + xTitleSpace + paddingBottom;

  const themeColors = getThemeColors(options.themeConfig);
  const axisColor = themeColors.colorText || '#666';
  const colorPrimary = getColorPrimary(options);

  const barElements: JSXElement[] = [];
  const valueElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];
  const axisElements: JSXElement[] = [];
  const tickElements: JSXElement[] = [];
  const gridElements: JSXElement[] = [];
  const titleElements: JSXElement[] = [];
  const axisY = yStart + chartHeight + axisGap;

  const formatTick = (value: number) =>
    Number.isInteger(value) ? value.toString() : value.toFixed(1);

  items.forEach((item, index) => {
    const indexes = [index];
    const value = item.value ?? 0;
    const rowY = yStart + index * (rowHeight + resolvedGap);
    const barY = rowY + (rowHeight - barHeight) / 2;
    const barX = value >= 0 ? barStartX + zeroX : barStartX + scale(value);
    const barWidthRaw =
      value >= 0 ? scale(value) - zeroX : zeroX - scale(value);
    const barWidth = barWidthRaw === 0 ? minBarWidth : barWidthRaw;

    const barColor =
      getPaletteColor(options, [index]) || themeColors.colorPrimary;

    barElements.push(
      <Rect
        x={barX}
        y={barY}
        width={barWidth}
        height={barHeight}
        fill={barColor}
        rx={6}
        ry={6}
        data-element-type="shape"
      />,
    );

    if (showValue) {
      const valueX = value >= 0 ? barX + barWidth + 8 : barX - 8;
      valueElements.push(
        <Text
          x={valueX}
          y={barY + barHeight / 2}
          alignHorizontal={value >= 0 ? 'left' : 'right'}
          alignVertical="middle"
          fontSize={14}
          fontWeight="bold"
          fill={barColor}
        >
          {valueFormatter(value, item)}
        </Text>,
      );
    }

    itemElements.push(
      <Item
        indexes={indexes}
        datum={item}
        data={data}
        x={paddingLeft}
        y={rowY + (rowHeight - labelHeight) / 2}
        width={labelWidth}
        height={labelHeight}
        positionV="middle"
      />,
    );
  });

  const tickCount = Math.max(
    3,
    Math.min(7, Math.floor(resolvedBarAreaWidth / 80)),
  );
  const ticks = scale.ticks(tickCount);
  ticks.forEach((tick) => {
    const tickX = barStartX + scale(tick);
    gridElements.push(
      <Path
        d={`M${tickX} ${yStart} L${tickX} ${yStart + chartHeight}`}
        stroke={axisColor}
        strokeOpacity={0.08}
        data-element-type="shape"
      />,
    );
    tickElements.push(
      <Path
        d={`M${tickX - 0.5} ${axisY} L${tickX - 0.5} ${axisY + 6}`}
        stroke={axisColor}
        data-element-type="shape"
      />,
    );
    tickElements.push(
      <Text
        x={tickX}
        y={axisY + 14}
        alignHorizontal="center"
        alignVertical="middle"
        fontSize={12}
        fill={axisColor}
      >
        {formatTick(tick)}
      </Text>,
    );
  });

  axisElements.push(
    <Path
      d={`M${barStartX} ${axisY} L${barStartX + resolvedBarAreaWidth} ${axisY}`}
      stroke={axisColor}
      data-element-type="shape"
    />,
  );

  if (domainMin < 0) {
    axisElements.push(
      <Rect
        x={barStartX + zeroX - 0.5}
        y={yStart}
        width={1}
        height={chartHeight}
        fill={colorPrimary}
        data-element-type="shape"
      />,
    );
  }

  if (yTitle) {
    titleElements.push(
      <Text
        x={paddingLeft + labelWidth / 2}
        y={paddingTop + yTitleSpace / 2}
        alignHorizontal="center"
        alignVertical="middle"
        fontSize={14}
        fontWeight="bold"
        fill={axisColor}
      >
        {yTitle}
      </Text>,
    );
  }

  if (xTitle) {
    titleElements.push(
      <Text
        x={barStartX + resolvedBarAreaWidth / 2}
        y={axisY + xTickSpace + xTitleSpace / 2}
        alignHorizontal="center"
        alignVertical="middle"
        fontSize={14}
        fontWeight="bold"
        fill={axisColor}
      >
        {xTitle}
      </Text>,
    );
  }

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {titleContent}
      <Group width={totalWidth} height={totalHeight}>
        <Group>{gridElements}</Group>
        <Group>{barElements}</Group>
        <Group>{valueElements}</Group>
        <Group>{titleElements}</Group>
        <Group>{[...axisElements, ...tickElements]}</Group>
        <ItemsGroup>{itemElements}</ItemsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('chart-bar', {
  component: ChartBar,
  composites: ['title', 'item', 'xTitle', 'yTitle'],
});
