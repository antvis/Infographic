import type { GroupProps } from '../../jsx';
import { Group } from '../../jsx';

export interface BtnsGroupProps extends GroupProps {}

export const BtnsGroup = (props: BtnsGroupProps) => {
  return (
    <Group data-element-type="btns-group" width={0} height={0} {...props} />
  );
};
