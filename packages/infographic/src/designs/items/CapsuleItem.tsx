/** @jsxImportSource @antv/infographic-jsx */
import {
  ComponentType,
  Defs,
  Ellipse,
  getElementBounds,
  Group,
  Rect,
} from '@antv/infographic-jsx';
import { ItemDesc, ItemIconCircle, ItemLabel } from '../components';
import { DropShadow } from '../defs';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface CapsuleItemProps extends BaseItemProps {
  width?: number;
  height?: number;
  gap?: number;
  iconPadding?: number;
}

export const CapsuleItem: ComponentType<CapsuleItemProps> = (props) => {
  const [
    {
      datum,
      indexes,
      width = 300,
      height = 80,
      gap = 12,
      positionH = 'normal',
      iconPadding = height / 10,
      themeColors,
    },
    restProps,
  ] = getItemProps(props, ['width', 'height', 'gap', 'iconPadding']);

  // Capsule border radius and icon size (icon with some padding inside)
  const borderRadius = height / 2;
  const iconSize = height - iconPadding * 2; // Icon diameter with padding

  // Calculate positions based on positionH and icon presence
  const isFlipped = positionH === 'flipped';
  const hasIcon = !!datum.icon;

  // Calculate text area dimensions
  const textWidth = hasIcon ? width - height - gap : width - gap * 2;
  const textX = hasIcon ? (isFlipped ? gap : height) : gap;
  const textAlign = hasIcon ? (isFlipped ? 'right' : 'left') : 'center';

  const labelProps = {
    indexes,
    width: textWidth,
    alignHorizontal: textAlign,
    alignVertical: 'middle',
    fontSize: 16,
    fontWeight: '600',
    fill: themeColors.colorWhite,
  } as const;
  // Get label bounds to calculate layout
  const labelBounds = getElementBounds(
    <ItemLabel {...labelProps}>{datum.label}</ItemLabel>,
  );

  const descProps = {
    indexes,
    width: textWidth,
    alignHorizontal: textAlign,
    alignVertical: 'top',
    fontSize: 12,
    lineNumber: 1,
    fill: themeColors.colorWhite,
  } as const;
  // Get desc bounds to calculate layout
  const descBounds = getElementBounds(
    datum.desc ? <ItemDesc {...descProps}>{datum.desc}</ItemDesc> : null,
  );

  // Calculate vertical positions for text elements
  const textGap = 4;
  const totalTextHeight = labelBounds.height + textGap + descBounds.height;
  const textStartY = (height - totalTextHeight) / 2;
  const labelY = textStartY;
  const descY = labelY + labelBounds.height + textGap;

  // Calculate icon position (centered in the circle area with padding)
  const iconX = isFlipped ? width - height + iconPadding : iconPadding;
  const iconY = iconPadding;

  return (
    <Group {...restProps}>
      <Defs>
        <DropShadow />
      </Defs>
      {/* Capsule background */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={themeColors.colorPrimary}
        rx={borderRadius}
        ry={borderRadius}
        data-element-type="shape"
      />

      {/* Icon - white background with primary color icon */}
      {datum.icon && (
        <>
          <Ellipse
            x={iconX}
            y={iconY}
            width={iconSize}
            height={iconSize}
            fillOpacity={0.5}
            fill={themeColors.colorBg}
            filter="url(#drop-shadow)"
          />
          <ItemIconCircle
            indexes={indexes}
            x={iconX}
            y={iconY}
            size={iconSize}
            fill={themeColors.colorBg}
            colorBg={themeColors.colorPrimary}
          />
        </>
      )}

      {/* Label */}
      {datum.label && (
        <ItemLabel x={textX} y={labelY} {...labelProps}>
          {datum.label}
        </ItemLabel>
      )}

      {/* Description */}
      {datum.desc && (
        <ItemDesc x={textX} y={descY} {...descProps}>
          {datum.desc}
        </ItemDesc>
      )}
    </Group>
  );
};

registerItem('capsule-item', {
  component: CapsuleItem,
  composites: ['icon', 'label', 'desc'],
});
