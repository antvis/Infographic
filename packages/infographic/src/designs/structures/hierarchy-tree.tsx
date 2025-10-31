/** @jsxImportSource @antv/infographic-jsx */
import type { ComponentType, JSXElement } from '@antv/infographic-jsx';
import { getElementBounds, Group, Path } from '@antv/infographic-jsx';
import * as d3 from 'd3';
import { Data } from '../../types';
import { getDatumByIndexes } from '../../utils';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { getColorPrimary, getItemComponent } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface HierarchyTreeProps extends BaseStructureProps {
  levelGap?: number;
  nodeGap?: number;
}

export const HierarchyTree: ComponentType<HierarchyTreeProps> = (props) => {
  const { Title, Items, data, levelGap = 80, nodeGap = 60, options } = props;
  const { title, desc } = data;

  // 内置工具方法：数据预处理
  const normalizeItems = (items: Data['items']) => {
    const list = [...items];
    if (!list[0]?.children) {
      list[0] = { ...list[0], children: list.slice(1) };
      list.splice(1);
    }
    return list;
  };

  // 内置工具方法：构建层级数据
  const buildHierarchyData = (list: any[]): any => {
    if (!list.length) return null;

    const rootItem = list[0];
    const buildNode = (
      node: any,
      parentIndexes: number[] = [],
      idx = 0,
    ): any => {
      const indexes = [...parentIndexes, idx];
      return {
        ...node,
        _originalIndex: indexes,
        _depth: indexes.length - 1,
        children:
          node.children?.map((c: any, i: number) => buildNode(c, indexes, i)) ??
          [],
      };
    };

    return rootItem.children?.length
      ? buildNode(rootItem)
      : {
          ...rootItem,
          _originalIndex: [0],
          _depth: 0,
          children: list.slice(1).map((child, i) => ({
            ...child,
            _originalIndex: [i + 1],
            _depth: 1,
          })),
        };
  };

  // 内置工具方法：计算各层节点边界
  const computeLevelBounds = (maxLevels: number) => {
    let maxWidth = 0,
      maxHeight = 0;
    const levelBounds = new Map<number, any>();

    for (let level = 0; level < maxLevels; level++) {
      const ItemComponent = getItemComponent(Items, level);
      const indexes = Array(level + 1).fill(0);
      const bounds = getElementBounds(
        <ItemComponent
          indexes={indexes}
          data={data}
          datum={getDatumByIndexes(items, indexes)}
          positionH="center"
        />,
      );
      levelBounds.set(level, bounds);
      maxWidth = Math.max(maxWidth, bounds.width);
      maxHeight = Math.max(maxHeight, bounds.height);
    }

    return { levelBounds, maxWidth, maxHeight };
  };

  // 内置工具方法：渲染单个节点
  const renderNode = (
    node: any,
    levelBounds: Map<number, any>,
    btnBounds: any,
    offsets: { x: number; y: number },
  ) => {
    const { x, y, depth, data: nodeData, parent } = node;
    const indexes = nodeData._originalIndex;
    const NodeComponent = getItemComponent(Items, depth);
    const bounds = levelBounds.get(depth)!;
    const nodeX = x + offsets.x - bounds.width / 2;
    const nodeY = y + offsets.y;

    const elements = {
      items: [] as JSXElement[],
      btns: [] as JSXElement[],
      decor: [] as JSXElement[],
    };

    // 节点本体
    elements.items.push(
      <NodeComponent
        indexes={indexes}
        datum={nodeData}
        data={data}
        x={nodeX}
        y={nodeY}
        positionH="center"
      />,
    );

    // 删除和添加按钮
    elements.btns.push(
      <BtnRemove
        indexes={indexes}
        x={nodeX + (bounds.width - btnBounds.width) / 2}
        y={nodeY + bounds.height + 5}
      />,
      <BtnAdd
        indexes={[...indexes, 0]}
        x={nodeX + (bounds.width - btnBounds.width) / 2}
        y={nodeY + bounds.height + btnBounds.height + 10}
      />,
    );

    // 父子连线
    if (parent) {
      const parentBounds = levelBounds.get(parent.depth)!;
      const parentX = parent.x + offsets.x;
      const parentY = parent.y + offsets.y + parentBounds.height;
      const childX = x + offsets.x;
      const childY = y + offsets.y;
      const midY = parentY + (childY - parentY) / 2;

      elements.decor.push(
        <Path
          d={`M ${parentX} ${parentY} L ${parentX} ${midY} L ${childX} ${midY} L ${childX} ${childY}`}
          stroke={getColorPrimary(options)}
          strokeWidth={2}
          fill="none"
        />,
      );
    }

    return elements;
  };

  // 内置工具方法：渲染兄弟节点间按钮
  const renderSiblingBtns = (
    nodes: any[],
    btnBounds: any,
    offsets: { x: number; y: number },
  ) => {
    const nodesByParent = new Map<string, any[]>();

    nodes.forEach((node) => {
      const key = node.parent
        ? node.parent.data._originalIndex.join('-')
        : 'root';
      (nodesByParent.get(key) ?? nodesByParent.set(key, []).get(key)!).push(
        node,
      );
    });

    const btns: JSXElement[] = [];
    nodesByParent.forEach((siblings) => {
      if (siblings.length <= 1) return;

      const sorted = siblings.slice().sort((a, b) => a.x - b.x);
      const siblingY = sorted[0].y + offsets.y - btnBounds.height - 5;

      for (let i = 0; i < sorted.length - 1; i++) {
        const btnX =
          (sorted[i].x + sorted[i + 1].x) / 2 + offsets.x - btnBounds.width / 2;
        const parentIndexes = sorted[i].data._originalIndex.slice(0, -1);
        const insertIndex = sorted[i].data._originalIndex.at(-1)! + 1;

        btns.push(
          <BtnAdd
            indexes={[...parentIndexes, insertIndex]}
            x={btnX}
            y={siblingY}
          />,
        );
      }
    });

    return btns;
  };

  // 主逻辑
  const items = normalizeItems(data.items);
  const titleContent = Title ? <Title title={title} desc={desc} /> : null;
  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);

  // 空状态处理
  if (!items.length) {
    return (
      <FlexLayout
        id="infographic-container"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {titleContent}
        <Group>
          <BtnsGroup>
            <BtnAdd
              indexes={[0]}
              x={-btnBounds.width / 2}
              y={-btnBounds.height / 2}
            />
          </BtnsGroup>
        </Group>
      </FlexLayout>
    );
  }

  // 构建和布局
  const hierarchyData = buildHierarchyData(items);
  const root = d3.hierarchy(hierarchyData);
  const { levelBounds, maxWidth, maxHeight } = computeLevelBounds(
    root.height + 1,
  );

  const treeLayout = d3
    .tree<any>()
    .nodeSize([maxWidth + nodeGap, maxHeight + levelGap])
    .separation(() => 1);
  const nodes = treeLayout(root).descendants();

  // 计算偏移量
  const minX = Math.min(...nodes.map((d) => d.x));
  const minY = Math.min(...nodes.map((d) => d.y));
  const offsets = {
    x: Math.max(0, -minX + maxWidth / 2),
    y: Math.max(0, -minY + btnBounds.height + 10),
  };

  // 收集所有渲染元素
  const itemElements: JSXElement[] = [];
  const btnElements: JSXElement[] = [];
  const decorElements: JSXElement[] = [];

  nodes.forEach((node) => {
    const { items, btns, decor } = renderNode(
      node,
      levelBounds,
      btnBounds,
      offsets,
    );
    itemElements.push(...items);
    btnElements.push(...btns);
    decorElements.push(...decor);
  });

  btnElements.push(...renderSiblingBtns(nodes, btnBounds, offsets));

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

registerStructure('hierarchy-tree', {
  component: HierarchyTree,
  composites: ['title', 'item'],
});
