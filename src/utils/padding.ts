import type { Padding, ParsedPadding } from '../types';
import { isNode } from './is-node';
import { setAttributes } from './svg';
import { getViewBox } from './viewbox';

export function parsePadding(padding: Padding | undefined): ParsedPadding {
  if (!padding) return [0, 0, 0, 0];
  if (typeof padding === 'number') {
    return [padding, padding, padding, padding];
  }
  if (padding.length === 1) {
    return [padding[0], padding[0], padding[0], padding[0]];
  }
  if (padding.length === 2) {
    return [padding[0], padding[1], padding[0], padding[1]];
  }
  if (padding.length === 3) {
    return [padding[0], padding[1], padding[2], padding[1]];
  }
  if (padding.length === 4) {
    return [padding[0], padding[1], padding[2], padding[3]];
  }
  return [0, 0, 0, 0];
}

export function setSVGPadding(svg: SVGSVGElement, padding: ParsedPadding) {
  if (isNode) {
    setSVGPaddingInNode(svg, padding);
  } else {
    if (document.contains(svg)) {
      setSVGPaddingInBrowser(svg, padding);
    } else {
      try {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node === svg || node.contains(svg)) {
                waitForLayout(svg, () => {
                  setSVGPaddingInBrowser(svg, padding);
                });

                observer.disconnect();
              }
            });
          });
        });

        observer.observe(document, {
          childList: true,
          subtree: true,
        });
      } catch {
        setSVGPaddingInNode(svg, padding);
      }
    }
  }
}

function setSVGPaddingInNode(svg: SVGSVGElement, padding: ParsedPadding) {
  const viewBox = getViewBox(svg);
  const [top, right, bottom, left] = padding;

  setAttributes(svg, {
    viewBox: `${viewBox.x - left} ${viewBox.y - top} ${
      viewBox.width + left + right
    } ${viewBox.height + top + bottom}`,
  });
}

function setSVGPaddingInBrowser(svg: SVGSVGElement, padding: ParsedPadding) {
  const bbox = svg.getBBox();
  const clientRect = svg.getBoundingClientRect();
  const scaleX = clientRect.width > 0 ? bbox.width / clientRect.width : 1;
  const scaleY = clientRect.height > 0 ? bbox.height / clientRect.height : 1;

  const [topPx, rightPx, bottomPx, leftPx] = padding;
  const topSvg = topPx * scaleY;
  const rightSvg = rightPx * scaleX;
  const bottomSvg = bottomPx * scaleY;
  const leftSvg = leftPx * scaleX;

  const newX = bbox.x - leftSvg;
  const newY = bbox.y - topSvg;
  const newWidth = bbox.width + leftSvg + rightSvg;
  const newHeight = bbox.height + topSvg + bottomSvg;

  setAttributes(svg, {
    viewBox: `${newX} ${newY} ${newWidth} ${newHeight}`,
  });
}

function waitForLayout(element: SVGSVGElement, callback: () => void) {
  requestAnimationFrame(() => {
    const check = () => {
      const rect = element.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        callback();
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  });
}
