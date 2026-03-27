import { afterEach, describe, expect, it, vi } from 'vitest';

import { Popover } from '../../../../../src/editor/plugins/components/popover';

function createShadowTrigger() {
  const host = document.createElement('div');
  document.body.appendChild(host);

  const shadowRoot = host.attachShadow({ mode: 'open' });
  const trigger = document.createElement('button');
  shadowRoot.appendChild(trigger);

  return { host, shadowRoot, trigger };
}

describe('Popover', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.head.querySelector('#infographic-edit-popover-style')?.remove();
  });

  it('closes when clicking outside an opened portal popover', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);

    const popover = Popover({
      target: trigger,
      content: 'Font tools',
      closeOnOutsideClick: true,
      open: true,
      trigger: 'click',
    });
    document.body.appendChild(popover);

    const content = document.body.querySelector(
      '.infographic-edit-popover__content',
    ) as HTMLElement | null;
    expect(content?.getAttribute('data-open')).toBe('true');

    const outside = document.createElement('div');
    document.body.appendChild(outside);
    outside.dispatchEvent(
      new MouseEvent('click', { bubbles: true, composed: true }),
    );

    expect(content?.getAttribute('data-open')).toBe('false');

    popover.destroy();
  });

  it('keeps a shadow-root portal popover open when clicking inside content', () => {
    const { shadowRoot, trigger } = createShadowTrigger();

    const contentButton = document.createElement('button');
    contentButton.textContent = 'Keep open';

    const popover = Popover({
      target: trigger,
      content: contentButton,
      closeOnOutsideClick: true,
      getContainer: shadowRoot,
      open: true,
      trigger: 'click',
    });
    shadowRoot.appendChild(popover);

    const content = shadowRoot.querySelector(
      '.infographic-edit-popover__content',
    ) as HTMLElement | null;
    expect(content?.getAttribute('data-open')).toBe('true');

    contentButton.dispatchEvent(
      new MouseEvent('click', { bubbles: true, composed: true }),
    );

    expect(content?.getAttribute('data-open')).toBe('true');

    popover.destroy();
  });

  it('positions a shadow-root portal popover relative to the shadow host', () => {
    const { host, shadowRoot, trigger } = createShadowTrigger();

    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: 800,
      configurable: true,
    });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: 600,
      configurable: true,
    });

    const rectSpy = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        if (this === host) {
          return DOMRect.fromRect({
            x: 40,
            y: 80,
            width: 320,
            height: 240,
          });
        }
        if (this === trigger) {
          return DOMRect.fromRect({
            x: 140,
            y: 160,
            width: 40,
            height: 24,
          });
        }
        if (this.classList.contains('infographic-edit-popover__content')) {
          return DOMRect.fromRect({
            x: 0,
            y: 0,
            width: 80,
            height: 32,
          });
        }
        return DOMRect.fromRect({
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        });
      });

    const popover = Popover({
      target: trigger,
      content: 'Font tools',
      getContainer: shadowRoot,
      open: true,
      trigger: 'click',
      placement: 'top',
    });
    shadowRoot.appendChild(popover);

    const content = shadowRoot.querySelector(
      '.infographic-edit-popover__content',
    ) as HTMLElement | null;
    expect(content?.style.left).toBe('80px');
    expect(content?.style.top).toBe('40px');

    rectSpy.mockRestore();
    popover.destroy();
  });
});
