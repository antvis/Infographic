import type { HierarchyData, HierarchyNode } from '@antv/hierarchy';
import { mindmap } from '@antv/hierarchy';
import type { ComponentType, JSXElement } from '../../jsx';
import { Defs, Group, Path, getElementBounds } from '../../jsx';
import type { ItemDatum } from '../../types';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
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

type AnnotatedItem = (ItemDatum & HierarchyData) & {
  _indexes: number[];
  _flatIndex?: number;
  children?: AnnotatedItem[];
};

type LayoutNode = HierarchyNode & {
  data: AnnotatedItem;
  children: LayoutNode[];
  parent?: LayoutNode;
};

type LayoutLink = {
  parent: LayoutNode;
  child: LayoutNode;
};

type EdgeAlign = 'top' | 'center' | 'bottom' | number;
type EdgeType = 'curved' | 'straight';
type EdgeColorMode = 'solid' | 'gradient';

export interface HierarchyMindmapProps extends BaseStructureProps {
  /** 水平层级间距 */
  levelGap?: number;
  /** 垂直节点间距 */
  nodeGap?: number;
  /** 连线在节点上的垂直对齐方式；字符串为固定位置，数字为 0-1 比例 */
  edgeAlign?: EdgeAlign;
  /** 节点/连线着色模式 */
  colorMode?: HierarchyColorMode;
  /** 连线颜色模式 */
  edgeColorMode?: EdgeColorMode;
  /** 连线类型：曲线或直线 */
  edgeType?: EdgeType;
  /** 连线宽度 */
  edgeWidth?: number;
}

const DEFAULT_LEVEL_GAP = 60;
const DEFAULT_NODE_GAP = 14;
const LAYOUT_PADDING = 30;
const DEFAULT_EDGE_ALIGN: EdgeAlign = 'center';
const DEFAULT_EDGE_TYPE: EdgeType = 'curved';
const DEFAULT_EDGE_WIDTH = 2;
const DEFAULT_COLOR_MODE: HierarchyColorMode = 'node';
const DEFAULT_EDGE_COLOR_MODE: EdgeColorMode = 'solid';

const annotateTree = (
  node: ItemDatum & HierarchyData,
  parentIndexes: number[] = [],
  index = 0,
): AnnotatedItem => {
  const indexes = [...parentIndexes, index];
  return {
    ...node,
    _indexes: indexes,
    children:
      node.children?.map((child, childIndex) =>
        annotateTree(child, indexes, childIndex),
      ) ?? [],
  };
};

const collectNodes = (
  node: LayoutNode,
  nodes: LayoutNode[],
  links: LayoutLink[],
  parent?: LayoutNode,
) => {
  nodes.push(node);
  node.data._flatIndex ??= nodes.length - 1;
  if (parent) links.push({ parent, child: node });
  const children = node.children as unknown as LayoutNode[];
  children?.forEach((child) => collectNodes(child, nodes, links, node));
};

const createCurvePath = (sx: number, sy: number, tx: number, ty: number) => {
  const offsetX = Math.abs(tx - sx) / 2;
  const ctrlX1 = tx > sx ? sx + offsetX : sx - offsetX;
  const ctrlX2 = tx > sx ? tx - offsetX : tx + offsetX;
  return `M ${sx} ${sy} C ${ctrlX1} ${sy} ${ctrlX2} ${ty} ${tx} ${ty}`;
};

const createStraightPath = (sx: number, sy: number, tx: number, ty: number) =>
  `M ${sx} ${sy} L ${tx} ${ty}`;

const getEdgeAnchors = (
  parentLayout: { x: number; y: number; width: number; height: number },
  childLayout: { x: number; y: number; width: number; height: number },
  childSide?: 'left' | 'right',
  align: EdgeAlign = DEFAULT_EDGE_ALIGN,
) => {
  const clampRatio = (val: number) => Math.max(0, Math.min(1, val));
  const toRatio = (value: EdgeAlign) => {
    if (value === 'top') return 0;
    if (value === 'bottom') return 1;
    if (value === 'center') return 0.5;
    return clampRatio(value);
  };
  const ratio = toRatio(align);
  const parentCy = parentLayout.y + parentLayout.height * ratio;
  const childCy = childLayout.y + childLayout.height * ratio;
  if (childSide === 'left') {
    return {
      sx: parentLayout.x,
      sy: parentCy,
      tx: childLayout.x + childLayout.width,
      ty: childCy,
    };
  }
  return {
    sx: parentLayout.x + parentLayout.width,
    sy: parentCy,
    tx: childLayout.x,
    ty: childCy,
  };
};

