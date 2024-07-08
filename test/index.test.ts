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
    await coffee.spawn('tshy', { cwd })
      .debug()
      .expect('code', 0)
      .end();
    await coffee.fork(bin, { cwd })
      .debug()
      .expect('code', 0)
      .end();
    await coffee.spawn('node', [
      '--require', './dist/commonjs/index.js',
      '-p', '123123',
    ], { cwd })
      .debug()
      .expect('code', 0)
      .end();
    const pkg = JSON.parse(fs.readFileSync(packageFile, 'utf-8'));
    assert.equal(pkg.types, './dist/commonjs/index.d.ts');

    // should copy image/json files
    let pngFile = path.join(cwd, 'dist/commonjs/config/favicon.png');
    assert.equal(fs.statSync(pngFile).isFile(), true);
    pngFile = path.join(cwd, 'dist/esm/config/favicon.png');
    assert.equal(fs.statSync(pngFile).isFile(), true);
    let jsonFile = path.join(cwd, 'dist/commonjs/config/foo.json');
    assert.equal(fs.statSync(jsonFile).isFile(), true);
    jsonFile = path.join(cwd, 'dist/esm/config/foo.json');
    assert.equal(fs.statSync(jsonFile).isFile(), true);
    jsonFile = path.join(cwd, 'dist/commonjs/bar.json');
    assert.equal(fs.statSync(jsonFile).isFile(), true);
    jsonFile = path.join(cwd, 'dist/esm/bar.json');
    assert.equal(fs.statSync(jsonFile).isFile(), true);

    // should dist/package.json exists, include name and version
    const distPackageFile = path.join(cwd, 'dist/package.json');
    const distPkg = JSON.parse(fs.readFileSync(distPackageFile, 'utf-8'));
    assert.equal(distPkg.name, 'tshy-after');
    assert.equal(distPkg.version, '1.0.0');
  });
});
