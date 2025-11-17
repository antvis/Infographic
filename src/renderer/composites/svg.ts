import type { ParsedInfographicOptions } from '../../options';
import { DEFAULT_FONT } from '../fonts';

export function renderSVG(
  svg: SVGSVGElement,
  options: ParsedInfographicOptions,
) {
  const { themeConfig } = options;
  const { 'font-family': fontFamily = DEFAULT_FONT } =
    themeConfig.base?.text || {};
  svg.setAttribute('font-family', fontFamily);
}
