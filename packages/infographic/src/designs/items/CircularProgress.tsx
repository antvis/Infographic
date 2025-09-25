/** @jsxImportSource @antv/infographic-jsx */
import { ComponentType, Ellipse, Group, Text } from '@antv/infographic-jsx';
import { ItemLabel } from '../components';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';
import { getItemProps } from './utils';

export interface CircularProgressProps extends BaseItemProps {
  size?: number;
  strokeWidth?: number;
  gap?: number;
}

export const CircularProgress: ComponentType<CircularProgressProps> = (
  props,
) => {
  const [
    { datum, indexes, size = 120, strokeWidth = 12, gap = 8, themeColors },
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

  return (
    <Group {...restProps}>
      {/* 完整圆环背景轨道 - 表示100% */}
      <Ellipse
        x={strokeWidth / 2}
        y={strokeWidth / 2}
        width={size - strokeWidth}
        height={size - strokeWidth}
        fill="none"
        stroke="#f0f0f0"
        strokeWidth={strokeWidth}
      />

      {/* 进度圆环 */}
      <Ellipse
        x={strokeWidth / 2}
        y={strokeWidth / 2}
        width={size - strokeWidth}
        height={size - strokeWidth}
        fill="none"
        stroke={themeColors.colorPrimary}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90 ${center} ${center})`}
      />

      {/* 中心数值 */}
      <Text
        x={center}
        y={center - 4}
        fontSize={24}
        fontWeight="bold"
        fill={themeColors.colorText}
        alignHorizontal="center"
        alignVertical="center"
      >
        {`${Math.round(value)}%`}
      </Text>

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

registerItem('circular-progress', { component: CircularProgress });
