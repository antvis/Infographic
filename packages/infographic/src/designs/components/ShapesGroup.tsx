/** @jsxImportSource @antv/infographic-jsx */
import type { GroupProps } from '@antv/infographic-jsx';
import { Group } from '@antv/infographic-jsx';

export interface ShapesGroupProps extends GroupProps {}

export const ShapesGroup = (props: ShapesGroupProps) => {
  return <Group data-element-type="shapes-group" {...props} />;
};
