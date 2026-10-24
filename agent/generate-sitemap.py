"""Generate a sitemap from calculator IDs actually present in this repository.

Run from repository root: python3 agent/generate-sitemap.py

No fabricated <lastmod> dates: update these only when content changes materially.
"""
from pathlib import Path
from urllib.parse import urlencode
import re
import xml.etree.ElementTree as ET

BASE = 'https://mepcalculatorsksa.org'
source = Path('src/components/calculators/engines/index.jsx').read_text(encoding='utf-8')
pattern = re.compile(r"'([^']+)':\s*\{\s*config:.*?trade:\s*'([^']+)'", re.S)
calculators = pattern.findall(source)
assert len(calculators) >= 10, 'Could not locate registered calculators. Sitemap not changed.'

urls = [BASE + path for path in ['/', '/StandardsPage', '/UnitConverterHub', '/EngineeringGuides', '/PrivacyPage', '/TermsPage']]
for lang in ['ar', 'en']:
    for trade in sorted(set(t for _, t in calculators)):
        urls.append(BASE + '/CategoryPage?' + urlencode({'lang': lang, 'trade': trade}))
    for slug, trade in calculators:
        urls.append(BASE + '/CalculatorPage?' + urlencode({'lang': lang, 'trade': trade, 'slug': slug}))

ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
root = ET.Element('{http://www.sitemaps.org/schemas/sitemap/0.9}urlset')
for url in urls:
    ET.SubElement(ET.SubElement(root, '{http://www.sitemaps.org/schemas/sitemap/0.9}url'),
                  '{http://www.sitemaps.org/schemas/sitemap/0.9}loc').text = url
ET.indent(root, space='  ')
ET.ElementTree(root).write('public/sitemap.xml', encoding='utf-8', xml_declaration=True)
print(f'Sitemap updated: {len(urls)} URLs covering {len(calculators)} registered calculators (both languages).')
