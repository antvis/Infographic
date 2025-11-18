import { describe, expect, it } from 'vitest';
import { join } from '../../../src/utils/join';

describe('join', () => {
  it('should join paths with single slash', () => {
    expect(join('a', 'b', 'c')).toBe('a/b/c');
    expect(join('path', 'to', 'file')).toBe('path/to/file');
  });

  it('should remove leading and trailing slashes from each path', () => {
    expect(join('/a/', '/b/', '/c/')).toBe('a/b/c');
    expect(join('//a//', '//b//', '//c//')).toBe('a/b/c');
  });

  it('should handle mixed slash patterns', () => {
    expect(join('/a', 'b/', '/c')).toBe('a/b/c');
    expect(join('a/', '/b', 'c/')).toBe('a/b/c');
  });

  it('should filter out empty paths', () => {
    expect(join('a', '', 'c')).toBe('a/c');
    expect(join('', 'b', '')).toBe('b');
    expect(join('a', '   ', 'c')).toBe('a/c');
  });

  it('should handle single path', () => {
    expect(join('single')).toBe('single');
    expect(join('/single/')).toBe('single');
  });

  it('should return empty string for all empty paths', () => {
    expect(join('', '', '')).toBe('');
    expect(join('///', '', '///')).toBe('');
  });

  it('should handle no arguments', () => {
    expect(join()).toBe('');
  });

  it('should handle complex path scenarios', () => {
    expect(join('/api/v1/', '/users/', '/123/')).toBe('api/v1/users/123');
    expect(join('https://example.com/', '/api/', 'data')).toBe(
      'https://example.com/api/data',
    );
  });
});
