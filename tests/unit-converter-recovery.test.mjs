import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build, transform } from 'esbuild';

const source = readFileSync('src/pages/UnitConverterHub.jsx', 'utf8');
const panel = readFileSync('src/components/converters/ConverterInlinePanel.jsx', 'utf8');

test('UnitConverterHub and panel JSX parse successfully (catches mismatched closing tags)', async () => {
  for (const jsx of [source, panel]) {
    const output = await transform(jsx, { loader: 'jsx' });
    assert.ok(output.code.length > 0);
  }
});

test('converter disclosure uses native button and associated panel', () => {
  assert.match(source, /<button\s+type="button"[\s\S]*?aria-expanded=\{expandedCard === card\.id\}/);
  assert.match(source, /aria-controls=\{\x60converter-panel-\$\{card\.id\}\x60\}/);
  assert.match(source, /<div\s+id=\{\x60converter-panel-\$\{card\.id\}\x60\}/);
  assert.match(source, /focus-visible:ring-2/);
  assert.match(source, /hidden=\{expandedCard !== card\.id\}/);
  assert.match(panel, /htmlFor=\{\x60converter-input-\$\{card\.id\}\x60\}/);
  assert.match(panel, /id=\{\x60converter-input-\$\{card\.id\}\x60\}/);
});

test('inline panel rejects malformed numeric input rather than parseFloat prefix', () => {
  assert.match(panel, /Number\(fromValue\)/);
  assert.match(panel, /Number\.isFinite\(value\)/);
  assert.doesNotMatch(panel, /parseFloat\(fromValue\)/);
});

const folder = mkdtempSync(join(tmpdir(), 'mep-converter-guard-'));
try {
  const outfile = join(folder, 'engine.mjs');
  await build({ entryPoints: ['src/components/converters/ConversionEngine.jsx'], bundle: true, platform: 'node', format: 'esm', outfile, logLevel: 'silent' });
  const { convertUnits, formatConversionResult } = await import(pathToFileURL(outfile).href);
  const from = { dimensionKey: 'pressure', factorToBase: 100000, offsetToBase: 0 };
  const to = { dimensionKey: 'pressure', factorToBase: 6894.757293168, offsetToBase: 0 };
  test('pressure reference and numerical guards', () => {
    assert.ok(Math.abs(convertUnits(1, from, to) - 14.5037738) < 0.00001);
    for (const invalid of [NaN, Infinity, -Infinity, '12abc', '1']) {
      assert.equal(convertUnits(invalid, from, to), null);
    }
    assert.equal(convertUnits(1e308, from, to), null);
    assert.equal(convertUnits(1, from, { ...to, factorToBase: 0 }), null);
    assert.equal(formatConversionResult(Infinity, 'pressure', 'psi'), '-');
    assert.equal(convertUnits(0, from, to), 0);
  });
} finally {
  // Imported module is evaluated before cleanup; tests retain its exported functions.
  rmSync(folder, { recursive: true, force: true });
}
