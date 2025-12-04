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
});
