import { ComponentType, getElementBounds } from '../../jsx';
import { Illus, ItemDesc, ItemLabel } from '../components';
import { FlexLayout } from '../layouts';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface SimpleIllusItemProps extends BaseItemProps {
  width?: number;
  illusSize?: number;
  gap?: number;
  usePaletteColor?: boolean;
}

export const SimpleIllusItem: ComponentType<SimpleIllusItemProps> = (props) => {
  const [
    {
      indexes,
      datum,
      width = 180,
      illusSize = width,
      gap = 8,
      themeColors,
      usePaletteColor = false,
    },
    restProps,
  ] = getItemProps(props, ['width', 'illusSize', 'gap', 'usePaletteColor']);

  const { label, desc } = datum;

  const labelColor = usePaletteColor
    ? themeColors.colorPrimary
    : themeColors.colorText;

  const labelContent = (
    <ItemLabel
      indexes={indexes}
      width={width}
      alignHorizontal="center"
      alignVertical="middle"
      fill={labelColor}
    >
      {label}
    </ItemLabel>
  );
  const labelBounds = getElementBounds(labelContent);

  return (
    <FlexLayout
      {...restProps}
      width={width}
      height={illusSize + gap + labelBounds.height + gap + 48}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={gap}
    >
      <Illus indexes={indexes} width={illusSize} height={illusSize} />
      {labelContent}
      <ItemDesc
        indexes={indexes}
        width={width}
        alignHorizontal="center"
        alignVertical="top"
        fill={themeColors.colorTextSecondary}
        lineNumber={3}
      >
        {desc}
      </ItemDesc>
    </FlexLayout>
  );
};

registerItem('simple-illus', {
  component: SimpleIllusItem,
  composites: ['illus', 'label', 'desc'],
});
