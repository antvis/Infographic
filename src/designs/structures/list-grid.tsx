import type { ComponentType, JSXElement } from '../../jsx';
import { getElementBounds, Group } from '../../jsx';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface ListGridProps extends BaseStructureProps {
  columns?: number;
  gap?: number;
  zigzag?: boolean;
}

export const ListGrid: ComponentType<ListGridProps> = (props) => {
  const { Title, Item, data, columns = 3, gap = 24, zigzag } = props;
  const { title, desc, items = [] } = data;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);
  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} positionH="center" />,
  );

  const btnElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];

  const rowHeight = itemBounds.height + gap;
  const colWidth = itemBounds.width + gap;

  // Track processed rows for left/right buttons
  const processedRows = new Set<number>();

  items.forEach((item, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    const itemX = col * colWidth;
    const itemY = row * rowHeight;
    const indexes = [index];

    itemElements.push(
      <Item
        indexes={indexes}
        datum={item}
        data={data}
        x={itemX}
        y={itemY}
        positionH="center"
        positionV={zigzag && index % 2 === 0 ? 'normal' : 'flipped'}
      />,
    );

    // Remove button - positioned below item
    btnElements.push(
      <BtnRemove
        indexes={indexes}
        x={itemX + (itemBounds.width - btnBounds.width) / 2}
        y={itemY + itemBounds.height}
      />,
    );

    // Add horizontal buttons between items (vertically centered with items)
    if (col < columns - 1) {
      btnElements.push(
        <BtnAdd
          indexes={[index + 1]}
          x={itemX + itemBounds.width + (gap - btnBounds.width) / 2}
          y={itemY + (itemBounds.height - btnBounds.height) / 2}
        />,
      );
    }

    // Add button at the left side of first item in each row
    if (col === 0 && !processedRows.has(row)) {
      btnElements.push(
        <BtnAdd
          indexes={[index]}
          x={itemX - gap / 2 - btnBounds.width / 2}
          y={itemY + (itemBounds.height - btnBounds.height) / 2}
        />,
      );
      processedRows.add(row);
    }

    // Add button at the right side of last item in each row
    const isLastInRow = col === columns - 1 || index === items.length - 1;
    if (isLastInRow) {
      btnElements.push(
        <BtnAdd
          indexes={[index + 1]}
          x={itemX + itemBounds.width + gap / 2 - btnBounds.width / 2}
          y={itemY + (itemBounds.height - btnBounds.height) / 2}
        />,
      );
    }
  });

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

registerStructure('list-grid', {
  component: ListGrid,
  composites: ['title', 'item'],
});
