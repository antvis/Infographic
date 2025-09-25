/** @jsxImportSource @antv/infographic-jsx */
import type { ComponentType, JSXElement } from '@antv/infographic-jsx';
import { getElementBounds, Group, Path } from '@antv/infographic-jsx';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface CompareLeftRightProps extends BaseStructureProps {
  gap?: number;
  centerGap?: number;
}

export const CompareLeftRight: ComponentType<CompareLeftRightProps> = (
  props,
) => {
  const { Title, Item, data, gap = 20, centerGap = 80 } = props;
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
  const maxItems = Math.max(leftItems.length, rightItems.length);

  const leftX = 0;
  const rightX = itemBounds.width + centerGap;
  const totalHeight = maxItems * (itemBounds.height + gap) - gap;

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
        positionH="normal"
      />,
    );

    btnElements.push(
      <BtnRemove
        indexes={indexes}
        x={leftX - btnBounds.width - 10}
        y={itemY + (itemBounds.height - btnBounds.height) / 2}
      />,
    );

    btnElements.push(
      <BtnAdd
        indexes={indexes}
        x={leftX + (itemBounds.width - btnBounds.width) / 2}
        y={itemY - btnBounds.height - 5}
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

    btnElements.push(
      <BtnRemove
        indexes={indexes}
        x={rightX + itemBounds.width + 10}
        y={itemY + (itemBounds.height - btnBounds.height) / 2}
      />,
    );

    btnElements.push(
      <BtnAdd
        indexes={indexes}
        x={rightX + (itemBounds.width - btnBounds.width) / 2}
        y={itemY - btnBounds.height - 5}
      />,
    );
  });

  if (items.length > 0) {
    const lastLeftY =
      (leftItems.length - 1) * (itemBounds.height + gap) + itemBounds.height;
    const lastRightY =
      (rightItems.length - 1) * (itemBounds.height + gap) + itemBounds.height;

    btnElements.push(
      <BtnAdd
        indexes={[items.length]}
        x={leftX + (itemBounds.width - btnBounds.width) / 2}
        y={lastLeftY + 10}
      />,
    );

    btnElements.push(
      <BtnAdd
        indexes={[items.length + 1]}
        x={rightX + (itemBounds.width - btnBounds.width) / 2}
        y={lastRightY + 10}
      />,
    );
  }

  const dividerPath = `M ${leftX + itemBounds.width + centerGap / 2} 0 L ${leftX + itemBounds.width + centerGap / 2} ${totalHeight}`;

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {titleContent}
      <Group>
        <Path
          d={dividerPath}
          stroke="#ddd"
          strokeWidth={2}
          width={1}
          height={totalHeight}
        />
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup>{btnElements}</BtnsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('compare-left-right', { component: CompareLeftRight });
