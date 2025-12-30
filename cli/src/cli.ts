#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { renderToSVG } from '@antv/infographic/ssr';
import type { SyntaxError } from '@antv/infographic';
import { registerResourceLoader } from '@antv/infographic';
import { resourceLoader } from './ResourceLoader.js';
interface CLIArgs {
  inputFile: string;
  outputFile: string | null;
  help: boolean;
}

/**
 * Parse command line arguments
 */
function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);

  // Check for help flag
  if (args.includes('-h') || args.includes('--help')) {
    return { inputFile: '', outputFile: null, help: true };
  }

  // Expect: infographic <input-file> -o <output-file>
  // or: infographic <input-file> --output <output-file>
  if (args.length < 1) {
    return { inputFile: '', outputFile: null, help: true };
  }

  const inputFile = args[0];
  let outputFile: string | null = null;

  // Find output flag
  const oIndex = args.indexOf('-o');
  const outputIndex = args.indexOf('--output');

  if (oIndex !== -1 && args[oIndex + 1]) {
    outputFile = args[oIndex + 1];
  } else if (outputIndex !== -1 && args[outputIndex + 1]) {
    outputFile = args[outputIndex + 1];
  }

  return { inputFile, outputFile, help: false };
}

/**
 * Display help message
 */
function showHelp(): void {
  console.log(`
@antv/infographic-cli - Render AntV Infographic Syntax to SVG in command line

Usage:
  infographic <input-file> [options]

Options:
  -o, --output <file>    Output SVG file path (if not specified, prints to stdout)
  -h, --help             Show this help message

Examples:
  # Render to stdout
  infographic input.txt

  # Render to file
  infographic input.txt -o output.svg
  infographic input.txt --output output.svg

Input File Format:
  The input file should contain AntV Infographic Syntax
  Example:
    infographic list-row-simple-horizontal-arrow
    data
      items
        - label Step 1
          desc Start
        - label Step 2
          desc In Progress
        - label Step 3
          desc Complete

The Syntax: https://infographic.antv.vision/learn/infographic-syntax/
For more information: https://github.com/antvis/Infographic
  `);
}

/**
 * Main CLI entry point
 */
async function main(): Promise<void> {
  const { inputFile, outputFile, help } = parseArgs();

  // Show help
  if (help || !inputFile) {
    showHelp();
    process.exit(help ? 0 : 1);
  }

  try {
    // Read input file
    const inputPath = resolve(process.cwd(), inputFile);
    const syntax = readFileSync(inputPath, 'utf-8');
    // Register resource loader (for custom resource loading logic)
    registerResourceLoader(resourceLoader);

    // Render to SVG (resources are now preloaded internally)
    const result = await renderToSVG({ input: syntax });

    // Output warnings to stderr
    if (result.warnings.length > 0) {
      console.warn('Warnings:');
      result.warnings.forEach((warning: SyntaxError) => {
        console.warn(
          `  [${warning.code}] ${warning.message} (line ${warning.line})`,
        );
      });
    }

    // Check for errors
    if (result.errors.length > 0) {
      console.error('Errors:');
      result.errors.forEach((error: SyntaxError) => {
        console.error(
          `  [${error.code}] ${error.message} (line ${error.line})`,
        );
      });
      process.exit(1);
    }

    // Write output
    if (outputFile) {
      const outputPath = resolve(process.cwd(), outputFile);
      writeFileSync(outputPath, result.svg, 'utf-8');
      console.log(`Successfully rendered to ${outputFile}`);
    } else {
      // Output to stdout
      process.stdout.write(result.svg);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unexpected error occurred');
    }
    process.exit(1);
  }
}

// Export for testing
export { parseArgs, main, showHelp };
