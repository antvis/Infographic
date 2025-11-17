import type { TextProps } from '../../jsx';
import { Text } from '../../jsx';

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
    ...props,
  };

  finalProps.height ??= Math.ceil(
    +finalProps.lineHeight! * +finalProps.fontSize!,
  );

  return (
    <Text
      {...finalProps}
      data-indexes={indexes}
      data-element-type="item-value"
    />
  );
};
