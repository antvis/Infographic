/** @jsxImportSource @antv/infographic-jsx */
import type { TextProps } from '@antv/infographic-jsx';
import { Text } from '@antv/infographic-jsx';

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
    ...props,
  };

  finalProps.height ??= Math.ceil(
    +finalProps.lineHeight! * +finalProps.fontSize!,
  );

  return (
    <Text
      {...finalProps}
      data-indexes={indexes}
      data-element-type="item-label"
    />
  );
};
