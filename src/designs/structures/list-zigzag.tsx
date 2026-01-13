import tinycolor from 'tinycolor2';
import type { ComponentType, JSXElement } from '../../jsx';
import { getElementBounds, Group } from '../../jsx';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { getColorPrimary, getThemeColors } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface ListZigzagProps extends BaseStructureProps {
  itemGap?: number;
}

export interface ListZigzagDownProps extends ListZigzagProps {}

export interface ListZigzagUpProps extends ListZigzagProps {}

const MAX_ITEMS = 6;
const ARROW_WIDTH = 700;
const ARROW_HEIGHT_DOWN = 330;
const ARROW_HEIGHT_UP = 333;

type AnchorPosition =
  | 'center'
  | 'top'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

type AnchorPoint = {
  x: number;
  y: number;
  anchor?: AnchorPosition;
};

type ZigzagArrowProps = {
  colorPrimary?: string;
  colorShadow?: string;
};

type ZigzagConfig = {
  arrowHeight: number;
  presetRatios: Record<number, AnchorPoint[]>;
  Arrow: ComponentType<ZigzagArrowProps>;
};

const PRESET_RATIOS_DOWN: Record<number, AnchorPoint[]> = {
  1: [{ x: 0.5, y: 0.6, anchor: 'top-right' }],
  2: [
    { x: 0.42, y: 0.5, anchor: 'top-right' },
    { x: 0.72, y: 0.4, anchor: 'bottom' },
  ],
  3: [
    { x: 0.3, y: 0.5, anchor: 'top-right' },
    { x: 0.48, y: 0.3, anchor: 'bottom-left' },
    { x: 0.8, y: 0.75, anchor: 'top-right' },
  ],
  4: [
    { x: 0.3, y: 0.5, anchor: 'top-right' },
    { x: 0.35, y: 0.2, anchor: 'bottom-left' },
    { x: 0.65, y: 0.73, anchor: 'top-right' },
    { x: 0.8, y: 0.52, anchor: 'bottom-left' },
  ],
  5: [
    { x: 0.19, y: 0.4, anchor: 'top-right' },
    { x: 0.38, y: 0.2, anchor: 'bottom' },
    { x: 0.52, y: 0.62, anchor: 'top-right' },
    { x: 0.7, y: 0.43, anchor: 'bottom' },
    { x: 0.82, y: 0.8, anchor: 'top-right' },
  ],
  6: [
    { x: 0.16, y: 0.35, anchor: 'top-right' },
    { x: 0.38, y: 0.2, anchor: 'bottom' },
    { x: 0.48, y: 0.54, anchor: 'top-right' },
    { x: 0.55, y: 0.43, anchor: 'bottom-left' },
    { x: 0.8, y: 0.75, anchor: 'top-right' },
    { x: 0.86, y: 0.65, anchor: 'bottom-left' },
  ],
};

const PRESET_RATIOS_UP: Record<number, AnchorPoint[]> = {
  1: [{ x: 0.5, y: 0.4, anchor: 'bottom-right' }],
  2: [
    { x: 0.42, y: 0.5, anchor: 'bottom-right' },
    { x: 0.72, y: 0.6, anchor: 'top' },
  ],
  3: [
    { x: 0.3, y: 0.5, anchor: 'bottom-right' },
    { x: 0.48, y: 0.7, anchor: 'top-left' },
    { x: 0.8, y: 0.25, anchor: 'bottom-right' },
  ],
  4: [
    { x: 0.3, y: 0.5, anchor: 'bottom-right' },
    { x: 0.35, y: 0.8, anchor: 'top-left' },
    { x: 0.65, y: 0.27, anchor: 'bottom-right' },
    { x: 0.8, y: 0.48, anchor: 'top-left' },
  ],
  5: [
    { x: 0.19, y: 0.6, anchor: 'bottom-right' },
    { x: 0.38, y: 0.8, anchor: 'top' },
    { x: 0.52, y: 0.38, anchor: 'bottom-right' },
    { x: 0.7, y: 0.57, anchor: 'top' },
    { x: 0.82, y: 0.2, anchor: 'bottom-right' },
  ],
  6: [
    { x: 0.16, y: 0.65, anchor: 'bottom-right' },
    { x: 0.38, y: 0.8, anchor: 'top' },
    { x: 0.48, y: 0.46, anchor: 'bottom-right' },
    { x: 0.55, y: 0.57, anchor: 'top-left' },
    { x: 0.8, y: 0.25, anchor: 'bottom-right' },
    { x: 0.86, y: 0.35, anchor: 'top-left' },
  ],
};

