import type { ComponentType, JSXElement } from '../../jsx';
import { Defs, Ellipse, getElementBounds, Group, Rect } from '../../jsx';
import { ItemsGroup, ShapesGroup } from '../components';
import { LinearGradient } from '../defs';
import { FlexLayout } from '../layouts';
import { getPaletteColor } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface CompareHierarchyLeftRightProps extends BaseStructureProps {
  /** 同侧数据项上下间隔 */
  gap?: number;
  /** 左右两侧间隔 */
  groupGap?: number;
  /** 子节点是否环绕根节点 */
  surround?: boolean;
  /** 数据项指示器样式 */
  decoration?: 'none' | 'dot-line' | 'arc-dot' | 'split-line';
  /** 是否翻转根节点 */
  flipRoot?: boolean;
  /** 是否翻转叶子节点 */
  flipLeaf?: boolean;
}

const decorationWidthMap = {
  none: 5,
  'dot-line': 100,
  'arc-dot': 20,
  'split-line': 5,
};

export const CompareHierarchyLeftRight: ComponentType<
  CompareHierarchyLeftRightProps
> = (props) => {
  const {
    Title,
    Items,
    data,
    gap = 20,
    groupGap = 0,
    decoration = 'none',
    surround = true,
    flipRoot = false,
    flipLeaf = false,
    options,
  } = props;
  const [RootItem, Item] = Items;
  const { title, desc, items = [] } = data;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  const rootItemContent = (
    <RootItem
      indexes={[0]}
      data={data}
      datum={data.items[0]}
      themeColors={{} as any}
    />
  );
  const itemContent = (
    <Item
      indexes={[0, 0]}
      data={data}
      datum={items[0]?.children?.[0] || items[2]}
    />
  );

  const rootItemBounds = getElementBounds(rootItemContent);
  const itemBounds = getElementBounds(itemContent);

  const itemElements: JSXElement[] = [];
  const decoElements: JSXElement[] = [];

  const [leftRoot, rightRoot] = items;
  const leftItems = leftRoot?.children || [];
  const rightItems = rightRoot?.children || [];

  const totalHeight = Math.max(
    rootItemBounds.height,
    leftItems.length * (itemBounds.height + gap) - gap,
    rightItems.length * (itemBounds.height + gap) - gap,
  );

  const decorationWidth = decorationWidthMap[decoration] || 0;
  // create root items
  const leftRootX = itemBounds.width + decorationWidth;
  const rightRootX = leftRootX + rootItemBounds.width + groupGap;
  const rootY = (totalHeight - rootItemBounds.height) / 2;
  if (leftRoot) {
    itemElements.push(
      <RootItem
        indexes={[0]}
        x={leftRootX}
        y={rootY}
        data={data}
        datum={leftRoot}
        positionH={flipRoot ? 'normal' : 'flipped'}
      />,
    );
  }
  if (rightRoot) {
    itemElements.push(
      <RootItem
        indexes={[1]}
        x={rightRootX}
        y={rootY}
        data={data}
        datum={rightRoot}
        positionH={flipRoot ? 'flipped' : 'normal'}
      />,
    );
  }

  const addDecoElement = (
    side: 'left' | 'right',
    pos: [number, number],
    indexes: number[],
  ) => {
    if (decoration === 'none') return;
    const [x, y] = pos;

    const currentColor = getPaletteColor(options, indexes);
    const props: DecorationProps = {
      x,
      y,
      width: itemBounds.width,
      height: itemBounds.height,
      side,
      color: currentColor || '#ccc',
      colorBg: options.themeConfig.colorBg || '#fff',
    };
    if (decoration === 'split-line') {
      decoElements.push(<SplitLine {...props} />);
    } else if (decoration === 'dot-line') {
      decoElements.push(<DotLine {...props} />);
    }
  };

  if (surround) {
    const diameter = 2 * rootItemBounds.width + groupGap + itemBounds.width;
    const radius = diameter / 2 + decorationWidth;

    const circleCenterX = leftRootX + rootItemBounds.width + groupGap / 2;
    const circleCenterY = rootY + rootItemBounds.height / 2;

    leftItems.forEach((item, index) => {
      const leftItemsHeight =
        leftItems.length * (itemBounds.height + gap) - gap;
      const leftStartY = (totalHeight - leftItemsHeight) / 2;
      const itemY = leftStartY + index * (itemBounds.height + gap);

      const itemCenterY = itemY + itemBounds.height / 2;
      const dy = itemCenterY - circleCenterY;

      const dxSq = Math.max(0, radius * radius - dy * dy);
      const xCenter = circleCenterX - Math.sqrt(dxSq);
      const leftX = xCenter - itemBounds.width / 2;

      itemElements.push(
        <Item
          indexes={[0, index]}
          datum={item}
          data={data}
          x={leftX}
          y={itemY}
          positionH={flipLeaf ? 'flipped' : 'normal'}
        />,
      );
      addDecoElement('left', [leftX, itemY], [0, index]);
    });

    rightItems.forEach((item, index) => {
      const rightItemsHeight =
        rightItems.length * (itemBounds.height + gap) - gap;
      const rightStartY = (totalHeight - rightItemsHeight) / 2;
      const itemY = rightStartY + index * (itemBounds.height + gap);

      const itemCenterY = itemY + itemBounds.height / 2;
      const dy = itemCenterY - circleCenterY;

      const dxSq = Math.max(0, radius * radius - dy * dy);
      const xCenter = circleCenterX + Math.sqrt(dxSq);
      const rightX = xCenter - itemBounds.width / 2;

      itemElements.push(
        <Item
          indexes={[1, index]}
          datum={item}
          data={data}
          x={rightX}
          y={itemY}
          positionH={flipLeaf ? 'normal' : 'flipped'}
        />,
      );
      addDecoElement('right', [rightX, itemY], [1, index]);
    });
  } else {
    // create left items
    leftItems.forEach((item, index) => {
      const leftItemsHeight =
        leftItems.length * (itemBounds.height + gap) - gap;
      const leftStartY = (totalHeight - leftItemsHeight) / 2;
      const itemY = leftStartY + index * (itemBounds.height + gap);
      const indexes = [0, index];
      const leftX = 0;
      itemElements.push(
        <Item
          indexes={indexes}
          datum={item}
          data={data}
          x={leftX}
          y={itemY}
          positionH={flipLeaf ? 'flipped' : 'normal'}
        />,
      );
      addDecoElement('left', [leftX, itemY], indexes);
    });

    // create right items
    rightItems.forEach((item, index) => {
      const rightItemsHeight =
        rightItems.length * (itemBounds.height + gap) - gap;
      const rightStartY = (totalHeight - rightItemsHeight) / 2;
      const itemY = rightStartY + index * (itemBounds.height + gap);
      const indexes = [1, index];
      const rightX = rightRootX + rootItemBounds.width + decorationWidth;
      itemElements.push(
        <Item
          indexes={indexes}
          datum={item}
          data={data}
          x={rightX}
          y={itemY}
          positionH={flipLeaf ? 'normal' : 'flipped'}
        />,
      );
      addDecoElement('right', [rightX, itemY], indexes);
    });
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
        <Group width={0} height={0}>
          {decoElements}
        </Group>
      </Group>
    </FlexLayout>
  );
};

