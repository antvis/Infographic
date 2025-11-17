import rough from 'roughjs';
import type { Options as RoughOptions } from 'roughjs/bin/core';
import { createElement, getAttributes, setAttributes } from '../../utils';
import type { RoughConfig } from '../types';

export function applyRoughStyle(
  node: SVGElement,
  svg: SVGSVGElement,
  config: RoughConfig,
) {
  if (!node || !svg) {
    console.warn('Invalid node or svg element');
    return;
  }

  const rc = rough.svg(svg, {
    options: {
      seed: 1000,
    },
  });

  const g = createElement('g');

  if (node.hasAttribute('transform')) {
    g.setAttribute('transform', node.getAttribute('transform') || '');
  }

  const volume = node.cloneNode() as SVGElement;
  setAttributes(volume, {
    opacity: 0.5,
  });
  if (volume.hasAttribute('transform')) {
    volume.removeAttribute('transform');
  }
  volume.classList.add('rough-volume');
  g.appendChild(volume);

  const result = createRoughShape(rc, node, config);
  if (result) {
    const { element, svgAttributes } = result;
    element.classList.add('rough-element');
    element.style.pointerEvents = 'none';
    applySVGAttributes(element, svgAttributes);
    g.appendChild(element);
  }

  if (node.id) {
    g.id = node.id;
    volume.setAttribute('id', `${node.id}-volume`);
    if (result?.element) result.element.setAttribute('id', `${node.id}-rough`);
  }

  const classList = Array.from(node.classList);
  classList.forEach((cls) => {
    if (!g.classList.contains(cls)) {
      g.classList.add(cls);
    }
  });

  Array.from(node.attributes).forEach((attr) => {
    if (attr.name.startsWith('data-')) {
      g.setAttribute(attr.name, attr.value);
    }
  });

  if (g.childElementCount > 0) {
    node.replaceWith(g);
  } else {
    node.remove();
  }
}

function applySVGAttributes(
  element: SVGElement,
  attributes: Record<string, any>,
) {
  if (attributes.opacity !== undefined) {
    element.setAttribute('opacity', String(attributes.opacity));
  }
  if (attributes.fillOpacity !== undefined) {
    element.setAttribute('fill-opacity', String(attributes.fillOpacity));
  }
  if (attributes.strokeOpacity !== undefined) {
    element.setAttribute('stroke-opacity', String(attributes.strokeOpacity));
  }
  if (attributes.strokeLinecap) {
    element.setAttribute('stroke-linecap', attributes.strokeLinecap);
  }
  if (attributes.strokeLinejoin) {
    element.setAttribute('stroke-linejoin', attributes.strokeLinejoin);
  }
  if (attributes.strokeDasharray) {
    element.setAttribute('stroke-dasharray', attributes.strokeDasharray);
  }
  if (attributes.filter) {
    element.setAttribute('filter', attributes.filter);
  }
  if (attributes.clipPath) {
    element.setAttribute('clip-path', attributes.clipPath);
  }
  if (attributes.mask) {
    element.setAttribute('mask', attributes.mask);
  }
}

interface RoughShapeResult {
  element: SVGElement;
  svgAttributes: Record<string, any>;
}

