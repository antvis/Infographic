/** @jsxImportSource @antv/infographic-jsx */
import {
  ComponentType,
  Group,
  Path,
  getElementBounds,
} from '@antv/infographic-jsx';
import { ItemDesc, ItemIcon, ItemLabel } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface QuarterSimpleCardProps extends BaseItemProps {
  width?: number;
  height?: number;
  iconSize?: number;
  padding?: number;
  borderRadius?: number;
}

export const QuarterSimpleCard: ComponentType<QuarterSimpleCardProps> = (
  props,
) => {
  const [
    {
      datum,
      indexes,
      width = 150,
      height = 150,
      iconSize = 30,
      padding = 20,
      borderRadius = 16,
      positionH = 'center',
      positionV = 'middle',
      themeColors,
    },
    restProps,
  ] = getItemProps(props, [
    'width',
    'height',
    'iconSize',
    'padding',
    'borderRadius',
  ]);

  // 计算内容区域
  const contentWidth = width - padding * 2;
  const contentX = padding;
  const contentY = padding;

  // 图标位置
  const iconX =
    positionH === 'flipped'
      ? width - padding - iconSize
      : positionH === 'center'
        ? (width - iconSize) / 2
        : contentX;

  const iconY = contentY;

  // 标签位置（图标下方）
  const labelY = iconY + iconSize + 8;
  const labelBounds = getElementBounds(
    <ItemLabel indexes={indexes} width={contentWidth}>
      {datum.label}
    </ItemLabel>,
  );

  const labelX =
    positionH === 'flipped'
      ? width - padding - contentWidth
      : positionH === 'center'
        ? padding
        : contentX;

  // 描述位置（标签下方）
  const descY = labelY + labelBounds.height + 4;
  const descX = labelX;

  // 根据 positionH 和 positionV 决定直角位置
  const r = borderRadius;
  let cardPath = '';

  if (positionH === 'center' && positionV === 'middle') {
    // 四个角都为圆角
    cardPath = `
  M ${r} 0
  L ${width - r} 0
  Q ${width} 0 ${width} ${r}
  L ${width} ${height - r}
  Q ${width} ${height} ${width - r} ${height}
  L ${r} ${height}
  Q 0 ${height} 0 ${height - r}
  L 0 ${r}
  Q 0 0 ${r} 0
  Z
`;
  } else if (positionH === 'flipped' && positionV === 'flipped') {
    // 直角在左下角
    cardPath = `
  M ${r} 0
  L ${width - r} 0
  Q ${width} 0 ${width} ${r}
  L ${width} ${height - r}
  Q ${width} ${height} ${width - r} ${height}
  L ${r} ${height}
  Q 0 ${height} 0 ${height - r}
  L 0 0
  L ${r} 0
  Z
`;
  } else if (positionH === 'normal' && positionV === 'flipped') {
    // 右上角为直角，其它角为圆角
    cardPath = `
  M 0 0
  L ${width} 0
  L ${width} ${height - r}
  Q ${width} ${height} ${width - r} ${height}
  L ${r} ${height}
  Q 0 ${height} 0 ${height - r}
  L 0 ${r}
  Q 0 0 ${r} 0
  Z
`;
  } else if (positionH === 'flipped') {
    // 直角在左上角
    cardPath = `
  M ${r} 0
  L ${width - r} 0
  Q ${width} 0 ${width} ${r}
  L ${width} ${height - r}
  Q ${width} ${height} ${width - r} ${height}
  L 0 ${height}
  L 0 ${r}
  Q 0 0 ${r} 0
  Z
`;
  } else {
    // 默认逻辑：直角在右下角
    cardPath = `
  M ${r} 0
  L ${width - r} 0
  Q ${width} 0 ${width} ${r}
  L ${width} ${height}
  L ${r} ${height}
  Q 0 ${height} 0 ${height - r}
  L 0 ${r}
  Q 0 0 ${r} 0
  Z
`;
  }

  return (
    <Group {...restProps}>
      {/* 背景卡片 - 三个圆角 */}
      <Path
        d={cardPath}
        x={0}
        y={0}
        width={width}
        height={height}
        fill={themeColors.colorPrimary}
        data-element-type="shape"
      />

      {/* 图标 */}
      <ItemIcon
        indexes={indexes}
        x={iconX}
        y={iconY}
        size={iconSize}
        fill={themeColors.colorBg}
      />

      {/* 标签 */}
      <ItemLabel
        indexes={indexes}
        x={labelX}
        y={labelY}
        width={contentWidth}
        fontSize={14}
        fontWeight="bold"
        fill={themeColors.colorBg}
        alignHorizontal={positionH === 'flipped' ? 'right' : 'left'}
      >
        {datum.label}
      </ItemLabel>

      {/* 描述 */}
      {datum.desc && (
        <ItemDesc
          indexes={indexes}
          x={descX}
          y={descY}
          width={contentWidth}
          fontSize={11}
          wordWrap={true}
          fill={themeColors.colorBg}
          alignHorizontal={positionH === 'flipped' ? 'right' : 'left'}
        >
          {datum.desc}
        </ItemDesc>
      )}
    </Group>
  );
};

registerItem('quarter-simple-card', {
  component: QuarterSimpleCard,
  composites: ['icon', 'label', 'desc'],
});
