import tinycolor from 'tinycolor2';
import { getAttributes, getOrCreateDefs, hasColor } from '../../utils';
import type { PatternConfig, PatternGenerator } from '../types';
import { getSafetyId } from '../utils';
import * as builtInPatterns from './patterns';

const PATTERNS = new Map<string, PatternGenerator>();

export function registerPattern(name: string, generator: PatternGenerator) {
  if (PATTERNS.has(name)) console.warn(`Pattern ${name} will be overwritten`);
  PATTERNS.set(name, generator);
}

for (const [name, generator] of Object.entries(builtInPatterns)) {
  registerPattern(name, generator);
}

export function applyPatternStyle(
  node: SVGElement,
  svg: SVGSVGElement,
  config: PatternConfig,
) {
  const { pattern, ...restConfig } = config;

  const generator = PATTERNS.get(pattern);
  if (!generator) {
    return console.warn(`Pattern ${pattern} not found`);
  }

  const { fill, stroke } = getAttributes(node, ['fill', 'stroke']);
  const style = {
    backgroundColor: tinycolor('#fff').toHexString(),
    foregroundColor:
      getColorDistance(fill || 'white', '#fff') >
      getColorDistance(stroke || 'white', '#fff')
        ? fill
        : stroke,
    ...restConfig,
  };
  const id = getPatternId({ ...config, ...style });
  upsertPattern(svg, id, generator(style));

  if (hasColor(fill)) {
    node.setAttribute('fill', `url(#${id})`);
    if (!node.getAttribute('stroke') && fill) {
      node.setAttribute('stroke', fill);
    }
  }
}

function upsertPattern(svg: SVGSVGElement, id: string, pattern: SVGElement) {
  const defs = getOrCreateDefs(svg);
  pattern.setAttribute('id', id);

  const exist = defs.querySelector(`pattern#${id}`);

  if (exist) exist.replaceWith(pattern);
  else defs.appendChild(pattern);
}

function getPatternId(config: PatternConfig) {
  const {
    pattern,
    foregroundColor = 'unset',
    backgroundColor = 'unset',
    scale = 'unset',
  } = config;
  return getSafetyId(
    `pattern-${pattern}-${foregroundColor}-${backgroundColor}-${scale}`,
  );
}

function getColorDistance(a: string, b: string) {
  const _a = tinycolor(a).toRgb();
  const _b = tinycolor(b).toRgb();

  return Math.sqrt(
    Math.pow(_b.r - _a.r, 2) +
      Math.pow(_b.g - _a.g, 2) +
      Math.pow(_b.b - _a.b, 2),
  );
}
