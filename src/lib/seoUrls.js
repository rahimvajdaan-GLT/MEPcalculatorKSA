const SITE_ORIGIN = 'https://mepcalculatorsksa.org';
const SUPPORTED_TRADES = new Set(['hvac', 'plumbing', 'firefighting', 'electrical']);

function localizedUrl(pathname, language, parameters) {
  const url = new URL(pathname, SITE_ORIGIN);
  url.searchParams.set('lang', language);
  for (const [key, value] of parameters) {
    if (value) url.searchParams.set(key, value);
  }
  return url.toString();
}

export function buildSeoUrls(pathname, search = '') {
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '') || '/';
  const requestUrl = new URL(search, SITE_ORIGIN);
  const requestedLanguage = requestUrl.searchParams.get('lang');
  const language = requestedLanguage === 'en' ? 'en' : 'ar';
  const isHome = normalizedPath === '/';
  const isCategory = normalizedPath === '/CategoryPage';
  const isCalculator = normalizedPath === '/CalculatorPage';
  const parameters = [];

  if (isCategory) {
    const requestedTrade = requestUrl.searchParams.get('trade');
    const trade = SUPPORTED_TRADES.has(requestedTrade) ? requestedTrade : 'hvac';
    parameters.push(['trade', trade]);
  } else if (isCalculator) {
    const trade = requestUrl.searchParams.get('trade');
    const slug = requestUrl.searchParams.get('slug') || 'duct-sizing';
    if (SUPPORTED_TRADES.has(trade)) parameters.push(['trade', trade]);
    parameters.push(['slug', slug]);
  }

  if (isHome || isCategory || isCalculator) {
    const currentUrl = localizedUrl(normalizedPath, language, parameters);
    const arabicUrl = localizedUrl(normalizedPath, 'ar', parameters);
    const englishUrl = localizedUrl(normalizedPath, 'en', parameters);

    return {
      canonical: currentUrl,
      alternates: [
        { hreflang: 'ar', href: arabicUrl },
        { hreflang: 'en', href: englishUrl },
        { hreflang: 'x-default', href: arabicUrl },
      ],
    };
  }

  return {
    canonical: new URL(normalizedPath, SITE_ORIGIN).toString(),
    alternates: [],
  };
}

export function applySeoMetadata(document, seoUrls) {
  const canonicalLinks = Array.from(document.head.querySelectorAll('link[rel="canonical"]'));
  const canonical = canonicalLinks.shift() || document.createElement('link');
  canonicalLinks.forEach(link => link.remove());
  canonical.rel = 'canonical';
  canonical.href = seoUrls.canonical;
  if (!canonical.parentNode) document.head.appendChild(canonical);

  document.head.querySelectorAll('link[rel="alternate"]').forEach(link => link.remove());
  seoUrls.alternates.forEach(({ hreflang, href }) => {
    const alternate = document.createElement('link');
    alternate.rel = 'alternate';
    alternate.hreflang = hreflang;
    alternate.href = href;
    document.head.appendChild(alternate);
  });
}