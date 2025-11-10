/** @jsxImportSource @antv/infographic-jsx */
import type { RectProps } from '@antv/infographic-jsx';
import { Ellipse, Group, Rect } from '@antv/infographic-jsx';
import { getItemKeyFromIndexes } from '../../utils';

export interface ItemIconProps extends RectProps {
  indexes: number[];
  size?: number;
}

export const ItemIcon = (props: ItemIconProps) => {
  const { indexes, size = 32, ...restProps } = props;
  const finalProps: RectProps = {
    fill: 'lightgray',
    width: size,
    height: size,
    ...restProps,
  };
  return (
    <Rect {...finalProps} id={`item-${getItemKeyFromIndexes(indexes)}-icon`} />
  );
};

export const ItemIconCircle = (props: ItemIconProps & { colorBg?: string }) => {
  const { indexes, size = 50, fill, colorBg = 'white', ...restProps } = props;

  // 圆形内最大内切正方形的边长 = 圆的直径 / √2
  const innerSize = (size / Math.SQRT2) * 0.9;
  const offset = (size - innerSize) / 2;

  const iconProps: RectProps = {
    fill: colorBg,
    ...restProps,
    x: offset,
    y: offset,
    width: innerSize,
    height: innerSize,
  };

  const prefix = `item-${getItemKeyFromIndexes(indexes)}`;

  return (
    <Group
      {...restProps}
      width={size}
      height={size}
      id={`${prefix}-group-icon`}
    >
      <Ellipse width={size} height={size} id={`${prefix}-bg`} fill={fill} />
      <Rect {...iconProps} id={`${prefix}-icon`} />
    </Group>
  );
};
