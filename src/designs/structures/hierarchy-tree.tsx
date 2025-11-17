import * as d3 from 'd3';
import type { ComponentType, JSXElement } from '../../jsx';
import {
  Defs,
  Ellipse,
  getElementBounds,
  Group,
  Path,
  Polygon,
} from '../../jsx';
import { Data } from '../../types';
import { getDatumByIndexes } from '../../utils';
import {
  BtnAdd,
  BtnRemove,
  BtnsGroup,
  ItemsGroup,
  ShapesGroup,
} from '../components';
import { FlexLayout } from '../layouts';
import type { HierarchyColorMode } from '../utils';
import {
  getColorPrimary,
  getHierarchyColorIndexes,
  getItemComponent,
  getPaletteColor,
  getThemeColors,
} from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface HierarchyTreeProps extends BaseStructureProps {
  /** 层级间距：父子节点之间的垂直距离，默认 80 */
  levelGap?: number;
  /** 节点间距：同级节点之间的水平距离，默认 60 */
  nodeGap?: number;

  // ========== 连接线样式配置 ==========
  /** 连接线类型：'straight' 直线 | 'curved' 曲线，默认 'curved' */
  edgeType?: 'straight' | 'curved';
  /** 连接线颜色模式：'solid' 单色 | 'gradient' 渐变色，默认 'gradient' */
  edgeColorMode?: 'solid' | 'gradient';
  /** 连接线宽度，默认 2 */
  edgeWidth?: number;
  /** 连接线样式：'solid' 实线 | 'dashed' 虚线，默认 'solid' */
  edgeStyle?: 'solid' | 'dashed';
  /** 虚线样式（仅当 edgeStyle 为 'dashed' 时生效），默认 '5,5' */
  edgeDashPattern?: string;
  /** 直线拐角圆角半径（仅当 edgeType 为 'straight' 时生效），默认 0 */
  edgeCornerRadius?: number;

  // ========== 连接线位置配置 ==========
  /** 连接线与节点的间隔距离，默认 0 */
  edgeOffset?: number;
  /** 多子节点时连接线起点模式：'center' 从父节点中心出发 | 'distributed' 从父节点底部分散出发，默认 'center' */
  edgeOrigin?: 'center' | 'distributed';
  /** 分布式起点的内边距（仅当 edgeOrigin 为 'distributed' 时生效），默认 0 */
  edgeOriginPadding?: number;

  // ========== 装饰元素配置 ==========
  /** 连接线标记类型：'none' 无标记 | 'dot' 连接点 | 'arrow' 箭头，默认 'dot' */
  edgeMarker?: 'none' | 'dot' | 'arrow';
  /** 标记大小（点的半径或箭头的大小），默认 6 */
  markerSize?: number;

  // ========== 着色模式配置 ==========
  /**
   * 节点着色模式：
   * - 'level': 按层级着色，同一层级的节点使用相同颜色
   * - 'branch': 按分支着色，根节点使用第一个颜色，二级节点及其子树使用不同颜色
   * - 'node-flat': 按节点着色，每个节点使用不同颜色
   * 默认 'node-flat'
   */
  colorMode?: HierarchyColorMode;
}

