import { ElementTypeEnum } from '../../constants';
import type { RectProps } from '../../jsx';
import { Rect } from '../../jsx';

export interface IllusProps extends RectProps {
  indexes?: number[];
}

export const Illus = ({ indexes, ...props }: IllusProps) => {
  const defaultProps: RectProps = {
    fill: 'lightgray',
  };
  const finalProps = { ...defaultProps, ...props };

  if (indexes) {
    finalProps['data-indexes'] = indexes;
    finalProps['data-element-type'] = ElementTypeEnum.ItemIllus;
  } else {
    finalProps['data-element-type'] = ElementTypeEnum.Illus;
  }

  return <Rect {...finalProps} />;
};
