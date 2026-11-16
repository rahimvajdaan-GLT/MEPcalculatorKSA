import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const folder = await mkdtemp(join(tmpdir(), 'mep-pump-head-'));
after(() => rm(folder, { recursive: true, force: true }));
const outfile = join(folder, 'engine.mjs');
await build({
  entryPoints: ['src/components/calculators/engines/pumpHeadLoss.jsx'],
  bundle: true, platform: 'node', format: 'esm', outfile, logLevel: 'silent'
});
const { calculatePumpHeadLoss: calculate, pumpHeadLossDefaults } =
  await import(pathToFileURL(outfile).href);

const zero = {
  pipeLength: 0, frictionLoss: 0, fittingsLoss: 0,
  equipmentLoss: 0, elevationHead: 0
};

// Fixed reference arithmetic and unit interpretation: pump-head-loss-tests.md.
for (const { name, inputs, units, expected } of [
  { name: 'metric default example', inputs: {
    pipeLength: 100, frictionLoss: 3, fittingsLoss: 5, equipmentLoss: 8, elevationHead: 0
  }, units: 'metric', expected: [3, 16, 18.4, 1.8] },
  { name: 'fractional metric losses and elevation', inputs: {
    pipeLength: 25, frictionLoss: 2, fittingsLoss: 1.25, equipmentLoss: 2.5, elevationHead: 4
  }, units: 'metric', expected: [0.5, 8.3, 9.5, 0.93] },
  { name: 'elevation alone', inputs: { ...zero, elevationHead: 10 },
    units: 'metric', expected: [0, 10, 11.5, 1.13] },
  { name: 'imperial head per 100 metres', inputs: {
    pipeLength: 100, frictionLoss: 10, fittingsLoss: 2, equipmentLoss: 3, elevationHead: 4
  }, units: 'imperial', expected: [3, 12, 13.9, 6] }
]) {
  test(`independent reference: ${name}`, () => {
    assert.deepEqual(calculate(inputs, units), {
      outputs: {
        pipeFrictionHead: expected[0], totalHead: expected[1],
        withSafety: expected[2], pressureBar: expected[3]
      },
      warnings: []
    });
  });
}

test('omitted inputs match the published metric defaults', () => {
  assert.deepEqual(calculate({}), calculate(pumpHeadLossDefaults.metric));
});

test('explicit zeros produce zero head and pressure in both unit modes', () => {
  for (const units of ['metric', 'imperial']) {
    assert.deepEqual(calculate(zero, units), {
      outputs: { pipeFrictionHead: 0, totalHead: 0, withSafety: 0, pressureBar: 0 },
      warnings: []
    });
  }
});

test('each non-pipe component contributes once', () => {
  for (const field of ['fittingsLoss', 'equipmentLoss', 'elevationHead']) {
    assert.deepEqual(calculate({ ...zero, [field]: 10 }).outputs, {
      pipeFrictionHead: 0, totalHead: 10, withSafety: 11.5, pressureBar: 1.13
    });
  }
});

test('zero length or zero friction rate eliminates pipe loss', () => {
  for (const inputs of [{ pipeLength: 0, frictionLoss: 3 }, { pipeLength: 100, frictionLoss: 0 }]) {
    assert.equal(calculate({ ...zero, ...inputs }).outputs.pipeFrictionHead, 0);
  }
});

test('metric warning uses total head before rounding and before margin', () => {
  for (const [head, count] of [[49.99, 0], [50, 0], [50.01, 1]]) {
    const result = calculate({ ...zero, equipmentLoss: head });
    assert.equal(result.outputs.totalHead, 50);
    assert.equal(result.outputs.withSafety, 57.5);
    assert.equal(result.warnings.length, count);
  }
});

test('imperial warning compares converted metres before display rounding', () => {
  // 164.04 ft = 49.999392 m; 164.045 ft = 50.000916 m.
  for (const [head, count] of [[164.04, 0], [164.045, 1]]) {
    const result = calculate({ ...zero, equipmentLoss: head }, 'imperial');
    assert.equal(result.outputs.totalHead, 164);
    assert.equal(result.warnings.length, count);
  }
});