const getPresetPoints = (
  count: number,
  presetRatios: Record<number, AnchorPoint[]>,
  arrowHeight: number,
) => {
  const ratios = presetRatios[count];
  if (!ratios) return null;
  return ratios.map((point) => ({
    x: point.x * ARROW_WIDTH,
    y: point.y * arrowHeight,
    anchor: point.anchor,
  }));
};

const getAnchoredPosition = (
  point: AnchorPoint,
  size: { width: number; height: number },
) => {
  const anchor = point.anchor || 'center';
  let x = point.x - size.width / 2;
  let y = point.y - size.height / 2;
  let centerY = point.y;

  switch (anchor) {
    case 'top':
      x = point.x - size.width / 2;
      y = point.y;
      centerY = point.y + size.height / 2;
      break;
    case 'bottom':
      x = point.x - size.width / 2;
      y = point.y - size.height;
      centerY = point.y - size.height / 2;
      break;
    case 'top-left':
      x = point.x;
      y = point.y;
      centerY = point.y + size.height / 2;
      break;
    case 'top-right':
      x = point.x - size.width;
      y = point.y;
      centerY = point.y + size.height / 2;
      break;
    case 'bottom-left':
      x = point.x;
      y = point.y - size.height;
      centerY = point.y - size.height / 2;
      break;
    case 'bottom-right':
      x = point.x - size.width;
      y = point.y - size.height;
      centerY = point.y - size.height / 2;
      break;
    default:
      break;
  }

  return { x, y, centerY };
};

const getUnitVector = (
  from: { x: number; y: number },
  to: {
    x: number;
    y: number;
  },
) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: dx / length, y: dy / length };
};

