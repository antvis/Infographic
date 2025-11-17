import { renderSVG } from '../jsx';
import {
  InfographicOptions,
  ParsedInfographicOptions,
  parseOptions,
} from '../options';
import { Renderer } from '../renderer';
import { getTypes, parseSVG } from '../utils';

export class Infographic {
  private parsedOptions: ParsedInfographicOptions;

  constructor(private options: InfographicOptions) {
    this.parsedOptions = parseOptions(this.options);
  }

  /**
   * Render the infographic into the container
   */
  render() {
    const { container } = this.parsedOptions;
    const template = this.compose();
    const renderer = new Renderer(this.parsedOptions, template);

    const infographic = renderer.render();
    container.replaceChildren(infographic);
  }

  /**
   * Compose the SVG template
   */
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

    const template = parseSVG(svg);
    if (!template) {
      throw new Error('Failed to parse SVG template');
    }
    return template;
  }

  getTypes() {
    const design = this.parsedOptions.design;
    const structure = design.structure.composites || [];
    const items = design.items.map((it) => it.composites || []);
    return getTypes({ structure, items });
  }
}
