import type { DynamicAttributes } from '../../themes';
import type { BaseAttributes } from '../../types';
import { setAttributes, traverse } from '../../utils';
import { parseDynamicAttributes } from '../utils';

export function renderBaseElement(
  svg: SVGSVGElement,
  attrs?: DynamicAttributes<BaseAttributes>,
) {
  if (attrs && Object.keys(attrs).length > 0) {
    traverse(svg, (element) => {
      const parsedAttrs = parseDynamicAttributes(element, attrs);
      setAttributes(element, parsedAttrs);
    });
  }
}