export const HierarchyTree: ComponentType<HierarchyTreeProps> = (props) => {
  const {
    Title,
    Items,
    data,
    // 布局配置
    levelGap = 80,
    nodeGap = 60,
    // 连接线样式配置
    edgeType = 'straight',
    edgeColorMode = 'gradient',
    edgeWidth = 3,
    edgeStyle = 'solid',
    edgeDashPattern = '5,5',
    edgeCornerRadius = 0,
    // 连接线位置配置
    edgeOffset = 0,
    edgeOrigin = 'center',
    edgeOriginPadding = 20,
    // 装饰元素配置
    edgeMarker = 'none',
    markerSize = 12,
    // 着色模式配置
    colorMode = 'branch',
    options,
  } = props;
  const { title, desc } = data;
  const colorPrimary = getColorPrimary(options);

  // 内置工具方法：数据预处理
  const normalizeItems = (items: Data['items']) => {
    const list = [...items];
    if (!list[0]?.children) {
      list[0] = { ...list[0], children: list.slice(1) };
      list.splice(1);
    }
    return list;
  };

  // 内置工具方法：生成圆角路径
  const createRoundedPath = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    radius: number,
  ): string => {
    const midY = y1 + (y2 - y1) / 2;
    const effectiveRadius = Math.min(
      radius,
      Math.abs(y2 - y1) / 2,
      Math.abs(x2 - x1) / 2,
    );

    if (effectiveRadius === 0) {
      return `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
    }

    return `M ${x1} ${y1}
            L ${x1} ${midY - effectiveRadius}
            Q ${x1} ${midY} ${x1 + (x2 > x1 ? effectiveRadius : -effectiveRadius)} ${midY}
            L ${x2 - (x2 > x1 ? effectiveRadius : -effectiveRadius)} ${midY}
            Q ${x2} ${midY} ${x2} ${midY + effectiveRadius}
            L ${x2} ${y2}`;
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
    gradientDefs: JSXElement[],
    allNodes: any[],
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
      deco: [] as JSXElement[],
    };

    // 计算节点颜色
    const colorIndexes = getHierarchyColorIndexes(
      {
        depth,
        originalIndexes: indexes,
        flatIndex: nodeData._flatIndex,
      },
      colorMode,
    );
    const nodeColor = getPaletteColor(options, colorIndexes);
    const nodeThemeColors = getThemeColors(
      {
        colorPrimary: nodeColor,
      },
      options,
    );

    // 节点本体
    elements.items.push(
      <NodeComponent
        indexes={indexes}
        datum={nodeData}
        data={data}
        x={nodeX}
        y={nodeY}
        positionH="center"
        themeColors={nodeThemeColors}
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

      // 计算父节点的子节点数量和当前节点在兄弟中的索引
      const siblings = allNodes.filter((n) => n.parent === parent);
      const siblingIndex = siblings.findIndex((s) => s === node);
      const siblingCount = siblings.length;

      // 计算连接线起点
      let parentX: number;
      if (edgeOrigin === 'distributed' && siblingCount > 1) {
        // 分布式起点：根据子节点数量分配起点位置
        const startX =
          parent.x + offsets.x - parentBounds.width / 2 + edgeOriginPadding;
        const endX =
          parent.x + offsets.x + parentBounds.width / 2 - edgeOriginPadding;
        const segmentWidth = (endX - startX) / siblingCount;
        parentX = startX + segmentWidth * siblingIndex + segmentWidth / 2;
      } else {
        // 中心起点：所有线从节点中心出发
        parentX = parent.x + offsets.x;
      }

      const parentY = parent.y + offsets.y + parentBounds.height + edgeOffset;
      const childX = x + offsets.x;
      let childY = y + offsets.y - edgeOffset;

      // 调整终点位置（为箭头留出空间）
      if (edgeMarker === 'arrow') {
        childY -= markerSize;
      }

      // 生成路径
      let pathD: string;
      if (edgeType === 'curved') {
        // 使用贝塞尔曲线绘制曲线连接
        const midY = parentY + (childY - parentY) / 2;
        pathD = `M ${parentX} ${parentY} C ${parentX} ${midY}, ${childX} ${midY}, ${childX} ${childY}`;
      } else if (edgeCornerRadius > 0) {
        // 使用圆角路径
        pathD = createRoundedPath(
          parentX,
          parentY,
          childX,
          childY,
          edgeCornerRadius,
        );
      } else {
        // 使用直角折线
        const midY = parentY + (childY - parentY) / 2;
        pathD = `M ${parentX} ${parentY} L ${parentX} ${midY} L ${childX} ${midY} L ${childX} ${childY}`;
      }

      // 确定连接线颜色
      let strokeColor = colorPrimary;
      if (edgeColorMode === 'gradient') {
        // 使用渐变色
        const parentColorIndexes = getHierarchyColorIndexes(
          {
            depth: parent.depth,
            originalIndexes: parent.data._originalIndex,
            flatIndex: parent.data._flatIndex,
          },
          colorMode,
        );
        const childColorIndexes = getHierarchyColorIndexes(
          {
            depth,
            originalIndexes: indexes,
            flatIndex: nodeData._flatIndex,
          },
          colorMode,
        );
        const parentColor = getPaletteColor(options, parentColorIndexes);
        const childColor = getPaletteColor(options, childColorIndexes);
        const gradientId = `gradient-${parent.data._originalIndex.join('-')}-${indexes.join('-')}`;

        gradientDefs.push(
          <linearGradient
            id={gradientId}
            x1={parentX}
            y1={parentY}
            x2={childX}
            y2={childY}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={parentColor} />
            <stop offset="100%" stopColor={childColor} />
          </linearGradient>,
        );
        strokeColor = `url(#${gradientId})`;
      }
      // 确定虚线样式
      const dashArray = edgeStyle === 'dashed' ? edgeDashPattern : '';

      // 绘制连接线
      elements.deco.push(
        <Path
          d={pathD}
          stroke={strokeColor}
          strokeWidth={edgeWidth}
          strokeDasharray={dashArray}
          fill="none"
        />,
      );

      // 添加箭头
      if (edgeMarker === 'arrow') {
        const arrowColor =
          edgeColorMode === 'gradient'
            ? getPaletteColor(options, colorIndexes)
            : getColorPrimary(options);

        // 三角形箭头
        const arrowPoints = [
          { x: childX, y: y + offsets.y - edgeOffset },
          {
            x: childX - markerSize / 2,
            y: y + offsets.y - edgeOffset - markerSize,
          },
          {
            x: childX + markerSize / 2,
            y: y + offsets.y - edgeOffset - markerSize,
          },
        ];

        elements.deco.push(
          <Polygon
            points={arrowPoints}
            fill={arrowColor}
            width={markerSize}
            height={markerSize}
          />,
        );
      }

      // 添加连接点装饰
      if (edgeMarker === 'dot') {
        const parentColorIndexes = getHierarchyColorIndexes(
          {
            depth: parent.depth,
            originalIndexes: parent.data._originalIndex,
            flatIndex: parent.data._flatIndex,
          },
          colorMode,
        );
        const parentDotColor =
          edgeColorMode === 'gradient'
            ? getPaletteColor(options, parentColorIndexes)
            : getColorPrimary(options);

        // 父节点连接点
        elements.deco.push(
          <Ellipse
            x={parentX - markerSize}
            y={
              parent.y +
              offsets.y +
              parentBounds.height +
              edgeOffset -
              markerSize
            }
            width={markerSize * 2}
            height={markerSize * 2}
            fill={parentDotColor}
          />,
        );
        // 子节点连接点
        const childDotColor =
          edgeColorMode === 'gradient'
            ? getPaletteColor(options, colorIndexes)
            : getColorPrimary(options);

        elements.deco.push(
          <Ellipse
            x={childX - markerSize}
            y={y + offsets.y - edgeOffset - markerSize}
            width={markerSize * 2}
            height={markerSize * 2}
            fill={childDotColor}
          />,
        );
      }
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
  const decoElements: JSXElement[] = [];
  const gradientDefs: JSXElement[] = [];

  // 为 node-flat 模式添加扁平索引
  nodes.forEach((node, index) => {
    // 将扁平索引附加到节点数据上，用于 node-flat 模式
    node.data._flatIndex = index;
  });

  nodes.forEach((node) => {
    const { items, btns, deco } = renderNode(
      node,
      levelBounds,
      btnBounds,
      offsets,
      gradientDefs,
      nodes,
    );
    itemElements.push(...items);
    btnElements.push(...btns);
    decoElements.push(...deco);
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
        {gradientDefs.length > 0 && <Defs>{gradientDefs}</Defs>}
        <ShapesGroup>{decoElements}</ShapesGroup>
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
