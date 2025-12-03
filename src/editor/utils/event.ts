import { Element, IconElement, TextElement } from '../../types';
import {
  isEditArea,
  isForeignObjectElement,
  isItemIcon,
  isItemIconGroup,
  isRoughElement,
  isRoughVolume,
  isTextEntity,
} from '../../utils';

export function getEventTarget(element: SVGElement | null): Element | null {
  if (!element) return null;
  const preprocess = [getRoughEventTarget];

  let target = element as Element;

  for (const fn of preprocess) {
    const result = fn(target);
    if (result) {
      target = result;
      break;
    }
  }

  const recognizers = [getTextEventTarget, getIconEventTarget];

  for (const fn of recognizers) {
    const result = fn(target);
    if (result) {
      return result;
    }
  }

  if (isEditArea(target)) {
    return target;
  }

  return null;
}

const getRoughEventTarget = (element: SVGElement): Element | null => {
  const is = (ele: SVGElement | null) => {
    if (!ele) return false;
    return isRoughElement(ele) || isRoughVolume(ele);
  };

  if (is(element)) {
    return element.parentElement as unknown as Element;
  }

  if (is(element.parentElement as unknown as SVGElement)) {
    return element.parentElement?.parentElement as unknown as Element;
  }

  return null;
};

const getTextEventTarget = (element: SVGElement): TextElement | null => {
  if (isTextEntity(element) && isForeignObjectElement(element.parentElement)) {
    return element.parentElement as unknown as TextElement;
  }
  return null;
};

const getIconEventTarget = (element: SVGElement): IconElement | null => {
  const parent = element.parentElement as unknown as SVGElement;

  if (isItemIconGroup(parent)) {
    return parent as unknown as IconElement;
  }

  if (isItemIcon(element)) {
    return element as unknown as IconElement;
  }

  return null;
};
