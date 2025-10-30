/** @jsxImportSource @antv/infographic-jsx */
import { ComponentType, getElementBounds, Group } from '@antv/infographic-jsx';
import { Illus, ItemDesc, ItemLabel } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface SimpleIllusItemProps extends BaseItemProps {
  width?: number;
  illusSize?: number;
  gap?: number;
}

export const SimpleIllusItem: ComponentType<SimpleIllusItemProps> = (props) => {
  const [
    { indexes, datum, width = 180, illusSize = width, gap = 8, themeColors },
    restProps,
  ] = getItemProps(props, ['width', 'illusSize', 'gap']);

  const { label, desc } = datum;

  const labelContent = (
    <ItemLabel
      indexes={indexes}
      width={width}
      alignHorizontal="center"
      alignVertical="center"
      fill={themeColors.colorText}
    >
      {label}
    </ItemLabel>
  );
  const labelBounds = getElementBounds(labelContent);

  return (
    <Group {...restProps}>
      {/* Illus - centered */}
      <Illus
        indexes={indexes}
        x={(width - illusSize) / 2}
        y={0}
        width={illusSize}
        height={illusSize}
      />

      {/* ItemLabel - centered below Illus */}
      <ItemLabel
        indexes={indexes}
        width={width}
        y={illusSize + gap}
        alignHorizontal="center"
        alignVertical="center"
        fill={themeColors.colorText}
      >
        {label}
      </ItemLabel>

      {/* ItemDesc - centered below Label */}
      <ItemDesc
        indexes={indexes}
        width={width}
        y={illusSize + gap + labelBounds.height + gap}
        alignHorizontal="center"
        alignVertical="top"
        fill={themeColors.colorTextSecondary}
        lineNumber={3}
      >
        {desc}
      </ItemDesc>
    </Group>
  );
};

registerItem('simple-illus', {
  component: SimpleIllusItem,
  composites: ['illus', 'label', 'desc'],
});
