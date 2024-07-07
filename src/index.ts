#!/usr/bin/env node

import { writeFileSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const cwd = process.cwd();

const pkg = JSON.parse(readFileSync(path.join(cwd, 'package.json'), 'utf-8'));
// make sure commonjs *.d.ts can import types
pkg.types = pkg.exports['.'].require.types;

writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n')

// Replace all `( import.meta.url )` into `('import_meta_url_placeholder_by_tshy_after')` on commonjs.
const IMPORT_META_URL = '(' + 'import.meta.url' + ')';
const IMPORT_META_URL_PLACE_HOLDER = '(\'import_meta_url_placeholder_by_tshy_after\')';

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
    const content = readFileSync(filepath, 'utf-8');
    if (!content.includes(IMPORT_META_URL)) {
      continue;
    }
    writeFileSync(filepath, content.replaceAll(IMPORT_META_URL, IMPORT_META_URL_PLACE_HOLDER));
    console.log('Auto fix "import.meta.url" on %s', filepath);
  }
}
replaceImportMetaUrl(path.join(cwd, 'dist/commonjs'));
