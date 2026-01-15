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

const parseVersion = (version) => {
  const parts = version.split('.').map((part) => Number(part));
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    throw new Error(`Invalid version format: ${version}`);
  }
  return parts;
};

const bumpPatch = (version) => {
  const parts = parseVersion(version);
  parts[2] += 1;
  return parts.join('.');
};

const publishedVersion = getPublishedVersion(pkg.name);
let nextVersion = pkg.version;

const isGreaterThan = (left, right) => {
  const leftParts = parseVersion(left);
  const rightParts = parseVersion(right);
  for (let i = 0; i < 3; i += 1) {
    if (leftParts[i] > rightParts[i]) return true;
    if (leftParts[i] < rightParts[i]) return false;
  }
  return false;
};

if (publishedVersion) {
  if (isGreaterThan(pkg.version, publishedVersion)) {
    // Local version is newer; keep package.json as-is.
  } else if (pkg.version === publishedVersion) {
    nextVersion = bumpPatch(pkg.version);
    pkg.version = nextVersion;
    writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf-8');
  } else {
    throw new Error(
      `Package version in package.json (${pkg.version}) is lower than the published version (${publishedVersion}). Please update it.`,
    );
  }
}

writeFileSync(versionPath, `export const VERSION = '${nextVersion}';\n`, 'utf-8');
