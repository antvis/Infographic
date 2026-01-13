import type { ComponentType } from '../../jsx';
import { Ellipse, Group, Rect } from '../../jsx';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface SimpleCircleNodeProps extends BaseItemProps {
  width?: number;
  height?: number;
  strokeWidth?: number;
}

export const SimpleCircleNode: ComponentType<SimpleCircleNodeProps> = (
  props,
) => {
  const [
    { width = 24, height = width, strokeWidth = 2, themeColors, datum },
    restProps,
  ] = getItemProps(props, ['width', 'height']);

  const size = Math.min(width, height) - strokeWidth;
  const offset = strokeWidth / 2;

  return (
    <Group {...restProps} width={width} height={height}>
      <Rect width={width} height={height} fill="none" visibility="hidden" />
      <Ellipse
        x={offset}
        y={offset}
        width={size}
        height={size}
        fill={themeColors.colorPrimary}
        stroke={themeColors.isDarkMode ? '#FFF' : '#000'}
        strokeWidth={strokeWidth}
        data-element-type="shape"
      >
        <title>{datum.label || datum.desc}</title>
      </Ellipse>
    </Group>
  );
};

registerItem('simple-circle-node', {
  component: SimpleCircleNode,
  composites: [],
});
