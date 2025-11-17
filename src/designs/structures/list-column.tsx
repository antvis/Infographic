import type { ComponentType, JSXElement } from '../../jsx';
import { getElementBounds, Group } from '../../jsx';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface ListColumnProps extends BaseStructureProps {
  width?: number;
  gap?: number;
  zigzag?: boolean;
}

export const ListColumn: ComponentType<ListColumnProps> = (props) => {
  const { Title, Item, data, gap = 20, width: contentWidth, zigzag } = props;
  const { title, desc, items = [] } = data;

  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);
  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} />,
  );

  const width: number = contentWidth || itemBounds.width;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  const btnElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];

  const btnAddX = (width - btnBounds.width) / 2;
  items.forEach((item, index) => {
    const itemY = (itemBounds.height + gap) * index;
    const indexes = [index];
    itemElements.push(
      <Item
        indexes={indexes}
        datum={item}
        data={data}
        y={itemY}
        width={width}
        positionV="middle"
        positionH={zigzag ? (index % 2 === 0 ? 'normal' : 'flipped') : 'normal'}
      />,
    );

    btnElements.push(
      <BtnRemove
        indexes={indexes}
        x={-btnBounds.width - 10}
        y={itemY + (itemBounds.height - btnBounds.height) / 2}
      />,
    );

    const btnAddY =
      index === 0 ? -btnBounds.height : itemY - gap / 2 - btnBounds.height / 2;

    btnElements.push(<BtnAdd indexes={indexes} x={btnAddX} y={btnAddY} />);
  });

  if (items.length > 0) {
    const lastItemY = (itemBounds.height + gap) * (items.length - 1);
    const extraAddBtnY = lastItemY + itemBounds.height;

    btnElements.push(
      <BtnAdd indexes={[items.length]} x={btnAddX} y={extraAddBtnY} />,
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

registerStructure('list-column', {
  component: ListColumn,
  composites: ['title', 'item'],
});
