import { ComponentType } from '../../jsx';
import { ItemLabel } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface LabelTextProps extends BaseItemProps {
  width?: number;
  formatter?: (text?: string) => string;
  usePaletteColor?: boolean;
  lineNumber?: number;
}

export const LabelText: ComponentType<LabelTextProps> = (props) => {
  const [
    {
      indexes,
      datum,
      width = 120,
      themeColors,
      positionH = 'normal',
      positionV = 'center',
      formatter = (text?: string) => text || '',
      usePaletteColor = false,
      lineNumber = 1,
    },
    restProps,
  ] = getItemProps(props, [
    'width',
    'formatter',
    'usePaletteColor',
    'lineNumber',
  ]);

  const fontSize = 14;
  const lineHeight = 1.4;
  const height =
    (restProps.height as number | undefined) ??
    Math.ceil(lineNumber * lineHeight * fontSize);

  return (
    <ItemLabel
      {...restProps}
      indexes={indexes}
      width={width}
      height={height}
      lineHeight={lineHeight}
      fill={usePaletteColor ? themeColors.colorPrimary : themeColors.colorText}
      fontSize={fontSize}
      fontWeight="regular"
      alignHorizontal={
        positionH === 'flipped'
          ? 'right'
          : positionH === 'center'
            ? 'center'
            : 'left'
      }
      alignVertical={
        positionV === 'flipped'
          ? 'bottom'
          : positionV === 'center'
            ? 'middle'
            : 'top'
      }
    >
      {formatter(datum.label || datum.desc)}
    </ItemLabel>
  );
};

registerItem('plain-text', {
  component: LabelText,
  composites: ['label'],
});
