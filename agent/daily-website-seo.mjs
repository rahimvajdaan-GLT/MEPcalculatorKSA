import fs from 'node:fs';
import { chromium } from 'playwright';

const BASE = (process.env.SITE_URL || 'https://mepcalculatorsksa.org').replace(/\/$/, '');
const problems = [];
const warnings = [];
const checks = [];
const trades = ['hvac', 'plumbing', 'firefighting', 'electrical'];
const index = fs.readFileSync('src/components/calculators/engines/index.jsx', 'utf8');
const registry = [...index.matchAll(/'([^']+)':\s*\{\s*config:/g)].map(m => m[1]);
const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replaceAll('&amp;', '&'));
const sitemapSlugs = listed.filter(url => url.includes('/CalculatorPage?')).map(url => new URL(url).searchParams.get('slug')).filter(Boolean);
const stale = sitemapSlugs.filter(slug => !registry.includes(slug));
const absent = registry.filter(slug => !sitemapSlugs.includes(slug));
if (stale.length) warnings.push(`Sitemap lists unregistered calculators: ${stale.join(', ')}`);
if (absent.length) warnings.push(`Registered calculators missing from sitemap: ${absent.join(', ')}`);
if (!sitemap.includes('<urlset')) problems.push('Local sitemap.xml is missing the urlset element');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1365, height: 768 } });
const paths = ['/?lang=ar', '/?lang=en', ...trades.flatMap(trade => [
  `/CategoryPage?lang=ar&trade=${trade}`,
  `/CategoryPage?lang=en&trade=${trade}`
]), ...registry.flatMap(slug => [
  `/CalculatorPage?lang=ar&slug=${slug}`,
  `/CalculatorPage?lang=en&slug=${slug}`
])];

for (const path of paths) {
  const address = BASE + path;
  try {
    const response = await page.goto(address, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(700);
    const status = response?.status() ?? 0;
    const state = await page.evaluate(() => ({
      body: document.body?.innerText || '',
      title: document.title || '',
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
      description: document.querySelector('meta[name="description"]')?.content || ''
    }));
    const rawKeys = [...new Set((state.body.match(/\b(?:nav|trades|calculators|common|home)\.[a-z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+/g) || []))].slice(0, 8);
    const isArabic = path.includes('lang=ar');
    const pageIssues = [];
    if (status >= 400 || status === 0) pageIssues.push(`HTTP ${status}`);
    if (rawKeys.length) pageIssues.push(`Visible translation keys: ${rawKeys.join(', ')}`);
    if (state.body.length < 80) pageIssues.push('Rendered page is nearly empty');
    if (state.lang !== (isArabic ? 'ar' : 'en')) pageIssues.push(`Wrong HTML lang: ${state.lang}`);
    if (state.dir !== (isArabic ? 'rtl' : 'ltr')) pageIssues.push(`Wrong text direction: ${state.dir}`);
    if (pageIssues.length) problems.push(`${path}: ${pageIssues.join('; ')}`);
    if (!state.title) warnings.push(`${path}: missing page title`);
    if (!state.description) warnings.push(`${path}: missing meta description`);
    checks.push(`${status} ${path} — ${pageIssues.length ? 'FAIL' : 'OK'}`);
  } catch (error) {
    problems.push(`${path}: ${error.message.split('\n')[0]}`);
    checks.push(`ERROR ${path}`);
  }
}

for (const path of ['/robots.txt', '/sitemap.xml']) {
  try {
    const response = await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 30000 });
    if (!response?.ok()) problems.push(`${path} returned HTTP ${response?.status()}`);
  } catch (error) {
    problems.push(`${path}: ${error.message.split('\n')[0]}`);
  }
}
await browser.close();

const report = [
  '# MEP Calculators KSA — Daily Website & SEO Report',
  `Date: ${new Date().toISOString()}`,
  `Website: ${BASE}`,
  '',
  `Pages tested: ${checks.length} | Critical issues: ${problems.length} | SEO warnings: ${warnings.length}`,
  '',
  '## Critical issues',
  ...(problems.length ? problems.map(x => `- ${x}`) : ['- None found']),
  '',
  '## SEO opportunities / warnings',
  ...(warnings.length ? warnings.map(x => `- ${x}`) : ['- None found']),
  '',
  '## Page checks',
  ...checks.map(x => `- ${x}`),
  '',
  'This audit checks availability, text rendering, language direction, basic metadata and sitemap consistency. It does not measure rankings or validate engineering formula accuracy.'
].join('\n');
fs.writeFileSync('agent-report.md', report);
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + '\n');
if (problems.length) process.exitCode = 1;
