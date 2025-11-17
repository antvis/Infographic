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
import { ItemDesc, ItemIcon, ItemLabel, ItemValue } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface ProgressCardProps extends BaseItemProps {
  width?: number;
  height?: number;
  iconSize?: number;
  gap?: number;
  progressHeight?: number;
  borderRadius?: number;
}

export const ProgressCard: ComponentType<ProgressCardProps> = (props) => {
  const [
    {
      datum,
      data,
      indexes,
      width = 280,
      height = 120,
      iconSize = 32,
      gap = 12,
      progressHeight = 8,
      borderRadius = 12,
      positionH = 'normal',
      themeColors,
      valueFormatter = (v: any) => `${v}%`,
    },
    restProps,
  ] = getItemProps(props, [
    'width',
    'height',
    'iconSize',
    'gap',
    'progressHeight',
    'borderRadius',
  ]);

  const value = datum.value;
  const displayValue = value ?? 0;
  const maxValue = Math.max(...data.items.map((item) => item.value ?? 0), 100);
  const progressWidth = width - 2 * gap;

  // 计算进度条的填充宽度
  const progressScale = scaleLinear()
    .domain([0, maxValue])
    .range([0, progressWidth]);
  const progressFillWidth = progressScale(displayValue);

  // 生成唯一的渐变ID
  const gradientId = `${themeColors.colorPrimary}-progress`;
  const progressBgId = `${themeColors.colorPrimaryBg}-progress-bg`;

  // 获取元素边界用于布局计算
  const labelBounds = getElementBounds(<ItemLabel indexes={indexes} />);

  // 计算布局位置
  const contentY = gap;
  const iconX = positionH === 'flipped' ? width - gap - iconSize : gap;
  const iconY = contentY;

  const textStartX = positionH === 'flipped' ? gap : iconSize + 2 * gap;
  const textWidth = width - iconSize - 3 * gap;
  const textY = iconY;
  const progressY = height - gap - progressHeight;
  const hasValue = value !== undefined;

  return (
    <Group {...restProps}>
      {/* 定义渐变 */}
      <Defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={themeColors.colorPrimary} />
          <stop
            offset="100%"
            stopColor={tinycolor
              .mix(themeColors.colorPrimary, '#fff', 20)
              .toHexString()}
          />
        </linearGradient>
        <linearGradient id={progressBgId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={themeColors.colorPrimaryBg} />
          <stop offset="100%" stopColor={themeColors.colorBg} />
        </linearGradient>
      </Defs>

      {/* 卡片背景 */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={themeColors.colorBgElevated}
        stroke={themeColors.colorPrimaryBg}
        strokeWidth={1}
        rx={borderRadius}
        ry={borderRadius}
        data-element-type="shape"
      />

      {/* 图标 */}
      <ItemIcon
        indexes={indexes}
        x={iconX}
        y={iconY}
        size={iconSize}
        fill={themeColors.colorPrimary}
      />

      {/* 标签 */}
      <ItemLabel
        indexes={indexes}
        x={textStartX}
        y={textY}
        width={textWidth}
        alignHorizontal={positionH === 'flipped' ? 'right' : 'left'}
        alignVertical="top"
        fontSize={16}
        fontWeight="medium"
        fill={themeColors.colorText}
      >
        {datum.label}
      </ItemLabel>

      {/* 数值 */}
      {hasValue && (
        <ItemValue
          indexes={indexes}
          x={textStartX}
          y={textY + labelBounds.height}
          width={textWidth}
          alignHorizontal={positionH === 'flipped' ? 'right' : 'left'}
          alignVertical="top"
          lineHeight={1}
          fontSize={24}
          fontWeight="bold"
          fill={themeColors.colorPrimary}
          value={displayValue}
          formatter={valueFormatter}
        />
      )}

      {/* 描述 */}
      <ItemDesc
        indexes={indexes}
        x={textStartX}
        y={textY + labelBounds.height + (hasValue ? 27 : 4)}
        width={textWidth}
        alignHorizontal={positionH === 'flipped' ? 'right' : 'left'}
        alignVertical="top"
        fontSize={11}
        fill={themeColors.colorTextSecondary}
        lineNumber={hasValue ? 2 : 3}
        wordWrap={true}
      >
        {datum.desc}
      </ItemDesc>

      {/* 进度条背景 */}
      <Rect
        x={gap}
        y={progressY}
        width={progressWidth}
        height={progressHeight}
        fill={`url(#${progressBgId})`}
        rx={progressHeight / 2}
        ry={progressHeight / 2}
        data-element-type="shape"
      />

      {/* 进度条填充 */}
      <Rect
        x={gap}
        y={progressY}
        width={progressFillWidth}
        height={progressHeight}
        fill={`url(#${gradientId})`}
        rx={progressHeight / 2}
        ry={progressHeight / 2}
        data-element-type="shape"
      />
    </Group>
  );
};

registerItem('progress-card', {
  component: ProgressCard,
  composites: ['icon', 'label', 'value', 'desc'],
});
