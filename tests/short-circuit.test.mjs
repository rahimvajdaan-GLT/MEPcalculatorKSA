import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const folder = await mkdtemp(join(tmpdir(), 'mep-short-circuit-'));
after(() => rm(folder, { recursive: true, force: true }));
const outfile = join(folder, 'engine.mjs');
await build({
  entryPoints: ['src/components/calculators/engines/shortCircuit.jsx'],
  bundle: true, platform: 'node', format: 'esm', outfile, logLevel: 'silent'
});
const { calculateShortCircuitResults: calculate, shortCircuitDefaults } =
  await import(pathToFileURL(outfile).href);

const base = { transformer_kVA: 1000, voltage_V: 400, impedance_percent: 6 };

// Fixed reference values independently calculated with Python Decimal;
// see docs/engineering-proposals/short-circuit-tests.md for assumptions.
for (const [rating, voltage, impedance, current, fault] of [
  [1000, 400, 6, 1443.4, 24.06],
  [500, 400, 4, 721.7, 18.04],
  [2000, 415, 8, 2782.4, 34.78]
]) {
  test(`terminal reference: ${rating} kVA, ${voltage} V, ${impedance}%`, () => {
    const result = calculate({
      transformer_kVA: rating, voltage_V: voltage, impedance_percent: impedance
    });
    assert.deepEqual(result.outputs, {
      nominalCurrent_A: current, faultCurrent_transformer_kA: fault
    });
    assert.deepEqual(result.errors, []);
    assert.equal(result.warnings.length, 2);
  });
}

test('unit modes use the same kVA, V and percent inputs', () => {
  assert.deepEqual(calculate(base, 'metric'), calculate(base, 'imperial'));
  assert.deepEqual(calculate(shortCircuitDefaults.metric), calculate(base));
  assert.deepEqual(calculate(shortCircuitDefaults.imperial, 'imperial'), calculate(base));
});

test('numeric form strings preserve the terminal result', () => {
  assert.deepEqual(calculate({
    transformer_kVA: '1,000', voltage_V: '400', impedance_percent: '6'
  }), calculate(base));
});

test('existing impedance bounds are inclusive', () => {
  for (const [impedance, fault, warningCount] of [[1, 144.34, 3], [20, 7.22, 2]]) {
    const result = calculate({ ...base, impedance_percent: impedance });
    assert.deepEqual(result.errors, []);
    assert.deepEqual(result.outputs, {
      nominalCurrent_A: 1443.4, faultCurrent_transformer_kA: fault
    });
    assert.equal(result.warnings.length, warningCount);
  }
});

test('out-of-range impedance and zero required values suppress calculation', () => {
  for (const invalid of [
    { impedance_percent: 0.99 }, { impedance_percent: 20.01 },
    { transformer_kVA: 0 }, { voltage_V: 0 }
  ]) {
    const result = calculate({ ...base, ...invalid });
    assert.equal(result.errors.length, 1);
    assert.deepEqual(result.outputs, {
      nominalCurrent_A: 0, faultCurrent_transformer_kA: 0,
      faultCurrent_downstream_kA: 0
    });
    assert.deepEqual(result.warnings, []);
  }
});

test('inactive downstream inputs do not affect the terminal calculation', () => {
  assert.deepEqual(calculate({
    ...base, includeDownstream: false, cableLength_m: 100, cableImpedance_mOhm: 0.2
  }), calculate(base));
});
