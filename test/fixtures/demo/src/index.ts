import { fileURLToPath } from 'node:url';
import path from 'node:path';

export function getDirname() {
  if (typeof __dirname !== 'undefined') {
    return __dirname;
  }
  // @ts-ignore
  return path.dirname(fileURLToPath(import.meta.url));
}

export function resolve(filename: string) {
  if (typeof require === 'function') {
    return require.resolve(filename);
  }
  // @ts-ignore
  return import.meta.resolve(filename);
}
