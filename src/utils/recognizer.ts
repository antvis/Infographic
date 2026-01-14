import { COMPONENT_ROLE, ElementTypeEnum } from '../constants';
import { Element, GeometryElement, TextElement } from '../types';
import { getElementByRole, getElementRole } from './element';
import { getTextEntity } from './text';

const is = (element: SVGElement, role: string) => {
  return element?.dataset?.elementType === role;
};
const isTagName = (element: HTMLElement | SVGElement, tagName: string) => {
  return element.tagName.toLowerCase() === tagName.toLowerCase();
};

export const isSVG = (element: any): element is SVGSVGElement =>
  element instanceof SVGElement && isTagName(element, 'svg');
export const isTitle = (element: SVGElement) => is(element, 'title');
export const isDesc = (element: SVGElement) => is(element, 'desc');
export const isShape = (element: SVGElement) => is(element, 'shape');
export const isShapesGroup = (element: SVGElement) =>
  is(element, 'shapes-group');
export const isIllus = (element: SVGElement) => is(element, 'illus');
export const isText = (element: SVGElement): element is SVGTextElement =>
  element instanceof SVGElement && isTagName(element, 'text');
export const isGroup = (element: SVGElement): element is SVGGElement =>
  element instanceof SVGElement && isTagName(element, 'g');
export const isItemIcon = (element: SVGElement) => is(element, 'item-icon');
export const isItemIconGroup = (element: SVGElement) =>
  is(element, 'item-icon-group');
export const isItemLabel = (element: SVGElement) => is(element, 'item-label');
export const isItemDesc = (element: SVGElement) => is(element, 'item-desc');
export const isItemValue = (element: SVGElement) => is(element, 'item-value');
export const isItemIllus = (element: SVGElement) => is(element, 'item-illus');
export const isEditArea = (element: SVGElement) => is(element, 'edit-area');
export const isBtnsGroup = (element: SVGElement) => is(element, 'btns-group');
export const isBtnAdd = (element: SVGElement) => is(element, 'btn-add');
export const isBtnRemove = (element: SVGElement) => is(element, 'btn-remove');
export const isRoughElement = (element: SVGElement) =>
  is(element, 'rough-element');
export const isRoughVolume = (element: SVGElement) =>
  is(element, 'rough-volume');

export function isForeignObjectElement(
  element: any,
): element is SVGForeignObjectElement {
  return isTagName(element, 'foreignObject');
}

export function isTextEntity(element: any): element is HTMLSpanElement {
  return isTagName(element, 'SPAN');
}

export function isEditableText(node: SVGElement): node is TextElement {
  const role = getElementRole(node);
  return [
    ElementTypeEnum.Title,
    ElementTypeEnum.Desc,
    ElementTypeEnum.ItemLabel,
    ElementTypeEnum.ItemDesc,
  ].includes(role);
}

export function isEditingText(element: SVGElement | null): boolean {
  if (!element) return false;
  if (!isEditableText(element)) return false;

  const span = getTextEntity(element);
  if (!span) return false;
  return span.hasAttribute('contenteditable');
}

export function isGeometryElement(
  element: Element,
): element is GeometryElement {
  const tagName = element.tagName.toLowerCase();
  return [
    'rect',
    'circle',
    'ellipse',
    'line',
    'polygon',
    'polyline',
    'path',
  ].includes(tagName);
}

export function isIconElement(element: SVGElement): boolean {
  return isItemIcon(element) || isItemIconGroup(element);
}

/**
 * 对于编辑器插件、交互挂载的DOM元素，识别其是否为信息图组件的一部分
 * 在元素中操作时不会触发编辑器的取消激活行为
 */
export function isInfographicComponent(element: HTMLElement): boolean {
  let current: HTMLElement | null = element;
  while (current) {
    if (getElementByRole(current, COMPONENT_ROLE)) {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}
