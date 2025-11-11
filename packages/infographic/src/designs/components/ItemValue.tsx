/** @jsxImportSource @antv/infographic-jsx */
import type { TextProps } from '@antv/infographic-jsx';
import { Text } from '@antv/infographic-jsx';
import { getItemKeyFromIndexes } from '../../utils';

export interface ItemValueProps extends TextProps {
  indexes: number[];
  value: number;
  formatter?: (value: number) => string | number;
}

export const ItemValue = ({
  indexes,
  value,
  formatter = (v) => String(v),
  ...props
}: ItemValueProps) => {
  const finalProps: TextProps = {
    width: 100,
    fontSize: 14,
    fill: '#666',
    wordWrap: true,
    lineHeight: 1.4,
    children: formatter(value),
    'data-value': value,
    backgroundColor: 'rgba(199, 207, 145, 0.2)',
    ...props,
  };

  finalProps.height ??= Math.ceil(
    +finalProps.lineHeight! * +finalProps.fontSize!,
  );

  return (
    <Text {...finalProps} id={`item-${getItemKeyFromIndexes(indexes)}-value`} />
  );
};
