/** @jsxImportSource @antv/infographic-jsx */
import {
  ComponentType,
  getElementBounds,
  Group,
  Path,
  Polygon,
} from '@antv/infographic-jsx';
import { ItemDesc, ItemIcon, ItemLabel } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface LCornerCardProps extends BaseItemProps {
  width?: number;
  iconSize?: number;
}

export const LCornerCard: ComponentType<LCornerCardProps> = (props) => {
  const [
    { indexes, datum, width = 120, iconSize = 24, themeColors },
    restProps,
  ] = getItemProps(props, ['width', 'iconSize']);

  const { label, desc } = datum;

  const descContent = (
    <ItemDesc
      indexes={indexes}
      width={width}
      height={60}
      y={0}
      alignHorizontal="left"
      alignVertical="bottom"
      fill={themeColors.colorTextSecondary}
    >
      {desc}
    </ItemDesc>
  );
  const descBounds = getElementBounds(descContent);

  const startY = descBounds.height + 12;
  const verticalLen = iconSize + 44;
  const d = `M 0 ${startY + verticalLen} L0 ${startY} L ${width} ${startY}`;

  const stroke = 8;
  const arrowVertices = [
    { x: (-3 * stroke) / 2, y: startY - stroke / 2 },
    { x: (-3 * stroke) / 2, y: startY + (3 * stroke) / 2 },
    { x: (-7 * stroke) / 2, y: startY + (3 * stroke) / 2 },
  ];

  return (
    <Group {...restProps}>
      <ItemDesc
        indexes={indexes}
        width={width - stroke}
        fontSize={12}
        lineHeight={1.4}
        alignHorizontal="left"
        alignVertical="bottom"
        fill={themeColors.colorTextSecondary}
      >
        {desc}
      </ItemDesc>

      {indexes[0] > 0 && (
        <Polygon
          points={arrowVertices}
          fill={themeColors.colorPrimary}
          opacity={0.9}
        />
      )}

      <Path
        d={d}
        stroke={themeColors.colorPrimary}
        strokeWidth={stroke}
        fill="none"
      />

      <ItemIcon
        indexes={indexes}
        x={width / 2 - iconSize / 2}
        y={descBounds.height + stroke + 16}
        size={iconSize}
        fill={themeColors.colorPrimary}
      />

      <ItemLabel
        indexes={indexes}
        y={descBounds.height + iconSize + stroke + 22}
        width={width}
        fontSize="14"
        fontWeight="bold"
        alignHorizontal="center"
        alignVertical="center"
        fill={themeColors.colorText}
      >
        {label}
      </ItemLabel>
    </Group>
  );
};

registerItem('l-corner-card', {
  component: LCornerCard,
  values: ['icon', 'label', 'desc'],
});
