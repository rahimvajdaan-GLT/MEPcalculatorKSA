import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { applySeoMetadata, buildSeoUrls } from '../src/lib/seoUrls.js';

const ORIGIN = 'https://mepcalculatorsksa.org';

test('homepage URLs are language-specific and strip tracking parameters', () => {
  const english = buildSeoUrls('/', '?lang=en&utm_source=newsletter&gclid=abc');

  assert.equal(english.canonical, `${ORIGIN}/?lang=en`);
  assert.deepEqual(english.alternates, [
    { hreflang: 'ar', href: `${ORIGIN}/?lang=ar` },
    { hreflang: 'en', href: `${ORIGIN}/?lang=en` },
    { hreflang: 'x-default', href: `${ORIGIN}/?lang=ar` },
  ]);
});

test('category URLs preserve trade and provide reciprocal language variants', () => {
  const english = buildSeoUrls('/CategoryPage', '?trade=electrical&lang=en&fbclid=abc');
  const arabic = english.alternates.find(alternate => alternate.hreflang === 'ar');

  assert.equal(english.canonical, `${ORIGIN}/CategoryPage?lang=en&trade=electrical`);
  assert.equal(arabic.href, `${ORIGIN}/CategoryPage?lang=ar&trade=electrical`);
  assert.equal(english.alternates.find(alternate => alternate.hreflang === 'x-default').href, arabic.href);
});

test('calculator URLs retain page identity but remove non-content parameters', () => {
  const urls = buildSeoUrls('/CalculatorPage', '?utm_campaign=spring&slug=voltage-drop&lang=ar&trade=electrical');

  assert.equal(urls.canonical, `${ORIGIN}/CalculatorPage?lang=ar&trade=electrical&slug=voltage-drop`);
  assert.equal(urls.alternates.find(alternate => alternate.hreflang === 'en').href,
    `${ORIGIN}/CalculatorPage?lang=en&trade=electrical&slug=voltage-drop`);
});

test('rendered metadata contains exactly one canonical and the three language alternates', () => {
  class Link {
    remove() {
      this.parentNode.links = this.parentNode.links.filter(link => link !== this);
      this.parentNode = null;
    }
  }

  const head = {
    links: [],
    appendChild(link) {
      link.parentNode = this;
      this.links.push(link);
    },
    querySelectorAll(selector) {
      if (selector === 'link[rel="canonical"]') return this.links.filter(link => link.rel === 'canonical');
      if (selector === 'link[rel="alternate"]') return this.links.filter(link => link.rel === 'alternate');
      return [];
    },
  };
  const document = { head, createElement: () => new Link() };
  const oldCanonical = new Link();
  oldCanonical.rel = 'canonical';
  oldCanonical.href = `${ORIGIN}/`;
  const duplicateCanonical = new Link();
  duplicateCanonical.rel = 'canonical';
  head.appendChild(oldCanonical);
  head.appendChild(duplicateCanonical);

  applySeoMetadata(document, buildSeoUrls('/CategoryPage', '?lang=en&trade=electrical'));

  assert.equal(head.links.filter(link => link.rel === 'canonical').length, 1);
  assert.equal(head.links.find(link => link.rel === 'canonical').href,
    `${ORIGIN}/CategoryPage?lang=en&trade=electrical`);
  assert.deepEqual(head.links.filter(link => link.rel === 'alternate').map(link => link.hreflang), ['ar', 'en', 'x-default']);
});

test('static HTML does not emit a canonical that conflicts with client-rendered URLs', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /<link\s+rel=["']canonical["']/i);
});