/** @jsxImportSource @antv/infographic-jsx */
import type { GroupProps } from '@antv/infographic-jsx';
import { Group } from '@antv/infographic-jsx';

export interface BtnsGroupProps extends GroupProps {}

export const BtnsGroup = (props: BtnsGroupProps) => {
  return (
    <Group data-element-type="btns-group" width={0} height={0} {...props} />
  );
};
