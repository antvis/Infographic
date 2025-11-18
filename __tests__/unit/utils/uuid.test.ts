import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { uuid } from '../../../src/utils/uuid';

describe('uuid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should use crypto.randomUUID if available', () => {
    const mockRandomUUID = vi.fn().mockReturnValue('test-uuid-123');
    vi.stubGlobal('crypto', { randomUUID: mockRandomUUID });

    const result = uuid();
    expect(result).toBe('test-uuid-123');
    expect(mockRandomUUID).toHaveBeenCalled();
  });

  it('should generate UUID using fallback method when crypto.randomUUID is not available', () => {
    vi.stubGlobal('crypto', undefined);

    const result = uuid();

    expect(result).toMatch(
      /^[0-9a-f]{4}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}$/,
    );
    expect(result.length).toBe(19);
  });

  it('should generate UUID using fallback when crypto exists but randomUUID is undefined', () => {
    vi.stubGlobal('crypto', {});

    const result = uuid();

    expect(result).toMatch(
      /^[0-9a-f]{4}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}$/,
    );
    expect(result.length).toBe(19);
  });

  it('should generate different UUIDs on multiple calls', () => {
    vi.stubGlobal('crypto', undefined);

    const uuid1 = uuid();
    const uuid2 = uuid();

    expect(uuid1).not.toBe(uuid2);
    expect(uuid1).toMatch(
      /^[0-9a-f]{4}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}$/,
    );
    expect(uuid2).toMatch(
      /^[0-9a-f]{4}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}$/,
    );
  });

  it('should always have version 4 UUID format in fallback', () => {
    vi.stubGlobal('crypto', undefined);

    const result = uuid();

    expect(result.charAt(10)).toBe('4');
    expect(['8', '9', 'a', 'b']).toContain(result.charAt(15));
  });
});
