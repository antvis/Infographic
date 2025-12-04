import { describe, expect, it, vi } from 'vitest';
import { Extension } from '../../../../src/editor/utils/extension';

describe('Extension', () => {
  it('registers, retrieves and iterates extensions', () => {
    const extensions = new Extension<{ id: string }>();
    const visited: string[] = [];

    extensions.register('alpha', { id: 'a' });

    expect(extensions.has('alpha')).toBe(true);
    expect(extensions.get('alpha')?.id).toBe('a');

    extensions.forEach((extension, name) => {
      visited.push(`${name}:${extension.id}`);
    });

    expect(visited).toEqual(['alpha:a']);
    expect([...extensions.getAll().keys()]).toEqual(['alpha']);
  });

  it('prevents duplicate registration unless override is used', () => {
    const extensions = new Extension<{ id: string }>();
    extensions.register('duplicate', { id: 'first' });

    expect(() =>
      extensions.register('duplicate', { id: 'second' }),
    ).toThrowError(/already registered/i);

    extensions.register('duplicate', { id: 'second' }, { override: true });
    expect(extensions.get('duplicate')?.id).toBe('second');
  });

  it('unregisters and destroys extensions', () => {
    const extensions = new Extension<{ dispose?: () => void }>();
    const dispose = vi.fn();
    const anotherDispose = vi.fn();

    extensions.register('temp', { dispose });
    expect(extensions.unregister('temp')).toBe(true);
    expect(extensions.has('temp')).toBe(false);

    extensions.register('persist', { dispose: anotherDispose });
    extensions.destroy();

    expect(dispose).not.toHaveBeenCalled();
    expect(anotherDispose).toHaveBeenCalledTimes(1);
    expect(extensions.getAll().size).toBe(0);
  });
});
