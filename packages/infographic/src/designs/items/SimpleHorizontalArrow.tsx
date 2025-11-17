/** @jsxImportSource @antv/infographic-jsx */
import {
  Bounds,
  ComponentType,
  getElementBounds,
  Group,
  Polygon,
  Text,
} from '@antv/infographic-jsx';
import { Gap, ItemDesc, ItemLabel } from '../components';
import { FlexLayout } from '../layouts';
import { AlignLayout } from '../layouts/Align';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface SimpleHorizontalArrowProps extends BaseItemProps {
  width?: number;
  /** 翻转方向 */
  flipped?: boolean;
}

export const SimpleHorizontalArrow: ComponentType<
  SimpleHorizontalArrowProps
> = (props) => {
  const [
    { indexes, datum, width = 140, themeColors, positionV = 'normal' },
    restProps,
  ] = getItemProps(props, ['width']);

  const isVNormal = positionV !== 'flipped';

  const textAlignVertical = isVNormal ? 'bottom' : 'top';
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

  const arrowHeight = 30;
  const labelGap = 10;
  const labelBounds = getElementBounds(label);
  const descBounds = getElementBounds(desc);
  const textHeight = labelBounds.height + descBounds.height;

  const totalHeight =
    textHeight + labelGap + arrowHeight + labelGap + textHeight;

  return (
    <Group width={width} height={totalHeight} {...restProps}>
      <FlexLayout flexDirection="column" alignItems="center">
        {isVNormal ? (
          <>
            {desc}
            {label}
            <Gap height={labelGap} />
          </>
        ) : (
          <>
            <Gap height={textHeight + labelGap} />
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
            <Gap height={labelGap} />
            {label}
            {desc}
          </>
        ) : (
          <>
            <Gap height={textHeight + labelGap} />
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

registerItem('simple-horizontal-arrow', {
  component: SimpleHorizontalArrow,
  composites: ['label', 'desc', 'time'],
});
