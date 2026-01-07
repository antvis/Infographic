import { describe, expect, it } from 'vitest';
import { loadSVGResource } from '../../../../src/resource/loaders/svg';

describe('resource/loaders/svg', () => {
  it('returns null for empty or non-svg input', () => {
    expect(loadSVGResource('')).toBeNull();
    expect(loadSVGResource('   ')).toBeNull();
    expect(loadSVGResource('<div></div>')).toBeNull();
    expect(loadSVGResource('<svgx></svgx>')).toBeNull();
  });

  it('parses svg with attributes and children', () => {
    const data =
      '<svg viewBox="0 0 10 10"><rect width="10" height="10"/></svg>';

    const result = loadSVGResource(data);
    expect(result?.outerHTML).toBe(
      '<symbol viewBox="0 0 10 10"><rect width="10" height="10"/></symbol>',
    );
  });

  it('parses svg with xml declaration', () => {
    const data =
      '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg"></svg>';

    const result = loadSVGResource(data);
    expect(result?.outerHTML).toBe(
      '<symbol xmlns="http://www.w3.org/2000/svg"/>',
    );
  });

  it('parses symbol root input', () => {
    const data = '<symbol id="icon"><circle r="5"/></symbol>';

    const result = loadSVGResource(data);
    expect(result?.outerHTML).toBe(
      '<symbol id="icon"><circle r="5"/></symbol>',
    );
  });

  it('parses self-closing svg root', () => {
    const data = '<svg xmlns="http://www.w3.org/2000/svg"/>';

    const result = loadSVGResource(data);
    expect(result?.outerHTML).toBe(
      '<symbol xmlns="http://www.w3.org/2000/svg"/>',
    );
  });

  it('parse iconfont icon', () => {
    const data = `<svg t="1767770225208" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5909" width="200" height="200"><path d="M904 476H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z" p-id="5910"></path></svg>`;
    const result = loadSVGResource(data);
    expect(result?.outerHTML).toBe(
      '<symbol t="1767770225208" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5909" width="200" height="200"><path d="M904 476H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z" p-id="5910"/></symbol>',
    );
  });
});
