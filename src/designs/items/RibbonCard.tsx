import tinycolor from 'tinycolor2';
import { ComponentType, Defs, Group, Path, Rect } from '../../jsx';
import { ItemDesc, ItemIcon, ItemLabel, ShapesGroup } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface RibbonCardProps extends BaseItemProps {
  width?: number;
  height?: number;
  iconSize?: number;
  gap?: number;
  ribbonHeight?: number;
}

export const RibbonCard: ComponentType<RibbonCardProps> = (props) => {
  const [
    {
      datum,
      indexes,
      width = 240,
      height = 140,
      iconSize = 28,
      gap = 12,
      ribbonHeight = 32,
      themeColors,
    },
    restProps,
  ] = getItemProps(props, [
    'width',
    'height',
    'iconSize',
    'gap',
    'ribbonHeight',
  ]);

  const gradientId = `${themeColors.colorPrimary}-ribbon`;

  return (
    <Group {...restProps}>
      <Defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={themeColors.colorPrimary} />
          <stop
            offset="100%"
            stopColor={tinycolor(themeColors.colorPrimary)
              .darken(15)
              .toHexString()}
          />
        </linearGradient>
      </Defs>

      <ShapesGroup>
        {/* 主背景 */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={themeColors.colorBgElevated}
          stroke={themeColors.colorPrimaryBg}
          strokeWidth={1}
          rx={8}
          ry={8}
        />

        {/* 顶部彩带 */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={ribbonHeight}
          fill={`url(#${gradientId})`}
          rx={8}
          ry={8}
        />

        {/* 彩带底部切角 */}
        <Rect
          x={0}
          y={8}
          width={width}
          height={ribbonHeight - 8}
          fill={`url(#${gradientId})`}
        />

        {/* 彩带装饰三角 */}
        <Path
          x={width - 20}
          y={ribbonHeight}
          width={20}
          height={8}
          fill={tinycolor(themeColors.colorPrimary).darken(25).toHexString()}
          d="M0,0 L20,0 L15,8 L5,8 Z"
        />
      </ShapesGroup>

      {/* 图标 */}
      <ItemIcon
        indexes={indexes}
        x={gap}
        y={ribbonHeight + gap}
        size={iconSize}
        fill={themeColors.colorPrimary}
      />

      {/* 标签 */}
      <ItemLabel
        indexes={indexes}
        x={iconSize + 2 * gap}
        y={ribbonHeight + gap}
        width={width - iconSize - 3 * gap}
        height={iconSize}
        alignHorizontal="left"
        alignVertical="middle"
        lineHeight={1}
        fontWeight="bold"
        fill={themeColors.colorText}
      >
        {datum.label}
      </ItemLabel>

      {/* 描述 */}
      <ItemDesc
        indexes={indexes}
        x={gap}
        y={ribbonHeight + iconSize + gap + 5}
        width={width - 2 * gap}
        alignHorizontal="left"
        fill={themeColors.colorTextSecondary}
        lineNumber={3}
        wordWrap={true}
      >
        {datum.desc}
      </ItemDesc>

      {/* 彩带上的小图标 */}
      <ItemIcon
        indexes={indexes}
        x={width - gap - 8}
        y={gap / 2}
        size={16}
        fill={themeColors.colorWhite}
      />
    </Group>
  );
};

registerItem('ribbon-card', {
  component: RibbonCard,
  composites: ['icon', 'label', 'desc'],
});
