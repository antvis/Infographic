import { promises as fs } from 'node:fs';
import path from 'node:path';

const esmDir = path.resolve('esm');

async function collectFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const allFiles = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return collectFiles(fullPath);
      }
      if (
        entry.isFile() &&
        (entry.name.endsWith('.js') || entry.name.endsWith('.d.ts'))
      ) {
        return fullPath;
      }
      return null;
    }),
  );

  return allFiles.flat().filter(Boolean);
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function addJsExtension(fromFile, specifier) {
  if (!specifier.startsWith('.')) return specifier;
  const extension = path.posix.extname(specifier);
  if (extension) return specifier;

  const absNoExt = path.resolve(path.dirname(fromFile), specifier);
  const stat = await fs
    .stat(absNoExt)
    .catch(() => null);

  if (stat?.isDirectory()) {
    const indexJs = path.join(absNoExt, 'index.js');
    const indexDts = path.join(absNoExt, 'index.d.ts');
    if ((await exists(indexJs)) || (await exists(indexDts))) {
      return `${specifier.replace(/\/$/, '')}/index.js`;
    }
  }

  if (await exists(`${absNoExt}.js`)) return `${specifier}.js`;
  if (await exists(`${absNoExt}.d.ts`)) return `${specifier}.js`;

  return specifier;
}

async function patchSource(source, filePath) {
  const replace = async (match, prefix, specifier, suffix) => {
    const updated = await addJsExtension(filePath, specifier);
    return `${prefix}${updated}${suffix}`;
  };

  let next = source;
  const patterns = [
    /(\bfrom\s+['"])(\.{1,2}\/[^'"]+)(['"])/g,
    /(\bimport\s+['"])(\.{1,2}\/[^'"]+)(['"])/g,
    /(\bimport\s*\(\s*['"])(\.{1,2}\/[^'"]+)(['"]\s*\))/g,
  ];

  for (const pattern of patterns) {
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = pattern.exec(next))) {
      parts.push(next.slice(lastIndex, match.index));
      parts.push(await replace(match[0], match[1], match[2], match[3]));
      lastIndex = pattern.lastIndex;
    }
    if (parts.length) {
      parts.push(next.slice(lastIndex));
      next = parts.join('');
    }
  }

  return next;
}

const files = await collectFiles(esmDir);

await Promise.all(
  files.map(async (filePath) => {
    const original = await fs.readFile(filePath, 'utf8');
    const updated = await patchSource(original, filePath);
    if (updated !== original) {
      await fs.writeFile(filePath, updated);
    }
  }),
);

await fs.writeFile(
  path.join(esmDir, 'package.json'),
  JSON.stringify({ type: 'module' }, null, 2),
);
