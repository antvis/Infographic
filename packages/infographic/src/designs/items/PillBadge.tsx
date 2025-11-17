/** @jsxImportSource @antv/infographic-jsx */
import { ComponentType, Defs, Group, Rect } from '@antv/infographic-jsx';
import { ItemDesc, ItemLabel } from '../components';
import { DropShadow, LinearGradient } from '../defs';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface PillBadgeProps extends BaseItemProps {
  width?: number;
  pillWidth?: number;
  pillHeight?: number;
  gap?: number;
}

export const PillBadge: ComponentType<PillBadgeProps> = (props) => {
  const [
    {
      datum,
      indexes,
      width = 300,
      pillWidth = 120,
      pillHeight = 36,
      gap = 16,
      positionH = 'normal',
      themeColors,
    },
    restProps,
  ] = getItemProps(props, ['width', 'pillWidth', 'pillHeight', 'gap']);

  // Optimize: when no description, use pillWidth as component width
  const hasDesc = !!datum.desc;
  const componentWidth = hasDesc ? width : pillWidth;

  // Calculate pill position based on alignment
  const pillX = hasDesc
    ? positionH === 'center'
      ? (componentWidth - pillWidth) / 2
      : positionH === 'flipped'
        ? componentWidth - pillWidth
        : 0
    : 0; // Always 0 when no description

  const pillY = 0;

  // Calculate content position (only needed when hasDesc is true)
  const contentX = hasDesc
    ? positionH === 'center'
      ? 0
      : positionH === 'flipped'
        ? 0
        : 0
    : 0;
  const contentY = pillHeight + gap;
  const contentWidth = componentWidth;

  const dropShadowId = `drop-shadow-${themeColors.colorPrimary}`;
  const linearGradientId = `linear-gradient-white-top-bottom`;
  return (
    <Group {...restProps}>
      <Defs>
        <DropShadow id={dropShadowId} color={themeColors.colorPrimary} />
        <LinearGradient
          id={linearGradientId}
          startColor="#fff"
          stopColor="#ffffff33"
          direction="top-bottom"
        />
      </Defs>
      {/* Pill-shaped badge */}
      <Rect
        x={pillX}
        y={pillY}
        width={pillWidth}
        height={pillHeight}
        fill={themeColors.colorPrimaryBg}
        stroke={themeColors.colorPrimary}
        rx={pillHeight / 2}
        ry={pillHeight / 2}
        filter={`url(#${dropShadowId})`}
        data-element-type="shape"
      />
      <Rect
        x={pillX}
        y={pillY}
        width={pillWidth}
        height={pillHeight}
        fill={`url(#${linearGradientId})`}
        opacity={themeColors.isDarkMode ? 0.4 : 0.7}
        rx={pillHeight / 2}
        ry={pillHeight / 2}
      />

      {/* Pill label */}
      <ItemLabel
        indexes={indexes}
        x={pillX}
        y={pillY}
        width={pillWidth}
        height={pillHeight}
        alignHorizontal="center"
        alignVertical="middle"
        fontSize={14}
        fontWeight="500"
        fill={themeColors.colorText}
      >
        {datum.label}
      </ItemLabel>

      {/* Description below */}
      {datum.desc && (
        <ItemDesc
          indexes={indexes}
          x={contentX}
          y={contentY}
          width={contentWidth}
          alignHorizontal={
            positionH === 'center'
              ? 'center'
              : positionH === 'flipped'
                ? 'right'
                : 'left'
          }
          fontSize={12}
          fill={themeColors.colorTextSecondary}
          lineNumber={2}
          wordWrap={true}
        >
          {datum.desc}
        </ItemDesc>
      )}
    </Group>
  );
};

registerItem('pill-badge', {
  component: PillBadge,
  composites: ['label', 'desc'],
});