function createRoughShape(
  rc: ReturnType<typeof rough.svg>,
  node: SVGElement,
  config: RoughConfig,
): RoughShapeResult | null {
  const shapeType = node.nodeName.toLowerCase();

  /**
   * 获取节点属性并分离 RoughJS 选项和 SVG 属性
   * @param node SVG 元素
   * @param attrs 需要获取的属性列表
   * @returns 包含形状属性、RoughJS选项和SVG属性的元组
   */
  const getShapeAttrs = (
    node: SVGElement,
    attrs: string[],
  ): [Record<string, any>, RoughOptions, Record<string, any>] => {
    // 获取所有需要的属性
    const allAttrs = getAttributes(
      node,
      [
        ...attrs,
        'fill',
        'fill-opacity',
        'stroke',
        'stroke-opacity',
        'stroke-width',
        'stroke-dasharray',
        'stroke-linecap',
        'stroke-linejoin',
        'opacity',
        'filter',
        'clip-path',
        'mask',
      ],
      true,
    );

    // 分离形状属性、RoughJS选项和SVG属性
    const shapeAttrs: Record<string, any> = {};
    const roughOptions: RoughOptions = { ...config };
    const svgAttributes: Record<string, any> = {};

    // 处理形状特定的属性
    attrs.forEach((attr) => {
      if (allAttrs[attr] !== undefined) {
        shapeAttrs[attr] = allAttrs[attr];
      }
    });

    // 处理样式属性
    const {
      fill,
      'fill-opacity': fillOpacity,
      stroke,
      'stroke-opacity': strokeOpacity,
      'stroke-width': strokeWidth,
      'stroke-dasharray': strokeDasharray,
      'stroke-linecap': strokeLinecap,
      'stroke-linejoin': strokeLinejoin,
      opacity,
      filter,
      'clip-path': clipPath,
      mask,
    } = allAttrs;

    // RoughJS 支持的属性
    roughOptions.fill = fill || 'none';
    roughOptions.stroke =
      stroke || (fill && fill !== 'none' ? fill : 'currentColor');

    if (strokeWidth) {
      roughOptions.strokeWidth = parseFloat(strokeWidth);
    }

    // 处理虚线（RoughJS 支持）
    if (strokeDasharray && strokeDasharray !== 'none') {
      const dashArray = strokeDasharray
        .split(/[\s,]+/)
        .map((v) => parseFloat(v))
        .filter((v) => !isNaN(v));
      if (dashArray.length > 0) {
        roughOptions.strokeLineDash = dashArray;
      }
    }

    // SVG 特定属性（需要设置在生成的元素上）
    if (fillOpacity) {
      svgAttributes.fillOpacity = parseFloat(fillOpacity);
    }
    if (strokeOpacity) {
      svgAttributes.strokeOpacity = parseFloat(strokeOpacity);
    }
    if (opacity) {
      svgAttributes.opacity = parseFloat(opacity);
    }
    if (strokeLinecap) {
      svgAttributes.strokeLinecap = strokeLinecap;
    }
    if (strokeLinejoin) {
      svgAttributes.strokeLinejoin = strokeLinejoin;
    }
    if (strokeDasharray && strokeDasharray !== 'none') {
      svgAttributes.strokeDasharray = strokeDasharray;
    }
    if (filter) {
      svgAttributes.filter = filter;
    }
    if (clipPath) {
      svgAttributes.clipPath = clipPath;
    }
    if (mask) {
      svgAttributes.mask = mask;
    }

    return [shapeAttrs, roughOptions, svgAttributes];
  };

  try {
    let element: SVGElement | null = null;
    let svgAttributes: Record<string, any> = {};

    switch (shapeType) {
      case 'circle': {
        const [attrs, options, svgAttrs] = getShapeAttrs(node, [
          'cx',
          'cy',
          'r',
        ]);
        const cx = parseFloat(attrs.cx as string) || 0;
        const cy = parseFloat(attrs.cy as string) || 0;
        const r = parseFloat(attrs.r as string) || 0;
        element = rc.circle(cx, cy, r * 2, options);
        svgAttributes = svgAttrs;
        break;
      }

      case 'ellipse': {
        const [attrs, options, svgAttrs] = getShapeAttrs(node, [
          'cx',
          'cy',
          'rx',
          'ry',
        ]);
        const cx = parseFloat(attrs.cx as string) || 0;
        const cy = parseFloat(attrs.cy as string) || 0;
        const rx = parseFloat(attrs.rx as string) || 0;
        const ry = parseFloat(attrs.ry as string) || 0;
        element = rc.ellipse(cx, cy, rx * 2, ry * 2, options);
        svgAttributes = svgAttrs;
        break;
      }

      case 'line': {
        const [attrs, options, svgAttrs] = getShapeAttrs(node, [
          'x1',
          'y1',
          'x2',
          'y2',
        ]);
        const x1 = parseFloat(attrs.x1 as string) || 0;
        const y1 = parseFloat(attrs.y1 as string) || 0;
        const x2 = parseFloat(attrs.x2 as string) || 0;
        const y2 = parseFloat(attrs.y2 as string) || 0;
        element = rc.line(x1, y1, x2, y2, options);
        svgAttributes = svgAttrs;
        break;
      }

      case 'rect': {
        const [attrs, options, svgAttrs] = getShapeAttrs(node, [
          'x',
          'y',
          'width',
          'height',
          'rx',
          'ry',
        ]);
        const x = parseFloat(attrs.x as string) || 0;
        const y = parseFloat(attrs.y as string) || 0;
        const width = parseFloat(attrs.width as string) || 0;
        const height = parseFloat(attrs.height as string) || 0;

        // 处理圆角矩形
        const rx = parseFloat(attrs.rx as string) || 0;
        const ry = parseFloat(attrs.ry as string) || 0;

        if (rx > 0 || ry > 0) {
          // 如果有圆角，使用 path 来绘制
          const effectiveRx = rx || ry;
          const effectiveRy = ry || rx;
          const path = createRoundedRectPath(
            x,
            y,
            width,
            height,
            effectiveRx,
            effectiveRy,
          );
          element = rc.path(path, options);
        } else {
          element = rc.rectangle(x, y, width, height, options);
        }
        svgAttributes = svgAttrs;
        break;
      }

      case 'path': {
        const [attrs, options, svgAttrs] = getShapeAttrs(node, ['d']);
        const d = (attrs.d as string) || '';
        if (!d) {
          console.warn('Path element has no d attribute');
          return null;
        }
        element = rc.path(d, options);
        svgAttributes = svgAttrs;
        break;
      }

      case 'polygon': {
        const [attrs, options, svgAttrs] = getShapeAttrs(node, ['points']);
        const points = parsePolygonPoints((attrs.points as string) || '');
        if (points.length < 3) {
          console.warn('Polygon needs at least 3 points');
          return null;
        }
        element = rc.polygon(points, options);
        svgAttributes = svgAttrs;
        break;
      }

      case 'polyline': {
        const [attrs, options, svgAttrs] = getShapeAttrs(node, ['points']);
        const points = parsePolygonPoints((attrs.points as string) || '');
        if (points.length < 2) {
          console.warn('Polyline needs at least 2 points');
          return null;
        }
        element = rc.linearPath(points, options);
        svgAttributes = svgAttrs;
        break;
      }

      default:
        console.warn(`Unsupported shape type: ${shapeType}`);
        return null;
    }

    if (element) {
      return { element, svgAttributes };
    }
    return null;
  } catch (error) {
    console.error(`Error creating rough shape for ${shapeType}:`, error);
    return null;
  }
}

