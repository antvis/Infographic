import { describe, expect, it } from 'vitest';
import { escapeHtml } from '../../../../src/jsx//utils';

describe('escape utils', () => {
  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      expect(escapeHtml('&')).toBe('&amp;');
      expect(escapeHtml('<')).toBe('&lt;');
      expect(escapeHtml('>')).toBe('&gt;');
      expect(escapeHtml('"')).toBe('&quot;');
      expect(escapeHtml("'")).toBe('&#39;');
    });

    it('should escape multiple characters in a string', () => {
      expect(escapeHtml('<div class="test">&content</div>')).toBe(
        '&lt;div class=&quot;test&quot;&gt;&amp;content&lt;/div&gt;',
      );
    });

    it('should handle strings with mixed content', () => {
      expect(escapeHtml('Hello & "world" <script>')).toBe(
        'Hello &amp; &quot;world&quot; &lt;script&gt;',
      );
    });

    it('should return empty string for empty input', () => {
      expect(escapeHtml('')).toBe('');
    });

    it('should handle strings with no special characters', () => {
      expect(escapeHtml('Hello World')).toBe('Hello World');
      expect(escapeHtml('123456')).toBe('123456');
    });

    it('should handle strings with only special characters', () => {
      expect(escapeHtml('&<>"\'&<>"\'&<>"\'&<>"\'')).toBe(
        '&amp;&lt;&gt;&quot;&#39;&amp;&lt;&gt;&quot;&#39;&amp;&lt;&gt;&quot;&#39;&amp;&lt;&gt;&quot;&#39;',
      );
    });

    it('should handle numbers by converting to string first', () => {
      expect(escapeHtml('123' as any)).toBe('123');
      expect(escapeHtml('123 < 456')).toBe('123 &lt; 456');
    });

    it('should handle single quotes in attributes', () => {
      expect(escapeHtml('onclick=\'alert("test")\'')).toBe(
        'onclick=&#39;alert(&quot;test&quot;)&#39;',
      );
    });

    it('should handle script tags and content', () => {
      expect(escapeHtml('<script>alert("XSS")</script>')).toBe(
        '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;',
      );
    });

    it('should handle complex HTML with attributes and content', () => {
      const input =
        '<img src="test.jpg" alt="A & B" onclick=\'alert("click")\'>';
      const expected =
        '&lt;img src=&quot;test.jpg&quot; alt=&quot;A &amp; B&quot; onclick=&#39;alert(&quot;click&quot;)&#39;&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });
  });
});
