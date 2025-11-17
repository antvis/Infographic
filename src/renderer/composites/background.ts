import { createElement } from '../../utils';
import { ElementTypeEnum } from '../constants';

export function renderBackground(
  svg: SVGSVGElement,
  background?: string,
): void {
  const container = svg.parentElement;
  if (container) container.style.backgroundColor = background || 'none';
  const element = svg.querySelector('#background');

  if (!background) {
    return element?.remove();
  }

  svg.style.backgroundColor = background;

  if (element) {
    element.setAttribute('fill', background);
  } else if (svg.viewBox?.baseVal) {
    const { x, y, width, height } = svg.viewBox.baseVal;

    const rect = createElement('rect', {
      x,
      y,
      width,
      height,
      fill: background,
      'data-element-type': ElementTypeEnum.Background,
    });
    svg.prepend(rect);
  }
}
