---
title: Editor
---

The editor enables in-browser selection, dragging, and text editing on a rendered infographic. It is composed of **plugins** and **interactions**: plugins provide UI/features, while interactions handle input behavior and state.

## Enable the editor {#enable}

Turn on `editable` when creating the instance:

```js
import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  editable: true,
});

infographic.render(syntax);
```

By default, the following plugins and interactions are enabled:

- Plugins: `EditBar`, `ResizeElement`
- Interactions: `DragCanvas`, `DblClickEditText`, `BrushSelect`, `ClickSelect`, `DragElement`, `HotkeyHistory`, `ZoomWheel`, `SelectHighlight`

<Note>
  Providing `plugins` or `interactions` will **replace the defaults**.
</Note>

## Built-in plugins {#built-in-plugins}

### EditBar {#editbar}
A floating toolbar that adapts to the current selection (text color/size/align/font, icon color, element align/distribute, etc.).

Optional parameters:

```ts
type EditBarOptions = {
  style?: Partial<CSSStyleDeclaration>;
  className?: string;
  getContainer?: HTMLElement | (() => HTMLElement);
};
```

### ResizeElement {#resizeelement}
Provides resize handles and selection overlays for **editable text**.

## Built-in interactions {#built-in-interactions}

- **DragCanvas**: hold Space to drag the canvas; supports custom trigger keys.
- **DblClickEditText**: double-click text to edit.
- **BrushSelect**: drag on empty area to box-select; hold Shift to add selection.
- **ClickSelect**: click to select, Shift to multi-select, Esc to clear.
- **DragElement**: drag elements to move; hold Alt to disable snapping.
- **HotkeyHistory**: `Ctrl/Cmd + Z` undo, `Ctrl/Cmd + Shift + Z` or `Ctrl/Cmd + Y` redo.
- **ZoomWheel**: `Ctrl/Cmd + wheel` zoom at pointer, `Shift + wheel` zoom at center, `Ctrl/Cmd + Shift + wheel` reset view.
- **SelectHighlight**: draw highlight outlines for selections.

`DragCanvas` options:

```ts
type DragCanvasOptions = {
  trigger?: KeyCode[]; // default ['Space']
};
```

## Configure plugins and interactions {#configure}

Pass **instance arrays** to `plugins` and `interactions`:

```js
import {
  Infographic,
  EditBar,
  ResizeElement,
  DragCanvas,
  ClickSelect,
  BrushSelect,
  DragElement,
  DblClickEditText,
  HotkeyHistory,
  ZoomWheel,
  SelectHighlight,
} from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  editable: true,
  plugins: [new EditBar(), new ResizeElement()],
  interactions: [
    new DragCanvas({ trigger: ['Space'] }),
    new DblClickEditText(),
    new BrushSelect(),
    new ClickSelect(),
    new DragElement(),
    new HotkeyHistory(),
    new ZoomWheel(),
    new SelectHighlight(),
  ],
});
```

## Custom plugins {#custom-plugin}

Implement `name`, `init`, and `destroy`. In `init`, you can access `emitter`, `editor`, `commander`, and `state` to extend behavior:

```ts
import { Plugin } from '@antv/infographic';

class DebugSelectionPlugin extends Plugin {
  name = 'debug-selection';

  init(options) {
    super.init(options);
    this.emitter.on('selection:change', this.onSelectionChange);
  }

  destroy() {
    this.emitter.off('selection:change', this.onSelectionChange);
  }

  private onSelectionChange = (payload) => {
    console.log('selection:', payload.next);
  };
}
```

Enable it by passing an instance to `plugins`:

```js
const infographic = new Infographic({
  container: '#container',
  editable: true,
  plugins: [new DebugSelectionPlugin()],
});
```