const createListZigzag = (config: ZigzagConfig) => {
  const { presetRatios, arrowHeight, Arrow } = config;
  const ListZigzag: ComponentType<ListZigzagProps> = (props) => {
    const { Title, Item, data, options, itemGap = 24 } = props;
    const { title, desc, items = [] } = data;
    const layoutCount = Math.min(items.length, MAX_ITEMS);
    const displayItems = items.slice(0, layoutCount);

    const titleContent = Title ? <Title title={title} desc={desc} /> : null;
    const colorPrimary = getColorPrimary(options);
    const themeColors = getThemeColors({ colorPrimary }, options);
    const colorShadow = themeColors.colorTextSecondary || '#737373';

    const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);

    if (items.length === 0) {
      const anchor = getPresetPoints(1, presetRatios, arrowHeight)?.[0];
      if (!anchor) {
        return (
          <FlexLayout
            id="infographic-container"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            {titleContent}
            <Group>
              <Arrow colorPrimary={colorPrimary} colorShadow={colorShadow} />
            </Group>
          </FlexLayout>
        );
      }
      const btnX = anchor.x - btnBounds.width / 2;
      const btnY = anchor.y - btnBounds.height / 2;
      return (
        <FlexLayout
          id="infographic-container"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          {titleContent}
          <Group>
            <Arrow colorPrimary={colorPrimary} colorShadow={colorShadow} />
            <ItemsGroup />
            <BtnsGroup>
              <BtnAdd indexes={[0]} x={btnX} y={btnY} />
            </BtnsGroup>
          </Group>
        </FlexLayout>
      );
    }

    const itemBounds = getElementBounds(
      <Item indexes={[0]} data={data} datum={items[0]} positionH="center" />,
    );

    const btnElements: JSXElement[] = [];
    const itemElements: JSXElement[] = [];
    const presetPoints = getPresetPoints(
      layoutCount,
      presetRatios,
      arrowHeight,
    );
    if (!presetPoints) {
      return (
        <FlexLayout
          id="infographic-container"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          {titleContent}
          <Group>
            <Arrow colorPrimary={colorPrimary} colorShadow={colorShadow} />
            <ItemsGroup />
          </Group>
        </FlexLayout>
      );
    }
    const anchorPoints = presetPoints;
    const baseDirection =
      anchorPoints.length > 1
        ? getUnitVector(anchorPoints[0], anchorPoints[anchorPoints.length - 1])
        : { x: 1, y: 0 };
    const startDirection =
      anchorPoints.length > 1
        ? getUnitVector(anchorPoints[0], anchorPoints[1])
        : baseDirection;
    const endDirection =
      anchorPoints.length > 1
        ? getUnitVector(
            anchorPoints[anchorPoints.length - 2],
            anchorPoints[anchorPoints.length - 1],
          )
        : baseDirection;
    const addOffset =
      Math.max(itemBounds.width, itemBounds.height) * 0.45 + itemGap;

    const toItemPosition = (point: AnchorPoint) => {
      const { x, y, centerY } = getAnchoredPosition(point, itemBounds);
      return { x, y, centerY };
    };

    anchorPoints.forEach((anchor, index) => {
      const itemPosition = toItemPosition(anchor);
      const isTop = itemPosition.centerY < arrowHeight / 2;
      const indexes = [index];
      const item = displayItems[index];
      if (!item) return;

      itemElements.push(
        <Item
          indexes={indexes}
          datum={item}
          data={data}
          x={itemPosition.x}
          y={itemPosition.y}
          positionH="center"
        />,
      );

      const btnRemoveX =
        itemPosition.x + itemBounds.width - btnBounds.width / 2;
      const btnRemoveY = isTop
        ? itemPosition.y - btnBounds.height / 2
        : itemPosition.y + itemBounds.height - btnBounds.height / 2;
      btnElements.push(
        <BtnRemove indexes={indexes} x={btnRemoveX} y={btnRemoveY} />,
      );
    });

    if (anchorPoints.length > 0) {
      const firstAnchor = anchorPoints[0];
      const firstAddX =
        firstAnchor.x - startDirection.x * addOffset - btnBounds.width / 2;
      const firstAddY =
        firstAnchor.y - startDirection.y * addOffset - btnBounds.height / 2;
      btnElements.push(<BtnAdd indexes={[0]} x={firstAddX} y={firstAddY} />);

      for (let index = 0; index < anchorPoints.length - 1; index++) {
        const current = anchorPoints[index];
        const next = anchorPoints[index + 1];
        const midX = (current.x + next.x) / 2;
        const midY = (current.y + next.y) / 2;
        const midAddX = midX - btnBounds.width / 2;
        const midAddY = midY - btnBounds.height / 2;
        btnElements.push(
          <BtnAdd indexes={[index + 1]} x={midAddX} y={midAddY} />,
        );
      }

      const lastAnchor = anchorPoints[anchorPoints.length - 1];
      const lastAddX =
        lastAnchor.x + endDirection.x * addOffset - btnBounds.width / 2;
      const lastAddY =
        lastAnchor.y + endDirection.y * addOffset - btnBounds.height / 2;
      btnElements.push(
        <BtnAdd indexes={[layoutCount]} x={lastAddX} y={lastAddY} />,
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
          <Arrow colorPrimary={colorPrimary} colorShadow={colorShadow} />
          <ItemsGroup>{itemElements}</ItemsGroup>
          <BtnsGroup>{btnElements}</BtnsGroup>
        </Group>
      </FlexLayout>
    );
  };

  return ListZigzag;
};

