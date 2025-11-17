import type { ParsedInfographicOptions } from '../../options';

export interface IRenderer {
  getSVG(): SVGSVGElement;
  getOptions(): ParsedInfographicOptions;
  render(): SVGSVGElement;
}
