import { describe, expect, it, vi } from 'vitest';
import { PluginManager } from '../../../../src/editor/managers/plugin';

describe('PluginManager', () => {
  const createPlugin = (name: string) => ({
    name,
    init: vi.fn(),
    destroy: vi.fn(),
  });

  it('registers plugins and emits lifecycle events', () => {
    const emitter = { emit: vi.fn() } as any;
    const plugin = createPlugin('p1');
    const manager = new PluginManager();

    manager.init(
      { emitter, editor: {} as any, commander: {} as any, state: {} as any },
      [plugin as any],
    );

    expect(plugin.init).toHaveBeenCalled();
    expect(manager.getPlugin('p1')).toBe(plugin);
    expect(emitter.emit).toHaveBeenCalledWith('plugin:registered', plugin);

    manager.unregisterPlugin('p1');
    expect(plugin.destroy).toHaveBeenCalled();
    expect(emitter.emit).toHaveBeenCalledWith('plugin:unregistered', plugin);
  });

  it('destroys all plugins on destroy()', () => {
    const emitter = { emit: vi.fn() } as any;
    const plugin = createPlugin('p2');
    const manager = new PluginManager();
    manager.init(
      { emitter, editor: {} as any, commander: {} as any, state: {} as any },
      [plugin as any],
    );

    manager.destroy();
    expect(plugin.destroy).toHaveBeenCalledTimes(1);
    expect(emitter.emit).toHaveBeenCalledWith('plugin:destroyed', plugin);
  });
});
