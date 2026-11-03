import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const folder=mkdtempSync(join(tmpdir(),'mep-more-'));
const outfile=join(folder,'additional.mjs');
await build({entryPoints:['src/components/calculators/engines/additionalCalculators.jsx'],bundle:true,platform:'node',format:'esm',outfile,logLevel:'silent'});
const {additionalCalculatorRegistry: registry}=await import(pathToFileURL(outfile).href);
const near=(v,x,eps=0.005)=>assert.ok(Math.abs(v-x)<=eps,`Expected ${v} to equal ${x} ± ${eps}`);
const calc=(slug,values={},mode='metric')=>{
 const c=registry[slug];assert.ok(c,slug);
 const r=c.calculate({...c.defaults[mode],...values},mode);
 assert.deepEqual(r.errors,[],slug+' '+JSON.stringify(r.errors));
 return r.outputs;
};
test('nine bilingual interactive calculators with finite results',()=>{
 assert.equal(Object.keys(registry).length,9);
 for(const [name,v] of Object.entries(registry)){
  assert.ok(v.config.en.title && v.config.ar.title,name);
  for(const unit of ['metric','imperial']){
   const x=calc(name,{},unit);
   for(const value of Object.values(x))assert.ok(Number.isFinite(value),name);
  }
 }
});
test('envelope conduction: Q = UA deltaT',()=>{
 near(calc('envelope-heat-transfer',{area:100,uValue:2,deltaT:10}).heatLoad,2);
 near(calc('envelope-heat-transfer',{area:100,uValue:1,deltaT:10},'imperial').heatLoad,1000);
});
test('HVAC supply airflow and duct velocity',()=>{
 near(calc('supply-airflow-sizing',{sensibleLoad:12.06,deltaT:10}).airflow,1000);
 near(calc('rectangular-duct-velocity',{flow:500,width:0.5,height:0.4}).velocity,2.5);
 near(calc('rectangular-duct-velocity',{flow:600,width:2,height:1},'imperial').velocity,300);
});
test('water pipe and sewage',()=>{
 near(calc('water-pipe-velocity',{flow:Math.PI/4*1000*0.05*0.05,diameter:50}).velocity,1);
 near(calc('peak-sewage-flow',{dailyFlow:86400,operatingHours:24,peakFactor:2}).peakFlow,2);
});
test('single-phase current and motor shaft torque',()=>{
 near(calc('single-phase-current',{power:2.3,voltage:230,powerFactor:1}).current,10);
 near(calc('motor-torque',{shaftPower:Math.PI*2, speed:60}).torque,1000/1,0.002);
});
test('lighting rounded fixture count',()=>{
 near(calc('lighting-fixture-quantity',{area:100,target:300,lumens:3000,utilization:0.5,maintenance:1}).fixtures,20);
});
test('sprinkler pressure-flow equation',()=>{
 near(calc('sprinkler-discharge',{kFactor:80,pressure:4}).flow,160);
 near(calc('sprinkler-discharge',{kFactor:5.6,pressure:25},'imperial').flow,28);
});
test('reject zero divisors and invalid fractions',()=>{
 for(const [slug,values] of [
  ['water-pipe-velocity',{diameter:0}],['single-phase-current',{powerFactor:0}],
  ['motor-torque',{speed:0}],['supply-airflow-sizing',{deltaT:0}],
  ['lighting-fixture-quantity',{utilization:1.2}],['peak-sewage-flow',{operatingHours:25}]
 ]) {
  const c=registry[slug];const result=c.calculate({...c.defaults.metric,...values});
  assert.ok(result.errors?.length,slug);
 }
});
test('metric and imperial unit conversions',()=>{
 near(calc('water-pipe-velocity',{flow:2,diameter:50}).velocity*3.280839895,
      calc('water-pipe-velocity',{flow:31.70064,diameter:1.96850394},'imperial').velocity,0.005);
 near(calc('motor-torque',{shaftPower:5,speed:1500}).torque*0.7375621493,
      calc('motor-torque',{shaftPower:6.7051104,speed:1500},'imperial').torque,0.005);
});
process.on('exit',()=>rmSync(folder,{recursive:true,force:true}));
