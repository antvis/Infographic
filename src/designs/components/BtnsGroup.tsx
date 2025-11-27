import { ElementTypeEnum } from '../../constants';
import type { GroupProps } from '../../jsx';
import { Group } from '../../jsx';

export interface BtnsGroupProps extends GroupProps {}

export const BtnsGroup = (props: BtnsGroupProps) => {
  return (
    <Group
      data-element-type={ElementTypeEnum.BtnsGroup}
      width={0}
      height={0}
      {...props}
      display="none"
    />
  );
};
