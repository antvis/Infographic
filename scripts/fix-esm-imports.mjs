#!/usr/bin/env node

/**
 * Post-process ESM build to add .js extensions to relative imports
 * This fixes Node.js ESM module resolution issues
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ESM_DIR = join(__dirname, '..', 'esm');

// Find all .js files recursively
function findJsFiles(dir) {
  let results = [];
  const list = readdirSync(dir);
  list.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findJsFiles(filePath));
    } else if (file.endsWith('.js')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = findJsFiles(ESM_DIR);

let fixedCount = 0;

files.forEach((file) => {
  let content = readFileSync(file, 'utf-8');
  let modified = false;

  const fixImportPath = (match, dotPath, rest) => {
    // Skip if already has extension
    if (rest.endsWith('.js') || rest.endsWith('.json')) {
      return match;
    }

    // Check if the target is a directory by looking for corresponding index.js
    const currentDir = dirname(file);
    const targetPath = join(currentDir, dotPath + rest);

    // Try to check if index.js exists (directory import)
    try {
      const stat = statSync(targetPath);
      if (stat.isDirectory()) {
        modified = true;
        const newPath = rest + '/index.js';
        return match.replace(rest + "'", newPath + "'").replace(rest + '"', newPath + '"');
      }
    } catch (e) {
      // Not a directory, assume it's a file
    }

    modified = true;
    return match.replace(rest + "'", rest + ".js'").replace(rest + '"', rest + '.js"');
  };

  // Fix: from './module' -> from './module.js'
  // Fix: from '../module' -> from '../module/index.js' (if it's a directory)
  // Don't fix: from 'package' or from './module.json'
  let newContent = content.replace(
    /from\s+['"](\.|\.\.)(\/[^'"]+)['"];?/g,
    fixImportPath
  );

  // Fix: import './module' -> import './module.js' (side-effect imports)
  newContent = newContent.replace(
    /import\s+['"](\.|\.\.)(\/[^'"]+)['"];?/g,
    fixImportPath
  );

  // Fix: lodash-es/get -> lodash-es/get.js (third-party package subpath imports)
  newContent = newContent.replace(
    /(from|import)\s+['"](lodash-es\/[^'"]+)['"];?/g,
    (match, keyword, path) => {
      if (path.endsWith('.js')) return match;
      modified = true;
      return match.replace(path + "'", path + ".js'").replace(path + '"', path + '.js"');
    }
  );

  // Fix: css/lib/parse -> css/lib/parse/index.js (third-party directory imports)
  newContent = newContent.replace(
    /(from|import)\s+['"](css\/lib\/parse)['"];?/g,
    (match, keyword, path) => {
      if (path.endsWith('.js')) return match;
      modified = true;
      return match.replace(path + "'", path + "/index.js'").replace(path + '"', path + '/index.js"');
    }
  );

  // Also fix export statements
  const finalContent = newContent.replace(
    /export\s+\*?\s*\{?[^}]*\}?\s*from\s+['"](\.|\.\.)(\/[^'"]+)['"];?/g,
    fixImportPath
  );

  if (modified) {
    writeFileSync(file, finalContent, 'utf-8');
    fixedCount++;
  }
});

console.log(`Fixed ${fixedCount} files with ESM import extensions`);
