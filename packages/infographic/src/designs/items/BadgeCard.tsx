/** @jsxImportSource @antv/infographic-jsx */
import {
  ComponentType,
  Defs,
  Ellipse,
  Group,
  Rect,
} from '@antv/infographic-jsx';
import tinycolor from 'tinycolor2';
import { ItemDesc, ItemIcon, ItemLabel, ItemValue } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface BadgeCardProps extends BaseItemProps {
  width?: number;
  height?: number;
  iconSize?: number;
  badgeSize?: number;
  gap?: number;
}

export const BadgeCard: ComponentType<BadgeCardProps> = (props) => {
  const [
    {
      datum,
      indexes,
      width = 200,
      height = 80,
      iconSize = 24,
      badgeSize = 32,
      gap = 8,
      positionH = 'normal',
      themeColors,
      valueFormatter,
    },
    restProps,
  ] = getItemProps(props, ['width', 'height', 'iconSize', 'badgeSize', 'gap']);

  const value = datum.value;
  const gradientId = `${themeColors.colorPrimary}-badge`;

  const badgeX = positionH === 'flipped' ? gap : width - gap - badgeSize;
  const badgeY = gap;

  const contentStartX = positionH === 'flipped' ? badgeSize + 2 * gap : gap;
  const contentWidth = width - badgeSize - 3 * gap;

  return (
    <Group {...restProps}>
      <Defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={themeColors.colorPrimary} />
          <stop
            offset="100%"
            stopColor={tinycolor(themeColors.colorPrimary)
              .darken(20)
              .toHexString()}
          />
        </radialGradient>
      </Defs>

      {/* 背景卡片 */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={themeColors.colorPrimaryBg}
        rx={8}
        ry={8}
      />

      {/* 徽章背景 */}
      <Ellipse
        x={badgeX}
        y={badgeY}
        width={badgeSize}
        height={badgeSize}
        fill={`url(#${gradientId})`}
      />

      {/* 徽章图标 */}
      <ItemIcon
        indexes={indexes}
        x={badgeX + (badgeSize - iconSize) / 2}
        y={badgeY + (badgeSize - iconSize) / 2}
        size={iconSize}
        fill={themeColors.colorWhite}
      />

      {/* 标签 */}
      <ItemLabel
        indexes={indexes}
        x={contentStartX}
        y={gap + 2}
        width={contentWidth}
        alignHorizontal={positionH === 'flipped' ? 'right' : 'left'}
        fontSize={14}
        fill={themeColors.colorText}
      >
        {datum.label}
      </ItemLabel>

      {/* 数值 */}
      {value !== undefined && (
        <ItemValue
          indexes={indexes}
          x={contentStartX}
          y={gap + 22}
          width={contentWidth}
          alignHorizontal={positionH === 'flipped' ? 'right' : 'left'}
          fontSize={18}
          fontWeight="bold"
          fill={themeColors.colorPrimary}
          value={value}
          formatter={valueFormatter}
        />
      )}

      {/* 描述 */}
      <ItemDesc
        indexes={indexes}
        x={contentStartX}
        y={value !== undefined ? gap + 45 : gap + 20}
        width={contentWidth}
        alignHorizontal={positionH === 'flipped' ? 'right' : 'left'}
        fontSize={11}
        fill={themeColors.colorTextSecondary}
        lineNumber={2}
        wordWrap={true}
      >
        {datum.desc}
      </ItemDesc>
    </Group>
  );
};

registerItem('badge-card', {
  component: BadgeCard,
  composites: ['icon', 'label', 'value', 'desc'],
});
