/** @jsxImportSource @antv/infographic-jsx */
import type { ComponentType } from '@antv/infographic-jsx';
import { Group, Path } from '@antv/infographic-jsx';
import { ItemDesc, ItemIcon, ItemLabel } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface CandyCardLiteProps extends BaseItemProps {
  width?: number;
  height?: number;
}

export const CandyCardLite: ComponentType<CandyCardLiteProps> = (props) => {
  const [
    { indexes, datum, width = 280, height = 140, themeColors },
    restProps,
  ] = getItemProps(props, ['width', 'height']);

  return (
    <Group {...restProps}>
      {/* 主背景卡片 */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={18}
        ry={18}
        fill={themeColors.colorPrimaryBg}
        stroke={themeColors.colorPrimary}
        data-element-type="shape"
      />

      {/* 右上角白色装饰区域 */}
      <Path
        x={width - 85}
        y={0.5}
        width={85}
        height={65}
        d="M0.496704 0H61.7558C74.0725 0 84.0571 9.99394 84.0571 22.3221V60.1302L78.4401 62.9458C64.9296 68.1198 49.0492 65.0802 38.3968 53.9843L10.7444 25.1801C5.41799 19.6306 2.15489 12.855 0.935998 5.80383L0.496704 0Z"
        fill={themeColors.colorBg}
        data-element-type="shape"
      />

      {/* 主标题 */}
      <ItemLabel
        indexes={indexes}
        x={20}
        y={24}
        width={200}
        alignHorizontal="left"
        alignVertical="middle"
        fill={themeColors.colorText}
      >
        {datum.label}
      </ItemLabel>

      {/* 副标题 */}
      <ItemDesc
        indexes={indexes}
        x={20}
        y={58}
        width={220}
        height={70}
        fill={themeColors.colorTextSecondary}
        alignHorizontal="left"
        alignVertical="top"
      >
        {datum.desc}
      </ItemDesc>

      {/* 右上角插图区域 */}
      <ItemIcon
        indexes={indexes}
        x={width - 48}
        y={12}
        width={32}
        height={32}
        fill={themeColors.colorPrimary}
      />
    </Group>
  );
};

registerItem('candy-card-lite', {
  component: CandyCardLite,
  composites: ['icon', 'label', 'desc'],
});
