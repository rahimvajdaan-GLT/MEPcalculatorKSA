import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const folder = await mkdtemp(join(tmpdir(), 'mep-fan-esp-'));
after(() => rm(folder, { recursive: true, force: true }));
const outfile = join(folder, 'engine.mjs');
await build({
  entryPoints: ['src/components/calculators/engines/fanEsp.jsx'],
  bundle: true, platform: 'node', format: 'esm', outfile, logLevel: 'silent'
});
const { calculateFanEsp: calculate, fanEspDefaults } = await import(pathToFileURL(outfile).href);

const zero = {
  ductLength: 0, frictionRate: 0, fittingsLoss: 0,
  filterLoss: 0, coilLoss: 0, diffuserLoss: 0
};

// Fixed independent reference arithmetic is documented in fan-esp-tests.md.
for (const { name, inputs, units, expected } of [
  { name: 'metric default example', inputs: {
    ductLength: 30, frictionRate: 1, fittingsLoss: 50,
    filterLoss: 75, coilLoss: 150, diffuserLoss: 25
  }, units: 'metric', expected: [30, 330, 363, 1.33] },
  { name: 'imperial default example', inputs: {
    ductLength: 100, frictionRate: 0.1, fittingsLoss: 0.2,
    filterLoss: 0.3, coilLoss: 0.6, diffuserLoss: 0.1
  }, units: 'imperial', expected: [0.1, 1.3, 1.43, 1.3] },
  { name: 'fractional metric losses', inputs: {
    ductLength: 12.5, frictionRate: 0.8, fittingsLoss: 12.25,
    filterLoss: 20.25, coilLoss: 30.25, diffuserLoss: 5.25
  }, units: 'metric', expected: [10, 78, 86, 0.31] }
]) {
  test(`independent reference: ${name}`, () => {
    const { outputs, warnings } = calculate(inputs, units);
    assert.deepEqual(outputs, {
      ductLoss: expected[0], totalEsp: expected[1],
      safetyFactor: expected[2], totalEspInWg: expected[3]
    });
    assert.deepEqual(warnings, []);
  });
}

test('omitted inputs match the metric defaults', () => {
  assert.deepEqual(calculate({}), calculate(fanEspDefaults.metric));
});

test('published imperial defaults retain the reference example', () => {
  assert.deepEqual(calculate(fanEspDefaults.imperial, 'imperial').outputs, {
    ductLoss: 0.1, totalEsp: 1.3, safetyFactor: 1.43, totalEspInWg: 1.3
  });
});

test('explicit zero losses remain zero in both unit modes', () => {
  for (const units of ['metric', 'imperial']) {
    assert.deepEqual(calculate(zero, units), {
      outputs: { ductLoss: 0, totalEsp: 0, safetyFactor: 0, totalEspInWg: 0 },
      warnings: []
    });
  }
});

test('each component contributes once, including with zero duct loss', () => {
  for (const field of ['fittingsLoss', 'filterLoss', 'coilLoss', 'diffuserLoss']) {
    assert.deepEqual(calculate({ ...zero, [field]: 249 }).outputs, {
      ductLoss: 0, totalEsp: 249, safetyFactor: 274, totalEspInWg: 1
    });
    assert.deepEqual(calculate({ ...zero, [field]: 1 }, 'imperial').outputs, {
      ductLoss: 0, totalEsp: 1, safetyFactor: 1.1, totalEspInWg: 1
    });
  }
});

test('metric warning uses the unrounded total and excludes the added margin', () => {
  for (const [loss, warningCount] of [[749.99, 0], [750, 0], [750.01, 1]]) {
    const result = calculate({ ...zero, fittingsLoss: loss });
    assert.equal(result.outputs.totalEsp, 750);
    assert.equal(result.outputs.safetyFactor, 825);
    assert.equal(result.warnings.length, warningCount);
  }
});

test('imperial warning compares converted pressure before display rounding', () => {
  for (const [loss, warningCount] of [[3.01, 0], [3.02, 1]]) {
    const result = calculate({ ...zero, filterLoss: loss }, 'imperial');
    assert.equal(result.outputs.totalEsp, loss);
    assert.equal(result.warnings.length, warningCount);
  }
});
