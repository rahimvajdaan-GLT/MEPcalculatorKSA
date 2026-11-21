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

test('downstream reference: 1000 kVA 400 V 6%, 10 m at 1 mΩ/m', () => {
  const result = calculate({ ...base, includeDownstream: true,
    cableLength_m: 10, cableImpedance_mOhm: 1 });
  // Independent scalar reference: Ztr = 9.6 mΩ; Zc = 10 mΩ;
  // I = 400 / (sqrt(3) * 0.0196) = 11.78 kA.
  assert.equal(result.outputs.faultCurrent_downstream_kA, 11.78);
  assert.equal(result.outputs.faultCurrent_transformer_kA, 24.06);
  assert.deepEqual(result.errors, []);
  assert.match(result.warnings.join(' '), /IEC 60909/);
});

test('downstream reference: 500 kVA 400 V 4%, 10 m at 1 mΩ/m', () => {
  const result = calculate({ transformer_kVA: 500, voltage_V: 400,
    impedance_percent: 4, includeDownstream: true,
    cableLength_m: 10, cableImpedance_mOhm: 1 });
  // Ztr = 12.8 mΩ; Zc = 10 mΩ; I = 400/(sqrt(3)*0.0228) = 10.13 kA.
  assert.equal(result.outputs.faultCurrent_downstream_kA, 10.13);
  assert.deepEqual(result.errors, []);
});

test('downstream unit mode does not change fixed SI input units', () => {
  const input = { ...base, includeDownstream: true,
    cableLength_m: 10, cableImpedance_mOhm: 1 };
  assert.deepEqual(calculate(input, 'metric'), calculate(input, 'imperial'));
});

test('invalid transformer and cable inputs return no fault-current outputs', () => {
  const invalids = [
    { transformer_kVA: -100 }, { transformer_kVA: Infinity },
    { transformer_kVA: NaN }, { transformer_kVA: 'Infinity' },
    { voltage_V: -400 }, { voltage_V: Infinity }, { voltage_V: NaN },
    { impedance_percent: NaN }, { impedance_percent: Infinity },
    { impedance_percent: -6 }, { transformer_kVA: 1e308 }
  ];
  for (const invalid of invalids) {
    const result = calculate({ ...base, ...invalid });
    assert.ok(result.errors.length > 0, JSON.stringify(invalid));
    assert.equal(result.outputs.faultCurrent_transformer_kA, 0);
  }
  for (const invalid of [
    { cableLength_m: -1 }, { cableLength_m: 0 },
    { cableLength_m: NaN }, { cableLength_m: Infinity },
    { cableImpedance_mOhm: -1 }, { cableImpedance_mOhm: 0 },
    { cableImpedance_mOhm: NaN }, { cableImpedance_mOhm: Infinity }
  ]) {
    const result = calculate({ ...base, includeDownstream: true,
      cableLength_m: 10, cableImpedance_mOhm: 1, ...invalid });
    assert.ok(result.errors.length > 0, JSON.stringify(invalid));
    assert.equal(result.outputs.faultCurrent_downstream_kA, 0);
  }
});

test('downstream warning includes English and Arabic safety limitations', () => {
  const result = calculate({ ...base, includeDownstream: true,
    cableLength_m: 10, cableImpedance_mOhm: 1 });
  assert.deepEqual(result.errors, []);
  assert.match(result.warnings.join(' '), /IEC 60909/);
  assert.match(result.warnings.join(' '), /[\u0600-\u06FF]/);
});

test('disabled downstream mode ignores invalid cable fields', () => {
  assert.deepEqual(calculate({ ...base, includeDownstream: false,
    cableLength_m: -10, cableImpedance_mOhm: Infinity }), calculate(base));
});
