# @antv/infographic-jsx

JSX runtime for AntV Infographic - a lightweight library for creating SVG graphics using JSX syntax.

## Features

- **JSX Syntax**: Write SVG components using familiar JSX syntax
- **Component Library**: Built-in components for common SVG elements (Rect, Ellipse, Text, Group, Path, Polygon)
- **Layout System**: Automatic layout management with bounds calculation
- **TypeScript Support**: Full TypeScript support with comprehensive type definitions
- **Fragment Support**: Support for React-style fragments (`<>...</>`)
- **Custom Components**: Create reusable custom components with function components
- **SVG Rendering**: Render JSX elements to optimized SVG strings

## Installation

```bash
npm install @antv/infographic-jsx
```

## Quick Start

### Basic Usage

```tsx
/** @jsxImportSource @antv/infographic-jsx */
import { renderSVG, Rect, Text, Group } from '@antv/infographic-jsx';

const MyGraphic = () => (
  <Group>
    <Rect width={100} height={50} fill="blue" />
    <Text x={10} y={30} fill="white">
      Hello World
    </Text>
  </Group>
);

const svgString = renderSVG(<MyGraphic />);
console.log(svgString);
```

### TypeScript Configuration

Add to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@antv/infographic-jsx"
  }
}
```

## Components

### Built-in Components

- **`<Rect>`** - Rectangle elements with positioning and styling
- **`<Ellipse>`** - Ellipse/circle elements
- **`<Text>`** - Text elements with alignment and styling options
- **`<Group>`** - Container for grouping elements with transforms
- **`<Path>`** - SVG path elements for complex shapes
- **`<Polygon>`** - Polygon elements
- **`<Defs>`** - SVG definitions container for reusable elements

### Text Component Features

The Text component supports advanced text positioning and styling:

```tsx
<Text
  x={10}
  y={20}
  width={100}
  height={30}
  alignHorizontal="center"
  alignVertical="middle"
  fontSize={14}
  fontFamily="Arial"
  fill="black"
  backgroundColor="yellow"
>
  Centered Text
</Text>
```

## Advanced Features

### Custom Components

Create reusable components using function syntax:

```tsx
const Button = ({ x, y, width, height, label, color = "blue" }) => (
  <Group x={x} y={y}>
    <Rect width={width} height={height} fill={color} />
    <Text
      x={width/2}
      y={height/2}
      alignHorizontal="center"
      alignVertical="middle"
    >
      {label}
    </Text>
  </Group>
);

const MyUI = () => (
  <Group>
    <Button x={10} y={10} width={80} height={30} label="Click me" />
    <Button x={100} y={10} width={80} height={30} label="Cancel" color="red" />
  </Group>
);
```

### Fragments

Use fragments to group elements without additional containers:

```tsx
const MultipleShapes = () => (
  <>
    <Rect width={50} height={50} fill="red" />
    <Ellipse x={60} width={50} height={50} fill="blue" />
  </>
);
```

### Layout System

The library automatically calculates bounds and optimizes viewBox:

```tsx
const graphic = renderSVG(<MyGraphic />);
// Automatically sets viewBox based on content bounds
```

You can also specify custom SVG properties:

```tsx
const graphic = renderSVG(<MyGraphic />, {
  width: 200,
  height: 200,
  viewBox: "0 0 200 200"
});
```

## API Reference

### `renderSVG(element, props?)`

Renders a JSX element to an SVG string.

**Parameters:**
- `element`: JSX element to render
- `props` (optional): SVG root element properties

**Returns:** SVG string

### Component Props

All components support standard SVG attributes plus:

#### Common Props
- `x`, `y`: Position
- `width`, `height`: Dimensions
- `fill`, `stroke`: Colors
- `opacity`: Transparency
- `id`: Element identifier

#### Text-specific Props
- `alignHorizontal`: `"left" | "center" | "right"`
- `alignVertical`: `"top" | "center" | "bottom"`
- `fontSize`: Font size
- `fontFamily`, `fontStyle`, `fontWeight`: Font properties
- `backgroundColor`: Background color

#### Group Props
- `transform`: SVG transform attribute
- All positioning props apply transforms

## Development

### Scripts

- `npm run build` - Build the library
- `npm run test` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run watch` - Build in watch mode

### Testing

The project uses Vitest for testing with comprehensive coverage:

```bash
npm test
```

### Project Structure

```
src/
├── components/     # Built-in JSX components
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── jsx-runtime.ts # JSX runtime implementation
├── renderer.ts    # SVG rendering engine
├── layout.ts      # Layout system
└── index.ts       # Main exports
```

## License

MIT

## Contributing

This is part of the AntV ecosystem. Please refer to the main repository for contribution guidelines.