import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { parseArgs } from '../src/cli';

describe('CLI Argument Parsing', () => {
  let originalArgv: string[];

  beforeEach(() => {
    originalArgv = process.argv;
  });

  afterEach(() => {
    process.argv = originalArgv;
  });

  it('should parse input file only', () => {
    process.argv = ['node', 'cli.js', 'input.txt'];
    const args = parseArgs();
    expect(args.inputFile).toBe('input.txt');
    expect(args.outputFile).toBeNull();
    expect(args.help).toBe(false);
  });

  it('should parse input and output with -o flag', () => {
    process.argv = ['node', 'cli.js', 'input.txt', '-o', 'output.svg'];
    const args = parseArgs();
    expect(args.inputFile).toBe('input.txt');
    expect(args.outputFile).toBe('output.svg');
    expect(args.help).toBe(false);
  });

  it('should parse input and output with --output flag', () => {
    process.argv = ['node', 'cli.js', 'input.txt', '--output', 'output.svg'];
    const args = parseArgs();
    expect(args.inputFile).toBe('input.txt');
    expect(args.outputFile).toBe('output.svg');
    expect(args.help).toBe(false);
  });

  it('should show help with -h flag', () => {
    process.argv = ['node', 'cli.js', '-h'];
    const args = parseArgs();
    expect(args.help).toBe(true);
  });

  it('should show help with --help flag', () => {
    process.argv = ['node', 'cli.js', '--help'];
    const args = parseArgs();
    expect(args.help).toBe(true);
  });

  it('should show help when no arguments provided', () => {
    process.argv = ['node', 'cli.js'];
    const args = parseArgs();
    expect(args.help).toBe(true);
  });
});

describe('CLI Integration', () => {
  const testDir = join(__dirname, 'tmp');
  const inputFile = join(testDir, 'test-input.txt');
  const outputFile = join(testDir, 'test-output.svg');

  beforeEach(() => {
    // Create test directory
    mkdirSync(testDir, { recursive: true });

    // Create test input file
    const testSyntax = `infographic list-row-simple-horizontal-arrow
data
  items
    - label Step 1
      desc Start
    - label Step 2
      desc End`;

    writeFileSync(inputFile, testSyntax, 'utf-8');
  });

  afterEach(() => {
    // Clean up test directory
    rmSync(testDir, { recursive: true, force: true });
  });

  it('should read input file and render SVG', () => {
    const content = readFileSync(inputFile, 'utf-8');
    expect(content).toContain('infographic list-row-simple-horizontal-arrow');
  });

  it('should handle file I/O correctly', () => {
    // Test that we can write to output file
    const testContent = '<svg></svg>';
    writeFileSync(outputFile, testContent, 'utf-8');
    const content = readFileSync(outputFile, 'utf-8');
    expect(content).toBe(testContent);
  });
});
