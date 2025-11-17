import type { RectProps } from '../../jsx';
import { Ellipse, Group, Rect } from '../../jsx';

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
    <Rect
      {...finalProps}
      data-indexes={indexes}
      data-element-type="item-icon"
    />
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

  return (
    <Group
      {...restProps}
      width={size}
      height={size}
      data-element-type="item-icon-group"
    >
      <Ellipse
        width={size}
        height={size}
        fill={fill}
        data-element-type="shape"
      />
      <Rect
        {...iconProps}
        data-indexes={indexes}
        data-element-type="item-icon"
      />
    </Group>
  );
};
