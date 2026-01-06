---
title: Infographic API
---

AntV Infographic 的 API 由 `Infographic` 类统一对外暴露，用户可以通过该类创建信息图实例，并进行渲染和导出等操作。

## 创建信息图实例 {#create-infographic}

要创建信息图实例，首先需要导入 `Infographic` 类，然后通过 `new` 关键字进行实例化，其构造函数签名为：

```ts
constructor (options: string | Partial<InfographicOptions>): Infographic;
```

其中，`options` 可以是两种形式：

- **信息图语法字符串**：参见[信息图语法](/learn/infographic-syntax)，适合让 AI 或流式输出直接驱动渲染。
- **（部分）`InfographicOptions` 对象**：按照[配置项](/reference/infographic-options)构造的 JSON。

## 实例方法 {#instance-methods}

### getOptions {#getoptions}

获取实例当前持有的配置信息，便于调试或二次加工。对于信息图语法，会返回解析后的配置对象。

**类型签名：**

```typescript
getOptions(): Partial<InfographicOptions>
```

### render {#render}

根据配置信息或语法字符串渲染信息图。

**类型签名：**

```typescript
render(options?: string | Partial<InfographicOptions>): void
```

**示例：**

```typescript
import {Infographic} from '@antv/infographic';

const infographic = new Infographic({
  // 信息图配置
});

const syntax = `
infographic <template-name>
data
  title 标题
  items
    - label 标签1
    - label 标签2
`;

// 直接渲染信息图语法
infographic.render(syntax);
```

### update {#update}

在现有配置的基础上进行增量更新。`update()` 会将传入的语法或配置与当前实例中的 `options` 进行合并，适用于只修改部分字段的场景。

**类型签名：**

```typescript
update(options: string | Partial<InfographicOptions>): void
```

**示例：**

```typescript
// 更新主题，同时保留之前的配置
infographic.update({
  theme: 'dark',
});
```

### compose {#compose}

创建未渲染的信息图模板，以供后续渲染使用。通常不需要手动调用；`render()` 会自动执行这一步。但如果你打算自己接管渲染流程，可以显式传入 `ParsedInfographicOptions`（可由语法字符串解析后再通过 `parseOptions` 获取）。

**类型签名：**

```typescript
compose(parsedOptions: ParsedInfographicOptions): SVGSVGElement
```

### getTypes {#gettypes}

获取当前信息图所需数据的 TS 类型定义，便于通过大模型等工具生成符合要求的数据。

**类型签名：**

```typescript
getTypes(): string
```

### toDataURL {#todataurl}

导出信息图的图片数据，返回 Data URL 字符串。需要在浏览器环境且在 `render()` 之后调用。

**类型签名：**

```typescript
toDataURL(options?: ExportOptions): Promise<string>
```

`options`（见 [ExportOptions](/reference/infographic-types#export-options)）支持 `{type: 'svg'; embedResources?: boolean; removeIds?: boolean}` 或 `{type: 'png'; dpr?: number}`，不传时默认导出 PNG。

**示例：**

```typescript
const url = await infographic.toDataURL({type: 'svg', embedResources: true});
```

### on / off {#on}

注册或移除事件监听器。

**类型签名：**

```typescript
on(event: string, listener: (...args: any[]) => void): void
off(event: string, listener: (...args: any[]) => void): void
```

内置事件包括：

- `warning`：解析语法字符串时出现的非致命警告，携带 `SyntaxError[]`。
- `error`：解析或渲染失败时触发，可能是 `SyntaxError[]` 或 `Error`。
- `rendered`：完成渲染后触发，携带 `{node, options}`。
- `destroyed`：调用 `destroy()` 后触发。

### destroy {#destroy}

销毁实例，移除渲染结果并清理事件与编辑器状态。

**类型签名：**

```typescript
destroy(): void
```
