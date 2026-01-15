import { describe, expect, it } from 'vitest';
import pkg from '../../package.json';
import { VERSION } from '../../src';

describe('verify version', () => {
  it('should match package.json version', () => {
    expect(VERSION).toBe(pkg.version);
  });
});
