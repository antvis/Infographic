import type { ComponentType, JSXElement } from '../../jsx';
import { Defs, Ellipse, getElementBounds, Group, Path, Rect } from '../../jsx';
import {
  BtnAdd,
  BtnRemove,
  BtnsGroup,
  ItemsGroup,
  ShapesGroup,
} from '../components';
import { FlexLayout } from '../layouts';
import { getColorPrimary, getPaletteColor, getThemeColors } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface SequenceHorizontalZigzagProps extends BaseStructureProps {
  gap?: number;
  cardPadding?: number;
}

export const SequenceHorizontalZigzag: ComponentType<
  SequenceHorizontalZigzagProps
> = (props) => {
  const { Title, Item, data, gap = 30, cardPadding = 10, options } = props;
  const { title, desc, items = [] } = data;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;
  const colorPrimary = getColorPrimary(options);
  const themeColors = getThemeColors({ colorPrimary }, options);

  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);
  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} positionH="center" />,
  );

  const btnElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];
  const decoElements: JSXElement[] = [];

  const cardWidth = itemBounds.width + cardPadding * 2;
  const cardHeight = itemBounds.height + cardPadding * 2 + 30;
  const dotSize = 8;
  const dotGap = 6;
  const topMargin = Math.max(btnBounds.height + 20, 40);
  const levelOffset = 40;

  items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    const cardX = index * (cardWidth + gap);
    let cardY: number;
    if (isEven) {
      if (index % 4 === 2) {
        cardY = topMargin;
      } else {
        cardY = topMargin + levelOffset;
      }
    } else {
      cardY = topMargin + levelOffset + 60;
    }
    const indexes = [index];

    const itemColor = getPaletteColor(options, indexes) || colorPrimary;

    if (isEven) {
      // Use item color with opacity for background
      const backgroundColor =
        itemColor === colorPrimary
          ? themeColors.colorPrimaryBg || '#E8F3FF'
          : `${itemColor}20`; // 20 = ~12% opacity in hex

      const cardBackground = (
        <Rect
          x={cardX}
          y={cardY}
          width={cardWidth}
          height={cardHeight}
          fill={backgroundColor}
          rx={20}
          ry={20}
        />
      );
      decoElements.push(cardBackground);
    }

    itemElements.push(
      <Item
        indexes={indexes}
        datum={item}
        data={data}
        x={cardX + cardPadding}
        y={cardY + cardPadding}
        positionH="center"
        positionV="normal"
      />,
    );

    const totalDotsWidth = items.length * dotSize + (items.length - 1) * dotGap;
    const dotsStartX = cardX + (cardWidth - totalDotsWidth) / 2;
    const dotsY = cardY + itemBounds.height + 20;

    for (let i = 0; i < items.length; i++) {
      const dotX = dotsStartX + i * (dotSize + dotGap);
      const isCurrent = i === index;
      decoElements.push(
        <Ellipse
          x={dotX}
          y={dotsY}
          width={dotSize}
          height={dotSize}
          fill={isCurrent ? itemColor : 'transparent'}
          stroke={itemColor}
          strokeWidth={2}
        />,
      );
    }

    btnElements.push(
      <BtnRemove
        indexes={indexes}
        x={cardX + (cardWidth - btnBounds.width) / 2}
        y={cardY + cardHeight + 10}
      />,
    );

    if (index === 0) {
      btnElements.push(
        <BtnAdd
          indexes={indexes}
          x={cardX + (cardWidth - btnBounds.width) / 2}
          y={cardY - btnBounds.height - 10}
        />,
      );
    } else {
      btnElements.push(
        <BtnAdd
          indexes={indexes}
          x={cardX - gap / 2 - btnBounds.width / 2}
          y={topMargin - btnBounds.height - 10}
        />,
      );
    }
  });

  if (items.length > 0) {
    const pathSegments: string[] = [];
    const radius = 35;
    const padding = gap / 2;
    const circleRadius = 6;

    const firstCardY = topMargin + levelOffset;

    const startX = 0 - padding;
    const startY = firstCardY + cardHeight / 2;

    pathSegments.push(`M ${startX} ${startY - circleRadius}`);

    items.forEach((_, index) => {
      const isEven = index % 2 === 0;
      const cardX = index * (cardWidth + gap);
      let cardY: number;
      if (isEven) {
        if (index % 4 === 2) {
          cardY = topMargin;
        } else {
          cardY = topMargin + levelOffset;
        }
      } else {
        cardY = topMargin + levelOffset + 60;
      }

      const left = cardX - padding;
      const right = cardX + cardWidth + padding;
      const top = cardY - padding;
      const bottom = cardY + cardHeight + padding;
      const middleY = cardY + cardHeight / 2;

      if (isEven) {
        pathSegments.push(`L ${left} ${top + radius}`);
        pathSegments.push(`Q ${left} ${top} ${left + radius} ${top}`);
        pathSegments.push(`L ${right - radius} ${top}`);
        pathSegments.push(`Q ${right} ${top} ${right} ${top + radius}`);
        pathSegments.push(`L ${right} ${middleY - circleRadius}`);
      } else {
        pathSegments.push(`L ${left} ${middleY}`);
        pathSegments.push(`L ${left} ${bottom - radius}`);
        pathSegments.push(`Q ${left} ${bottom} ${left + radius} ${bottom}`);
        pathSegments.push(`L ${right - radius} ${bottom}`);
        pathSegments.push(`Q ${right} ${bottom} ${right} ${bottom - radius}`);
        pathSegments.push(`L ${right} ${middleY + circleRadius}`);
      }
    });

    const lastIndex = items.length - 1;
    const lastIsEven = lastIndex % 2 === 0;
    const lastCardX = lastIndex * (cardWidth + gap);
    let lastCardY: number;
    if (lastIsEven) {
      if (lastIndex % 4 === 2) {
        lastCardY = topMargin;
      } else {
        lastCardY = topMargin + levelOffset;
      }
    } else {
      lastCardY = topMargin + levelOffset + 60;
    }
    const endX = lastCardX + cardWidth + padding;
    const endY = lastCardY + cardHeight / 2;

    const pathD = pathSegments.join(' ');

    // Create gradient for the path with stops for each item
    const linearGradientId = 'gradient-zigzag-path';
    const firstColor = getPaletteColor(options, [0]) || colorPrimary;
    const lastColor =
      getPaletteColor(options, [items.length - 1]) || colorPrimary;

    // Generate gradient stops for each item
    const gradientStops = items.map((_, index) => {
      const offset = (index / (items.length - 1)) * 100;
      const color = getPaletteColor(options, [index]) || colorPrimary;
      return <stop offset={`${offset}%`} stopColor={color} />;
    });

    decoElements.unshift(
      <>
        <Defs>
          <linearGradient
            id={linearGradientId}
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            gradientUnits="userSpaceOnUse"
          >
            {gradientStops}
          </linearGradient>
        </Defs>
        <Path
          d={pathD}
          stroke={`url(#${linearGradientId})`}
          strokeWidth={2}
          fill="none"
          width={
            (items.length - 1) * (cardWidth + gap) + cardWidth + padding * 2
          }
          height={cardHeight + 120}
        />
      </>,
    );

    decoElements.unshift(
      <Ellipse
        x={startX - circleRadius}
        y={startY - circleRadius}
        width={circleRadius * 2}
        height={circleRadius * 2}
        fill="transparent"
        stroke={firstColor}
        strokeWidth={2}
      />,
    );

    decoElements.unshift(
      <Ellipse
        x={endX - circleRadius}
        y={endY - circleRadius}
        width={circleRadius * 2}
        height={circleRadius * 2}
        fill="transparent"
        stroke={lastColor}
        strokeWidth={2}
      />,
    );
  }

  if (items.length > 0) {
    const lastIndex = items.length - 1;
    const lastCardX = lastIndex * (cardWidth + gap);

    btnElements.push(
      <BtnAdd
        indexes={[items.length]}
        x={lastCardX + cardWidth + (gap - btnBounds.width) / 2}
        y={topMargin - btnBounds.height - 10}
      />,
    );
  }

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {titleContent}
      <Group>
        <ShapesGroup>{decoElements}</ShapesGroup>
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup>{btnElements}</BtnsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('sequence-horizontal-zigzag', {
  component: SequenceHorizontalZigzag,
  composites: ['title', 'item'],
});
