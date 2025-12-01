import type { TextElement } from '../../types';
import { UpdateTextCommand } from '../commands';
import type {
  ICommandManager,
  IEditor,
  IInteractionManager,
  Interaction,
} from '../types';
import {
  ClickHandler,
  getEventTarget,
  getTextSpan,
  isEditableText,
} from '../utils';

export class DblClickEditText implements Interaction {
  name = 'dblclick-edit-text';

  private clickHandler?: ClickHandler;

  init(
    editor: IEditor,
    command: ICommandManager,
    interaction: IInteractionManager,
  ) {
    this.clickHandler = new ClickHandler(editor.getDocument()).onDoubleClick(
      (event) => {
        if (!interaction.isActive()) return;

        interaction.executeExclusiveInteraction(this, async () => {
          const target = getEventTarget(event.target as SVGElement);
          if (!target) return;
          if (isEditableText(target)) {
            interaction.select([target], 'replace');

            const text = await new Promise<string>((resolve) => {
              editText(target, {
                onBlur: resolve,
              });
            });

            command.execute(new UpdateTextCommand(target, text));
          }
        });
      },
    );
  }

  destroy() {
    this.clickHandler?.destroy();
  }
}

type EditTextOptions = {
  onInput?: (text: string) => void;
  onBlur?: (text: string) => void;
};

const EDITOR_STYLE_ID = 'infographic-inline-text-editor-style';
const EDITOR_BASE_CLASS = 'infographic-inline-text-editor';

function editText(text: TextElement, options?: EditTextOptions) {
  const span = getTextSpan(text);
  if (!span) return;

  ensureEditorStyles(text.ownerDocument || document);
  new InlineTextEditor(span, options).start();
}

class InlineTextEditor {
  constructor(
    private span: HTMLSpanElement,
    private options?: EditTextOptions,
  ) {}

  start() {
    this.span.setAttribute('contenteditable', 'true');
    this.span.classList.add(EDITOR_BASE_CLASS);
    this.span.focus();
    this.placeCaretAtEnd();
    this.attachListeners();
  }

  private attachListeners() {
    this.span.addEventListener('paste', this.handlePaste);
    this.span.addEventListener('keydown', this.handleKeydown);
    this.span.addEventListener('input', this.handleInput);
    this.span.addEventListener('blur', this.handleBlur, { once: true });
  }

  private detachListeners() {
    this.span.removeEventListener('paste', this.handlePaste);
    this.span.removeEventListener('keydown', this.handleKeydown);
    this.span.removeEventListener('input', this.handleInput);
  }

  private handlePaste = (event: ClipboardEvent) => {
    if (!event.clipboardData) return;
    event.preventDefault();
    this.insertPlainText(event.clipboardData.getData('text/plain'));
  };

  private handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.insertPlainText('\n');
    }
  };

  private handleInput = () => {
    this.normalizeSpanContent();
    this.options?.onInput?.(this.getText());
  };

  private handleBlur = () => {
    this.span.removeAttribute('contenteditable');
    this.span.classList.remove(EDITOR_BASE_CLASS);
    this.normalizeSpanContent();
    this.options?.onBlur?.(this.getText());
    this.detachListeners();
  };

  private insertPlainText(text: string) {
    const selection = window.getSelection();
    if (!selection) return;

    if (!selection.rangeCount) {
      this.placeCaretAtEnd();
    }

    const range = selection.rangeCount
      ? selection.getRangeAt(0)
      : document.createRange();
    range.deleteContents();

    const textNode = document.createTextNode(text);
    range.insertNode(textNode);

    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);

    // Mirror native input behavior so consumers stay in sync.
    this.normalizeSpanContent();
    this.options?.onInput?.(this.getText());
  }

  private normalizeSpanContent() {
    if (
      this.span.childNodes.length === 1 &&
      this.span.firstChild?.nodeType === Node.TEXT_NODE
    ) {
      return;
    }

    const plainText = this.getText();
    this.span.textContent = plainText;
  }

  private placeCaretAtEnd() {
    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    range.selectNodeContents(this.span);
    range.collapse(false);

    selection.removeAllRanges();
    selection.addRange(range);
  }

  private getText() {
    return this.span.textContent || '';
  }
}

function ensureEditorStyles(doc: Document) {
  if (doc.getElementById(EDITOR_STYLE_ID)) return;

  const style = doc.createElement('style');
  style.id = EDITOR_STYLE_ID;
  style.textContent = `
.${EDITOR_BASE_CLASS} {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: transparent;
  outline: none;
  cursor: text;
}
.${EDITOR_BASE_CLASS}::selection {
  background-color: #b3d4fc;
}
`;

  doc.head.appendChild(style);
}
