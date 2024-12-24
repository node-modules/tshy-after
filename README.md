# tshy-after

[![NPM version][npm-image]][npm-url]
[![Node.js CI](https://github.com/node-modules/tshy-after/actions/workflows/nodejs.yml/badge.svg)](https://github.com/node-modules/tshy-after/actions/workflows/nodejs.yml)
[![npm download][download-image]][download-url]
[![Node.js Version](https://img.shields.io/node/v/tshy-after.svg?style=flat)](https://nodejs.org/en/download/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)

[npm-image]: https://img.shields.io/npm/v/tshy-after.svg?style=flat-square
[npm-url]: https://npmjs.org/package/tshy-after
[download-image]: https://img.shields.io/npm/dm/tshy-after.svg?style=flat-square
[download-url]: https://npmjs.org/package/tshy-after

Auto set package.json after [tshy](https://github.com/isaacs/tshy) run

## keep `types`

Set `package.types` to `package.exports['.'].require.types`

## Auto fix `import.meta.url` and `import.meta.resolve` SyntaxError on CJS

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

## License

[MIT](LICENSE)

## Contributors

[![Contributors](https://contrib.rocks/image?repo=node-modules/tshy-after)](https://github.com/node-modules/tshy-after/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).
