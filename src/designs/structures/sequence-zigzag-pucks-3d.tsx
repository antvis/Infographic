import type { ComponentType, JSXElement } from '../../jsx';
import { Defs, getElementBounds, Group, Path } from '../../jsx';
import {
  BtnAdd,
  BtnRemove,
  BtnsGroup,
  ItemsGroup,
  ShapesGroup,
} from '../components';
import { FlexLayout } from '../layouts';
import { getColorPrimary, getPaletteColor } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

const PUCK_WIDTH = 120;
const PUCK_HEIGHT = 108;
const ITEM_TO_PUCK_GAP = 30;

const PUCK_TOP_PATH =
  'M4.49144e-05 34.4898C4.49144e-05 37.8786 0.848973 41.152 2.43571 44.2444C4.23516 47.7642 6.98514 51.0472 10.517 54.0009C21.331 63.047 39.4615 68.9814 59.9991 68.9814C80.5385 68.9814 98.6672 63.047 109.483 54.0009C113.013 51.0472 115.765 47.7642 117.564 44.2444C119.149 41.152 120 37.8786 120 34.4898C120 15.4407 93.1364 0 59.9991 0C26.8635 0 4.49144e-05 15.4407 4.49144e-05 34.4898Z';

const PUCK_MIDDLE_PATH =
  'M4.49145e-05 34.4898V53.9991C4.49145e-05 57.3879 0.848973 60.6613 2.43571 63.7556C9.75425 78.0545 32.7562 88.4907 59.999 88.4907C87.2438 88.4907 110.246 78.0545 117.564 63.7556C119.149 60.6613 120 57.3879 120 53.9991V34.4898C120 37.8786 119.149 41.152 117.564 44.2444C115.765 47.7642 113.013 51.0472 109.483 54.0009C98.6672 63.047 80.5385 68.9814 59.999 68.9814C39.4615 68.9814 21.3309 63.047 10.5169 54.0009C6.98509 51.0472 4.23516 47.7642 2.43567 44.2444C0.848928 41.152 4.49145e-05 37.8786 4.49145e-05 34.4898Z';

const PUCK_BOTTOM_PATH =
  'M0 53.9991V73.5102C0 92.5593 26.8634 108 59.999 108C93.1363 108 120 92.5593 120 73.5102V53.9991C120 57.3879 119.149 60.6613 117.564 63.7556C110.246 78.0545 87.2438 88.4907 59.999 88.4907C32.7562 88.4907 9.75425 78.0545 2.43571 63.7556C0.848973 60.6613 0 57.3879 0 53.9991Z';

const DropShadowFilter = (
  <filter
    id="sequence-zigzag-pucks-3d-shadow-filter"
    x="-50%"
    y="-50%"
    width="200%"
    height="200%"
    filterUnits="userSpaceOnUse"
    colorInterpolationFilters="sRGB"
  >
    <feOffset dx="-7" dy="7" in="SourceAlpha" result="offset" />
    <feGaussianBlur stdDeviation="7.5" in="offset" result="blurred" />
    <feColorMatrix
      in="blurred"
      type="matrix"
      values="0 0 0 0 0 
              0 0 0 0 0 
              0 0 0 0 0 
              0 0 0 0.3 0"
      result="shadow"
    />
    <feBlend mode="normal" in="SourceGraphic" in2="shadow" />
  </filter>
);

export interface SequenceZigzagPucks3dProps extends BaseStructureProps {
  gap?: number;
}

export const SequenceZigzagPucks3d: ComponentType<
  SequenceZigzagPucks3dProps
