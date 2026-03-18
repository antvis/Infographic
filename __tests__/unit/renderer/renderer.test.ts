import { describe, expect, it } from 'vitest';
import * as rendererModule from '../../../src/renderer/renderer';

const getObservationTarget = (rendererModule as any).getObservationTarget as (
  container: Element | ShadowRoot,
) => Element | ShadowRoot;

describe('renderer/Renderer', () => {
  it('uses the ShadowRoot itself as the observation target', () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });

    expect(getObservationTarget(shadowRoot)).toBe(shadowRoot);
  });

  it('uses the container element as the observation target when it lives inside ShadowRoot', () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const container = document.createElement('div');
    shadowRoot.appendChild(container);

    expect(getObservationTarget(container)).toBe(container);
  });
});
