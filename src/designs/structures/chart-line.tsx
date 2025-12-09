import { scaleLinear } from 'd3';
import type { ComponentType, JSXElement } from '../../jsx';
import { Defs, Ellipse, getElementBounds, Group, Path, Text } from '../../jsx';
import { ItemDatum, Padding } from '../../types';
import { getSimpleHash, parsePadding } from '../../utils';
import { ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { getColorPrimary, getPaletteColor, getThemeColors } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface ChartLineProps extends BaseStructureProps {
  width?: number;
  height?: number;
  gap?: number;
  padding?: Padding;
  showValue?: boolean;
  valueFormatter?: (value: number, datum: ItemDatum) => string;
}

export const ChartLine: ComponentType<ChartLineProps> = (props) => {
  const {
    Title,
    Item,
    data,
    width,
    height = 260,
    gap = 10,
    padding = 24,
    showValue = true,
    options,
    valueFormatter = (value) => value.toString(),
  } = props;

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

  const itemProps = {
    indexes: [0],
    datum: items[0],
    data,
    positionH: 'center',
    positionV: 'normal',
  };
  const sampleBounds = getElementBounds(<Item {...itemProps} />);
  const labelWidth = sampleBounds.width;
  const labelHeight = sampleBounds.height;
  const xTickSpace = Math.max(28, labelHeight + 14);
  const yTickSpace = 44;
  const yTitleSpace = yTitle ? 26 : 0;
  const xTitleSpace = xTitle ? 22 : 0;

  const baseSpacing = labelWidth + gap;
  const naturalChartWidth =
    items.length > 0 ? (items.length - 1) * baseSpacing + labelWidth : 0;
  const targetChartWidth =
    width !== undefined ? width : Math.max(200, naturalChartWidth || 320);
  const spacing =
    items.length > 1
      ? Math.max(
          baseSpacing,
          (targetChartWidth - labelWidth) / (items.length - 1),
        )
      : 0;
  const derivedChartWidth =
    items.length > 0
      ? Math.max(labelWidth, (items.length - 1) * spacing + labelWidth)
      : 0;

  const chartOriginX = paddingLeft + yTickSpace + yTitleSpace;
  const chartOriginY = paddingTop + yTitleSpace;

  const totalWidth = chartOriginX + derivedChartWidth + paddingRight;
  const totalHeight =
    chartOriginY + height + xTickSpace + xTitleSpace + paddingBottom;

  const values = items.map((item) => item.value ?? 0);
  const maxValue = Math.max(...values, 0);
  const minValue = Math.min(...values, 0);
  const domainPadding = Math.max(Math.abs(maxValue), Math.abs(minValue)) * 0.1;
  const domainMin = minValue < 0 ? minValue - domainPadding : 0;
  let domainMax = maxValue > 0 ? maxValue + domainPadding : 1;

  if (domainMax === domainMin) {
    domainMax = domainMin + 1;
  }

  const scaleY = scaleLinear()
    .domain([domainMin, domainMax])
    .nice()
    .range([height, 0]);

  const zeroY = Math.max(0, Math.min(height, scaleY(0)));
  const axisBaseY = domainMax <= 0 ? 0 : domainMin >= 0 ? height : zeroY;
  const colorPrimary = getColorPrimary(options);
  const themeColors = getThemeColors(options.themeConfig);
  const axisColor = themeColors.colorText || '#666';

  const gridElements: JSXElement[] = [];
  const axisElements: JSXElement[] = [];
  const lineElements: JSXElement[] = [];
  const pointElements: JSXElement[] = [];
  const valueElements: JSXElement[] = [];
  const titleElements: JSXElement[] = [];
  const tickElements: JSXElement[] = [];

  const ticksY = scaleY.ticks(6);
  ticksY.forEach((tick) => {
    const yPos = chartOriginY + scaleY(tick);
    gridElements.push(
      <Path
        d={`M ${chartOriginX} ${yPos} L ${
          chartOriginX + derivedChartWidth
        } ${yPos}`}
        width={derivedChartWidth}
        height={1}
        stroke={axisColor}
        strokeWidth={1}
        data-element-type="shape"
        opacity={0.08}
      />,
    );
    tickElements.push(
      <Text
        x={chartOriginX - 8}
        y={yPos}
        alignHorizontal="right"
        alignVertical="middle"
        fontSize={12}
        fill={axisColor}
      >
        {Number.isInteger(tick) ? tick.toString() : tick.toFixed(1)}
      </Text>,
    );
  });

  const xLabels: JSXElement[] = [];
  const pointPositions: { x: number; y: number; datum: ItemDatum }[] = [];
  const colorStopsData: { x: number; color: string }[] = [];

  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) {
      const p = points[0];
      return `M ${p.x} ${p.y}`;
    }

    const segments: string[] = [];
    segments.push(`M ${points[0].x} ${points[0].y}`);

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      segments.push(`C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`);
    }

    return segments.join(' ');
  };

  items.forEach((item, index) => {
    const x = chartOriginX + index * spacing + labelWidth / 2;
    const y = chartOriginY + scaleY(item.value ?? 0);
    pointPositions.push({ x, y, datum: item });
    xLabels.push(
      <Item
        {...itemProps}
        indexes={[index]}
        datum={item}
        x={x - labelWidth / 2}
        y={chartOriginY + height + 4}
      />,
    );

    const stopColor =
      getPaletteColor(options, [index]) || themeColors.colorPrimary;
    colorStopsData.push({ x, color: stopColor });
  });

  const minStopX =
    colorStopsData.length > 0
      ? Math.min(...colorStopsData.map((s) => s.x))
      : chartOriginX;
  const maxStopX =
    colorStopsData.length > 0
      ? Math.max(...colorStopsData.map((s) => s.x))
      : chartOriginX + derivedChartWidth;
  const stopSpan = Math.max(1, maxStopX - minStopX);

  const gradientStops = colorStopsData.map((s) => (
    <stop
      offset={`${((s.x - minStopX) / stopSpan) * 100}%`}
      stopColor={s.color}
    />
  ));

  const areaStops = colorStopsData.map((s) => (
    <stop
      offset={`${((s.x - minStopX) / stopSpan) * 100}%`}
      stopColor={s.color}
      stopOpacity="0.18"
    />
  ));

  if (colorStopsData.length > 0) {
    const lastColor = colorStopsData[colorStopsData.length - 1].color;
    gradientStops.push(<stop offset="100%" stopColor={lastColor} />);
    areaStops.push(
      <stop offset="100%" stopColor={lastColor} stopOpacity="0.04" />,
    );
  }

  const gradientIdBase = `chart-line-${getSimpleHash(
    [
      derivedChartWidth,
      height,
      axisColor,
      colorPrimary,
      colorStopsData.map((s) => `${s.x.toFixed(2)}-${s.color}`).join(),
    ].join(':'),
  )}`;
  const gradientStrokeId = `${gradientIdBase}-stroke`;
  const gradientAreaId = `${gradientIdBase}-area`;

  const smoothLinePath = createSmoothPath(pointPositions);

  lineElements.push(
    <Path
      d={smoothLinePath}
      width={derivedChartWidth}
      height={height}
      stroke={`url(#${gradientStrokeId})`}
      strokeWidth={3}
      fill="none"
      data-element-type="shape"
    />,
  );

  const areaCurveTail = smoothLinePath.includes('C')
    ? smoothLinePath.slice(smoothLinePath.indexOf('C'))
    : '';

  const areaPath = [
    `M ${pointPositions[0].x} ${chartOriginY + axisBaseY}`,
    `L ${pointPositions[0].x} ${pointPositions[0].y}`,
    areaCurveTail,
    `L ${pointPositions[pointPositions.length - 1].x} ${
      chartOriginY + axisBaseY
    }`,
    'Z',
  ].join(' ');

  lineElements.push(
    <Path
      d={areaPath}
      width={derivedChartWidth}
      height={height}
      fill={`url(#${gradientAreaId})`}
      stroke="none"
      data-element-type="shape"
    />,
  );

  pointPositions.forEach((pos, index) => {
    const paletteColor =
      getPaletteColor(options, [index]) || themeColors.colorPrimary;
    pointElements.push(
      <Ellipse
        x={pos.x - 6}
        y={pos.y - 6}
        width={12}
        height={12}
        fill={paletteColor}
        data-element-type="shape"
      />,
    );

    if (showValue) {
      valueElements.push(
        <Text
          x={pos.x}
          y={pos.y - 12}
          alignHorizontal="center"
          alignVertical="bottom"
          fontSize={12}
          fontWeight="bold"
          fill={paletteColor}
        >
          {valueFormatter(pos.datum.value ?? 0, pos.datum)}
        </Text>,
      );
    }
  });

  axisElements.push(
    <Path
      d={`M ${chartOriginX} ${chartOriginY + axisBaseY} L ${
        chartOriginX + derivedChartWidth
      } ${chartOriginY + axisBaseY}`}
      width={derivedChartWidth}
      height={1}
      stroke={axisColor}
      strokeWidth={1}
      data-element-type="shape"
    />,
  );

  axisElements.push(
    <Path
      d={`M ${chartOriginX} ${chartOriginY} L ${chartOriginX} ${
        chartOriginY + height
      }`}
      width={1}
      height={height}
      stroke={axisColor}
      strokeWidth={1}
      data-element-type="shape"
    />,
  );

  if (xTitle) {
    titleElements.push(
      <Text
        x={chartOriginX + derivedChartWidth / 2}
        y={chartOriginY + height + xTickSpace + xTitleSpace / 2}
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

  if (yTitle) {
    titleElements.push(
      <Text
        x={paddingLeft + yTitleSpace / 2}
        y={chartOriginY + height / 2}
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

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {titleContent}
      <Group width={totalWidth} height={totalHeight}>
        <Defs>
          <linearGradient
            id={gradientStrokeId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            {gradientStops}
          </linearGradient>
          <linearGradient id={gradientAreaId} x1="0%" y1="0%" x2="100%" y2="0%">
            {areaStops}
            <stop offset="100%" stopColor={colorPrimary} stopOpacity="0.04" />
          </linearGradient>
        </Defs>
        <Group>{gridElements}</Group>
        <Group>{[...axisElements, ...tickElements]}</Group>
        <Group>{lineElements}</Group>
        <Group>{pointElements}</Group>
        <Group>{valueElements}</Group>
        <Group>{titleElements}</Group>
        <ItemsGroup>{xLabels}</ItemsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('chart-line', {
  component: ChartLine,
  composites: ['title', 'item', 'xTitle', 'yTitle'],
});
