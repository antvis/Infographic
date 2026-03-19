import { afterEach, describe, expect, it } from 'vitest';

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
});
