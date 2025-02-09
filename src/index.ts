#!/usr/bin/env node

import { writeFileSync, readFileSync, readdirSync, statSync, copyFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'

const cwd = process.cwd() + path.sep;

const pkg = JSON.parse(readFileSync(path.join(cwd, 'package.json'), 'utf-8'));
// make sure commonjs *.d.ts can import types
pkg.types = pkg.exports['.'].require.types;

writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n')
writeFileSync('dist/package.json', JSON.stringify({
  name: pkg.name,
  version: pkg.version,
}, null, 2) + '\n')

// Replace all `( import.meta.url )` into `('import_meta_url_placeholder_by_tshy_after')` on commonjs.
const IMPORT_META_URL = '(' + 'import.meta.url' + ')';
const IMPORT_META_URL_PLACE_HOLDER = '(\'import_meta_url_placeholder_by_tshy_after\')';

// Replace all `import.meta.resolve (xxx)` into `require.resolve(xxx)` on commonjs.
const IMPORT_META_RESOLVE = 'import.meta.resolve' + '(';
const IMPORT_META_RESOLVE_PLACE_HOLDER = 'require.resolve(';

function replaceImportMetaUrl(baseDir: string) {
  const names = readdirSync(baseDir);
  for (const name of names) {
    const filepath = path.join(baseDir, name);
    const stat = statSync(filepath);
    if (stat.isDirectory()) {
      replaceImportMetaUrl(filepath);
      continue;
    }
    if (!filepath.endsWith('.js')) {
      continue;
    }

    let content = readFileSync(filepath, 'utf-8');
    let changed = false;
    if (content.includes(IMPORT_META_URL)) {
      changed = true;
      content = content.replaceAll(IMPORT_META_URL, IMPORT_META_URL_PLACE_HOLDER);
      console.log('Auto fix "import.meta.url" on %s', filepath.replace(cwd, ''));
    }
    if (content.includes(IMPORT_META_RESOLVE)) {
      changed = true;
      content = content.replaceAll(IMPORT_META_RESOLVE, IMPORT_META_RESOLVE_PLACE_HOLDER);
      console.log('Auto fix "import.meta.resolve" on %s', filepath.replace(cwd, ''));
    }
    if (changed) {
      writeFileSync(filepath, content);
    }
  }
}
replaceImportMetaUrl(path.join(cwd, 'dist/commonjs'));

// Copy image/json/web files
const fileExts = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.ico',
  '.json', '.html', '.htm', '.css',
];
const sourceDir = path.join(cwd, 'src');
const commonjsDir = path.join(cwd, 'dist/commonjs');
const esmDir = path.join(cwd, 'dist/esm');

function copyFiles(baseDir: string) {
  const names = readdirSync(baseDir);
  for (const name of names) {
    const filepath = path.join(baseDir, name);
    const stat = statSync(filepath);
    if (stat.isDirectory()) {
      copyFiles(filepath);
      continue;
    }
    const extname = path.extname(filepath);
    if (!fileExts.includes(extname)) {
      continue;
    }
    let targetFilepath = filepath.replace(sourceDir, commonjsDir);
    mkdirSync(path.dirname(targetFilepath), { recursive: true });
    copyFileSync(filepath, targetFilepath);
    console.log('Copy %s to %s', filepath.replace(cwd, ''), targetFilepath.replace(cwd, ''));
    targetFilepath = filepath.replace(sourceDir, esmDir);
    mkdirSync(path.dirname(targetFilepath), { recursive: true });
    copyFileSync(filepath, targetFilepath);
    console.log('Copy %s to %s', filepath.replace(cwd, ''), targetFilepath.replace(cwd, ''));
  }
}
copyFiles(sourceDir);
