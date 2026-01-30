---
title: 编辑器
---

编辑器用于在浏览器中对渲染后的信息图进行选择、拖拽、文本编辑等交互操作。它由 **插件（Plugin）** 与 **交互（Interaction）** 两部分组成：插件负责 UI 与功能扩展，交互负责输入行为与状态管理。

## 启用编辑器 {#enable}

只要在实例化时打开 `editable`，渲染后即可获得编辑能力：

```js
import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  editable: true,
});

infographic.render(syntax);
```

默认会启用以下插件与交互：

- 插件：`EditBar`、`ResizeElement`
- 交互：`DragCanvas`、`DblClickEditText`、`BrushSelect`、`ClickSelect`、`DragElement`、`HotkeyHistory`、`ZoomWheel`、`SelectHighlight`

<Note>
  只要显式传入 `plugins` 或 `interactions`，就会**替换默认列表**。
</Note>

## 内置插件 {#built-in-plugins}

### EditBar {#editbar}

浮动工具条，会根据当前选中元素显示对应编辑项（文本颜色/字号/对齐/字体、图标颜色、元素对齐与分布等）。

可选参数：

```ts
type EditBarOptions = {
  style?: Partial<CSSStyleDeclaration>;
  className?: string;
  getContainer?: HTMLElement | (() => HTMLElement);
};
```

### ResizeElement {#resizeelement}

为**可编辑文本**提供缩放手柄与选区提示。

## 内置交互 {#built-in-interactions}

- **DragCanvas**：按住空格拖拽画布；支持自定义触发键。
- **DblClickEditText**：双击文本进入编辑。
- **BrushSelect**：空白处拖拽框选元素，按住 Shift 可追加选择。
- **ClickSelect**：单击选择，Shift 多选，Esc 清空选择。
- **DragElement**：拖拽元素移动，按住 Alt 可临时关闭吸附。
- **HotkeyHistory**：`Ctrl/Cmd + Z` 撤销，`Ctrl/Cmd + Shift + Z` 或 `Ctrl/Cmd + Y` 重做。
- **ZoomWheel**：`Ctrl/Cmd + 滚轮` 指针处缩放，`Shift + 滚轮` 中心缩放，`Ctrl/Cmd + Shift + 滚轮` 重置视图。
- **SelectHighlight**：为选中元素绘制高亮边框。

`DragCanvas` 可选参数：

```ts
type DragCanvasOptions = {
  trigger?: KeyCode[]; // 默认 ['Space']
};
```

## 配置启用的插件与交互 {#configure}

通过 `plugins` 与 `interactions` 传入**实例数组**即可：

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

## 自定义插件 {#custom-plugin}

自定义插件只需实现 `name`、`init`、`destroy`。在 `init` 中可使用 `emitter`、`editor`、`commander`、`state` 等对象进行扩展：

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

将插件实例放入 `plugins` 即可启用：

```js
const infographic = new Infographic({
  container: '#container',
  editable: true,
  plugins: [new DebugSelectionPlugin()],
});
```
