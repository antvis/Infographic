/** @jsxImportSource @antv/infographic-jsx */
import type { ComponentType, JSXElement } from '@antv/infographic-jsx';
import {
  Defs,
  getElementBounds,
  Group,
  Path,
  Rect,
} from '@antv/infographic-jsx';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { getColorPrimary, getPaletteColor } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface SequenceColorSnakeStepsProps extends BaseStructureProps {
  gap?: number;
  itemsPerRow?: number;
  rowGap?: number;
  columnGap?: number;
  circleStrokeWidth?: number;
}

export const SequenceColorSnakeSteps: ComponentType<
  SequenceColorSnakeStepsProps
> = (props) => {
  const {
    Title,
    Item,
    data,
    gap = 0,
    rowGap = 0,
    itemsPerRow = 3,
    circleStrokeWidth = 18,
    options,
  } = props;
  const { title, desc, items = [] } = data;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;
  const colorPrimary = getColorPrimary(options);
  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);
  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} positionH="center" />,
  );
  const btnElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];
  const decorElements: JSXElement[] = [];

  items.forEach((item, index) => {
    const rowIndex = Math.floor(index / itemsPerRow);
    const colIndex = index % itemsPerRow;
    const isReversedRow = rowIndex % 2 === 1;
    const actualColIndex = isReversedRow
      ? itemsPerRow - 1 - colIndex
      : colIndex;

    const itemX = actualColIndex * (itemBounds.width + gap);
    const itemY = rowIndex * (itemBounds.height + rowGap);
    const indexes = [index];

    itemElements.push(
      <Item
        indexes={indexes}
        datum={item}
        data={data}
        x={itemX}
        y={itemY}
        positionH="center"
        positionV={index % 2 === 1 ? 'flipped' : 'normal'}
      />,
    );

    btnElements.push(
      <BtnRemove
        indexes={indexes}
        x={itemX + (itemBounds.width - btnBounds.width) / 2}
        y={itemY + itemBounds.height + 10}
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
    }

    if (index < items.length - 1) {
      const nextRowIndex = Math.floor((index + 1) / itemsPerRow);

      const isSameRow = rowIndex === nextRowIndex;

      if (isSameRow) {
        btnElements.push(
          <BtnAdd
            indexes={[index + 1]}
            x={itemX + (itemBounds.width - btnBounds.width) / 2}
            y={itemY - btnBounds.height - 10}
          />,
        );
      } else {
        const arcRadius = (rowGap + itemBounds.height) / 2;

        const currentItemY = itemY + itemBounds.height / 2;
        const nextItemY =
          itemY + itemBounds.height + rowGap + itemBounds.height / 2;

        let arcX, pathD, sweepFlag;

        if (isReversedRow) {
          arcX = itemX;
          sweepFlag = 0;
          pathD = `M ${arcX} ${currentItemY} A ${arcRadius} ${arcRadius} 0 0 ${sweepFlag} ${arcX} ${nextItemY}`;
        } else {
          arcX = itemX + itemBounds.width;
          sweepFlag = 1;
          pathD = `M ${arcX} ${currentItemY} A ${arcRadius} ${arcRadius} 0 0 ${sweepFlag} ${arcX} ${nextItemY}`;
        }

        const arcWidth = arcRadius * 2;
        const arcHeight = nextItemY - currentItemY;

        const currentColor = getPaletteColor(options, indexes);
        const nextColor = getPaletteColor(options, [index + 1]);
        const linearGradientId = `gradient-arc-${index}`;

        decorElements.push(
          <>
            <Defs>
              <linearGradient
                id={linearGradientId}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor={currentColor || colorPrimary} />
                <stop offset="100%" stopColor={nextColor || colorPrimary} />
              </linearGradient>
            </Defs>
            <Path
              d={pathD}
              stroke={`url(#${linearGradientId})`}
              strokeWidth={circleStrokeWidth}
              fill="none"
              width={arcWidth}
              height={arcHeight}
              data-element-type="shape"
            />
          </>,
        );

        const btnX = isReversedRow
          ? arcX - arcRadius - btnBounds.width / 2
          : arcX + arcRadius - btnBounds.width / 2;
        const btnY =
          itemY + itemBounds.height + rowGap / 2 - btnBounds.height / 2;

        btnElements.push(<BtnAdd indexes={[index + 1]} x={btnX} y={btnY} />);
      }
    }
  });

  if (items.length > 0) {
    const lastIndex = items.length - 1;
    const lastRowIndex = Math.floor(lastIndex / itemsPerRow);
    const lastColIndex = lastIndex % itemsPerRow;
    const isLastReversedRow = lastRowIndex % 2 === 1;
    const lastActualColIndex = isLastReversedRow
      ? itemsPerRow - 1 - lastColIndex
      : lastColIndex;

    const lastItemX = lastActualColIndex * (itemBounds.width + gap);
    const lastItemY = lastRowIndex * (itemBounds.height + rowGap);

    btnElements.push(
      <BtnAdd
        indexes={[items.length]}
        x={lastItemX + (itemBounds.width - btnBounds.width) / 2}
        y={lastItemY + itemBounds.height + btnBounds.height + 20}
      />,
    );
  }

  // Add left rectangle bar for the first item when there's an arc on the left side
  if (items.length / itemsPerRow > 2) {
    const arcRadius = (rowGap + itemBounds.height) / 2;
    const firstItemColor = getPaletteColor(options, [0]);

    decorElements.push(
      <Rect
        x={0 - arcRadius}
        y={itemBounds.height / 2 - circleStrokeWidth / 2}
        width={arcRadius}
        height={circleStrokeWidth}
        fill={firstItemColor || colorPrimary}
        data-element-type="shape"
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
        <Group>{decorElements}</Group>
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup>{btnElements}</BtnsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('sequence-color-snake-steps', {
  component: SequenceColorSnakeSteps,
  composites: ['title', 'item'],
});
