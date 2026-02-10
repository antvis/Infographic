import { afterEach, describe, expect, it, vi } from 'vitest';

const fallbackMeasureText = vi.fn(() => ({ width: 9, height: 11 }));

vi.mock('measury', () => ({
  measureText: fallbackMeasureText,
  registerFont: vi.fn(),
}));

vi.mock('measury/fonts/AlibabaPuHuiTi-Regular', () => ({
  default: {
    fontFamily: 'AlibabaPuHuiTi-Regular',
  },
}));

describe('measureText', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
    fallbackMeasureText.mockClear();
  });

  it('prefers canvas metrics when canvas is available even if layout is unavailable', async () => {
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation(
      (tagName: string, options?: ElementCreationOptions) => {
        const element = originalCreateElement(
          tagName as keyof HTMLElementTagNameMap,
          options,
        );
        if (tagName === 'span' || tagName === 'div') {
          vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
            width: 0,
            height: 0,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            x: 0,
            y: 0,
            toJSON: () => ({}),
          } as DOMRect);
        }
        return element;
      },
    );

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      font: '',
      measureText: () => ({ width: 120 }),
    } as unknown as CanvasRenderingContext2D);

    const { measureText } = await import('../../../src/utils/measure-text');
    const metrics = measureText('数字化转型层级', {
      fontFamily: "'Times New Roman', Times, serif, SimSun, STSong",
      fontSize: 20,
      fontWeight: 'normal',
    });

    expect(metrics.width).toBe(122);
    expect(metrics.height).toBe(29);
    expect(fallbackMeasureText).not.toHaveBeenCalled();
  });

  it('falls back to measury when canvas is unavailable and span layout is invalid', async () => {
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation(
      (tagName: string, options?: ElementCreationOptions) => {
        const element = originalCreateElement(
          tagName as keyof HTMLElementTagNameMap,
          options,
        );
        if (tagName === 'span') {
          vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
            width: 0,
            height: 0,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            x: 0,
            y: 0,
            toJSON: () => ({}),
          } as DOMRect);
        }
        return element;
      },
    );

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

    const { measureText } = await import('../../../src/utils/measure-text');
    const metrics = measureText('数字化转型层级', {
      fontFamily: "'Times New Roman', Times, serif, SimSun, STSong",
      fontSize: 20,
      fontWeight: 'normal',
    });

    expect(metrics.width).toBe(10);
    expect(metrics.height).toBe(12);
    expect(fallbackMeasureText).toHaveBeenCalledTimes(1);
  });

  it('falls back to measury when document is unavailable', async () => {
    const { measureText } = await import('../../../src/utils/measure-text');
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', undefined);

    const metrics = measureText('数字化转型层级', {
      fontFamily: "'Times New Roman', Times, serif, SimSun, STSong",
      fontSize: 20,
      fontWeight: 'normal',
    });

    expect(metrics.width).toBe(10);
    expect(metrics.height).toBe(12);
    expect(fallbackMeasureText).toHaveBeenCalledTimes(1);
  });
});
