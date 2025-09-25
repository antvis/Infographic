/** @jsxImportSource @antv/infographic-jsx */
import type { ComponentType, JSXElement } from '@antv/infographic-jsx';
import { getElementBounds, Group, Polygon } from '@antv/infographic-jsx';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface SequenceStepsProps extends BaseStructureProps {
  gap?: number;
}

export const SequenceSteps: ComponentType<SequenceStepsProps> = (props) => {
  const { Title, Item, data, gap = 40 } = props;
  const { title, desc, items = [] } = data;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);
  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} positionH="center" />,
  );

  const btnElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];
  const decorElements: JSXElement[] = [];

  const arrowWidth = 20;
  const arrowHeight = 12;
  const topMargin = Math.max(btnBounds.height + 20, 30);

  items.forEach((item, index) => {
    const itemX = index * (itemBounds.width + gap);
    const indexes = [index];

    itemElements.push(
      <Item
        indexes={indexes}
        datum={item}
        data={data}
        x={itemX}
        y={topMargin}
        positionH="center"
      />,
    );

    btnElements.push(
      <BtnRemove
        indexes={indexes}
        x={itemX + (itemBounds.width - btnBounds.width) / 2}
        y={topMargin + itemBounds.height + 10}
      />,
    );

    if (index === 0) {
      btnElements.push(
        <BtnAdd
          indexes={indexes}
          x={itemX + (itemBounds.width - btnBounds.width) / 2}
          y={topMargin - btnBounds.height - 10}
        />,
      );
    } else {
      btnElements.push(
        <BtnAdd
          indexes={indexes}
          x={itemX - gap / 2 - btnBounds.width / 2}
          y={topMargin - btnBounds.height - 10}
        />,
      );
    }

    if (index < items.length - 1) {
      const arrowX = itemX + itemBounds.width + (gap - arrowWidth) / 2;
      const arrowY = topMargin + itemBounds.height / 2 - arrowHeight / 2;

      decorElements.push(
        <Polygon
          points={[
            { x: arrowX, y: arrowY },
            { x: arrowX + arrowWidth - arrowHeight / 2, y: arrowY },
            { x: arrowX + arrowWidth, y: arrowY + arrowHeight / 2 },
            {
              x: arrowX + arrowWidth - arrowHeight / 2,
              y: arrowY + arrowHeight,
            },
            { x: arrowX, y: arrowY + arrowHeight },
          ]}
          fill="#666"
        />,
      );
    }
  });

  if (items.length > 0) {
    const lastItemX = (items.length - 1) * (itemBounds.width + gap);
    btnElements.push(
      <BtnAdd
        indexes={[items.length]}
        x={lastItemX + itemBounds.width + (gap - btnBounds.width) / 2}
        y={topMargin - btnBounds.height - 10}
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

registerStructure('sequence-steps', { component: SequenceSteps });
