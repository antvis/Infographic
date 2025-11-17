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
  'M0 34.4903C0 37.8781 0.849901 41.1522 2.43491 44.2451C4.23514 47.7639 6.98606 51.0482 10.5164 54.0008C21.3317 63.0477 39.4607 68.9799 59.9998 68.9799C80.5391 68.9799 98.6691 63.0477 109.483 54.0008C113.013 51.0482 115.765 47.7639 117.564 44.2451C119.149 41.1522 120 37.8781 120 34.4903C120 15.4417 93.1366 0 59.9998 0C26.8632 0 0 15.4417 0 34.4903Z';

const PUCK_MIDDLE_PATH =
  'M0 34.4904V53.9996C0 57.3885 0.849901 60.6616 2.43491 63.7555C9.75384 78.0548 32.7566 88.4909 59.9998 88.4909C87.2438 88.4909 110.246 78.0548 117.564 63.7555C119.149 60.6616 120 57.3885 120 53.9996V34.4904C120 37.8781 119.149 41.1522 117.564 44.2451C115.765 47.7639 113.013 51.0482 109.483 54.0008C98.6691 63.0477 80.5391 68.9799 59.9998 68.9799C39.4607 68.9799 21.3317 63.0477 10.5164 54.0008C6.98606 51.0482 4.23514 47.7639 2.43491 44.2451C0.849901 41.1522 0 37.8781 0 34.4904Z';

const PUCK_BOTTOM_PATH =
  'M0 53.9996V73.5106C0 92.5595 26.8632 108 59.9998 108C93.1366 108 120 92.5595 120 73.5106V53.9996C120 57.3885 119.149 60.6616 117.564 63.7555C110.246 78.0548 87.2438 88.4909 59.9998 88.4909C32.7566 88.4909 9.75384 78.0548 2.43491 63.7555C0.849901 60.6616 0 57.3885 0 53.9996Z';

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
    <feFlood floodOpacity="0" result="BackgroundImageFix" />
    <feColorMatrix
      in="SourceAlpha"
      type="matrix"
      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
      result="hardAlpha"
    />
    <feOffset dx="-7" dy="7" />
    <feGaussianBlur stdDeviation="7.5" />
    <feComposite in2="hardAlpha" operator="out" />
    <feColorMatrix
      type="matrix"
      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
    />
    <feBlend
      mode="normal"
      in2="BackgroundImageFix"
      result="effect1_dropShadow"
    />
    <feBlend
      mode="normal"
      in="SourceGraphic"
      in2="effect1_dropShadow"
      result="shape"
    />
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
