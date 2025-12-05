import { describe, expect, it, vi } from 'vitest';
import { Hotkey } from '../../../../src/editor/utils/hotkey';

describe('Hotkey', () => {
  it('fires handlers for mod combos with ctrl/meta and ignores mismatches', () => {
    const target = document.createElement('div');
    document.body.appendChild(target);

    const handler = vi.fn();
    const hotkey = new Hotkey({ target });
    hotkey.bind('mod+z', handler);

    target.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true }),
    );
    target.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'z', metaKey: true, bubbles: true }),
    );
    target.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'z', bubbles: true }),
    );

    expect(handler).toHaveBeenCalledTimes(2);

    hotkey.destroy();
  });

  it('respects filter, ignores editable targets, and supports unbinding', () => {
    const container = document.createElement('div');
    const input = document.createElement('input');
    container.appendChild(input);
    document.body.appendChild(container);

    let allowEvent = false;
    const filter = vi.fn(() => allowEvent);
    const handler = vi.fn();

    const hotkey = new Hotkey({ target: container, filter });
    const unbind = hotkey.bind('ctrl+k', handler);

    container.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }),
    );
    expect(filter).toHaveBeenCalledTimes(1);
    expect(handler).not.toHaveBeenCalled();

    allowEvent = true;
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }),
    );
    expect(filter).toHaveBeenCalledTimes(1);
    expect(handler).not.toHaveBeenCalled();

    unbind();
    container.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }),
    );
    expect(filter).toHaveBeenCalledTimes(2);
    expect(handler).not.toHaveBeenCalled();

    hotkey.destroy();
  });
});
