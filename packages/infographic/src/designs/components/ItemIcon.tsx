/** @jsxImportSource @antv/infographic-jsx */
import type { RectProps } from '@antv/infographic-jsx';
import { Rect } from '@antv/infographic-jsx';
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
