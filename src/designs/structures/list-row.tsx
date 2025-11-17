import type { ComponentType, JSXElement } from '../../jsx';
import { getElementBounds, Group } from '../../jsx';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface ListRowProps extends BaseStructureProps {
  gap?: number;
  zigzag?: boolean;
}

export const ListRow: ComponentType<ListRowProps> = (props) => {
  const { Title, Item, data, gap = 20, zigzag } = props;
  const { title, desc, items = [] } = data;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);
  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} positionH="center" />,
  );

  const btnElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];

  const btnAddY = (itemBounds.height - btnBounds.height) / 2;
  const btnRemoveY = itemBounds.height;

  items.forEach((item, index) => {
    const itemX = (itemBounds.width + gap) * index;
    const indexes = [index];
    itemElements.push(
      <Item
        indexes={indexes}
        datum={item}
        data={data}
        x={itemX}
        positionH="center"
        positionV={zigzag && index % 2 === 0 ? 'normal' : 'flipped'}
      />,
    );

    btnElements.push(
      <BtnRemove
        indexes={indexes}
        x={itemX + (itemBounds.width - btnBounds.width) / 2}
        y={btnRemoveY}
      />,
    );

    const btnAddX =
      index === 0
        ? -(gap + btnBounds.width) / 2
        : itemX - (gap + btnBounds.width) / 2;

    btnElements.push(<BtnAdd indexes={indexes} x={btnAddX} y={btnAddY} />);
  });

  if (items.length > 0) {
    const lastItemX = (itemBounds.width + gap) * (items.length - 1);
    const extraAddBtnX =
      lastItemX + itemBounds.width + (gap - btnBounds.width) / 2;

    btnElements.push(
      <BtnAdd indexes={[items.length]} x={extraAddBtnX} y={btnAddY} />,
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

registerStructure('list-row', {
  component: ListRow,
  composites: ['title', 'item'],
});
