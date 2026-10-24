import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadResource } from '../../../src/resource/loader';
import {
  loadImageBase64Resource,
  loadRemoteResource,
  loadSearchResource,
  loadSVGResource,
} from '../../../src/resource/loaders';
import { getCustomResourceLoader } from '../../../src/resource/registry';
import type { ResourceConfig } from '../../../src/resource/types';

vi.mock('../../../src/resource/loaders', () => ({
  loadImageBase64Resource: vi.fn(),
  loadRemoteResource: vi.fn(),
  loadSearchResource: vi.fn(),
  loadSVGResource: vi.fn(),
}));

vi.mock('../../../src/resource/registry', () => ({
  getCustomResourceLoader: vi.fn(),
}));

describe('resource fallback queries', () => {
  let svg: SVGSVGElement;

  beforeEach(() => {
    vi.resetAllMocks();
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    vi.mocked(loadSVGResource).mockReturnValue(null);
    vi.mocked(loadImageBase64Resource).mockResolvedValue(null);
    vi.mocked(loadRemoteResource).mockRejectedValue(new Error('unavailable'));
    vi.mocked(loadSearchResource).mockImplementation(async () =>
      document.createElementNS('http://www.w3.org/2000/svg', 'symbol'),
    );
    vi.mocked(getCustomResourceLoader).mockReturnValue(null);
  });

  it('uses the item label when an inline resource fails', async () => {
    const id = await loadResource(
      svg,
      'icon',
      { source: 'inline', format: 'svg', encoding: 'raw', data: '<svg broken' },
      { label: '  Computer network  ', desc: 'Other description' },
    );

    expect(loadSearchResource).toHaveBeenCalledWith('Computer network', 'svg');
    expect(svg.querySelector('defs symbol')?.id).toBe(id);
  });

  it('uses the description when the item label is blank', async () => {
    await loadResource(
      svg,
      'icon',
      {
        source: 'inline',
        format: 'image',
        data: 'data:image/png;base64,invalid',
      },
      { label: '  ', desc: '  Cloud storage  ' },
    );

    expect(loadSearchResource).toHaveBeenCalledWith('Cloud storage', 'image');
  });

  it.each([
    { source: 'inline', format: 'svg', encoding: 'raw', data: '<svg broken' },
    {
      source: 'inline',
      format: 'image',
      data: 'data:image/png;base64,invalid',
    },
    { source: 'custom', data: 'data:image/png;base64,invalid' },
    { source: 'custom', data: '<svg broken' },
    { source: 'custom', data: '<symbol broken' },
  ] as ResourceConfig[])(
    'uses a generic icon for non-searchable data: %j',
    async (config) => {
      await loadResource(svg, 'icon', config);

      expect(loadSearchResource).toHaveBeenCalledWith('icon', config.format);
    },
  );

  it('uses the illustration default for failed inline illustrations', async () => {
    await loadResource(svg, 'illus', {
      source: 'inline',
      format: 'svg',
      encoding: 'raw',
      data: '<svg broken',
    });

    expect(loadSearchResource).toHaveBeenCalledWith('illustration', 'svg');
  });

  it('keeps searchable configuration data when there is no item context', async () => {
    await loadResource(svg, 'icon', '  computer network  ');

    expect(loadSearchResource).toHaveBeenCalledWith(
      'computer network',
      undefined,
    );
  });

  it('preserves explicit search text over item context', async () => {
    await loadResource(svg, 'icon', '  plane  ', { label: 'Other subject' });

    expect(loadSearchResource).toHaveBeenCalledWith('plane', undefined);
  });

  it('does not search when the primary loader succeeds', async () => {
    vi.mocked(loadRemoteResource).mockResolvedValue(
      document.createElementNS('http://www.w3.org/2000/svg', 'symbol'),
    );

    await loadResource(
      svg,
      'icon',
      'ref:remote:svg:https://example.com/icon.svg',
      {
        label: 'Computer network',
      },
    );

    expect(loadSearchResource).not.toHaveBeenCalled();
  });
});
