#!/usr/bin/env node

/**
 * Script to run all example files and generate SVG outputs
 */

import { readdirSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = join(__dirname, '..');
const EXAMPLES_DIR = join(PROJECT_ROOT, 'examples');
const OUTPUT_DIR = join(PROJECT_ROOT, 'output');
const CLI_BIN = join(PROJECT_ROOT, 'bin', 'cli.mjs');

// Create output directory if it doesn't exist
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Get all .txt example files
const exampleFiles = readdirSync(EXAMPLES_DIR)
  .filter((file) => file.endsWith('.txt'))
  .sort();

console.log(`Found ${exampleFiles.length} example files\n`);

let completed = 0;
let fails = [];
// Process each example
for (const file of exampleFiles) {
  const inputPath = join(EXAMPLES_DIR, file);
  const outputName = file.replace('.txt', '.svg');
  const outputPath = join(OUTPUT_DIR, outputName);

  console.log(`Processing: ${file}...`);

  const child = spawn('node', [CLI_BIN, inputPath, '-o', outputPath], {
    stdio: 'inherit',
  });

  await new Promise((resolve) => {
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✓ Generated: ${outputName}\n`);
        completed++;
      } else {
        fails.push(file);
      }
      resolve();
    });
  });
}

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Completed: ${completed}/${exampleFiles.length}`);
if (fails.length > 0) {
  console.group('Failed examples:');
  console.log(fails.join('\n'));
  console.groupEnd();
}
console.log(`Output directory: ${OUTPUT_DIR}`);
console.log('='.repeat(50));

process.exit(fails.length > 0 ? 128 : 0);
