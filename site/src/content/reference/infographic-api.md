---
title: Infographic API
---

AntV Infographic 的 API 由 `Infographic` 类统一对外暴露，用户可以通过该类创建信息图实例，并进行渲染和导出等操作。

## 创建信息图实例 {#create-infographic}

要创建信息图实例，首先需要导入 `Infographic` 类，然后通过 `new` 关键字进行实例化，其构造函数签名为：

```ts
constructor (options: InfographicOptions): Infographic;
```

其中，`options` 即我们所指的[信息图语法](/learn/infographic-syntax)用于配置信息图的相关选项，具体配置项请参考[配置项](/reference/infographic-options)。

## 实例方法 {#instance-methods}

### getOptions {#getoptions}

获取实例当前持有的配置信息，便于调试或二次加工。

**类型签名：**

```typescript
getOptions(): InfographicOptions
```

### render {#render}

根据配置信息渲染信息图。

**类型签名：**

```typescript
render(): void
```

**示例：**

```typescript
import {Infographic} from '@antv/infographic';

const infographic = new Infographic({
  // 信息图配置
});

infographic.render();
```

### compose {#compose}

创建未渲染的信息图模板，以供后续渲染使用。

**类型签名：**

```typescript
compose(): SVGSVGElement
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

`options`（见 [ExportOptions](/reference/infographic-types#export-options)）支持 `{type: 'svg'; embedResources?: boolean}` 或 `{type: 'png'; dpr?: number}`，不传时默认导出 PNG。

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

- `rendered`：完成渲染后触发，携带 `{node, options}`。
- `destroyed`：调用 `destroy()` 后触发。

### destroy {#destroy}

销毁实例，移除渲染结果并清理事件与编辑器状态。

**类型签名：**

```typescript
destroy(): void
```
