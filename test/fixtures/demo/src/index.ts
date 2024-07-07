import { fileURLToPath } from 'node:url';
import path from 'node:path';

export function getDirname() {
  if (typeof __dirname !== 'undefined') {
    return __dirname;
  }
  // @ts-ignore
  return path.dirname(fileURLToPath(import.meta.url));
}
