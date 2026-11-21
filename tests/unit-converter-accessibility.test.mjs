import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../src/pages/UnitConverterHub.jsx', import.meta.url), 'utf8');

test('converter disclosure is a native keyboard-operable button', () => {
  assert.match(source, /<button\s+type="button"\s+className="flex w-full items-start/);
  assert.match(source, /aria-expanded=\{expandedCard === card\.id\}/);
  assert.match(source, /aria-controls=\{`converter-panel-\$\{card\.id\}`\}/);
  assert.match(source, /id=\{`converter-panel-\$\{card\.id\}`\}/);
  assert.match(source, /focus-visible:outline/);
});
