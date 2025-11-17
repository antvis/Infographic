import type { GroupProps } from '../../jsx';
import { Group } from '../../jsx';

export interface ItemsGroupProps extends GroupProps {}

export const ItemsGroup = (props: ItemsGroupProps) => {
  return <Group data-element-type="items-group" {...props} />;
};
