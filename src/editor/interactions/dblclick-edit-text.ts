import type { TextElement } from '../../types';
import {
  getTextContent,
  getTextEntity,
  injectStyleOnce,
  isEditableText,
} from '../../utils';
import { UpdateTextCommand } from '../commands';
import type {
  IInteraction,
  InteractionInitOptions,
  Selection,
  SelectionChangePayload,
} from '../types';
import { ClickHandler, getEventTarget } from '../utils';
import { Interaction } from './base';

export class DblClickEditText extends Interaction implements IInteraction {
  name = 'dblclick-edit-text';

  private clickHandler?: ClickHandler;
  private detachSelectionListener?: () => void;

  init(options: InteractionInitOptions) {
    super.init(options);
    const { editor, commander, interaction } = options;
    this.clickHandler = new ClickHandler(editor.getDocument()).onDoubleClick(
      (event) => {
        if (!interaction.isActive()) return;

        interaction.executeExclusiveInteraction(this, async () => {
          const target = getEventTarget(event.target as SVGElement);
          if (!target) return;
          if (isEditableText(target)) {
            interaction.select([target], 'replace');
            const originalText = getTextContent(target);
            const text = await new Promise<string>((resolve) => {
              const stopListen = this.listenSelectionChange(target);
              editText(target, {
                cursorPosition: {
                  clientX: event.clientX,
                  clientY: event.clientY,
                },
                onBlur: resolve,
                onCancel: resolve,
              });
              this.detachSelectionListener = stopListen;
            });

            commander.execute(
              new UpdateTextCommand(target, text, originalText),
            );
          }
        });
      },
    );
  }

  destroy() {
    this.clickHandler?.destroy();
    this.detachSelectionListener?.();
  }

  private listenSelectionChange(target: Selection[number]) {
    const handler = ({ next }: SelectionChangePayload) => {
      if (!next.includes(target)) {
        this.detachSelectionListener?.();
        this.detachSelectionListener = undefined;
        const entity = getTextEntity(target as TextElement);
        if (entity) entity.blur();
      }
    };
    this.emitter.on('selection:change', handler);
    return () => this.emitter.off('selection:change', handler);
  }
}

type EditTextOptions = {
  cursorPosition?: {
    clientX: number;
    clientY: number;
  };
  onInput?: (text: string) => void;
  onBlur?: (text: string) => void;
  onCancel?: (text: string) => void;
};

const EDITOR_STYLE_ID = 'infographic-inline-text-editor-style';
const EDITOR_BASE_CLASS = 'infographic-inline-text-editor';

function editText(text: TextElement, options?: EditTextOptions) {
  const entity = getTextEntity(text);
  if (!entity) return;

  ensureEditorStyles();
  new InlineTextEditor(entity, options).start();
}

class InlineTextEditor {
  constructor(
    private entity: HTMLSpanElement,
    private options?: EditTextOptions,
  ) {}

  start() {
    this.entity.setAttribute('contenteditable', 'true');
    this.entity.classList.add(EDITOR_BASE_CLASS);
    this.entity.focus();
    this.placeCaretAtClickPosition();
    this.attachListeners();
  }

  private attachListeners() {
    this.entity.addEventListener('paste', this.handlePaste);
    this.entity.addEventListener('keydown', this.handleKeydown);
    this.entity.addEventListener('input', this.handleInput);
    this.entity.addEventListener('blur', this.handleBlur, { once: true });
  }

  private detachListeners() {
    this.entity.removeEventListener('paste', this.handlePaste);
    this.entity.removeEventListener('keydown', this.handleKeydown);
    this.entity.removeEventListener('input', this.handleInput);
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
    this.entity.removeAttribute('contenteditable');
    this.entity.classList.remove(EDITOR_BASE_CLASS);
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
      this.entity.childNodes.length === 1 &&
      this.entity.firstChild?.nodeType === Node.TEXT_NODE
    ) {
      return;
    }

    const plainText = this.getText();
    this.entity.textContent = plainText;
  }

  private placeCaretAtClickPosition() {
    const selection = window.getSelection();
    if (!selection) return;

    const rangeFromPoint = this.getRangeFromPoint();
    if (rangeFromPoint) {
      selection.removeAllRanges();
      selection.addRange(rangeFromPoint);
      return;
    }

    this.placeCaretAtEnd();
  }

  private getRangeFromPoint(): Range | null {
    const { cursorPosition } = this.options || {};
    if (!cursorPosition) return null;

    const { clientX, clientY } = cursorPosition;
    const doc = document as any;
    const rangeFromPoint: Range | null =
      doc.caretRangeFromPoint?.(clientX, clientY) ??
      (() => {
        const caretPosition = doc.caretPositionFromPoint?.(clientX, clientY);
        if (!caretPosition) return null;
        const caretRange = document.createRange();
        caretRange.setStart(caretPosition.offsetNode, caretPosition.offset);
        caretRange.collapse(true);
        return caretRange;
      })();

    if (!rangeFromPoint) return null;
    if (!this.entity.contains(rangeFromPoint.startContainer)) return null;
    return rangeFromPoint;
  }

  private placeCaretAtEnd() {
    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    range.selectNodeContents(this.entity);
    range.collapse(false);

    selection.removeAllRanges();
    selection.addRange(range);
  }

  private getText() {
    return this.entity.textContent || '';
  }
}

function ensureEditorStyles() {
  injectStyleOnce(
    EDITOR_STYLE_ID,
    `
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
`,
  );
}
