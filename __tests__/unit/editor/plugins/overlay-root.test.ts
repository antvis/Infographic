import { afterEach, describe, expect, it, vi } from 'vitest';

import { ElementTypeEnum } from '../../../../src/constants/element';
import { EditBar } from '../../../../src/editor/plugins/edit-bar/edit-bar';
import { ResetViewBox } from '../../../../src/editor/plugins/reset-viewbox';
import { createTextElement } from '../../../../src/utils/text';

function createSvgInShadowRoot() {
  const host = document.createElement('div');
  document.body.appendChild(host);

  const shadowRoot = host.attachShadow({ mode: 'open' });
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('width', '100');
  svg.setAttribute('height', '100');
  shadowRoot.appendChild(svg);

  return { host, shadowRoot, svg };
}

describe('editor overlay roots', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.head.querySelector('#infographic-edit-bar-icon-btn-style')?.remove();
    document.head.querySelector('#infographic-color-picker-style')?.remove();
    document.head.querySelector('#infographic-edit-popover-style')?.remove();
    document.head.querySelector('#infographic-font-family-list-style')?.remove();
    document.head
      .querySelector('#infographic-reset-viewbox-btn-style')
      ?.remove();
  });

  it('uses the custom container root for edit-bar child overlays', () => {
    const { shadowRoot, svg } = createSvgInShadowRoot();
    const overlayHost = document.createElement('div');
    document.body.appendChild(overlayHost);

    const text = createTextElement('Hello', {
      width: '120',
      height: '24',
      fill: '#000000',
      'font-family': 'Arial',
      'font-size': '14',
      'data-horizontal-align': 'LEFT',
      'data-vertical-align': 'TOP',
    });
    text.setAttribute('data-element-type', ElementTypeEnum.ItemLabel);
    svg.appendChild(text);

    const plugin = new EditBar({ getContainer: overlayHost });
    plugin.init({
      emitter: { on: vi.fn(), off: vi.fn(), emit: vi.fn() } as any,
      editor: { getDocument: () => svg } as any,
      commander: { execute: vi.fn(), executeBatch: vi.fn() } as any,
      plugin: {} as any,
      state: {} as any,
    });

    const items = (plugin as any).getTextEditItems(text);

    expect(items).toHaveLength(4);
    expect(document.getElementById('infographic-edit-bar-icon-btn-style')).toBeTruthy();
    expect(document.getElementById('infographic-color-picker-style')).toBeTruthy();
    expect(document.getElementById('infographic-edit-popover-style')).toBeTruthy();
    expect(document.getElementById('infographic-font-family-list-style')).toBeTruthy();
    expect(
      shadowRoot.querySelector('#infographic-edit-bar-icon-btn-style'),
    ).toBeNull();
    expect(shadowRoot.querySelector('#infographic-color-picker-style')).toBeNull();
    expect(
      shadowRoot.querySelector('#infographic-edit-popover-style'),
    ).toBeNull();
    expect(
      shadowRoot.querySelector('#infographic-font-family-list-style'),
    ).toBeNull();

    plugin.destroy();
  });

  it('defaults edit-bar child overlays to the svg shadow root', () => {
    const { shadowRoot, svg } = createSvgInShadowRoot();

    const text = createTextElement('Hello', {
      width: '120',
      height: '24',
      fill: '#000000',
      'font-family': 'Arial',
      'font-size': '14',
      'data-horizontal-align': 'LEFT',
      'data-vertical-align': 'TOP',
    });
    text.setAttribute('data-element-type', ElementTypeEnum.ItemLabel);
    svg.appendChild(text);

    const plugin = new EditBar();
    plugin.init({
      emitter: { on: vi.fn(), off: vi.fn(), emit: vi.fn() } as any,
      editor: { getDocument: () => svg } as any,
      commander: { execute: vi.fn(), executeBatch: vi.fn() } as any,
      plugin: {} as any,
      state: {} as any,
    });

    const items = (plugin as any).getTextEditItems(text);

    expect(items).toHaveLength(4);
    expect(
      shadowRoot.querySelector('#infographic-edit-bar-icon-btn-style'),
    ).toBeTruthy();
    expect(
      shadowRoot.querySelector('#infographic-color-picker-style'),
    ).toBeTruthy();
    expect(
      shadowRoot.querySelector('#infographic-edit-popover-style'),
    ).toBeTruthy();
    expect(
      shadowRoot.querySelector('#infographic-font-family-list-style'),
    ).toBeTruthy();
    expect(
      document.getElementById('infographic-edit-bar-icon-btn-style'),
    ).toBeNull();
    expect(document.getElementById('infographic-color-picker-style')).toBeNull();
    expect(document.getElementById('infographic-edit-popover-style')).toBeNull();
    expect(document.getElementById('infographic-font-family-list-style')).toBeNull();

    plugin.destroy();
  });

  it('injects reset-viewbox styles into the custom container root', () => {
    const { shadowRoot, svg } = createSvgInShadowRoot();
    const overlayHost = document.createElement('div');
    document.body.appendChild(overlayHost);

    const plugin = new ResetViewBox({ getContainer: overlayHost });
    plugin.init({
      emitter: { on: vi.fn(), off: vi.fn(), emit: vi.fn() } as any,
      editor: {
        getDocument: () => svg,
        registerSync: vi.fn(() => vi.fn()),
      } as any,
      commander: { execute: vi.fn() } as any,
      plugin: {} as any,
      state: { getOptions: () => ({ padding: [0, 0, 0, 0] }) } as any,
    });

    (plugin as any).handleViewBoxChange('10 10 50 50');

    const button = (plugin as any).resetButton as HTMLButtonElement | undefined;
    expect(button).toBeTruthy();
    expect(overlayHost.contains(button as HTMLButtonElement)).toBe(true);
    expect(document.getElementById('infographic-reset-viewbox-btn-style')).toBeTruthy();
    expect(
      shadowRoot.querySelector('#infographic-reset-viewbox-btn-style'),
    ).toBeNull();

    plugin.destroy();
  });

  it('defaults reset-viewbox button and styles to the svg shadow root', () => {
    const { shadowRoot, svg } = createSvgInShadowRoot();

    const plugin = new ResetViewBox();
    plugin.init({
      emitter: { on: vi.fn(), off: vi.fn(), emit: vi.fn() } as any,
      editor: {
        getDocument: () => svg,
        registerSync: vi.fn(() => vi.fn()),
      } as any,
      commander: { execute: vi.fn() } as any,
      plugin: {} as any,
      state: { getOptions: () => ({ padding: [0, 0, 0, 0] }) } as any,
    });

    (plugin as any).handleViewBoxChange('10 10 50 50');

    const button = (plugin as any).resetButton as HTMLButtonElement | undefined;
    expect(button).toBeTruthy();
    expect(shadowRoot.contains(button as HTMLButtonElement)).toBe(true);
    expect(
      shadowRoot.querySelector('#infographic-reset-viewbox-btn-style'),
    ).toBeTruthy();
    expect(
      document.getElementById('infographic-reset-viewbox-btn-style'),
    ).toBeNull();

    plugin.destroy();
  });
});
