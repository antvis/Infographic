'use client';

import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands';
import {javascript} from '@codemirror/lang-javascript';
import {
  HighlightStyle,
  bracketMatching,
  foldGutter,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language';
import {EditorState, Extension} from '@codemirror/state';
import {
  EditorView,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
} from '@codemirror/view';
import {tags} from '@lezer/highlight';
import cn from 'classnames';
import {useEffect, useMemo, useRef} from 'react';

import {CustomTheme} from './Sandpack/Themes';

export type CodeMirrorLanguage = 'json' | 'javascript' | 'plaintext';

const syntaxTheme = HighlightStyle.define([
  {tag: tags.keyword, color: 'var(--sp-syntax-color-keyword)'},
  {
    tag: [tags.atom, tags.number, tags.bool],
    color: 'var(--sp-syntax-color-static)',
  },
  {
    tag: [tags.string, tags.special(tags.string)],
    color: 'var(--sp-syntax-color-string)',
  },
  {tag: tags.comment, color: 'var(--sp-syntax-color-comment)'},
  {tag: tags.variableName, color: 'var(--sp-syntax-color-plain)'},
  {
    tag: [tags.definition(tags.variableName), tags.function(tags.variableName)],
    color: 'var(--sp-syntax-color-definition)',
  },
  {tag: tags.propertyName, color: 'var(--sp-syntax-color-property)'},
  {tag: tags.punctuation, color: 'var(--sp-syntax-color-punctuation)'},
  {tag: tags.tagName, color: 'var(--sp-syntax-color-tag)'},
]);

const editorTheme = EditorView.theme({
  '&': {
    fontFamily: CustomTheme.font.mono,
    fontSize: CustomTheme.font.size,
    backgroundColor: 'transparent',
    color: 'var(--sp-syntax-color-plain)',
  },
  '&.cm-focused': {outline: 'none'},
  '.cm-content': {
    padding: '18px 0',
    caretColor: 'var(--sp-colors-accent)',
  },
  '.cm-scroller': {
    lineHeight: CustomTheme.font.lineHeight,
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  '.cm-scroller::-webkit-scrollbar': {
    display: 'none',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--sp-colors-surface1)',
    border: 'none',
    borderRight: '1px solid var(--sp-colors-surface2)',
    color: 'var(--sp-syntax-color-comment)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'var(--sp-colors-surface2)',
  },
  '.cm-activeLine, .cm-activeLineGutter': {
    borderRadius: '4px',
  },
  '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
    backgroundColor: 'rgba(8, 126, 164, 0.18)',
  },
  '.cm-matchingBracket, .cm-nonmatchingBracket': {
    backgroundColor: 'rgba(8, 126, 164, 0.12)',
    outline: '1px solid rgba(8, 126, 164, 0.3)',
  },
});

export function CodeEditor({
  ariaLabel,
  className,
  language,
  onChange,
  readOnly = false,
  value,
}: {
  ariaLabel?: string;
  className?: string;
  language: CodeMirrorLanguage;
  onChange: (next: string) => void;
  readOnly?: boolean;
  value: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const languageExtension = useMemo<Extension>(() => {
    if (language === 'plaintext') return [];
    return language === 'javascript'
      ? javascript({jsx: true, typescript: false})
      : javascript({jsx: false, typescript: false});
  }, [language]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const extensions: Extension[] = [
      lineNumbers(),
      foldGutter(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      drawSelection(),
      dropCursor(),
      indentOnInput(),
      syntaxHighlighting(syntaxTheme, {fallback: true}),
      bracketMatching(),
      EditorState.allowMultipleSelections.of(true),
      highlightActiveLine(),
      keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
      languageExtension,
      editorTheme,
      ...(readOnly
        ? [EditorState.readOnly.of(true), EditorView.editable.of(false)]
        : []),
      EditorView.updateListener.of((update) => {
        const handler = onChangeRef.current;
        if (update.docChanged && handler) {
          handler(update.state.doc.toString());
        }
      }),
    ];

    const state = EditorState.create({
      doc: valueRef.current,
      extensions,
    });
    const view = new EditorView({
      state,
      parent: containerRef.current,
    });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [languageExtension, readOnly]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) {
      return;
    }
    const currentValue = view.state.doc.toString();
    if (currentValue === value) {
      return;
    }
    view.dispatch({
      changes: {from: 0, to: currentValue.length, insert: value},
    });
  }, [value]);

  return (
    <div className={cn('sp-code-editor h-full', className)}>
      <div ref={containerRef} aria-label={ariaLabel} className="h-full" />
    </div>
  );
}
