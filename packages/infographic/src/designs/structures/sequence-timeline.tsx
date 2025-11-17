import type { ComponentType, JSXElement } from '../../jsx';
import { Defs, Ellipse, getElementBounds, Group, Path, Text } from '../../jsx';
import {
  BtnAdd,
  BtnRemove,
  BtnsGroup,
  ItemsGroup,
  ShapesGroup,
} from '../components';
import { FlexLayout } from '../layouts';
import { getColorPrimary, getPaletteColor, getPaletteColors } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface SequenceTimelineProps extends BaseStructureProps {
  gap?: number;
  lineOffset?: number;
}

export const SequenceTimeline: ComponentType<SequenceTimelineProps> = (
  props,
) => {
  const { Title, Item, data, gap = 10, options } = props;
  const { title, desc, items = [] } = data;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;
  const colorPrimary = getColorPrimary(options);
  const palette = getPaletteColors(options);
  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);
  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} positionH="normal" />,
  );

  const btnElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];
  const decorElements: JSXElement[] = [];

  const stepLabelX = 10;
  const timelineX = stepLabelX + 70 + 10;
  const itemX = timelineX + 30;
  const nodeRadius = 6;

  // Add continuous timeline line first (so it appears behind the dots)
  if (items.length > 1) {
    const firstNodeY = itemBounds.height / 2 + nodeRadius;
    const lastNodeY =
      (items.length - 1) * (itemBounds.height + gap) +
      itemBounds.height / 2 -
      nodeRadius;
    const continuousLinePath = `M ${timelineX} ${firstNodeY} L ${timelineX} ${lastNodeY}`;

    const linearGradientId = 'gradient-timeline-line';
    const totalHeight = lastNodeY - firstNodeY;

    // Generate gradient stops for each item
    const gradientStops = items.map((_, index) => {
      const nodeY = index * (itemBounds.height + gap) + itemBounds.height / 2;
      const offset = ((nodeY - firstNodeY) / totalHeight) * 100;
      const color = getPaletteColor(options, [index]);
      return <stop offset={`${offset}%`} stopColor={color || colorPrimary} />;
    });

    decorElements.push(
      <>
        <Defs>
          <linearGradient
            id={linearGradientId}
            x1={timelineX}
            y1={firstNodeY}
            x2={timelineX}
            y2={lastNodeY}
            gradientUnits="userSpaceOnUse"
          >
            {gradientStops}
          </linearGradient>
        </Defs>
        <Path
          d={continuousLinePath}
          stroke={`url(#${linearGradientId})`}
          strokeWidth={2}
          width={1}
          height={lastNodeY - firstNodeY}
        />
      </>,
    );
  }

  items.forEach((item, index) => {
    const itemY = index * (itemBounds.height + gap);
    const nodeY = itemY + itemBounds.height / 2;
    const indexes = [index];

    decorElements.push(
      <Text
        x={stepLabelX}
        y={nodeY}
        width={70}
        fontSize={18}
        fontWeight="bold"
        alignHorizontal="left"
        alignVertical="middle"
        fill={palette[index % palette.length]}
      >
        {`STEP ${index + 1}`}
      </Text>,
    );

    itemElements.push(
      <Item
        indexes={indexes}
        datum={item}
        data={data}
        x={itemX}
        y={itemY}
        positionH="normal"
      />,
    );

    decorElements.push(
      <Ellipse
        x={timelineX - nodeRadius}
        y={nodeY - nodeRadius}
        width={nodeRadius * 2}
        height={nodeRadius * 2}
        fill={palette[index % palette.length]}
      />,
    );

    btnElements.push(
      <BtnRemove
        indexes={indexes}
        x={itemX - btnBounds.width - 10}
        y={itemY + (itemBounds.height - btnBounds.height) / 2}
      />,
    );

    if (index === 0) {
      btnElements.push(
        <BtnAdd
          indexes={indexes}
          x={itemX + (itemBounds.width - btnBounds.width) / 2}
          y={itemY - btnBounds.height - 10}
        />,
      );
    } else {
      btnElements.push(
        <BtnAdd
          indexes={indexes}
          x={itemX + (itemBounds.width - btnBounds.width) / 2}
          y={itemY - gap / 2 - btnBounds.height / 2}
        />,
      );
    }
  });

  if (items.length > 0) {
    const lastItemY = (items.length - 1) * (itemBounds.height + gap);
    btnElements.push(
      <BtnAdd
        indexes={[items.length]}
        x={itemX + (itemBounds.width - btnBounds.width) / 2}
        y={lastItemY + itemBounds.height + 10}
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
        <ShapesGroup>{decorElements}</ShapesGroup>
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup>{btnElements}</BtnsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('sequence-timeline', {
  component: SequenceTimeline,
  composites: ['title', 'item'],
});
