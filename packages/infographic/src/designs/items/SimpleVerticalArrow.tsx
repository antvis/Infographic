/** @jsxImportSource @antv/infographic-jsx */
import {
  Bounds,
  ComponentType,
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

export interface SimpleVerticalArrowProps extends BaseItemProps {
  height?: number;
  /** 翻转方向 */
  flipped?: boolean;
}

export const SimpleVerticalArrow: ComponentType<SimpleVerticalArrowProps> = (
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

  const labelGap = 15;
  const arrowWidth = 30;
  const textWidth = 120;

  const totalWidth = textWidth + labelGap + arrowWidth + labelGap + textWidth;

  return (
    <Group width={totalWidth} height={height} {...restProps}>
      <FlexLayout flexDirection="row" alignItems="center">
        {positionH === 'normal' ? (
          <>
            <FlexLayout flexDirection="column" alignItems="flex-end">
              {label}
              {desc}
            </FlexLayout>
            <Gap width={labelGap} />
          </>
        ) : (
          <>
            <Gap width={textWidth + labelGap} />
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
            <Gap width={labelGap} />
            <FlexLayout flexDirection="column" alignItems="flex-start">
              {label}
              {desc}
            </FlexLayout>
          </>
        ) : (
          <>
            <Gap width={textWidth + labelGap} />
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

registerItem('simple-vertical-arrow', {
  component: SimpleVerticalArrow,
  values: ['label', 'desc'],
});
