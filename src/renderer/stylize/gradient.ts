import tinycolor from 'tinycolor2';
import { createElement, getOrCreateDefs, hasColor } from '../../utils';
import type { GradientConfig } from '../types';
import { getSafetyId } from '../utils';

export function applyGradientStyle(
  node: SVGElement,
  svg: SVGSVGElement,
  config: GradientConfig,
  attr: 'fill' | 'stroke',
) {
  const currentColor = node.getAttribute(attr)!;

  const actualConfig = inferGradientConfig(currentColor, config);

  const { type, colors = [] } = actualConfig;

  const size = colors.length - 1;
  const stops = colors.map((color, index) => {
    if (typeof color === 'string') {
      return createElement('stop', {
        offset: `${index / size}`,
        'stop-color': color,
      });
    } else {
      return createElement('stop', {
        offset: `${color.offset}`,
        'stop-color': color.color,
      });
    }
  });

  const id = getGradientId(config);

  if (type === 'linear-gradient') {
    const { angle = 0 } = actualConfig;
    const [[x1, y1], [x2, y2]] = angleToUnitVector(angle);
    const linearGradient = createElement('linearGradient', {
      id,
      x1,
      y1,
      x2,
      y2,
    });
    stops.forEach((stop) => linearGradient.appendChild(stop));

    upsertGradient(svg, id, linearGradient);
  } else if (type === 'radial-gradient') {
    const radialGradient = createElement('radialGradient', {
      id,
    });
    stops.forEach((stop) => radialGradient.appendChild(stop));

    upsertGradient(svg, id, radialGradient);
  }

  const fill = node.getAttribute('fill');
  const stroke = node.getAttribute('stroke');

  if (hasColor(fill)) node.setAttribute('fill', `url(#${id})`);
  if (hasColor(stroke)) node.setAttribute('stroke', `url(#${id})`);
}

function upsertGradient(svg: SVGSVGElement, id: string, gradient: SVGElement) {
  const defs = getOrCreateDefs(svg);
  gradient.setAttribute('id', id);

  const exist = defs.querySelector(`#${id}`);

  if (exist) exist.replaceWith(gradient);
  else defs.appendChild(gradient);
}

function inferGradientConfig(
  currentColor: string,
  config: GradientConfig,
): GradientConfig {
  if (config.colors?.length || !currentColor) return config;

  const tc = tinycolor(currentColor);
  const inferConfig = { ...config };

  inferConfig.colors = tc.isDark()
    ? [currentColor, tc.lighten(20).toHexString()]
    : [tc.darken(20).toHexString(), currentColor];

  if (!('angle' in config) && inferConfig.type === 'linear-gradient') {
    inferConfig.angle = 225;
  }

  return inferConfig;
}

function getGradientId(config: GradientConfig) {
  const { type, colors = [] } = config;

  const colorId = getSafetyId(
    colors
      .map((color) => {
        if (typeof color === 'string') return color;
        return `${color.color}_${color.offset}`;
      })
      .join('-'),
  );

  if (type === 'linear-gradient') {
    const { angle = 0 } = config;
    return `${type}-${colorId}-${angle}`;
  }

  return `${type}-${colorId}`;
}

/**
 * 将角度转为单位向量（屏幕坐标系）
 * 0 度为 x 轴正方向
 * 90 度为 y 轴正方向
 * 返回 x1,y1,x2,y2 供 <linearGradient> 使用
 */
function angleToUnitVector(
  angle: number,
): [[number, number], [number, number]] {
  const radians = (Math.PI / 180) * angle;
  const x = Math.cos(radians);
  const y = Math.sin(radians);

  return [
    [0.5 - x / 2, 0.5 - y / 2], // 起点
    [0.5 + x / 2, 0.5 + y / 2], // 终点
  ];
}