export const HierarchyMindmap: ComponentType<HierarchyMindmapProps> = (
  props,
) => {
  const {
    Title,
    Items,
    data,
    levelGap = DEFAULT_LEVEL_GAP,
    nodeGap = DEFAULT_NODE_GAP,
    edgeAlign = DEFAULT_EDGE_ALIGN,
    colorMode = DEFAULT_COLOR_MODE,
    edgeColorMode = DEFAULT_EDGE_COLOR_MODE,
    edgeType = DEFAULT_EDGE_TYPE,
    edgeWidth = DEFAULT_EDGE_WIDTH,
    options,
  } = props;
  const { title, desc, items = [] } = data;
  const titleContent = Title ? <Title title={title} desc={desc} /> : null;
  const colorPrimary = getColorPrimary(options);
  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);
  const groupColorIndexMap = new Map<string, number>();
  let nextGroupColorIndex = 0;

  if (!items.length || !Items?.length) {
    return (
      <FlexLayout
        id="infographic-container"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {titleContent}
        <Group>
          <BtnAdd indexes={[0]} x={0} y={0} />
        </Group>
      </FlexLayout>
    );
  }

  const root = annotateTree(items[0]);
  const nodeSizeCache = new WeakMap<
    AnnotatedItem,
    { width: number; height: number }
  >();
  const colorCache = new WeakMap<AnnotatedItem, string>();
  const themeCache = new WeakMap<AnnotatedItem, any>();

  const getNodeColorIndexes = (datum: AnnotatedItem, depth: number) => {
    if (colorMode === 'group') {
      const groupKey = String((datum as { group?: unknown }).group ?? '');
      let groupIndex = groupColorIndexMap.get(groupKey);
      if (groupIndex == null) {
        groupIndex = nextGroupColorIndex;
        groupColorIndexMap.set(groupKey, groupIndex);
        nextGroupColorIndex += 1;
      }
      return [groupIndex];
    }
    return getHierarchyColorIndexes(
      {
        depth,
        originalIndexes: datum._indexes,
        flatIndex: datum._flatIndex,
      },
      colorMode,
    );
  };

  const getNodeThemeColors = (datum: AnnotatedItem, depth: number) => {
    const cachedTheme = themeCache.get(datum);
    if (cachedTheme) return cachedTheme;
    const colorIndexes = getNodeColorIndexes(datum, depth);
    const primary = getPaletteColor(options, colorIndexes);
    const themeColors = getThemeColors({ colorPrimary: primary }, options);
    themeCache.set(datum, themeColors);
    colorCache.set(datum, primary!);
    return themeColors;
  };
  const measureNode = (
    datum: AnnotatedItem,
  ): { width: number; height: number } => {
    const cached = nodeSizeCache.get(datum);
    if (cached) return cached;
    const depth = Math.max(datum._indexes.length - 1, 0);
    const Component = getItemComponent(Items, depth);
    const bounds = getElementBounds(
      <Component
        indexes={datum._indexes}
        data={data}
        datum={datum}
        positionH="center"
        positionV="middle"
        themeColors={getNodeThemeColors(datum, depth)}
      />,
    );
    nodeSizeCache.set(datum, bounds);
    return bounds;
  };

  const mindmapRoot = mindmap(root, {
    direction: 'H',
    getSide: (node: HierarchyNode, index: number) => {
      if (!node.parent) return 'right';
      const order = (node.parent.children || []).indexOf(node);
      const rank = order >= 0 ? order : index;
      return rank % 2 === 0 ? 'left' : 'right';
    },
    getWidth: (datum: AnnotatedItem) => measureNode(datum).width,
    getHeight: (datum: AnnotatedItem) => measureNode(datum).height,
    getHGap: () => levelGap,
    getVGap: () => nodeGap,
  }) as LayoutNode;

  const layoutNodes: LayoutNode[] = [];
  const nodeLinks: LayoutLink[] = [];
  collectNodes(mindmapRoot, layoutNodes, nodeLinks);

  const minX =
    layoutNodes.length > 0 ? Math.min(...layoutNodes.map((node) => node.x)) : 0;
  const minY =
    layoutNodes.length > 0 ? Math.min(...layoutNodes.map((node) => node.y)) : 0;
  const shiftX = LAYOUT_PADDING - minX;
  const shiftY = LAYOUT_PADDING - minY;

  const defsElements: JSXElement[] = [];
  const decorElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];
  const btnElements: JSXElement[] = [];
  const layoutStore = new WeakMap<
    LayoutNode,
    {
      x: number;
      y: number;
      width: number;
      height: number;
      centerX: number;
      centerY: number;
    }
  >();

  layoutNodes.forEach((node) => {
    const datum = node.data;
    const measured = measureNode(datum);
    const displayX = node.x + shiftX + (node.hgap ?? 0);
    const displayY = node.y + shiftY + (node.vgap ?? 0);
    const Component = getItemComponent(Items, node.depth);
    const positionH =
      node.depth === 0 ? 'center' : node.side === 'left' ? 'flipped' : 'normal';
    const themeColors = getNodeThemeColors(datum, node.depth);

    itemElements.push(
      <Component
        indexes={datum._indexes}
        data={data}
        datum={datum}
        x={displayX}
        y={displayY}
        positionH={positionH}
        positionV="middle"
        themeColors={themeColors}
      />,
    );

    layoutStore.set(node, {
      x: displayX,
      y: displayY,
      width: measured.width,
      height: measured.height,
      centerX: displayX + measured.width / 2,
      centerY: displayY + measured.height / 2,
    });
  });

  nodeLinks.forEach((link) => {
    const { parent, child } = link;
    const childLayout = layoutStore.get(child);
    const parentLayout = layoutStore.get(parent);
    if (!childLayout || !parentLayout) {
      return;
    }
    const childDatum = child.data;
    const { sx, sy, tx, ty } = getEdgeAnchors(
      parentLayout,
      childLayout,
      child.side,
      edgeAlign,
    );
    const childColor =
      colorCache.get(childDatum) ??
      getPaletteColor(options, getNodeColorIndexes(childDatum, child.depth));
    const parentColor =
      colorCache.get(parent.data) ??
      getPaletteColor(options, getNodeColorIndexes(parent.data, parent.depth));
    const pathD =
      edgeType === 'straight'
        ? createStraightPath(sx, sy, tx, ty)
        : createCurvePath(sx, sy, tx, ty);
    const gradientId = `edge-gradient-${childDatum._indexes.join('-')}`;
    decorElements.push(
      <Path
        d={pathD}
        stroke={
          edgeColorMode === 'gradient'
            ? `url(#${gradientId})`
            : (childColor ?? colorPrimary)
        }
        strokeWidth={edgeWidth}
        fill="none"
      />,
    );
    if (edgeColorMode === 'gradient') {
      defsElements.push(
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={sx}
          y1={sy}
          x2={tx}
          y2={ty}
        >
          <stop offset="0%" stopColor={parentColor ?? colorPrimary} />
          <stop offset="100%" stopColor={childColor ?? colorPrimary} />
        </linearGradient>,
      );
    }
    const appendIndex = childDatum.children?.length ?? 0;
    const addIndexes = [...childDatum._indexes, appendIndex];
    const btnX = childLayout.x + (childLayout.width - btnBounds.width) / 2;
    const removeY = childLayout.y + childLayout.height + 8;
    const addY = removeY + btnBounds.height + 6;

    if (child.depth > 0) {
      btnElements.push(
        <BtnRemove indexes={childDatum._indexes} x={btnX} y={removeY} />,
      );
    }
    btnElements.push(<BtnAdd indexes={addIndexes} x={btnX} y={addY} />);
  });

  const rootLayout = layoutStore.get(mindmapRoot);
  if (rootLayout) {
    const rootDatum = mindmapRoot.data;
    const appendIndex = rootDatum.children?.length ?? 0;
    const addIndexes = [...rootDatum._indexes, appendIndex];
    const btnX = rootLayout.x + (rootLayout.width - btnBounds.width) / 2;
    const addY = rootLayout.y + rootLayout.height + 8 + btnBounds.height + 6;
    btnElements.push(<BtnAdd indexes={addIndexes} x={btnX} y={addY} />);
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
        {defsElements.length > 0 ? <Defs>{defsElements}</Defs> : null}
        <Group>{decorElements}</Group>
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup>{btnElements}</BtnsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('hierarchy-mindmap', {
  component: HierarchyMindmap,
  composites: ['title', 'item'],
});
