#!/usr/bin/env node

import { writeFileSync, readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
// make sure commonjs *.d.ts can import types
pkg.types = pkg.exports['.'].require.types;

writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n')
