/** @jsxImportSource @antv/infographic-jsx */
import type { ComponentType, JSXElement } from '@antv/infographic-jsx';
import { getElementBounds, Group, Rect } from '@antv/infographic-jsx';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { getPaletteColors } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface CompareHierarchyRowProps extends BaseStructureProps {
  gap?: number;
  itemGap?: number;
  columnWidth?: number;
  itemPadding?: number;
  showColumnBackground?: boolean;
  columnBackgroundAlpha?: number;
}

/**
 * 横向层级对比结构
 * 第一级：横向排列的根节点
 * 第二级：每个根节点下的子节点列表
 */
export const CompareHierarchyRow: ComponentType<CompareHierarchyRowProps> = (
  props,
) => {
  const {
    Title,
    Items,
    data,
    gap = 0,
    itemGap = 20,
    columnWidth = 280,
    itemPadding = 5,
    showColumnBackground = true,
    columnBackgroundAlpha = 0.08,
    options,
  } = props;
  const [RootItem, Item] = Items;
  const { title, desc, items = [] } = data;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;
  const palette = getPaletteColors(options);

  const itemElements: JSXElement[] = [];
  const btnElements: JSXElement[] = [];

  const childItemWidth = columnWidth - itemPadding * 2;

  const rootItemBounds = getElementBounds(
    <RootItem indexes={[0]} data={data} datum={items[0]} width={columnWidth} />,
  );
  const childItemBounds = getElementBounds(
    <Item
      indexes={[0, 0]}
      data={data}
      datum={items[0]?.children?.[0] || {}}
      width={childItemWidth}
    />,
  );

  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);

  const maxChildrenCount = Math.max(
    ...items.map((item) => item.children?.length || 0),
    0,
  );

  const columnHeight =
    rootItemBounds.height +
    itemGap +
    maxChildrenCount * (childItemBounds.height + itemGap);

  items.forEach((rootItem, rootIndex) => {
    const { children = [] } = rootItem;

    const columnX = rootIndex * (columnWidth + gap);
    const rootX = columnX;
    const rootY = 0;

    if (showColumnBackground) {
      const baseColor = palette[rootIndex % palette.length];
      const bgColor = `${baseColor}${Math.round(columnBackgroundAlpha * 255)
        .toString(16)
        .padStart(2, '0')}`;

      itemElements.push(
        <Rect
          x={columnX}
          y={rootY}
          width={columnWidth}
          height={columnHeight}
          fill={bgColor}
          rx={0}
          ry={0}
          data-element-type="shape"
        />,
      );
    }

    itemElements.push(
      <RootItem
        indexes={[rootIndex]}
        datum={rootItem}
        data={data}
        x={rootX}
        y={rootY}
        width={columnWidth}
      />,
    );

    btnElements.push(
      <BtnRemove
        indexes={[rootIndex]}
        x={rootX + rootItemBounds.width - btnBounds.width - 10}
        y={rootY + 10}
      />,
    );

    if (rootIndex === 0) {
      btnElements.push(
        <BtnAdd
          indexes={[rootIndex]}
          x={rootX + rootItemBounds.width / 2 - btnBounds.width / 2}
          y={rootY - btnBounds.height - 5}
        />,
      );
    }

    const childStartY = rootY + rootItemBounds.height + itemGap;

    children.forEach((child, childIndex) => {
      const childY =
        childStartY + childIndex * (childItemBounds.height + itemGap);
      const childX = rootX + itemPadding;
      const indexes = [rootIndex, childIndex];

      itemElements.push(
        <Item
          indexes={indexes}
          datum={child}
          data={data}
          x={childX}
          y={childY}
          width={childItemWidth}
        />,
      );

      btnElements.push(
        <BtnRemove
          indexes={indexes}
          x={childX + childItemBounds.width - btnBounds.width - 10}
          y={childY + (childItemBounds.height - btnBounds.height) / 2}
        />,
      );

      if (childIndex < children.length - 1) {
        btnElements.push(
          <BtnAdd
            indexes={[rootIndex, childIndex + 1]}
            x={childX + childItemBounds.width / 2 - btnBounds.width / 2}
            y={childY + childItemBounds.height - btnBounds.height / 2}
          />,
        );
      }
    });

    const childX = rootX + itemPadding;

    if (children.length > 0) {
      const lastChildY =
        childStartY + children.length * (childItemBounds.height + itemGap);
      btnElements.push(
        <BtnAdd
          indexes={[rootIndex, children.length]}
          x={childX + childItemBounds.width / 2 - btnBounds.width / 2}
          y={lastChildY - childItemBounds.height / 2 - btnBounds.height / 2}
        />,
      );
    } else {
      btnElements.push(
        <BtnAdd
          indexes={[rootIndex, 0]}
          x={childX + childItemBounds.width / 2 - btnBounds.width / 2}
          y={childStartY - itemGap / 2 - btnBounds.height / 2}
        />,
      );
    }
  });

  if (items.length > 0) {
    const lastColumnX = items.length * (columnWidth + gap);
    btnElements.push(
      <BtnAdd
        indexes={[items.length]}
        x={lastColumnX - gap / 2 - btnBounds.width / 2}
        y={-btnBounds.height - 5}
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

registerStructure('compare-hierarchy-row', {
  component: CompareHierarchyRow,
  composites: ['title', 'item'],
});
