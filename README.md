# tshy-after

Auto set package.json after [tshy](https://github.com/isaacs/tshy) run

## keep `types`

Set `package.types` to `package.exports['.'].require.types`

## Auto fix `import.meta.url` SyntaxError on CJS

```bash
SyntaxError: Cannot use 'import.meta' outside a module
```

e.g.: Get the file's dirname

```ts
// src/index.ts

import { fileURLToPath } from 'node:url';
import path from 'node:path';

export function getDirname() {
  if (typeof __dirname !== 'undefined') {
    return __dirname;
  }
  // @ts-ignore
  return path.dirname(fileURLToPath(import.meta.url));
}
```
