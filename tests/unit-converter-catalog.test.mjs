import test from 'node:test';
import assert from 'node:assert/strict';
import { localDimensions, localUnits, localConverterCards } from '../src/components/converters/localCatalog.js';
import { build } from 'esbuild';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const folder=mkdtempSync(join(tmpdir(),'mep-converter-'));
const outfile=join(folder,'engine.mjs');
await build({entryPoints:['src/components/converters/ConversionEngine.jsx'],bundle:true,platform:'node',format:'esm',outfile,logLevel:'silent'});
const {convertUnits,formatConversionResult}=await import(pathToFileURL(outfile).href);
process.on('exit',()=>rmSync(folder,{recursive:true,force:true}));
const unit=(dim,key)=>localUnits.find(u=>u.dimensionKey===dim&&u.key===key);
const convert=(dim,a,b,value)=>convertUnits(value,unit(dim,a),unit(dim,b));
const near=(value,expected,tolerance=0.0001)=>assert.ok(Math.abs(value-expected)<=tolerance,`expected ${value} ~= ${expected}`);

test('catalog is complete, bilingual and self-contained',()=>{
 assert.equal(localDimensions.length,10);
 assert.equal(localConverterCards.length,28);
 for(const card of localConverterCards){
  assert.ok(card.titleEn&&card.titleAr&&card.dimensionKey&&card.slug);
  if(!card.isSpecial){
   assert.ok(unit(card.dimensionKey,card.defaultFromUnitKey));
   assert.ok(unit(card.dimensionKey,card.defaultToUnitKey));
  }
 }
});
test('pressure: bar to psi',()=>near(convert('pressure','bar','psi',1),14.5037738,0.00001));
test('flow: litre per second to US gallons per minute',()=>near(convert('flow','lps','gpm',1),15.8503231,0.00001));
test('temperature: Celsius and Fahrenheit offsets',()=>{
 near(convert('temperature','c','f',0),32);
 near(convert('temperature','f','c',212),100);
 near(convert('temperature','c','k',-40),233.15);
});
test('metric and imperial length and area',()=>{
 near(convert('length','ft','m',1),0.3048);
 near(convert('area','ft2','m2',1),0.09290304);
});
test('water volume and cooling power',()=>{
 near(convert('volume','usgal','l',1),3.785411784);
 near(convert('power','tr','kw',1),3.5168528420667,0.0000001);
});
test('round-trip all local converters',()=>{
 for(const card of localConverterCards.filter(c=>!c.isSpecial)){
  const {dimensionKey:dim,defaultFromUnitKey:from,defaultToUnitKey:to}=card;
  const after=convert(dim,from,to,23.45);
  near(convert(dim,to,from,after),23.45,0.00001);
 }
});

test('invalid and nonfinite values never become valid conversion output',()=>{
 const from=unit('pressure','bar'),to=unit('pressure','psi');
 for(const invalid of [NaN,Infinity,-Infinity,'abc',null,undefined]){
  assert.equal(convertUnits(invalid,from,to),null);
 }
 assert.equal(convertUnits(Number.MAX_VALUE,unit('length','m'),unit('length','mm')),null);
 assert.equal(convertUnits(1,from,{...to,factorToBase:0}),null);
 assert.equal(convertUnits(1,from,{...to,factorToBase:Infinity}),null);
 assert.equal(convertUnits(1,from,unit('length','m')),null);
 for(const invalid of [NaN,Infinity,-Infinity,'abc',null,undefined]){
  assert.equal(formatConversionResult(invalid,'pressure','psi'),'-');
 }
});

test('zero, signed Celsius and negative algebraic values retain defined behavior',()=>{
 near(convert('temperature','c','f',0),32);
 near(convert('temperature','c','f',-40),-40);
 near(convert('temperature','f','c',32),0);
 near(convert('pressure','bar','psi',0),0);
 near(convert('pressure','bar','psi',-1),-14.5037738,0.00001);
});
