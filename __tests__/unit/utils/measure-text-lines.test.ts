import { describe, expect, it } from 'vitest';
import { measureTextLines } from '../../../src/utils/measure-text';

// 与 BadgeCard 描述文本一致的排版参数：字号 12（不低于浏览器最小字号下限）、卡片内容宽 184px
const attrs = { fontSize: 12, lineHeight: 1.2, maxWidth: 184 };

describe('measureTextLines', () => {
  it('reports the extra lines a long description actually needs', () => {
    expect(
      measureTextLines(
        'Collections implement IntoIterator to produce iterators via into_iter, iter, or iter_mut.',
        attrs,
      ),
    ).toBe(3);
  });

  it('keeps a short description within two lines', () => {
    expect(
      measureTextLines('Store closures as struct fields.', attrs),
    ).toBeLessThanOrEqual(2);
  });

  it('keeps a label-sized string on one line', () => {
    expect(measureTextLines('Closure Basics', attrs)).toBe(1);
  });

  it('wraps CJK text character by character', () => {
    expect(
      measureTextLines(
        '这是一段比较长的中文描述文本用于验证换行测量是否正确',
        attrs,
      ),
    ).toBeGreaterThan(1);
  });

  it('breaks a single word that overflows the container', () => {
    expect(measureTextLines('A'.repeat(200), attrs)).toBeGreaterThan(1);
  });

  it('scales the line count with the available width', () => {
    const text = 'Consumers like sum and collect consume iterators lazily.';

    expect(measureTextLines(text, { ...attrs, maxWidth: 90 })).toBeGreaterThan(
      measureTextLines(text, { ...attrs, maxWidth: 300 }),
    );
  });
});
