import { ElementTypeEnum } from '../../constants';
import type { GroupProps } from '../../jsx';
import { Group } from '../../jsx';

export interface ItemsGroupProps extends GroupProps {}

export const ItemsGroup = (props: ItemsGroupProps) => {
  return <Group data-element-type={ElementTypeEnum.ItemsGroup} {...props} />;
};
