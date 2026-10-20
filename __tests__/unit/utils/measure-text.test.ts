import { afterEach, describe, expect, it, vi } from 'vitest';

const fallbackMeasureText = vi.fn(() => ({ width: 9, height: 11 }));
const registerFontMock = vi.fn();

const zeroDomRect = {
  width: 0,
  height: 0,
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  x: 0,
  y: 0,
  toJSON: () => ({}),
} as DOMRect;

vi.mock('measury', () => ({
  measureText: fallbackMeasureText,
  registerFont: registerFontMock,
}));

vi.mock('measury/fonts/AlibabaPuHuiTi-Regular', () => ({
  default: {
    fontFamily: 'AlibabaPuHuiTi-Regular',
  },
}));

vi.mock('measury/fonts/851tegakizatsu-Regular', () => ({
  default: {
    fontFamily: '851tegakizatsu',
  },
}));

vi.mock('measury/fonts/Arial-Regular', () => ({
  default: {
    fontFamily: 'Arial',
  },
}));

vi.mock('measury/fonts/LXGWWenKai-Regular', () => ({
  default: {
    fontFamily: 'LXGW WenKai',
  },
}));

vi.mock('measury/fonts/SourceHanSans-Regular', () => ({
  default: {
    fontFamily: 'Source Han Sans',
  },
}));

vi.mock('measury/fonts/SourceHanSerif-Regular', () => ({
  default: {
    fontFamily: 'Source Han Serif',
  },
}));

describe('measureText', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.resetModules();
    fallbackMeasureText.mockClear();
    registerFontMock.mockClear();
  });

  it('prefers canvas metrics when canvas is available even if layout is unavailable', async () => {
    const spanLayoutSpy = vi
      .spyOn(HTMLSpanElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(zeroDomRect);

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
    expect(spanLayoutSpy).not.toHaveBeenCalled();
  });

  it('includes letter and word spacing in canvas measurements', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      font: '',
      measureText: () => ({ width: 100 }),
    } as unknown as CanvasRenderingContext2D);

    const { measureText } = await import('../../../src/utils/measure-text');
    const metrics = measureText('A B', {
      fontFamily: 'Arial',
      fontSize: 20,
      fontWeight: 'normal',
      letterSpacing: 2,
      wordSpacing: 3,
    });

    expect(metrics.width).toBe(Math.ceil(107 * 1.015));
  });

  it('falls back to measury when canvas is unavailable and span layout is invalid', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    vi.spyOn(
      HTMLSpanElement.prototype,
      'getBoundingClientRect',
    ).mockReturnValue(zeroDomRect);

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

  it('lazily registers 851tegakizatsu when font-family is a stack in SSR path', async () => {
    const { measureText } = await import('../../../src/utils/measure-text');
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', undefined);

    measureText('主流前端框架对比', {
      fontFamily: '"851tegakizatsu", sans-serif',
      fontSize: 24,
      fontWeight: 'normal',
    });

    expect(registerFontMock).toHaveBeenCalledTimes(2);
    expect(registerFontMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ fontFamily: '851tegakizatsu' }),
    );

    measureText('主流前端框架对比', {
      fontFamily: '851tegakizatsu, sans-serif',
      fontSize: 24,
      fontWeight: 'normal',
    });

    expect(registerFontMock).toHaveBeenCalledTimes(2);
    expect(fallbackMeasureText).toHaveBeenCalledTimes(2);
  });

  it('lazily registers Arial on first use in SSR path', async () => {
    const { measureText } = await import('../../../src/utils/measure-text');
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', undefined);

    measureText('Hello World', {
      fontFamily: 'Arial, sans-serif',
      fontSize: 16,
      fontWeight: 'normal',
    });

    expect(registerFontMock).toHaveBeenCalledTimes(2);
    expect(registerFontMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ fontFamily: 'Arial' }),
    );

    // Second call should not re-register
    measureText('Hello Again', {
      fontFamily: 'Arial, sans-serif',
      fontSize: 16,
      fontWeight: 'normal',
    });

    expect(registerFontMock).toHaveBeenCalledTimes(2);
    expect(fallbackMeasureText).toHaveBeenCalledTimes(2);
  });

  it('lazily registers Source Han Sans on first use in SSR path', async () => {
    const { measureText } = await import('../../../src/utils/measure-text');
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', undefined);

    measureText('数字化转型', {
      fontFamily: '"Source Han Sans", sans-serif',
      fontSize: 18,
      fontWeight: 'normal',
    });

    expect(registerFontMock).toHaveBeenCalledTimes(2);
    expect(registerFontMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ fontFamily: 'Source Han Sans' }),
    );
    expect(fallbackMeasureText).toHaveBeenCalledTimes(1);
  });

  it('lazily registers Source Han Serif on first use in SSR path', async () => {
    const { measureText } = await import('../../../src/utils/measure-text');
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', undefined);

    measureText('宋体文本测试', {
      fontFamily: '"Source Han Serif", serif',
      fontSize: 18,
      fontWeight: 'normal',
    });

    expect(registerFontMock).toHaveBeenCalledTimes(2);
    expect(registerFontMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ fontFamily: 'Source Han Serif' }),
    );
    expect(fallbackMeasureText).toHaveBeenCalledTimes(1);
  });

  it('lazily registers LXGW WenKai on first use in SSR path', async () => {
    const { measureText } = await import('../../../src/utils/measure-text');
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', undefined);

    measureText('楷体文本测试', {
      fontFamily: '"LXGW WenKai", sans-serif',
      fontSize: 18,
      fontWeight: 'normal',
    });

    expect(registerFontMock).toHaveBeenCalledTimes(2);
    expect(registerFontMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ fontFamily: 'LXGW WenKai' }),
    );
    expect(fallbackMeasureText).toHaveBeenCalledTimes(1);
  });
});
