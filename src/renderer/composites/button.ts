import {
  createElement,
  getAttributes,
  parseSVG,
  setAttributes,
} from '../../utils';
import { ElementTypeEnum } from '../constants';

const ADD_ICON_ID = 'btn-add-icon';
const REMOVE_ICON_ID = 'btn-remove-icon';

export function renderButtonsGroup(svg: SVGSVGElement, group: SVGGElement) {
  setAttributes(group, { display: 'none' });

  const addBtns = group.querySelectorAll<SVGRectElement>('[id^="btn-add-"]');
  const removeBtns = group.querySelectorAll<SVGRectElement>(
    '[id^="btn-remove-"]',
  );

  defineButtonIcon(svg);
  addBtns.forEach(renderAddButton);
  removeBtns.forEach(renderRemoveButton);
}

function defineButtonIcon(svg: SVGSVGElement) {
  const defs = createElement('defs', { id: 'btn-icon-defs' });

  const addIconSymbol =
    parseSVG(`<symbol class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <path
    d="M512 1024C229.216 1024 0 794.784 0 512S229.216 0 512 0s512 229.216 512 512-229.216 512-512 512z m0-960C264.576 64 64 264.576 64 512s200.576 448 448 448 448-200.576 448-448S759.424 64 512 64z m192 480h-160v160a32 32 0 0 1-64 0v-160h-160a32 32 0 0 1 0-64h160v-160a32 32 0 0 1 64 0v160h160a32 32 0 0 1 0 64z"
    fill="#339900"></path>
</symbol>`);
  if (addIconSymbol) {
    addIconSymbol.setAttribute('id', ADD_ICON_ID);
    defs.appendChild(addIconSymbol);
  }

  const removeIconSymbol =
    parseSVG(`<symbol viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <path d="M874.971429 149.942857C776.228571 54.857143 648.228571 0 512.914286 0S245.942857 54.857143 150.857143 149.942857c-201.142857 201.142857-201.142857 522.971429 0 724.114286C245.942857 969.142857 377.6 1024 512.914286 1024s266.971429-54.857143 362.057143-149.942857c201.142857-201.142857 201.142857-522.971429 0-724.114286m-51.2 672.914286C739.657143 906.971429 629.942857 950.857143 512.914286 950.857143s-226.742857-43.885714-310.857143-128c-171.885714-171.885714-171.885714-449.828571 0-621.714286C286.171429 117.028571 395.885714 73.142857 512.914286 73.142857s226.742857 43.885714 310.857143 128c171.885714 171.885714 171.885714 449.828571 0 621.714286" fill="#E63C33"></path>
  <path d="M772.571429 475.428571H253.257143c-21.942857 0-36.571429 14.628571-36.571429 36.571429 0 10.971429 3.657143 18.285714 10.971429 25.6s14.628571 10.971429 25.6 10.971429H768.914286c21.942857 0 36.571429-14.628571 36.571428-36.571429s-14.628571-36.571429-32.914285-36.571429" fill="#E63C33"></path>
</symbol>`);
  if (removeIconSymbol) {
    removeIconSymbol.setAttribute('id', REMOVE_ICON_ID);
    defs.appendChild(removeIconSymbol);
  }

  svg.prepend(defs);
}

function renderButtonIcon(node: SVGElement, name: string) {
  const {
    id,
    x = 0,
    y = 0,
    width = 0,
    height = 0,
  } = getAttributes(node, ['id', 'x', 'y', 'width', 'height']);

  const group = createElement('g', {
    id,
    class: 'btn-group',
    transform: `translate(${x}, ${y})`,
    'data-element-type': ElementTypeEnum.Button,
  });

  const dataItems = node.getAttribute('data-items');
  if (dataItems) {
    group.setAttribute('data-items', dataItems);
  }

  const r = Math.max(+width!, +height!) / 2;
  const bkg = createElement('circle', {
    cx: r,
    cy: r,
    r,
    fill: '#fff',
    stroke: 'transparent',
  });
  group.appendChild(bkg);

  const icon = createElement('use', {
    href: `#${name}`,
    width,
    height,
  });
  group.appendChild(icon);
  group.style.cursor = 'pointer';
  node.replaceWith(group);
}

function renderAddButton(node: SVGElement) {
  renderButtonIcon(node, ADD_ICON_ID);
}

function renderRemoveButton(node: SVGElement) {
  renderButtonIcon(node, REMOVE_ICON_ID);
}