interface DecorationProps {
  x: number;
  y: number;
  side: 'left' | 'right';
  width: number;
  height: number;
  color: string;
  colorBg: string;
}

const SplitLine = (props: DecorationProps) => {
  const { x, y, width, height, color, colorBg, side } = props;
  const lineY = y + height;
  const linearGradientId = `split-line-linear-gradient-${side}`;

  return (
    <>
      <Defs>
        <LinearGradient
          id={linearGradientId}
          startColor={color}
          stopColor={colorBg}
          direction={side === 'left' ? 'left-right' : 'right-left'}
        />
      </Defs>
      <Rect
        x={x}
        y={lineY}
        width={width}
        height={1}
        fill={`url(#${linearGradientId})`}
      />
    </>
  );
};

const DotLine = (props: DecorationProps) => {
  const { x, y, side, width, height, color, colorBg } = props;
  const radius = 6;
  const innerRadius = radius / 3;
  const d = radius * 2;
  const innerD = innerRadius * 2;

  const gap = 5;

  const cx = side === 'left' ? x + width + radius + gap : x - radius - gap;
  const cy = y + height / 2;

  const innerX = cx - innerRadius;
  const innerY = cy - innerRadius;

  const lineLength = 80;
  const dx = side === 'left' ? lineLength : -lineLength;

  const linearGradientId = `dot-line-linear-gradient-${side}`;

  return (
    <Group>
      <Defs>
        <LinearGradient
          id={linearGradientId}
          startColor={color}
          stopColor={colorBg}
          direction={side === 'left' ? 'left-right' : 'right-left'}
        />
      </Defs>
      <ShapesGroup>
        <Ellipse
          x={cx - radius}
          y={cy - radius}
          width={d}
          height={d}
          fill="none"
          strokeWidth={1}
          stroke={color}
        />
        <Ellipse
          x={innerX}
          y={innerY}
          width={innerD}
          height={innerD}
          fill={color}
        />
      </ShapesGroup>

      <Rect
        x={side === 'left' ? cx : cx + dx}
        y={cy - 0.5}
        width={lineLength}
        height={1}
        fill={`url(#${linearGradientId})`}
      />
    </Group>
  );
};

registerStructure('compare-hierarchy-left-right', {
  component: CompareHierarchyLeftRight,
  composites: ['title', 'item'],
});
