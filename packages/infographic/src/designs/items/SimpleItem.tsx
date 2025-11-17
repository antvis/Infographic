/** @jsxImportSource @antv/infographic-jsx */
import { ComponentType, getElementBounds, Group } from '@antv/infographic-jsx';
import { ItemDesc, ItemIcon, ItemIconCircle, ItemLabel } from '../components';
import { FlexLayout } from '../layouts';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface SimpleItemProps extends BaseItemProps {
  width?: number;
  height?: number;
  gap?: number;
  showIcon?: boolean;
  iconSize?: number;
  iconType?: 'default' | 'circle';
  usePaletteColor?: boolean;
}

export const SimpleItem: ComponentType<SimpleItemProps> = (props) => {
  const [
    {
      indexes,
      datum,
      width = 200,
      height,
      gap = 4,
      showIcon = true,
      iconSize = 30,
      iconType = 'default',
      positionH = 'normal',
      positionV = 'normal',
      usePaletteColor = false,
      themeColors,
    },
    restProps,
  ] = getItemProps(props, [
    'width',
    'height',
    'gap',
    'showIcon',
    'iconSize',
    'iconType',
    'usePaletteColor',
  ]);

  const { label, desc, icon } = datum;

  const getTextAlign = (position: string) => {
    return position === 'normal'
      ? 'left'
      : position === 'flipped'
        ? 'right'
        : 'center';
  };

  const textAlign = getTextAlign(positionH);
  const labelColor = usePaletteColor
    ? themeColors.colorPrimary
    : themeColors.colorText;

  // ItemDesc 的默认参数（用于计算行数）
  const descFontSize = 14;
  const descLineHeight = 1.4;

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
  const iconContent = showIcon ? (
    iconType === 'circle' ? (
      <ItemIconCircle
        indexes={indexes}
        size={iconSize}
        fill={themeColors.colorPrimary}
        colorBg={themeColors.colorBg}
      />
    ) : (
      <ItemIcon
        indexes={indexes}
        size={iconSize}
        fill={themeColors.colorTextSecondary}
      />
    )
  ) : null;

  if (!showIcon || !icon) {
    // 计算 desc 的可用高度和行数
    const descHeight = height
      ? Math.max(0, height - labelBounds.height - gap)
      : undefined;
    const descLineNumber = descHeight
      ? descHeight <= 60
        ? 1
        : Math.floor(descHeight / (descLineHeight * descFontSize))
      : 2;

    const labelY = height
      ? positionV === 'middle'
        ? (height - labelBounds.height - (descHeight || 0) - gap) / 2
        : positionV === 'flipped'
          ? height - labelBounds.height - (descHeight || 0) - gap
          : 0
      : 0;

    return (
      <Group {...restProps}>
        <ItemLabel
          indexes={indexes}
          width={width}
          y={labelY}
          alignHorizontal={textAlign}
          alignVertical="middle"
          fill={labelColor}
        >
          {label}
        </ItemLabel>
        <ItemDesc
          indexes={indexes}
          width={width}
          height={descHeight}
          y={labelY + labelBounds.height + gap}
          alignHorizontal={textAlign}
          alignVertical={getDescVerticalAlign(positionV, false)}
          lineNumber={descLineNumber}
          fill={themeColors.colorTextSecondary}
        >
          {desc}
        </ItemDesc>
      </Group>
    );
  }

  if (positionH === 'center') {
    // 计算 desc 的可用高度和行数
    const iconHeight = showIcon && icon ? iconSize : 0;
    const descHeight = height
      ? Math.max(0, height - labelBounds.height - iconHeight - gap * 2)
      : undefined;
    const descLineNumber = descHeight
      ? descHeight <= 60
        ? 1
        : Math.floor(descHeight / (descLineHeight * descFontSize))
      : 2;

    const contentHeight = labelBounds.height + (descHeight || 0) + gap;
    const labelY = height
      ? positionV === 'middle'
        ? (height - contentHeight - iconHeight - gap) / 2
        : positionV === 'flipped'
          ? height - contentHeight - iconHeight - gap
          : 0
      : 0;

    return (
      <FlexLayout
        {...restProps}
        flexDirection="column"
        gap={gap}
        alignItems="center"
      >
        {positionV === 'flipped' ? (
          <>
            <Group>
              <ItemLabel
                indexes={indexes}
                width={width}
                y={labelY}
                alignHorizontal="center"
                alignVertical="middle"
                fill={labelColor}
              >
                {label}
              </ItemLabel>
              <ItemDesc
                indexes={indexes}
                width={width}
                height={descHeight}
                y={labelY + labelBounds.height + gap}
                alignHorizontal="center"
                alignVertical="bottom"
                lineNumber={descLineNumber}
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
                width={width}
                y={labelY}
                alignHorizontal="center"
                alignVertical="middle"
                fill={labelColor}
              >
                {label}
              </ItemLabel>
              <ItemDesc
                indexes={indexes}
                width={width}
                height={descHeight}
                y={labelY + labelBounds.height + gap}
                alignHorizontal="center"
                alignVertical="top"
                lineNumber={descLineNumber}
                fill={themeColors.colorTextSecondary}
              >
                {desc}
              </ItemDesc>
            </Group>
          </>
        )}
      </FlexLayout>
    );
  }

  const iconBounds = getElementBounds(iconContent);
  const textWidth = Math.max(width - iconBounds.width - gap, 0);

  // 计算 desc 的可用高度和行数
  const descHeight = height
    ? Math.max(0, height - labelBounds.height - gap)
    : undefined;
  const descLineNumber = descHeight
    ? descHeight <= 60
      ? 1
      : Math.floor(descHeight / (descLineHeight * descFontSize))
    : 2;

  const labelY = height
    ? positionV === 'middle'
      ? (height - labelBounds.height - (descHeight || 0) - gap) / 2
      : positionV === 'flipped'
        ? height - labelBounds.height - (descHeight || 0) - gap
        : 0
    : 0;

  return (
    <FlexLayout
      {...restProps}
      flexDirection="row"
      gap={gap}
      alignItems={getIconVerticalAlign(positionV)}
    >
      {positionH === 'flipped' ? (
        <>
          <Group>
            <ItemLabel
              indexes={indexes}
              width={textWidth}
              y={labelY}
              alignHorizontal="right"
              alignVertical="middle"
              fill={labelColor}
            >
              {label}
            </ItemLabel>
            <ItemDesc
              indexes={indexes}
              width={textWidth}
              height={descHeight}
              y={labelY + labelBounds.height + gap}
              alignHorizontal="right"
              alignVertical={getDescVerticalAlign(positionV, true)}
              lineNumber={descLineNumber}
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
              y={labelY}
              alignHorizontal="left"
              alignVertical="middle"
              fill={labelColor}
            >
              {label}
            </ItemLabel>
            <ItemDesc
              indexes={indexes}
              width={textWidth}
              height={descHeight}
              y={labelY + labelBounds.height + gap}
              alignHorizontal="left"
              alignVertical={getDescVerticalAlign(positionV, true)}
              lineNumber={descLineNumber}
              fill={themeColors.colorTextSecondary}
            >
              {desc}
            </ItemDesc>
          </Group>
        </>
      )}
    </FlexLayout>
  );

  function getDescVerticalAlign(positionV: string, hasIcon: boolean) {
    return 'top';
    // if (positionV === 'normal') return 'top';
    // if (positionV === 'flipped') return 'bottom';

    return hasIcon ? 'middle' : 'top';
  }

  function getIconVerticalAlign(positionV: string) {
    if (positionV === 'normal') return 'flex-start';
    if (positionV === 'flipped') return 'flex-end';
    return 'center';
  }
};

registerItem('simple', {
  component: SimpleItem,
  composites: ['icon', 'label', 'desc'],
});
