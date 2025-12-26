import { describe, expect, it } from 'vitest';
import {
  decodeFontFamily,
  encodeFontFamily,
  normalizeFontWeightName,
} from '../../../src/utils/font';

describe('font utils', () => {
  it('decodes font family by trimming and removing quotes', () => {
    expect(decodeFontFamily('  "Roboto Slab" ')).toBe('Roboto Slab');
    expect(decodeFontFamily("'Open Sans'")).toBe('Open Sans');
    expect(decodeFontFamily("'SimSun', 'Times New Roman', Times, serif")).toBe(
      'SimSun, Times New Roman, Times, serif',
    );
  });

  it('encodes font family that needs quoting', () => {
    expect(encodeFontFamily('"Already Quoted"')).toBe('"Already Quoted"');
    expect(encodeFontFamily('123Font')).toBe('"123Font"');
    expect(encodeFontFamily('Font With Space')).toBe('"Font With Space"');
    expect(encodeFontFamily('PlainFont')).toBe('PlainFont');
    expect(encodeFontFamily("'SimSun', 'Times New Roman', Times, serif")).toBe(
      "'SimSun', 'Times New Roman', Times, serif",
    );
    expect(encodeFontFamily('SimSun, Times New Roman, serif')).toBe(
      'SimSun, "Times New Roman", serif',
    );
  });

  it('normalizes font weight names to tokens', () => {
    expect(normalizeFontWeightName(700)).toBe('bold');
    expect(normalizeFontWeightName('UltraLight')).toBe('extralight');
    expect(normalizeFontWeightName('hairline')).toBe('thin');
    expect(normalizeFontWeightName('unknown')).toBe('regular');
  });
});
