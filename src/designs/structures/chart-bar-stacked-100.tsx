import tinycolor from 'tinycolor2';
import type { ComponentType, JSXElement } from '../../jsx';
import { getElementBounds, Group, Path, Rect, Text } from '../../jsx';
import { getPaletteColor as getPaletteColorByIndex } from '../../renderer';
import type {
  Padding,
  StackedBarCategory,
  StackedBarRowDatum,
} from '../../types';
import { measureText, parsePadding } from '../../utils';
import { ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { getThemeColors } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface ChartBarStacked100Props extends BaseStructureProps {
  barAreaWidth?: number;
  barHeight?: number;
  rowGap?: number;
  labelGap?: number;
  padding?: Padding;
  showPercentage?: boolean;
}

export interface NormalizedStackedBarRow {
  label?: string;
  total: number;
  segments: Array<{ id: string; value: number; percent: number }>;
}

/** Keep input values intact so the same data can be edited and rendered again. */
export function normalizeStackedBarRows(
  categories: StackedBarCategory[],
  rows: StackedBarRowDatum[],
): NormalizedStackedBarRow[] {
  if (!categories.length) {
    throw new Error('Stacked bar chart requires at least one category.');
  }

  const categoryIds = new Set<string>();
  categories.forEach((category) => {
    if (!category.id || !category.label || categoryIds.has(category.id)) {
      throw new Error('Stacked bar categories need unique IDs and labels.');
    }
    categoryIds.add(category.id);
  });

  return rows.map((row, rowIndex) => {
    const values = new Map<string, number>();
    for (const segment of row.children || []) {
      if (!categoryIds.has(segment.id) || values.has(segment.id)) {
        throw new Error(
          `Stacked bar row ${rowIndex + 1} has an unknown or repeated category ID: ${segment.id}.`,
        );
      }
      if (
        typeof segment.value !== 'number' ||
        !Number.isFinite(segment.value) ||
        segment.value < 0
      ) {
        throw new Error(
          `Stacked bar row ${rowIndex + 1} has an invalid value for ${segment.id}.`,
        );
      }
      values.set(segment.id, segment.value);
    }

    const total = categories.reduce(
      (sum, category) => sum + (values.get(category.id) ?? 0),
      0,
    );
    if (!Number.isFinite(total)) {
      throw new Error(`Stacked bar row ${rowIndex + 1} has an invalid total.`);
    }

    return {
      label: row.label,
      total,
      segments: categories.map((category) => {
        const value = values.get(category.id) ?? 0;
        return {
          id: category.id,
          value,
          percent: total > 0 ? (value / total) * 100 : 0,
        };
      }),
    };
  });
}

function segmentPath(
  x: number,
  y: number,
  width: number,
  height: number,
  roundLeft: boolean,
  roundRight: boolean,
) {
  const radius = Math.min(7, height / 2, width / 2);
  const left = roundLeft ? radius : 0;
  const right = roundRight ? radius : 0;
  return `M${x + left} ${y} H${x + width - right} Q${x + width} ${y} ${x + width} ${y + right} V${y + height - right} Q${x + width} ${y + height} ${x + width - right} ${y + height} H${x + left} Q${x} ${y + height} ${x} ${y + height - left} V${y + left} Q${x} ${y} ${x + left} ${y} Z`;
}

export const ChartBarStacked100: ComponentType<ChartBarStacked100Props> = (
  props,
) => {
  const {
    Title,
    Item,
    data,
    options,
    barAreaWidth = 600,
    barHeight = 32,
    rowGap = 20,
    labelGap = 16,
    padding = 24,
    showPercentage = true,
  } = props;
  const { title, desc, items = [] } = data;
  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  if (!items.length) {
    return <FlexLayout id="infographic-container">{titleContent}</FlexLayout>;
  }

  const categories =
    (data as typeof data & { categories?: StackedBarCategory[] }).categories ??
    [];
  const rows = normalizeStackedBarRows(
    categories,
    items as StackedBarRowDatum[],
  );
  const [paddingTop, paddingRight, paddingBottom, paddingLeft] =
    parsePadding(padding);
  const itemBounds = items.map((item, index) =>
    getElementBounds(<Item indexes={[index]} datum={item} data={data} />),
  );
  const labelWidth = Math.max(140, ...itemBounds.map((bounds) => bounds.width));
  const labelHeight = Math.max(
    20,
    ...itemBounds.map((bounds) => bounds.height),
  );
  const rowHeight = Math.max(barHeight, labelHeight);
  const plotX = paddingLeft + labelWidth + labelGap;
  const chartWidth = plotX + barAreaWidth + paddingRight;
  const themeColors = getThemeColors(options.themeConfig);
  const textColor = themeColors.colorTextSecondary;
  const categoryColors = categories.map(
    (_, index) =>
      getPaletteColorByIndex(
        options.themeConfig.palette,
        [index],
        categories.length,
      ) || themeColors.colorPrimary,
  );

  const legendElements: JSXElement[] = [];
  let legendX = paddingLeft;
  let legendY = paddingTop;
  const legendLineHeight = 24;
  categories.forEach((category, index) => {
    const textWidth = measureText(category.label, { fontSize: 13 }).width;
    const itemWidth = 12 + 7 + textWidth + 20;
    if (
      legendX > paddingLeft &&
      legendX + itemWidth > chartWidth - paddingRight
    ) {
      legendX = paddingLeft;
      legendY += legendLineHeight;
    }
    legendElements.push(
      <Rect
        x={legendX}
        y={legendY + 5}
        width={10}
        height={10}
        rx={5}
        fill={categoryColors[index]}
      />,
      <Text x={legendX + 17} y={legendY} fontSize={13} fill={textColor}>
        {category.label}
      </Text>,
    );
    legendX += itemWidth;
  });

  const plotY = legendY + legendLineHeight + 16;
  const chartHeight = items.length * rowHeight + (items.length - 1) * rowGap;
  const axisY = plotY + chartHeight + 12;
  const totalHeight = axisY + 24 + paddingBottom;
  const gridElements: JSXElement[] = [];
  const axisElements: JSXElement[] = [];
  for (let tick = 0; tick <= 100; tick += 20) {
    const x = plotX + (barAreaWidth * tick) / 100;
    gridElements.push(
      <Path
        d={`M${x} ${plotY} V${plotY + chartHeight}`}
        stroke={textColor}
        strokeOpacity={0.12}
      />,
    );
    axisElements.push(
      <Text
        x={x - 20}
        y={axisY}
        width={40}
        height={20}
        alignHorizontal="center"
        alignVertical="middle"
        fontSize={12}
        fill={textColor}
      >
        {`${tick}%`}
      </Text>,
    );
  }

  const barElements: JSXElement[] = [];
  const valueElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];
  rows.forEach((row, rowIndex) => {
    const rowY = plotY + rowIndex * (rowHeight + rowGap);
    const barY = rowY + (rowHeight - barHeight) / 2;
    itemElements.push(
      <Item
        indexes={[rowIndex]}
        datum={items[rowIndex]}
        data={data}
        x={paddingLeft}
        y={rowY}
        width={labelWidth}
        height={rowHeight}
        positionV="middle"
      />,
    );

    if (row.total === 0) {
      barElements.push(
        <Rect
          x={plotX}
          y={barY}
          width={barAreaWidth}
          height={barHeight}
          rx={7}
          fill={themeColors.colorBgElevated}
        />,
      );
      valueElements.push(
        <Text
          x={plotX}
          y={barY}
          width={barAreaWidth}
          height={barHeight}
          alignHorizontal="center"
          alignVertical="middle"
          fontSize={12}
          fill={textColor}
        >
          No Data
        </Text>,
      );
      return;
    }

    const nonZeroIndexes = row.segments
      .map((segment, index) => (segment.value > 0 ? index : -1))
      .filter((index) => index >= 0);
    let usedWidth = 0;
    row.segments.forEach((segment, categoryIndex) => {
      if (segment.value === 0) return;
      const isLast =
        categoryIndex === nonZeroIndexes[nonZeroIndexes.length - 1];
      const segmentWidth = isLast
        ? barAreaWidth - usedWidth
        : (barAreaWidth * segment.value) / row.total;
      const segmentX = plotX + usedWidth;
      const color = categoryColors[categoryIndex];
      barElements.push(
        <Path
          d={segmentPath(
            segmentX,
            barY,
            segmentWidth,
            barHeight,
            categoryIndex === nonZeroIndexes[0],
            isLast,
          )}
          width={segmentWidth}
          height={barHeight}
          fill={color}
          data-element-type="shape"
        />,
      );

      if (showPercentage) {
        const label = `${segment.percent.toFixed(1)}%`;
        const labelWidth = measureText(label, { fontSize: 12 }).width;
        if (segmentWidth >= labelWidth + 12) {
          valueElements.push(
            <Text
              x={segmentX}
              y={barY}
              width={segmentWidth}
              height={barHeight}
              alignHorizontal="center"
              alignVertical="middle"
              fontSize={12}
              fill={tinycolor(color).isDark() ? '#fff' : '#111'}
            >
              {label}
            </Text>,
          );
        }
      }
      usedWidth += segmentWidth;
    });
  });

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {titleContent}
      <Group width={chartWidth} height={totalHeight}>
        <Group>{legendElements}</Group>
        <Group>{gridElements}</Group>
        <Group>{barElements}</Group>
        <Group>{valueElements}</Group>
        <Group>{axisElements}</Group>
        <ItemsGroup>{itemElements}</ItemsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('chart-bar-stacked-100', {
  component: ChartBarStacked100,
  composites: ['title', 'item'],
});
