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
