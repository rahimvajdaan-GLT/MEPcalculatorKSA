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
test('seventeen calculators registered and bilingual',()=>{
 assert.equal(Object.keys(registry).length,17);
 for(const entry of Object.values(registry)){assert.ok(entry.config.en.title);assert.ok(entry.config.ar.title);}
});
test('cooling load area method',()=>near(registry['cooling-load-estimate'].calculate(registry['cooling-load-estimate'].defaults.metric).outputs.coolingKw,14.4));
test('ventilation people and area sum',()=>near(registry['fresh-air-ventilation'].calculate(registry['fresh-air-ventilation'].defaults.metric).outputs.airflow,180));
test('lumen method',()=>near(registry['lighting-illuminance'].calculate(registry['lighting-illuminance'].defaults.metric).outputs.lux,312));
test('generator apparent power',()=>near(registry['generator-sizing-estimate'].calculate(registry['generator-sizing-estimate'].defaults.metric).outputs.requiredKva,150));
test('capacitor correction',()=>near(registry['power-factor-correction'].calculate(registry['power-factor-correction'].defaults.metric).outputs.capacitorKvar,55.323,0.02));
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

const compute=(slug,changes={},unit='metric')=>{
 const c=registry[slug];assert.ok(c,slug);
 const result=c.calculate({...c.defaults[unit],...changes},unit);
 assert.deepEqual(result.errors||[],[],slug+': '+JSON.stringify(result.errors));
 return result.outputs;
};
test('new HVAC calculators',()=>{
 near(compute('air-changes-per-hour',{length:10,width:8,height:3,targetAch:6}).requiredAirflow,1440);
 near(compute('air-changes-per-hour',{length:10,width:10,height:10,targetAch:6},'imperial').requiredAirflow,100);
 near(compute('sensible-air-cooling',{airflow:1000,deltaT:10}).capacityKw,12.06);
 near(compute('chilled-water-cooling-capacity',{flow:10,deltaT:5}).capacityKw,209.3);
});
test('new plumbing calculators',()=>{
 near(compute('pump-hydraulic-power',{flow:10,head:30,efficiency:0.75}).shaftPower,3.924);
 near(compute('domestic-water-demand',{occupants:100,rate:20,reserveDays:2}).storage,4000);
 near(compute('sewage-flow-estimate',{water:10000,returnFraction:0.8,days:20}).monthlySewage,160000);
});
test('new electrical calculators',()=>{
 near(compute('three-phase-current',{power:40,voltage:400,powerFactor:1}).current,57.735,0.002);
 near(compute('electrical-energy-estimate',{power:10,hours:8,days:30,tariff:0.2}).cost,480);
});
test('single sprinkler pressure',()=>{
 near(compute('sprinkler-k-factor',{flow:160,kFactor:80}).pressure,4);
});
test('new calculators reject invalid inputs',()=>{
 for(const [slug,values] of [
  ['three-phase-current',{voltage:0}],['sprinkler-k-factor',{kFactor:0}],
  ['pump-hydraulic-power',{efficiency:0}],['sewage-flow-estimate',{returnFraction:1.2}],
  ['electrical-energy-estimate',{hours:25}]
 ]) {
  const c=registry[slug];
  assert.ok(c.calculate({...c.defaults.metric,...values}).errors?.length,slug);
 }
});
test('metric and imperial cooling and pumping agree',()=>{
 const a=compute('chilled-water-cooling-capacity',{flow:10,deltaT:5});
 const b=compute('chilled-water-cooling-capacity',{flow:158.503,deltaT:9},'imperial');
 near(a.capacityTr,b.capacityTr,0.05);
 const c=compute('pump-hydraulic-power',{flow:10,head:30,efficiency:0.75});
 const d=compute('pump-hydraulic-power',{flow:158.503,head:98.4252,efficiency:0.75},'imperial');
 near(c.shaftPower/0.745699872,d.shaftPower,0.03);
});
