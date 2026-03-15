import { describe, expect, it } from 'vitest';
import {
  registerTemplate,
  resolveTemplateKey,
} from '../../../src/templates/registry';
import { findClosestTemplateKey } from '../../../src/templates/utils';

describe('template registry', () => {
  describe('findClosestTemplateKey', () => {
    it('returns undefined when the template key is empty after normalization', () => {
      expect(findClosestTemplateKey('   ', [])).toBeUndefined();
    });

    it('returns undefined when there are no registered template keys', () => {
      expect(findClosestTemplateKey('sequence-cylindre', [])).toBeUndefined();
    });

    it('matches normalized keys before falling back to edit distance', () => {
      expect(
        findClosestTemplateKey('  Sequence_Cylinders 3D  Simple  ', [
          'sequence-cylinders-3d-simple',
          'sequence-stairs-3d-simple',
        ]),
      ).toBe('sequence-cylinders-3d-simple');
    });

    it('resolves template typos to the closest registered key', () => {
      expect(
        findClosestTemplateKey('zz registry fallbak alpha template', [
          'zz-registry-fallback-alpha-template',
          'zz-registry-fallback-beta-template',
        ]),
      ).toBe('zz-registry-fallback-alpha-template');
    });

    it('prefers the longer shared prefix when distance is tied', () => {
      expect(
        findClosestTemplateKey('sequence-mesh-card', [
          'sequence-road-card',
          'sequence-mesh-board',
        ]),
      ).toBe('sequence-mesh-board');
    });

    it('falls back to lexical order when distance and prefix are tied', () => {
      expect(
        findClosestTemplateKey('template-x', ['template-a', 'template-b']),
      ).toBe('template-a');
    });
  });

  describe('resolveTemplateKey', () => {
    it('returns exact registered keys unchanged', () => {
      registerTemplate('zz-registry-exact-template', {});

      expect(resolveTemplateKey('zz-registry-exact-template')).toBe(
        'zz-registry-exact-template',
      );
    });

    it('uses the closest registered key for typoed template names', () => {
      registerTemplate('zz-registry-fallback-alpha-template', {});
      registerTemplate('zz-registry-fallback-beta-template', {});

      expect(resolveTemplateKey('zz registry fallbak alpha template')).toBe(
        'zz-registry-fallback-alpha-template',
      );
    });
  });
});
