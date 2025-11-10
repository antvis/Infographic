/** @jsxImportSource @antv/infographic-jsx */
import type { ComponentType, JSXElement } from '@antv/infographic-jsx';
import {
  Defs,
  Ellipse,
  getElementBounds,
  Group,
  Path,
} from '@antv/infographic-jsx';
import {
  BtnAdd,
  BtnRemove,
  BtnsGroup,
  ItemIcon,
  ItemsGroup,
} from '../components';
import { FlexLayout } from '../layouts';
import { getColorPrimary, getPaletteColor, getThemeColors } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

import * as d3 from 'd3';

const ITEM_DISTANCE = 46;
const LINE_GAP = 5;

export interface SequenceCircleArrowsProps extends BaseStructureProps {
  radius?: number;
  arrowSize?: number;
  strokeWidth?: number;
}

export const SequenceCircleArrows: ComponentType<SequenceCircleArrowsProps> = (
  props,
) => {
  const {
    Title,
    Item,
    data,
    options,
    radius = 200,
    arrowSize = 4,
    strokeWidth = 10,
  } = props;
  const { title, desc, items = [] } = data;

  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);
  const colorPrimary = getColorPrimary(options);

  if (!Item) {
    const titleContent = Title ? <Title title={title} desc={desc} /> : null;
    return (
      <FlexLayout
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {titleContent}
        <Group>
          <BtnsGroup>
            <BtnAdd indexes={[0]} x={0} y={0} />
          </BtnsGroup>
        </Group>
      </FlexLayout>
    );
  }

  const count = items.length;

  if (count === 0) {
    const titleContent = Title ? <Title title={title} desc={desc} /> : null;
    return (
      <FlexLayout
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {titleContent}
        <Group>
          <BtnsGroup>
            <BtnAdd indexes={[0]} x={0} y={0} />
          </BtnsGroup>
        </Group>
      </FlexLayout>
    );
  }

  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} />,
  );

  const centerX = 0;
  const centerY = 0;
  const angleStep = (2 * Math.PI) / count;

  const positions: { x: number; y: number }[] = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (let i = 0; i < count; i++) {
    const angle = i * angleStep - Math.PI / 2 - angleStep;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    positions.push({ x, y });

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  for (let i = 0; i < count; i++) {
    const startPos = positions[i];
    const endPos = positions[(i + 1) % count];

    const lineLength = Math.sqrt(
      Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2),
    );
    const CIRCLE_BIG_W = Math.min(lineLength * 0.5, 100);

    const midX = (startPos.x + endPos.x) / 2;
    const midY = (startPos.y + endPos.y) / 2;

    minX = Math.min(minX, midX - CIRCLE_BIG_W / 2);
    minY = Math.min(minY, midY - CIRCLE_BIG_W / 2);
    maxX = Math.max(maxX, midX + CIRCLE_BIG_W / 2);
    maxY = Math.max(maxY, midY + CIRCLE_BIG_W / 2);

    let itemX: number;
    let itemY: number;

    // 计算连线相对于中心的方向
    const deltaX = midX - centerX;
    const deltaY = midY - centerY;

    // 判断连线主要在哪个方向
    if (Math.abs(midY - startPos.y) < 10) {
      // 垂直方向为主
      if (deltaY > 0) {
        // 下方连线，Item 放在下方
        itemX = midX - itemBounds.width / 2;
        itemY = midY + CIRCLE_BIG_W / 2 + ITEM_DISTANCE;
      } else {
        // 上方连线，Item 放在上方
        itemX = midX - itemBounds.width / 2;
        itemY = midY - CIRCLE_BIG_W / 2 - ITEM_DISTANCE - itemBounds.height;
      }
    } else {
      // 水平方向为主
      if (deltaX > 0) {
        // 右侧连线，Item 放在右侧
        itemX = midX + CIRCLE_BIG_W / 2 + ITEM_DISTANCE;
        itemY = midY - itemBounds.height / 2;
      } else {
        // 左侧连线，Item 放在左侧
        itemX = midX - CIRCLE_BIG_W / 2 - ITEM_DISTANCE - itemBounds.width;
        itemY = midY - itemBounds.height / 2;
      }
    }

    minX = Math.min(minX, itemX);
    minY = Math.min(minY, itemY);
    maxX = Math.max(maxX, itemX + itemBounds.width + btnBounds.width + 5);
    maxY = Math.max(maxY, itemY + itemBounds.height);
  }

  const offsetX = Math.max(0, -minX);
  const offsetY = Math.max(0, -minY);

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;
  const btnElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];
  const decorElements: JSXElement[] = [];
  const defsElements: JSXElement[] = [];

  const itemPositions: { x: number; y: number }[] = positions.map((pos) => ({
    x: pos.x + offsetX,
    y: pos.y + offsetY,
  }));

  for (let i = 0; i < count; i++) {
    const startPos = itemPositions[i];
    const endPos = itemPositions[(i + 1) % count];
    const nextIndex = (i + 1) % count;
    const indexes = [i];

    const lineLength = Math.sqrt(
      Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2),
    );
    const CIRCLE_BIG_W = Math.min(lineLength * 0.5, 100);
    const CIRCLE_SMALL_W = Math.max(CIRCLE_BIG_W - 20, 20);
    const ICON_SIZE = Math.max(CIRCLE_SMALL_W * 0.4, 16);

    const color = getPaletteColor(options, indexes) || colorPrimary;

    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / length;
    const unitY = dy / length;

    const minLineLength = LINE_GAP * 2 + arrowSize;
    const actualGap = Math.min(LINE_GAP, (length - minLineLength) / 2);

    const adjustedStartX = Math.max(0, startPos.x + unitX * actualGap);
    const adjustedStartY = Math.max(0, startPos.y + unitY * actualGap);
    const adjustedEndX = Math.max(0, endPos.x - unitX * actualGap);
    const adjustedEndY = Math.max(0, endPos.y - unitY * actualGap);

    const line = d3
      .line<{ x: number; y: number }>()
      .x((d) => Math.max(0, d.x))
      .y((d) => Math.max(0, d.y))
      .curve(d3.curveLinear);

    const pathD =
      line([
        { x: adjustedStartX, y: adjustedStartY },
        { x: adjustedEndX, y: adjustedEndY },
      ]) || '';

    const colorClean = color.replace(/[^a-zA-Z0-9]/g, '');
    const arrowId = `fork-arrow-${colorClean}-${i}`;

    const forkArrowPath = `
      M ${-arrowSize * 0.6} ${-arrowSize * 0.4} 
      L 0 0 
      L ${-arrowSize * 0.6} ${arrowSize * 0.4}
    `;

    defsElements.push(
      <marker
        id={arrowId}
        viewBox={`${-arrowSize} ${-arrowSize * 0.6} ${arrowSize * 1.2} ${arrowSize * 1.2}`}
        refX={-arrowSize * 0.08}
        refY={0}
        markerWidth={arrowSize}
        markerHeight={arrowSize}
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path
          d={forkArrowPath}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </marker>,
    );

    decorElements.push(
      <Path
        d={pathD}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        markerEnd={`url(#${arrowId})`}
        strokeLinecap="round"
      />,
    );

    const midX = (startPos.x + endPos.x) / 2;
    const midY = (startPos.y + endPos.y) / 2;

    const themeColors = getThemeColors(
      {
        colorPrimary: color || colorPrimary,
      },
      options,
    );

    decorElements.push(
      <Ellipse
        x={Math.max(0, midX - CIRCLE_BIG_W / 2)}
        y={Math.max(0, midY - CIRCLE_BIG_W / 2)}
        width={CIRCLE_BIG_W}
        height={CIRCLE_BIG_W}
        fill={themeColors.colorPrimaryBg}
      />,
    );

    decorElements.push(
      <Ellipse
        x={Math.max(0, midX - CIRCLE_SMALL_W / 2)}
        y={Math.max(0, midY - CIRCLE_SMALL_W / 2)}
        width={CIRCLE_SMALL_W}
        height={CIRCLE_SMALL_W}
        fill="#ffffff"
      />,
    );

    decorElements.push(
      <ItemIcon
        x={Math.max(0, midX - ICON_SIZE / 2)}
        y={Math.max(0, midY - ICON_SIZE / 2)}
        size={ICON_SIZE}
        indexes={indexes}
        fill={color}
      />,
    );

    const btnAddX = Math.max(0, midX - btnBounds.width / 2);
    const btnAddY = Math.max(0, midY - btnBounds.height / 2);

    btnElements.push(<BtnAdd indexes={[nextIndex]} x={btnAddX} y={btnAddY} />);
  }

  for (let i = 0; i < count; i++) {
    const startPos = itemPositions[i];
    const endPos = itemPositions[(i + 1) % count];
    const indexes = [i];
    const item = items[i];

    const lineLength = Math.sqrt(
      Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2),
    );
    const CIRCLE_BIG_W = Math.min(lineLength * 0.5, 100);

    const midX = (startPos.x + endPos.x) / 2;
    const midY = (startPos.y + endPos.y) / 2;

    let itemX: number;
    let itemY: number;

    const adjustedCenterX = centerX + offsetX;
    const adjustedCenterY = centerY + offsetY;

    // 计算连线相对于中心的方向
    const deltaX = midX - adjustedCenterX;
    const deltaY = midY - adjustedCenterY;

    // Y 值区别不大, 线是水平的，item 垂直显示在 上/下方
    if (Math.abs(midY - startPos.y) < 10) {
      if (deltaY > 0) {
        // 下方连线，Item 放在下方
        itemX = Math.max(0, midX - itemBounds.width / 2);
        itemY = Math.max(0, midY + CIRCLE_BIG_W / 2 + ITEM_DISTANCE);
      } else {
        // 上方连线，Item 放在上方
        itemX = Math.max(0, midX - itemBounds.width / 2);
        itemY = Math.max(
          0,
          midY - CIRCLE_BIG_W / 2 - ITEM_DISTANCE - itemBounds.height,
        );
      }
    } else {
      // 线是垂直的， item 显示在 做/右方
      if (deltaX > 0) {
        // 右侧连线，Item 放在右侧
        itemX = Math.max(0, midX + CIRCLE_BIG_W / 2 + ITEM_DISTANCE);
        itemY = Math.max(0, midY - itemBounds.height / 2);
      } else {
        // 左侧连线，Item 放在左侧
        itemX = Math.max(
          0,
          midX - CIRCLE_BIG_W / 2 - ITEM_DISTANCE - itemBounds.width,
        );
        itemY = Math.max(0, midY - itemBounds.height / 2);
      }
    }

    itemElements.push(
      <Item indexes={indexes} datum={item} data={data} x={itemX} y={itemY} />,
    );

    const btnRemoveX = Math.max(0, itemX + itemBounds.width + 5);
    const btnRemoveY = Math.max(
      0,
      itemY + itemBounds.height / 2 - btnBounds.height / 2,
    );

    btnElements.push(
      <BtnRemove indexes={indexes} x={btnRemoveX} y={btnRemoveY} />,
    );
  }

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={30}
    >
      {titleContent}
      <Group x={0} y={0}>
        <Defs>{defsElements}</Defs>
        <Group>{decorElements}</Group>
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup>{btnElements}</BtnsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('sequence-circle-arrows', {
  component: SequenceCircleArrows,
  composites: ['title', 'item'],
});
