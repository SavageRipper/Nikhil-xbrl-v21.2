import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=new URL('..',import.meta.url);
const bundle=fs.readFileSync(new URL('app-bundled.js',root),'utf8').replace(/\nload\(\);\s*$/,'\n');
const elements=new Map();
function el(id){return {id,innerHTML:'',textContent:'',value:'',hidden:false,dataset:{},style:{},classList:{add(){},remove(){},contains(){return false}},addEventListener(){},querySelector(){return null},querySelectorAll(){return []},setAttribute(){},getAttribute(){return ''},focus(){}}}
const documentStub={getElementById(id){if(!elements.has(id))elements.set(id,el(id));return elements.get(id)},querySelectorAll(){return []},querySelector(){return null},createElement(tag){return el(tag)}};
const context={window:{addEventListener(){}},document:documentStub,localStorage:{getItem(){return null},setItem(){},removeItem(){}},console,Blob:function(){},URL:{createObjectURL(){return ''},revokeObjectURL(){}},setTimeout,clearTimeout,setInterval,clearInterval,performance:{now:()=>Date.now()},confirm:()=>true,FileReader:function(){},DOMParser:function(){},XMLSerializer:function(){},TextEncoder,TextDecoder};
vm.createContext(context);vm.runInContext(bundle,context,{timeout:120000});context.MCA_DATA=context.window.MCA_DATA;
const result=vm.runInContext(`(()=>{const d=v18NormalizeIsoDate;const dates=[['01/04/2025','2025-04-01'],['31-03-2026','2026-03-31'],['2026/03/31','2026-03-31'],['2026-03-31','2026-03-31']];for(const [a,b] of dates)if(d(a)!==b)throw new Error(a+' => '+d(a));Object.assign(state,{values:{'in-ca:DateOfStartOfReportingPeriod':'01/04/2025','in-ca:DateOfEndOfReportingPeriod':'31/03/2026'},prior:{},contexts:[{id:'C1',start:'01/04/2025',end:'31/03/2026',instant:'',dimensions:[]}]});state.elements=MCA_DATA.elements;v18NormalizeDateFacts();if(state.values['in-ca:DateOfStartOfReportingPeriod']!=='2025-04-01'||state.values['in-ca:DateOfEndOfReportingPeriod']!=='2026-03-31')throw new Error('General Information date normalization failed');if(state.contexts[0].start!=='2025-04-01'||state.contexts[0].end!=='2026-03-31')throw new Error('Context date normalization failed');return true})()`,context,{timeout:120000});
assert.equal(result,true);
assert.match(bundle,/Date fact .*yyyy-mm-dd/);
assert.match(bundle,/const dimensional=conceptHasDimensionalTable\(k,role\)\|\|conceptHasAnyDimensionalTable\(k\)/);
console.log('V18 date/dimensional regression: PASS (ISO dates normalized; dimensional concepts suppressed in both flat-year columns)');
