---
title: Infographic API
---

The AntV Infographic API is exposed through the `Infographic` class. You can create an instance to render, export, and manipulate infographics.

## Create an Infographic {#create-infographic}

Import `Infographic` and instantiate it with the following constructor:

```ts
constructor (options: string | Partial<InfographicOptions>): Infographic;
```

`options` supports two forms:

- **Infographic syntax string** – see [Infographic Syntax](/learn/infographic-syntax). Suitable for AI or streaming-based rendering.
- **(Partial) `InfographicOptions` object** – a JSON that follows the [configuration reference](/reference/infographic-options).

## Instance Methods {#instance-methods}

### getOptions {#getoptions}

Return the current configuration held by the instance, which helps with debugging or secondary processing. When initialized with syntax, it returns the parsed config object.

```typescript
getOptions(): Partial<InfographicOptions>
```

### render {#render}

Render the infographic with either syntax or a partial configuration.

```typescript
render(options?: string | Partial<InfographicOptions>): void
```

**Example**:

```typescript
import {Infographic} from '@antv/infographic';

const infographic = new Infographic({
  // configuration
});

const syntax = `
infographic <template-name>
data
  title Title
  items
    - label Item 1
    - label Item 2
`;

infographic.render(syntax);
```

### update {#update}

Merge new syntax or options into the current configuration. Useful when you only need to change part of the state.

```typescript
update(options: string | Partial<InfographicOptions>): void
```

**Example**:

```typescript
infographic.update({
  theme: 'dark',
});
```

### compose {#compose}

Create a pre-rendered template from parsed infographic options. Usually `render()` handles this step, but you can call it directly when you manage the rendering pipeline yourself. Pass the `ParsedInfographicOptions` parsed from syntax via `parseOptions`.

```typescript
compose(parsedOptions: ParsedInfographicOptions): SVGSVGElement
```

### getTypes {#gettypes}

Generate the TypeScript type definitions required for the current infographic, which is handy when feeding large models with structured data.

```typescript
getTypes(): string
```

### toDataURL {#todataurl}

Export the infographic as an image and receive a `data:` URL string. This method must be called in the browser after rendering.

```typescript
toDataURL(options?: ExportOptions): Promise<string>
```

`options` (see [ExportOptions](/reference/infographic-types#export-options)) accepts `{type: 'svg'; embedResources?: boolean; removeIds?: boolean}` or `{type: 'png'; dpr?: number}`. Defaults to PNG when omitted.

**Example**:

```typescript
const url = await infographic.toDataURL({type: 'svg', embedResources: true});
```

### on / off {#on}

Register or remove event listeners.

```typescript
on(event: string, listener: (...args: any[]) => void): void
off(event: string, listener: (...args: any[]) => void): void
```

Built-in events:

- `warning`: Non-fatal warnings emitted during syntax parsing. Payload is `SyntaxError[]`.
- `error`: Emitted when parsing or rendering fails. May carry `SyntaxError[]` or `Error`.
- `rendered`: Fired after rendering completes, payload `{node, options}`.
- `destroyed`: Fired after calling `destroy()`.

### destroy {#destroy}

Destroy the instance, clear rendered output, and clean up event listeners and editor state.

```typescript
destroy(): void
```
