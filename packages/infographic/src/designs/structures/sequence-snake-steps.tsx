import type { ComponentType, JSXElement } from '../../jsx';
import { getElementBounds, Group } from '../../jsx';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { SimpleArrow } from '../decorations';
import { FlexLayout } from '../layouts';
import { getColorPrimary } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface SequenceSnakeStepsProps extends BaseStructureProps {
  gap?: number;
  itemsPerRow?: number;
  rowGap?: number;
}

export const SequenceSnakeSteps: ComponentType<SequenceSnakeStepsProps> = (
  props,
) => {
  const {
    Title,
    Item,
    data,
    gap = 40,
    itemsPerRow = 3,
    rowGap = 80,
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

  const arrowWidth = 25;
  const arrowHeight = 25;

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
      const nextColIndex = (index + 1) % itemsPerRow;
      const isNextReversedRow = nextRowIndex % 2 === 1;
      const nextActualColIndex = isNextReversedRow
        ? itemsPerRow - 1 - nextColIndex
        : nextColIndex;

      const nextItemX = nextActualColIndex * (itemBounds.width + gap);

      const isSameRow = rowIndex === nextRowIndex;

      if (isSameRow) {
        const isRightToLeft = isReversedRow;
        const arrowX = isRightToLeft
          ? nextItemX + itemBounds.width + (gap - arrowWidth) / 2
          : itemX + itemBounds.width + (gap - arrowWidth) / 2;
        const arrowY = itemY + itemBounds.height / 2 - arrowHeight / 2;

        decorElements.push(
          <SimpleArrow
            x={arrowX}
            y={arrowY}
            width={arrowWidth}
            height={arrowHeight}
            colorPrimary={colorPrimary}
            rotation={isRightToLeft ? 180 : 0}
          />,
        );

        btnElements.push(
          <BtnAdd
            indexes={[index + 1]}
            x={arrowX + (arrowWidth - btnBounds.width) / 2}
            y={itemY - btnBounds.height - 10}
          />,
        );
      } else {
        const turnArrowX = itemX + itemBounds.width / 2 - arrowWidth / 2;
        const turnArrowY =
          itemY + itemBounds.height + (rowGap - arrowHeight) / 2;

        decorElements.push(
          <SimpleArrow
            x={turnArrowX}
            y={turnArrowY}
            width={arrowWidth}
            height={arrowHeight}
            colorPrimary={colorPrimary}
            rotation={90}
          />,
        );

        btnElements.push(
          <BtnAdd
            indexes={[index + 1]}
            x={turnArrowX + (arrowWidth - btnBounds.width) / 2}
            y={turnArrowY + (arrowHeight - btnBounds.height) / 2}
          />,
        );
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

registerStructure('sequence-snake-steps', {
  component: SequenceSnakeSteps,
  composites: ['title', 'item'],
});
