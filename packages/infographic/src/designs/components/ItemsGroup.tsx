/** @jsxImportSource @antv/infographic-jsx */
import type { GroupProps } from '@antv/infographic-jsx';
import { Group } from '@antv/infographic-jsx';

export interface ItemsGroupProps extends GroupProps {}

export const ItemsGroup = (props: ItemsGroupProps) => {
  return <Group data-element-type="items-group" {...props} />;
};
