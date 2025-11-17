import type { ComponentType, JSXElement } from '../../jsx';
import { getElementBounds, Group } from '../../jsx';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface SequenceAscendingStepsProps extends BaseStructureProps {
  hGap?: number;
  vGap?: number;
}

export const SequenceAscendingSteps: ComponentType<
  SequenceAscendingStepsProps
> = (props) => {
  const { Title, Item, data, hGap = 0, vGap = 0 } = props as any;
  const { title, desc, items = [] } = data;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} />,
  );

  const itemElements: JSXElement[] = [];
  const btnElements: JSXElement[] = [];

  const n = items.length;
  const stepX = itemBounds.width + hGap;
  const stepY = itemBounds.height / 2 + vGap;

  const startX = itemBounds.width / 2;
  const endY = 0;
  const startY = endY + (n - 1) * stepY;

  items.forEach((datum: any, index: number) => {
    const x = startX + index * stepX;
    const y = startY - index * stepY;
    const indexes = [index];

    itemElements.push(
      <Item indexes={indexes} datum={datum} data={data} x={x} y={y} />,
    );

    btnElements.push(
      <BtnRemove
        indexes={indexes}
        x={x + itemBounds.width - 30}
        y={y + itemBounds.height / 2 + 10}
      />,
    );

    btnElements.push(
      <BtnAdd
        indexes={indexes}
        x={x + itemBounds.width + hGap / 2}
        y={y - 30}
      />,
    );
  });

  return (
    <FlexLayout
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

registerStructure('sequence-ascending-steps', {
  component: SequenceAscendingSteps,
  composites: ['title', 'item'],
});
