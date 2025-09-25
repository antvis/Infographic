/** @jsxImportSource @antv/infographic-jsx */
import type { ComponentType, JSXElement } from '@antv/infographic-jsx';
import { getElementBounds, Group, Path } from '@antv/infographic-jsx';
import * as d3 from 'd3';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface HierarchyTreeProps extends BaseStructureProps {
  levelGap?: number;
  nodeGap?: number;
}

export const HierarchyTree: ComponentType<HierarchyTreeProps> = (props) => {
  const { Title, Item, data, levelGap = 80, nodeGap = 60 } = props;
  const { title, desc, items = [] } = data;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);
  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} positionH="center" />,
  );

  const btnElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];
  const decorElements: JSXElement[] = [];

  if (items.length === 0) {
    btnElements.push(
      <BtnAdd
        indexes={[0]}
        x={-btnBounds.width / 2}
        y={-btnBounds.height / 2}
      />,
    );

    return (
      <FlexLayout
        id="infographic-container"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {titleContent}
        <Group>
          <BtnsGroup>{btnElements}</BtnsGroup>
        </Group>
      </FlexLayout>
    );
  }

  // Build hierarchical data structure for d3
  const buildHierarchyData = () => {
    const rootItem = items[0];

    if (
      rootItem?.children &&
      Array.isArray(rootItem.children) &&
      rootItem.children.length > 0
    ) {
      // Use nested structure
      return {
        ...rootItem,
        children: rootItem.children.map((child: any, index: number) => ({
          ...child,
          _originalIndex: [0, index],
          _useNested: true,
        })),
        _originalIndex: [0],
        _useNested: true,
      };
    } else {
      // Use flat structure
      return {
        ...rootItem,
        children: items.slice(1).map((child: any, index: number) => ({
          ...child,
          _originalIndex: [index + 1],
          _useNested: false,
        })),
        _originalIndex: [0],
        _useNested: false,
      };
    }
  };

  const hierarchyData = buildHierarchyData();

  // Create d3 tree layout
  const root = d3.hierarchy(hierarchyData);
  const treeLayout = d3
    .tree<any>()
    .nodeSize([itemBounds.width + nodeGap, itemBounds.height + levelGap])
    .separation(() => 1);

  const treeNodes = treeLayout(root);

  // Calculate bounds and adjust positions to ensure positive coordinates
  const nodes = treeNodes.descendants();
  const minX = Math.min(...nodes.map((d) => d.x));
  const minY = Math.min(...nodes.map((d) => d.y));

  const offsetX = Math.max(0, -minX + itemBounds.width / 2);
  const offsetY = Math.max(0, -minY + btnBounds.height + 10);

  // Render nodes
  nodes.forEach((node) => {
    const nodeX = node.x + offsetX - itemBounds.width / 2;
    const nodeY = node.y + offsetY;
    const indexes = node.data._originalIndex;

    // Add item element
    itemElements.push(
      <Item
        indexes={indexes}
        datum={node.data}
        data={data}
        x={nodeX}
        y={nodeY}
        positionH="left"
      />,
    );

    // Add remove button
    btnElements.push(
      <BtnRemove
        indexes={indexes}
        x={nodeX + (itemBounds.width - btnBounds.width) / 2}
        y={nodeY + itemBounds.height + 5}
      />,
    );

    // Add connection lines to parent
    if (node.parent) {
      const parentX = node.parent.x + offsetX;
      const parentY = node.parent.y + offsetY + itemBounds.height;
      const childX = node.x + offsetX;
      const childY = node.y + offsetY;

      const midY = parentY + (childY - parentY) / 2;
      const linePath = `M ${parentX} ${parentY} L ${parentX} ${midY} L ${childX} ${midY} L ${childX} ${childY}`;

      decorElements.push(
        <Path d={linePath} stroke="#1890ff" strokeWidth={2} fill="none" />,
      );
    }
  });

  // Add buttons for adding new nodes
  const rootNode = nodes[0];
  const childNodes = nodes.slice(1);

  // Root add button (above root)
  btnElements.push(
    <BtnAdd
      indexes={rootNode.data._originalIndex}
      x={rootNode.x + offsetX - btnBounds.width / 2}
      y={rootNode.y + offsetY - btnBounds.height - 5}
    />,
  );

  if (childNodes.length > 0) {
    // Sort child nodes by x position for proper ordering
    const sortedChildren = childNodes.sort((a, b) => a.x - b.x);

    // Add buttons between and around child nodes
    for (let i = 0; i <= sortedChildren.length; i++) {
      let btnX: number;
      const btnY = sortedChildren[0].y + offsetY - btnBounds.height - 5;

      if (i === 0) {
        // Before first child - symmetric to after last child
        btnX =
          sortedChildren[0].x +
          offsetX -
          (itemBounds.width + nodeGap) / 2 -
          btnBounds.width / 2;
      } else if (i === sortedChildren.length) {
        // After last child - symmetric to before first child
        btnX =
          sortedChildren[sortedChildren.length - 1].x +
          offsetX +
          (itemBounds.width + nodeGap) / 2 -
          btnBounds.width / 2;
      } else {
        // Between children
        btnX =
          (sortedChildren[i - 1].x + sortedChildren[i].x) / 2 +
          offsetX -
          btnBounds.width / 2;
      }

      btnElements.push(
        <BtnAdd
          indexes={rootNode.data._useNested ? [0, i] : [i + 1]}
          x={btnX}
          y={btnY}
        />,
      );
    }
  } else {
    // No children - add button to add first child
    btnElements.push(
      <BtnAdd
        indexes={rootNode.data._useNested ? [0, 0] : [1]}
        x={rootNode.x + offsetX - btnBounds.width / 2}
        y={rootNode.y + offsetY + levelGap - btnBounds.height - 5}
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

registerStructure('hierarchy-tree', { component: HierarchyTree });
