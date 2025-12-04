import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ClickHandler } from '../../../../src/editor/utils/click-handler';

describe('ClickHandler', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('triggers single click callback after delay', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const clickHandler = new ClickHandler(svg as any, { delay: 50 });
    const single = vi.fn();
    clickHandler.onClick(single);

    svg.dispatchEvent(new MouseEvent('click'));
    expect(single).not.toHaveBeenCalled();

    vi.runAllTimers();
    expect(single).toHaveBeenCalledTimes(1);
  });

  it('prefers double click callback over single click', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const clickHandler = new ClickHandler(svg as any, { delay: 50 });
    const single = vi.fn();
    const double = vi.fn();
    clickHandler.onClick(single).onDoubleClick(double);

    svg.dispatchEvent(new MouseEvent('dblclick'));
    vi.runAllTimers();

    expect(double).toHaveBeenCalledTimes(1);
    expect(single).not.toHaveBeenCalled();
  });

  it('clears pending single click when destroyed', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const clickHandler = new ClickHandler(svg as any, { delay: 10 });
    const single = vi.fn();
    clickHandler.onClick(single);

    svg.dispatchEvent(new MouseEvent('click'));
    clickHandler.destroy();
    vi.runAllTimers();

    expect(single).not.toHaveBeenCalled();
  });
});
