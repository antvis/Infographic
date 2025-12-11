import { ComponentType, Group, Path, getElementBounds } from '../../jsx';
import { ItemLabel } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface LinedTextProps extends BaseItemProps {
  width?: number;
  formatter?: (text?: string) => string;
  usePaletteColor?: boolean;
  showUnderline?: boolean;
  underlineGap?: number;
  underlineExtend?: number;
  underlineThickness?: number;
}

export const LinedText: ComponentType<LinedTextProps> = (props) => {
  const [
    {
      datum,
      indexes,
      width,
      themeColors,
      positionH = 'normal',
      positionV = 'center',
      formatter = (text?: string) => text || '',
      usePaletteColor = false,
      showUnderline = false,
      underlineGap = 6,
      underlineExtend = 8,
      underlineThickness = 2,
    },
    restProps,
  ] = getItemProps(props, [
    'width',
    'formatter',
    'usePaletteColor',
    'showUnderline',
    'underlineGap',
    'underlineExtend',
    'underlineThickness',
  ]);

  const content = formatter(datum.label ?? datum.desc ?? '');
  const alignH =
    positionH === 'flipped'
      ? 'right'
      : positionH === 'center'
        ? 'center'
        : 'left';

  const measuredLabel = getElementBounds(
    <ItemLabel indexes={indexes} width={width}>
      {content}
    </ItemLabel>,
  );
  const contentWidth = width ?? measuredLabel.width;
  const labelHeight = measuredLabel.height;
  const underlineWidth = showUnderline ? contentWidth + underlineExtend * 2 : 0;
  const totalHeight =
    labelHeight + (showUnderline ? underlineGap + underlineThickness : 0);
  const finalWidth = showUnderline
    ? Math.max(contentWidth, underlineWidth)
    : contentWidth;
  const finalHeight = (restProps.height as number | undefined) ?? totalHeight;
  const offsetY =
    positionV === 'middle'
      ? (finalHeight - totalHeight) / 2
      : positionV === 'flipped'
        ? finalHeight - totalHeight
        : 0;

  const labelX =
    alignH === 'right'
      ? finalWidth - contentWidth
      : alignH === 'center'
        ? (finalWidth - contentWidth) / 2
        : 0;
  const labelY = offsetY;
  const underlineX =
    alignH === 'right'
      ? finalWidth - underlineWidth
      : alignH === 'center'
        ? (finalWidth - underlineWidth) / 2
        : 0;
  const underlineY = finalHeight;

  return (
    <Group {...restProps} width={finalWidth} height={finalHeight}>
      <ItemLabel
        indexes={indexes}
        x={labelX}
        y={labelY}
        width={contentWidth}
        height={labelHeight}
        alignHorizontal={alignH}
        alignVertical={
          positionV === 'flipped'
            ? 'bottom'
            : positionV === 'center'
              ? 'middle'
              : 'top'
        }
        fill={
          usePaletteColor ? themeColors.colorPrimary : themeColors.colorText
        }
      >
        {content}
      </ItemLabel>
      {showUnderline && (
        <Path
          d={`M 0 ${underlineThickness / 2} L ${underlineWidth} ${underlineThickness / 2}`}
          x={underlineX}
          y={underlineY - underlineThickness / 2}
          width={underlineWidth}
          height={underlineThickness}
          stroke={themeColors.colorPrimary}
          strokeWidth={underlineThickness}
          fill="none"
          strokeLinecap="round"
          data-element-type="shape"
        />
      )}
    </Group>
  );
};

registerItem('lined-text', {
  component: LinedText,
  composites: ['label'],
});