const ArrowDown: ComponentType<ZigzagArrowProps> = ({
  colorPrimary = '#17CA2C',
  colorShadow = '#737373',
}) => {
  const colorPrimaryDark = tinycolor(colorPrimary).darken(20).toHexString();
  return (
    <Group width={ARROW_WIDTH} height={ARROW_HEIGHT_DOWN}>
      <path
        d="M228.864 159.446C230.266 159.446 231.623 158.768 232.689 157.535L274.263 110.162L265.717 102.923L227.311 148.082C225.977 149.623 224.281 150.47 222.529 150.47H175.404L182.03 158.367C182.795 159.445 182.795 159.446 183.734 159.446H228.864Z"
        fill={colorShadow}
      />
      <path
        d="M462.869 234.92C464.271 234.92 465.628 234.242 466.695 233.01L508.268 185.636L499.722 178.397L461.316 223.557C459.983 225.098 458.287 225.945 456.534 225.945H409.409L416.035 233.841C416.8 234.92 416.8 234.92 417.74 234.92H462.869Z"
        fill={colorShadow}
      />
      <path
        d="M697.005 330C698.783 330 700 328.82 700 327.001V256.638C700 254.857 697.848 253.965 696.591 255.225L693.409 258.411V320.402C693.409 322.058 692.069 323.401 690.414 323.401H630.718L627.536 326.587C626.278 327.847 627.169 330 628.947 330H697.005Z"
        fill={colorShadow}
      />
      <path
        d="M689.642 321.89C690.744 321.89 691.638 320.995 691.638 319.891V250.743C691.638 248.962 689.488 248.07 688.23 249.329L662.647 274.947L520.987 153.863C519.541 152.627 517.703 151.948 515.802 151.948H469.518C470.236 151.949 470.956 152.206 471.53 152.729L498.163 176.978L498.13 177.018L639.84 297.784L619.174 318.477C617.916 319.737 618.807 321.89 620.586 321.89H689.642Z"
        fill={colorPrimary}
      />
      <path
        d="M429.279 198.995L467.208 153.03C468.3 151.716 470.268 151.579 471.531 152.729L498.163 176.978L460.69 221.107C459.173 222.894 456.946 223.924 454.6 223.924H408.473C409.366 223.924 410.252 223.527 410.845 222.764L429.279 198.995Z"
        fill={colorPrimaryDark}
      />
      <path
        d="M408.473 223.924H408.314L408.318 223.92C408.369 223.922 408.421 223.924 408.473 223.924Z"
        fill={colorPrimaryDark}
      />
      <path
        d="M406.524 223.203C407.826 224.318 409.796 224.116 410.845 222.761L429.279 198.932L287.411 77.8866C285.964 76.6523 284.125 75.9742 282.223 75.9742H234.606L234.625 75.9907C235.429 75.9118 236.263 76.1557 236.915 76.7378L263.662 100.621L263.546 100.758L406.524 223.203Z"
        fill={colorPrimary}
      />
      <path
        d="M236.914 76.7386C235.651 75.6097 233.707 75.7513 232.621 77.0513L194.557 123.104L175.644 146.821C175.076 147.535 174.25 147.917 173.409 147.947L173.407 147.95H219.923C222.271 147.95 224.499 146.915 226.017 145.122L263.645 100.649L236.914 76.7386Z"
        fill={colorPrimaryDark}
      />
      <path
        d="M175.648 146.816C174.589 148.145 172.637 148.329 171.348 147.221L4.09334 3.51697C2.68586 2.30767 3.54106 0 5.39671 0H47.5805C49.4864 0 51.3297 0.680433 52.7785 1.91877L194.557 123.104L175.648 146.816Z"
        fill={colorPrimary}
      />
    </Group>
  );
};

