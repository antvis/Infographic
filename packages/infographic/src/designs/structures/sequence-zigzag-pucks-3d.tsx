/** @jsxImportSource @antv/infographic-jsx */
import type { ComponentType, JSXElement } from '@antv/infographic-jsx';
import { Defs, getElementBounds, Group, Path } from '@antv/infographic-jsx';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { getColorPrimary, getPaletteColor } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

const PUCK_GAP = 80;
const PUCK_WIDTH = 120;
const PUCK_HEIGHT = 110;
const ITEM_TO_PUCK_GAP = 30;

const PUCK_TOP_PATH =
  'M15 33.6055C15 36.4152 15.7083 39.1307 17.0291 41.6959C18.5293 44.6143 20.8217 47.3383 23.7636 49.7871C32.7764 57.2904 47.884 62.2104 64.9998 62.2104C82.1159 62.2104 97.2242 57.2904 106.236 49.7871C109.177 47.3383 111.471 44.6143 112.97 41.6959C114.291 39.1307 115 36.4152 115 33.6055C115 17.807 92.6138 5 64.9998 5C37.386 5 15 17.807 15 33.6055Z';

const PUCK_MIDDLE_PATH =
  'M15 33.6055V49.7861C15 52.5967 15.7083 55.3114 17.0291 57.8774C23.1282 69.7369 42.2971 78.3924 64.9998 78.3924C87.7032 78.3924 106.871 69.7369 112.97 57.8774C114.291 55.3114 115 52.5967 115 49.7861V33.6055C115 36.4152 114.291 39.1307 112.97 41.6959C111.471 44.6143 109.177 47.3383 106.236 49.7871C97.2242 57.2904 82.1159 62.2104 64.9998 62.2104C47.884 62.2104 32.7764 57.2904 23.7636 49.7871C20.8217 47.3383 18.5293 44.6143 17.0291 41.6959C15.7083 39.1307 15 36.4152 15 33.6055Z';

const PUCK_BOTTOM_PATH =
  'M15 49.7861V65.9681C15 81.7668 37.386 94.5728 64.9998 94.5728C92.6138 94.5728 115 81.7668 115 65.9681V49.7861C115 52.5967 114.291 55.3114 112.97 57.8774C106.871 69.7369 87.7032 78.3924 64.9998 78.3924C42.2971 78.3924 23.1282 69.7369 17.0291 57.8774C15.7083 55.3114 15 52.5967 15 49.7861Z';

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
  puckWidth?: number;
  puckHeight?: number;
  verticalOffset?: number;
}

export const SequenceZigzagPucks3d: ComponentType<
  SequenceZigzagPucks3dProps
> = (props) => {
  const {
    Title,
    Item,
    data,
    options,
    gap = PUCK_GAP,
    puckWidth = PUCK_WIDTH,
    puckHeight = PUCK_HEIGHT,
  } = props;
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

  const puckScale = puckWidth / 120;

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
        <Group transform={`scale(${puckScale})`}>
          <Path d={PUCK_TOP_PATH} fill={currentColor || colorPrimary} />
          <Path d={PUCK_MIDDLE_PATH} fill={`url(#${gradientId1})`} />
          <Path d={PUCK_BOTTOM_PATH} fill={`url(#${gradientId2})`} />
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
        </Group>
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
