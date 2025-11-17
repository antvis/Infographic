const is = (element: SVGElement, role: string) => {
  return element.dataset.elementType === role;
};
export const isSVG = (element: any): element is SVGSVGElement =>
  element instanceof SVGElement && element.tagName === 'svg';
export const isTitle = (element: SVGElement) => is(element, 'title');
export const isDesc = (element: SVGElement) => is(element, 'desc');
export const isShape = (element: SVGElement) => is(element, 'shape');
export const isShapesGroup = (element: SVGElement) =>
  is(element, 'shapes-group');
export const isIllus = (element: SVGElement) => is(element, 'illus');
export const isText = (element: SVGElement): element is SVGTextElement =>
  element instanceof SVGElement && element.tagName === 'text';
export const isGroup = (element: SVGElement): element is SVGGElement =>
  element instanceof SVGElement && element.tagName === 'g';
export const isItemIcon = (element: SVGElement) => is(element, 'item-icon');
export const isItemLabel = (element: SVGElement) => is(element, 'item-label');
export const isItemDesc = (element: SVGElement) => is(element, 'item-desc');
export const isItemValue = (element: SVGElement) => is(element, 'item-value');
export const isItemIllus = (element: SVGElement) => is(element, 'item-illus');
export const isEditArea = (element: SVGElement) => is(element, 'edit-area');
export const isBtnsGroup = (element: SVGElement) => is(element, 'btns-group');
export const isBtnAdd = (element: SVGElement) => is(element, 'btn-add');
export const isBtnRemove = (element: SVGElement) => is(element, 'btn-remove');
