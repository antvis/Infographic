import { measureText as measure } from 'measury';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { measureText } from '../../../src/utils/measure-text';

describe('measureText SSR spacing', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('applies letter and word spacing exactly once with measury', () => {
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', undefined);

    const style = {
      fontFamily: 'Arial',
      fontSize: 20,
      fontWeight: 'normal' as const,
      lineHeight: 1.4,
      letterSpacing: 2,
      wordSpacing: 3,
    };
    const actual = measureText('A B', style);
    const expected = measure('A B', style);

    expect(actual).toEqual({
      width: Math.ceil(expected.width * 1.015),
      height: Math.ceil(expected.height * 1.015),
    });
  });

  it('normalizes em spacing before passing it to measury', () => {
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', undefined);

    const actual = measureText('A B', {
      fontFamily: 'Arial',
      fontSize: 20,
      fontWeight: 'normal',
      lineHeight: 1.4,
      letterSpacing: '0.1em',
      wordSpacing: '0.5em',
    });
    const expected = measure('A B', {
      fontFamily: 'Arial',
      fontSize: 20,
      fontWeight: 'normal',
      lineHeight: 1.4,
      letterSpacing: 2,
      wordSpacing: 10,
    });

    expect(actual).toEqual({
      width: Math.ceil(expected.width * 1.015),
      height: Math.ceil(expected.height * 1.015),
    });
  });
});
