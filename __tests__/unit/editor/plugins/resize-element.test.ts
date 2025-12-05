import { describe, expect, it, vi } from 'vitest';
import { UpdateElementCommand } from '../../../../src/editor/commands';
import { ResizeElement } from '../../../../src/editor/plugins/resize-element';

describe('ResizeElement internal geometry helpers', () => {
  const plugin = new ResizeElement() as any;

  it('computes handle points and clamps minimum size', () => {
    const points = plugin.getHandlePoints({
      x: 0,
      y: 0,
      width: 10,
      height: 20,
    });
    expect(points[0]).toEqual([0, 0]);
    expect(points[4]).toEqual([10, 20]);

    const clamped = plugin.clampRect(
      { x: 0, y: 0, width: 0.2, height: 0.3 },
      'left',
    );
    expect(clamped.width).toBeGreaterThanOrEqual(1);
    expect(clamped.height).toBeGreaterThanOrEqual(1);
  });

  it('applies deltas according to handle position', () => {
    const base = { x: 10, y: 10, width: 20, height: 20 };
    expect(plugin.applyDelta(base, 5, 0, 'right')).toMatchObject({
      width: 25,
      x: 10,
    });
    expect(plugin.applyDelta(base, -5, -5, 'top-left')).toMatchObject({
      x: 5,
      y: 5,
      width: 25,
      height: 25,
    });
  });

  it('detects when rect has changed', () => {
    const rect = { x: 0, y: 0, width: 10, height: 10 };
    expect(plugin.hasRectChanged(rect, { ...rect })).toBe(false);
    expect(plugin.hasRectChanged(rect, { ...rect, width: 11 })).toBe(true);
  });
});

describe('ResizeElement pointer interactions', () => {
  const setupPlugin = () => {
    const plugin = new ResizeElement() as any;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const emitter = { on: vi.fn(), off: vi.fn(), emit: vi.fn() };
    const commander = { execute: vi.fn() };

    plugin.init({
      emitter: emitter as any,
      editor: { getDocument: () => svg } as any,
      commander: commander as any,
      plugin: {} as any,
      state: {} as any,
    });

    const target = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'foreignObject',
    );
    target.setAttribute('data-element-type', 'title');
    plugin.target = target;

    plugin.clientToElement = vi.fn((_el: any, x: number, y: number) => {
      return { x, y };
    });
    plugin.getCurrentAttributes = vi
      .fn()
      .mockReturnValue({ x: 0, y: 0, width: 50, height: 20 });
    plugin.getViewportRect = vi
      .fn()
      .mockReturnValue({ x: 0, y: 0, width: 50, height: 20 });
    vi.spyOn(plugin as any, 'updateHandles').mockImplementation(() => {});
    vi.spyOn(plugin as any, 'emitSelectionGeometryChange').mockImplementation(
      () => {},
    );
    const applyRectSpy = vi.spyOn(plugin as any, 'applyRect');

    return { plugin, commander, applyRectSpy };
  };

  it('applies drag deltas and commits an update command', () => {
    const { plugin, commander, applyRectSpy } = setupPlugin();

    (plugin as any).handlePointerDown(
      new PointerEvent('pointerdown', {
        clientX: 10,
        clientY: 10,
        pointerId: 1,
        button: 0,
      }),
      'bottom-right',
    );

    (plugin as any).handlePointerMove(
      new PointerEvent('pointermove', {
        clientX: 30,
        clientY: 25,
        pointerId: 1,
      }),
    );
    expect(applyRectSpy).toHaveBeenCalledWith(
      (plugin as any).target,
      expect.objectContaining({ width: 70, height: 35 }),
    );

    (plugin as any).handlePointerUp(
      new PointerEvent('pointerup', { pointerId: 1 }),
    );

    expect(commander.execute).toHaveBeenCalledTimes(1);
    const command = commander.execute.mock.calls[0][0];
    expect(command).toBeInstanceOf(UpdateElementCommand);
    expect((command as any).serialize().modified.attributes).toEqual(
      expect.objectContaining({ width: 70, height: 35 }),
    );
    plugin.destroy();
  });

  it('ignores unchanged drags but refreshes handles', () => {
    const { plugin, commander } = setupPlugin();
    const updateHandlesSpy = (plugin as any).updateHandles as any;

    (plugin as any).handlePointerDown(
      new PointerEvent('pointerdown', {
        clientX: 0,
        clientY: 0,
        pointerId: 2,
        button: 0,
      }),
      'right',
    );

    (plugin as any).handlePointerUp(
      new PointerEvent('pointerup', { pointerId: 2 }),
    );

    expect(commander.execute).not.toHaveBeenCalled();
    expect(updateHandlesSpy).toHaveBeenCalledTimes(1);

    plugin.destroy();
  });
});
