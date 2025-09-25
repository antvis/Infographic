/** @jsxImportSource @antv/infographic-jsx */
import { renderSVG } from '@antv/infographic-jsx';
import {
  InfographicOptions,
  ParsedInfographicOptions,
  parseOptions,
} from '../options';
import { Renderer } from '../renderer';
import { parseSVG } from '../utils';

export class Infographic {
  private parsedOptions: ParsedInfographicOptions;

  constructor(private options: InfographicOptions) {
    this.parsedOptions = parseOptions(this.options);
  }

  render() {
    const { container } = this.parsedOptions;
    const template = this.compose();
    const renderer = new Renderer(this.parsedOptions, template);

    const infographic = renderer.render();
    container.replaceChildren(infographic);
  }

  compose(): SVGSVGElement {
    const { design, data } = this.parsedOptions;
    const { title, item, items, structure } = design;
    const { component: Structure, props: structureProps } = structure;
    const Title = title.component;
    const Item = item.component;
    const Items = items.map((it) => it.component);

    const svg = renderSVG(
      <Structure
        data={data}
        Title={Title}
        Item={Item}
        Items={Items}
        options={this.parsedOptions}
        {...structureProps}
      />,
    );

    Object.assign(globalThis, { __svg__: svg });

    const template = parseSVG(svg);
    if (!template) {
      throw new Error('Failed to parse SVG template');
    }
    return template;
  }
}
