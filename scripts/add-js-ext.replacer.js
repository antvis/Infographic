import fs from 'fs';
import path from 'path';

export default function addJsExtensionReplacer({ orig, file, config }) {
    const match = orig.match(/(['"`])(?<path>[^'"`]+)\1/);
    if (!match || !match.groups) return orig;

    const targetPath = match.groups.path;

    if (/\.(js|jsx|mjs|cjs|json)$/i.test(targetPath)) return orig;
    if (targetPath.startsWith('./') || targetPath.startsWith('../')) {
        return orig; // handle by tsc-alias
    }
    if (targetPath === 'css/lib/parse') {
        return orig.replace(targetPath, targetPath+'/index.js');
    }
    return orig;
}