import { describe, expect, it, vi } from 'vitest';
import { SyncRegistry } from '../../../../src/editor/managers';

describe('SyncRegistry', () => {
  const createValueProvider = (data: Record<string, any> = {}) => {
    return (path: string) => data[path];
  };

  describe('register', () => {
    it('should store handler and return unregister function', () => {
      const registry = new SyncRegistry(createValueProvider());
      const handler = vi.fn();

      const unregister = registry.register('test.path', handler);

      expect(typeof unregister).toBe('function');
    });

    it('should call handler immediately when immediate option is true', () => {
      const registry = new SyncRegistry(
        createValueProvider({ 'test.path': 'currentValue' }),
      );
      const handler = vi.fn();

      registry.register('test.path', handler, { immediate: true });

      expect(handler).toHaveBeenCalledWith('currentValue', undefined);
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should not call handler immediately when immediate option is false or omitted', () => {
      const registry = new SyncRegistry(
        createValueProvider({ 'test.path': 'currentValue' }),
      );
      const handler = vi.fn();

      registry.register('test.path', handler);

      expect(handler).not.toHaveBeenCalled();
    });

    it('should allow multiple handlers for the same path', () => {
      const registry = new SyncRegistry(createValueProvider());
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      registry.register('test.path', handler1);
      registry.register('test.path', handler2);
      registry.trigger('test.path', 'new', 'old');

      expect(handler1).toHaveBeenCalledWith('new', 'old');
      expect(handler2).toHaveBeenCalledWith('new', 'old');
    });
  });

  describe('unregister', () => {
    it('should remove handler when unregister is called', () => {
      const registry = new SyncRegistry(createValueProvider());
      const handler = vi.fn();

      const unregister = registry.register('test.path', handler);
      unregister();
      registry.trigger('test.path', 'new', 'old');

      expect(handler).not.toHaveBeenCalled();
    });

    it('should only remove specific handler, not all handlers for the path', () => {
      const registry = new SyncRegistry(createValueProvider());
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      const unregister1 = registry.register('test.path', handler1);
      registry.register('test.path', handler2);
      unregister1();
      registry.trigger('test.path', 'new', 'old');

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledWith('new', 'old');
    });
  });

  describe('trigger', () => {
    it('should call all registered handlers for the given path', () => {
      const registry = new SyncRegistry(createValueProvider());
      const handler = vi.fn();

      registry.register('test.path', handler);
      registry.trigger('test.path', 'newValue', 'oldValue');

      expect(handler).toHaveBeenCalledWith('newValue', 'oldValue');
    });

    it('should not call handlers registered for different paths', () => {
      const registry = new SyncRegistry(createValueProvider());
      const handler = vi.fn();

      registry.register('other.path', handler);
      registry.trigger('test.path', 'new', 'old');

      expect(handler).not.toHaveBeenCalled();
    });

    it('should skip and warn when recursive trigger is detected', () => {
      const registry = new SyncRegistry(createValueProvider());
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const recursiveHandler = () => {
        registry.trigger('test.path', 'recursive', 'call');
      };

      registry.register('test.path', recursiveHandler);
      registry.trigger('test.path', 'initial', 'value');

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Recursive update detected'),
      );
      warnSpy.mockRestore();
    });

    it('should not throw if no handlers are registered for triggered path', () => {
      const registry = new SyncRegistry(createValueProvider());

      expect(() => {
        registry.trigger('nonexistent.path', 'new', 'old');
      }).not.toThrow();
    });
  });

  describe('destroy', () => {
    it('should clear all registered handlers', () => {
      const registry = new SyncRegistry(createValueProvider());
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      registry.register('path1', handler1);
      registry.register('path2', handler2);
      registry.destroy();
      registry.trigger('path1', 'new', 'old');
      registry.trigger('path2', 'new', 'old');

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
    });
  });
});
