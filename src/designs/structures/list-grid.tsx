import type { Bounds, ComponentType, JSXElement } from '../../jsx';
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
  const itemBoundsList: Bounds[] = [];
  const rowHeights: number[] = [];
  const colWidths: number[] = [];

  items.forEach((item, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    const bounds = getElementBounds(
      <Item
        indexes={[index]}
        data={data}
        datum={item}
        positionH="center"
        positionV={zigzag && index % 2 === 0 ? 'normal' : 'flipped'}
      />,
    );
    itemBoundsList.push(bounds);
    rowHeights[row] = Math.max(rowHeights[row] || 0, bounds.height);
    colWidths[col] = Math.max(colWidths[col] || 0, bounds.width);
  });

  const rowOffsets: number[] = [0];
  const colOffsets: number[] = [0];
  rowHeights.forEach((height, row) => {
    rowOffsets[row + 1] = rowOffsets[row] + height + gap;
  });
  colWidths.forEach((width, col) => {
    colOffsets[col + 1] = colOffsets[col] + width + gap;
  });

  const btnElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];

  // Track processed rows for left/right buttons
  const processedRows = new Set<number>();

  items.forEach((item, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    const itemX = colOffsets[col];
    const itemY = rowOffsets[row];
    const itemBounds = itemBoundsList[index];
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
