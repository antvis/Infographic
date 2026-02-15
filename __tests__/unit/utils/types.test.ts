import { describe, expectTypeOf, it } from 'vitest';
import type { Path } from '../../../src/utils/types';

describe('Path Type (Black Box)', () => {
  // 1. 基础扁平对象
  it('should extract keys from flat object', () => {
    type Flat = {
      name: string;
      age: number;
    };
    expectTypeOf<Path<Flat>>().toEqualTypeOf<'name' | 'age'>();
  });

  // 2. 嵌套对象 (默认深度)
  it('should extract nested paths', () => {
    type Nested = {
      user: {
        profile: {
          bio: string;
        };
        settings: boolean;
      };
      id: number;
    };
    // Expected: 'id' | 'user' | 'user.settings' | 'user.profile' | 'user.profile.bio'
    expectTypeOf<Path<Nested>>().toEqualTypeOf<
      'id' | 'user' | 'user.settings' | 'user.profile' | 'user.profile.bio'
    >();
  });

  // 3. 数组和基本类型终止 (StopType)
  it('should stop recursion at arrays and primitives', () => {
    type WithArray = {
      tags: string[];
      meta: {
        counts: number[];
      };
    };
    // Array properties are terminals themselves, we don't go inside arrays (e.g. 'tags.0', 'tags.length')
    // dependent on implementation specifics of ValidKey/StopType which we inferred suppresses Array methods
    expectTypeOf<Path<WithArray>>().toEqualTypeOf<
      'tags' | 'meta' | 'meta.counts'
    >();
  });

  // 4. 可选属性
  it('should handle optional properties', () => {
    type Optional = {
      a?: {
        b?: string;
      };
    };
    // Should behave as if required for path generation
    expectTypeOf<Path<Optional>>().toEqualTypeOf<'a' | 'a.b'>();
  });

  // 5. 深度限制 (Depth Limit)
  // Note: D represents "remaining recursions".
  // D=0 -> Process current level, recurse with Prev[0] (never) -> Stops. (Total Depth 1)
  // D=1 -> Process current level, recurse with Prev[1] (0) -> Depth 1 + 1 = 2.
  it('should respect custom depth limit', () => {
    type Deep = {
      a: {
        b: {
          c: {
            d: string;
          };
        };
      };
    };

    // Depth 1 (Only root keys): Pass D=0
    expectTypeOf<Path<Deep, 0>>().toEqualTypeOf<'a'>();

    // Depth 2 (Root + 1 nested level): Pass D=1
    expectTypeOf<Path<Deep, 1>>().toEqualTypeOf<'a' | 'a.b'>();

    // Depth 3: Pass D=2
    expectTypeOf<Path<Deep, 2>>().toEqualTypeOf<'a' | 'a.b' | 'a.b.c'>();
  });

  // 6. 索引签名过滤 (Index Signature)
  it('should ignore string index signatures', () => {
    type Dictionary = {
      fixed: string;
      [key: string]: any;
    };
    // We expect only explicitly defined keys to be extracted to avoid exploding types
    expectTypeOf<Path<Dictionary>>().toEqualTypeOf<'fixed'>();
  });

  // 7. 联合类型
  it('should distribute over unions', () => {
    type Union = {
      state: { status: 'loading' } | { status: 'success'; data: string };
    };
    // state -> state.status
    // state -> state.status | state.data
    // Combined: "state" | "state.status" | "state.data"
    expectTypeOf<Path<Union>>().toEqualTypeOf<
      'state' | 'state.status' | 'state.data'
    >();
  });
});
