/** @jsxImportSource @antv/infographic-jsx */
import {
  Bounds,
  ComponentType,
  Ellipse,
  getElementBounds,
  Group,
  Path,
  Polygon,
  Text,
} from '@antv/infographic-jsx';
import { Gap, ItemDesc, ItemIconCircle, ItemLabel } from '../components';
import { FlexLayout } from '../layouts';
import { AlignLayout } from '../layouts/Align';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface VerticalIconArrowProps extends BaseItemProps {
  height?: number;
  /** 翻转方向 */
  flipped?: boolean;
}

export const VerticalIconArrow: ComponentType<VerticalIconArrowProps> = (
  props,
) => {
  const [{ indexes, datum, height = 140, themeColors, flipped }, restProps] =
    getItemProps(props, ['height', 'flipped']);

  const positionH = indexes[0] % 2 === (flipped ? 0 : 1) ? 'normal' : 'flipped';

  const textAlignHorizontal = positionH === 'normal' ? 'right' : 'left';
  const label = (
    <ItemLabel
      indexes={indexes}
      width={120}
      fill={themeColors.colorText}
      alignHorizontal={textAlignHorizontal}
      alignVertical="center"
      fontSize={14}
    >
      {datum.label}
    </ItemLabel>
  );
  const desc = (
    <ItemDesc
      indexes={indexes}
      width={120}
      fill={themeColors.colorTextSecondary}
      alignHorizontal={textAlignHorizontal}
      alignVertical="top"
    >
      {datum.desc}
    </ItemDesc>
  );
  const icon = (
    <ItemIconCircle
      indexes={indexes}
      fill={themeColors.colorPrimary}
      colorBg={themeColors.colorWhite}
    />
  );
  const dotLine = (
    <DotLine
      width={30}
      height={8}
      fill={themeColors.colorPrimary}
      positionH={positionH}
    />
  );

  const dotLineGap = 5;
  const iconGap = 25;
  const arrowWidth = 30;
  const labelBounds = getElementBounds(label);
  const iconBounds = getElementBounds(icon);
  const dotLineBounds = getElementBounds(dotLine);
  const fixedGap =
    labelBounds.width +
    dotLineGap +
    dotLineBounds.width -
    iconBounds.width -
    iconGap;

  const totalWidth =
    Math.max(
      labelBounds.width + dotLineGap + dotLineBounds.width,
      iconGap + iconBounds.width,
    ) *
      2 +
    arrowWidth;

  return (
    <Group width={totalWidth} height={height} {...restProps}>
      <FlexLayout flexDirection="row" alignItems="center">
        {positionH === 'normal' ? (
          <>
            <FlexLayout flexDirection="column" alignItems="flex-end">
              {label}
              {desc}
            </FlexLayout>
            <Gap width={dotLineGap} />
            {dotLine}
          </>
        ) : (
          <>
            <Gap width={fixedGap} />
            {icon}
            <Gap width={iconGap} />
          </>
        )}
        <AlignLayout horizontal="center" vertical="center">
          <VerticalArrow
            width={arrowWidth}
            height={height}
            fill={themeColors.colorPrimary}
          />
          <Text
            width={arrowWidth}
            height={height}
            alignHorizontal="center"
            alignVertical="center"
            fill={themeColors.colorWhite}
            fontWeight="bold"
            fontSize={16}
          >
            {String(indexes[0] + 1)
              .padStart(2, '0')
              .slice(-2)}
          </Text>
        </AlignLayout>
        {positionH === 'flipped' ? (
          <>
            {dotLine}
            <Gap width={dotLineGap} />
            <FlexLayout flexDirection="column" alignItems="flex-start">
              {label}
              {desc}
            </FlexLayout>
          </>
        ) : (
          <>
            <Gap width={iconGap} />
            {icon}
          </>
        )}
      </FlexLayout>
    </Group>
  );
};

const VerticalArrow = (
  props: Partial<Bounds> & { fill: string; size?: number },
) => {
  const {
    x = 0,
    y = 0,
    width = 30,
    height = 100,
    fill = '#1890FF',
    size = 10,
  } = props;
  return (
    <Polygon
      width={width}
      height={height}
      points={[
        { x, y },
        { x: x + width / 2, y: y + size },
        { x: x + width, y },
        { x: x + width, y: y + height - size },
        { x: x + width / 2, y: y + height },
        { x, y: y + height - size },
      ]}
      fill={fill}
    />
  );
};

const DotLine = (props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill: string;
  positionH?: 'normal' | 'flipped';
}) => {
  const {
    x = 0,
    y = 0,
    width = 50,
    height = 10,
    fill,
    positionH = 'normal',
  } = props;
  const r = height / 2;
  const lineLength = width - r;
  const strokeWidth = 2;
  const lineY = r;
  return (
    <Group x={x} y={y} width={width} height={height}>
      <Ellipse
        width={height}
        height={height}
        fill={fill}
        x={positionH === 'normal' ? 0 : lineLength - r}
      />
      <Path
        d={
          positionH === 'normal'
            ? `M${r},${lineY} L${r + lineLength},${lineY}`
            : `M0,${lineY} L${lineLength - r},${lineY}`
        }
        strokeWidth={strokeWidth}
        stroke={fill}
      />
    </Group>
  );
};

registerItem('vertical-icon-arrow', {
  component: VerticalIconArrow,
  values: ['icon', 'label', 'desc'],
});
