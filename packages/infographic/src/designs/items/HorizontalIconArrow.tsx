import {
  Bounds,
  ComponentType,
  Ellipse,
  getElementBounds,
  Group,
  Path,
  Polygon,
  Text,
} from '../../jsx';
import {
  Gap,
  ItemDesc,
  ItemIconCircle,
  ItemLabel,
  ShapesGroup,
} from '../components';
import { FlexLayout } from '../layouts';
import { AlignLayout } from '../layouts/Align';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface HorizontalIconArrowProps extends BaseItemProps {
  width?: number;
}

export const HorizontalIconArrow: ComponentType<HorizontalIconArrowProps> = (
  props,
) => {
  const [
    { indexes, datum, width = 140, themeColors, positionV = 'normal' },
    restProps,
  ] = getItemProps(props, ['width']);

  const isVNormal = positionV !== 'flipped';
  const textAlignVertical = positionV === 'normal' ? 'bottom' : 'top';
  const label = (
    <ItemLabel
      indexes={indexes}
      width={width}
      fill={themeColors.colorText}
      alignHorizontal="center"
      alignVertical={textAlignVertical}
      fontSize={14}
    >
      {datum.label}
    </ItemLabel>
  );
  const desc = (
    <ItemDesc
      indexes={indexes}
      width={width}
      fill={themeColors.colorTextSecondary}
      alignHorizontal="center"
      alignVertical={textAlignVertical}
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
      width={8}
      height={30}
      fill={themeColors.colorPrimary}
      positionV={positionV}
    />
  );

  const dotLineGap = 5;
  const iconGap = 25;
  const arrowHeight = 30;
  const labelBounds = getElementBounds(label);
  const descBounds = getElementBounds(desc);
  const iconBounds = getElementBounds(icon);
  const dotLineBounds = getElementBounds(dotLine);
  const fixedGap =
    labelBounds.height +
    descBounds.height +
    dotLineGap +
    dotLineBounds.height -
    iconBounds.height -
    iconGap;

  const totalHeight =
    iconBounds.height +
    iconGap +
    arrowHeight +
    dotLineBounds.height +
    dotLineGap +
    labelBounds.height +
    descBounds.height;

  return (
    <Group width={width} height={totalHeight} {...restProps}>
      <FlexLayout flexDirection="column" alignItems="center">
        {isVNormal ? (
          <>
            {desc}
            {label}
            <Gap height={dotLineGap} />
            {dotLine}
          </>
        ) : (
          <>
            <Gap height={fixedGap} />
            {icon}
            <Gap height={iconGap} />
          </>
        )}
        <AlignLayout horizontal="center" vertical="middle">
          <HorizontalArrow
            width={width}
            height={arrowHeight}
            fill={themeColors.colorPrimary}
          />
          <Text
            width={width}
            height={arrowHeight}
            alignHorizontal="center"
            alignVertical="middle"
            fill={themeColors.colorWhite}
            fontWeight="bold"
            fontSize={16}
          >
            {datum.time
              ? datum.time
              : String(indexes[0] + 1)
                  .padStart(2, '0')
                  .slice(-2)}
          </Text>
        </AlignLayout>
        {!isVNormal ? (
          <>
            {dotLine}
            <Gap height={dotLineGap} />
            {label}
            {desc}
          </>
        ) : (
          <>
            <Gap height={iconGap} />
            {icon}
          </>
        )}
      </FlexLayout>
    </Group>
  );
};

const HorizontalArrow = (
  props: Partial<Bounds> & { fill: string; size?: number },
) => {
  const {
    x = 0,
    y = 0,
    width = 100,
    height = 40,
    fill = '#1890FF',
    size = 10,
  } = props;
  return (
    <Polygon
      width={width}
      height={height}
      points={[
        { x, y },
        { x: x + width - size, y },
        { x: x + width, y: y + height / 2 },
        { x: x + width - size, y: y + height },
        { x, y: y + height },
        { x: x + size, y: y + height / 2 },
      ]}
      fill={fill}
      data-element-type="shape"
    />
  );
};

const DotLine = (props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill: string;
  positionV?: 'normal' | 'middle' | 'flipped';
}) => {
  const {
    x = 0,
    y = 0,
    width = 10,
    height = 50,
    fill,
    positionV = 'top',
  } = props;
  const r = width / 2;
  const lineLength = height - r;
  const strokeWidth = 2;
  const lineX = r;
  return (
    <ShapesGroup x={x} y={y} width={width} height={height}>
      <Ellipse
        width={width}
        height={width}
        fill={fill}
        y={positionV === 'top' ? 0 : lineLength - r}
      />
      <Path
        d={
          positionV === 'top'
            ? `M${lineX},${r} L${lineX},${r + lineLength}`
            : `M${lineX},0 L${lineX},${lineLength - r}`
        }
        strokeWidth={strokeWidth}
        stroke={fill}
      />
    </ShapesGroup>
  );
};

registerItem('horizontal-icon-arrow', {
  component: HorizontalIconArrow,
  composites: ['icon', 'label', 'desc', 'time'],
});
