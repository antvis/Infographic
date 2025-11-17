/** @jsxImportSource @antv/infographic-jsx */
import { ComponentType, Group, Rect } from '@antv/infographic-jsx';
import { ItemLabel } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface RoundedRectNodeProps extends BaseItemProps {
  width?: number;
  height?: number;
  padding?: number;
}

export const RoundedRectNode: ComponentType<RoundedRectNodeProps> = (props) => {
  const [
    {
      indexes,
      datum,
      themeColors,
      width = 300,
      height = 40,
      padding = 4,
      positionH = 'normal',
    },
    restProps,
  ] = getItemProps(props, ['width', 'height', 'borderRadius', 'padding']);

  const borderRadius = height / 2;

  // Calculate text positioning
  const textX = borderRadius;
  const textY = padding;
  const textWidth = width - borderRadius * 2;
  const textHeight = height - padding * 2;

  return (
    <Group {...restProps}>
      {/* Rounded rectangle background */}
      <Rect
        data-element-type="shape"
        width={width}
        height={height}
        rx={borderRadius}
        ry={borderRadius}
        fill={themeColors.colorPrimaryBg}
        stroke={themeColors.colorPrimary}
        strokeWidth={1}
        opacity={0.8}
      />

      {/* Text label */}
      <ItemLabel
        indexes={indexes}
        x={textX}
        y={textY}
        width={textWidth}
        height={textHeight}
        alignHorizontal={
          positionH === 'flipped'
            ? 'right'
            : positionH === 'center'
              ? 'center'
              : 'left'
        }
        alignVertical="middle"
        fontSize={14}
        fontWeight="500"
        fill={themeColors.colorText}
      >
        {datum.label}
      </ItemLabel>
    </Group>
  );
};

registerItem('rounded-rect-node', {
  component: RoundedRectNode,
  composites: ['label'],
});
