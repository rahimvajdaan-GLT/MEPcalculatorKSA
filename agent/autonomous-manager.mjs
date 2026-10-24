import fs from 'node:fs';
import { chromium } from 'playwright';

const site = 'https://mepcalculatorsksa.org';
const preview = 'https://mepcalculatorksa.pages.dev';
const errors = [], warnings = [], uncertain = [], checks = [];
const source = fs.readFileSync('src/components/calculators/engines/index.jsx','utf8');
const slugs = [...source.matchAll(/'([^']+)':\s*\{\s*config:/g)].map(m=>m[1]);
const trades = ['hvac','plumbing','firefighting','electrical'];
const paths = ['/?lang=ar','/?lang=en',
  ...trades.flatMap(t=>['ar','en'].map(l=>`/CategoryPage?lang=${l}&trade=${t}`)),
  ...slugs.flatMap(s=>['ar','en'].map(l=>`/CalculatorPage?lang=${l}&slug=${s}`))];

async function probe(browser,base,path) {
  const page=await browser.newPage();
  try {
    const response=await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:18000});
    const status=response?.status()||0;
    if(status>=400)return {status,kind:'http'};
    await page.waitForFunction(
      ()=>document.querySelector('#root')?.innerText?.length>70,
      null,{timeout:7000}
    ).catch(()=>{});
    const data=await page.evaluate(()=>({
      text:document.querySelector('#root')?.innerText||'',
      lang:document.documentElement.lang,
      dir:document.documentElement.dir,
      title:document.title,
      desc:document.querySelector('meta[name="description"]')?.content
    }));
    if(data.text.length<70)return {status,kind:'uncertain'};
    const keys=data.text.match(/\b(?:nav|trades|calculators|common|home)\.[\w-]+(?:\.[\w-]+)+/g)||[];
    return {status,kind:keys.length?'translation':'ok',keys,data};
  }catch(e){return {kind:'uncertain',message:e.message.split('\n')[0]};}
  finally{await page.close();}
}

const browser=await chromium.launch({headless:true});
for(const path of paths) {
  let result=await probe(browser,site,path);
  if(result.kind!=='ok') {
    const second=await probe(browser,preview,path);
    if(result.kind==='translation')
      errors.push(`${path}: untranslated labels ${result.keys.slice(0,4).join(', ')}`);
    else if(result.kind==='http' && second.kind==='http')
      errors.push(`${path}: website and preview return HTTP errors`);
    else uncertain.push(`${path}: custom=${result.kind}, preview=${second.kind}`);
    if(second.kind==='ok')result=second;
  }
  if(result.data) {
    const lang=path.includes('lang=ar')?'ar':'en';
    if(result.data.lang!==lang)warnings.push(`${path}: HTML language mismatch`);
    if(result.data.dir!==(lang==='ar'?'rtl':'ltr'))
      warnings.push(`${path}: reading direction mismatch`);
    if(!result.data.desc)warnings.push(`${path}: missing description`);
  }
  checks.push(`${path}: ${result.kind}`);
}
await browser.close();

if(process.env.BUILD_RESULT==='failure')errors.push('Website build failed');

const date=new Date().toISOString();
const report={date,site,checked:checks.length,errors,warnings,uncertain,checks};
fs.writeFileSync('agent-report.json',JSON.stringify(report,null,2));
const lines=['# Daily Website Manager',date,
`Pages checked: ${checks.length}`,
`Confirmed problems: ${errors.length}`,
`Uncertain checks: ${uncertain.length}`,
`SEO warnings: ${warnings.length}`,
'','## Confirmed problems',...errors.map(x=>'- '+x),
'','## Inconclusive checks',...uncertain.map(x=>'- '+x),
'','## SEO warnings',...warnings.map(x=>'- '+x),
'','## Page checks',...checks.map(x=>'- '+x)];
fs.writeFileSync('agent-report.md',lines.join('\n'));
if(process.env.GITHUB_STEP_SUMMARY)
 fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,lines.join('\n'));
console.log(lines.slice(0,7).join('\n'));
if(errors.length)process.exitCode=1;
