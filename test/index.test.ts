import { strict as assert } from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import coffee from 'coffee';

describe('test/index.test.ts', () => {
  const bin = path.join(process.cwd(), 'dist/esm/index.js');
  const fixtures = path.join(process.cwd(), 'test/fixtures');
  const cwd = path.join(fixtures, 'demo');
  const packageFile = path.join(cwd, 'package.json');

  beforeEach(() => {
    fs.rmSync(packageFile, { force: true });
    const packageInitFile = path.join(cwd, 'package-init.json');
    fs.copyFileSync(packageInitFile, packageFile);
  });

  afterEach(() => {
    fs.rmSync(packageFile, { force: true });
  });

  it('should work', async () => {
    await coffee.fork(bin, { cwd })
      .debug()
      .expect('code', 0)
      .end();
    const pkg = JSON.parse(fs.readFileSync(packageFile, 'utf-8'));
    assert.equal(pkg.types, './dist/commonjs/index.d.ts');
  });
});
