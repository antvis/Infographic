import type { TextProps } from '../../jsx';
import { Text } from '../../jsx';

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
    ...props,
  };

  finalProps.height ??= Math.ceil(
    lineNumber * +finalProps.lineHeight! * +finalProps.fontSize!,
  );

  return (
    <Text
      {...finalProps}
      data-indexes={indexes}
      data-element-type="item-desc"
    />
  );
};