const ArrowUp: ComponentType<ZigzagArrowProps> = ({
  colorPrimary = '#17CA2C',
  colorShadow = '#737373',
}) => {
  const colorPrimaryDark = tinycolor(colorPrimary).darken(20).toHexString();
  return (
    <Group width={ARROW_WIDTH} height={ARROW_HEIGHT_UP}>
      <path
        d="M19.0526 324L12.6762 329.482C11.2703 330.691 12.1234 333 13.976 333H56.1578C58.058 333 59.896 332.321 61.3413 331.085L201.854 210.901L194.249 201.693L54.0527 321.606C52.246 323.151 49.9486 324 47.5732 324H19.0526Z"
        fill={colorShadow}
      />
      <path
        d="M234.587 248L241.131 255.922C241.656 256.552 242.382 256.909 243.134 256.983L243.115 257H290.716C292.618 257 294.457 256.322 295.903 255.087L437.091 134.536L429.305 125.5L288.613 245.609C286.805 247.153 284.507 248 282.132 248H234.587Z"
        fill={colorShadow}
      />
      <path
        d="M461.123 162.429L475.642 179.918C476.237 180.635 477.092 181.001 477.951 181H524.22C526.121 181 527.959 180.321 529.404 179.085L670.786 58.1578L662.326 49.6809L522.115 169.606C520.309 171.151 518.011 172 515.636 172H469.369L461.123 162.429Z"
        fill={colorShadow}
      />
      <path
        d="M687.912 74.8875C690.374 75.9052 693.412 74.1668 693.412 71.1716V11H698.004C699.106 11 700 11.8954 700 13V82.1716C700 83.9534 697.85 84.8457 696.593 83.5858L687.912 74.8875Z"
        fill={colorShadow}
      />
      <path
        d="M689.419 0C690.522 0 691.415 0.895432 691.415 2V71.1716C691.415 72.9534 689.265 73.8457 688.008 72.5858L662.433 46.9598L520.819 168.085C519.374 169.321 517.536 170 515.636 170H469.367C470.084 169.999 470.804 169.742 471.379 169.219L498.003 144.961L497.969 144.922L639.634 24.115L618.975 3.41421C617.717 2.15428 618.608 0 620.386 0H689.419Z"
        fill={colorPrimary}
      />
      <path
        d="M429.141 122.937L467.058 168.918C468.149 170.232 470.116 170.369 471.378 169.219L498.003 144.961L460.542 100.818C459.025 99.0305 456.798 98 454.453 98H408.341C409.234 98.0001 410.12 98.3968 410.712 99.1606L429.141 122.937Z"
        fill={colorPrimaryDark}
      />
      <path
        d="M408.341 98H408.183L408.186 98.004C408.237 98.0013 408.289 98 408.341 98Z"
        fill={colorPrimaryDark}
      />
      <path
        d="M406.393 98.721C407.695 97.606 409.664 97.8077 410.712 99.1633L429.141 123L287.318 244.087C285.872 245.322 284.033 246 282.132 246H234.53L234.55 245.983C235.353 246.062 236.187 245.818 236.839 245.236L263.577 221.345L263.461 221.208L406.393 98.721Z"
        fill={colorPrimary}
      />
      <path
        d="M236.837 245.235C235.575 246.365 233.631 246.223 232.546 244.922L194.494 198.854L175.588 175.129C175.019 174.415 174.194 174.032 173.353 174.002L173.351 174H219.852C222.199 174 224.427 175.035 225.944 176.829L263.56 221.317L236.837 245.235Z"
        fill={colorPrimaryDark}
      />
      <path
        d="M175.593 175.135C174.533 173.805 172.581 173.622 171.291 174.73L4.09013 318.484C2.68329 319.693 3.53868 322 5.394 322H47.5627C49.4695 322 51.3136 321.319 52.7627 320.08L194.494 198.854L175.593 175.135Z"
        fill={colorPrimary}
      />
    </Group>
  );
};

export const ListZigzagDown: ComponentType<ListZigzagDownProps> =
  createListZigzag({
    arrowHeight: ARROW_HEIGHT_DOWN,
    presetRatios: PRESET_RATIOS_DOWN,
    Arrow: ArrowDown,
  });

export const ListZigzagUp: ComponentType<ListZigzagUpProps> = createListZigzag({
  arrowHeight: ARROW_HEIGHT_UP,
  presetRatios: PRESET_RATIOS_UP,
  Arrow: ArrowUp,
});

registerStructure('list-zigzag-down', {
  component: ListZigzagDown,
  composites: ['title', 'item'],
});

registerStructure('list-zigzag-up', {
  component: ListZigzagUp,
  composites: ['title', 'item'],
});