/**
 * 创建圆角矩形的 SVG 路径
 */
function createRoundedRectPath(
  x: number,
  y: number,
  width: number,
  height: number,
  rx: number,
  ry: number,
): string {
  // 限制圆角半径不超过矩形尺寸的一半
  rx = Math.min(rx, width / 2);
  ry = Math.min(ry, height / 2);

  return `
    M ${x + rx} ${y}
    L ${x + width - rx} ${y}
    A ${rx} ${ry} 0 0 1 ${x + width} ${y + ry}
    L ${x + width} ${y + height - ry}
    A ${rx} ${ry} 0 0 1 ${x + width - rx} ${y + height}
    L ${x + rx} ${y + height}
    A ${rx} ${ry} 0 0 1 ${x} ${y + height - ry}
    L ${x} ${y + ry}
    A ${rx} ${ry} 0 0 1 ${x + rx} ${y}
    Z
  `
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 解析多边形/折线的点坐标
 * @param points 点坐标字符串
 * @returns 坐标点数组
 */
function parsePolygonPoints(points: string): [number, number][] {
  if (!points || typeof points !== 'string') {
    return [];
  }

  try {
    // 标准化分隔符：将逗号和多个空格替换为单个空格
    const normalized = points.trim().replace(/,/g, ' ').replace(/\s+/g, ' ');

    // 分割并解析坐标
    const coords = normalized.split(' ').filter(Boolean);
    const result: [number, number][] = [];

    for (let i = 0; i < coords.length - 1; i += 2) {
      const x = parseFloat(coords[i]);
      const y = parseFloat(coords[i + 1]);

      if (isNaN(x) || isNaN(y)) {
        console.warn(
          `Invalid coordinate pair at index ${i}: "${coords[i]}", "${coords[i + 1]}"`,
        );
        continue;
      }

      result.push([x, y]);
    }

    // 如果坐标数量是奇数，警告最后一个坐标被忽略
    if (coords.length % 2 !== 0) {
      console.warn(
        `Odd number of coordinates in points attribute, last value ignored: "${coords[coords.length - 1]}"`,
      );
    }

    return result;
  } catch (error) {
    console.error('Failed to parse polygon points:', points, error);
    return [];
  }
}
