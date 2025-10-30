/** @jsxImportSource @antv/infographic-jsx */
import { ComponentType } from '@antv/infographic-jsx';
import { ItemLabel } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface LabelTextProps extends BaseItemProps {
  width?: number;
}

export const LabelText: ComponentType<LabelTextProps> = (props) => {
  const [
    { indexes, datum, width = 120, themeColors, positionH = 'normal' },
    restProps,
  ] = getItemProps(props, ['width']);

  return (
    <ItemLabel
      {...restProps}
      indexes={indexes}
      width={width}
      fill={themeColors.colorText}
      fontSize={14}
      fontWeight="regular"
      alignHorizontal={
        positionH === 'flipped'
          ? 'right'
          : positionH === 'center'
            ? 'center'
            : 'left'
      }
      alignVertical="center"
    >
      {datum.label || datum.desc}
    </ItemLabel>
  );
};

registerItem('plain-text', {
  component: LabelText,
  composites: ['label'],
});
