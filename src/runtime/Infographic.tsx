import EventEmitter from 'eventemitter3';
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
import { parseSyntax } from '../syntax';
import { IEventEmitter } from '../types';
import { getTypes, parseSVG } from '../utils';
import { DEFAULT_OPTIONS } from './options';
import {
  cloneOptions,
  isCompleteParsedInfographicOptions,
  mergeOptions,
} from './utils';

export class Infographic {
  rendered: boolean = false;

  private emitter: IEventEmitter = new EventEmitter();

  private node: SVGSVGElement | null = null;

  private editor?: IEditor;

  private options!: Partial<InfographicOptions>;
  private parsedOptions!: Partial<ParsedInfographicOptions>;

  constructor(options: string | Partial<InfographicOptions>) {
    this.setOptions(options);
  }

  getOptions() {
    return this.options;
  }

  private setOptions(options: string | Partial<InfographicOptions>) {
    const parsedOptions = parseSyntaxOptions(options);
    this.options = mergeOptions(this.options || {}, parsedOptions);
    this.parsedOptions = parseOptions(
      mergeOptions(DEFAULT_OPTIONS, this.options),
    );
  }

  /**
   * Render the infographic into the container
   */
  render(options?: string | Partial<InfographicOptions>) {
    if (options) this.setOptions(options);

    const parsedOptions = this.parsedOptions;
    if (!isCompleteParsedInfographicOptions(parsedOptions)) {
      return console.error('Incomplete options');
    }

    const { container } = this.parsedOptions;
    const template = this.compose(parsedOptions);
    const renderer = new Renderer(parsedOptions, template);
    this.node = renderer.render();
    container?.replaceChildren(this.node);
    this.editor?.destroy();
    this.editor = undefined;
    if (this.options.editable) {
      this.editor = new Editor(this.emitter, this.node, parsedOptions);
    }

    this.rendered = true;
    this.emitter.emit('rendered', { node: this.node, options: this.options });
  }

  /**
   * Compose the SVG template
   */
  compose(parsedOptions: ParsedInfographicOptions): SVGSVGElement {
    const { design, data } = parsedOptions;
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
        options={parsedOptions}
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
    const parsedOptions = this.parsedOptions;
    if (!isCompleteParsedInfographicOptions(parsedOptions)) {
      return console.error('Incomplete options');
    }
    const design = parsedOptions.design;
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

function parseSyntaxOptions(
  input: string | Partial<InfographicOptions>,
): Partial<InfographicOptions> {
  if (typeof input === 'string') {
    const { options, errors, warnings } = parseSyntax(input);
    if (warnings?.length) {
      warnings.forEach((warning) => {
        console.warn(
          `[Infographic Syntax Warning] ${warning.message} at line ${warning.line}`,
        );
      });
    }
    if (errors?.length) {
      errors.forEach((error) => {
        console.error(
          `[Infographic Syntax Error] ${error.message} at line ${error.line}`,
        );
      });
    }
    return options;
  }

  return cloneOptions(input);
}
