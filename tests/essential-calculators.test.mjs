import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const folder=mkdtempSync(join(tmpdir(),'mep-essential-'));
const outfile=join(folder,'essential.mjs');
await build({entryPoints:['src/components/calculators/engines/essentialCalculators.jsx'],bundle:true,platform:'node',format:'esm',outfile,logLevel:'silent'});
const { essentialCalculatorRegistry: registry }=await import(pathToFileURL(outfile).href);
const near=(value,expected,tolerance=0.01)=>assert.ok(Math.abs(value-expected)<=tolerance,`Expected ${value} close to ${expected}`);
test('eight calculators registered and bilingual',()=>{
 assert.equal(Object.keys(registry).length,8);
 for(const entry of Object.values(registry)){assert.ok(entry.config.en.title);assert.ok(entry.config.ar.title);}
});
test('cooling load area method',()=>near(registry['cooling-load-estimate'].calculate(registry['cooling-load-estimate'].defaults.metric).outputs.coolingKw,14.4));
test('ventilation people and area sum',()=>near(registry['fresh-air-ventilation'].calculate(registry['fresh-air-ventilation'].defaults.metric).outputs.airflow,180));
test('lumen method',()=>near(registry['lighting-illuminance'].calculate(registry['lighting-illuminance'].defaults.metric).outputs.lux,312));
test('generator apparent power',()=>near(registry['generator-sizing-estimate'].calculate(registry['generator-sizing-estimate'].defaults.metric).outputs.requiredKva,150));
test('capacitor correction',()=>near(registry['power-factor-correction'].calculate(registry['power-factor-correction'].defaults.metric).outputs.capacitorKvar,55.266,0.02));
test('NPSH available',()=>near(registry['pump-npsh-available'].calculate(registry['pump-npsh-available'].defaults.metric).outputs.npsha,11.29));
test('sprinkler demand',()=>near(registry['sprinkler-demand-estimate'].calculate(registry['sprinkler-demand-estimate'].defaults.metric).outputs.sprinklerFlow,1134));
test('storage volume',()=>near(registry['fire-water-storage'].calculate(registry['fire-water-storage'].defaults.metric).outputs.grossTank,100));
test('reject invalid inputs',()=>{
 const c=registry['power-factor-correction'];assert.ok(c.calculate({...c.defaults.metric,existingPf:1.2}).errors.length);
 const n=registry['pump-npsh-available'];assert.ok(n.calculate({...n.defaults.metric,frictionLoss:-1}).errors.length);
});
test('metric and imperial NPSH represent same value',()=>{
 const c=registry['pump-npsh-available'];const m=c.calculate(c.defaults.metric).outputs.npsha;
 const f=c.calculate({atmosphericHead:10.33*3.28084,staticHead:2*3.28084,frictionLoss:0.8*3.28084,vaporHead:0.24*3.28084},'imperial').outputs.npsha;
 near(f/3.28084,m,0.002);
});
process.on('exit',()=>rmSync(folder,{recursive:true,force:true}));
