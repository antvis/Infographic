import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ElementTypeEnum } from '../../../src/constants';
import { embedFonts } from '../../../src/exporter/font';
import { exportToSVG, exportToSVGString } from '../../../src/exporter/svg';

vi.mock('../../../src/exporter/font', () => ({
  embedFonts: vi.fn().mockResolvedValue(undefined),
}));

const svgNS = 'http://www.w3.org/2000/svg';

describe('exporter/svg', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('cleans svg artifacts and embeds external icons', async () => {
    const defs = document.createElementNS(svgNS, 'defs');
    const symbol = document.createElementNS(svgNS, 'symbol');
    symbol.id = 'icon-star';
    defs.appendChild(symbol);
    document.body.appendChild(defs);

    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 10 20');

    const use = document.createElementNS(svgNS, 'use');
    use.setAttribute('href', '#icon-star');
    svg.appendChild(use);

    const btnGroup = document.createElementNS(svgNS, 'g');
    btnGroup.setAttribute('data-element-type', ElementTypeEnum.BtnsGroup);
    svg.appendChild(btnGroup);

    const btnIconDefs = document.createElementNS(svgNS, 'defs');
    btnIconDefs.setAttribute('data-element-type', 'btn-icon-defs');
    svg.appendChild(btnIconDefs);

    const transient = document.createElementNS(svgNS, 'g');
    transient.setAttribute('data-element-type', 'transient-container');
    svg.appendChild(transient);

    const group = document.createElementNS(svgNS, 'g');
    group.setAttribute('x', '5');
    group.setAttribute('y', '6');
    group.setAttribute('width', '7');
    group.setAttribute('height', '8');
    const child = document.createElementNS(svgNS, 'rect');
    child.dataset.example = 'remove-me';
    group.appendChild(child);
    svg.appendChild(group);

    const exported = await exportToSVG(svg);

    expect(exported).not.toBe(svg);
    expect(exported.getAttribute('width')).toBe('10');
    expect(exported.getAttribute('height')).toBe('20');
    expect(
      exported.querySelector('[data-element-type="btn-icon-defs"]'),
    ).toBeNull();
    expect(
      exported.querySelector(
        `[data-element-type="${ElementTypeEnum.BtnsGroup}"]`,
      ),
    ).toBeNull();
    expect(
      exported.querySelector('[data-element-type="transient-container"]'),
    ).toBeNull();

    const cleanedGroup = exported.querySelector('g');
    expect(cleanedGroup?.getAttribute('x')).toBeNull();
    expect(cleanedGroup?.getAttribute('y')).toBeNull();
    expect(cleanedGroup?.getAttribute('width')).toBeNull();
    expect(cleanedGroup?.getAttribute('height')).toBeNull();

    const exportedChild = exported.querySelector('rect');
    expect(exportedChild && Object.keys(exportedChild.dataset)).toHaveLength(0);

    expect(exported.querySelector('#icon-star')).toBeTruthy();

    expect(embedFonts).toHaveBeenCalledWith(expect.any(SVGSVGElement), true);
  });

  it('returns an encoded svg data url', async () => {
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 1 1');

    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('r', '1');
    svg.appendChild(circle);

    const uri = await exportToSVGString(svg);
    expect(uri.startsWith('data:image/svg+xml;charset=utf-8,')).toBe(true);

    const decoded = decodeURIComponent(
      uri.replace('data:image/svg+xml;charset=utf-8,', ''),
    );
    expect(decoded).toContain('<svg');
    expect(decoded).toContain('width="1"');
    expect(decoded).toContain('height="1"');
  });

  it('inlines use elements when removeIds is enabled', async () => {
    const defs = document.createElementNS(svgNS, 'defs');
    const symbol = document.createElementNS(svgNS, 'symbol');
    symbol.id = 'icon-star';
    symbol.setAttribute('viewBox', '0 0 10 10');
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', 'M0 0 L10 0 L5 10 Z');
    symbol.appendChild(path);
    defs.appendChild(symbol);
    document.body.appendChild(defs);

    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 10 10');

    const use = document.createElementNS(svgNS, 'use');
    use.setAttribute('href', '#icon-star');
    use.setAttribute('x', '1');
    use.setAttribute('y', '2');
    use.setAttribute('width', '8');
    use.setAttribute('height', '8');
    svg.appendChild(use);

    const exported = await exportToSVG(svg, { removeIds: true });

    expect(exported.querySelector('use')).toBeNull();
    const inlined = exported.querySelector('svg > svg');
    expect(inlined).toBeTruthy();
    expect(inlined?.getAttribute('x')).toBe('1');
    expect(inlined?.getAttribute('y')).toBe('2');
    expect(inlined?.getAttribute('width')).toBe('8');
    expect(inlined?.getAttribute('height')).toBe('8');
    expect(inlined?.querySelector('path')).toBeTruthy();
  });

  it('inlines defs references when removeIds is enabled', async () => {
    const defs = document.createElementNS(svgNS, 'defs');
    const gradient = document.createElementNS(svgNS, 'linearGradient');
    gradient.setAttribute('id', 'grad-1');
    const stop1 = document.createElementNS(svgNS, 'stop');
    stop1.setAttribute('offset', '0');
    stop1.setAttribute('stop-color', '#fff');
    const stop2 = document.createElementNS(svgNS, 'stop');
    stop2.setAttribute('offset', '1');
    stop2.setAttribute('stop-color', '#000');
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);

    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 10 10');
    svg.appendChild(defs);

    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('width', '10');
    rect.setAttribute('height', '10');
    rect.setAttribute('fill', 'url(#grad-1)');
    svg.appendChild(rect);

    const exported = await exportToSVG(svg, { removeIds: true });

    const exportedRect = exported.querySelector('rect');
    expect(exported.querySelector('defs')).toBeNull();
    expect(exportedRect?.getAttribute('fill')).toContain('data:image/svg+xml');
    expect(exportedRect?.getAttribute('fill')).not.toContain('url(#');
  });
});
