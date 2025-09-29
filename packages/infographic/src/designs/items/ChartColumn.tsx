/** @jsxImportSource @antv/infographic-jsx */
import {
  ComponentType,
  Defs,
  getElementBounds,
  Group,
  Rect,
} from '@antv/infographic-jsx';
import { scaleLinear } from 'd3';
import tinycolor from 'tinycolor2';
import type { Padding } from '../../types';
import { parsePadding } from '../../utils';
import { ItemLabel, ItemValue } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface ChartColumnProps extends BaseItemProps {
  padding?: Padding;
  width?: number;
  height?: number;
  gap?: number;
}

export const ChartColumn: ComponentType<ChartColumnProps> = (props) => {
  const [
    {
      data,
      datum,
      indexes,
      padding = [0, 10, 0, 10],
      gap = 5,
      width = 80,
      height = 200,
      themeColors,
      valueFormatter,
    },
    restProps,
  ] = getItemProps(props, ['padding', 'width', 'height', 'gap']);

  const values = data.items.map((item) => item.value ?? 0);
  const value = datum.value ?? 0;
  const [top, right, bottom, left] = parsePadding(padding);

  const columnWidth = width - left - right;
  const labelBounds = getElementBounds(<ItemLabel indexes={indexes} />);
  const valueBounds = getElementBounds(
    <ItemValue indexes={indexes} value={value} />,
  );

  const sortedValues = [...values, 0].sort((a, b) => a - b);
  const hasNegative = sortedValues[0] < 0;
  const yScale = scaleLinear()
    .domain([sortedValues[0], sortedValues[sortedValues.length - 1]])
    .range([
      height -
        bottom -
        labelBounds.height -
        gap -
        (hasNegative ? valueBounds.height + gap : 0),
      top + gap + valueBounds.height,
    ]);

  const gradientColorId = `gradient-${themeColors.colorPrimary}-${value >= 0 ? 'positive' : 'negative'}`;

  const columnY = value >= 0 ? yScale(value) : yScale(0);
  const columnHeight = Math.abs(yScale(value) - yScale(0));

  return (
    <Group {...restProps}>
      <Defs>
        <linearGradient
          x1="0%"
          x2="0%"
          {...(value >= 0
            ? { y1: '0%', y2: '100%' }
            : { y1: '100%', y2: '0%' })}
          id={gradientColorId}
        >
          <stop offset="0%" stopColor={themeColors.colorPrimary} />
          <stop
            offset="100%"
            stopColor={tinycolor
              .mix(themeColors.colorPrimary, '#fff', 40)
              .toHexString()}
          />
        </linearGradient>
      </Defs>
      <ItemValue
        indexes={indexes}
        y={
          value >= 0
            ? columnY - gap - valueBounds.height
            : columnY + columnHeight + gap
        }
        width={width}
        alignHorizontal="center"
        alignVertical={value > 0 ? 'bottom' : 'top'}
        fill={themeColors.colorPrimary}
        value={value}
        formatter={valueFormatter}
      />
      <Rect
        x={left}
        y={columnY}
        width={columnWidth}
        height={columnHeight}
        fill={`url(#${gradientColorId})`}
        rx={8}
        ry={8}
      />
      <ItemLabel
        indexes={indexes}
        y={height - bottom - labelBounds.height}
        width={width}
        alignHorizontal="center"
        alignVertical="top"
        fontWeight="regular"
        fontSize={14}
        fill={themeColors.colorText}
      >
        {datum.label}
      </ItemLabel>
    </Group>
  );
};

registerItem('chart-column', { component: ChartColumn });
