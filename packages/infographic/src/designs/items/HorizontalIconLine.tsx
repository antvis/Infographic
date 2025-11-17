/** @jsxImportSource @antv/infographic-jsx */
import {
  ComponentType,
  Ellipse,
  getElementBounds,
  Rect,
  Text,
} from '@antv/infographic-jsx';
import { Gap, ItemDesc, ItemIconCircle, ItemLabel } from '../components';
import { AlignLayout, FlexLayout } from '../layouts';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface HorizontalIconLineProps extends BaseItemProps {
  width?: number;
}

export const HorizontalIconLine: ComponentType<HorizontalIconLineProps> = (
  props,
) => {
  const [
    {
      indexes,
      datum,
      width = 160,
      themeColors,
      positionH = 'center',
      positionV = 'normal',
    },
    restProps,
  ] = getItemProps(props, ['width']);

  const textAlignHorizontal =
    positionH === 'normal'
      ? 'left'
      : positionH === 'flipped'
        ? 'right'
        : 'center';

  const label = (
    <ItemLabel
      indexes={indexes}
      width={width}
      alignHorizontal={textAlignHorizontal}
      fill={themeColors.colorPrimary}
    >
      {datum.label}
    </ItemLabel>
  );
  const labelBounds = getElementBounds(label);

  const desc = datum.desc ? (
    <ItemDesc
      indexes={indexes}
      width={width}
      fill={themeColors.colorTextSecondary}
      alignHorizontal={textAlignHorizontal}
      alignVertical={positionV === 'flipped' ? 'top' : 'bottom'}
    >
      {datum.desc}
    </ItemDesc>
  ) : null;
  const descBounds = getElementBounds(desc);

  const iconSize = 45;
  const icon = datum.icon ? (
    <ItemIconCircle
      size={iconSize}
      indexes={indexes}
      colorBg={themeColors.colorBg}
      fill={themeColors.colorPrimary}
    />
  ) : null;
  const iconBounds = getElementBounds(icon);

  const time = datum.time ? (
    <Text
      width={width}
      height={30}
      alignHorizontal="center"
      alignVertical="middle"
      fill={themeColors.colorPrimary}
      fontSize={18}
      fontWeight="bold"
    >
      {datum.time}
    </Text>
  ) : null;
  const timeBounds = getElementBounds(time);

  const lineHeight = 18;
  const line = (
    <AlignLayout horizontal="center" width={width} height={lineHeight}>
      <Rect
        width={width}
        height={lineHeight}
        fill={themeColors.colorPrimary}
        data-element-type="shape"
      />
      <Ellipse
        y={-3}
        width={lineHeight + 6}
        height={lineHeight + 6}
        fill={themeColors.colorBg}
        fillOpacity={0.5}
        data-element-type="shape"
      />
      <Ellipse
        y={(lineHeight - 12) / 2}
        width={12}
        height={12}
        fill="white"
        data-element-type="shape"
      />
    </AlignLayout>
  );

  const textSideHeight = labelBounds.height + descBounds.height;
  const iconSideHeight = iconBounds.height + timeBounds.height + 5;
  // 平衡line两侧高度，使 line 位于垂直居中位置
  const heightDiff = Math.abs(iconSideHeight - textSideHeight);
  const topBalance = iconSideHeight > textSideHeight ? heightDiff : 0;
  const bottomBalance = textSideHeight > iconSideHeight ? heightDiff : 0;

  if (positionV === 'flipped') {
    return (
      <FlexLayout {...restProps} flexDirection="column" alignItems="center">
        <Gap height={bottomBalance} />
        {time}
        {icon}
        <Gap height={5} />
        {line}
        {label}
        {desc}
        <Gap height={topBalance} />
      </FlexLayout>
    );
  }
  return (
    <FlexLayout {...restProps} flexDirection="column" alignItems="center">
      <Gap height={topBalance} />
      {label}
      {desc}
      {line}
      <Gap height={5} />
      {icon}
      {time}
      <Gap height={bottomBalance} />
    </FlexLayout>
  );
};

registerItem('horizontal-icon-line', {
  component: HorizontalIconLine,
  composites: ['icon', 'label', 'desc'],
});
