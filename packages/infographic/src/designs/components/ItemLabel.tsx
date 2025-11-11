/** @jsxImportSource @antv/infographic-jsx */
import type { TextProps } from '@antv/infographic-jsx';
import { Text } from '@antv/infographic-jsx';
import { getItemKeyFromIndexes } from '../../utils';

export interface ItemLabelProps extends TextProps {
  indexes: number[];
}

export const ItemLabel = ({ indexes, children, ...props }: ItemLabelProps) => {
  const finalProps: TextProps = {
    fontSize: 18,
    fontWeight: 'bold',
    fill: '#252525',
    width: 100,
    lineHeight: 1.4,
    children,
    backgroundColor: 'rgba(199, 207, 145, 0.2)',
    ...props,
  };

  finalProps.height ??= Math.ceil(
    +finalProps.lineHeight! * +finalProps.fontSize!,
  );

  return (
    <Text {...finalProps} id={`item-${getItemKeyFromIndexes(indexes)}-label`} />
  );
};
