import { beforeEach, describe, expect, it, vi } from 'vitest';
import { parseOptions } from '../../../src/options';

const {
  structureComponent,
  itemComponent,
  titleComponent,
  structureMap,
  itemMap,
  templateMap,
  paletteSpy,
  generateColorsSpy,
  themeSpy,
} = vi.hoisted(() => ({
  structureComponent: vi.fn((props: any) => ({ kind: 'structure', props })),
  itemComponent: vi.fn((props: any) => ({ kind: 'item', props })),
  titleComponent: vi.fn((props: any) => ({ kind: 'title', props })),
  structureMap: new Map<string, any>(),
  itemMap: new Map<string, any>(),
  templateMap: new Map<string, any>(),
  paletteSpy: vi.fn(() => '#123456'),
  generateColorsSpy: vi.fn().mockReturnValue({
    colorPrimary: '#123456',
    colorPrimaryText: '#ffffff',
    colorTextSecondary: '#666666',
  }),
  themeSpy: vi.fn((name?: string) =>
    name
      ? { palette: ['theme-palette'], colorBg: '#111111', stylize: false }
      : {},
  ),
}));

vi.mock('../../../src/designs', () => ({
  getStructure: (type: string) => structureMap.get(type),
  getItem: (type: string) => itemMap.get(type),
  getTemplate: (type: string) => templateMap.get(type),
  Title: (args: any) => titleComponent(args),
}));

vi.mock('../../../src/renderer', () => ({
  getPaletteColor: () => paletteSpy(),
}));

vi.mock('../../../src/themes', () => ({
  generateThemeColors: (...args: any[]) => generateColorsSpy(...args),
  getTheme: (...args: any[]) => themeSpy(...args),
}));

describe('parseOptions', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    structureMap.clear();
    itemMap.clear();
    templateMap.clear();
    vi.clearAllMocks();
  });

  it('merges template defaults and wires design components', () => {
    const container = document.createElement('div');
    container.id = 'container';
    document.body.appendChild(container);

    structureMap.set('template-structure', {
      type: 'template-structure',
      component: structureComponent,
      structureProp: 'from-template',
    });
    itemMap.set('template-item', {
      type: 'template-item',
      component: itemComponent,
      options: { from: 'template' },
    });
    itemMap.set('custom-item', {
      type: 'custom-item',
      component: itemComponent,
      options: { from: 'design' },
    });
    templateMap.set('tpl', {
      design: {
        structure: {
          type: 'template-structure',
          structureProp: 'from-template',
        },
        item: { type: 'template-item', templateOnly: true },
        title: { type: 'template-title', from: 'template' },
      },
      themeConfig: { colorBg: '#eeeeee', palette: ['tpl-primary'] },
    });

    const parsed = parseOptions({
      container: '#container',
      padding: 12,
      template: 'tpl',
      design: {
        item: { type: 'custom-item', user: 'design' },
        title: { type: 'title', customTitle: true },
      },
      theme: 'dark',
      themeConfig: {
        colorPrimary: '#00f',
        palette: ['design-primary'],
        stylize: {
          type: 'rough',
        },
        colorBg: '#fafafa',
      },
      data: { items: [{ value: 1 }, { value: 2 }] },
    });

    expect(parsed.container).toBe(container);
    expect(parsed.padding).toEqual([12, 12, 12, 12]);
    expect(parsed.themeConfig?.palette).toEqual(['design-primary']);
    expect(parsed.themeConfig?.colorPrimary).toBe('#00f');

    parsed.design?.structure.component({ foo: 'bar' } as any);
    expect(structureComponent).toHaveBeenCalledWith(
      expect.objectContaining({ foo: 'bar', structureProp: 'from-template' }),
    );

    parsed.design?.title.component?.({ title: 'hello' } as any);
    expect(titleComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'hello',
        customTitle: true,
        themeColors: generateColorsSpy.mock.results[0].value,
      }),
    );

    parsed.design?.item.component({ indexes: [0], foo: 'bar' } as any);
    expect(itemComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        indexes: [0],
        foo: 'bar',
        user: 'design',
        themeColors: generateColorsSpy.mock.results[0].value,
      }),
    );
    expect(generateColorsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        colorPrimary: '#123456',
        colorBg: '#fafafa',
      }),
    );
    expect(themeSpy).toHaveBeenCalledWith('dark');
  });

  it('skips design when structure is missing', () => {
    itemMap.set('custom-item', {
      type: 'custom-item',
      component: itemComponent,
    });

    const parsed = parseOptions({
      container: '#missing',
      design: { item: { type: 'custom-item' } },
    } as any);

    expect(parsed.design).toBeUndefined();
  });

  it('uses template themeConfig when user themeConfig is omitted', () => {
    const container = document.createElement('div');
    container.id = 'container';
    document.body.appendChild(container);

    structureMap.set('template-structure', {
      type: 'template-structure',
      component: structureComponent,
    });
    itemMap.set('template-item', {
      type: 'template-item',
      component: itemComponent,
    });
    templateMap.set('tpl', {
      design: {
        structure: { type: 'template-structure' },
        item: { type: 'template-item' },
      },
      themeConfig: { colorBg: '#eeeeee', palette: ['tpl-primary'] },
    });

    const parsed = parseOptions({
      container: '#container',
      template: 'tpl',
      design: {
        item: { type: 'template-item' },
      },
      data: { items: [{ value: 1 }] },
    });

    parsed.design?.item.component({ indexes: [0] } as any);
    expect(generateColorsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        colorPrimary: '#123456',
        colorBg: '#eeeeee',
      }),
    );
  });

  it('skips design when structure is null', () => {
    itemMap.set('custom-item', {
      type: 'custom-item',
      component: itemComponent,
    });

    const parsed = parseOptions({
      container: '#missing',
      design: { structure: null, item: { type: 'custom-item' } } as any,
    });

    expect(parsed.design).toBeUndefined();
  });

  it('skips design when item is null', () => {
    structureMap.set('custom-structure', {
      type: 'custom-structure',
      component: structureComponent,
    });

    const parsed = parseOptions({
      container: '#missing',
      design: { structure: { type: 'custom-structure' }, item: null } as any,
    });

    expect(parsed.design).toBeUndefined();
  });

  it('skips design when items contain null', () => {
    structureMap.set('custom-structure', {
      type: 'custom-structure',
      component: structureComponent,
    });
    itemMap.set('custom-item', {
      type: 'custom-item',
      component: itemComponent,
    });

    const parsed = parseOptions({
      container: '#missing',
      design: {
        structure: { type: 'custom-structure' },
        items: [null, { type: 'custom-item' }],
      } as any,
    });

    expect(parsed.design).toBeUndefined();
  });
});
