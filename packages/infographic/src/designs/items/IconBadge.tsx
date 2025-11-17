import tinycolor from 'tinycolor2';
import { ComponentType, Defs, Ellipse, Group, Text } from '../../jsx';
import { ItemIcon, ItemLabel } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface IconBadgeProps extends BaseItemProps {
  size?: number;
  iconSize?: number;
  badgeSize?: number;
  gap?: number;
}

export const IconBadge: ComponentType<IconBadgeProps> = (props) => {
  const [
    {
      datum,
      indexes,
      size = 80,
      iconSize = 28,
      badgeSize = 24,
      gap = 8,
      themeColors,
      width = 84,
      height = 105,
    },
    restProps,
  ] = getItemProps(props, ['size', 'iconSize', 'badgeSize', 'gap']);

  const value = datum.value ?? 0;
  const gradientId = `${themeColors.colorPrimary}-icon`;
  const badgeGradientId = '#ff6b6b-badge';

  return (
    <Group {...restProps} width={width} height={height}>
      <Defs>
        <radialGradient id={gradientId} cx="50%" cy="30%" r="70%">
          <stop
            offset="0%"
            stopColor={tinycolor(themeColors.colorPrimary)
              .lighten(30)
              .toHexString()}
          />
          <stop offset="100%" stopColor={themeColors.colorPrimary} />
        </radialGradient>
        <linearGradient
          id={badgeGradientId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="100%" stopColor="#ee5a52" />
        </linearGradient>
      </Defs>

      {/* 主圆形背景 */}
      <Ellipse
        x={0}
        y={0}
        width={size}
        height={size}
        fill={`url(#${gradientId})`}
        data-element-type="shape"
      />

      {/* 图标 */}
      <ItemIcon
        indexes={indexes}
        x={(size - iconSize) / 2}
        y={(size - iconSize) / 2}
        size={iconSize}
        fill={themeColors.colorPrimaryText}
      />

      {/* 数值徽章 */}
      <Ellipse
        x={size - badgeSize + 4}
        y={0}
        width={badgeSize}
        height={badgeSize}
        fill={`url(#${badgeGradientId})`}
      />

      {/* 徽章数值 */}
      <Text
        x={size - badgeSize / 2 + 4}
        y={badgeSize / 2}
        fontSize={10}
        fontWeight="bold"
        fill={themeColors.colorWhite}
        alignHorizontal="center"
        alignVertical="middle"
      >
        {value > 99 ? '99+' : Math.round(value)}
      </Text>

      {/* 标签 */}
      <ItemLabel
        indexes={indexes}
        x={0}
        y={size + gap}
        width={size}
        alignHorizontal="center"
        fontSize={12}
        fill={themeColors.colorText}
      >
        {datum.label}
      </ItemLabel>
    </Group>
  );
};

registerItem('icon-badge', {
  component: IconBadge,
  composites: ['icon', 'label'],
});
