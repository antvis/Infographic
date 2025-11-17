/** @jsxImportSource @antv/infographic-jsx */
import { ComponentType } from '@antv/infographic-jsx';
import { ItemLabel } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface LabelTextProps extends BaseItemProps {
  width?: number;
  formatter?: (text?: string) => string;
  usePaletteColor?: boolean;
}

export const LabelText: ComponentType<LabelTextProps> = (props) => {
  const [
    {
      indexes,
      datum,
      width = 120,
      themeColors,
      positionH = 'normal',
      formatter = (text?: string) => text || '',
      usePaletteColor = false,
    },
    restProps,
  ] = getItemProps(props, ['width', 'formatter', 'usePaletteColor']);

  return (
    <ItemLabel
      {...restProps}
      indexes={indexes}
      width={width}
      fill={usePaletteColor ? themeColors.colorPrimary : themeColors.colorText}
      fontSize={14}
      fontWeight="regular"
      alignHorizontal={
        positionH === 'flipped'
          ? 'right'
          : positionH === 'center'
            ? 'center'
            : 'left'
      }
      alignVertical="middle"
    >
      {formatter(datum.label || datum.desc)}
    </ItemLabel>
  );
};

registerItem('plain-text', {
  component: LabelText,
  composites: ['label'],
});
