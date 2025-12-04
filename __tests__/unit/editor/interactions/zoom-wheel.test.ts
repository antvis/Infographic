import { describe, expect, it, vi } from 'vitest';
import { UpdateOptionsCommand } from '../../../../src/editor/commands/UpdateOptions';
import { ZoomWheel } from '../../../../src/editor/interactions/zoom-wheel';

const createSVG = (width: number, height: number) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  (svg as any).getBBox = () => ({ x: 0, y: 0, width, height });
  return svg;
};

describe('ZoomWheel interaction', () => {
  it('executes update-options command when zooming with modifier keys', () => {
    const svg = createSVG(100, 50);
    const commander = { execute: vi.fn() } as any;
    const interaction = { isActive: vi.fn(() => true) } as any;
    const state = {
      getOptions: vi.fn(() => ({ padding: 0 }) as any),
    } as any;

    const instance = new ZoomWheel();
    instance.init({
      emitter: {} as any,
      editor: { getDocument: () => svg } as any,
      commander,
      interaction,
      state,
    });

    const event = new WheelEvent('wheel', { deltaY: 120, ctrlKey: true });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    document.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(commander.execute).toHaveBeenCalledTimes(1);
    const command = commander.execute.mock.calls[0][0] as UpdateOptionsCommand;
    expect(command).toBeInstanceOf(UpdateOptionsCommand);
    expect(command.serialize().options).toEqual({
      padding: [1.1, 1.1, 1.1, 1.1],
    });

    instance.destroy();
  });

  it('prevents zoom when resulting viewbox would be too small', () => {
    const svg = createSVG(100, 100);
    const commander = { execute: vi.fn() } as any;
    const interaction = { isActive: vi.fn(() => true) } as any;
    const state = {
      getOptions: vi.fn(() => ({
        padding: [-100, -100, -100, -100],
      })),
    } as any;

    const instance = new ZoomWheel();
    instance.init({
      emitter: {} as any,
      editor: { getDocument: () => svg } as any,
      commander,
      interaction,
      state,
    });

    const event = new WheelEvent('wheel', { deltaY: -120, ctrlKey: true });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    document.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(commander.execute).not.toHaveBeenCalled();

    instance.destroy();
  });
});
