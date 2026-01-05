import { afterEach, describe, expect, it, vi } from 'vitest';
import { isBrowser } from '../../../src/utils/is-browser';

describe('isBrowser', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    if (typeof document !== 'undefined') {
      document.body.innerHTML = '';
    }
  });

  it('returns false when window or document is missing', () => {
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', undefined);

    expect(isBrowser()).toBe(false);
  });

  it('returns false when layout validation fails', () => {
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation(
      (tagName: string, options?: ElementCreationOptions) => {
        const element = originalCreateElement(
          tagName as keyof HTMLElementTagNameMap,
          options,
        );
        if (tagName === 'div') {
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
      measureText: () => ({ width: 42 }),
    } as unknown as CanvasRenderingContext2D);

    expect(isBrowser()).toBe(false);
  });

  it('returns false when canvas validation fails', () => {
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation(
      (tagName: string, options?: ElementCreationOptions) => {
        const element = originalCreateElement(
          tagName as keyof HTMLElementTagNameMap,
          options,
        );
        if (tagName === 'div') {
          vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
            width: 37,
            height: 19,
            left: 11,
            top: 13,
            right: 48,
            bottom: 32,
            x: 11,
            y: 13,
            toJSON: () => ({}),
          } as DOMRect);
        }
        return element;
      },
    );

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

    expect(isBrowser()).toBe(false);
  });

  it('returns true when layout and canvas are real', () => {
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation(
      (tagName: string, options?: ElementCreationOptions) => {
        const element = originalCreateElement(
          tagName as keyof HTMLElementTagNameMap,
          options,
        );
        if (tagName === 'div') {
          vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
            width: 37,
            height: 19,
            left: 11,
            top: 13,
            right: 48,
            bottom: 32,
            x: 11,
            y: 13,
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

    expect(isBrowser()).toBe(true);
  });
});
