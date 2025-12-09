import EventEmitter from 'eventemitter3';
import { cloneDeep } from 'lodash-es';
import { Editor, type IEditor } from '../editor';
import {
  exportToPNGString,
  exportToSVGString,
  type ExportOptions,
} from '../exporter';
import { renderSVG } from '../jsx';
import {
  InfographicOptions,
  ParsedInfographicOptions,
  parseOptions,
} from '../options';
import { Renderer } from '../renderer';
import { IEventEmitter } from '../types';
import { getTypes, parseSVG } from '../utils';
import { DEFAULT_OPTIONS } from './options';
import { mergeOptions } from './utils';

export class Infographic {
  rendered: boolean = false;

  private emitter: IEventEmitter = new EventEmitter();

  private node: SVGSVGElement | null = null;

  private editor?: IEditor;

  private options: InfographicOptions;
  private parsedOptions: ParsedInfographicOptions;

  constructor(options: InfographicOptions) {
    this.options = {
      ...options,
      data: cloneDeep(options.data),
      elements: cloneDeep(options.elements || []),
    };
    this.parsedOptions = parseOptions(
      mergeOptions(DEFAULT_OPTIONS, this.options),
    );
  }

  getOptions() {
    return this.options;
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
    if (this.options.editable) {
      this.editor = new Editor(this.emitter, this.node, this.parsedOptions);
    }

    this.rendered = true;
    this.emitter.emit('rendered', { node: this.node, options: this.options });
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

  on(event: string, listener: (...args: any[]) => void) {
    this.emitter.on(event, listener);
  }

  off(event: string, listener: (...args: any[]) => void) {
    this.emitter.off(event, listener);
  }

  destroy() {
    this.editor?.destroy();
    this.node?.remove();
    this.node = null;
    this.rendered = false;
    this.emitter.emit('destroyed');
    this.emitter.removeAllListeners();
  }
}
