import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const pkgPath = './package.json';
const versionPath = './src/version.ts';
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

const getPublishedVersion = (name) => {
  try {
    return execSync(`npm view ${name} version`, { encoding: 'utf-8' }).trim();
  } catch (error) {
    return null;
  }
};

const bumpPatch = (version) => {
  const parts = version.split('.').map((part) => Number(part));
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    throw new Error(`Invalid version: ${version}`);
  }
  parts[2] += 1;
  return parts.join('.');
};

const publishedVersion = getPublishedVersion(pkg.name);
let nextVersion = pkg.version;

const isGreaterThan = (left, right) => {
  const leftParts = left.split('.').map((part) => Number(part));
  const rightParts = right.split('.').map((part) => Number(part));
  if (
    leftParts.length !== 3 ||
    rightParts.length !== 3 ||
    leftParts.some(Number.isNaN) ||
    rightParts.some(Number.isNaN)
  ) {
    throw new Error(`Invalid version compare: ${left} vs ${right}`);
  }
  for (let i = 0; i < 3; i += 1) {
    if (leftParts[i] > rightParts[i]) return true;
    if (leftParts[i] < rightParts[i]) return false;
  }
  return false;
};

if (publishedVersion && publishedVersion === pkg.version) {
  nextVersion = bumpPatch(pkg.version);
  writeFileSync(
    pkgPath,
    `${readFileSync(pkgPath, 'utf-8').replace(
      /"version":\s*"[^"]+"/,
      `"version": "${nextVersion}"`,
    )}\n`,
    'utf-8',
  );
} else if (publishedVersion && isGreaterThan(pkg.version, publishedVersion)) {
  // Keep package.json as-is; only refresh version.ts
}

writeFileSync(versionPath, `export const VERSION = '${nextVersion}';\n`, 'utf-8');
