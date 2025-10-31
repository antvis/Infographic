/** @jsxImportSource @antv/infographic-jsx */
import type { ComponentType, JSXElement } from '@antv/infographic-jsx';
import { getElementBounds, Group } from '@antv/infographic-jsx';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface CompareMirrorProps extends BaseStructureProps {
  /** 同侧数据项上下间隔 */
  gap?: number;
  /** 左右两侧间隔 */
  groupGap?: number;
}

export const CompareMirror: ComponentType<CompareMirrorProps> = (props) => {
  const { Title, Item, data, gap = 20, groupGap = 60 } = props;
  const { title, desc, items = [] } = data;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);
  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} positionH="center" />,
  );

  const btnElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];

  const leftItems = items.filter((_, index) => index % 2 === 0);
  const rightItems = items.filter((_, index) => index % 2 === 1);

  const leftX = 0;
  const rightX = itemBounds.width + groupGap;

  leftItems.forEach((item, index) => {
    const itemY = index * (itemBounds.height + gap);
    const originalIndex = index * 2;
    const indexes = [originalIndex];

    itemElements.push(
      <Item
        indexes={indexes}
        datum={item}
        data={data}
        x={leftX}
        y={itemY}
        positionH="flipped"
      />,
    );

    // Remove button - positioned to the right of left items
    btnElements.push(
      <BtnRemove
        indexes={indexes}
        x={leftX + itemBounds.width + gap / 4}
        y={itemY + (itemBounds.height - btnBounds.height) / 2}
      />,
    );

    // Add button above each left item (except first)
    if (index > 0) {
      btnElements.push(
        <BtnAdd
          indexes={[originalIndex]}
          x={leftX + (itemBounds.width - btnBounds.width) / 2}
          y={itemY - gap / 2 - btnBounds.height / 2}
        />,
      );
    }

    // Add button below each left item
    btnElements.push(
      <BtnAdd
        indexes={[originalIndex + 2]}
        x={leftX + (itemBounds.width - btnBounds.width) / 2}
        y={itemY + itemBounds.height + gap / 2 - btnBounds.height / 2}
      />,
    );
  });

  rightItems.forEach((item, index) => {
    const itemY = index * (itemBounds.height + gap);
    const originalIndex = index * 2 + 1;
    const indexes = [originalIndex];

    itemElements.push(
      <Item
        indexes={indexes}
        datum={item}
        data={data}
        x={rightX}
        y={itemY}
        positionH="normal"
      />,
    );

    // Remove button - positioned to the left of right items
    btnElements.push(
      <BtnRemove
        indexes={indexes}
        x={rightX - gap / 4 - btnBounds.width}
        y={itemY + (itemBounds.height - btnBounds.height) / 2}
      />,
    );

    // Add button above each right item (except first)
    if (index > 0) {
      btnElements.push(
        <BtnAdd
          indexes={[originalIndex]}
          x={rightX + (itemBounds.width - btnBounds.width) / 2}
          y={itemY - gap / 2 - btnBounds.height / 2}
        />,
      );
    }

    // Add button below each right item
    btnElements.push(
      <BtnAdd
        indexes={[originalIndex + 2]}
        x={rightX + (itemBounds.width - btnBounds.width) / 2}
        y={itemY + itemBounds.height + gap / 2 - btnBounds.height / 2}
      />,
    );
  });

  // Add buttons at the top for the first items
  if (items.length === 0) {
    // Initial add buttons when no items exist
    btnElements.push(
      <BtnAdd
        indexes={[0]}
        x={leftX + (itemBounds.width - btnBounds.width) / 2}
        y={0}
      />,
    );
    btnElements.push(
      <BtnAdd
        indexes={[1]}
        x={rightX + (itemBounds.width - btnBounds.width) / 2}
        y={0}
      />,
    );
  } else {
    // Add button above first left item
    if (leftItems.length > 0) {
      btnElements.push(
        <BtnAdd
          indexes={[0]}
          x={leftX + (itemBounds.width - btnBounds.width) / 2}
          y={-gap / 2 - btnBounds.height / 2}
        />,
      );
    }
    // Add button above first right item
    if (rightItems.length > 0) {
      btnElements.push(
        <BtnAdd
          indexes={[1]}
          x={rightX + (itemBounds.width - btnBounds.width) / 2}
          y={-gap / 2 - btnBounds.height / 2}
        />,
      );
    }
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

registerStructure('compare-mirror', {
  component: CompareMirror,
  composites: ['title', 'item'],
});
