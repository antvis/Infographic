/** @jsxImportSource @antv/infographic-jsx */
import { ComponentType, Ellipse, Group, Rect } from '@antv/infographic-jsx';
import { ItemLabel, ItemValue } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface CircularProgressProps extends BaseItemProps {
  size?: number;
  strokeWidth?: number;
  gap?: number;
}

export const CircularProgress: ComponentType<CircularProgressProps> = (
  props,
) => {
  const [
    {
      datum,
      indexes,
      size = 120,
      strokeWidth = 12,
      gap = 8,
      themeColors,
      valueFormatter = (value: any) => `${Math.round(value)}%`,
    },
    restProps,
  ] = getItemProps(props, ['size', 'strokeWidth', 'gap']);

  const value = datum.value ?? 0;
  const maxValue = 100;
  const percentage = Math.min(Math.max(value / maxValue, 0), 1);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * (1 - percentage);

  const center = size / 2;
  const start = strokeWidth / 2;
  const d = size - strokeWidth;

  const bounds = { x: start, y: start, width: d, height: d };
  return (
    <Group {...restProps} width={size} height={size + gap + 20}>
      {/* 圆环背景轮廓，避免 getBBox 不准确 */}
      <Rect width={size} height={size} fill="none" />
      {/* 完整圆环背景轨道 - 表示100% */}
      <Ellipse
        {...bounds}
        fill="none"
        stroke="#f0f0f0"
        strokeWidth={strokeWidth}
      />

      {/* 进度圆环 */}
      <Ellipse
        {...bounds}
        fill="none"
        stroke={themeColors.colorPrimary}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90 ${center} ${center})`}
      />

      {/* 中心数值 */}
      <ItemValue
        indexes={indexes}
        x={strokeWidth}
        y={strokeWidth}
        width={d - strokeWidth}
        height={d - strokeWidth}
        fontSize={24}
        fontWeight="bold"
        fill={themeColors.colorPrimary}
        alignHorizontal="center"
        alignVertical="center"
        value={value}
        formatter={valueFormatter}
      />

      {/* 底部标签 */}
      <ItemLabel
        indexes={indexes}
        x={0}
        y={size + gap}
        width={size}
        alignHorizontal="center"
        fontSize={12}
        fill={themeColors.colorTextSecondary}
      >
        {datum.label}
      </ItemLabel>
    </Group>
  );
};

registerItem('circular-progress', {
  component: CircularProgress,
  composites: ['label', 'value'],
});
