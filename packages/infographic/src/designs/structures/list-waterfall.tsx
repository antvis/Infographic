/** @jsxImportSource @antv/infographic-jsx */
import type { ComponentType, JSXElement } from '@antv/infographic-jsx';
import { Ellipse, getElementBounds, Group, Path } from '@antv/infographic-jsx';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface ListWaterfallProps extends BaseStructureProps {
  columns?: number;
  gap?: number;
  offsetRange?: number;
}

export const ListWaterfall: ComponentType<ListWaterfallProps> = (props) => {
  const { Title, Item, data, columns = 3, gap = 20, offsetRange = 50 } = props;
  const { title, desc, items = [] } = data;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);
  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} positionH="center" />,
  );

  const btnElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];
  const decorElements: JSXElement[] = [];

  const colWidth = itemBounds.width + gap;
  const columnHeights: number[] = new Array(columns).fill(0);
  const itemPositions: Array<{ x: number; y: number; col: number }> = [];

  items.forEach((item, index) => {
    const shortestCol = columnHeights.indexOf(Math.min(...columnHeights));
    const itemX = shortestCol * colWidth;
    const itemY = columnHeights[shortestCol];

    const heightVariation = ((index * 17) % 37) * (offsetRange / 37);
    const finalY = itemY + (index > 0 ? heightVariation : 0);

    const indexes = [index];

    itemPositions.push({ x: itemX, y: finalY, col: shortestCol });

    itemElements.push(
      <Item
        indexes={indexes}
        datum={item}
        data={data}
        x={itemX}
        y={finalY}
        positionH="center"
      />,
    );

    // Remove button - positioned directly below item center
    btnElements.push(
      <BtnRemove
        indexes={indexes}
        x={itemX + (itemBounds.width - btnBounds.width) / 2}
        y={finalY + itemBounds.height}
      />,
    );

    columnHeights[shortestCol] = finalY + itemBounds.height + gap;
  });

  // Add buttons logic - avoid duplicates
  if (items.length > 0) {
    // Add button before first item
    if (itemPositions.length > 0) {
      const firstPos = itemPositions[0];
      btnElements.push(
        <BtnAdd
          indexes={[0]}
          x={firstPos.x - gap / 2 - btnBounds.width / 2}
          y={firstPos.y + (itemBounds.height - btnBounds.height) / 2}
        />,
      );
    }

    // Add buttons between items and at the end
    itemPositions.forEach((pos, index) => {
      btnElements.push(
        <BtnAdd
          indexes={[index + 1]}
          x={pos.x + itemBounds.width + gap / 2 - btnBounds.width / 2}
          y={pos.y + (itemBounds.height - btnBounds.height) / 2}
        />,
      );
    });
  }

  // 添加流动的装饰元素
  itemPositions.forEach((pos, index) => {
    if (index > 0) {
      const prevPositions = itemPositions.slice(0, index);
      const sameColPrev = prevPositions.filter((p) => p.col === pos.col).pop();

      if (sameColPrev) {
        // 同列的连接线
        const startX = sameColPrev.x + itemBounds.width / 2;
        const startY = sameColPrev.y + itemBounds.height;
        const endX = pos.x + itemBounds.width / 2;
        const endY = pos.y;

        const controlY = startY + (endY - startY) / 2;
        const curvePath = `M ${startX} ${startY} Q ${startX} ${controlY} ${endX} ${endY}`;

        decorElements.push(
          <Path
            d={curvePath}
            stroke="#e0e0e0"
            strokeWidth={2}
            strokeDasharray="3,3"
            fill="none"
            width={Math.max(Math.abs(endX - startX), 10)}
            height={Math.max(endY - startY, 10)}
          />,
        );

        // 流动点
        decorElements.push(
          <Ellipse
            x={startX - 3}
            y={startY - 3}
            width={6}
            height={6}
            fill="#b0bec5"
          />,
        );
      }

      // 跨列的流动效果
      if (index % 3 === 0 && index > 2) {
        const crossColPrev = prevPositions[index - 3];
        if (crossColPrev && crossColPrev.col !== pos.col) {
          const startX = crossColPrev.x + itemBounds.width;
          const startY = crossColPrev.y + itemBounds.height / 2;
          const endX = pos.x;
          const endY = pos.y + itemBounds.height / 2;

          const midX = startX + (endX - startX) / 2;
          const curvePath = `M ${startX} ${startY} Q ${midX} ${startY - 20} ${endX} ${endY}`;

          decorElements.push(
            <Path
              d={curvePath}
              stroke="#f0f0f0"
              strokeWidth={1}
              strokeOpacity={0.6}
              fill="none"
              width={Math.max(Math.abs(endX - startX), 10)}
              height={Math.max(Math.abs(endY - startY) + 40, 50)}
            />,
          );
        }
      }
    }
  });

  // Add initial buttons for empty list
  if (items.length === 0) {
    // Initial add button in the center for empty state
    btnElements.push(
      <BtnAdd
        indexes={[0]}
        x={
          ((columns - 1) * colWidth) / 2 +
          (itemBounds.width - btnBounds.width) / 2
        }
        y={0}
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

registerStructure('list-waterfall', { component: ListWaterfall });
