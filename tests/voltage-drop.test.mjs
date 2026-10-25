import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const folder = await mkdtemp(join(tmpdir(), 'mep-voltage-drop-'));
after(() => rm(folder, { recursive: true, force: true }));
const outfile = join(folder, 'engine.mjs');
await build({
  entryPoints: ['src/components/calculators/engines/voltageDrop.jsx'],
  bundle: true, platform: 'node', format: 'esm', outfile, logLevel: 'silent'
});
const { calculateVoltageDropResults: calculate } = await import(pathToFileURL(outfile).href);

const base = {
  system: '1P', voltage: 230, loadMode: 'A', current: 10,
  pf: 1, length: 30, conductor: 'Cu', mode: 'check', cableSize: 2.5, maxVD: 3
};

// Fixed reference values and assumptions are documented in voltage-drop-tests.md.
// Expected values deliberately do not call production helpers.
for (const { name, inputs, expected } of [
  { name: 'single-phase copper', inputs: {}, expected: [10, 4.14, 1.8] },
  { name: 'three-phase copper', inputs: {
    system: '3P', voltage: 400, current: 100, pf: 0.9, length: 50, cableSize: 25
  }, expected: [100, 5.37, 1.34] },
  { name: 'single-phase aluminium', inputs: {
    conductor: 'Al', current: 40, pf: 0.8, length: 75, cableSize: 16
  }, expected: [40, 8.49, 3.69] }
]) {
  test(`reference calculation: ${name}`, () => {
    const { outputs, errors } = calculate({ ...base, ...inputs });
    assert.deepEqual(errors, []);
    assert.deepEqual(
      [outputs.designCurrent, outputs.voltageDrop_V, outputs.voltageDrop_percent], expected
    );
    assert.equal(outputs.status, name === 'single-phase aluminium' ? 'FAIL' : 'PASS');
  });
}

test('single-phase kW input converts to amperes before calculating drop', () => {
  const result = calculate({ ...base, loadMode: 'kW', power: 2.3, current: 999 });
  assert.deepEqual(result, calculate(base));
});

test('three-phase kW input uses line voltage and full precision current', () => {
  const { outputs, errors } = calculate({
    ...base, system: '3P', voltage: 400, loadMode: 'kW', power: 70,
    pf: 0.9, length: 50, cableSize: 25
  });
  assert.deepEqual(errors, []);
  assert.equal(outputs.designCurrent, 112.3);
  assert.equal(outputs.voltageDrop_V, 6.03);
  assert.equal(outputs.voltageDrop_percent, 1.51);
});

test('auto selection returns the first three passing sizes', () => {
  const { outputs, recommendations, errors } = calculate({ ...base, mode: 'auto' });
  assert.deepEqual(errors, []);
  assert.equal(outputs.recommendedSize, 1.5);
  assert.deepEqual(recommendations, [
    { size_mm2: 1.5, VD_V: 6.9, VD_percent: 3, pass: true },
    { size_mm2: 2.5, VD_V: 4.14, VD_percent: 1.8, pass: true },
    { size_mm2: 4, VD_V: 2.59, VD_percent: 1.12, pass: true }
  ]);
});

test('limit decisions use unrounded drop even when display rounds to the limit', () => {
  // 2 * 10 * 0.01724 * 30 / 2.5 = 4.1376 V, exactly 1.8% at 229.86666666666667 V.
  const inputs = { ...base, voltage: 229.86666666666667, maxVD: 1.8 };
  assert.equal(calculate(inputs).outputs.status, 'PASS');
  const above = calculate({ ...inputs, length: 30.001 });
  assert.equal(above.outputs.voltageDrop_percent, 1.8);
  assert.equal(above.outputs.status, 'FAIL');
  assert.equal(above.warnings.length, 1);
});

for (const field of ['current', 'length', 'voltage', 'cableSize']) {
  test(`zero ${field} produces an error result`, () => {
    const result = calculate({ ...base, [field]: 0 });
    assert.ok(result.errors.length > 0);
    assert.equal(result.outputs.status, 'ERROR');
    assert.deepEqual(result.recommendations, []);
  });
}

test('user-entered percentage limits enforce inclusive existing bounds', () => {
  for (const maxVD of [0.1, 10]) {
    assert.deepEqual(calculate({ ...base, maxVD }).errors, []);
  }
  for (const maxVD of [0.099, 10.001]) {
    assert.equal(calculate({ ...base, maxVD }).outputs.status, 'ERROR');
  }
});

test('both unit settings retain explicitly labelled m and mm² inputs', () => {
  assert.deepEqual(calculate(base, 'imperial'), calculate(base, 'metric'));
});
