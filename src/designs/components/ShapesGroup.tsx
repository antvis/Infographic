import type { GroupProps } from '../../jsx';
import { Group } from '../../jsx';

export interface ShapesGroupProps extends GroupProps {}

export const ShapesGroup = (props: ShapesGroupProps) => {
  return <Group data-element-type="shapes-group" {...props} />;
};
