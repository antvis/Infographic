/** @jsxImportSource @antv/infographic-jsx */
import { ComponentType, Defs, Group, Path, Rect } from '@antv/infographic-jsx';
import tinycolor from 'tinycolor2';
import { ItemDesc, ItemIcon, ItemLabel, ItemValue } from '../components';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';
import { getItemProps } from './utils';

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
      iconSize = 24,
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

  const value = datum.value ?? 0;
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

      {/* 图标 */}
      <ItemIcon
        indexes={indexes}
        x={gap}
        y={ribbonHeight + gap}
        size={iconSize}
        fill={themeColors.colorPrimary}
      />

      {/* 数值 */}
      <ItemValue
        indexes={indexes}
        x={iconSize + 2 * gap}
        y={ribbonHeight + gap}
        width={width - iconSize - 3 * gap}
        alignHorizontal="left"
        fontSize={28}
        fontWeight="bold"
        fill={themeColors.colorText}
        value={value}
      />

      {/* 标签 */}
      <ItemLabel
        indexes={indexes}
        x={gap}
        y={ribbonHeight + iconSize + 2 * gap}
        width={width - 2 * gap}
        alignHorizontal="left"
        fontSize={14}
        fontWeight="medium"
        fill={themeColors.colorText}
      >
        {datum.label}
      </ItemLabel>

      {/* 描述 */}
      <ItemDesc
        indexes={indexes}
        x={gap}
        y={ribbonHeight + iconSize + gap + 32}
        width={width - 2 * gap}
        alignHorizontal="left"
        fontSize={11}
        fill={themeColors.colorTextSecondary}
        lineNumber={2}
        wordWrap={true}
      >
        {datum.desc}
      </ItemDesc>

      {/* 彩带上的小图标 */}
      <ItemIcon
        indexes={indexes}
        x={width - gap - 16}
        y={gap}
        size={16}
        fill={themeColors.colorWhite}
      />
    </Group>
  );
};

registerItem('ribbon-card', { component: RibbonCard });
