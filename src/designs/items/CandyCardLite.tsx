import type { ComponentType } from '../../jsx';
import { Group, Path } from '../../jsx';
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
        rx={22}
        ry={22}
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
        d="M0 0H62.4495C74.9557 0 85.4549 10.8574 84.4557 23.1875V60.1875L77.8772 62.5839C64.3776 67.6876 48.51 64.6893 37.8662 53.7441L10.2361 25.3312C4.91402 19.8571 1.65356 13.1736 0.435652 6.21819L0 0Z"
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
