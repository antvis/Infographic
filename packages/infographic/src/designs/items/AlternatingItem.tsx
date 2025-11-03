/** @jsxImportSource @antv/infographic-jsx */
import { ComponentType, getElementBounds, Group } from '@antv/infographic-jsx';
import { ItemDesc, ItemIcon, ItemLabel } from '../components';
import { FlexLayout } from '../layouts';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface AlternatingItemProps extends BaseItemProps {
  width?: number;
  gap?: number;
  showIcon?: boolean;
  iconSize?: number;
  usePaletteColor?: boolean;
}

export const AlternatingItem: ComponentType<AlternatingItemProps> = (props) => {
  const [
    {
      indexes,
      datum,
      width = 200,
      gap = 4,
      showIcon = true,
      iconSize = 30,
      usePaletteColor = false,
      themeColors,
    },
    restProps,
  ] = getItemProps(props, [
    'width',
    'gap',
    'showIcon',
    'iconSize',
    'usePaletteColor',
  ]);

  const { label, desc, icon } = datum;

  // 根据索引判断奇偶：奇数项（index 0, 2, 4...）右对齐，偶数项（index 1, 3, 5...）左对齐
  const itemIndex = indexes[indexes.length - 1];
  const isOdd = itemIndex % 2 === 0;
  const textAlign = isOdd ? 'right' : 'left';

  const labelColor = usePaletteColor
    ? themeColors.colorPrimary
    : themeColors.colorText;

  const labelContent = (
    <ItemLabel
      indexes={indexes}
      width={width}
      alignHorizontal={textAlign}
      alignVertical="center"
      fill={labelColor}
    >
      {label}
    </ItemLabel>
  );
  const labelBounds = getElementBounds(labelContent);
  const iconContent = showIcon ? (
    <ItemIcon
      indexes={indexes}
      size={iconSize}
      fill={themeColors.colorTextSecondary}
    />
  ) : null;

  if (!showIcon || !icon) {
    return (
      <Group {...restProps}>
        <Group>
          <ItemLabel
            indexes={indexes}
            width={width}
            alignHorizontal={textAlign}
            alignVertical="center"
            fill={labelColor}
          >
            {label}
          </ItemLabel>
          <ItemDesc
            indexes={indexes}
            width={width}
            y={labelBounds.height + gap}
            alignHorizontal={textAlign}
            alignVertical="top"
            fill={themeColors.colorTextSecondary}
          >
            {desc}
          </ItemDesc>
        </Group>
      </Group>
    );
  }

  const iconBounds = getElementBounds(iconContent);
  const textWidth = Math.max(width - iconBounds.width - gap, 0);

  return (
    <Group {...restProps}>
      <FlexLayout flexDirection="row" gap={gap} alignItems="flex-start">
        {isOdd ? (
          <>
            <Group>
              <ItemLabel
                indexes={indexes}
                width={textWidth}
                alignHorizontal="right"
                alignVertical="center"
                fill={labelColor}
              >
                {label}
              </ItemLabel>
              <ItemDesc
                indexes={indexes}
                width={textWidth}
                y={labelBounds.height + gap}
                alignHorizontal="right"
                alignVertical="top"
                fill={themeColors.colorTextSecondary}
              >
                {desc}
              </ItemDesc>
            </Group>
            {iconContent}
          </>
        ) : (
          <>
            {iconContent}
            <Group>
              <ItemLabel
                indexes={indexes}
                width={textWidth}
                alignHorizontal="left"
                alignVertical="center"
                fill={labelColor}
              >
                {label}
              </ItemLabel>
              <ItemDesc
                indexes={indexes}
                width={textWidth}
                y={labelBounds.height + gap}
                alignHorizontal="left"
                alignVertical="top"
                fill={themeColors.colorTextSecondary}
              >
                {desc}
              </ItemDesc>
            </Group>
          </>
        )}
      </FlexLayout>
    </Group>
  );
};

registerItem('alternating', { component: AlternatingItem });
