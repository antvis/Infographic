import {
  ExportOptions,
  exportToPNGString,
  exportToSVGString,
} from '../exporter';
import { renderSVG } from '../jsx';
import {
  InfographicOptions,
  ParsedInfographicOptions,
  parseOptions,
} from '../options';
import { Renderer } from '../renderer';
import { getTypes, parseSVG } from '../utils';

export class Infographic {
  private node: SVGSVGElement | null = null;

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

    this.node = renderer.render();
    container.replaceChildren(this.node);
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

  /**
   * Export the infographic to data URL
   * @param options Export option
   * @returns Data URL string of the exported infographic
   * @description This method need to be called after `render()` and in a browser environment.
   */
  async toDataURL(options?: ExportOptions): Promise<string> {
    if (!this.node) {
      throw new Error('Infographic is not rendered yet.');
    }
    if (options?.type === 'svg') {
      return await exportToSVGString(this.node, options);
    }
    return await exportToPNGString(this.node, options);
  }

  destroy() {
    this.node?.remove();
    this.node = null;
  }
}
