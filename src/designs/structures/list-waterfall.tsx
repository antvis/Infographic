import type { ComponentType, JSXElement } from '../../jsx';
import { getElementBounds, Group } from '../../jsx';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface ListWaterfallProps extends BaseStructureProps {
  columns?: number;
  gap?: number;
  stepOffset?: number;
}

export const ListWaterfall: ComponentType<ListWaterfallProps> = (props) => {
  const { Title, Item, data, columns = 4, gap = 20, stepOffset = 40 } = props;
  const { title, desc, items = [] } = data;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);
  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} positionH="center" />,
  );

  const btnElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];

  const colWidth = itemBounds.width + gap;

  items.forEach((item, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);

    const itemX = col * colWidth;

    const baseY = row * (itemBounds.height + gap);
    const columnStepOffset = col * stepOffset;

    const itemY = baseY + columnStepOffset;

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
        y={itemY + itemBounds.height + 5}
      />,
    );
  });

  items.forEach((item, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);

    const itemX = col * colWidth;
    const baseY = row * (itemBounds.height + gap);
    const columnStepOffset = col * stepOffset;
    const itemY = baseY + columnStepOffset;

    if (index === 0) {
      btnElements.push(
        <BtnAdd
          indexes={[0]}
          x={itemX - gap / 2 - btnBounds.width / 2}
          y={itemY + (itemBounds.height - btnBounds.height) / 2}
        />,
      );
    }

    if (col < columns - 1 && index < items.length - 1) {
      const nextRow = Math.floor((index + 1) / columns);

      if (row === nextRow) {
        btnElements.push(
          <BtnAdd
            indexes={[index + 1]}
            x={itemX + itemBounds.width + (gap - btnBounds.width) / 2}
            y={itemY + (itemBounds.height - btnBounds.height) / 2}
          />,
        );
      }
    }

    if (col === columns - 1 || index === items.length - 1) {
      btnElements.push(
        <BtnAdd
          indexes={[index + 1]}
          x={itemX + itemBounds.width + (gap - btnBounds.width) / 2}
          y={itemY + (itemBounds.height - btnBounds.height) / 2}
        />,
      );
    }
  });

  if (items.length === 0) {
    btnElements.push(
      <BtnAdd
        indexes={[0]}
        x={
          ((columns - 1) * colWidth) / 2 +
          (itemBounds.width - btnBounds.width) / 2
        }
        y={0}
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
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup>{btnElements}</BtnsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('list-waterfall', {
  component: ListWaterfall,
  composites: ['title', 'item'],
});
