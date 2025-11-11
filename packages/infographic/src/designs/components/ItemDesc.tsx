/** @jsxImportSource @antv/infographic-jsx */
import type { TextProps } from '@antv/infographic-jsx';
import { Text } from '@antv/infographic-jsx';
import { getItemKeyFromIndexes } from '../../utils';

export interface ItemDescProps extends TextProps {
  indexes: number[];
  lineNumber?: number;
}

export const ItemDesc = ({
  indexes,
  lineNumber = 2,
  children,
  ...props
}: ItemDescProps) => {
  if (!children) return null;

  const finalProps: TextProps = {
    width: 100,
    fontSize: 14,
    fill: '#666',
    wordWrap: true,
    lineHeight: 1.4,
    children,
    backgroundColor: 'rgba(199, 207, 145, 0.2)',
    ...props,
  };

  finalProps.height ??= Math.ceil(
    lineNumber * +finalProps.lineHeight! * +finalProps.fontSize!,
  );

  return (
    <Text {...finalProps} id={`item-${getItemKeyFromIndexes(indexes)}-desc`} />
  );
};