> = (props) => {
  const { Title, Item, data, options, gap = 80 } = props;
  const puckWidth = PUCK_WIDTH;
  const puckHeight = PUCK_HEIGHT;
  const { title, desc, items = [] } = data;
  const titleContent = Title ? <Title title={title} desc={desc} /> : null;
  const colorPrimary = getColorPrimary(options);

  if (items.length === 0) {
    const btnAddElement = <BtnAdd indexes={[0]} x={0} y={0} />;
    return (
      <FlexLayout
        id="infographic-container"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Defs>{DropShadowFilter}</Defs>
        {titleContent}
        <Group>
          <BtnsGroup>{btnAddElement}</BtnsGroup>
        </Group>
      </FlexLayout>
    );
  }

  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} positionH="center" />,
  );
  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);

  const btnElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];
  const puckElements: JSXElement[] = [];

  let minY = Infinity;
  let maxY = -Infinity;

  const itemHeight = itemBounds.height + ITEM_TO_PUCK_GAP + puckHeight;

  items.forEach((item, index) => {
    const indexes = [index];
    const currentColor = getPaletteColor(options, indexes);

    const isEven = index % 2 === 0;
    const puckX = index * (puckWidth + gap);
    const puckY = isEven ? 0 : itemBounds.height + ITEM_TO_PUCK_GAP;

    minY = Math.min(minY, puckY);

    const gradientId1 = `puck-gradient-middle-${index}`;
    const gradientId2 = `puck-gradient-bottom-${index}`;

    puckElements.push(
      <Group
        x={puckX}
        y={puckY}
        id={`puck-${index}`}
        width={puckWidth}
        height={puckHeight}
        filter="url(#sequence-zigzag-pucks-3d-shadow-filter)"
      >
        <Defs>
          <linearGradient
            id={gradientId1}
            x1="115"
            y1="55.9991"
            x2="15.0002"
            y2="55.9991"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor={currentColor || colorPrimary} />
            <stop
              offset="1"
              stopColor={currentColor || colorPrimary}
              stopOpacity="0.6"
            />
          </linearGradient>
          <linearGradient
            id={gradientId2}
            x1="115"
            y1="72.1803"
            x2="15.0002"
            y2="72.1803"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#F4F4FB" />
            <stop offset="1" stopColor="#8E8C90" />
          </linearGradient>
        </Defs>
        <ShapesGroup width={PUCK_WIDTH} height={PUCK_HEIGHT}>
          <Path d={PUCK_TOP_PATH} fill={currentColor || colorPrimary} />
          <Path d={PUCK_MIDDLE_PATH} fill={`url(#${gradientId1})`} />
          <Path d={PUCK_BOTTOM_PATH} fill={`url(#${gradientId2})`} />
          <rect
            fill="transparent"
            y={PUCK_HEIGHT}
            width={PUCK_WIDTH}
            height={20}
          />
        </ShapesGroup>
        <text
          x={65}
          y={40}
          width={50}
          height={50}
          fontSize={40}
          fontWeight="bold"
          fill="#FFFFFF"
          textAnchor="middle"
          dominantBaseline="middle"
          transform="rotate(-15 65 40) scale(1, 0.8)"
        >
          {index + 1}
        </text>
      </Group>,
    );

    const itemX = puckX + (puckWidth - itemBounds.width) / 2;
    const itemY = isEven
      ? puckY + puckHeight + ITEM_TO_PUCK_GAP
      : puckY - ITEM_TO_PUCK_GAP - itemBounds.height;

    maxY = Math.max(maxY, itemY + itemBounds.height);

    itemElements.push(
      <Item
        indexes={indexes}
        datum={item}
        data={data}
        x={itemX}
        y={itemY}
        positionH="center"
      />,
    );

    btnElements.push(
      <BtnRemove
        indexes={indexes}
        x={itemX + itemBounds.width - btnBounds.width / 2}
        y={itemY + itemBounds.height - btnBounds.height / 2}
      />,
    );

    if (index === 0) {
      btnElements.push(
        <BtnAdd
          indexes={[0]}
          x={
            puckX + puckWidth / 2 - btnBounds.width / 2 - (gap + puckWidth) / 2
          }
          y={puckY + puckHeight / 2 - btnBounds.height / 2}
        />,
      );
    }

    if (index < items.length - 1) {
      const nextIsEven = (index + 1) % 2 === 0;
      const nextPuckY = nextIsEven ? 0 : itemHeight;
      const btnAddX = puckX + puckWidth + gap / 2 - btnBounds.width / 2;
      const btnAddY =
        (puckY + puckHeight / 2 + nextPuckY + puckHeight / 2) / 2 -
        btnBounds.height / 2;

      btnElements.push(
        <BtnAdd indexes={[index + 1]} x={btnAddX} y={btnAddY} />,
      );
    } else {
      btnElements.push(
        <BtnAdd
          indexes={[items.length]}
          x={puckX + puckWidth + gap / 2 - btnBounds.width / 2}
          y={puckY + puckHeight / 2 - btnBounds.height / 2}
        />,
      );
    }
  });

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={30}
    >
      <Defs>{DropShadowFilter}</Defs>
      {titleContent}
      <Group x={0} y={0}>
        <Group>{puckElements}</Group>
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup>{btnElements}</BtnsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('sequence-zigzag-pucks-3d', {
  component: SequenceZigzagPucks3d,
  composites: ['title', 'item'],
});
