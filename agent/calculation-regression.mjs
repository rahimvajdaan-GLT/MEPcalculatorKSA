import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const folder = await mkdtemp(join(tmpdir(), 'mep-tests-'));
try {
  const outfile = join(folder, 'electrical.mjs');
  await build({
    entryPoints: ['src/components/calculators/engines/electricalUtils.jsx'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile,
    logLevel: 'silent'
  });
  const e = await import(pathToFileURL(outfile).href);
  const near = (a, b) => {
    assert.ok(Number.isFinite(a));
    assert.ok(Math.abs(a - b) < 0.01);
  };

  near(e.calculateCurrent(70, 400, 0.9, '3P'),
    70000 / (Math.sqrt(3) * 400 * 0.9));
  near(e.calculateCurrent(2.3, 230, 1, '1P'), 10);

  const vd = size =>
    e.calculateVoltageDrop(50, 100, size, 'Cu', '3P', 0.9);

  assert.ok(vd(50) < vd(25));
  assert.ok(
    e.calculateVoltageDrop(50, 100, 25, 'Al', '3P', 0.9)
    > vd(25)
  );

  console.log('Basic regression checks passed');
} finally {
  await rm(folder, { recursive: true, force: true });
}
