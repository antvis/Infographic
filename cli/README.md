# @antv/infographic-cli

CLI tool for server-side rendering (SSR) of AntV Infographic.

## Installation

```bash
npm install -g @antv/infographic-cli
# or
npx @antv/infographic-cli
```

## Usage

### Basic Usage

```bash
# Render to stdout
infographic input.txt

# Render to file
infographic input.txt -o output.svg
infographic input.txt --output output.svg
```

### Help

```bash
infographic --help
# or
infographic -h
```

## Input File Format

The input file should contain AntV Infographic Syntax (YAML-like format).

Example `input.txt`:

```
infographic list-row-simple-horizontal-arrow
data
  items
    - label Step 1
      desc Start
    - label Step 2
      desc In Progress
    - label Step 3
      desc Complete
```

## Examples

This package includes a collection of example files in the `examples/` directory demonstrating various templates and features:

- **Basic lists** - Simple horizontal layouts with arrows
- **Icons & values** - Enhanced visuals with MDI/Lucide icons
- **Timelines** - Temporal data visualization
- **Themes** - Custom color schemes and dark mode
- **Comparisons** - Two-column and quadrant layouts
- **Hierarchies** - Tree structures for organizational data
- **Charts** - Bar charts with metrics

### Run a Single Example

```bash
# Using npm script
npm run example examples/01-basic-list.txt -o output.svg

# Or directly with the binary
node bin/cli.js examples/02-list-with-icons.txt -o icons.svg
```

### Run All Examples

Generate SVG outputs for all examples at once:

```bash
npm run examples:all
```

This will create an `output/` directory with all generated SVG files.

### Create Your Own

Create `example.txt`:

```
infographic list-row-simple-horizontal-arrow
data
  title My Process
  items
    - label Planning
      desc Define requirements
    - label Development
      desc Build features
    - label Testing
      desc Quality assurance
    - label Deployment
      desc Go live
```

Render to SVG:

```bash
infographic example.txt -o process.svg
```

For more details, see [examples/README.md](./examples/README.md).

## Requirements

- Node.js >= 16

## Related

- [@antv/infographic](https://www.npmjs.com/package/@antv/infographic) - Browser-based infographic rendering library

## License

MIT
