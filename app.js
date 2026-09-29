const state={meta:null,elements:[],presentation:[],calculations:[],definitions:[],elrs:[],rules:{},active:'dashboard',section:0,values:{},prior:{},priorFacts:{},factOccurrences:{current:[],prior:[]},xbrlStore:{version:1,source:'new',contexts:[],units:[],facts:[],factIndex:{}},importedContexts:[],importedUnits:[],importDiagnostics:[],cellIssues:{},dimTables:{},calculationOverrides:{},_v18PriorImportedFacts:{},manualParentsEnabled:false,dirty:false,contexts:[{id:'C1',entity:'',scheme:'http://www.mca.gov.in/CIN',start:'2025-04-01',end:'2026-03-31',instant:'',dimensions:[]},{id:'P1',entity:'',scheme:'http://www.mca.gov.in/CIN',start:'2024-04-01',end:'2025-03-31',instant:'',dimensions:[]}],units:[],footnotes:[],links:[],richText:{},priorRichText:{},errors:[],warnings:[],profile:{cin:'',companyName:'',fyStart:'',fyEnd:'',currency:'',firstYear:false,financialStatements:'',inputScale:'Actuals',generalInfoEnabled:true,cashFlowMethod:''}};
const $=id=>document.getElementById(id); const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const APP_VERSION='21.2.0'; const PROJECT_KEY='mcaCniXbrlProjectV21_2'; const LEGACY_PROJECT_KEYS=['mcaCniXbrlProjectV17','mcaCniXbrlProjectV16','mcaCniXbrlProjectV15','mcaCniXbrlProjectV14','mcaCniXbrlProjectV13','mcaCniXbrlProjectV12','mcaCniXbrlProjectV11','mcaCniXbrlProjectV10','mcaCniXbrlProjectV9','mcaCniXbrlProjectV8','mcaCniXbrlProjectV6'];
function normalizeState(){state.appVersion=APP_VERSION;state.profile=state.profile&&typeof state.profile==='object'?state.profile:{};state.profile={cin:'',companyName:'',fyStart:'',fyEnd:'',currency:'',firstYear:false,financialStatements:'',inputScale:'Actuals',generalInfoEnabled:true,cashFlowMethod:'',...state.profile};state.values=state.values&&typeof state.values==='object'?state.values:{};state.prior=state.prior&&typeof state.prior==='object'?state.prior:{};state.priorFacts=state.priorFacts&&typeof state.priorFacts==='object'?state.priorFacts:{};state.historicalFacts=state.historicalFacts&&typeof state.historicalFacts==='object'?state.historicalFacts:{};state.richText=state.richText&&typeof state.richText==='object'?state.richText:{};state.priorRichText=state.priorRichText&&typeof state.priorRichText==='object'?state.priorRichText:{};state.contexts=Array.isArray(state.contexts)&&state.contexts.length?state.contexts:[{id:'C1',entity:'',scheme:'http://www.mca.gov.in/CIN',start:state.profile.fyStart,end:state.profile.fyEnd,instant:'',dimensions:[]}];state.units=Array.isArray(state.units)&&state.units.length?state.units:[{id:'INR',measure:'iso4217:INR'}];state.footnotes=Array.isArray(state.footnotes)?state.footnotes:[];state.links=Array.isArray(state.links)?state.links:[];state.errors=Array.isArray(state.errors)?state.errors:[];state.warnings=Array.isArray(state.warnings)?state.warnings:[];state.cellIssues=state.cellIssues&&typeof state.cellIssues==='object'?state.cellIssues:{};state.dimTables=state.dimTables&&typeof state.dimTables==='object'?state.dimTables:{};state.calculationOverrides=state.calculationOverrides&&typeof state.calculationOverrides==='object'?state.calculationOverrides:{};state._v18PriorImportedFacts=state._v18PriorImportedFacts&&typeof state._v18PriorImportedFacts==='object'?state._v18PriorImportedFacts:{};state.priorCalculated=state.priorCalculated&&typeof state.priorCalculated==='object'?state.priorCalculated:{};state.factOccurrences=state.factOccurrences&&typeof state.factOccurrences==='object'?state.factOccurrences:{current:[],prior:[]};state.factOccurrences.current=Array.isArray(state.factOccurrences.current)?state.factOccurrences.current:[];state.factOccurrences.prior=Array.isArray(state.factOccurrences.prior)?state.factOccurrences.prior:[];state.profile.generalInfoEnabled=true;}
function profileComplete(){const p=state.profile||{};return !!(String(p.cin||'').trim()&&String(p.companyName||'').trim()&&String(p.fyStart||'').trim()&&String(p.fyEnd||'').trim()&&String(p.currency||'').trim()&&String(p.financialStatements||'').trim());}
function requireProfile(){return true;}
async function load(){if(window.MCA_DATA){state.meta=MCA_DATA.meta;state.elements=MCA_DATA.elements||[];state.presentation=MCA_DATA.presentation||[];state.calculations=MCA_DATA.calculations||[];state.definitions=MCA_DATA.definitions||[];state.rules=MCA_DATA['business-rules']||MCA_DATA.rules||{};state.elrs=MCA_DATA.elrs||[];boot();return;}const names=['meta','elements','presentation','calculations','definitions','business-rules','elrs'];const a=await Promise.all(names.map(n=>fetch(`data/${n}.json`).then(r=>r.json())));[state.meta,state.elements,state.presentation,state.calculations,state.definitions,state.rules,state.elrs]=a; boot();}
async function boot(){let saved=null,migratedFrom='';try{saved=localStorage.getItem(PROJECT_KEY);}catch{}if(!saved){for(const key of LEGACY_PROJECT_KEYS){try{const candidate=localStorage.getItem(key);if(candidate){saved=candidate;migratedFrom=key;break;}}catch{}}}if(!saved){const fallback=await restoreFallback();if(fallback)saved=JSON.stringify(fallback);}if(saved){try{const incoming=JSON.parse(saved);const keep={meta:state.meta,elements:state.elements,presentation:state.presentation,calculations:state.calculations,definitions:state.definitions,elrs:state.elrs,rules:state.rules};Object.assign(state,incoming);Object.assign(state,keep);normalizeState();state.dirty=false;if(migratedFrom){localStorage.setItem(PROJECT_KEY,JSON.stringify(state));toast(`Your filing data was migrated from ${migratedFrom.replace('mcaCniXbrlProject','V')} to V21. Nothing in the filing was intentionally removed.`);}else{toast('Restored your last browser-saved filing.')}}catch{toast('The saved filing could not be restored; starting a new project.')}}normalizeState();synchronizeAll();renderNav();renderTabs();render();}
const mainTabs=[['dashboard','General Information'],['filing','Filing tabs'],['tagging','C&I tagging'],['contexts','Contexts & units'],['dimensions','Dimensions / members'],['footnotes','Footnotes'],['rules','C&I rules'],['errors','Errors / warnings']];
function renderNav(){$('nav').innerHTML=mainTabs.map(([id,n])=>`<button class="nav-item ${state.active===id?'active':''}" data-nav="${id}">${n}<span class="num">${id==='filing'?state.elrs.length:''}</span></button>`).join('');document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{state.active=b.dataset.nav;renderNav();renderTabs();render();});}
function renderTabs(){let html='';if(state.active==='filing')html=state.elrs.map((e,i)=>{const oldElr=/^\[400100\]/.test(e.name||'');const disabled=oldElr&&Number(String(state.profile.fyEnd||'').slice(0,4))>=2015;return `<button class="tab ${state.section===i?'active':''}${disabled?' locked':''}" data-sec="${i}" ${disabled?'disabled title="Not applicable for FY 2014-15 onward"':''}>${esc(e.name.replace(/^\[[^\]]+\]\s*/,''))}${disabled?' • N/A':''}</button>`}).join('');$('tabs').innerHTML=html;document.querySelectorAll('[data-sec]').forEach(b=>b.onclick=()=>{state.section=+b.dataset.sec;render();});}
function baseRender(){normalizeState();const titles={dashboard:['Control centre','Company/general information, filing controls and checks.'],filing:[state.elrs[state.section]?.name.replace(/^\[[^\]]+\]\s*/,''),'Taxonomy-driven data entry with current/prior comparison and linked values.'],tagging:['C&I tagging','Search the C&I taxonomy and tag source data to XBRL concepts.'],contexts:['Contexts & units','Define reporting periods, entities, units and dimension-qualified contexts.'],dimensions:['Dimensions / members','Manage axes and members used in dimensional disclosures.'],footnotes:['Footnotes','Attach notes to facts and keep disclosure support in the instance.'],rules:['C&I Business Rules','Business rules imported from the supplied MCA C&I rules workbook.'],errors:['Error / warning dashboard','Pre-scrutiny findings, correction navigation and downloadable reports.']};$('pageTitle').textContent=titles[state.active][0];$('pageDesc').textContent=titles[state.active][1];const hm=document.querySelector('.hero-meta');if(hm)hm.innerHTML=`<span>C&I V1.2 • Business Rules V1.3</span><span>V21 • MCA V3 / V5.1 workflow</span>${profileComplete()?`<span class="status ok">${esc(state.profile.companyName)} • FY ${esc(String(state.profile.fyEnd||'').slice(0,4)-1)}-${esc(String(state.profile.fyEnd||'').slice(2,4))}</span>`:''}`;$('content').innerHTML=({dashboard:dashboardView,filing:filingView,tagging:taggingView,contexts:contextsView,dimensions:dimensionsView,footnotes:footnotesView,rules:rulesView,errors:errorsView}[state.active])();wire();updateCounts();}
function dashboardView(){return typeof v18GeneralInfoDashboard==='function'?v18GeneralInfoDashboard():'';}
function field(id,label,val,path,type='text',opts=[]){let input=type==='select'?`<select data-bind="${path}">${opts.map(o=>`<option ${o===val?'selected':''}>${esc(o)}</option>`).join('')}</select>`:`<input type="${type}" value="${esc(val)}" data-bind="${path}">`;return `<div class="field"><label>${label}</label>${input}</div>`}
function renderTabs(){
  let html='';
  if(state.active==='filing')html=state.elrs.map((e,i)=>{const is400=isGeneralInformationRole(e.name);const suffix=is400?(generalInformationEnabled()?' • Enabled':' • Optional'):'';return `<button class="tab ${state.section===i?'active':''}" data-sec="${i}">${esc(e.name.replace(/^\[[^\]]+\]\s*/,''))}${suffix}</button>`;}).join('');
  $('tabs').innerHTML=html;
  document.querySelectorAll('[data-sec]').forEach(b=>b.onclick=()=>{state.section=+b.dataset.sec;render();});
}
function cashFlowRoleAllowed(role){
  const r=String(role||'').toLowerCase();
  const isDirect=/cash flow statement,\s*direct\b/.test(r);
  const isIndirect=/cash flow statement,\s*indirect\b/.test(r);
  if(!isDirect&&!isIndirect)return true;
  const m=String(state.profile.cashFlowMethod||state.values?.[V18_C?.cashflow]||'').toLowerCase();
  if(!m)return true;
  const wantIndirect=/indirect/.test(m);
  const wantDirect=/direct/.test(m)&&!wantIndirect;
  return isDirect?wantDirect:isIndirect?wantIndirect:false;
}
function cashFlowRoleLabel(role){return /direct/i.test(String(role||''))?'Direct Method':'Indirect Method';}
function filingView(){const role=state.elrs[state.section]?.name;if(!cashFlowRoleAllowed(role)){return `<div class="card"><h2>${esc(cashFlowRoleLabel(role))} cash-flow statement</h2><p class="hint">The imported/current filing is set to <strong>${esc(state.profile.cashFlowMethod||'the selected method')}</strong>. This filing tab is intentionally inactive so the same cash-flow facts are not displayed in both Direct and Indirect tabs.</p><button class="smallbtn" data-action="selectCashFlowMethod">Change cash-flow method</button></div>`;}let rows=state.presentation.filter(x=>x.role===role);if(!rows.length)rows=state.elements.slice(0,40).map((e,i)=>({prefix:e.prefix,name:e.name,label:e.label,depth:0,order:i}));const fy=yearLabel(state.profile.fyStart,state.profile.fyEnd);const py=priorYearLabel(state.profile.fyStart,state.profile.fyEnd);const cfg=dimensionalConfigs(role)[0];const dimQs=new Set((cfg?.lineItems||[]).map(x=>x.q));const dimBlock=cfg?dimensionalEditor(role):'';if(cfg)rows=rows.filter(r=>!dimQs.has(`${r.prefix}:${r.name}`)||/TextBlock/i.test(r.name));return `${dimBlock}<div class="card"><div class="toolbar"><div class="grow"><b>${esc(role)}</b><div class="hint">Enter the value in the <strong>${esc(fy)}</strong> column. The <strong>${esc(py)}</strong> column is for comparison/import. The filing FY is selected manually on the Dashboard; importing XML never changes it.</div></div><span class="status" id="tabStatus">Not checked</span><button class="smallbtn primary" data-action="tabcheck">Pre-scrutiny this tab</button><button class="smallbtn" data-action="toggleParents">${state.manualParentsEnabled?'Lock parent cells':'Enable parent cells manually'}</button><button class="smallbtn" data-action="explainXbrl">Explain XBRL terms</button></div><div class="toolbar compact-help"><input class="search grow" id="tabSearch" placeholder="Find a line in this tab..."><span class="hint">Dimensional tabs use taxonomy-controlled dropdowns and can contain multiple member rows.</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th style="width:34%">What are you reporting?</th><th>${esc(fy)}<div class="hint">Type / edit</div></th><th>${esc(py)}<div class="hint">Imported / comparison</div></th><th>How it is stored</th><th></th></tr></thead><tbody id="tabBody">${rows.slice(0,180).map((r,i)=>factRow(r,i,role)).join('')}</tbody></table></div><div class="footer-note">Showing up to 180 presentation concepts in this tab. The taxonomy search covers all ${state.elements.length.toLocaleString()} concepts.</div></div>`}
function yearLabel(start,end){const y=end?String(end).slice(0,4):'';return y?`FY ${y}`:'Current year'}
function priorYearLabel(start,end){const y=end?Number(String(end).slice(0,4))-1:null;return y?`FY ${y}`:'Prior year'}
function isBooleanConcept(e){return /boolean/i.test(e?.type||'')}
function isRichTextConcept(e){const n=String(e?.name||'').toLowerCase(),t=String(e?.type||'').toLowerCase(),l=String(e?.label||'').toLowerCase();return t.includes('textblockitemtype')||n.endsWith('textblock')||/directors? report|secretarial audit|auditors? report|text block|explanatory/.test(l)}
function yesNoCell(k,val,bad,disabled=false){return `<select class="fact-select${bad?' cell-invalid':''}${disabled?' linked-disabled':''}" data-fact="${esc(k)}" title="Select Yes or No" ${disabled?'disabled':''}><option value="" ${val===''?'selected':''}>Select…</option><option value="true" ${String(val).toLowerCase()==='true'?'selected':''}>Yes</option><option value="false" ${String(val).toLowerCase()==='false'?'selected':''}>No</option></select>`}
function richTextCell(k,val,bad,disabled=false){const preview=stripHtml(val||'');return `<div class="rich-cell ${bad?'cell-invalid-wrap':''}"><button class="rich-open${bad?' cell-invalid':''}${disabled?' linked-disabled':''}" data-rich="${esc(k)}" ${disabled?'disabled':''} title="Open rich text editor">${preview?esc(preview.slice(0,120)):'Click to enter formatted text…'}</button><div class="hint">Rich text • tables • paste formatting</div></div>`}
let __v18IndexCache={elements:null,presentation:null,calculations:null,elementByQName:new Map(),rolesByQName:new Map(),calcByParent:new Map()};
function v18EnsureIndexes(){if(__v18IndexCache.elements!==state.elements||__v18IndexCache.presentation!==state.presentation||__v18IndexCache.calculations!==state.calculations){const elementByQName=new Map(),rolesByQName=new Map(),calcByParent=new Map();for(const e of (state.elements||[]))elementByQName.set(`${e.prefix}:${e.name}`,e);for(const p of (state.presentation||[])){const q=`${p.prefix}:${p.name}`;let a=rolesByQName.get(q);if(!a)rolesByQName.set(q,a=[]);if(p.role&&!a.includes(p.role))a.push(p.role);}for(const c of (state.calculations||[])){const q=`${c.prefix}:${c.name}`;let a=calcByParent.get(q);if(!a)calcByParent.set(q,a=[]);a.push(c);}__v18IndexCache={elements:state.elements,presentation:state.presentation,calculations:state.calculations,elementByQName,rolesByQName,calcByParent};}return __v18IndexCache;}
function v18Element(q){return v18EnsureIndexes().elementByQName.get(q);}
function sharedRoles(k){return (v18EnsureIndexes().rolesByQName.get(k)||[]).map(r=>r.replace(/^\[[^\]]+\]\s*/,''));}
function factInput(k,e,val,bad,disabled=false){if(isBooleanConcept(e))return yesNoCell(k,val,bad,disabled);if(isRichTextConcept(e))return richTextCell(k,state.richText?.[k]??val,bad,disabled);return `<input class="auto-grow${bad?' cell-invalid':''}${disabled?' linked-disabled':''}" data-fact="${esc(k)}" value="${esc(val)}" placeholder="Enter value" title="${esc(bad?.message||'Enter the current-year value')}" ${disabled?'disabled':''}>`}
function applicabilityGroup(e){const t=((e?.name||'')+' '+(e?.label||'')).toLowerCase();if(/secretarial audit/.test(t))return 'secretarial';if(/corporate social responsibility|\bcsr\b/.test(t))return 'csr';if(/cash flow/.test(t))return 'cashflow';if(/consolidated financial|consolidated statements|consolidated/.test(t))return 'consolidated';if(/related party/.test(t))return 'relatedparty';return ''}
let __v18DimensionalConcepts=null;
function v18DimensionalConceptSet(){if(__v18DimensionalConcepts)return __v18DimensionalConcepts;__v18DimensionalConcepts=new Set();if(typeof v15AllTableModels==='function')for(const m of v15AllTableModels())for(const li of (m.lineItems||[]))__v18DimensionalConcepts.add(li.q);return __v18DimensionalConcepts;}
function conceptHasDimensionalTable(concept,role=''){return v18DimensionalConceptSet().has(concept);}
function conceptHasAnyDimensionalTable(concept){return v18DimensionalConceptSet().has(concept);}
function calcRoleIndex(role){const i=(state.elrs||[]).findIndex(e=>e.name===role);return i<0?9999:i;}
function calculationCandidates(parent){
  const cache=v18EnsureIndexes().calcByParent;
  if(!__v18IndexCache.calcCandidatesCache)__v18IndexCache.calcCandidatesCache=new Map();
  if(__v18IndexCache.calcCandidatesCache.has(parent))return __v18IndexCache.calcCandidatesCache.get(parent);
  const defs=[];
  const roles=[...new Set((cache.get(parent)||[]).map(c=>c.role))];
  for(const role of roles){
    const arr=(state.calculations||[]).filter(c=>c.role===role);for(let i=0;i<arr.length;i++){
      const p=arr[i],pq=`${p.prefix}:${p.name}`;if(pq!==parent)continue;const d=Number(p.depth);if(!Number.isFinite(d))continue;const children=[];
      for(let j=i+1;j<arr.length;j++){const x=arr[j],xd=Number(x.depth);if(!Number.isFinite(xd))continue;if(xd<=d)break;if(xd===d+1)children.push({q:`${x.prefix}:${x.name}`,prefix:x.prefix,name:x.name,label:x.label,weight:Number.isFinite(Number(x.weight))?Number(x.weight):1,depth:xd,role,sourceIndex:j});}
      if(children.length)defs.push({id:`${role}|${i}`,role,parent,sourceIndex:i,children});
    }
  }
  const uniq=new Map();for(const d of defs){const key=`${d.role}|${d.children.map(c=>`${c.q}:${c.weight}`).join(',')}`;if(!uniq.has(key))uniq.set(key,d);}const out=[...uniq.values()];__v18IndexCache.calcCandidatesCache.set(parent,out);return out;
}
function calculationMethodForKind(kind='current'){const v=kind==='prior'?(state.prior?.[V18_C?.cashflow]||''):'';return String(kind==='prior'?v:(state.profile?.cashFlowMethod||state.values?.[V18_C?.cashflow]||'')).trim();}
function preferredCalculationCandidate(parent,kind='current'){const candidates=calculationCandidates(parent);if(!candidates.length)return null;const o=state.calculationOverrides?.[parent];const overrideId=o?.id||'';let byOverride=overrideId?candidates.find(c=>c.id===overrideId):null;if(!byOverride&&o?.role)byOverride=candidates.find(c=>c.role===o.role);if(byOverride){const allowed=new Map(byOverride.children.map(c=>[c.q,c]));const custom=Array.isArray(o.children)?o.children.map(x=>({q:x.q,weight:Number.isFinite(Number(x.weight))?Number(x.weight):1})).filter(x=>allowed.has(x.q)).map(x=>({...allowed.get(x.q),weight:x.weight})):null;return custom?{...byOverride,children:custom}:byOverride;}
  const method=calculationMethodForKind(kind);const cashRole=candidates.filter(c=>/Cash flow statement, (direct|indirect)/i.test(c.role));if(cashRole.length){const wants=/direct/i.test(method)&&!/indirect/i.test(method)?'direct':/indirect/i.test(method)?'indirect':'';const match=wants?cashRole.find(c=>new RegExp(`Cash flow statement, ${wants}`,'i').test(c.role)):null;if(match)return match;}
  const nonCashNotes=candidates.filter(c=>!/Notes - Cash flow statements/i.test(c.role));const pool=nonCashNotes.length?nonCashNotes:candidates;return pool.slice().sort((a,b)=>calcRoleIndex(a.role)-calcRoleIndex(b.role)||b.children.length-a.children.length||a.sourceIndex-b.sourceIndex)[0];}
function calculationParents(){const out=new Set();for(const c of state.calculations||[]){const q=`${c.prefix}:${c.name}`;if(preferredCalculationCandidate(q,'current'))out.add(q);}return out;}
function directCalculationChildren(parent,kind='current'){return preferredCalculationCandidate(parent,kind)?.children?.map(c=>({...c,prefix:c.q.split(':')[0],name:c.q.split(':').slice(1).join(':')}))||[];}
function isDisabledConcept(k,e,role,isPrior=false){const group=applicabilityGroup(e);if(group){const bool=state.elements.find(x=>isBooleanConcept(x)&&applicabilityGroup(x)===group);if(bool){const bv=isPrior?state.prior[`${bool.prefix}:${bool.name}`]:state.values[`${bool.prefix}:${bool.name}`];if(String(bv).toLowerCase()==='false'&&`${bool.prefix}:${bool.name}`!==k)return true;}}if(!state.manualParentsEnabled){if(calculationParents().has(k))return true;for(const l of state.links||[])if(l.target===k)return true;}const roles=sharedRoles(k);if(roles.length>1&&!/notes?/i.test(role||'')&&roles.some(r=>/notes?/i.test(r)))return true;return false}
function scaleFactor(){return ({Actuals:1,Thousands:1000,Lakhs:100000,Millions:1000000,Crores:10000000,Billions:1000000000}[state.profile.inputScale||'Actuals']||1);}
function isMonetaryElement(e){return !!e&&/xbrli:monetaryItemType/i.test(String(e.type||''));}
function scaledForEntry(v,e){if(v==null||v==='')return '';if(e&&!isMonetaryElement(e))return String(v);const n=Number(v);if(!Number.isFinite(n)||scaleFactor()===1)return String(v);return String(Number((n/scaleFactor()).toFixed(6)));}
function valueForXml(v,e){if(v==null||v==='')return '';const n=Number(v);if(!Number.isFinite(n)||!isMonetaryElement(e)||scaleFactor()===1)return String(v);return String(Number((n*scaleFactor()).toFixed(6)));}
function decimalsForFact(f){
  if(f?.sourceDecimals!==undefined&&String(f.sourceDecimals)!=='')return String(f.sourceDecimals);
  const v=String(f?.value??'').trim(); if(!v||!/^-?\d+(?:\.\d+)?$/.test(v))return null;
  if(!isMonetaryElement(f?.element))return decimalsFor(v);
  const frac=(v.split('.')[1]||'').length;
  const factor=scaleFactor(), exp=factor>0?Math.round(Math.log10(factor)):0;
  return String(frac-exp);
}
function dimensionalConfigs(role){const defs=(state.definitions||[]).filter(r=>r.role===role);const axes=defs.filter(r=>String(r.name).endsWith('Axis'));if(!axes.length)return [];const axisConfigs=axes.map(a=>{const ad=Number(a.depth)||0;const idx=defs.indexOf(a);let members=[];for(let i=idx+1;i<defs.length;i++){const r=defs[i],d=Number(r.depth)||0;if(i>idx&&String(r.name).endsWith('Axis')&&d<=ad)break;if(String(r.name).endsWith('Member')&&d>ad)members.push(r);}return {q:`${a.prefix}:${a.name}`,label:a.label||a.name,members:[...new Map(members.map(m=>[`${m.prefix}:${m.name}`,m])).values()]};});const prs=(state.presentation||[]).filter(r=>r.role===role);const lineItems=[];for(const r of prs){const e=state.elements.find(x=>x.prefix===r.prefix&&x.name===r.name);if(!e||e.abstract==='true')continue;if(String(r.name).endsWith('Axis')||String(r.name).endsWith('Member')||/Table(?:\d+)?NotAll$/.test(r.name)||String(r.name).endsWith('LineItems'))continue;lineItems.push({q:`${r.prefix}:${r.name}`,label:r.label||e.label||r.name,element:e});}return [{role,axes:axisConfigs,lineItems:[...new Map(lineItems.map(x=>[x.q,x])).values()]}];}
function allDimensionalRoles(){return [...new Set((state.definitions||[]).filter(r=>String(r.name).endsWith('Axis')).map(r=>r.role))];}
function dimRows(role){state.dimTables=state.dimTables||{};state.dimTables[role]=Array.isArray(state.dimTables[role])?state.dimTables[role]:[];return state.dimTables[role];}
function dimOccurrenceKey(row){return JSON.stringify((row.dimensions||[]).slice().sort((a,b)=>a.axis.localeCompare(b.axis)).map(d=>[d.axis,d.member]));}
function findRoleForDimFact(concept,dims){for(const role of allDimensionalRoles()){const defs=state.definitions.filter(r=>r.role===role).map(r=>`${r.prefix}:${r.name}`);if(defs.includes(concept)&&dims.every(d=>defs.includes(d.axis)&&defs.includes(d.member)))return role;}return null;}
function ensureDimRow(role,dims,kind='prior'){const rows=dimRows(role);const sig=dimOccurrenceKey({dimensions:dims});let row=rows.find(r=>dimOccurrenceKey(r)===sig);if(!row){row={id:'R'+(rows.length+1),dimensions:dims.map(d=>({axis:d.axis,member:d.member})),current:{},prior:{}};rows.push(row);}row[kind]=row[kind]||{};return row;}
function saveDimRow(role,index){const rows=dimRows(role);const row=rows[index];if(!row)return;const lineEl=document.querySelector(`[data-dimrow=\"${CSS.escape(role)}:${index}\"][data-target=\"lineitem\"]`);const newConcept=lineEl?.value||row._lineItem||'';const curEl=document.querySelector(`[data-dimrow=\"${CSS.escape(role)}:${index}\"][data-target=\"current\"]`);const priorEl=document.querySelector(`[data-dimrow=\"${CSS.escape(role)}:${index}\"][data-target=\"prior\"]`);row._lineItem=newConcept;row.current={};row.prior={};if(newConcept){if(curEl?.value)row.current[newConcept]=curEl.value;if(priorEl?.value)row.prior[newConcept]=priorEl.value;}row.dimensions=row.dimensions||[];document.querySelectorAll(`[data-dimrow=\"${CSS.escape(role)}:${index}\"][data-target=\"dimension\"]`).forEach(el=>{const axis=el.dataset.axis;const d=row.dimensions.find(x=>x.axis===axis);if(d)d.member=el.value;else row.dimensions.push({axis,member:el.value});});markDirty();render();toast('Dimensional table row saved.');}
function addDimRow(role){const cfg=dimensionalConfigs(role)[0];if(!cfg)return;const dims=cfg.axes.map(a=>({axis:a.q,member:''}));dimRows(role).push({id:'R'+(dimRows(role).length+1),dimensions:dims,current:{},prior:{}});markDirty();render();}
function deleteDimRow(role,index){dimRows(role).splice(index,1);markDirty();render();}
function dimensionalEditor(role){const cfg=dimensionalConfigs(role)[0];if(!cfg)return '';const rows=dimRows(role);if(!rows.length)addDimRowSilent(role,cfg);const rs=dimRows(role);const cols=cfg.axes.map(a=>`<th>${esc(a.label)}<div class="hint">Member</div></th>`).join('');return `<div class="card dim-card"><div class="toolbar"><div class="grow"><b>Dimensional table editor</b><div class="hint">Taxonomy-controlled axis/member dropdowns. Add as many member combinations as needed. Values are stored as separate XBRL facts with generated dimension-qualified contexts.</div></div><button class="smallbtn primary" data-dim-add="${esc(role)}">Add row</button><button class="smallbtn" data-dim-save-all="${esc(role)}">Save table</button></div><div class="table-wrap"><table class="data-table dim-table"><thead><tr><th>Line item</th>${cols}<th>Current (${esc(state.profile.inputScale||'Actuals')})</th><th>Previous (${esc(state.profile.inputScale||'Actuals')})</th><th></th></tr></thead><tbody>${rs.map((row,i)=>{const lineKeys=[...new Set([...Object.keys(row.current||{}),...Object.keys(row.prior||{})])];const q=row._lineItem||lineKeys[0]||cfg.lineItems[0]?.q||'';const cells=cfg.axes.map(a=>{const mem=row.dimensions?.find(d=>d.axis===a.q)?.member||'';return `<td><select data-dimrow="${esc(role)}:${i}" data-target="dimension" data-axis="${esc(a.q)}"><option value="">Select…</option>${a.members.map(m=>{const mq=`${m.prefix}:${m.name}`;return `<option value="${esc(mq)}" ${mq===mem?'selected':''}>${esc(m.label||m.name)}</option>`}).join('')}</select></td>`}).join('');return `<tr><td><select data-dimrow="${esc(role)}:${i}" data-target="lineitem" data-concept="${esc(q)}"><option value="">Select line item…</option>${cfg.lineItems.map(li=>`<option value="${esc(li.q)}" ${li.q===q?'selected':''}>${esc(li.label)}</option>`).join('')}</select><div class="hint code">${esc(q)}</div></td>${cells}<td><input data-dimrow="${esc(role)}:${i}" data-target="current" data-concept="${esc(q)}" value="${esc(row.current?.[q]??'')}" placeholder="Enter value"></td><td><input data-dimrow="${esc(role)}:${i}" data-target="prior" data-concept="${esc(q)}" value="${esc(row.prior?.[q]??'')}" placeholder="Previous"></td><td><button class="smallbtn" data-dim-save="${esc(role)}:${i}">Save</button> <button class="smallbtn" data-dim-delete="${esc(role)}:${i}">Delete</button></td></tr>`}).join('')}</tbody></table></div><div class="hint">Line items available: ${cfg.lineItems.length}. Axes: ${cfg.axes.length}. Imported dimensional occurrences are retained here rather than collapsed into one flat prior-year cell.</div></div>`}
function addDimRowSilent(role,cfg){if(!dimRows(role).length)dimRows(role).push({id:'R1',dimensions:cfg.axes.map(a=>({axis:a.q,member:''})),current:{},prior:{}});}
function factRow(r,i,role){const k=`${r.prefix}:${r.name}`;const e=v18Element(k)||{};const val=state.values[k]??'';const prior=state.prior[k]??'';const dimensional=conceptHasDimensionalTable(k,role)||conceptHasAnyDimensionalTable(k)||(state.priorFacts?.[k]||[]).some(o=>o.context?.dimensions?.length)||(state.factOccurrences?.prior||[]).some(o=>o.concept===k&&o.context?.dimensions?.length);const dimmed=dimensional;const pad=Math.min(Number(r.depth||0),8)*14;const isAbs=e.abstract==='true';const bad=state.cellIssues?.[k];const disabled=isDisabledConcept(k,e,role,false), priorDisabled=isDisabledConcept(k,e,role,true);const calc=preferredCalculationCandidate(k,'current');const calcHint=disabled&&calc?`<div class="calc-hint"><b>Auto total:</b> ${esc(calc.children.map(c=>`${c.label||c.q}${Number(c.weight)===-1?' (subtract)':''}`).join(' + '))}. Applies to Current &amp; Previous Year; edit in Tag / details.</div>`:'';return `<tr data-concept-row="${esc(k)}"><td><div style="padding-left:${pad}px" class="tree-label">${esc(r.label||e.label||r.name)}</div><div class="hint code">${esc(k)}</div>${e.comment?`<div class="hint">${esc(e.comment)}</div>`:''}${dimmed?`<div class="link-badge">Dimensional disclosure • <button class="smallbtn" data-v15-open="${esc(v15Pack(role,(v15TableForConcept(role,k)||{}).id||''))}">Open dimensional table</button></div>`:''}${calcHint}${sharedRoles(k).length>1?`<div class="link-badge">Linked across: ${esc(sharedRoles(k).slice(0,3).join(' • '))}</div>`:''}${disabled?`<div class="hint">Auto-linked / disabled</div>`:''}</td><td>${isAbs?'<span class="muted">Heading</span>':(dimensional?`<button class="smallbtn primary" data-v15-open="${esc(v15Pack(role,(v15TableForConcept(role,k)||{}).id||''))}">See dimensional table</button>`:factInput(k,e,val,bad,disabled))}</td><td>${isAbs?'<span class="muted">—</span>':(dimensional?`<button class="smallbtn" data-v15-open="${esc(v15Pack(role,(v15TableForConcept(role,k)||{}).id||''))}">See dimensional table</button>`:(isRichTextConcept(e)?richTextCell(`prior:${k}`,state.priorRichText?.[k]||prior,bad,priorDisabled):isBooleanConcept(e)?yesNoCell(`prior:${k}`,prior,bad,priorDisabled):`<input class="auto-grow prior-cell${priorDisabled?' linked-disabled':''}" value="${esc(prior)}" data-prior="${esc(k)}" placeholder="Prior-year value" ${priorDisabled?'disabled':''}>`))}</td><td><span class="tag">${esc((e.type||'').replace(/^.*:/,''))}</span>${dimensional?'<span class="tag">Dimensional table</span>':''}${isBooleanConcept(e)?'<span class="tag yesno-tag">Yes / No</span>':''}${isRichTextConcept(e)?'<span class="tag">Rich text</span>':''}${e.periodType?`<span class="tag">${e.periodType}</span>`:''}${e.balance?`<span class="tag">${e.balance}</span>`:''}</td><td><button class="smallbtn" data-tag="${esc(k)}">Tag / details</button></td></tr>`}
function taggingView(){return `<div class="card"><div class="toolbar"><input class="search grow" id="taxonomySearch" placeholder="Search label, concept name, type or comment..."><span class="status">${state.elements.length.toLocaleString()} concepts</span></div><div id="searchResults"></div></div>`}
function editContextDimensions(i){const c=state.contexts[i];const axes=state.elements.filter(e=>e.name.endsWith('Axis')).sort((a,b)=>a.name.localeCompare(b.name));const members=state.elements.filter(e=>e.name.endsWith('Member')).sort((a,b)=>a.name.localeCompare(b.name));modal(`<div class="modal-head"><div><h2>Edit dimensions for ${esc(c.id)}</h2><div class="hint">Use only taxonomy-defined axes and members. Default members are not emitted explicitly.</div></div><button class="close" onclick="closeModal()">Close</button></div><div class="grid cols2"><div class="field"><label>Axis</label><select id="ctxAxis">${axes.map(a=>`<option value="${esc(a.prefix+':'+a.name)}">${esc(a.label||a.name)}</option>`).join('')}</select></div><div class="field"><label>Member</label><select id="ctxMember">${members.map(m=>`<option value="${esc(m.prefix+':'+m.name)}">${esc(m.label||m.name)}</option>`).join('')}</select></div></div><div class="toolbar"><button class="smallbtn primary" onclick="saveContextDimension(${i})">Add / replace dimension</button><button class="smallbtn" onclick="closeModal()">Cancel</button></div><div class="card" style="box-shadow:none"><h3>Current dimensions</h3>${(c.dimensions||[]).map((d,j)=>`<div class="rule"><span class="code">${esc(d.axis)}</span> = <span class="code">${esc(d.member)}</span> <button class="smallbtn" onclick="removeContextDimension(${i},${j})">Remove</button></div>`).join('')||'<p class="hint">None.</p>'}</div>`)}
function saveContextDimension(i){const axis=$('ctxAxis')?.value,member=$('ctxMember')?.value;if(!axis||!member)return;state.contexts[i].dimensions=state.contexts[i].dimensions||[];state.contexts[i].dimensions=state.contexts[i].dimensions.filter(d=>d.axis!==axis);state.contexts[i].dimensions.push({axis,member});markDirty();editContextDimensions(i);}
function removeContextDimension(i,j){state.contexts[i].dimensions.splice(j,1);markDirty();editContextDimensions(i);}
window.editContextDimensions=editContextDimensions;window.saveContextDimension=saveContextDimension;window.removeContextDimension=removeContextDimension;
function contextsView(){return `<div class="card"><div class="toolbar"><b>Contexts</b><button class="smallbtn primary" data-action="addContext">Add context</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>ID</th><th>Entity / scheme</th><th>Start</th><th>End</th><th>Instant</th><th>Dimensions</th></tr></thead><tbody>${state.contexts.map((c,i)=>`<tr><td><input data-context="${i}" data-field="id" value="${esc(c.id)}"></td><td><input data-context="${i}" data-field="entity" value="${esc(c.entity)}"><div class="hint">${esc(c.scheme)}</div></td><td><input data-context="${i}" data-field="start" type="date" value="${esc(c.start)}"></td><td><input data-context="${i}" data-field="end" type="date" value="${esc(c.end)}"></td><td><input data-context="${i}" data-field="instant" type="date" value="${esc(c.instant)}"></td><td>${(c.dimensions||[]).map(d=>`<span class="tag">${esc(d.axis)}=${esc(d.member)}</span>`).join('')||'<span class="muted">None</span>'}<button class="smallbtn" onclick="editContextDimensions(${i})">Edit</button></td></tr>`).join('')}</tbody></table></div></div><div class="card"><div class="toolbar"><b>Units</b><button class="smallbtn primary" data-action="addUnit">Add unit</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>ID</th><th>Measure</th></tr></thead><tbody>${state.units.map((u,i)=>`<tr><td><input data-unit="${i}" data-field="id" value="${esc(u.id)}"></td><td><input data-unit="${i}" data-field="measure" value="${esc(u.measure)}"></td></tr>`).join('')}</tbody></table></div></div>`}
function dimensionsView(){const axes=state.elements.filter(e=>e.name.endsWith('Axis'));const members=state.elements.filter(e=>e.name.endsWith('Member'));return `<div class="card"><h2>Taxonomy dimensions</h2><div class="grid cols2"><div><div class="toolbar"><b>Axes (${axes.length})</b></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Axis</th><th>Label</th></tr></thead><tbody>${axes.slice(0,160).map(a=>`<tr><td class="code">${a.prefix}:${a.name}</td><td>${esc(a.label)}</td></tr>`).join('')}</tbody></table></div></div><div><div class="toolbar"><b>Members (${members.length})</b></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Member</th><th>Label</th></tr></thead><tbody>${members.slice(0,260).map(m=>`<tr><td class="code">${m.prefix}:${m.name}</td><td>${esc(m.label)}</td></tr>`).join('')}</tbody></table></div></div></div></div>`}
function footnotesView(){return `<div class="card"><div class="toolbar"><b>Footnotes</b><button class="smallbtn primary" data-action="addFootnote">Add footnote</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Fact / concept</th><th>Footnote text</th><th>Language</th></tr></thead><tbody>${state.footnotes.map((f,i)=>`<tr><td><input data-foot="${i}" data-field="fact" value="${esc(f.fact)}"></td><td><textarea data-foot="${i}" data-field="text">${esc(f.text)}</textarea></td><td><input data-foot="${i}" data-field="lang" value="${esc(f.lang||'en-IN')}"></td></tr>`).join('')||'<tr><td colspan="3" class="empty">No footnotes yet.</td></tr>'}</tbody></table></div></div>`}
function rulesView(){const generic=state.rules['Generic rules']||[];const er=state.rules['Specific rules for elements']||[];return `<div class="card"><h2>Generic business rules</h2>${generic.slice(2).filter(r=>r[1]).map((r,i)=>`<div class="rule"><b>Rule ${esc(r[0]||i+1)}</b><p>${esc(r[1])}</p></div>`).join('')}</div><div class="card"><h2>Element-specific rules</h2><div class="toolbar"><input class="search grow" id="ruleSearch" placeholder="Search element or rule text..."></div><div id="ruleResults">${ruleResults(er,'')}</div></div>`}
function ruleResults(rows,q){q=q.toLowerCase();return rows.filter(r=>(String(r[0]||'')+' '+String(r[1]||'')).toLowerCase().includes(q)).slice(0,100).map(r=>`<div class="rule"><b class="code">${esc(r[0])}</b><p>${esc(r[1]||'No specific rule recorded.')}</p></div>`).join('')||'<div class="empty">No matching rules.</div>'}
function errorsView(){return `<div class="card"><div class="toolbar"><b>Pre-scrutiny results</b><button class="smallbtn primary" data-action="prescrutiny">Run all checks</button><button class="smallbtn" data-action="exportErrors">Excel-compatible</button><button class="smallbtn" data-action="exportCsv">CSV</button></div><div class="dashboard"><div class="metric"><b class="danger">${state.errors.length}</b><span>Errors</span></div><div class="metric"><b class="warning">${state.warnings.length}</b><span>Warnings</span></div><div class="metric"><b>${Object.keys(state.values).length}</b><span>Current facts</span></div><div class="metric"><b>${Object.keys(state.prior).length}</b><span>Prior facts</span></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Severity</th><th>Rule / check</th><th>Concept</th><th>Message</th><th>Correction</th></tr></thead><tbody>${[...state.errors.map(x=>({...x,severity:'Error'})),...state.warnings.map(x=>({...x,severity:'Warning'}))].map(x=>`<tr class="error-row" data-error="${esc(x.concept||'')}"><td class="${x.severity==='Error'?'danger':'warning'}"><b>${x.severity}</b></td><td>${esc(x.rule)}</td><td class="code">${esc(x.concept||'—')}</td><td>${esc(x.message)}</td><td>${esc(x.correction||'Review the highlighted concept.')}</td></tr>`).join('')||'<tr><td colspan="5" class="empty">No findings. Run pre-scrutiny when data is entered.</td></tr>'}</tbody></table></div></div>`}
function wire(){document.querySelectorAll('[data-bind]').forEach(el=>{el.oninput=()=>setPath(el.dataset.bind,el.value)});document.querySelectorAll('[data-fact]').forEach(el=>{el.oninput=()=>{const k=el.dataset.fact;if(k.startsWith('prior:')){state.prior[k.slice(6)]=el.value;growInput(el);clearCellIssue(k.slice(6));propagatePriorLinks(k.slice(6));autoCalculateParents('prior');markDirty();return;}state.values[k]=el.value;growInput(el);clearCellIssue(k);propagateLinks(k);autoCalculateParents('current');markDirty();}});document.querySelectorAll('[data-prior]').forEach(el=>{el.oninput=()=>{const k=el.dataset.prior;state.prior[k]=el.value;growInput(el);clearCellIssue(k);propagatePriorLinks(k);autoCalculateParents('prior');markDirty();};growInput(el)});document.querySelectorAll('[data-tag]').forEach(b=>b.onclick=()=>showTag(b.dataset.tag));document.querySelectorAll('[data-rich]').forEach(b=>b.onclick=()=>showRichTextEditor(b.dataset.rich));document.querySelectorAll('[data-context]').forEach(el=>el.oninput=()=>{state.contexts[+el.dataset.context][el.dataset.field]=el.value;markDirty()});document.querySelectorAll('[data-unit]').forEach(el=>el.oninput=()=>{state.units[+el.dataset.unit][el.dataset.field]=el.value;markDirty()});document.querySelectorAll('[data-foot]').forEach(el=>el.oninput=()=>{state.footnotes[+el.dataset.foot][el.dataset.field]=el.value;markDirty()});$('taxonomySearch')?.addEventListener('input',e=>searchTax(e.target.value));$('tabSearch')?.addEventListener('input',e=>filterTabRows(e.target.value));$('ruleSearch')?.addEventListener('input',e=>{$('ruleResults').innerHTML=ruleResults(state.rules['Specific rules for elements']||[],e.target.value)});document.querySelectorAll('[data-dimrow]').forEach(el=>{el.oninput=()=>{const [role,idx]=el.dataset.dimrow.split(':');const row=dimRows(role)[Number(idx)];if(!row)return;if(el.dataset.target==='lineitem'){row._lineItem=el.value;}else if(el.dataset.target==='dimension'){row.dimensions=row.dimensions||[];const d=row.dimensions.find(x=>x.axis===el.dataset.axis);if(d)d.member=el.value;else row.dimensions.push({axis:el.dataset.axis,member:el.value});}else{row[el.dataset.target]=row[el.dataset.target]||{};row[el.dataset.target][el.dataset.concept]=el.value;}markDirty();}});document.querySelectorAll('[data-dim-save]').forEach(b=>b.onclick=()=>{const [role,idx]=b.dataset.dimSave.split(':');saveDimRow(role,Number(idx));});document.querySelectorAll('[data-dim-delete]').forEach(b=>b.onclick=()=>{const [role,idx]=b.dataset.dimDelete.split(':');deleteDimRow(role,Number(idx));});document.querySelectorAll('[data-dim-add]').forEach(b=>b.onclick=()=>addDimRow(b.dataset.dimAdd));document.querySelectorAll('[data-dim-save-all]').forEach(b=>b.onclick=()=>{markDirty();persistNow();toast('Dimensional table saved.');});document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>actions(b.dataset.action));document.querySelectorAll('[data-error]').forEach(b=>b.onclick=()=>correctionNavigate(b.dataset.error));}
function setPath(path,val){const wasComplete=profileComplete();const p=path.split('.');let o=state;for(let i=0;i<p.length-1;i++)o=o[p[i]];o[p[p.length-1]]=val;if(path.startsWith('profile.')){state.contexts[0]=state.contexts[0]||{id:'C1',entity:'',scheme:'http://www.mca.gov.in/CIN',start:'',end:'',instant:'',dimensions:[]};if(path==='profile.cin')state.contexts[0].entity=val;if(path==='profile.fyStart')state.contexts[0].start=val;if(path==='profile.fyEnd')state.contexts[0].end=val;}markDirty();if(!wasComplete&&profileComplete()){renderNav();renderTabs();} }
function filterTabRows(q){q=String(q||'').trim().toLowerCase();document.querySelectorAll('[data-concept-row]').forEach(tr=>{tr.style.display=!q||tr.textContent.toLowerCase().includes(q)?'':'none';});}
function autosizeInputs(){document.querySelectorAll('input.auto-grow').forEach(growInput)}
function autoCalculateParents(kind='current'){const target=kind==='prior'?state.prior:state.values;if(kind==='prior')state.priorCalculated=state.priorCalculated||{};const parents=[...calculationParents()];for(let pass=0;pass<parents.length+2;pass++){let changed=false;for(const pk of parents){const def=preferredCalculationCandidate(pk,kind);const children=def?.children||[];if(!children.length)continue;let hasInput=false,sum=0;for(const c of children){const v=Number(target[c.q]);if(Number.isFinite(v)){hasInput=true;const w=Number(c.weight);sum+=v*(Number.isFinite(w)?w:1);}}if(!hasInput)continue;const next=String(Number(sum.toFixed(2)));if(kind==='prior'){state.priorCalculated[pk]=next;if(!state._v18PriorImportedFacts?.[pk]&&target[pk]!==next){target[pk]=next;changed=true;}}else if(target[pk]!==next){target[pk]=next;changed=true;}}if(!changed)break;}for(const l of state.links||[]){const v=target[l.source];if(v!==undefined&&target[l.target]!==v)target[l.target]=v;}}
function propagateLinks(source){if(state.manualParentsEnabled)return;const seen=new Set([source]),q=[source];while(q.length){const src=q.shift();for(const l of state.links||[]){if(l.source!==src||seen.has(l.target))continue;if(state.values[src]!==undefined){state.values[l.target]=state.values[src];seen.add(l.target);q.push(l.target);}}}autoCalculateParents('current');}
function propagatePriorLinks(source){if(state.manualParentsEnabled)return;const seen=new Set([source]),q=[source];while(q.length){const src=q.shift();for(const l of state.links||[]){if(l.source!==src||seen.has(l.target))continue;if(state.prior[src]!==undefined){state.prior[l.target]=state.prior[src];seen.add(l.target);q.push(l.target);}}}autoCalculateParents('prior');}
function synchronizeAll(){if(!state.manualParentsEnabled){autoCalculateParents('current');autoCalculateParents('prior');}}
function updateCounts(){$('errorCount').textContent=state.errors.length;$('warningCount').textContent=state.warnings.length;}
let __persistTimer=null;const IDB_NAME='mcaCniXbrlWorkbench',IDB_STORE='projects';
function projectSnapshot(){const x=JSON.parse(JSON.stringify(state));delete x.meta;delete x.elements;delete x.presentation;delete x.calculations;delete x.definitions;delete x.elrs;delete x.rules;return x;}
function openProjectDb(){return new Promise((resolve,reject)=>{if(!('indexedDB' in window))return reject(new Error('IndexedDB unavailable'));const r=indexedDB.open(IDB_NAME,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(IDB_STORE))r.result.createObjectStore(IDB_STORE);};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||new Error('IndexedDB open failed'));});}
async function persistFallback(snapshot){try{const db=await openProjectDb();await new Promise((resolve,reject)=>{const tx=db.transaction(IDB_STORE,'readwrite');tx.objectStore(IDB_STORE).put(snapshot,PROJECT_KEY);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||new Error('IndexedDB write failed'));});db.close();return true;}catch{return false;}}
async function restoreFallback(){try{const db=await openProjectDb();const data=await new Promise((resolve,reject)=>{const tx=db.transaction(IDB_STORE,'readonly');const r=tx.objectStore(IDB_STORE).get(PROJECT_KEY);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error);});db.close();return data;}catch{return null;}}
function persistNow(){const snapshot=projectSnapshot();try{localStorage.setItem(PROJECT_KEY,JSON.stringify(snapshot));state.dirty=false;const el=$('saveState');if(el)el.textContent='Saved';return Promise.resolve(true);}catch(e){return persistFallback(snapshot).then(ok=>{state.dirty=false;const el=$('saveState');if(el)el.textContent=ok?'Saved locally':'Save unavailable';if(!ok)toast('Browser storage is unavailable. Use Save project file for a portable backup.');return ok;});}}
function markDirty(){state.dirty=true;const el=$('saveState');if(el)el.textContent='Saving…';clearTimeout(__persistTimer);__persistTimer=setTimeout(()=>persistNow(),350);}
function showBusy(title,detail='Please wait…'){const o=$('busyOverlay');if(!o)return;const h=o.querySelector('[data-busy-title]'),d=o.querySelector('[data-busy-detail]'),t=o.querySelector('[data-busy-time]');if(h)h.textContent=title;if(d)d.textContent=detail;o.hidden=false;document.body.classList.add('busy-active');const started=Date.now();clearInterval(window.__busyTimer);window.__busyTimer=setInterval(()=>{if(t){const sec=Math.floor((Date.now()-started)/1000);t.textContent=`Elapsed ${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;}},250);}
function hideBusy(){const o=$('busyOverlay');if(o)o.hidden=true;document.body.classList.remove('busy-active');clearInterval(window.__busyTimer);window.__busyTimer=null;}

function correctionNavigate(k){if(!k)return;state.active='filing';const idx=state.presentation.findIndex(x=>`${x.prefix}:${x.name}`===k);if(idx>=0){const role=state.presentation[idx]?.role;const sec=state.elrs.findIndex(e=>e.name===role);if(sec>=0)state.section=sec;}renderNav();renderTabs();render();setTimeout(()=>{const row=document.querySelector(`[data-concept-row=\"${CSS.escape(k)}\"]`);row?.scrollIntoView({block:'center',behavior:'smooth'});},40);toast('Correction item opened.');}
function openMcaLookup(){const cin=String(state.profile.cin||'').trim().toUpperCase();const din=String(state.profile.din||'').trim();const cinOk=!cin||validCin(cin);const dinOk=!din||validDin(din);modal(`<div class="modal-head"><div><h2>MCA master-data verification</h2><div class="hint">No credentials, CAPTCHA or anti-bot control is bypassed.</div></div><button class="close" onclick="closeModal()">Close</button></div><div class="card" style="box-shadow:none"><p><b>CIN:</b> ${esc(cin||'not entered')} — ${cinOk?'<span class="success">format valid</span>':'<span class="error-text">invalid format</span>'}</p><p><b>DIN:</b> ${esc(din||'not entered')} — ${dinOk?'<span class="success">format valid / not entered</span>':'<span class="error-text">invalid format</span>'}</p><p>The official MCA portal provides Master Data services for company and director information. A static GitHub Pages application should not scrape or proxy those services because the current MCA workflow can require authenticated sessions/CAPTCHA. The safe V21 behavior is therefore local format validation plus a direct link to the official MCA portal; company name is never silently overwritten from an unverified third-party source.</p></div><div class="modal-actions"><a class="smallbtn primary" href="https://www.mca.gov.in/" target="_blank" rel="noopener">Open MCA portal</a><button class="smallbtn" onclick="closeModal()">Close</button></div>`)}
function baseActions(a){if(a==='newFiling'){startNewFiling();return}if(a==='toggleParents'){state.manualParentsEnabled=!state.manualParentsEnabled;markDirty();render();toast(state.manualParentsEnabled?'Parent/manual override enabled.':'Parent auto-population restored.');return}if(a==='tabcheck'){if(!requireProfile())return;runTabChecks(state.elrs[state.section]?.name);return}if(a==='prescrutiny'){runAllChecksPopup();return}if(a==='exportCsv'){exportErrors('csv');return}if(a==='exportErrors'){exportErrors('xls');return}if(a==='addContext'){state.contexts.push({id:'C'+(state.contexts.length+1),entity:state.profile.cin,scheme:MCA_CIN_SCHEME,start:state.profile.fyStart,end:state.profile.fyEnd,instant:'',dimensions:[]});markDirty();render();return}if(a==='addUnit'){state.units.push({id:'U'+(state.units.length+1),measure:'iso4217:INR'});markDirty();render();return}if(a==='addFootnote'){state.footnotes.push({fact:'',text:'',lang:'en'});markDirty();render();return}if(a==='explainXbrl'){explainXbrl();return}if(a==='mcaCompanyLookup'){openMcaLookup();return}if(a==='selectCashFlowMethod'){state.active='dashboard';renderNav();renderTabs();render();return}}
/* V12 MCA C&I compliance engine and deterministic XBRL helpers. */
const MCA_SCHEMA_REF='https://www.mca.gov.in/V3XBRL/2016/07/26/Taxonomy/CnI/in-ci-ent-2016-03-31.xsd';
const MCA_CIN_SCHEME='http://www.mca.gov.in/CIN';
const XBRL_NS='http://www.xbrl.org/2003/instance';
const LINK_NS='http://www.xbrl.org/2003/linkbase';
const XLINK_NS='http://www.w3.org/1999/xlink';
const XBRLDI_NS='http://xbrl.org/2006/xbrldi';
const XML_NS='http://www.w3.org/XML/1998/namespace';
const TAX_NS={
  'in-gaap':'http://www.icai.org/xbrl/taxonomy/2016-03-31/in-gaap',
  'in-ca':'http://www.icai.org/xbrl/taxonomy/2016-03-31/in-ca'
};
const MCA_HTML_TAGS=new Set(['div','span','p','br','table','td','tr','thead','tfoot','tbody','th','col','colgroup']);
const MCA_HTML_CLASSES=new Set(['header1','header2','header3','header4','header5','bordered','unbordered','tableHeader','tableRow','tableRowLabel','tableRowValue','normalText','noteText1','noteText2','noteText3','noteText4','numericValue','nonNumericValue','highlightedText1','highlightedText2','highlightedText3','highlightedText4']);
const MCA_HTML_ATTRS=new Set(['class','colspan','rowspan','align']);
function validCin(v){return /^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/.test(String(v||'').trim().toUpperCase());}
function validDin(v){return /^\d{8}$/.test(String(v||'').trim());}
function validPan(v){return /^[A-Z]{5}\d{4}[A-Z]$/.test(String(v||'').trim().toUpperCase());}
function nonblank(v){return String(v??'').trim()!=='';}
function num(v){const n=Number(String(v??'').replace(/,/g,''));return Number.isFinite(n)?n:null;}
function conceptNameFromText(text){const s=String(text||'');const names=new Set(state.elements.map(e=>e.name));const out=[];const quoted=[...s.matchAll(/["']([A-Za-z][A-Za-z0-9_]*)["']/g)].map(m=>m[1]);for(const n of quoted)if(names.has(n)&&!out.includes(n))out.push(n);for(const n of names){if(out.includes(n))continue;if(new RegExp('\\b'+n.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')+'\\b','i').test(s)&&n.length>8)out.push(n);}return out;}
function getConceptKey(name){if(!name)return '';const raw=String(name).trim().replace(/^['"]|['"]$/g,'').replace(/^in-(?:gaap|ca):/i,'');const e=state.elements.find(x=>x.name===raw);return e?`${e.prefix}:${e.name}`:'';}
function getValue(name,kind='current'){const k=getConceptKey(name);if(!k)return '';const src=kind==='prior'?state.prior:state.values;return src[k]??'';}
function conditionValue(name,kind='current'){const v=getValue(name,kind);return {raw:v,num:num(v),text:String(v??'').trim(),yes:/^(true|yes)$/i.test(String(v??'')),no:/^(false|no)$/i.test(String(v??'')),entered:nonblank(v)};}
function conditionSatisfied(text,kind='current'){
  const s=String(text||'');const names=conceptNameFromText(s);if(!names.length)return null;
  let result=true,found=false;
  for(const name of names){const c=conditionValue(name,kind);const l=s.toLowerCase();let local=null;
    const qEsc=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    if(new RegExp(qEsc+'[^.\n;]*\\b(is|selected as|selected in|equals?)\\s+yes\\b','i').test(s)||new RegExp(qEsc+'[^.\n;]*\\bis\\s+\'yes\'','i').test(s))local=c.yes;
    else if(new RegExp(qEsc+'[^.\n;]*\\b(is|selected as|selected in|equals?)\\s+no\\b','i').test(s))local=c.no;
    else if(new RegExp(qEsc+'[^.\n;]*\\b(is|has|when|if)\\s+entered\\b','i').test(s)||new RegExp('value[^.\n;]*\\b'+qEsc+'\\b[^.\n;]*\\bentered\\b','i').test(s))local=c.entered;
    else if(new RegExp(qEsc+'[^.\n;]*\\b(greater than|more than)\\s+zero\\b','i').test(s)||new RegExp(qEsc+'[^.\n;]*\\b(other than|not equal to)\\s+zero\\b','i').test(s))local=c.num!==null&&c.num>0;
    else if(new RegExp(qEsc+'[^.\n;]*\\b(equal to|equals)\\s+zero\\b','i').test(s))local=c.num!==null&&Math.abs(c.num)<1e-9;
    else if(new RegExp(qEsc+'[^.\n;]*\\bgreater than\\s+DATE\\b','i').test(s))local=c.entered;
    else if(/standalone financial|standalone instance|stand alone instance/i.test(s)&&name==='NatureOfReportStandaloneConsolidated')local=/standalone/i.test(c.text);
    else if(/consolidated financial statement|consolidated instance/i.test(s)&&name==='NatureOfReportStandaloneConsolidated')local=/consolidated/i.test(c.text);
    if(local!==null){found=true;result=result&&local;}
  }
  return found?result:null;
}
function requiredCondition(rule,kind){const l=String(rule).toLowerCase();if(!/mandatory|required|shall be mandatory/.test(l))return null;
  const names=conceptNameFromText(rule);
  if(/either .* or .* (is )?mandatory/i.test(rule)&&names.length>=3){const condNames=names.slice(2);const cond=conditionSatisfied(rule,kind);if(cond===true)return {type:'either',names:names.slice(0,2)};}
  if(names.length){const condText=rule.replace(names[0],'');const cond=conditionSatisfied(condText,kind);if(cond!==null)return {type:'conditional',condition:cond,names};}
  if(/consolidated financial statement|consolidated instance/i.test(rule))return {type:'conditional',condition:state.profile.financialStatements==='Consolidated'};
  if(/standalone financial statement|standalone instance|stand alone instance/i.test(rule))return {type:'conditional',condition:state.profile.financialStatements==='Standalone'};
  if(/current financial year/i.test(rule))return {type:'conditional',condition:kind==='current'};
  return {type:'always'};
}
function addRuleError(rule,concept,message,correction){state.errors.push({rule:'MCA business rule',concept,message,correction:correction||rule,sourceRule:rule});}
function specificRuleRows(){const raw=state.rules?.['Specific rules for elements']||[];const out=[];for(const r of raw){const el=String(r?.[0]||'').trim(),txt=String(r?.[1]||'').trim();if(!el||!txt||/^ELR\/ Element Name$/i.test(el))continue;const parts=txt.split(/\n+/).map(x=>x.trim()).filter(Boolean);for(const p of parts)out.push({element:el,rule:p});}return out;}
function elementForName(name){const k=getConceptKey(name);return state.elements.find(e=>`${e.prefix}:${e.name}`===k)||null;}
function ruleRequired(element,rule,kind='current'){
  const req=requiredCondition(rule,kind);if(!req)return false;
  if(req.type==='always')return true;if(req.type==='conditional')return req.condition===true;
  if(req.type==='either')return true;return false;
}
function baseEvaluateSpecificRules(kind='current'){
  const src=kind==='prior'?state.prior:state.values;const rows=specificRuleRows();const seen=new Set();
  for(const {element,rule} of rows){const e=elementForName(element);if(!e||e.abstract==='true')continue;const k=`${e.prefix}:${e.name}`;const value=src[k]??'';const l=rule.toLowerCase();
    const dimensionalConcept=conceptHasDimensionalTable(k);
    if(ruleRequired(element,rule,kind)&&!dimensionalConcept){
      const req=requiredCondition(rule,kind);if(req?.type==='either'){const vals=req.names.map(n=>conditionValue(n,kind).entered);if(!vals.some(Boolean))addRuleError(rule,k,'At least one of the alternatives required by this MCA rule must be entered.','Enter at least one of the required alternative fields.');}
      else if(!nonblank(value))addRuleError(rule,k,'This field is mandatory under the applicable MCA business rule.',rule);
    }
    if(nonblank(value)&&!dimensionalConcept){
      if(/valid (?:cin|corporate identity number)/i.test(rule)){if(!validCin(value))addRuleError(rule,k,'Invalid CIN format under the MCA business rule.','Enter a valid 21-character CIN.');}
      if(/valid din/i.test(rule)&&!validDin(value))addRuleError(rule,k,'Invalid DIN format under the MCA business rule.','Enter an 8-digit DIN.');
      if(/valid pan/i.test(rule)&&!validPan(value))addRuleError(rule,k,'Invalid PAN format under the MCA business rule.','Enter a valid PAN in AAAAA9999A format.');
      if(/valid country/i.test(rule)&&!countryCodeKnown(value))addRuleError(rule,k,'Country is not present in the supplied MCA country-code list.','Select a country from the MCA country list.');
      if(/greater than or equal to zero|greater than equal to zero|greater or equal to zero|greater than or eqaul to zero/i.test(rule)){const n=num(value);if(n!==null&&n<0)addRuleError(rule,k,'Value must be greater than or equal to zero under the MCA business rule.','Enter a non-negative value.');}
      if(/less than or equal to 100%|not be greater than 100%/i.test(rule)){const n=num(value);if(n!==null&&n>100)addRuleError(rule,k,'Percentage must not exceed 100%.','Enter a value from 0 to 100%.');}
      if(/less than or equal to system date/i.test(rule)){const d=new Date(value),now=new Date();if(!Number.isNaN(d.valueOf())&&d>now)addRuleError(rule,k,'Date cannot be later than the system date.',rule);}
      if(/should be unique/i.test(rule)){const vals=Object.values(src).filter(v=>nonblank(v)).map(v=>String(v).trim().toUpperCase());const cur=String(value).trim().toUpperCase();if(cur&&vals.filter(v=>v===cur).length>1)addRuleError(rule,k,'Value must be unique where this MCA rule requires uniqueness.','Enter a unique value for the relevant repeated disclosure.');}
      if(/different from cin of filing company/i.test(rule)&&String(value).trim().toUpperCase()===String(state.profile.cin).trim().toUpperCase())addRuleError(rule,k,'Value must be different from the filing company CIN.','Enter the other company\'s CIN.');
      if(/different from pan of the filing company/i.test(rule)){const pan=state.values['in-ca:PermanentAccountNumberOfEntity']||state.values['in-gaap:PermanentAccountNumberOfEntity'];if(pan&&String(value).trim().toUpperCase()===String(pan).trim().toUpperCase())addRuleError(rule,k,'Value must be different from the filing company PAN.','Enter the other party PAN.');}
      if(/valid cin.*different from cin/i.test(rule)&&!validCin(value))addRuleError(rule,k,'Invalid CIN.', 'Enter a valid CIN.');
    }
    // Pairing rules: if one of the two named concepts is entered, require the other.
    if(/mandatory if corresponding .* is entered and vice-a-versa/i.test(rule)||/mandatory.*entered.*vice-a-versa/i.test(rule)){
      const names=conceptNameFromText(rule);const others=names.filter(n=>n!==element);if(others.some(n=>conditionValue(n,kind).entered)&&!nonblank(value))addRuleError(rule,k,'This field is required because its corresponding field has been entered.','Enter the corresponding amount/value.');
      if(nonblank(value)&&others.length&&!conditionValue(others[0],kind).entered)addRuleError(rule,getConceptKey(others[0]),'This corresponding field is required when the paired field is entered.',rule);
    }
    // Simple cross-field upper/lower/equality rules.
    const names=conceptNameFromText(rule).filter(n=>n!==element);
    if(names.length){const ref=conditionValue(names[0],kind);const n=num(value);
      if(n!==null&&/less than or equal to/.test(l)&&ref.num!==null&&!/100%/.test(l)&&n>ref.num+1e-9)addRuleError(rule,k,`Value must be less than or equal to ${names[0]}.`,rule);
      if(n!==null&&/greater than or equal to/.test(l)&&ref.num!==null&&/\bto\s+['"]?\w+/i.test(rule)&&n<ref.num-1e-9)addRuleError(rule,k,`Value must be greater than or equal to ${names[0]}.`,rule);
      if(n!==null&&/should be equal to/.test(l)&&ref.num!==null&&Math.abs(n-ref.num)>0.01)addRuleError(rule,k,`Value must equal ${names[0]}.`,rule);
    }
  }
  // Special status rule for ShareCapital; no silent inference is made about company status.
  if(kind==='current'&&nonblank(src['in-gaap:ShareCapital'])&&state.profile.companyStatus){const sc=num(src['in-gaap:ShareCapital']);if(/section 8/i.test(String(state.profile.companyStatus))&&state.profile.hasShareCapital===false&&Math.abs(sc||0)>1e-9)addRuleError('ShareCapital: section 8/no-share-capital rule','in-gaap:ShareCapital','Share capital must be zero for a Section 8 company without share capital.','Review company status/share-capital applicability.');}
  return seen;
}
function countryCodeKnown(v){const rows=state.rules?.['Country Codes']||state.rules?.['Country Code']||[];const s=String(v||'').trim().toLowerCase();if(!s)return false;return rows.some(r=>r.some(c=>String(c||'').trim().toLowerCase()===s));}
function evaluateGenericRules(kind='current'){
  const src=kind==='prior'?state.prior:state.values;const monet=state.elements.filter(e=>e.type==='xbrli:monetaryItemType'&&e.abstract!=='true');
  if(state.profile.currency!=='INR'){for(const e of monet){const k=`${e.prefix}:${e.name}`;if(nonblank(src[k])&&!/DetailsOfSubsidiary/i.test(k))addRuleError('Generic Rule 9: reporting currency INR',k,'Reporting currency for financial elements must be INR except permitted subsidiary disclosures.','Set reporting currency to INR.');}}
  for(const e of monet){const k=`${e.prefix}:${e.name}`,v=src[k];if(nonblank(v)&&/\.\d{3,}/.test(String(v)))addRuleError('Generic Rule 8: maximum two decimal places',k,'Monetary values may have at most two decimal places.','Enter no more than two decimal places.');}
  if(!state.profile.firstYear&&kind==='current'){for(const e of monet){const k=`${e.prefix}:${e.name}`;if(nonblank(src[k])&&!/\[201900\]/.test(state.elrs[state.section]?.name||'')&&!nonblank(state.prior[k]))addRuleError('Generic Rule 6: current/prior financial pairing',k,'A current-year monetary fact requires the corresponding previous-year fact unless this is the first financial year or an exempt ELR.','Import or enter the corresponding previous-year value.');}}
  // Current/prior opening/closing balance equality when a clearly paired concept is named in the rule text.
  const specifics=specificRuleRows();for(const r of specifics){if(kind!=='current')continue;if(/opening balance.*closing balance of previous year|closing balance of previous year.*opening balance/i.test(r.rule)){
    const names=conceptNameFromText(r.rule);if(names.length>=2){const a=getValue(names[0],'current'),b=getValue(names[1],'prior');if(nonblank(a)&&nonblank(b)&&num(a)!==null&&num(b)!==null&&Math.abs(num(a)-num(b))>0.01)addRuleError(r.rule,getConceptKey(names[0]),'Opening balance of current year must equal closing balance of previous year under the MCA rule.',r.rule);}
  }}
}
function evaluateTaxonomyCalculations(){
  for(const c of state.calculations||[]){/* relationship integrity is checked below */}
  const byRole={};for(const c of state.calculations||[])(byRole[c.role]??=[]).push(c);
  for(const role in byRole){const arr=byRole[role];for(let i=0;i<arr.length;i++){const p=arr[i],d=Number(p.depth);if(!Number.isFinite(d))continue;const children=[];for(let j=i+1;j<arr.length;j++){const x=arr[j],xd=Number(x.depth);if(!Number.isFinite(xd))continue;if(xd<=d)break;if(xd===d+1)children.push(x);}if(!children.length)continue;const pk=`${p.prefix}:${p.name}`,pv=num(state.values[pk]);if(pv===null)continue;const nums=children.map(c=>({v:num(state.values[`${c.prefix}:${c.name}`]),w:num(c.weight)})).filter(x=>x.v!==null);if(nums.length){const sum=nums.reduce((a,x)=>a+x.v*(x.w===null?1:x.w),0);if(Math.abs(pv-sum)>0.01)addRuleError('Calculation linkbase consistency',pk,`Parent value ${state.values[pk]} does not equal the weighted child total ${Number(sum.toFixed(2))}.`,'Review the child values and taxonomy calculation weights.');}}}
}
function validateMcaHtml(html){
  const raw=String(html||'');const errors=[];if(!raw.trim())return errors;
  if(/<\?/.test(raw))errors.push('Processing instructions are not allowed.');
  if(/<\/?[A-Z]/.test(raw))errors.push('HTML tags must be lower case.');
  const entityMatches=[...raw.matchAll(/&([A-Za-z][A-Za-z0-9]+|#\d+|#x[0-9A-Fa-f]+);/g)];for(const m of entityMatches)if(!['nbsp','amp','lt','gt'].includes(m[1]))errors.push(`Entity &${m[1]}; is not permitted by the MCA HTML guidelines.`);
  const d=document.createElement('div');d.innerHTML=raw;const badTags=[];let maxTableDepth=0;
  function walk(node,tableDepth=0){for(const child of node.childNodes){if(child.nodeType===8)continue;if(child.nodeType!==1){walk(child,tableDepth);continue;}const tag=child.tagName.toLowerCase();if(!MCA_HTML_TAGS.has(tag)&&!badTags.includes(tag))badTags.push(tag);const td=tableDepth+(tag==='table'?1:0);if(td>maxTableDepth)maxTableDepth=td;for(const a of [...child.attributes]){const an=a.name.toLowerCase();if(an==='style')errors.push('The style attribute is not allowed.');else if(an==='class'){for(const cl of a.value.split(/\s+/).filter(Boolean))if(!MCA_HTML_CLASSES.has(cl))errors.push(`CSS class “${cl}” is not one of the MCA predefined classes.`);}else if(!MCA_HTML_ATTRS.has(an))errors.push(`Attribute “${a.name}” is not permitted on <${tag}>.`);}walk(child,td);}}
  walk(d,0);if(badTags.length)errors.push(`Disallowed HTML tag(s): ${badTags.map(x=>'<'+x+'>').join(', ')}.`);if(maxTableDepth>2)errors.push('More than one level of table nesting should be avoided.');return [...new Set(errors)];
}
function validateAllRichText(){const out=[];for(const [k,v] of Object.entries(state.richText||{})){const errs=validateMcaHtml(v);for(const e of errs)out.push({concept:k,message:e});}for(const [k,v] of Object.entries(state.priorRichText||{})){const errs=validateMcaHtml(v);for(const e of errs)out.push({concept:k,message:e});}for(const f of state.footnotes||[]){if(!nonblank(f.text))continue;const errs=validateMcaHtml(f.text);for(const e of errs)out.push({concept:`footnote:${f.fact||'unlinked'}`,message:e});if(f.lang&&String(f.lang).toLowerCase()!=='en')out.push({concept:`footnote:${f.fact||'unlinked'}`,message:'Footnote language must be en for this V21 filing workflow.'});}return out;}
function unitSpec(e){const t=String(e?.type||'');if(t==='xbrli:monetaryItemType')return {id:'INR',kind:'measure',measure:'iso4217:INR'};if(t==='xbrli:sharesItemType')return {id:'shares',kind:'measure',measure:'xbrli:shares'};if(t==='num:perShareItemType')return {id:'INRPerShare',kind:'divide',numerator:'iso4217:INR',denominator:'xbrli:shares'};if(t==='num:percentItemType'||t==='xbrli:decimalItemType')return {id:'pure',kind:'measure',measure:'xbrli:pure'};return null;}
function decimalsFor(v){const s=String(v??'').trim();if(!s)return null;if(!/^-?\d+(?:\.\d+)?$/.test(s))return null;const i=s.indexOf('.');return i<0?'0':String(s.length-i-1);}
function priorDates(){const s=new Date(state.profile.fyStart+'T00:00:00'),e=new Date(state.profile.fyEnd+'T00:00:00');if(Number.isNaN(s.valueOf())||Number.isNaN(e.valueOf()))return {start:'',end:''};const ps=new Date(s);ps.setFullYear(ps.getFullYear()-1);const pe=new Date(e);pe.setFullYear(pe.getFullYear()-1);return {start:ps.toISOString().slice(0,10),end:pe.toISOString().slice(0,10)};}
function contextSignature(c){return JSON.stringify({entity:c.entity||state.profile.cin,scheme:c.scheme||MCA_CIN_SCHEME,start:c.start||'',end:c.end||'',instant:c.instant||'',dimensions:(c.dimensions||[]).slice().sort((a,b)=>String(a.axis).localeCompare(String(b.axis))).map(d=>[d.axis,d.member])});}
function ensureBaseContexts(){normalizeState();const pd=priorDates();state.contexts=Array.isArray(state.contexts)?state.contexts:[];let cur=state.contexts.find(c=>c.id==='C1');if(!cur){cur={id:'C1',entity:state.profile.cin,scheme:MCA_CIN_SCHEME,start:state.profile.fyStart,end:state.profile.fyEnd,instant:'',dimensions:[]};state.contexts.unshift(cur);}else{cur.entity=state.profile.cin;cur.scheme=MCA_CIN_SCHEME;cur.start=state.profile.fyStart;cur.end=state.profile.fyEnd;cur.instant='';cur.dimensions=Array.isArray(cur.dimensions)?cur.dimensions:[];}let prev=state.contexts.find(c=>c.id==='P1');if(!prev){prev={id:'P1',entity:state.profile.cin,scheme:MCA_CIN_SCHEME,start:pd.start,end:pd.end,instant:'',dimensions:[]};state.contexts.push(prev);}else{prev.entity=state.profile.cin;prev.scheme=MCA_CIN_SCHEME;prev.start=pd.start;prev.end=pd.end;prev.instant='';prev.dimensions=Array.isArray(prev.dimensions)?prev.dimensions:[];}return {cur,prev};}
function factOccurrences(kind){state.factOccurrences=state.factOccurrences||{current:[],prior:[]};return state.factOccurrences[kind]||[];}
function ensureDimContext(kind,dims){ensureBaseContexts();const base=kind==='prior'?state.contexts.find(c=>c.id==='P1'):state.contexts.find(c=>c.id==='C1');const sig=JSON.stringify({base:kind,entity:state.profile.cin,scheme:MCA_CIN_SCHEME,start:base?.start||'',end:base?.end||'',instant:base?.instant||'',dimensions:dims.slice().sort((a,b)=>a.axis.localeCompare(b.axis)).map(d=>[d.axis,d.member])});let c=state.contexts.find(x=>x._dimSig===sig);if(!c){const id='D'+(state.contexts.filter(x=>/^D\d+$/.test(x.id||'')).length+1);c={id,entity:state.profile.cin,scheme:MCA_CIN_SCHEME,start:base?.start||'',end:base?.end||'',instant:base?.instant||'',dimensions:dims.map(d=>({axis:d.axis,member:d.member})),_dimSig:sig};state.contexts.push(c);}return c.id;}
function factsForGeneration(kind){
  const src=kind==='prior'?state.prior:state.values,baseCtx=kind==='prior'?'P1':'C1',out=[],seen=new Set();
  const occurrences=factOccurrences(kind).filter(o=>nonblank(o.value));
  for(const [tableKey,rows] of Object.entries(state.dimTables||{})){
    if(!String(tableKey).includes('::'))continue;
    for(const row of (rows||[])){
      const vals=row[kind]||{};
      const dims=(row.dimensions||[]).map(v19NormalizeDim).filter(d=>d&&d.axis&&(d.kind==='typed'?nonblank(d.typedValue):nonblank(d.member)));
      if(!dims.length)continue;
      const cid=ensureDimContext(kind,dims);
      for(const [concept,value] of Object.entries(vals)){
        if(!nonblank(value))continue;
        const e=state.elements.find(x=>`${x.prefix}:${x.name}`===concept);
        if(!e||e.abstract==='true')continue;
        const sig=`${concept}|${cid}`;
        if(seen.has(sig))continue;
        seen.add(sig);
        out.push({concept,value:/dateitemtype$/i.test(String(e.type||''))?v18NormalizeIsoDate(value):value,contextId:cid,element:e,kind,sourceDecimals:row[`${kind}Decimals`]?.[concept]??row[`${kind}Decimals`]?.[concept]});
      }
    }
  }
  for(const [k,v] of Object.entries(src||{})){
    if(!nonblank(v))continue;
    const roles=(state.presentation||[]).filter(p=>`${p.prefix}:${p.name}`===k).map(p=>p.role);
    if(roles.some(r=>/Cash flow statement,\s*(direct|indirect)\b/i.test(String(r)))&&!roles.some(r=>cashFlowRoleAllowed(r)))continue;
    const e=state.elements.find(x=>`${x.prefix}:${x.name}`===k);
    if(!e||e.abstract==='true')continue;
    const sig=`${k}|${baseCtx}`;
    const hasSameOccurrence=occurrences.some(o=>o.concept===k&&String(o.contextId||baseCtx)===baseCtx);
    if(!hasSameOccurrence&&!seen.has(sig)){seen.add(sig);out.push({concept:k,value:/dateitemtype$/i.test(String(e.type||''))?v18NormalizeIsoDate(v):v,contextId:baseCtx,element:e,kind});}
  }
  for(const o of occurrences){
    const e=state.elements.find(x=>`${x.prefix}:${x.name}`===o.concept);
    if(!e||e.abstract==='true')continue;
    const contextId=o.contextId||baseCtx,sig=`${o.concept}|${contextId}`;
    if(seen.has(sig))continue;
    seen.add(sig);
    const roles=(state.presentation||[]).filter(p=>`${p.prefix}:${p.name}`===o.concept).map(p=>p.role);
    if(roles.some(r=>/Cash flow statement,\s*(direct|indirect)\b/i.test(String(r)))&&!roles.some(r=>cashFlowRoleAllowed(r)))continue;
    out.push({concept:o.concept,value:o.value,contextId,element:e,kind,sourceDecimals:o.decimals});
  }
  return out;
}
function baseBuildXbrlXml(){ensureBaseContexts();const richErrors=validateAllRichText();if(richErrors.length){for(const x of richErrors)state.errors.push({rule:'MCA HTML guideline',concept:x.concept,message:x.message,correction:'Return to the rich-text editor and correct the HTML. No user content was removed automatically.'});return null;}
  const doc=document.implementation.createDocument(null,null);const root=doc.createElementNS(XBRL_NS,'xbrli:xbrl');doc.appendChild(root);root.setAttribute('xmlns:xbrli',XBRL_NS);root.setAttribute('xmlns:link',LINK_NS);root.setAttribute('xmlns:xlink',XLINK_NS);root.setAttribute('xmlns:xsi','http://www.w3.org/2001/XMLSchema-instance');root.setAttribute('xmlns:xml',XML_NS);root.setAttribute('xmlns:in-gaap',TAX_NS['in-gaap']);root.setAttribute('xmlns:in-ca',TAX_NS['in-ca']);root.setAttribute('xmlns:xbrldi',XBRLDI_NS);root.setAttribute('xmlns:iso4217','http://www.xbrl.org/2003/iso4217');
  const sr=doc.createElementNS(LINK_NS,'link:schemaRef');sr.setAttributeNS(XLINK_NS,'xlink:type','simple');sr.setAttributeNS(XLINK_NS,'xlink:href',MCA_SCHEMA_REF);root.appendChild(sr);
  const {cur,prev}=ensureBaseContexts();const generatedCurrent=factsForGeneration('current'),generatedPrior=factsForGeneration('prior');const allContexts=[...state.contexts];const neededIds=new Set(generatedCurrent.concat(generatedPrior).map(f=>f.contextId));for(const fn of state.footnotes||[]){if(fn.fact){const o=state.factOccurrences?.current?.find(x=>x.concept===fn.fact);neededIds.add(o?.contextId||'C1');}}
  const contextMap=new Map();const sigToId=new Map();let seq=1;for(const c of allContexts){if(!neededIds.has(c.id))continue;const sig=contextSignature(c);if(sigToId.has(sig))continue;let id=c.id||`C${seq++}`;while(contextMap.has(id))id=`C${seq++}`;const cn=doc.createElementNS(XBRL_NS,'xbrli:context');cn.setAttribute('id',id);const ent=doc.createElementNS(XBRL_NS,'xbrli:entity');const ident=doc.createElementNS(XBRL_NS,'xbrli:identifier');ident.setAttribute('scheme',MCA_CIN_SCHEME);ident.textContent=state.profile.cin;ent.appendChild(ident);cn.appendChild(ent);const per=doc.createElementNS(XBRL_NS,'xbrli:period');if(c.instant){const ins=doc.createElementNS(XBRL_NS,'xbrli:instant');ins.textContent=c.instant;per.appendChild(ins);}else{const st=doc.createElementNS(XBRL_NS,'xbrli:startDate');st.textContent=c.start;const en=doc.createElementNS(XBRL_NS,'xbrli:endDate');en.textContent=c.end;per.appendChild(st);per.appendChild(en);}cn.appendChild(per);if(Array.isArray(c.dimensions)&&c.dimensions.length){const sc=doc.createElementNS(XBRL_NS,'xbrli:scenario');for(const d of c.dimensions){if(d.kind==='typed'||d.typedValue!==undefined)continue;const m=doc.createElementNS(XBRLDI_NS,'xbrldi:explicitMember');m.setAttribute('dimension',d.axis);m.textContent=d.member;sc.appendChild(m);}cn.appendChild(sc);}root.appendChild(cn);contextMap.set(c.id,id);sigToId.set(sig,id);}
  const units=new Map();const facts=[...generatedCurrent,...generatedPrior];for(const f of facts){const spec=unitSpec(f.element);if(spec)units.set(spec.id,spec);}for(const [id,spec] of units){const u=doc.createElementNS(XBRL_NS,'xbrli:unit');u.setAttribute('id',id);if(spec.kind==='measure'){const m=doc.createElementNS(XBRL_NS,'xbrli:measure');m.textContent=spec.measure.includes(':')?spec.measure:`xbrli:${spec.measure}`;u.appendChild(m);}else{const div=doc.createElementNS(XBRL_NS,'xbrli:divide');const nume=doc.createElementNS(XBRL_NS,'xbrli:unitNumerator');const nm=doc.createElementNS(XBRL_NS,'xbrli:measure');nm.textContent=spec.numerator;nume.appendChild(nm);const den=doc.createElementNS(XBRL_NS,'xbrli:unitDenominator');const dm=doc.createElementNS(XBRL_NS,'xbrli:measure');dm.textContent=spec.denominator;den.appendChild(dm);div.appendChild(nume);div.appendChild(den);u.appendChild(div);}root.appendChild(u);}
  let factNo=1;const factIds=new Map();for(const f of facts){const ns=TAX_NS[f.element.prefix]||state.meta?.schemaNamespace||TAX_NS['in-gaap'];const n=doc.createElementNS(ns,`${f.element.prefix}:${f.element.name}`);const cid=contextMap.get(f.contextId)||f.contextId;if(!cid)continue;n.setAttribute('contextRef',cid);n.setAttribute('id',`F${factNo++}`);factIds.set(`${f.concept}|${f.contextId}`,n.getAttribute('id'));const spec=unitSpec(f.element);if(spec)n.setAttribute('unitRef',spec.id);if(spec){const dec=decimalsForFact(f);if(dec!==null)n.setAttribute('decimals',dec);}const isRich=isRichTextConcept(f.element);const isString=/xbrli:stringItemType/i.test(f.element.type||'');if(isRich){n.setAttributeNS(XML_NS,'xml:lang','en');const html=f.richText||((f.kind==='prior')?(state.priorRichText?.[f.concept]||String(f.value||'')):(state.richText?.[f.concept]||String(f.value||'')));const holder=document.createElement('div');holder.innerHTML=html;for(const child of [...holder.childNodes])n.appendChild(doc.importNode(child,true));}else if(isString){n.setAttributeNS(XML_NS,'xml:lang','en');n.textContent=String(f.value||'');}else if(isBooleanConcept(f.element)){n.textContent=String(f.value).toLowerCase()==='yes'?'true':String(f.value).toLowerCase()==='no'?'false':String(f.value);}else{n.textContent=valueForXml(f.value,f.element);}root.appendChild(n);}
  const footnotes=(state.footnotes||[]).filter(f=>nonblank(f.fact)&&nonblank(f.text));if(footnotes.length){const fl=doc.createElementNS(LINK_NS,'link:footnoteLink');fl.setAttributeNS(XLINK_NS,'xlink:type','extended');let footNo=1;for(const f of footnotes){const candidates=[...facts].filter(x=>x.concept===f.fact);for(const cand of candidates){const factId=factIds.get(`${cand.concept}|${cand.contextId}`);if(!factId)continue;const locLabel=`factLoc${footNo}`;const fnLabel=`footnote${footNo}`;const loc=doc.createElementNS(LINK_NS,'link:loc');loc.setAttributeNS(XLINK_NS,'xlink:type','locator');loc.setAttributeNS(XLINK_NS,'xlink:label',locLabel);loc.setAttributeNS(XLINK_NS,'xlink:href','#'+factId);fl.appendChild(loc);const fn=doc.createElementNS(LINK_NS,'link:footnote');fn.setAttributeNS(XLINK_NS,'xlink:type','resource');fn.setAttributeNS(XLINK_NS,'xlink:label',fnLabel);fn.setAttributeNS(XML_NS,'xml:lang',f.lang||'en');fn.textContent=f.text;fl.appendChild(fn);const arc=doc.createElementNS(LINK_NS,'link:footnoteArc');arc.setAttributeNS(XLINK_NS,'xlink:type','arc');arc.setAttributeNS(XLINK_NS,'xlink:from',locLabel);arc.setAttributeNS(XLINK_NS,'xlink:to',fnLabel);arc.setAttributeNS(XLINK_NS,'xlink:arcrole','http://www.xbrl.org/2003/arcrole/fact-footnote');fl.appendChild(arc);footNo++;}}root.appendChild(fl);}
  return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(root)}`;
}
function dimensionContextValidForFact(concept,context){const dims=context?.dimensions||[];if(!dims.length)return true;const roles={};for(const r of state.definitions||[])(roles[r.role]??=[]).push(`${r.prefix}:${r.name}`);for(const arr of Object.values(roles)){if(!arr.includes(concept))continue;if(dims.every(d=>arr.includes(d.axis)&&arr.includes(d.member)))return true;}return false;}
function validateGeneratedXml(xml){
  const issues=[];if(!xml)return ['No XML was generated.'];
  const d=new DOMParser().parseFromString(xml,'application/xml');
  if(d.getElementsByTagName('parsererror').length)return ['Generated XML is not well-formed.'];
  const root=d.documentElement;
  const sr=d.getElementsByTagNameNS(LINK_NS,'schemaRef')[0];
  if(!sr||sr.getAttributeNS(XLINK_NS,'href')!==MCA_SCHEMA_REF)issues.push('schemaRef does not use the prescribed MCA C&I schema URI.');
  const contexts=[...d.getElementsByTagNameNS(XBRL_NS,'context')],units=[...d.getElementsByTagNameNS(XBRL_NS,'unit')];
  const contextById=new Map(contexts.map(c=>[c.id,c])),contextSigs=new Map();
  const validConcept=new Set(state.elements.map(e=>`${e.prefix}:${e.name}`));
  const validAxes=new Set(state.elements.filter(e=>/Axis$/.test(e.name)).map(e=>`${e.prefix}:${e.name}`));
  const validMembers=new Set(state.elements.filter(e=>/Member$/.test(e.name)).map(e=>`${e.prefix}:${e.name}`));
  for(const c of contexts){
    const id=c.getAttribute('id')||'';
    const ident=c.getElementsByTagNameNS(XBRL_NS,'identifier')[0];
    if(!ident||ident.getAttribute('scheme')!==MCA_CIN_SCHEME||ident.textContent.trim()!==String(state.profile.cin).trim())issues.push(`Context ${id} has an invalid MCA CIN identifier.`);
    if(c.getElementsByTagNameNS(XBRL_NS,'segment').length)issues.push(`Context ${id} contains a segment, which is not allowed.`);
    const period=c.getElementsByTagNameNS(XBRL_NS,'period')[0];
    const startDate=period?.getElementsByTagNameNS(XBRL_NS,'startDate')[0]?.textContent||'',endDate=period?.getElementsByTagNameNS(XBRL_NS,'endDate')[0]?.textContent||'',instant=period?.getElementsByTagNameNS(XBRL_NS,'instant')[0]?.textContent||'';
    if((startDate||endDate)&&(!/^\d{4}-\d{2}-\d{2}$/.test(startDate)||!/^\d{4}-\d{2}-\d{2}$/.test(endDate)))issues.push(`Context ${id} contains an invalid duration date.`);
    if(instant&&!/^\d{4}-\d{2}-\d{2}$/.test(instant))issues.push(`Context ${id} contains an invalid instant date.`);
    const dims=[];
    for(const m of [...c.getElementsByTagNameNS(XBRLDI_NS,'explicitMember')]){
      const axis=m.getAttribute('dimension')||'',member=m.textContent.trim();dims.push({axis,member,kind:'explicit'});
      if(!validAxes.has(axis))issues.push(`Unknown dimension ${axis}.`);
      if(!validMembers.has(member))issues.push(`Unknown dimension member ${member}.`);
      if(/DefaultMember$/i.test(member))issues.push(`Default dimension member ${member} must not be explicitly included.`);
    }
    for(const tm of [...c.getElementsByTagNameNS(XBRLDI_NS,'typedMember')]){
      const axis=tm.getAttribute('dimension')||'',child=[...tm.children][0],value=(child?.textContent||'').trim();
      dims.push({axis,kind:'typed',typedValue:value,typedQName:child?.prefix&&child?.localName?`${child.prefix}:${child.localName}`:''});
      if(!validAxes.has(axis))issues.push(`Unknown typed dimension ${axis}.`);
      if(!value)issues.push(`Typed dimension ${axis} has an empty member value.`);
      const axisEl=state.elements.find(e=>`${e.prefix}:${e.name}`===axis);
      if(axisEl&&!axisEl.typedDomainRef)issues.push(`Dimension ${axis} is not typed in the loaded taxonomy.`);
    }
    const sig=JSON.stringify({start:startDate,end:endDate,instant,dimensions:v19DimensionSignature(dims)});
    if(contextSigs.has(sig))issues.push(`Duplicate context period/scenario detected: ${id} duplicates ${contextSigs.get(sig)}.`);
    else contextSigs.set(sig,id);
  }
  const usedCtx=new Set(),usedUnits=new Set(),dups=new Set(),conceptContexts=new Map();
  const facts=[...root.children].filter(n=>n.namespaceURI&&n.localName&&!['schemaRef','context','unit','footnoteLink'].includes(n.localName));
  for(const f of facts){
    const ctx=f.getAttribute('contextRef')||'';if(ctx)usedCtx.add(ctx);else issues.push(`${f.localName} has no contextRef.`);
    const concept=`${f.prefix}:${f.localName}`;
    const e=state.elements.find(x=>`${x.prefix}:${x.name}`===concept);
    if(!e||!validConcept.has(concept))issues.push(`Unknown taxonomy concept ${concept}.`);
    const key=`${f.namespaceURI}|${f.localName}|${ctx}`;
    if(dups.has(key))issues.push(`Duplicate fact ${f.localName} with the same context.`);
    dups.add(key);
    if(f.hasAttribute('precision'))issues.push(`Fact ${f.localName} uses prohibited precision attribute.`);
    if(f.hasAttribute('scale'))issues.push(`Fact ${f.localName} uses a scale attribute.`);
    if(e){
      const ctxNode=contextById.get(ctx),dims=[];
      if(ctxNode){
        for(const m of [...ctxNode.getElementsByTagNameNS(XBRLDI_NS,'explicitMember')])dims.push({axis:m.getAttribute('dimension'),member:m.textContent.trim(),kind:'explicit'});
        for(const tm of [...ctxNode.getElementsByTagNameNS(XBRLDI_NS,'typedMember')]){const ch=[...tm.children][0];dims.push({axis:tm.getAttribute('dimension'),kind:'typed',typedValue:(ch?.textContent||'').trim(),typedQName:ch?.prefix&&ch?.localName?`${ch.prefix}:${ch.localName}`:''});}
      }
      if(dims.length&&!dimensionContextValidForFact(concept,{dimensions:dims}))issues.push(`Dimensional context for ${f.localName} could not be matched to a valid taxonomy table model.`);
      if(unitSpec(e)){const u=f.getAttribute('unitRef');if(!u)issues.push(`Numeric fact ${f.localName} has no unitRef.`);else usedUnits.add(u);}
      if(e&&/dateItemType/i.test(e.type||'')&&!/^\d{4}-\d{2}-\d{2}$/.test((f.textContent||'').trim()))issues.push(`Date fact ${f.localName} is not yyyy-mm-dd.`);
      const isText=isRichTextConcept(e)||/textblockitemtype|xbrli:stringItemType/i.test(e.type||'');if(isText&&f.getAttributeNS(XML_NS,'lang')!=='en')issues.push(`Text fact ${f.localName} must use xml:lang="en".`);
    }
    const cc=`${concept}|${ctx}`;if(!conceptContexts.has(concept))conceptContexts.set(concept,[]);conceptContexts.get(concept).push(ctx);
  }
  for(const c of contexts)if(!usedCtx.has(c.id))issues.push(`Unused context ${c.id}.`);
  for(const u of units)if(!usedUnits.has(u.id))issues.push(`Unused unit ${u.id}.`);
  // The MCA manual requires facts for a single concept not to use overlapping
  // periods. The generated filing normally has Current/Prior periods; this
  // check only rejects overlap within the same period kind/signature.
  for(const [concept,ctxs] of conceptContexts){
    const uniq=[...new Set(ctxs)];for(let i=0;i<uniq.length;i++)for(let j=i+1;j<uniq.length;j++){
      const a=contextById.get(uniq[i]),b=contextById.get(uniq[j]);if(!a||!b)continue;
      const ia=a.getElementsByTagNameNS(XBRL_NS,'instant')[0]?.textContent||'',ib=b.getElementsByTagNameNS(XBRL_NS,'instant')[0]?.textContent||'';
      const as=a.getElementsByTagNameNS(XBRL_NS,'startDate')[0]?.textContent||'',ae=a.getElementsByTagNameNS(XBRL_NS,'endDate')[0]?.textContent||'',bs=b.getElementsByTagNameNS(XBRL_NS,'startDate')[0]?.textContent||'',be=b.getElementsByTagNameNS(XBRL_NS,'endDate')[0]?.textContent||'';
      const ad=a.getElementsByTagNameNS(XBRLDI_NS,'explicitMember').length+a.getElementsByTagNameNS(XBRLDI_NS,'typedMember').length,bd=b.getElementsByTagNameNS(XBRLDI_NS,'explicitMember').length+b.getElementsByTagNameNS(XBRLDI_NS,'typedMember').length;
      if(ad!==bd)continue;
      if(ia&&ib&&ia===ib)issues.push(`Concept ${concept} is reported more than once for the same instant/context period.`);
      if(as&&ae&&bs&&be&&as<be&&bs<ae)issues.push(`Concept ${concept} uses overlapping duration contexts.`);
    }
  }
  return [...new Set(issues)];
}
function evaluateWorkbookGenericRules(){const rows=state.rules?.['Generic rules']||[];for(const r of rows){const text=String(Array.isArray(r)?r.join(' '):r||'').trim();if(!text)continue;const l=text.toLowerCase();if(/maximum two decimal|2 decimal/.test(l)){for(const kind of ['current','prior']){const src=kind==='current'?state.values:state.prior;for(const e of state.elements.filter(x=>x.type==='xbrli:monetaryItemType'&&x.abstract!=='true')){const k=`${e.prefix}:${e.name}`;if(nonblank(src[k])&&/\.\d{3,}/.test(String(src[k])))addRuleError(`Generic workbook rule: ${text}`,k,'Monetary value has more than two decimal places.',text);}}}if(/reporting currency.*inr|currency.*inr/.test(l)&&state.profile.currency!=='INR'){for(const kind of ['current','prior']){const src=kind==='current'?state.values:state.prior;for(const [k,v] of Object.entries(src)){if(nonblank(v)&&!/DetailsOfSubsidiary/i.test(k))addRuleError(`Generic workbook rule: ${text}`,k,'Reporting currency must be INR for this disclosure.',text);}}}if(/current.*previous.*financial|previous.*current.*financial|current.*previous year/.test(l)&&!state.profile.firstYear){for(const [k,v] of Object.entries(state.values)){const e=state.elements.find(x=>`${x.prefix}:${x.name}`===k);if(e&&e.type==='xbrli:monetaryItemType'&&nonblank(v)&&!nonblank(state.prior[k])&&!/201900/.test(state.elrs[state.section]?.name||''))addRuleError(`Generic workbook rule: ${text}`,k,'Corresponding previous-year monetary value is required by the generic rule.',text);}}}}
function evaluateDimensionalRules(){
  for(const c of state.contexts||[]){
    const seenAxes=new Set();
    for(const d of c.dimensions||[]){
      if(!d.axis||!d.member) addRuleError('Dimensional context integrity',`context:${c.id}`,'Every explicit dimension requires both an axis and a member.','Complete or remove the incomplete dimension.');
      if(seenAxes.has(d.axis)) addRuleError('Dimensional context integrity',`context:${c.id}`,`Context ${c.id} repeats dimension axis ${d.axis}.`,'Keep one explicit member per axis in the context.');
      seenAxes.add(d.axis);
      if(!state.elements.some(e=>`${e.prefix}:${e.name}`===d.axis)) addRuleError('Dimensional context integrity',`context:${c.id}`,`Unknown dimension axis ${d.axis}.`,'Select an axis from the loaded MCA taxonomy.');
      if(!state.elements.some(e=>`${e.prefix}:${e.name}`===d.member)) addRuleError('Dimensional context integrity',`context:${c.id}`,`Unknown dimension member ${d.member}.`,'Select a member from the loaded MCA taxonomy.');
      if(/DefaultMember$/i.test(d.member)) addRuleError('Dimensional default-member rule',`context:${c.id}`,`Default member ${d.member} must not be explicitly reported.`,'Remove the default member from this context.');
    }
  }
}

function evaluateSpecificRules(kind='current'){
  baseEvaluateSpecificRules(kind);
  const rows=specificRuleRows();
  for(const model of v15AllTableModels()){
    if(!cashFlowRoleAllowed(model.role)) continue;
    for(const row of v15Rows(model.role,model.id)){
      const src=kind==='prior'?row.prior:row.current;
      for(const li of model.lineItems){
        const k=li.q,value=src?.[k]??'';
        for(const r of rows.filter(x=>getConceptKey(x.element)===k)){
          if(ruleRequired(k,r.rule,kind)&&!nonblank(value))addRuleError(r.rule,`${model.role}:${row.id}:${k}`,'This table line item is mandatory under the applicable MCA business rule.','Enter the required value or review the applicable disclosure condition.');
          if(nonblank(value)){
            const l=String(r.rule).toLowerCase(),n=num(value);
            if(/greater than or equal to zero|greater than equal to zero|greater or equal to zero|greater than or eqaul to zero/i.test(l)&&n!==null&&n<0)addRuleError(r.rule,`${model.role}:${row.id}:${k}`,'Value must be greater than or equal to zero.','Enter a non-negative value.');
            if(/less than or equal to 100%|not be greater than 100%/i.test(l)&&n!==null&&n>100)addRuleError(r.rule,`${model.role}:${row.id}:${k}`,'Percentage must not exceed 100%.','Enter a value from 0 to 100%.');
            if(/valid pan/i.test(l)&&!validPan(value))addRuleError(r.rule,`${model.role}:${row.id}:${k}`,'Invalid PAN format.','Enter a valid PAN in AAAAA9999A format.');
            if(/valid cin/i.test(l)&&!validCin(value))addRuleError(r.rule,`${model.role}:${row.id}:${k}`,'Invalid CIN format.','Enter a valid CIN.');
            if(/valid din/i.test(l)&&!validDin(value))addRuleError(r.rule,`${model.role}:${row.id}:${k}`,'Invalid DIN format.','Enter an 8-digit DIN.');
          }
        }
      }
    }
  }
}
function evaluateDimensionalTableRules(){for(const [role,rows] of Object.entries(state.dimTables||{})){const cfg=dimensionalConfigs(role)[0];if(!cfg)continue;const validAxes=new Set(cfg.axes.map(a=>a.q));const validMembers=new Map(cfg.axes.map(a=>[a.q,new Set(a.members.map(m=>`${m.prefix}:${m.name}`))]));const validLines=new Set(cfg.lineItems.map(x=>x.q));for(const row of rows||[]){const concept=row._lineItem||Object.keys(row.current||{})[0]||Object.keys(row.prior||{})[0]||'';if(concept&&!validLines.has(concept))addRuleError('Dimensional table line-item validity',`${role}:${row.id||''}`,`Line item ${concept} is not part of the taxonomy definition for this dimensional role.`,'Select a line item from the table dropdown.');const seen=new Set();for(const d of row.dimensions||[]){if(!validAxes.has(d.axis))addRuleError('Dimensional table axis validity',`${role}:${row.id||''}`,`Axis ${d.axis} is not defined for this taxonomy table.`,'Select an axis from the dropdown.');if(seen.has(d.axis))addRuleError('Dimensional table axis uniqueness',`${role}:${row.id||''}`,`Axis ${d.axis} is repeated in one row.`,'Keep one member per axis.');seen.add(d.axis);if(d.member&&validMembers.get(d.axis)&&!validMembers.get(d.axis).has(d.member))addRuleError('Dimensional table member validity',`${role}:${row.id||''}`,`Member ${d.member} is not valid for axis ${d.axis} in this taxonomy role.`,'Choose a member from the axis dropdown.');if(/DefaultMember$/i.test(d.member||''))addRuleError('Dimensional default-member rule',`${role}:${row.id||''}`,`Default member ${d.member} must not be explicitly reported.`,'Remove the default member.');}const hasValue=Object.values(row.current||{}).some(nonblank)||Object.values(row.prior||{}).some(nonblank);if(hasValue&&(!concept||!validLines.has(concept)))addRuleError('Dimensional table completeness',`${role}:${row.id||''}`,'A populated dimensional row must have a valid taxonomy line item.','Select the correct line item.');if(hasValue&&(row.dimensions||[]).some(d=>!d.axis||!d.member))addRuleError('Dimensional table completeness',`${role}:${row.id||''}`,'A populated dimensional row must have a complete axis/member selection.','Select a valid member for every displayed axis.');}}}
function evaluateElrApplicabilityRules(){const fyEnd=Number(String(state.profile.fyEnd||'').slice(0,4));if(fyEnd>=2015){for(const k of Object.keys(state.values))if(/DisclosureOfGeneralInformationAboutCompany/i.test(k))addRuleError('ELR applicability rule [400100]',k,'[400100] Disclosure of general information about company is not applicable for FY 2014-15 onward under the supplied filing guidance.','Remove the [400100] fact/classification for this filing.');}if(state.profile.financialStatements==='Standalone'){for(const k of Object.keys(state.values)){if(/MinorityInterest/i.test(k)&&nonblank(state.values[k]))addRuleError('Standalone/consolidated applicability',k,'Minority interest is a consolidated-reporting disclosure under the supplied business-rule material.','Review and remove the fact for a standalone filing when not applicable.');}}}
function ruleCoverageGate(){const rows=specificRuleRows();const supported=/mandatory|greater than or equal to zero|greater than equal to zero|greater than or eqaul to zero|less than or equal to 100%|not be greater than 100%|less than or equal to system date|valid (?:cin|din|pan|country)|should be unique|different from cin|different from pan|corresponding .*entered|vice-a-versa|should be equal to|less than or equal to|greater than or equal to|greater than equal to|based on cin|based on din/i;let unsupported=0;for(const r of rows){if(supported.test(r.rule))continue;const e=elementForName(r.element);if(!e||e.abstract==='true')continue;const k=`${e.prefix}:${e.name}`;const active=nonblank(state.values[k])||nonblank(state.prior[k])||/mandatory/i.test(r.rule);if(active){unsupported++;state.warnings.push({rule:'MCA rule requires additional review',concept:k,message:`This business-rule clause is retained from the supplied workbook but is not safely reducible to a local-only check: ${r.rule}` ,correction:'Review the cited MCA rule and supporting records before final MCA validation.'});}}return unsupported;}
function baseRunChecks(role){state.errors=[];state.warnings=[];state.cellIssues={};normalizeState();v18NormalizeDateFacts();synchronizeAll();
  if(!validCin(state.profile.cin))addRuleError('General Information CIN','Entity','CIN is not in the MCA 21-character format.','Enter a valid CIN such as L12345XX1234ABC123456.');if(state.profile.din&& !validDin(state.profile.din))addRuleError('General Information DIN','DIN','Primary DIN is not in the 8-digit format.','Enter an 8-digit DIN or clear the optional DIN field.');if(state.profile.pan&&!validPan(state.profile.pan))addRuleError('General Information PAN','PAN','Primary PAN is not in the AAAAA9999A format.','Enter a valid PAN or clear the optional PAN field.');
  if(!nonblank(state.profile.companyName))addRuleError('General Information company name','CompanyName','Company name is required.','Enter or verify the company name.');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(state.profile.fyStart)||!/^\d{4}-\d{2}-\d{2}$/.test(state.profile.fyEnd))addRuleError('General Information reporting dates','ReportingPeriod','Financial-year dates must be yyyy-mm-dd.','Enter valid ISO dates.');
  if(state.profile.fyStart&&state.profile.fyEnd&&state.profile.fyStart>=state.profile.fyEnd)addRuleError('General Information reporting dates','ReportingPeriod','Financial-year start must be before financial-year end.','Correct the reporting period.');
  evaluateSpecificRules('current');evaluateSpecificRules('prior');for(const kind of ['current','prior']){const src=kind==='current'?state.values:state.prior;for(const [k,v] of Object.entries(src)){if(!nonblank(v))continue;const e=state.elements.find(x=>`${x.prefix}:${x.name}`===k);if(e&&/dateofbirth|dob/i.test(e.name)&&!/^\d{4}-\d{2}-\d{2}$/.test(String(v)))addRuleError('DOB/date format',k,'Date of birth must use yyyy-mm-dd.','Enter the date as yyyy-mm-dd.');}}evaluateGenericRules('current');evaluateGenericRules('prior');evaluateTaxonomyCalculations();evaluateWorkbookGenericRules();evaluateDimensionalRules();evaluateDimensionalTableRules();evaluateElrApplicabilityRules();
  ruleCoverageGate();for(const [concept,v] of Object.entries(state.values)){const e=state.elements.find(x=>`${x.prefix}:${x.name}`===concept);if(!e||!nonblank(v))continue;if(isBooleanConcept(e)&&!['true','false','yes','no'].includes(String(v).toLowerCase()))addRuleError('Boolean datatype',concept,'Boolean facts must be true/false in the instance.','Select Yes or No.');}
  for(const x of validateAllRichText())state.errors.push({rule:'MCA HTML guideline',concept:x.concept,message:x.message,correction:'No user content was removed. Correct the editor content and save again.'});
  // Applicability: 400100 is only for filings before FY 2014-15; consolidated restrictions from Generic Rule 13.
  const fyEnd=Number(String(state.profile.fyEnd||'').slice(0,4));if(fyEnd>=2015&&!generalInformationEnabled()){for(const k of Object.keys(state.values))if(/DisclosureOfGeneralInformationAboutCompany/i.test(k)&&nonblank(state.values[k]))addRuleError('MCA 400100 optional-section control',k,'General Information is disabled for this filing. Enable the 400100 section on its filing tab before reporting these facts.','Open the 400100 tab and enable General Information, or clear the facts.');}
  const byConcept={};for(const e of state.errors.concat(state.warnings)){if(e.concept&&state.elements.some(x=>`${x.prefix}:${x.name}`===e.concept))byConcept[e.concept]=e;}state.cellIssues=byConcept;render();return {errors:state.errors.length,warnings:state.warnings.length};}
function runAllChecksPopup(){showBusy('Running all checks','Checking filing tabs, mandatory rules, calculations and dimensional constraints…');setTimeout(()=>{try{const r=runChecks();showCheckSummary(r.errors,r.warnings);}catch(e){toast(`Run all checks failed: ${e?.message||e}`);}finally{hideBusy();}},40)}
function showCheckSummary(errors,warnings){const total=errors+warnings;modal(`<div class="modal-head"><div><h2>Pre-scrutiny complete</h2><div class="hint">The complete filing has been checked using the available taxonomy, calculation and business-rule checks.</div></div><button class="close" onclick="closeModal()">Close</button></div><div class="check-summary"><div class="summary-error"><b>${errors}</b><span>Errors</span></div><div class="summary-warning"><b>${warnings}</b><span>Warnings</span></div><div class="summary-total"><b>${total}</b><span>Total findings</span></div></div><div class="card" style="box-shadow:none"><p>${total?'Review the Errors / warnings dashboard. Error cells are highlighted in red and the correction navigator can take you directly to the relevant filing item.':'No errors or warnings were found by the current checks.'}</p></div><div class="modal-actions"><button class="smallbtn primary" onclick="closeModal()">OK</button></div>`)}
function growInput(el){if(!el)return;const len=Math.max(12,String(el.value||'').length+2);el.style.width=Math.min(520,Math.max(170,len*8))+'px';}
function clearCellIssue(k){if(state.cellIssues?.[k]){delete state.cellIssues[k];render();}}
function explainXbrl(){modal(`<div class="modal-head"><div><h2>XBRL in plain English</h2><div class="hint">You do not need to be an XBRL expert to fill the filing.</div></div><button class="close" onclick="closeModal()">Close</button></div><div class="simple-model"><div><strong>1. QName = WHAT</strong><p>Example: <span class="code">in-gaap:CashAndCashEquivalents</span>. It tells XBRL exactly which taxonomy concept you are reporting.</p></div><div><strong>2. Fact = VALUE</strong><p>Example: <strong>₹10,00,000</strong>. A fact is the value you give to a concept.</p></div><div><strong>3. Context = WHO + WHEN + WHICH DIMENSION</strong><p>Example: <strong>ABC Ltd • 1-Apr-2025 to 31-Mar-2026 • Standalone</strong>. Context tells the validator which entity, period/date and dimensions the fact belongs to.</p></div><div><strong>4. Unit = HOW MEASURED</strong><p><strong>INR</strong> means rupees; <strong>shares</strong> means a number of shares; some facts are pure numbers or percentages.</p></div></div><div class="card" style="box-shadow:none"><h3>One-line memory aid</h3><p class="big-help"><strong>QName = what</strong> → <strong>Fact = value</strong> → <strong>Context = who/when</strong> → <strong>Unit = measurement</strong></p></div><div class="card" style="box-shadow:none"><h3>What the XML roughly looks like</h3><pre class="xml-example">&lt;in-gaap:CashAndCashEquivalents contextRef="C1" unitRef="INR"&gt;1000000&lt;/in-gaap:CashAndCashEquivalents&gt;</pre><p class="hint">The number is the fact. <span class="code">CashAndCashEquivalents</span> is the QName. <span class="code">C1</span> points to the context. <span class="code">INR</span> points to the unit.</p></div>`)}
function runTabChecks(role){showBusy('Pre-scrutiny in progress',`Checking ${role||'this filing tab'}…`);setTimeout(()=>{try{runChecks(role);state.cellIssues={};const visible=new Set(state.presentation.filter(p=>p.role===role).map(p=>`${p.prefix}:${p.name}`));for(const e of state.errors.concat(state.warnings)){if(e.concept&&visible.has(e.concept))state.cellIssues[e.concept]=e;}render();setTimeout(()=>{const first=document.querySelector('.cell-invalid');if(first)first.scrollIntoView({block:'center',behavior:'smooth'});},50);const bad=Object.keys(state.cellIssues).length;toast(bad?`Pre-scrutiny found ${bad} item${bad===1?'':'s'} needing attention in this tab.`:'Pre-scrutiny passed for this tab.');}finally{hideBusy();}},40)}
function searchTax(q){q=q.trim().toLowerCase();const out=q?state.elements.filter(e=>(e.label+' '+e.name+' '+e.type+' '+(e.comment||'')).toLowerCase().includes(q)).slice(0,120):[];$('searchResults').innerHTML=q?`<div class="table-wrap"><table class="data-table"><thead><tr><th>Concept</th><th>Label</th><th>Type</th><th>Period</th><th>Action</th></tr></thead><tbody>${out.map(e=>`<tr><td class="code">${e.prefix}:${e.name}</td><td>${esc(e.label)}</td><td>${esc(e.type)}</td><td>${esc(e.periodType)}</td><td><button class="smallbtn primary" data-search-tag="${e.prefix}:${e.name}">Tag</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">Type to search the complete taxonomy.</div>';document.querySelectorAll('[data-search-tag]').forEach(b=>b.onclick=()=>showTag(b.dataset.searchTag));}
function stripHtml(html){const d=document.createElement('div');d.innerHTML=String(html||'');return (d.textContent||'').replace(/\s+/g,' ').trim()}
function sanitizeRichHtml(html){return String(html||'')}
function showRichTextEditor(k){const isPrior=k.startsWith('prior:'),base=isPrior?k.slice(6):k;const e=state.elements.find(x=>`${x.prefix}:${x.name}`===base)||{};const store=isPrior?(state.priorRichText?.[base]||state.prior[base]||''):(state.richText?.[base]||state.values[base]||'');modal(`<div class="modal-head"><div><h2>${esc(e.label||base)}</h2><div class="hint code">${esc(base)} • MCA HTML editor</div></div><button class="close" onclick="closeModal()">Close</button></div><div class="rich-toolbar"><select id="richStyle"><option value="normalText">Normal text</option><option value="header1">Header 1</option><option value="header2">Header 2</option><option value="header3">Header 3</option><option value="header4">Header 4</option><option value="header5">Header 5</option><option value="noteText1">Note 1</option><option value="noteText2">Note 2</option><option value="noteText3">Note 3</option><option value="noteText4">Note 4</option><option value="highlightedText1">Highlighted 1</option><option value="highlightedText2">Highlighted 2</option><option value="highlightedText3">Highlighted 3</option><option value="highlightedText4">Highlighted 4</option><option value="numericValue">Numeric value</option><option value="nonNumericValue">Non-numeric value</option></select><button type="button" onclick="richApplyClass()">Apply class</button><button type="button" onclick="richCmd('justifyLeft')">Left</button><button type="button" onclick="richCmd('justifyCenter')">Center</button><button type="button" onclick="richCmd('justifyRight')">Right</button><button type="button" onclick="insertSimpleTable()">Insert table</button><button type="button" onclick="richCmd('removeFormat')">Clear formatting</button><label class="paste-mode"><input id="plainPaste" type="checkbox"> Paste as plain text</label></div><div id="richEditor" class="rich-editor" contenteditable="true" spellcheck="true">${store}</div><div class="rich-help">Only MCA-permitted tags/classes can be saved. Unsupported content is never silently removed: the Save action will stop and tell you exactly what must be corrected.</div><div class="modal-actions"><button class="smallbtn primary" onclick="saveRichText('${esc(k)}')">Validate &amp; save</button><button class="smallbtn" onclick="closeModal()">Close without saving</button></div>`);const ed=$('richEditor');ed?.addEventListener('paste',handleRichPaste);setTimeout(()=>ed?.focus(),30)}
function richCmd(cmd){$('richEditor')?.focus();if(['bold','italic','underline','strikeThrough','insertUnorderedList','insertOrderedList'].includes(cmd)){showMcaHtmlValidation(`<${cmd}>`);return;}document.execCommand(cmd,false,null)}
function richApplyClass(){const ed=$('richEditor'),cls=$('richStyle')?.value;if(!ed||!cls)return;ed.focus();const sel=window.getSelection();if(!sel||!sel.rangeCount)return;const range=sel.getRangeAt(0);const span=document.createElement('span');span.className=cls;try{range.surroundContents(span);}catch{span.textContent=sel.toString();range.deleteContents();range.insertNode(span);} }
function insertSimpleTable(){const ed=$('richEditor');if(!ed)return;ed.focus();const table=document.createElement('table');table.className='bordered';for(let r=0;r<3;r++){const tr=table.insertRow();tr.className='tableRow';for(let c=0;c<3;c++){const td=tr.insertCell();td.className=r===0?'tableHeader':'tableRowValue';td.textContent=r===0?`Header ${c+1}`:' ';}}ed.appendChild(table)}
function handleRichPaste(ev){const plain=$('plainPaste')?.checked;if(!plain)return;ev.preventDefault();const text=(ev.clipboardData||window.clipboardData).getData('text/plain');document.execCommand('insertText',false,text)}
function saveRichText(k){const isPrior=k.startsWith('prior:'),base=isPrior?k.slice(6):k;const html=$('richEditor')?.innerHTML||'';const errs=validateMcaHtml(html);if(errs.length){showMcaHtmlValidation(html);return;}if(isPrior){state.priorRichText=state.priorRichText||{};state.priorRichText[base]=html;state.prior[base]=stripHtml(html)}else{state.richText=state.richText||{};state.richText[base]=html;state.values[base]=stripHtml(html);}markDirty();closeModal();render();toast('MCA-compliant formatted text saved.');}

window.showRichTextEditor=showRichTextEditor;window.richCmd=richCmd;window.insertSimpleTable=insertSimpleTable;window.saveRichText=saveRichText;
function calculationExpectedTotal(parent,kind='current'){const def=preferredCalculationCandidate(parent,kind);if(!def)return null;let has=false,sum=0;const src=kind==='prior'?state.prior:state.values;for(const c of def.children||[]){const v=num(src?.[c.q]);if(v!==null){has=true;sum+=v*(Number.isFinite(Number(c.weight))?Number(c.weight):1);}}return has?Number(sum.toFixed(2)):null;}
function calculationRoleOptions(parent,kind='current'){const candidates=calculationCandidates(parent);const selected=preferredCalculationCandidate(parent,kind)?.id||'';return candidates.map((c,i)=>{const sameRole=candidates.filter(x=>x.role===c.role).length>1;const label=sameRole?`${c.role} • formula ${i+1}`:c.role;return `<option value="${esc(c.id)}" ${c.id===selected?'selected':''}>${esc(label)}</option>`;}).join('');}
function calculationChildrenEditor(parent,candidateId,kind='current'){const candidates=calculationCandidates(parent);const c=candidates.find(x=>x.id===candidateId)||candidates.find(x=>x.role===candidateId)||preferredCalculationCandidate(parent,kind)||candidates[0];if(!c)return '<p class="hint">No calculation children are available for this role.</p>';const override=state.calculationOverrides?.[parent];const chosen=(override&&(override.id===c.id||override.role===c.role)&&Array.isArray(override.children))?new Map(override.children.map(x=>[x.q,x])):new Map(c.children.map(x=>[x.q,x]));const priorDef=preferredCalculationCandidate(parent,'prior');const currentSrc=state.values||{};const priorSrc=state.prior||{};const rows=c.children.map(ch=>{const item=chosen.get(ch.q);const checked=!!item;const weight=Number.isFinite(Number(item?.weight))?Number(item.weight):ch.weight;const cv=num(currentSrc[ch.q]);const pv=num(priorSrc[ch.q]);const cc=cv===null?'—':Number((cv*weight).toFixed(2));const pc=pv===null?'—':Number((pv*weight).toFixed(2));return `<tr><td><input type="checkbox" data-calc-child="${esc(ch.q)}" ${checked?'checked':''}></td><td><div>${esc(ch.label||ch.q)}</div><div class="hint code">${esc(ch.q)}</div></td><td><input class="calc-weight" type="number" step="1" value="${esc(weight)}" data-calc-weight="${esc(ch.q)}" title="Calculation weight; normally 1 or -1"></td><td>${esc(cv===null?'—':String(cv))}</td><td>${esc(cc===null?'—':String(cc))}</td><td>${esc(pv===null?'—':String(pv))}</td><td>${esc(pc===null?'—':String(pc))}</td></tr>`;}).join('');return `<div class="table-wrap calc-source-wrap"><table class="data-table calc-source-table"><thead><tr><th>Use</th><th>Source column / QName</th><th>Weight</th><th>Current value</th><th>Current contribution</th><th>Previous value</th><th>Previous contribution</th></tr></thead><tbody>${rows}</tbody></table></div><div class="hint" style="margin-top:8px">Current formula role: <b>${esc(c.role)}</b>. Previous-year default role: <b>${esc(priorDef?.role||'—')}</b>. ${priorDef&&priorDef.id!==c.id?'The taxonomy selected a different prior-year calculation role; review both values before filing.':''}</div>`;}
function renderCalcEditor(parent){const candidateId=$('calcRole')?.value||preferredCalculationCandidate(parent,'current')?.id||calculationCandidates(parent)[0]?.id||'';const box=$('calcChildren');if(box)box.innerHTML=calculationChildrenEditor(parent,candidateId,'current');}
function saveCalculationOverride(parent){const candidateId=$('calcRole')?.value||'';const candidate=calculationCandidates(parent).find(c=>c.id===candidateId);if(!candidate)return;const children=[];document.querySelectorAll('[data-calc-child]').forEach(cb=>{if(!cb.checked)return;const q=cb.dataset.calcChild,w=Number(document.querySelector(`[data-calc-weight="${CSS.escape(q)}"]`)?.value);children.push({q,weight:Number.isFinite(w)?w:1});});if(!children.length){toast('Select at least one calculation source column.');return;}state.calculationOverrides=state.calculationOverrides||{};state.calculationOverrides[parent]={id:candidate.id,role:candidate.role,children};autoCalculateParents('current');autoCalculateParents('prior');markDirty();closeModal();render();toast('Calculation mapping saved for this field. The selected source columns now control its automatic total.');}
function restoreCalculationDefault(parent){state.calculationOverrides=state.calculationOverrides||{};delete state.calculationOverrides[parent];autoCalculateParents('current');markDirty();closeModal();render();toast('Taxonomy default calculation restored.');}
window.renderCalcEditor=renderCalcEditor;window.saveCalculationOverride=saveCalculationOverride;window.restoreCalculationDefault=restoreCalculationDefault;
function showTag(k){
  const e=state.elements.find(x=>`${x.prefix}:${x.name}`===k);if(!e)return;
  const imported=state.priorFacts?.[k]||[];
  const calcCandidates=calculationCandidates(k);
  const calc=preferredCalculationCandidate(k,'current');
  const calcPrior=preferredCalculationCandidate(k,'prior');
  const currentExpected=calculationExpectedTotal(k,'current');
  const priorExpected=calculationExpectedTotal(k,'prior');
  const importedPrior=num(state.prior?.[k]);
  const priorCalcValue=num(state.priorCalculated?.[k]);
  const delta=importedPrior!==null&&priorCalcValue!==null?Number((importedPrior-priorCalcValue).toFixed(2)):null;
  const calcCard=calcCandidates.length?`<div class="card calc-details" style="box-shadow:none">
    <div class="toolbar"><div class="grow"><h3>Automatic total / calculation</h3>
      <p class="hint">This disabled total is driven by the taxonomy calculation linkbase. The table below shows exactly which source QNames are included, their weights, the Current Year values and the Previous Year imported values. Use the checkboxes and weights to create a field-specific mapping. The mapping is applied to both years; cash-flow-specific alternatives still follow the selected direct/indirect method.</p>
    </div><span class="status ${state.calculationOverrides?.[k]?'warn':''}">${state.calculationOverrides?.[k]?'Custom mapping':'Taxonomy default'}</span></div>
    <div class="grid cols2">
      <div><b>Current-year calculation source</b><select id="calcRole" class="fact-select" onchange="renderCalcEditor('${esc(k)}')">${calculationRoleOptions(k,'current')}</select>
        <p class="hint">${esc(calc?.role||'—')}</p></div>
      <div><b>Previous-year calculation source</b><div class="code" style="margin-top:7px">${esc(calcPrior?.role||'—')}</div>
        <p class="hint">Previous-year total is recalculated separately from imported source columns; an imported parent fact is preserved for comparison.</p></div>
    </div>
    <div class="grid cols2" style="margin-top:8px">
      <div class="card" style="box-shadow:none;margin:0"><b>Current Year expected total</b><div class="calc-total-value">${currentExpected===null?'—':esc(String(currentExpected))}</div></div>
      <div class="card" style="box-shadow:none;margin:0"><b>Previous Year</b><div class="calc-total-value">Calculated: ${priorExpected===null?'—':esc(String(priorExpected))}</div><div class="hint">Imported parent: ${importedPrior===null?'—':esc(String(importedPrior))}${delta===null||Math.abs(delta)<0.01?'':` • Difference: ${esc(String(delta))}`}</div></div>
    </div>
    <div id="calcChildren" class="calc-children-editor">${calculationChildrenEditor(k,calc?.id||calcCandidates[0]?.id||'','current')}</div>
    <div class="toolbar"><button class="smallbtn primary" onclick="saveCalculationOverride('${esc(k)}')">Save field calculation</button><button class="smallbtn" onclick="restoreCalculationDefault('${esc(k)}')">Restore taxonomy default</button></div>
    <details><summary>All taxonomy calculation candidates</summary>${calcCandidates.map(c=>`<div class="rule"><b>${esc(c.role)}</b><p>${esc(c.children.map(ch=>`${ch.label||ch.q}${Number(ch.weight)===-1?' (subtract)':''}`).join(' + '))}</p></div>`).join('')}</details>
  </div>`:'';
  const occurrences=imported.length?`<div class="card" style="box-shadow:none"><h3>Imported prior-year occurrences</h3>${imported.map((f,i)=>`<div class="rule"><b>Occurrence ${i+1}: ${esc(f.value)}</b><p>Context: ${esc(f.contextRef||'—')} ${f.context?`• ${esc(f.context.entity||'')} • ${esc(f.context.start||f.context.instant||'')} to ${esc(f.context.end||'')}`:''}${f.unitRef?` • Unit: ${esc(f.unitRef)}`:''}</p>${f.context?.dimensions?.length?`<p>Dimensions: ${f.context.dimensions.map(d=>esc(d.axis)+' = '+esc(d.member||d.typedValue||'')).join(' • ')}</p>`:''}</div>`).join('')}</div>`:'<div class="card" style="box-shadow:none"><h3>Imported prior-year occurrences</h3><p class="hint">No prior-year occurrence has been imported for this concept yet.</p></div>';
  modal(`<div class="modal-head"><div><h2>${esc(e.label)}</h2><div class="hint code">${esc(k)}</div></div><button class="close" onclick="closeModal()">Close</button></div><div class="grid cols2"><div><b>QName</b><p class="hint code">${esc(k)}</p></div><div><b>Type</b><p class="hint">${esc(e.type)}</p></div><div><b>Period type</b><p class="hint">${esc(e.periodType)}</p></div><div><b>Balance</b><p class="hint">${esc(e.balance||'—')}</p></div></div>${calcCard}<div class="card" style="box-shadow:none;margin-top:12px"><h3>Current-year value</h3><p class="hint">This is the fact you are preparing for the current filing.</p><input id="modalValue" style="width:100%;padding:9px;border:1px solid #cfd7e3;border-radius:7px" value="${esc(state.values[k]??'')}"><div class="toolbar" style="margin-top:10px"><button class="smallbtn primary" onclick="saveModalValue('${esc(k)}')">Save value</button></div></div>${occurrences}<div class="card" style="box-shadow:none"><h3>Linked cell</h3><p class="hint">Make another concept mirror this current-year value when appropriate.</p><input id="linkTarget" style="width:100%;padding:9px;border:1px solid #cfd7e3;border-radius:7px" placeholder="in-gaap:ExampleConcept"><div class="toolbar" style="margin-top:10px"><button class="smallbtn" onclick="saveLink('${esc(k)}')">Link target</button></div></div><div class="card" style="box-shadow:none"><h3>Dimensional occurrence</h3><p class="hint">Use this when the same QName must be reported for a specific context/member combination.</p><div class="grid cols2"><div class="field"><label>Context</label><select id="occContext">${state.contexts.map(c=>`<option value="${esc(c.id)}">${esc(c.id)}${c.dimensions?.length?' • '+c.dimensions.map(d=>d.member||d.typedValue||'').join(', '):''}</option>`).join('')}</select></div><div class="field"><label>Value</label><input id="occValue" value=""></div></div><button class="smallbtn primary" onclick="saveOccurrence('${esc(k)}','current')">Save current occurrence</button></div><div class="card" style="box-shadow:none"><h3>Business-rule / taxonomy note</h3><p class="hint">${esc(e.comment||'No element comment in the supplied taxonomy workbook.')}</p></div>`);
}
function saveModalValue(k){state.values[k]=$('modalValue').value;markDirty();closeModal();render();toast('Tag/value saved.');}
function modal(html){$('modal').innerHTML=`<div class="modal-box">${html}</div>`;$('modal').hidden=false}function closeModal(){$('modal').hidden=true;$('modal').innerHTML=''}function saveLink(source){const t=$('linkTarget').value.trim();if(!t)return;state.links=state.links||[];state.links.push({source,target:t});propagateLinks(source);markDirty();toast('Linked cell saved.');}window.closeModal=closeModal;window.saveModalValue=saveModalValue;window.saveLink=saveLink;
function exportErrors(kind){const rows=[['Severity','Rule','Concept','Message','Correction'],...state.errors.map(x=>['Error',x.rule,x.concept||'',x.message,x.correction||'']),...state.warnings.map(x=>['Warning',x.rule,x.concept||'',x.message,x.correction||''])];let blob,name;if(kind==='csv'){blob=new Blob([rows.map(r=>r.map(csv).join(',')).join('\n')],{type:'text/csv;charset=utf-8'});name='mca-xbrl-errors.csv'}else{const table='<table border="1">'+rows.map((r,i)=>'<tr>'+r.map(c=>`<${i?'td':'th'}>${esc(c)}</${i?'td':'th'}>`).join('')+'</tr>').join('')+'</table>';blob=new Blob([`<html><head><meta charset="utf-8"></head><body>${table}</body></html>`],{type:'application/vnd.ms-excel'});name='mca-xbrl-errors.xls'}download(blob,name);toast('Error report downloaded.');}function csv(s){s=String(s??'');return '"'+s.replaceAll('"','""')+'"'}
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
function startNewFiling(){if(!confirm('Start a new filing? This clears the current filing data in this browser. Your bundled taxonomy is not affected. Use Save project file first if you want a backup.'))return;const keep={meta:state.meta,elements:state.elements,presentation:state.presentation,calculations:state.calculations,definitions:state.definitions,elrs:state.elrs,rules:state.rules};const fresh={values:{},prior:{},priorFacts:{},factOccurrences:{current:[],prior:[]},dimTables:{},importedContexts:[],importedUnits:[],importDiagnostics:[],cellIssues:{},errors:[],warnings:[],richText:{},priorRichText:{},links:[],footnotes:[],manualParentsEnabled:false,dirty:false,calculationOverrides:{},_v18PriorImportedFacts:{},profile:{cin:'',companyName:'',fyStart:'',fyEnd:'',currency:'',firstYear:false,financialStatements:'',inputScale:'Actuals',generalInfoEnabled:true,cashFlowMethod:''}};Object.assign(state,fresh,keep);localStorage.removeItem(PROJECT_KEY);renderNav();renderTabs();normalizeState();render();toast('New filing started successfully.');}
function saveData(){persistNow();$('saveState').textContent='Saved';modal('<div class="modal-head"><div><h2>Data saved</h2><div class="hint">Your current filing data has been saved in this browser.</div></div><button class="close" onclick="closeModal()">Close</button></div><div class="card" style="box-shadow:none"><p>You can continue working on this filing. For a portable backup, use <b>Save project file</b>.</p></div><div class="modal-actions"><button class="smallbtn primary" onclick="closeModal()">OK</button></div>');}
function saveProjectFile(){const exportState=JSON.parse(JSON.stringify(state));exportState.appVersion=APP_VERSION;exportState.projectFormat='mca-cni-xbrl-workbench';exportState.savedAt=new Date().toISOString();const blob=new Blob([JSON.stringify(exportState,null,2)],{type:'application/json;charset=utf-8'});download(blob,'mca-cni-xbrl-project-v21-1.json');state.dirty=false;$('saveState').textContent='Project saved';toast('Project file saved. Keep this file as a portable V21 backup.');}
function importXml(file){const reader=new FileReader();reader.onload=()=>{const diagnostics=[];const detail=[];try{const text=String(reader.result||'');if(!text.trim())throw new Error('The selected file is empty.');if(!/^\s*<\?xml|^\s*</.test(text))throw new Error('The file does not appear to be XML text.');const xml=new DOMParser().parseFromString(text,'application/xml');const parserError=xml.getElementsByTagName('parsererror')[0];if(parserError)throw new Error('XML parser error: '+(parserError.textContent||'Malformed XML').replace(/\s+/g,' ').trim());const root=xml.documentElement;if(!root)throw new Error('The file has no XML document element.');const rootName=root.localName||root.nodeName;if(rootName.toLowerCase()!=='xbrl')diagnostics.push(`Root element is <${rootName}>. This may be a taxonomy/linkbase file rather than an XBRL instance.`);const xbrli='http://www.xbrl.org/2003/instance';const link='http://www.xbrl.org/2003/linkbase';const contextNodes=[...xml.getElementsByTagNameNS(xbrli,'context')];const unitNodes=[...xml.getElementsByTagNameNS(xbrli,'unit')];const contextIds=new Set(contextNodes.map(c=>c.getAttribute('id')).filter(Boolean));const prefixByNs={};for(const a of [...root.attributes])if(a.name.startsWith('xmlns:'))prefixByNs[a.value]=a.name.slice(6);const knownByNs={};for(const e of state.elements){const ns=state.meta?.schemaNamespace||'';(knownByNs[ns]??=e.prefix);if(e.prefix==='in-gaap')knownByNs[ns]='in-gaap';}const importedContexts=contextNodes.map(c=>{const ent=c.getElementsByTagNameNS(xbrli,'identifier')[0];const per=c.getElementsByTagNameNS(xbrli,'period')[0];const start=per?.getElementsByTagNameNS(xbrli,'startDate')[0]?.textContent||'';const end=per?.getElementsByTagNameNS(xbrli,'endDate')[0]?.textContent||'';const instant=per?.getElementsByTagNameNS(xbrli,'instant')[0]?.textContent||'';const dims=[...c.getElementsByTagNameNS('http://xbrl.org/2006/xbrldi','explicitMember')].map(d=>({axis:d.getAttribute('dimension')||'',member:(d.textContent||'').trim(),kind:'explicit'}));const typed=[...c.getElementsByTagNameNS('http://xbrl.org/2006/xbrldi','typedMember')].map(tm=>{const axis=tm.getAttribute('dimension')||'';const child=[...tm.children][0];return {axis,member:'',kind:'typed',typedValue:(child?.textContent||tm.textContent||'').trim(),typedQName:child?.prefix&&child?.localName?`${child.prefix}:${child.localName}`:(child?.localName||''),typedDomainRef:(state.elements.find(e=>`${e.prefix}:${e.name}`===axis)||{}).typedDomainRef||''};});return {id:c.getAttribute('id')||'',entity:ent?.textContent||'',scheme:ent?.getAttribute('scheme')||'',start,end,instant,dimensions:[...dims,...typed]};});state.importedContexts=importedContexts;state.importedUnits=unitNodes.map(u=>({id:u.getAttribute('id')||'',measure:u.getElementsByTagNameNS(xbrli,'measure')[0]?.textContent||'',divide:!!u.getElementsByTagNameNS(xbrli,'divide')[0]}));if(!contextNodes.length)diagnostics.push('No XBRL contexts were found. A fact needs a context to say which company and period it belongs to.');if(!unitNodes.length)diagnostics.push('No XBRL units were found. Numeric facts may still be readable, but their measurement could not be confirmed.');const facts=[...root.children].filter(n=>n.namespaceURI&&n.localName&&!['schemaRef','context','unit','footnoteLink'].includes(n.localName));let count=0,rawFactCount=0,unknown=0,noContext=0,missingContext=0,trueDuplicate=0,multipleOccurrences=0;const unknownConcepts=[];state.priorFacts={};state.factOccurrences={current:[],prior:[]};state.dimTables={};const sourceYears=importedContexts.flatMap(c=>[c.end,c.instant]).filter(Boolean).map(x=>Number(String(x).slice(0,4))).filter(Number.isFinite);const sourceCurrentYear=sourceYears.length?Math.max(...sourceYears):null;const importedCin=importedContexts.map(c=>String(c.entity||'').trim().toUpperCase()).find(Boolean);if(importedCin){if(!String(state.profile.cin||'').trim()){state.profile.cin=importedCin;diagnostics.push(`Filing CIN was auto-populated from the imported XML context: ${importedCin}.`);}else if(validCin(state.profile.cin)&&importedCin!==String(state.profile.cin).trim().toUpperCase())diagnostics.push(`Imported XML CIN ${importedCin} does not match the current filing CIN ${String(state.profile.cin).trim().toUpperCase()}. The imported values are retained for review, but the filing profile was not overwritten.`);}const factsByName={};for(const n of facts){const ns=n.namespaceURI||'';if(ns===xbrli||ns===link||ns==='http://www.w3.org/2001/XMLSchema-instance')continue;const prefix=prefixByNs[ns]||knownByNs[ns]||n.prefix||'';const k=prefix?`${prefix}:${n.localName}`:n.localName;const txt=(n.textContent||'').trim();const ctx=n.getAttribute('contextRef')||'';if(ctx&&!contextIds.has(ctx)){missingContext++;detail.push(`Fact ${k} refers to missing context “${ctx}”.`);}if(!ctx)noContext++;const known=state.elements.some(x=>`${x.prefix}:${x.name}`===k);if(!known){unknown++;if(unknownConcepts.length<25)unknownConcepts.push(k);}if(!txt)continue;rawFactCount++;const c=importedContexts.find(x=>x.id===ctx);const factYear=Number(String(c?.end||c?.instant||'').slice(0,4));if(sourceCurrentYear&&factYear!==sourceCurrentYear)continue;count++;const occurrence={value:txt,contextRef:ctx,context:c||null,unitRef:n.getAttribute('unitRef')||'',decimals:n.getAttribute('decimals')||''};(state.priorFacts[k]??=[]).push(occurrence);const arr=factsByName[k]??=[];const sig=k+'|'+contextSignature(c||{});if(arr.some(x=>x.sig===sig))trueDuplicate++;else{if(arr.length)multipleOccurrences++;arr.push({sig,occurrence});}if(c?.dimensions?.length){const role=findRoleForDimFact(k,c.dimensions);if(role){const row=ensureDimRow(role,c.dimensions,'prior');row.prior[k]=scaledForEntry(txt,e);row.priorDecimals=row.priorDecimals||{};row.priorDecimals[k]=n.getAttribute('decimals')||'';row._lineItem=k;}else{state.prior[k]=txt;state.factOccurrences.prior.push({concept:k,value:txt,contextId:ctx,context:c||null});}}else{state.prior[k]=txt;state.factOccurrences.prior.push({concept:k,value:txt,contextId:ctx,context:c||null});}}if(!String(state.profile.companyName||'').trim()){const candidates=['in-ca:NameOfCompany','in-gaap:NameOfCompany'];for(const k of candidates){const hit=facts.find(n=>`${prefixByNs[n.namespaceURI]||n.prefix}:${n.localName}`===k&&String(n.textContent||'').trim());if(hit){state.profile.companyName=String(hit.textContent).trim();diagnostics.push(`Company name was auto-populated from imported XML fact ${k}.`);break;}}}if(unknown)diagnostics.push(`${unknown} fact(s) use concepts that could not be matched exactly to the loaded C&I taxonomy. They were retained for review rather than silently discarded.`);if(unknownConcepts.length)detail.push('Unmatched concepts: '+unknownConcepts.join(', '));if(noContext)diagnostics.push(`${noContext} imported fact(s) have no contextRef and therefore cannot be safely associated with a reporting period.`);if(missingContext)diagnostics.push(`${missingContext} fact(s) point to a context ID that does not exist in the XML.`);if(trueDuplicate)diagnostics.push(`${trueDuplicate} true duplicate occurrence(s) were found: the same concept appeared more than once for the same complete imported context. These need review.`);if(multipleOccurrences)diagnostics.push(`${multipleOccurrences} concept occurrence(s) use different contexts/dimensions. These are not automatically treated as duplicates and are retained separately.`);if(!count)diagnostics.push('No non-empty XBRL facts from the latest detected source reporting year were found.');const importedYears=[...new Set(importedContexts.flatMap(c=>[c.end,c.instant]).filter(Boolean).map(x=>String(x).slice(0,4)))];if(importedYears.length)diagnostics.push(`Source XML reporting years detected: ${importedYears.join(', ')}. Latest source FY end year ${sourceCurrentYear||'undetermined'} was mapped to the Previous Year comparison. Your current filing FY remains unchanged and must be selected manually.`);if(unitNodes.length)diagnostics.push(`Imported ${unitNodes.length} XBRL unit definition(s). A unit identifies what a number measures (for example INR, shares or INR per share); it is not a scale such as thousands or lakhs.`);if(importedContexts[0]){const c=importedContexts[0];state.contexts[0]={...state.contexts[0],id:'C1',entity:state.profile.cin||c.entity||'',scheme:c.scheme||'http://www.mca.gov.in/CIN'};}synchronizeAll();state.importDiagnostics=diagnostics;markDirty();render();showImportDiagnostics(file.name,count,diagnostics,detail,importedContexts.length,unitNodes.length,rawFactCount,sourceCurrentYear);}catch(e){state.importDiagnostics=[e?.message||String(e)];showImportDiagnostics(file.name,0,state.importDiagnostics,[],0,0);}};reader.readAsText(file)}
function showImportDiagnostics(name,count,diagnostics,detail,contextCount,unitCount,rawFactCount=0,sourceCurrentYear=null){
  const list=diagnostics.length?`<ul>${diagnostics.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p class="success">No structural import problems were detected.</p>';
  const details=detail.length?`<div class="card" style="box-shadow:none"><h3>Technical details</h3><div class="diagnostic-list">${detail.map(x=>`<div>${esc(x)}</div>`).join('')}</div></div>`:'';
  const factsStatus=count?`<p class="success">Imported ${count.toLocaleString()} non-empty fact value(s) from the latest detected source reporting year${sourceCurrentYear?` (${esc(String(sourceCurrentYear))})`:''}. The importer also read ${rawFactCount.toLocaleString()} non-empty fact occurrence(s) across all source years.</p>`:`<p class="danger">No non-empty fact values were mapped to the latest detected source reporting year${sourceCurrentYear?` (${esc(String(sourceCurrentYear))})`:''}. The importer read ${rawFactCount.toLocaleString()} non-empty fact occurrence(s) across all source years; review the diagnostics below.</p>`;
  modal(`<div class="modal-head"><div><h2>Previous-year XML import report</h2><div class="hint">${esc(name)}</div></div><button class="close" onclick="closeModal()">Close</button></div><div class="import-summary"><div><b>${count.toLocaleString()}</b><span>latest-year facts imported</span></div><div><b>${rawFactCount.toLocaleString()}</b><span>non-empty facts read</span></div><div><b>${contextCount}</b><span>contexts</span></div><div><b>${unitCount}</b><span>units</span></div><div><b>${state.elements.length}</b><span>taxonomy concepts available</span></div></div><div class="card" style="box-shadow:none;margin-top:12px"><h3>${count?'Import completed with review items':'Import completed with mapping review'}</h3>${factsStatus}${list}</div>${details}<div class="card" style="box-shadow:none"><h3>What happens next?</h3><p class="hint">Matched non-dimensional facts are shown in the <strong>Previous Year</strong> comparison column. Dimensional facts are shown in the <strong>Dimensional table editor</strong> for their filing tab. The source FY is informational; the current filing FY is not changed automatically.</p></div>`)
}
function generateXml(){v18NormalizeDateFacts();syncGeneralInfoToProfile();if(!requireProfile())return;const result=runChecks();if(result.errors){modal(`<div class="modal-head"><div><h2>XML generation blocked</h2><div class="hint">${result.errors} validation item${result.errors===1?'':'s'} must be corrected first.</div></div><button class="close" onclick="closeModal()">Close</button></div><div class="card" style="box-shadow:none"><p>Nothing has been removed from your filing. Review the <b>Errors / warnings</b> area, correct the highlighted fields, then generate again.</p></div><div class="modal-actions"><button class="smallbtn primary" onclick="closeModal();state.active='errors';renderNav();renderTabs();render()">Open errors</button></div>`);return;}const xml=buildXbrlXml();if(!xml){toast('XML generation stopped because the filing contains invalid content.');return;}const issues=validateGeneratedXml(xml);if(issues.length){state.errors=issues.map(x=>({rule:'Generated instance structural check',concept:'XML',message:x,correction:'Correct the filing data/context/unit/dimension and generate again.'}));render();modal(`<div class="modal-head"><div><h2>XML generation blocked</h2><div class="hint">The internal MCA/XBRL structural gate found ${issues.length} issue${issues.length===1?'':'s'}.</div></div><button class="close" onclick="closeModal()">Close</button></div><div class="card" style="box-shadow:none"><ul>${issues.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div class="modal-actions"><button class="smallbtn primary" onclick="closeModal()">Close</button></div>`);return;}download(new Blob([xml],{type:'application/xml;charset=utf-8'}),'mca-cni-instance-v21.xml');toast('MCA C&I XBRL instance generated through the V21 filing model. Validate it in MCA XBRL Validation Tool V5.1 before filing.');}
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),2600)}
function baseRestoreProjectFile(data){if(!data||typeof data!=='object')throw new Error('Invalid project object.');const keep={meta:state.meta,elements:state.elements,presentation:state.presentation,calculations:state.calculations,definitions:state.definitions,elrs:state.elrs,rules:state.rules};Object.assign(state,data);Object.assign(state,keep);normalizeState();state.appVersion=APP_VERSION;synchronizeAll();renderNav();renderTabs();render();markDirty();}
window.addEventListener('pagehide',persistNow);window.addEventListener('beforeunload',persistNow);$('newFilingTopBtn').onclick=startNewFiling;$('saveBtn').onclick=saveData;$('saveProjectFileBtn').onclick=saveProjectFile;$('importXmlBtn').onclick=()=>$('xmlFile').click();$('xmlFile').onchange=e=>e.target.files[0]&&importXml(e.target.files[0]);$('restoreBtn').onclick=()=>$('projectFile').click();$('projectFile').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const data=JSON.parse(r.result);restoreProjectFile(data);toast(`Project restored. Source format: ${esc(data.appVersion||'legacy')}.`);}catch(err){toast(`Restore failed: ${err?.message||'invalid project file.'}`)}};r.readAsText(f)};$('generateBtn').onclick=generateXml;/* V15 taxonomy-driven filing model overrides.  These functions intentionally sit
   above the V14 renderer so the V14 work remains the base implementation. */

function yearLabel(start,end){
  const y=Number(String(end||'').slice(0,4));
  if(!Number.isFinite(y)||y<1900)return 'Current year';
  return `FY ${y-1}-${String(y).slice(2)}`;
}
function priorYearLabel(start,end){
  const y=Number(String(end||'').slice(0,4));
  if(!Number.isFinite(y)||y<1901)return 'Previous year';
  return `FY ${y-2}-${String(y-1).slice(2)}`;
}
function isGeneralInformationRole(role){return /^\[400100\]/.test(String(role||''));}
function generalInformationEnabled(){return state.profile.generalInfoEnabled===true;}

/* A table model is compiled from the supplied Definition Link tree.  A real
   [Table] node owns its axes; its matching [Line Items] node owns the complete
   ordered line-item presentation. [Table NotAll] nodes are constraints, not
   user-facing line items. */
function v15TableModels(role){
  const defs=(state.definitions||[]).filter(r=>r.role===role);
  if(!defs.length)return [];
  const tables=defs.filter(r=>/Table$/.test(String(r.name||'')) && !/NotAll$/i.test(String(r.name||'')));
  const models=[];
  for(const t of tables){
    const base=String(t.name).replace(/Table$/,'');
    let lineNode=defs.find(r=>String(r.name)===`${base}LineItems`) || defs.find(r=>String(r.name).endsWith('LineItems') && String(r.name).replace(/LineItems$/,'')===base);
    if(!lineNode){
      // MCA C&I also uses descriptive Line Items names (for example
      // DetailsOfBorrowingsLineItems) that do not share the Table's base name.
      // Associate the nearest Line Items node following this Table, before
      // another top-level Table/section begins.
      const ti=defs.indexOf(t),td0=Number(t.depth)||0;
      for(let j=ti+1;j<defs.length;j++){
        const r=defs[j],d=Number(r.depth)||0,n=String(r.name||''),nt=String(r.nodeType||'');
        if(d<=td0 && nt!=='lineItems')break;
        if(nt==='lineItems' || /LineItems$/i.test(n)){lineNode=r;break;}
      }
    }
    const td=Number(t.depth)||0;
    const axes=[];
    for(let i=defs.indexOf(t)+1;i<defs.length;i++){
      const r=defs[i],d=Number(r.depth)||0;
      if(d<=td)break;
      if(String(r.name).endsWith('Axis') && d===td+1)axes.push(r);
    }
    const axisModels=axes.map(a=>{
      const ad=Number(a.depth)||0, ai=defs.indexOf(a), members=[];
      for(let i=ai+1;i<defs.length;i++){
        const r=defs[i],d=Number(r.depth)||0;
        if(d<=ad)break;
        if(String(r.name).endsWith('Axis') && d<=ad)break;
        if(String(r.name).endsWith('Member')){
          const q=`${r.prefix}:${r.name}`;
          if(!members.some(m=>m.q===q))members.push({q,label:r.label||r.name,depth:d,element:state.elements.find(e=>`${e.prefix}:${e.name}`===q)});
        }
      }
      return {q:`${a.prefix}:${a.name}`,label:a.label||a.name,depth:ad,element:state.elements.find(e=>`${e.prefix}:${e.name}`===`${a.prefix}:${a.name}`),members,topMembers:members.filter(m=>Number(m.depth)===ad+1)};
    });
    const lineItems=[];
    if(lineNode){
      const ld=Number(lineNode.depth)||0, li=defs.indexOf(lineNode);
      // A Line Items tree can contain abstracts followed by their child
      // concepts. Keep every concept in that tree until the definition tree
      // returns to the line-item depth or reaches a Table NotAll constraint.
      // This is important for multi-level tables such as Borrowings.
      for(let i=li+1;i<defs.length;i++){
        const r=defs[i],d=Number(r.depth)||0,nt=String(r.nodeType||'');
        if(d<=ld)break;
        if(nt!=='concept')continue;
        const q=`${r.prefix}:${r.name}`;
        const e=state.elements.find(x=>`${x.prefix}:${x.name}`===q);
        if(e&&!lineItems.some(x=>x.q===q))lineItems.push({q,label:r.label||e.label||r.name,depth:d,abstract:e.abstract==='true',element:e});
      }
    }

    // A few taxonomy roles expose the line-item tree in Presentation rather
    // than directly under Definition. Keep a conservative fallback, but never
    // mix unrelated role concepts into a table.
    if(!lineItems.length){
      // Conservative fallback for roles whose taxonomy omits a Line Items
      // node: only direct concept children of this Table are eligible.
      const ti=defs.indexOf(t), td0=Number(t.depth)||0;
      for(let i=ti+1;i<defs.length;i++){
        const r=defs[i],d=Number(r.depth)||0,nt=String(r.nodeType||'');
        if(d<=td0)break;
        if(nt==='table'||nt==='tableNotAll'||nt==='axis'||nt==='member'||nt==='lineItems')continue;
        if(nt!=='concept'||d!==td0+1)continue;
        const q=`${r.prefix}:${r.name}`,e=state.elements.find(x=>`${x.prefix}:${x.name}`===q);
        if(e&&!lineItems.some(x=>x.q===q))lineItems.push({q,label:r.label||e.label||r.name,depth:d,abstract:false,element:e});
      }
    }
    models.push({id:`${role}|${t.name}`,role,tableQ:`${t.prefix}:${t.name}`,name:t.name,label:t.label||t.name,depth:td,axes:axisModels,lineItems});
  }
  return models;
}
const __v18RawV15TableModels=v15TableModels;const __v18TableModelCache=new Map();v15TableModels=function(role){const key=String(role||'');if(__v18TableModelCache.has(key))return __v18TableModelCache.get(key);const value=__v18RawV15TableModels(key);__v18TableModelCache.set(key,value);return value;};
function v15AllTableModels(){return (state.elrs||[]).flatMap(e=>v15TableModels(e.name));}
function allDimensionalRoles(){return [...new Set(v15AllTableModels().map(t=>t.role))];}
function v15TableForConcept(role,concept){
  const models=v15TableModels(role);
  return models.find(t=>t.lineItems.some(li=>li.q===concept)) || null;
}
function v15TableForDimensions(role,dims,concept){
  const nd=(dims||[]).map(d=>typeof v16NormalizeDim==='function'?v16NormalizeDim(d):d).filter(Boolean);
  const models=v15TableModels(role), dimAxes=new Set(nd.map(d=>d.axis));
  const candidates=models.map(model=>{
    const axisQ=new Set(model.axes.map(a=>a.q));
    const hasAll=nd.every(d=>axisQ.has(d.axis));
    if(!hasAll)return null;
    const exactAxes=axisQ.size===dimAxes.size && [...axisQ].every(a=>dimAxes.has(a));
    const hasConcept=!concept||model.lineItems.some(li=>li.q===concept);
    const conceptRole=concept&&state.definitions.some(r=>r.role===role&&`${r.prefix}:${r.name}`===concept);
    if(concept&&!hasConcept&&!conceptRole)return null;
    return {model,score:(hasConcept?0:20)+(exactAxes?0:10)+Math.abs(axisQ.size-dimAxes.size)};
  }).filter(Boolean);
  candidates.sort((a,b)=>a.score-b.score||b.model.lineItems.length-a.model.lineItems.length);
  return candidates[0]?.model||null;
}
function v15RoleForFact(concept,dims){
  const nd=(dims||[]).map(d=>typeof v16NormalizeDim==='function'?v16NormalizeDim(d):d).filter(Boolean);
  const candidates=[];
  for(const role of allDimensionalRoles()){
    for(const model of v15TableModels(role)){
      const axisQ=new Set(model.axes.map(a=>a.q));
      if(!nd.every(d=>axisQ.has(d.axis)))continue;
      const exactAxes=axisQ.size===nd.length&&[...axisQ].every(a=>nd.some(d=>d.axis===a));
      const hasConcept=model.lineItems.some(li=>li.q===concept);
      if(hasConcept)candidates.push({role,model,score:exactAxes?0:2});
    }
  }
  if(!candidates.length)return null;
  candidates.sort((a,b)=>a.score-b.score||a.model.axes.length-b.model.axes.length);
  return candidates[0].role;
}
function v15Pack(...args){return encodeURIComponent(JSON.stringify(args.map(x=>String(x??''))));}
function v15Unpack(s){try{const a=JSON.parse(decodeURIComponent(String(s||'')));return Array.isArray(a)?a:[];}catch{return [];}}
function v19NormalizeDim(d){
  if(!d||!d.axis)return null;
  const kind=(d.kind==='typed'||d.typedValue!==undefined)?'typed':'explicit';
  if(kind==='typed'){
    return {axis:String(d.axis),kind:'typed',member:'',typedDomainRef:String(d.typedDomainRef||d.typedQName||''),typedQName:String(d.typedQName||d.typedDomainRef||''),typedValue:String(d.typedValue??'')};
  }
  return {axis:String(d.axis),kind:'explicit',member:String(d.member||''),typedValue:undefined};
}
function v19DimensionSignature(dims){
  return JSON.stringify((dims||[]).map(v19NormalizeDim).filter(d=>d&&d.axis&&((d.kind==='typed'&&d.typedValue!=='')||(d.kind==='explicit'&&d.member!==''))
    ).sort((a,b)=>String(a.axis).localeCompare(String(b.axis))||String(a.kind).localeCompare(String(b.kind))||String(a.member||a.typedValue||'').localeCompare(String(b.member||b.typedValue||'')))
    .map(d=>d.kind==='typed'?[d.axis,'T',d.typedDomainRef||d.typedQName||'',d.typedValue]:[d.axis,'E',d.member]));
}
function v15DimKey(dims){return v19DimensionSignature(dims);}
function v19FactKey(concept,context){return `${concept}|${contextSignature(context||{})}`;}
function v15Rows(role,tableId){
  state.dimTables=state.dimTables||{};
  const key=`${role}::${tableId}`;
  if(!Array.isArray(state.dimTables[key])){
    const legacy=Array.isArray(state.dimTables[role])?state.dimTables[role]:[];
    const model=v15TableModels(role).find(t=>t.id===tableId);
    if(legacy.length&&model){
      state.dimTables[key]=legacy.map((r,i)=>({id:r.id||`T${i+1}`,dimensions:(r.dimensions||[]).map(v19NormalizeDim).filter(Boolean),lineItems:{...(r.current||{}),...(r.prior||{})},current:{...(r.current||{})},prior:{...(r.prior||{})},richText:{...(r.richText||{})},priorRichText:{...(r.priorRichText||{})},decimals:{...(r.decimals||{})},priorDecimals:{...(r.priorDecimals||{})},sourceFactKeys:[...(r.sourceFactKeys||[])]}));
    }else state.dimTables[key]=[];
  }
  return state.dimTables[key];
}
function v15EnsureTableRow(role,tableId,dims,kind='prior'){
  const rows=v15Rows(role,tableId),sig=v15DimKey(dims);
  let row=rows.find(r=>v15DimKey(r.dimensions)===sig);
  if(!row){row={id:`T${rows.length+1}`,dimensions:(dims||[]).map(v19NormalizeDim).filter(Boolean),lineItems:{},current:{},prior:{},richText:{},priorRichText:{},decimals:{},priorDecimals:{},sourceFactKeys:[]};rows.push(row);}
  row.lineItems=row.lineItems||{};row.current=row.current||{};row.prior=row.prior||{};row.richText=row.richText||{};row.priorRichText=row.priorRichText||{};
  return row;
}
function v15GeneratedTypedValue(axis,model,rows){
  const base=String(axis?.element?.typedDomainRef||axis?.q||'').split(':').pop().replace(/Domain$/i,'')||'Member';
  const prefix=/Director/i.test(base)?'_Director_':/PrincipalProduct/i.test(base)?'_PrincipalProductOrPrincipalService_':/Promoter/i.test(base)?'_Promoters_':/_Member$/.test(base)?'_Member_':'_AutoMember_';
  const used=new Set((rows||[]).flatMap(r=>(r.dimensions||[]).filter(d=>d.axis===axis.q&&d.kind==='typed').map(d=>String(d.typedValue||''))));
  let n=1;while(used.has(prefix+n))n++;
  return prefix+n;
}
function v15NextAxisDimension(axis,model,rows){
  if(axis?.element?.typedDomainRef)return {axis:axis.q,member:'',kind:'typed',typedValue:v15GeneratedTypedValue(axis,model,rows),typedQName:axis.element.typedDomainRef,typedDomainRef:axis.element.typedDomainRef};
  const used=new Set((rows||[]).flatMap(r=>(r.dimensions||[]).filter(d=>d.axis===axis.q&&d.kind!=='typed').map(d=>d.member)).filter(Boolean));
  const candidates=axis?.topMembers?.length?axis.topMembers:axis?.members||[];
  const next=candidates.find(m=>!used.has(m.q))||candidates[0];
  return {axis:axis.q,member:next?.q||'',kind:'explicit'};
}
function v15CreateBlankTableRow(role,tableId){
  const model=v15TableModels(role).find(t=>t.id===tableId)||v15TableModels(role)[0];
  if(!model)return null;
  const rows=v15Rows(role,model.id);
  const row={id:`T${rows.length+1}`,dimensions:model.axes.map(a=>v15NextAxisDimension(a,model,rows)),lineItems:{},current:{},prior:{},richText:{},priorRichText:{},decimals:{},priorDecimals:{},sourceFactKeys:[]};
  rows.push(row);markDirty();return row;
}
function v15CreatePrimaryMemberRows(role,tableId){
  const model=v15TableModels(role).find(t=>t.id===tableId);if(!model||!model.axes.length)return;
  const axis=model.axes[0],rows=v15Rows(role,model.id),existing=new Set(rows.map(r=>r.dimensions?.find(d=>d.axis===axis.q)?.member).filter(Boolean));
  for(const m of (axis.topMembers?.length?axis.topMembers:axis.members)){if(existing.has(m.q))continue;const row={id:`T${rows.length+1}`,dimensions:model.axes.map(a=>a.q===axis.q?({axis:a.q,member:m.q,kind:'explicit'}):v15NextAxisDimension(a,model,rows)),lineItems:{},current:{},prior:{},richText:{},priorRichText:{},decimals:{},priorDecimals:{},sourceFactKeys:[]};rows.push(row);existing.add(m.q);}
  markDirty();render();toast(`Created ${rows.length} table instances for the primary-axis members. Complete only the combinations that apply to the financial statements.`);
}
function v15DeleteTableRow(role,tableId,index){const rows=v15Rows(role,tableId);rows.splice(index,1);rows.forEach((r,i)=>r.id=`T${i+1}`);markDirty();render();}
function v15TableHasValues(row){return Object.values(row.current||{}).some(nonblank)||Object.values(row.prior||{}).some(nonblank)||Object.values(row.richText||{}).some(nonblank)||Object.values(row.priorRichText||{}).some(nonblank);}
function v15InputForLine(role,tableId,rowIndex,li,kind){
  const row=v15Rows(role,tableId)[rowIndex], e=li.element, src=kind==='prior'?row.prior:row.current;
  const val=src?.[li.q]??'';
  const bad=state.cellIssues?.[li.q];
  if(li.abstract)return `<div class="v15-abstract" style="padding-left:${Math.min(48,Math.max(0,(li.depth||0)*8))}px"><b>${esc(li.label)}</b></div>`;
  const prefix=`data-v15-cell="${esc(v15Pack(role,tableId,rowIndex,kind,li.q))}"`;
  if(isRichTextConcept(e)){
    const html=kind==='prior'?(row.priorRichText?.[li.q]||val):(row.richText?.[li.q]||val);
    return `<button class="rich-open v15-rich ${bad?'cell-invalid':''}" ${prefix} data-v15-rich="1">${html?esc(stripHtml(html).slice(0,150)):'Click to enter formatted text…'}</button><div class="hint">Text Block • rich text editor</div>`;
  }
  if(isBooleanConcept(e)){
    return `<select class="fact-select ${bad?'cell-invalid':''}" ${prefix} data-v15-value="1"><option value="" ${val===''?'selected':''}>Select…</option><option value="true" ${String(val).toLowerCase()==='true'?'selected':''}>Yes</option><option value="false" ${String(val).toLowerCase()==='false'?'selected':''}>No</option></select>`;
  }
  return `<input class="auto-grow ${bad?'cell-invalid':''}" ${prefix} data-v15-value="1" value="${esc(val)}" placeholder="Enter value">`;
}
function v15TableInstance(role,model,row,index,fy,py){
  const axisHtml=model.axes.map(a=>{
    const d=row.dimensions?.find(x=>x.axis===a.q)||{};
    const isTyped=d.kind==='typed'||a.element?.typedDomainRef;
    const label=isTyped?(d.typedValue||'Auto-generated member'):(a.members.find(m=>m.q===d.member)?.label||d.member||'Auto-assigned member');
    return `<div class="field v15-generated-axis"><label>${esc(a.label)}</label><div class="generated-axis-value" aria-label="${esc(a.label)}">${esc(label)}</div><div class="hint">${isTyped?'Generated by software; not a user input.':'Taxonomy member assigned by the table engine; not a user input.'}</div></div>`;
  }).join('');
  const body=model.lineItems.map(li=>`<tr data-v15-line="${esc(li.q)}"><td style="min-width:360px;padding-left:${Math.min(48,Math.max(0,(li.depth-model.lineItems[0]?.depth||0)*10))}px"><div><span>${esc(li.label)}</span></div>${!li.abstract?`<div class="hint code">${esc(li.q)} • ${esc(li.element.type||'')}</div>`:''}</td><td>${v15InputForLine(role,model.id,index,li,'current')}</td><td>${v15InputForLine(role,model.id,index,li,'prior')}</td></tr>`).join('');
  const desc=row.dimensions?.filter(d=>d.member).map(d=>{const a=model.axes.find(x=>x.q===d.axis),m=a?.members.find(x=>x.q===d.member);return `${a?.label||d.axis}: ${m?.label||d.member}`}).join(' • ')||'No member combination selected yet';
  return `<div class="card v15-table-instance"><div class="v15-instance-head"><div><h3>Table instance ${index+1}</h3><div class="hint">${esc(desc)}</div></div><div class="toolbar"><button class="smallbtn" data-v15-save="${esc(v15Pack(role,model.id,index))}">Save table</button><button class="smallbtn" data-v15-delete="${esc(v15Pack(role,model.id,index))}">Delete</button></div></div><div class="grid cols3 v15-axis-grid">${axisHtml}</div><div class="table-wrap"><table class="data-table v15-line-table"><thead><tr><th>Line item / heading</th><th>${esc(fy)} <div class="hint">Current filing</div></th><th>${esc(py)} <div class="hint">Imported comparison</div></th></tr></thead><tbody>${body}</tbody></table></div><div class="hint">This block is one taxonomy-defined member combination. All line items belonging to the table are displayed; blank means no fact has been entered/imported.</div></div>`;
}
function v15TableCard(role,model,fy,py){
  let rows=v15Rows(role,model.id);
  if(!model.axes.length&&!rows.length)rows.push({id:'T1',dimensions:[],lineItems:{},current:{},prior:{},richText:{},priorRichText:{}});
  const tableDomId=`v15-table-${btoa(unescape(encodeURIComponent(model.id))).replace(/[^A-Za-z0-9_-]/g,'_')}`;
  const axisHeaders=model.axes.map(a=>`<th class="v15-axis-head">${esc(a.label)}<div class="hint">Dimension / member</div></th>`).join('');
  const lineHeaders=model.lineItems.map(li=>`<th colspan="2" class="v15-horizontal-head">${esc(li.label)}<div class="hint">${esc(li.q)}</div><span>${esc(fy)} / ${esc(py)}</span></th>`).join('');
  const body=rows.length?rows.map((r,i)=>v15TableInstance(role,model,r,i,fy,py)).join(''):`<tr><td colspan="${model.axes.length+model.lineItems.length*2+1}" class="empty">No member combination has been created yet. Add a row or import an XML instance.</td></tr>`;
  return `<details class="card v15-table-card v15-table-engine" id="${esc(tableDomId)}">
    <summary class="v15-table-summary"><div><h2>${esc(model.label)}</h2><div class="hint code">${esc(model.tableQ)} • ${model.axes.length} axis${model.axes.length===1?'':'es'} • ${model.lineItems.length} line-item/heading entries</div></div><span class="status">Open table engine</span></summary>
    <div class="toolbar v15-table-toolbar">
      ${model.axes.length?`<button class="smallbtn primary" data-v15-add="${esc(v15Pack(role,model.id))}">Add row</button>${model.axes[0]?.members.length?`<button class="smallbtn" data-v15-primary="${esc(v15Pack(role,model.id))}">Create one row per ${esc(model.axes[0].label)}</button>`:''}`:'<span class="status">Non-dimensional table</span>'}
    </div>
    <div class="hint v15-table-help">Horizontal table layout: each imported/member combination is one row; taxonomy line items run across the columns, with Current and Previous Year values paired under each line item. This mirrors the CompuXBRL-style data-entry orientation while keeping the taxonomy model authoritative.</div>
    <div class="table-wrap v15-horizontal-wrap"><table class="data-table v15-horizontal-table"><thead><tr>${axisHeaders}${lineHeaders}<th>Actions / member summary</th></tr></thead><tbody>${body}</tbody></table></div>
  </details>`;
}
function v15NormalRows(role){
  const tableModels=v15TableModels(role),tableConcepts=new Set(tableModels.flatMap(t=>t.lineItems.map(li=>li.q)));
  const prs=(state.presentation||[]).filter(p=>p.role===role);
  return prs.filter(p=>{const q=`${p.prefix}:${p.name}`;if(tableConcepts.has(q))return false;const n=String(p.name||'');if(n.endsWith('Axis')||n.endsWith('Member')||/Table(?:\d+)?NotAll$/i.test(n)||n.endsWith('LineItems'))return false;return true;});
}
function v15GeneralInfoToggle(){
  if(generalInformationEnabled())return `<div class="card v15-optional-banner"><div><b>General Information is enabled for this filing.</b><div class="hint">The 400100 taxonomy classification is available but is not mandatory for FY 2014-15 onward under the supplied filing guidance. You may turn it off if you do not intend to report it.</div></div><button class="smallbtn" data-v15-general-toggle="off">Disable General Information</button></div>`;
  return `<div class="card v15-optional-banner"><div><b>General Information (400100) is optional in this workbench.</b><div class="hint">For a new filing, the section starts disabled. Enable it manually if you want to report the company/general-information concepts available in this taxonomy.</div></div><button class="smallbtn primary" data-v15-general-toggle="on">Enable General Information</button></div>`;
}
function openDimensionalTable(encoded){
  const parts=v15Unpack(encoded),role=parts[0],tableId=parts[1];
  const models=v15TableModels(role),model=models.find(m=>m.id===tableId);
  if(!model){toast('The taxonomy table could not be resolved.');return;}
  const id=`v15-table-${btoa(unescape(encodeURIComponent(model.id))).replace(/[^A-Za-z0-9_-]/g,'_')}`;
  const el=document.getElementById(id);
  if(!el){toast('The dimensional table engine is not rendered in this filing tab.');return;}
  el.open=true;el.scrollIntoView({behavior:'smooth',block:'start'});
  el.classList.add('v15-table-focus');setTimeout(()=>el.classList.remove('v15-table-focus'),1400);
}
function filingView(){
  const role=state.elrs[state.section]?.name||'';const fy=yearLabel(state.profile.fyStart,state.profile.fyEnd),py=priorYearLabel(state.profile.fyStart,state.profile.fyEnd);
  // Cash-flow method is a filing-level choice. Shared concepts must never
  // make both method-specific tabs look populated: only the selected ELR is
  // rendered, while the other tab is informational/inactive.
  if(!cashFlowRoleAllowed(role)){
    const selected=state.profile.cashFlowMethod||'the selected method';
    return `<div class="card cashflow-inactive"><h2>${esc(cashFlowRoleLabel(role))} cash-flow statement</h2><p class="hint">This filing is configured for <strong>${esc(selected)}</strong>. The ${esc(cashFlowRoleLabel(role))} tab is inactive, so imported cash-flow facts cannot appear in both Direct and Indirect statements.</p><div class="status">Inactive — ${esc(selected)} selected</div></div>`;
  }
  if(isGeneralInformationRole(role)&&!generalInformationEnabled())return `${v15GeneralInfoToggle()}<div class="card"><h2>General Information — optional section</h2><p class="hint">The taxonomy contains the 400100 classification. It is not forced on a new filing. If the company's filing needs these facts, enable the section above and the complete taxonomy presentation will appear.</p></div>`;
  const models=v15TableModels(role), normal=v15NormalRows(role);
  const tables=models.map(m=>v15TableCard(role,m,fy,py)).join('');
  const normalHtml=normal.length?`<div class="card"><div class="toolbar"><div class="grow"><b>${esc(role)}</b><div class="hint">Current filing: <strong>${esc(fy)}</strong> • comparison: <strong>${esc(py)}</strong>. Parent/totals may be calculated from taxonomy relationships unless manual parent entry is enabled.</div></div><span class="status" id="tabStatus">Not checked</span><button class="smallbtn primary" data-action="tabcheck">Pre-scrutiny this tab</button><button class="smallbtn" data-action="toggleParents">${state.manualParentsEnabled?'Lock parent cells':'Enable parent cells manually'}</button><button class="smallbtn" data-action="explainXbrl">Explain XBRL terms</button></div><div class="toolbar compact-help"><input class="search grow" id="tabSearch" placeholder="Find a line in this tab..."><span class="hint">Every applicable non-table concept remains in taxonomy presentation order.</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th style="width:44%">Line item / heading</th><th>${esc(fy)}<div class="hint">Current filing</div></th><th>${esc(py)}<div class="hint">Imported comparison</div></th><th>Taxonomy / input type</th><th></th></tr></thead><tbody>${normal.map((r,i)=>factRow(r,i,role)).join('')}</tbody></table></div></div>`:'';
  const intro=models.length?`<div class="card v15-model-intro"><h2>Taxonomy-defined disclosures</h2><p class="hint">This filing tab contains ${models.length} taxonomy table structure${models.length===1?'':'s'}. Each table is shown separately. Axes/members choose the context; the complete line-item tree stays visible below that combination.</p></div>`:'';
  return `${isGeneralInformationRole(role)?v15GeneralInfoToggle():''}${intro}${tables}${normalHtml||(!models.length?'<div class="card"><div class="empty">No filing presentation concepts were found for this ELR in the supplied taxonomy data.</div></div>':'')}`;
}

function v15OpenRich(role,tableId,rowIndex,kind,concept){
  const row=v15Rows(role,tableId)[rowIndex];const e=state.elements.find(x=>`${x.prefix}:${x.name}`===concept)||{};
  const store=kind==='prior'?(row.priorRichText?.[concept]||row.prior?.[concept]||''):(row.richText?.[concept]||row.current?.[concept]||'');
  modal(`<div class="modal-head"><div><h2>${esc(e.label||concept)}</h2><div class="hint code">${esc(concept)} • ${kind==='prior'?'Previous year':'Current year'} • table instance ${rowIndex+1}</div></div><button class="close" onclick="closeModal()">Close</button></div><div class="rich-toolbar"><select id="richStyle"><option value="normalText">Normal text</option><option value="header1">Header 1</option><option value="header2">Header 2</option><option value="header3">Header 3</option><option value="header4">Header 4</option><option value="header5">Header 5</option><option value="noteText1">Note 1</option><option value="noteText2">Note 2</option><option value="noteText3">Note 3</option><option value="noteText4">Note 4</option><option value="highlightedText1">Highlighted 1</option><option value="highlightedText2">Highlighted 2</option><option value="highlightedText3">Highlighted 3</option><option value="highlightedText4">Highlighted 4</option><option value="numericValue">Numeric value</option><option value="nonNumericValue">Non-numeric value</option></select><button type="button" onclick="richApplyClass()">Apply class</button><button type="button" onclick="richCmd('justifyLeft')">Left</button><button type="button" onclick="richCmd('justifyCenter')">Center</button><button type="button" onclick="richCmd('justifyRight')">Right</button><button type="button" onclick="insertSimpleTable()">Insert table</button><button type="button" onclick="richCmd('removeFormat')">Clear formatting</button><label class="paste-mode"><input id="plainPaste" type="checkbox"> Paste as plain text</label></div><div id="richEditor" class="rich-editor" contenteditable="true" spellcheck="true">${store}</div><div class="rich-help">Only MCA-permitted tags/classes can be saved. Nothing is silently stripped.</div><div class="modal-actions"><button class="smallbtn primary" onclick="v15SaveRich('${esc(role)}','${esc(tableId)}',${rowIndex},'${esc(kind)}','${esc(concept)}')">Validate &amp; save</button><button class="smallbtn" onclick="closeModal()">Close without saving</button></div>`);
  $('richEditor')?.addEventListener('paste',handleRichPaste);setTimeout(()=>$('richEditor')?.focus(),30);
}
function v15SaveRich(role,tableId,rowIndex,kind,concept){const html=$('richEditor')?.innerHTML||'',errs=validateMcaHtml(html);if(errs.length){showMcaHtmlValidation(html);return;}const row=v15Rows(role,tableId)[rowIndex];if(!row)return;if(kind==='prior'){row.priorRichText[concept]=html;row.prior[concept]=stripHtml(html);}else{row.richText[concept]=html;row.current[concept]=stripHtml(html);}markDirty();closeModal();render();toast('Formatted text saved to the table instance.');}

function v15WireTables(){
  document.querySelectorAll('[data-v15-value]').forEach(el=>el.addEventListener('input',()=>{const [role,tableId,idx,kind,concept]=v15Unpack(el.dataset.v15Cell);const row=v15Rows(role,tableId)[Number(idx)];if(!row)return;row[kind][concept]=el.value;markDirty();}));
  document.querySelectorAll('[data-v15-axis]').forEach(el=>el.addEventListener('change',()=>{const [role,tableId,idx,axis]=v15Unpack(el.dataset.v15Axis);const row=v15Rows(role,tableId)[Number(idx)];if(!row)return;row.dimensions=row.dimensions||[];let d=row.dimensions.find(x=>x.axis===axis);if(!d){d={axis,member:''};row.dimensions.push(d);}d.member=el.value;markDirty();render();}));
  document.querySelectorAll('[data-v15-typed-axis]').forEach(el=>el.addEventListener('input',()=>{
    const [role,tableId,idx,axis]=v15Unpack(el.dataset.v15TypedAxis),row=v15Rows(role,tableId)[Number(idx)];
    if(!row)return;row.dimensions=row.dimensions||[];let d=row.dimensions.find(x=>x.axis===axis);
    if(!d){d={axis,member:'',kind:'typed',typedValue:'',typedQName:'',typedDomainRef:''};row.dimensions.push(d);}
    d.kind='typed';d.member='';d.typedValue=el.value;
    const ae=v16TypedAxis(axis);if(ae){d.typedDomainRef=ae.typedDomainRef||'';d.typedQName=d.typedQName||ae.typedDomainRef||'';}
    markDirty();
  }));
  document.querySelectorAll('[data-v15-rich]').forEach(el=>el.addEventListener('click',()=>{const [role,tableId,idx,kind,concept]=v15Unpack(el.dataset.v15Cell);v15OpenRich(role,tableId,Number(idx),kind,concept);}));
  document.querySelectorAll('[data-v15-add]').forEach(b=>b.onclick=()=>{const [role,tableId]=v15Unpack(b.dataset.v15Add);v15CreateBlankTableRow(role,tableId);render();});
  document.querySelectorAll('[data-v15-primary]').forEach(b=>b.onclick=()=>{const [role,tableId]=v15Unpack(b.dataset.v15Primary);v15CreatePrimaryMemberRows(role,tableId);});
  document.querySelectorAll('[data-v15-delete]').forEach(b=>b.onclick=()=>{const [role,tableId,idx]=v15Unpack(b.dataset.v15Delete);v15DeleteTableRow(role,tableId,Number(idx));});
  document.querySelectorAll('[data-v15-save]').forEach(b=>b.onclick=()=>{const [role,tableId,idx]=v15Unpack(b.dataset.v15Save);const row=v15Rows(role,tableId)[Number(idx)];if(row){row.savedAt=new Date().toISOString();markDirty();persistNow();toast('Table instance saved.');}});
  document.querySelectorAll('[data-v15-open]').forEach(b=>b.onclick=()=>openDimensionalTable(b.dataset.v15Open));
  document.querySelectorAll('[data-v15-general-toggle]').forEach(b=>b.onclick=()=>{state.profile.generalInfoEnabled=b.dataset.v15GeneralToggle==='on';markDirty();renderTabs();render();toast(state.profile.generalInfoEnabled?'General Information enabled for this filing.':'General Information disabled for this filing.');});
}
function baseWire(){
  document.querySelectorAll('[data-bind]').forEach(el=>{el.oninput=()=>setPath(el.dataset.bind,el.value);});
  document.querySelectorAll('[data-fact]').forEach(el=>{el.oninput=()=>{const k=el.dataset.fact;if(k.startsWith('prior:')){state.prior[k.slice(6)]=el.value;growInput(el);clearCellIssue(k.slice(6));propagatePriorLinks(k.slice(6));autoCalculateParents('prior');markDirty();return;}state.values[k]=el.value;growInput(el);clearCellIssue(k);propagateLinks(k);autoCalculateParents('current');markDirty();};});
  document.querySelectorAll('[data-prior]').forEach(el=>{el.oninput=()=>{const k=el.dataset.prior;state.prior[k]=el.value;growInput(el);clearCellIssue(k);propagatePriorLinks(k);autoCalculateParents('prior');markDirty();};growInput(el);});
  document.querySelectorAll('[data-tag]').forEach(b=>b.onclick=()=>showTag(b.dataset.tag));
  document.querySelectorAll('[data-rich]').forEach(b=>b.onclick=()=>showRichTextEditor(b.dataset.rich));
  document.querySelectorAll('[data-context]').forEach(el=>el.oninput=()=>{state.contexts[+el.dataset.context][el.dataset.field]=el.value;markDirty();});
  document.querySelectorAll('[data-unit]').forEach(el=>el.oninput=()=>{state.units[+el.dataset.unit][el.dataset.field]=el.value;markDirty();});
  document.querySelectorAll('[data-foot]').forEach(el=>el.oninput=()=>{state.footnotes[+el.dataset.foot][el.dataset.field]=el.value;markDirty();});
  $('taxonomySearch')?.addEventListener('input',e=>searchTax(e.target.value));$('tabSearch')?.addEventListener('input',e=>filterTabRows(e.target.value));$('ruleSearch')?.addEventListener('input',e=>{$('ruleResults').innerHTML=ruleResults(state.rules['Specific rules for elements']||[],e.target.value);});
  document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>actions(b.dataset.action));document.querySelectorAll('[data-error]').forEach(b=>b.onclick=()=>correctionNavigate(b.dataset.error));
  v15WireTables();
}

/* Keep 400100 available but optional. */
function evaluateElrApplicabilityRules(){
  if(isGeneralInformationRole(state.elrs[state.section]?.name)&&generalInformationEnabled()){
    // Enabled means the user explicitly elected to report the available 400100
    // taxonomy section. Its specific facts are then checked normally.
  }
  if(state.profile.financialStatements==='Standalone'){
    for(const k of Object.keys(state.values))if(/MinorityInterest/i.test(k)&&nonblank(state.values[k]))addRuleError('Standalone/consolidated applicability',k,'Minority interest is a consolidated-reporting disclosure under the supplied business-rule material.','Review and remove the fact for a standalone filing when not applicable.');
  }
}
function evaluateDimensionalTableRules(){
  for(const model of v15AllTableModels()){
    const rows=v15Rows(model.role,model.id),axisSets=new Map(model.axes.map(a=>[a.q,new Set(a.members.map(m=>m.q))])),lineSet=new Set(model.lineItems.map(li=>li.q));
    for(const row of rows){
      const dims=row.dimensions||[],hasVal=v15TableHasValues(row);
      if(isGeneralInformationRole(model.role)&&!generalInformationEnabled()&&hasVal)addRuleError('MCA 400100 optional-section control',`${model.role}:${row.id||''}`,'General Information is disabled for this filing, but data exists in its table model.','Enable General Information on the 400100 filing tab or clear the 400100 data.');
      const seen=new Set();
      for(const d of dims){
        if(!d.axis||!d.member){if(hasVal)addRuleError('V15 dimensional context completeness',`${model.role}:${row.id||''}`,'A populated table instance must have a complete axis/member selection.','Select a valid member for every axis before generating XML.');continue;}
        if(seen.has(d.axis))addRuleError('V15 dimensional axis uniqueness',`${model.role}:${row.id||''}`,`Axis ${d.axis} is repeated in one table context.`,'Keep one explicit member per axis.');seen.add(d.axis);
        if(!axisSets.has(d.axis))addRuleError('V15 dimensional axis validity',`${model.role}:${row.id||''}`,`Axis ${d.axis} is not part of this taxonomy table.`,'Select a member from a displayed axis.');
        else if(!axisSets.get(d.axis).has(d.member))addRuleError('V15 dimensional member validity',`${model.role}:${row.id||''}`,`Member ${d.member} is not valid for axis ${d.axis} in this table.`,'Select a member from the taxonomy-controlled dropdown.');
        if(/DefaultMember$/i.test(d.member))addRuleError('V15 default-member rule',`${model.role}:${row.id||''}`,`Default member ${d.member} must not be explicitly reported.`,'Remove the default member from the context.');
      }
      for(const k of Object.keys(row.current||{}).concat(Object.keys(row.prior||{}))){if(!lineSet.has(k))addRuleError('V15 table line-item validity',`${model.role}:${row.id||''}`,`Concept ${k} is not part of this table's line-item tree.`,'Enter data only in the displayed taxonomy line items.');}
    }
  }
}
function evaluateTaxonomyCalculations(){
  // Only the preferred taxonomy formula for a QName is used. A QName can appear in
  // more than one ELR (for example CashAndCashEquivalents appears in the balance
  // sheet notes and cash-flow notes). Unioning children across roles double-counts
  // shared values, so validation mirrors autoCalculateParents().
  const checked=new Set();
  for(const kind of ['current','prior']){
    const src=kind==='prior'?state.prior:state.values;
    const parents=[...calculationParents()];
    for(const pk of parents){
      const def=preferredCalculationCandidate(pk,kind);
      if(!def?.children?.length)continue;
      const nums=def.children.map(c=>({q:c.q,v:num(src?.[c.q]),w:num(c.weight)})).filter(x=>x.v!==null);
      const pv=num(src?.[pk]);
      if(pv===null||!nums.length)continue;
      const sum=Number(nums.reduce((a,x)=>a+x.v*(Number.isFinite(x.w)?x.w:1),0).toFixed(2));
      if(Math.abs(pv-sum)<=0.01)continue;
      const key=`${kind}|${pk}`;if(checked.has(key))continue;checked.add(key);
      const message=`${kind==='prior'?'Previous-year imported':'Current-year'} parent ${pk} is ${pv}, but its selected calculation ${def.role} totals ${sum}.`;
      const correction='Open Tag / details for this field to review or edit the selected source columns and calculation weights.';
      if(kind==='prior')state.warnings.push({rule:'Calculation linkbase consistency — imported previous year',concept:pk,message,correction});
      else addRuleError('Calculation linkbase consistency',pk,message,correction);
    }
  }
  // Preserve the existing table-instance calculations, but only within their own
  // taxonomy role/table so a shared QName cannot mix unrelated ELR formulas.
  for(const model of v15AllTableModels()){
    const arr=(state.calculations||[]).filter(c=>c.role===model.role),lineSet=new Set(model.lineItems.map(li=>li.q));
    for(const row of v15Rows(model.role,model.id)){
      for(const kind of ['current','prior']){
        const src=kind==='prior'?row.prior||{}:row.current||{};
        for(let i=0;i<arr.length;i++){
          const p=arr[i],pd=Number(p.depth),pk=`${p.prefix}:${p.name}`;if(!lineSet.has(pk)||!Number.isFinite(pd))continue;
          const children=[];for(let j=i+1;j<arr.length;j++){const x=arr[j],xd=Number(x.depth);if(!Number.isFinite(xd))continue;if(xd<=pd)break;if(xd===pd+1&&lineSet.has(`${x.prefix}:${x.name}`))children.push(x);}
          if(!children.length)continue;const pv=num(src[pk]);if(pv===null)continue;const nums=children.map(c=>({v:num(src[`${c.prefix}:${c.name}`]),w:num(c.weight)})).filter(x=>x.v!==null);if(!nums.length)continue;const sum=Number(nums.reduce((a,x)=>a+x.v*(Number.isFinite(x.w)?x.w:1),0).toFixed(2));if(Math.abs(pv-sum)>0.01)addRuleError('V21 dimensional calculation consistency',`${model.role}:${row.id}:${pk}`,`Parent ${pk} does not equal the weighted child total ${sum}.`,'Review the line-item values and taxonomy calculation weights for this table instance.');
        }
      }
    }
  }
}

/* Import the latest source reporting year into Previous Year, but construct a
   complete table instance around every distinct dimensional context. */
function baseImportXmlRaw(file){
  const reader=new FileReader();reader.onload=()=>{const diagnostics=[],detail=[];try{
    const text=String(reader.result||'');if(!text.trim())throw new Error('The selected file is empty.');
    const xml=new DOMParser().parseFromString(text,'application/xml');const parserError=xml.getElementsByTagName('parsererror')[0];if(parserError)throw new Error('XML parser error: '+(parserError.textContent||'Malformed XML').replace(/\s+/g,' ').trim());
    const root=xml.documentElement;if(!root)throw new Error('The file has no XML document element.');
    const xbrli='http://www.xbrl.org/2003/instance',link='http://www.xbrl.org/2003/linkbase',xbrldi='http://xbrl.org/2006/xbrldi';
    const contextNodes=[...xml.getElementsByTagNameNS(xbrli,'context')],unitNodes=[...xml.getElementsByTagNameNS(xbrli,'unit')],contextIds=new Set(contextNodes.map(c=>c.getAttribute('id')).filter(Boolean));
    const prefixByNs={};for(const a of [...root.attributes])if(a.name.startsWith('xmlns:'))prefixByNs[a.value]=a.name.slice(6);
    const importedContexts=contextNodes.map(c=>{const ent=c.getElementsByTagNameNS(xbrli,'identifier')[0],per=c.getElementsByTagNameNS(xbrli,'period')[0];const start=per?.getElementsByTagNameNS(xbrli,'startDate')[0]?.textContent||'',end=per?.getElementsByTagNameNS(xbrli,'endDate')[0]?.textContent||'',instant=per?.getElementsByTagNameNS(xbrli,'instant')[0]?.textContent||'';const dims=[...c.getElementsByTagNameNS(xbrldi,'explicitMember')].map(d=>({axis:(d.getAttribute('dimension')||'').trim(),member:(d.textContent||'').trim(),kind:'explicit'}));const typed=[...c.getElementsByTagNameNS(xbrldi,'typedMember')].map(tm=>{const axis=(tm.getAttribute('dimension')||'').trim();const child=[...tm.children][0];const typedQName=child?.prefix&&child?.localName?`${child.prefix}:${child.localName}`:(child?.localName||'');const typedDomainRef=(state.elements.find(e=>`${e.prefix}:${e.name}`===axis)||{}).typedDomainRef||'';return {axis,member:'',kind:'typed',typedValue:(child?.textContent||tm.textContent||'').trim(),typedQName,typedDomainRef};});return {id:c.getAttribute('id')||'',entity:ent?.textContent||'',scheme:ent?.getAttribute('scheme')||'',start,end,instant,dimensions:[...dims,...typed]};});
    state.importedContexts=importedContexts;state.importedUnits=unitNodes.map(u=>({id:u.getAttribute('id')||'',measure:u.getElementsByTagNameNS(xbrli,'measure')[0]?.textContent||'',divide:!!u.getElementsByTagNameNS(xbrli,'divide')[0]}));
    const dateYears=importedContexts.flatMap(c=>[c.end,c.instant]).filter(Boolean).map(x=>Number(String(x).slice(0,4))).filter(Number.isFinite);const sourceYear=dateYears.length?Math.max(...dateYears):null;
    const importedCin=importedContexts.map(c=>String(c.entity||'').trim().toUpperCase()).find(Boolean);if(importedCin){if(!String(state.profile.cin||'').trim()){state.profile.cin=importedCin;diagnostics.push(`Filing CIN was auto-populated from the imported XML context: ${importedCin}.`);}else if(importedCin!==String(state.profile.cin).trim().toUpperCase())diagnostics.push(`Imported XML CIN ${importedCin} differs from current filing CIN ${String(state.profile.cin).trim().toUpperCase()}. Imported data is retained for review; the filing profile was not overwritten.`);}
    const facts=[...root.children].filter(n=>n.namespaceURI&&n.localName&&!['schemaRef','context','unit','footnoteLink'].includes(n.localName));
    const cashMethodFact=facts.find(n=>String(n.localName||'')==='TypeOfCashFlowStatement'&&String(n.textContent||'').trim());
    if(cashMethodFact){
      const rawMethod=String(cashMethodFact.textContent||'').trim();
      if(/indirect/i.test(rawMethod))state.profile.cashFlowMethod='Indirect Method';
      else if(/direct/i.test(rawMethod))state.profile.cashFlowMethod='Direct Method';
      if(state.profile.cashFlowMethod)diagnostics.push(`Cash flow method detected from imported XML: ${state.profile.cashFlowMethod}. Only that method-specific filing tab is populated/displayed.`);
    }
    const cashFactAllowed=k=>{
      const roles=(state.presentation||[]).filter(p=>`${p.prefix}:${p.name}`===k).map(p=>String(p.role||''));
      const cashRoles=roles.filter(r=>/Cash flow statement,\s*(direct|indirect)\b/i.test(r));
      return !cashRoles.length||cashRoles.some(r=>cashFlowRoleAllowed(r));
    };
    const roundingFact=facts.find(n=>String(n.localName||'')==='LevelOfRoundingUsedInFinancialStatements'&&String(n.textContent||'').trim());
    if(roundingFact){
      const rawRounding=String(roundingFact.textContent||'').trim();
      const detectedScale=v18RoundingToScale(rawRounding);
      state.profile.inputScale=detectedScale;
      state.values[V18_C.rounding]=v18ScaleToRounding(detectedScale);
      diagnostics.push(`Financial-statement rounding level detected from imported XML: ${v18ScaleToRounding(detectedScale)}. Financial figures will be displayed and edited in that scale, and XML export will preserve the selected scale.`);
    }
    state.prior={};state.priorFacts={};state.historicalFacts={};state.factOccurrences={current:[],prior:[]};
    state.xbrlStore={version:1,source:'import',sourceYear,contexts:importedContexts,units:state.importedUnits,facts:[],factIndex:{}};
    state.dimTables={};state._v18PriorImportedFacts={};state.priorCalculated={};let count=0,rawFactCount=0,trueDuplicate=0,multiple=0,unknown=0;const factsBySig=new Map();
    for(const n of facts){const ns=n.namespaceURI||'',prefix=prefixByNs[ns]||n.prefix||'',k=prefix?`${prefix}:${n.localName}`:n.localName,txt=(n.textContent||'').trim(),ctxId=n.getAttribute('contextRef')||'';if(!txt)continue;const c=importedContexts.find(x=>x.id===ctxId);const fy=Number(String(c?.end||c?.instant||'').slice(0,4));
      rawFactCount++;const e=state.elements.find(x=>`${x.prefix}:${x.name}`===k);if(!e)unknown++;const occ={value:txt,contextRef:ctxId,context:c||null,unitRef:n.getAttribute('unitRef')||'',decimals:n.getAttribute('decimals')||'',sourceOrder:state.xbrlStore.facts.length,xmlName:n.nodeName};
      const factKey=v19FactKey(k,c||{});
      const factRecord={key:factKey,concept:k,value:txt,contextRef:ctxId,context:c||null,unitRef:occ.unitRef,decimals:occ.decimals,sourceOrder:occ.sourceOrder};
      state.xbrlStore.facts.push(factRecord);
      (state.xbrlStore.factIndex[factKey]??=[]).push(factRecord);
      (state.priorFacts[k]??=[]).push(occ);
      if(!e)continue;
      const sig=`${k}|${contextSignature(c||{})}`;if(factsBySig.has(sig))trueDuplicate++;else{if([...factsBySig.keys()].some(s=>s.startsWith(k+'|')))multiple++;factsBySig.set(sig,occ);}
      if(sourceYear&&fy!==sourceYear){(state.historicalFacts[k]??=[]).push(occ);continue;} count++;
      if(!cashFactAllowed(k)){(state.historicalFacts[`${k}::inactiveCashFlowMethod`]??=[]).push(occ);continue;}
      if(c?.dimensions?.length){const dims=(c.dimensions||[]).map(v16NormalizeDim).filter(d=>d&&d.axis&&(d.kind==='typed'?nonblank(d.typedValue):nonblank(d.member)));const role=v15RoleForFact(k,dims);if(role){const model=v15TableForDimensions(role,dims,k);if(model){const row=v15EnsureTableRow(role,model.id,dims,'prior');row.prior[k]=scaledForEntry(txt,e);row.priorDecimals=row.priorDecimals||{};row.priorDecimals[k]=n.getAttribute('decimals')||'';row.sourceFactKeys=row.sourceFactKeys||[];if(!row.sourceFactKeys.includes(factKey))row.sourceFactKeys.push(factKey);if(isRichTextConcept(e))row.priorRichText[k]=txt;row._lineItem=k;continue;}}}
      const candidates=v15AllTableModels().filter(m=>m.axes.length===0&&m.lineItems.some(li=>li.q===k));if(candidates.length===1){const row=v15EnsureTableRow(candidates[0].role,candidates[0].id,[],'prior');row.prior[k]=scaledForEntry(txt,e);if(isRichTextConcept(e))row.priorRichText[k]=txt;continue;}
      state.prior[k]=scaledForEntry(txt,e);state.factOccurrences.prior.push({concept:k,value:scaledForEntry(txt,e),contextId:ctxId,context:c||null});if(isRichTextConcept(e))state.priorRichText[k]=txt;
    }
    // Preserve the company name when it is available in a standard company-name fact.
    if(!String(state.profile.companyName||'').trim())for(const n of facts){const ns=n.namespaceURI||'',prefix=prefixByNs[ns]||n.prefix||'',k=prefix?`${prefix}:${n.localName}`:n.localName;if(/NameOfCompany$/i.test(k)&&String(n.textContent||'').trim()){state.profile.companyName=String(n.textContent).trim();diagnostics.push(`Company name was auto-populated from imported XML fact ${k}.`);break;}}
    const generalRoleConcepts=new Set((state.presentation||[]).filter(p=>isGeneralInformationRole(p.role)).map(p=>`${p.prefix}:${p.name}`));if(facts.some(n=>{const ns=n.namespaceURI||'',prefix=prefixByNs[ns]||n.prefix||'',k=prefix?`${prefix}:${n.localName}`:n.localName;return generalRoleConcepts.has(k)&&String(n.textContent||'').trim();}))state.profile.generalInfoEnabled=true;
    const sourceYears=[...new Set(importedContexts.flatMap(c=>[c.end,c.instant]).filter(Boolean).map(x=>String(x).slice(0,4)))];
    diagnostics.push(roundingFact?`Rounding level preserved: ${v18ScaleToRounding(state.profile.inputScale)}.`:'No LevelOfRoundingUsedInFinancialStatements fact was found; rounding remains at Actual.')
    diagnostics.push(state.profile.cashFlowMethod?`Imported cash-flow method: ${state.profile.cashFlowMethod}. Direct and indirect projections are mutually exclusive.`:'The imported XML did not expose a recognizable cash-flow method fact; cash-flow projection was not method-filtered.');
    diagnostics.push(sourceYears.length?`Source XML reporting years detected: ${sourceYears.join(', ')}. Data from the latest source reporting year ending ${sourceYear||'unknown'} has been placed in the Previous Year comparison. Your current filing FY was not changed; select it manually on the Dashboard.`:'No reporting-year dates were detected in the imported contexts.');
    diagnostics.push(`Imported ${count} non-empty fact occurrence(s) into the filing projection; ${state.xbrlStore.facts.length} total source fact occurrence(s) are retained losslessly in the canonical XBRL store. ${trueDuplicate} exact concept/context duplicate occurrence(s) were detected; ${multiple} additional occurrences use different contexts or dimensions and are retained separately.`);
    diagnostics.push(`Imported ${unitNodes.length} XBRL unit definition(s). A unit describes the measurement (for example INR or shares); it is not a presentation scale such as thousands or lakhs.`);
    diagnostics.push(`Dimensional table instances reconstructed: ${Object.values(state.dimTables).reduce((a,r)=>a+(Array.isArray(r)?r.length:0),0)}. Each imported member combination now exposes the complete taxonomy line-item structure.`);
    if(unknown)diagnostics.push(`${unknown} imported fact(s) could not be matched to the loaded C&I taxonomy and were retained in the import occurrence review data.`);
    state._v18PriorImportedFacts=Object.fromEntries(Object.keys(state.prior||{}).map(k=>[k,true]));
    state.importDiagnostics=diagnostics;markDirty();synchronizeAll();state._v18ImportRunning=false;state._v18ImportFinishedAt=Date.now();hideBusy();try{render();}catch(renderErr){const msg=`Post-import render error: ${renderErr?.message||String(renderErr)}`;state.importDiagnostics=[...state.importDiagnostics,msg];diagnostics.push(msg);detail.push(msg);try{console.error(renderErr);}catch{}}hideBusy();showImportDiagnostics(file.name,count,diagnostics,detail,importedContexts.length,unitNodes.length,rawFactCount,sourceYear);
  }catch(e){state.importDiagnostics=[e?.message||String(e)];state._v18ImportRunning=false;state._v18ImportFinishedAt=Date.now();hideBusy();showImportDiagnostics(file.name,0,state.importDiagnostics,[],state.importedContexts?.length||0,state.importedUnits?.length||0,0,null);}};reader.readAsText(file);
}
function showImportDiagnostics(name,count,diagnostics,detail,contextCount,unitCount,rawFactCount=0,sourceYear=null){
  const list=diagnostics.length?`<ul>${diagnostics.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p class="success">No structural import problems were detected.</p>';
  const details=detail.length?`<div class="card" style="box-shadow:none"><h3>Technical details</h3><div class="diagnostic-list">${detail.map(x=>`<div>${esc(x)}</div>`).join('')}</div></div>`:'';
  const factsStatus=count?`<p class="success">${count.toLocaleString()} non-empty fact value(s) were mapped from the latest detected source reporting year${sourceYear?` (${esc(String(sourceYear))})`:''}. Across all source years, ${rawFactCount.toLocaleString()} non-empty facts were read.</p>`:`<p class="danger">No fact value was mapped to the latest detected source reporting year${sourceYear?` (${esc(String(sourceYear))})`:''}. Across all source years, ${rawFactCount.toLocaleString()} non-empty facts were read.</p>`;
  modal(`<div class="modal-head"><div><h2>Previous-year XML import report</h2><div class="hint">${esc(name)}</div></div><button class="close" onclick="closeModal()">Close</button></div><div class="import-summary"><div><b>${count.toLocaleString()}</b><span>latest-year facts imported</span></div><div><b>${rawFactCount.toLocaleString()}</b><span>non-empty facts read</span></div><div><b>${contextCount}</b><span>contexts</span></div><div><b>${unitCount}</b><span>units</span></div><div><b>${state.elements.length}</b><span>taxonomy concepts available</span></div></div><div class="card" style="box-shadow:none;margin-top:12px"><h3>${count?'Import completed with review items':'Import completed with mapping review'}</h3>${factsStatus}${list}</div>${details}<div class="card" style="box-shadow:none"><h3>What happens next?</h3><p class="hint">Matched non-dimensional facts are shown in the <strong>Previous Year</strong> comparison column. Dimensional facts are shown in the <strong>Dimensional table editor</strong> for their filing tab. The source FY is informational; the current filing FY is not changed automatically.</p></div>`);
}
function validateGeneratedXml(xml){
  const issues=[];if(!xml)return ['No XML was generated.'];const d=new DOMParser().parseFromString(xml,'application/xml');if(d.getElementsByTagName('parsererror').length)return ['Generated XML is not well-formed.'];
  const root=d.documentElement,sr=d.getElementsByTagNameNS(LINK_NS,'schemaRef')[0];if(!sr||sr.getAttributeNS(XLINK_NS,'href')!==MCA_SCHEMA_REF)issues.push('schemaRef does not use the prescribed C&I 2016 XSD URI.');
  const contexts=[...d.getElementsByTagNameNS(XBRL_NS,'context')],units=[...d.getElementsByTagNameNS(XBRL_NS,'unit')],sigs=new Set();
  for(const c of contexts){const id=c.getAttribute('id'),ident=c.getElementsByTagNameNS(XBRL_NS,'identifier')[0];if(!ident||ident.getAttribute('scheme')!==MCA_CIN_SCHEME||ident.textContent.trim()!==String(state.profile.cin).trim())issues.push(`Context ${id} has an invalid MCA CIN identifier.`);if(c.getElementsByTagNameNS(XBRL_NS,'segment').length)issues.push(`Context ${id} contains a segment, which is not allowed.`);const sc=c.getElementsByTagNameNS(XBRL_NS,'scenario')[0];const dims=[...c.getElementsByTagNameNS(XBRLDI_NS,'explicitMember')].map(m=>({axis:m.getAttribute('dimension'),member:m.textContent.trim()}));const sig=JSON.stringify([c.getElementsByTagNameNS(XBRL_NS,'startDate')[0]?.textContent||'',c.getElementsByTagNameNS(XBRL_NS,'endDate')[0]?.textContent||'',c.getElementsByTagNameNS(XBRL_NS,'instant')[0]?.textContent||'',dims.sort((a,b)=>String(a.axis).localeCompare(String(b.axis)))]);if(sigs.has(sig))issues.push(`Duplicate context signature detected: ${id}.`);sigs.add(sig);for(const m of [...c.getElementsByTagNameNS(XBRLDI_NS,'explicitMember')]){if(!state.elements.some(e=>`${e.prefix}:${e.name}`===m.getAttribute('dimension')))issues.push(`Unknown dimension ${m.getAttribute('dimension')}.`);if(!state.elements.some(e=>`${e.prefix}:${e.name}`===m.textContent.trim()))issues.push(`Unknown dimension member ${m.textContent.trim()}.`);if(/DefaultMember$/i.test(m.textContent.trim()))issues.push(`Default dimension member ${m.textContent.trim()} must not be explicitly included.`);}}
  const usedCtx=new Set(),usedUnits=new Set(),dups=new Set(),facts=[...root.children].filter(n=>n.namespaceURI&&n.localName&&!['schemaRef','context','unit','footnoteLink'].includes(n.localName));
  for(const f of facts){const ctx=f.getAttribute('contextRef');if(ctx)usedCtx.add(ctx);else issues.push(`${f.localName} has no contextRef.`);const e=state.elements.find(x=>`${x.prefix}:${x.name}`===`${f.prefix}:${f.localName}`);if(!e)issues.push(`Unknown taxonomy concept ${f.prefix}:${f.localName}.`);const key=`${f.namespaceURI}|${f.localName}|${ctx}`;if(dups.has(key))issues.push(`Duplicate fact ${f.localName} with the same context.`);dups.add(key);if(f.hasAttribute('precision'))issues.push(`Fact ${f.localName} uses prohibited precision attribute.`);if(f.hasAttribute('scale'))issues.push(`Fact ${f.localName} uses a scale attribute.`);if(e){if(/dateitemtype$/i.test(e.type||'')&&!/^\d{4}-\d{2}-\d{2}$/.test(String(f.textContent||'').trim()))issues.push(`Date fact ${f.localName} must use yyyy-mm-dd.`);const c=contexts.find(x=>x.id===ctx);const dims=[...c?.getElementsByTagNameNS(XBRLDI_NS,'explicitMember')||[]].map(m=>({axis:m.getAttribute('dimension'),member:m.textContent.trim()}));if(dims.length&&!dimensionContextValidForFact(`${e.prefix}:${e.name}`,{dimensions:dims}))issues.push(`Dimensional context for ${f.localName} could not be matched to a taxonomy table model.`);if(unitSpec(e)){const u=f.getAttribute('unitRef');if(!u)issues.push(`Numeric fact ${f.localName} has no unitRef.`);else usedUnits.add(u);}if(isRichTextConcept(e)||/textblockitemtype|xbrli:stringItemType/i.test(e.type||''))if(f.getAttributeNS(XML_NS,'lang') && f.getAttributeNS(XML_NS,'lang')!=='en')issues.push(`Text fact ${f.localName} uses a non-en xml:lang value.`);}}
  for(const c of contexts)if(!usedCtx.has(c.id))issues.push(`Unused context ${c.id}.`);for(const u of units)if(!usedUnits.has(u.id))issues.push(`Unused unit ${u.id}.`);return [...new Set(issues)];
}

/* The base builder already supports table-row rich text; V16 adds typed-member serialization below. */

function setPath(path,val){
  const wasComplete=profileComplete(),p=path.split('.');let o=state;for(let i=0;i<p.length-1;i++)o=o[p[i]];
  if(path==='profile.inputScale'&&o[p[p.length-1]]!==val){
    const oldScale=o[p[p.length-1]]||'Actuals',oldF=({Actuals:1,Thousands:1000,Lakhs:100000,Millions:1000000,Crores:10000000,Billions:1000000000}[oldScale]||1),newF=({Actuals:1,Thousands:1000,Lakhs:100000,Millions:1000000,Crores:10000000,Billions:1000000000}[val]||1),ratio=oldF/newF;
    const convert=(obj)=>{for(const k of Object.keys(obj||{})){const e=state.elements.find(x=>`${x.prefix}:${x.name}`===k);if(e&&isMonetaryElement(e)){const n=Number(obj[k]);if(Number.isFinite(n))obj[k]=String(Number((n*ratio).toFixed(6)));}}};
    convert(state.values);convert(state.prior);for(const model of v15AllTableModels())for(const row of v15Rows(model.role,model.id)){convert(row.current);convert(row.prior);}
  }
  o[p[p.length-1]]=val;
  if(path.startsWith('profile.')){state.contexts[0]=state.contexts[0]||{id:'C1',entity:'',scheme:MCA_CIN_SCHEME,start:'',end:'',instant:'',dimensions:[]};if(path==='profile.cin')state.contexts[0].entity=val;if(path==='profile.fyStart')state.contexts[0].start=val;if(path==='profile.fyEnd')state.contexts[0].end=val;}
  markDirty();if(!wasComplete&&profileComplete())toast('General Information is complete. Filing tabs are available without a profile lock.');
}

/* V16 regression hardening: typed dimensions, taxonomy relationship line-items,
   member-as-fact elements, and source decimal preservation. */
function v16DimToken(d){return d?.kind==='typed'?['typed',d.axis,d.typedDomainRef||'',d.typedQName||'',d.typedValue||'']:[d?.axis||'',d?.member||''];}
function v16DimSig(dims){return (dims||[]).slice().sort((a,b)=>String(a.axis).localeCompare(String(b.axis))).map(v16DimToken);}
function v16TypedAxis(axis){const e=state.elements.find(x=>`${x.prefix}:${x.name}`===axis);return e&&e.typedDomainRef?e:null;}
function v16NormalizeDim(d){if(!d)return null; if(d.kind==='typed'||d.typedValue!==undefined){const ax=d.axis||'';const e=v16TypedAxis(ax);return {axis:ax,member:'',kind:'typed',typedValue:String(d.typedValue??''),typedQName:String(d.typedQName||e?.typedDomainRef||''),typedDomainRef:String(d.typedDomainRef||e?.typedDomainRef||'')};} return {axis:d.axis||'',member:d.member||'',kind:'explicit'};}
function v16DimKey(dims){return JSON.stringify(v16DimSig((dims||[]).map(v16NormalizeDim).filter(Boolean)));}
function contextSignature(c){return JSON.stringify({entity:c.entity||state.profile.cin,scheme:c.scheme||MCA_CIN_SCHEME,start:c.start||'',end:c.end||'',instant:c.instant||'',dimensions:v16DimSig(c.dimensions||[])});}
function ensureDimContext(kind,dims){ensureBaseContexts();const base=kind==='prior'?state.contexts.find(c=>c.id==='P1'):state.contexts.find(c=>c.id==='C1');const nd=(dims||[]).map(v16NormalizeDim).filter(d=>d&&d.axis&&(d.kind==='typed'?nonblank(d.typedValue):nonblank(d.member)));const sig=JSON.stringify({base:kind,entity:state.profile.cin,scheme:MCA_CIN_SCHEME,start:base?.start||'',end:base?.end||'',instant:base?.instant||'',dimensions:v16DimSig(nd)});let c=state.contexts.find(x=>x._dimSig===sig);if(!c){const id='D'+(state.contexts.filter(x=>/^D\d+$/.test(x.id||'')).length+1);c={id,entity:state.profile.cin,scheme:MCA_CIN_SCHEME,start:base?.start||'',end:base?.end||'',instant:base?.instant||'',dimensions:nd,_dimSig:sig};state.contexts.push(c);}return c.id;}
function findRoleForDimFact(concept,dims){for(const role of allDimensionalRoles()){const model=v15TableForDimensions(role,dims,concept);if(!model)continue;const axisQ=new Set(model.axes.map(a=>a.q));const okAxes=(dims||[]).every(d=>axisQ.has(d.axis));if(!okAxes)continue;if(model.lineItems.some(li=>li.q===concept)||state.elements.find(e=>`${e.prefix}:${e.name}`===concept&&e.type&&!e.abstract)){return role;}}return null;}
function v16TypedDisplay(d){return d?.kind==='typed'?`${d.typedValue||''}`:(d?.member||'');}

/* Re-render typed axes as text inputs instead of member selects. The taxonomy
   supplies the typed-domain QName; the user supplies the typed value. */
function v15TableInstance(role,model,row,index,fy,py){
  const axisCells=model.axes.map(a=>{
    const d=row.dimensions?.find(x=>x.axis===a.q);
    if(a.element?.typedDomainRef){
      return `<td><input class="auto-grow v15-axis-input" data-v15-typed-axis="${esc(v15Pack(role,model.id,index,a.q))}" value="${esc(d?.typedValue||'')}" placeholder="Enter typed member"></td>`;
    }
    return `<td><select data-v15-axis="${esc(v15Pack(role,model.id,index,a.q))}"><option value="">Select member…</option>${a.members.map(m=>`<option value="${esc(m.q)}" ${m.q===d?.member?'selected':''}>${esc(m.label)}</option>`).join('')}</select></td>`;
  }).join('');
  const lineCells=model.lineItems.map(li=>`<td class="v15-horizontal-cell">${v15InputForLine(role,model.id,index,li,'current')}</td><td class="v15-horizontal-cell">${v15InputForLine(role,model.id,index,li,'prior')}</td>`).join('');
  const desc=row.dimensions?.filter(d=>d.kind==='typed'?nonblank(d.typedValue):nonblank(d.member)).map(d=>{
    const a=model.axes.find(x=>x.q===d.axis),m=a?.members.find(x=>x.q===d.member);
    return `${a?.label||d.axis}: ${d.kind==='typed'?d.typedValue:(m?.label||d.member)}`;
  }).join(' • ')||'No member combination selected yet';
  const lineHeaders=model.lineItems.map(li=>`<th colspan="2" class="v15-horizontal-head">${esc(li.label)}<div class="hint">${esc(li.q)}</div><span>${esc(fy)} / ${esc(py)}</span></th>`).join('');
  return `<tr class="v15-data-row" data-v15-row="${esc(v15Pack(role,model.id,index))}">
    ${axisCells}
    ${lineCells}
    <td><button class="smallbtn" data-v15-save="${esc(v15Pack(role,model.id,index))}">Save</button> <button class="smallbtn" data-v15-delete="${esc(v15Pack(role,model.id,index))}">Delete</button><div class="hint">${esc(desc)}</div></td>
  </tr>`;
}

/* Typed members are stored as first-class dimensions and exported using the
/* Patch the generated context XML after the base builder has created it. This
   is deliberately a serialization-level transformation so the V15 builder's
   unit/fact logic remains intact. */
function v16InjectTypedMembers(xml){
  if(!xml)return xml;const doc=new DOMParser().parseFromString(xml,'application/xml');if(doc.getElementsByTagName('parsererror').length)return xml;
  const contexts=[...doc.getElementsByTagNameNS(XBRL_NS,'context')];
  const byId=new Map(state.contexts.map(c=>[c.id,c]));
  for(const cnode of contexts){const id=cnode.getAttribute('id'),c=byId.get(id);if(!c?.dimensions?.some(d=>d.kind==='typed'))continue;const sc=cnode.getElementsByTagNameNS(XBRL_NS,'scenario')[0]||doc.createElementNS(XBRL_NS,'xbrli:scenario');if(!sc.parentNode)cnode.appendChild(sc);
    for(const d of c.dimensions){if(d.kind!=='typed')continue;const tm=doc.createElementNS(XBRLDI_NS,'xbrldi:typedMember');tm.setAttribute('dimension',d.axis);const q=d.typedQName||d.typedDomainRef;const [pfx,local]=String(q).split(':');const ns=TAX_NS[pfx]||state.meta?.schemaNamespace||TAX_NS['in-gaap'];const child=doc.createElementNS(ns,q||`${pfx}:${local}`);child.textContent=d.typedValue||'';tm.appendChild(child);sc.appendChild(tm);}
  }
  /* Remove the explicit-member placeholders that the base builder may have
     produced for typed dimensions (V16 contexts keep typed dimensions only). */
  for(const cnode of contexts){const id=cnode.getAttribute('id'),c=byId.get(id);if(!c)continue;for(const m of [...cnode.getElementsByTagNameNS(XBRLDI_NS,'explicitMember')]){const d=c.dimensions?.find(x=>x.axis===m.getAttribute('dimension'));if(d?.kind==='typed')m.remove();}}
  return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(doc.documentElement)}`;
}

/* Keep the base build gate and return typed-member-aware serialization. */
function buildXbrlXml(){const x=baseBuildXbrlXml();return x?v16InjectTypedMembers(x):x;}

/* Typed-aware dimensional validation. */
function dimensionContextValidForFact(concept,context){const dims=context?.dimensions||[];if(!dims.length)return true;for(const model of v15AllTableModels()){if(!model.lineItems.some(li=>li.q===concept))continue;const allowed=new Map(model.axes.map(a=>[a.q,a]));let ok=true;for(const d of dims){const a=allowed.get(d.axis);if(!a){ok=false;break;}if(d.kind==='typed'){if(!a.element?.typedDomainRef||String(d.typedDomainRef||a.element.typedDomainRef)!==String(a.element.typedDomainRef)){ok=false;break;}}else if(!a.members.some(m=>m.q===d.member)){ok=false;break;}}if(ok)return true;}return false;}

/* V16 wire extension for typed-axis entry. */
const __v16WireTables=v15WireTables;
v15WireTables=function(){
  __v16WireTables();
  document.querySelectorAll('[data-v15-typed-axis]').forEach(el=>el.addEventListener('input',()=>{const [role,tableId,idx,axis]=v15Unpack(el.dataset.v15TypedAxis);const row=v15Rows(role,tableId)[Number(idx)];if(!row)return;row.dimensions=row.dimensions||[];let d=row.dimensions.find(x=>x.axis===axis);const e=v16TypedAxis(axis);if(!d){d={axis,member:'',kind:'typed',typedValue:'',typedQName:e?.typedDomainRef||'',typedDomainRef:e?.typedDomainRef||''};row.dimensions.push(d);}d.kind='typed';d.member='';d.typedValue=el.value;d.typedQName=d.typedQName||e?.typedDomainRef||'';d.typedDomainRef=d.typedDomainRef||e?.typedDomainRef||'';markDirty();}));
};

/* Ensure all V16-created rows carry metadata containers. */
const __v16CreateBlank=v15CreateBlankTableRow;
v15CreateBlankTableRow=function(role,tableId){const r=__v16CreateBlank(role,tableId);if(r){r.decimals=r.decimals||{};r.priorDecimals=r.priorDecimals||{};}return r;};
const __v16CreatePrimary=v15CreatePrimaryMemberRows;
v15CreatePrimaryMemberRows=function(role,tableId){__v16CreatePrimary(role,tableId);for(const r of v15Rows(role,tableId)){r.decimals=r.decimals||{};r.priorDecimals=r.priorDecimals||{};}};

/* Import typed-member contexts into the table model. The existing importer now
   reads typedMember nodes; this post-pass reconstructs any occurrence that did
   not match through the explicit-member path and preserves source decimals. */
function baseImportXml(file){showBusy('Importing previous-year XBRL','Reading contexts, units, facts and dimensional table instances…');setTimeout(()=>baseImportXmlRaw(file),40);}

/* V16 generated-instance structural gate: explicit and typed dimensions share
   one context signature; missing xml:lang is permitted, while supplied non-en
   values remain visible as a validation issue. */
function validateGeneratedXml(xml){
  const issues=[];if(!xml)return ['No XML was generated.'];const d=new DOMParser().parseFromString(xml,'application/xml');if(d.getElementsByTagName('parsererror').length)return ['Generated XML is not well-formed.'];
  const root=d.documentElement,sr=d.getElementsByTagNameNS(LINK_NS,'schemaRef')[0];if(!sr||sr.getAttributeNS(XLINK_NS,'href')!==MCA_SCHEMA_REF)issues.push('schemaRef does not use the current MCA V3 C&I 2016 XSD URI.');
  const contexts=[...d.getElementsByTagNameNS(XBRL_NS,'context')],units=[...d.getElementsByTagNameNS(XBRL_NS,'unit')],sigs=new Set();
  const contextDims=c=>{const out=[];for(const m of [...c.getElementsByTagNameNS(XBRLDI_NS,'explicitMember')])out.push({axis:m.getAttribute('dimension')||'',member:m.textContent.trim(),kind:'explicit'});for(const tm of [...c.getElementsByTagNameNS(XBRLDI_NS,'typedMember')]){const child=[...tm.children][0];out.push({axis:tm.getAttribute('dimension')||'',member:'',kind:'typed',typedValue:(child?.textContent||'').trim(),typedQName:child?.prefix&&child?.localName?`${child.prefix}:${child.localName}`:(child?.localName||'')});}return out;};
  for(const c of contexts){const id=c.getAttribute('id'),ident=c.getElementsByTagNameNS(XBRL_NS,'identifier')[0];const st=c.getElementsByTagNameNS(XBRL_NS,'startDate')[0]?.textContent?.trim()||'',en=c.getElementsByTagNameNS(XBRL_NS,'endDate')[0]?.textContent?.trim()||'',ins=c.getElementsByTagNameNS(XBRL_NS,'instant')[0]?.textContent?.trim()||'';if((st&&!/^\d{4}-\d{2}-\d{2}$/.test(st))||(en&&!/^\d{4}-\d{2}-\d{2}$/.test(en))||(ins&&!/^\d{4}-\d{2}-\d{2}$/.test(ins)))issues.push(`Context ${id} contains a date that is not yyyy-mm-dd.`);if(!ident||ident.getAttribute('scheme')!==MCA_CIN_SCHEME||ident.textContent.trim()!==String(state.profile.cin).trim())issues.push(`Context ${id} has an invalid MCA CIN identifier.`);if(c.getElementsByTagNameNS(XBRL_NS,'segment').length)issues.push(`Context ${id} contains a segment, which is not allowed.`);const dims=contextDims(c);const sig=JSON.stringify([c.getElementsByTagNameNS(XBRL_NS,'startDate')[0]?.textContent||'',c.getElementsByTagNameNS(XBRL_NS,'endDate')[0]?.textContent||'',c.getElementsByTagNameNS(XBRL_NS,'instant')[0]?.textContent||'',v16DimSig(dims)]);if(sigs.has(sig))issues.push(`Duplicate context signature detected: ${id}.`);sigs.add(sig);for(const m of [...c.getElementsByTagNameNS(XBRLDI_NS,'explicitMember')]){if(!state.elements.some(e=>`${e.prefix}:${e.name}`===m.getAttribute('dimension')))issues.push(`Unknown dimension ${m.getAttribute('dimension')}.`);if(!state.elements.some(e=>`${e.prefix}:${e.name}`===m.textContent.trim()))issues.push(`Unknown dimension member ${m.textContent.trim()}.`);if(/DefaultMember$/i.test(m.textContent.trim()))issues.push(`Default dimension member ${m.textContent.trim()} must not be explicitly included.`);}for(const tm of [...c.getElementsByTagNameNS(XBRLDI_NS,'typedMember')]){const axis=tm.getAttribute('dimension')||'',ae=v16TypedAxis(axis),child=[...tm.children][0];if(!ae)issues.push(`Unknown typed dimension ${axis}.`);else if(!ae.typedDomainRef)issues.push(`Dimension ${axis} is not defined as a typed dimension in the loaded taxonomy.`);if(!child||!String(child.textContent||'').trim())issues.push(`Typed dimension ${axis} has an empty typed member value.`);}}
  const usedCtx=new Set(),usedUnits=new Set(),dups=new Set(),facts=[...root.children].filter(n=>n.namespaceURI&&n.localName&&!['schemaRef','context','unit','footnoteLink'].includes(n.localName));
  for(const f of facts){const ctx=f.getAttribute('contextRef');if(ctx)usedCtx.add(ctx);else issues.push(`${f.localName} has no contextRef.`);const e=state.elements.find(x=>`${x.prefix}:${x.name}`===`${f.prefix}:${f.localName}`);if(!e)issues.push(`Unknown taxonomy concept ${f.prefix}:${f.localName}.`);const key=`${f.namespaceURI}|${f.localName}|${ctx}`;if(dups.has(key))issues.push(`Duplicate fact ${f.localName} with the same context.`);dups.add(key);if(f.hasAttribute('precision'))issues.push(`Fact ${f.localName} uses prohibited precision attribute.`);if(f.hasAttribute('scale'))issues.push(`Fact ${f.localName} uses a scale attribute.`);if(e){if(/dateitemtype$/i.test(e.type||'')&&!/^\d{4}-\d{2}-\d{2}$/.test(String(f.textContent||'').trim()))issues.push(`Date fact ${f.localName} must use yyyy-mm-dd.`);const c=contexts.find(x=>x.id===ctx),dims=contextDims(c||document.createElement('div'));if(dims.length&&!dimensionContextValidForFact(`${e.prefix}:${e.name}`,{dimensions:dims}))issues.push(`Dimensional context for ${f.localName} could not be matched to a taxonomy table model.`);if(unitSpec(e)){const u=f.getAttribute('unitRef');if(!u)issues.push(`Numeric fact ${f.localName} has no unitRef.`);else usedUnits.add(u);}const lang=f.getAttributeNS(XML_NS,'lang');if((isRichTextConcept(e)||/textblockitemtype|xbrli:stringItemType/i.test(e.type||''))&&lang&&lang!=='en')issues.push(`Text fact ${f.localName} uses a non-en xml:lang value.`);}}
  for(const c of contexts)if(!usedCtx.has(c.id))issues.push(`Unused context ${c.id}.`);for(const u of units)if(!usedUnits.has(u.id))issues.push(`Unused unit ${u.id}.`);return [...new Set(issues)];
}

/* Project/export labels. */
function restoreProjectFile(data){baseRestoreProjectFile(data);state._v18LegacySeeded=false;v18SeedGeneralFromLegacyProfile();syncGeneralInfoToProfile();renderNav();renderTabs();render();toast('Project restored. General Information facts were reconstructed where legacy profile data was available.');}

function saveProjectFile(){persistNow();const exportState=JSON.parse(JSON.stringify(state));exportState.appVersion=APP_VERSION;exportState.projectFormat='mca-cni-xbrl-workbench';exportState.savedAt=new Date().toISOString();const blob=new Blob([JSON.stringify(exportState,null,2)],{type:'application/json;charset=utf-8'});download(blob,'mca-cni-xbrl-project-v21-1.json');state.dirty=false;$('saveState').textContent='Project saved';toast('Project file saved. Keep this file as a portable V21 backup.');}
function generateXml(){
  if(!profileComplete()){toast('Complete the required General Information before generating XML.');return;}
  synchronizeAll();if(state.errors.length){modal(`<div class="modal-head"><div><h2>XML generation blocked</h2><div class="hint">The filing still has ${state.errors.length} validation issue${state.errors.length===1?'':'s'}.</div></div><button class="close" onclick="closeModal()">Close</button></div><div class="card" style="box-shadow:none"><ul>${state.errors.slice(0,40).map(x=>`<li>${esc(x.message||x)}</li>`).join('')}</ul></div>`);return;}
  const xml=buildXbrlXml();if(!xml){toast('XML generation stopped because the filing contains invalid content.');return;}const issues=validateGeneratedXml(xml);if(issues.length){state.errors=issues.map(x=>({rule:'Generated instance structural check',concept:'XML',message:x,correction:'Correct the filing data/context/unit/dimension and generate again.'}));render();modal(`<div class="modal-head"><div><h2>XML generation blocked</h2><div class="hint">The internal MCA/XBRL structural gate found ${issues.length} issue${issues.length===1?'':'s'}.</div></div><button class="close" onclick="closeModal()">Close</button></div><div class="card" style="box-shadow:none"><ul>${issues.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div><div class="modal-actions"><button class="smallbtn primary" onclick="closeModal()">Close</button></div>`);return;}download(new Blob([xml],{type:'application/xml;charset=utf-8'}),'mca-cni-instance-v21.xml');toast('MCA C&I XBRL instance generated through the V21 filing model. Validate it in MCA XBRL Validation Tool V5.1 before filing.');}

/* Import rows directly into the V15 table-keyed store so typed dimensions and
   source decimal metadata are not downgraded to the legacy V14 row shape. */
function ensureDimRow(role,dims,kind='prior'){
  const model=v15TableForDimensions(role,dims,'');if(!model)return null;
  const rows=v15Rows(role,model.id),nd=(dims||[]).map(v16NormalizeDim).filter(Boolean),sig=v16DimKey(nd);
  let row=rows.find(r=>v16DimKey(r.dimensions)===sig);
  if(!row){row={id:`T${rows.length+1}`,dimensions:nd,lineItems:{},current:{},prior:{},richText:{},priorRichText:{},decimals:{},priorDecimals:{},sourceFactKeys:[]};rows.push(row);}
  row[kind]=row[kind]||{};row.decimals=row.decimals||{};row.priorDecimals=row.priorDecimals||{};row.richText=row.richText||{};row.priorRichText=row.priorRichText||{};return row;
}

/* Typed-aware table validation replaces the V15 explicit-member-only gate. */
function evaluateDimensionalTableRules(){
  for(const model of v15AllTableModels()){
    const rows=v15Rows(model.role,model.id),axisMap=new Map(model.axes.map(a=>[a.q,a])),lineSet=new Set(model.lineItems.map(li=>li.q));
    for(const row of rows){
      const dims=row.dimensions||[],hasVal=v15TableHasValues(row);
      if(isGeneralInformationRole(model.role)&&!generalInformationEnabled()&&hasVal)addRuleError('MCA 400100 optional-section control',`${model.role}:${row.id||''}`,'General Information is disabled for this filing, but data exists in its table model.','Enable General Information on the 400100 filing tab or clear the 400100 data.');
      const seen=new Set();
      for(const d of dims){
        const typed=d.kind==='typed'||d.typedValue!==undefined, populated=typed?nonblank(d.typedValue):nonblank(d.member);
        if(!d.axis||!populated){if(hasVal)addRuleError('V16 dimensional context completeness',`${model.role}:${row.id||''}`,'A populated table instance must have a complete axis/member selection.','Select an explicit member or enter the typed member value for every axis before generating XML.');continue;}
        if(seen.has(d.axis))addRuleError('V16 dimensional axis uniqueness',`${model.role}:${row.id||''}`,`Axis ${d.axis} is repeated in one table context.`,'Keep one dimension value per axis.');seen.add(d.axis);
        const a=axisMap.get(d.axis);if(!a)addRuleError('V16 dimensional axis validity',`${model.role}:${row.id||''}`,`Axis ${d.axis} is not part of this taxonomy table.`,'Select a displayed taxonomy axis.');
        else if(typed){if(!a.element?.typedDomainRef)addRuleError('V16 typed-axis validity',`${model.role}:${row.id||''}`,`Axis ${d.axis} is not a typed axis in the taxonomy.`,'Use the taxonomy-defined explicit member control for this axis.');else if(d.typedDomainRef&&String(d.typedDomainRef)!==String(a.element.typedDomainRef))addRuleError('V16 typed-domain validity',`${model.role}:${row.id||''}`,`Typed domain ${d.typedDomainRef} does not match ${a.element.typedDomainRef}.`,'Keep the taxonomy typed-domain reference unchanged.');}
        else if(!a.members.some(m=>m.q===d.member))addRuleError('V16 dimensional member validity',`${model.role}:${row.id||''}`,`Member ${d.member} is not valid for axis ${d.axis} in this table.`,'Select a member from the taxonomy-controlled dropdown.');
        if(!typed&&/DefaultMember$/i.test(d.member))addRuleError('V16 default-member rule',`${model.role}:${row.id||''}`,`Default member ${d.member} must not be explicitly reported.`,'Remove the default member from the context.');
      }
      for(const k of Object.keys(row.current||{}).concat(Object.keys(row.prior||{}))){if(!lineSet.has(k))addRuleError('V16 table line-item validity',`${model.role}:${row.id||''}`,`Concept ${k} is not part of this table's line-item tree.`,'Enter data only in the displayed taxonomy line items.');}
    }
  }
}

/* V18 — General Information driven filing dashboard.
   The former profile is now represented by the taxonomy-defined
   [400100] Disclosure of general information about company. Current values
   entered here are stored as normal in-ca facts and therefore flow into the
   generated XBRL instance. */

const V18_GENERAL_ROLE='[400100] Disclosure of general information about company';
const V18_GENERAL_PREFIX='in-ca';
const V18_C={
  company:'in-ca:NameOfCompany',cin:'in-ca:CorporateIdentityNumber',pan:'in-ca:PermanentAccountNumberOfEntity',
  address:'in-ca:AddressOfRegisteredOfficeOfCompany',industry:'in-ca:TypeOfIndustry',registration:'in-ca:RegistrationDate',
  category:'in-ca:CategoryOrSubcategoryOfCompany',listed:'in-ca:WhetherCompanyIsListedCompany',employees:'in-ca:NumberOfEmployeesInTheCompanyAtTheEndOfTheFinancialYear',
  sustainability:'in-ca:WhetherCompanyHasPublishedSustainabilityReportForTheFinancialYear',board:'in-ca:DateOfBoardMeetingWhenFinalAccountsWereApproved',
  periodCovered:'in-ca:PeriodCoveredByFinancialStatements',fyStart:'in-ca:DateOfStartOfReportingPeriod',fyEnd:'in-ca:DateOfEndOfReportingPeriod',
  nature:'in-ca:NatureOfReportStandaloneConsolidated',content:'in-ca:ContentOfReport',currency:'in-ca:DescriptionOfPresentationCurrency',
  rounding:'in-ca:LevelOfRoundingUsedInFinancialStatements',cashflow:'in-ca:TypeOfCashFlowStatement',annualReportLink:'in-ca:DisclosureWebLinkOfCompanyAtWhichAnnualReportIsPlaced',
  memberCloseFrom:'in-ca:DateFromWhichRegisterOfMembersRemainedClosed',memberCloseTill:'in-ca:DateTillWhichRegisterOfMembersRemainedClosed',rtaName:'in-ca:NameOfRegistrarAndTransferAgent',
  rtaAddress:'in-ca:AddressAndContactDetailsOfRegistrarAndTransferAgent',electronicBooks:'in-ca:WhetherCompanyIsMaintainingBooksOfAccountAndOtherRelevantBooksAndPapersInElectronicForm',
  serverAddress:'in-ca:CompletePostalAddressOfPlaceOfMaintenanceOfComputerServersStoringAccountingData',serverCity:'in-ca:NameOfCityOfPlaceOfMaintenanceOfComputerServersStoringAccountingData',
  serverState:'in-ca:NameOfStateUnionTerritoryOfPlaceOfMaintenanceOfComputerServersStoringAccountingData',serverPin:'in-ca:PinCodeOfPlaceOfMaintenanceOfComputerServersStoringAccountingData',
  serverDistrict:'in-ca:NameOfDistrictOfPlaceOfMaintenanceOfComputerServersStoringAccountingData',serverIso:'in-ca:ISOCountryCodeOfPlaceOfMaintenanceOfComputerServersStoringAccountingData',
  serverCountry:'in-ca:NameOfCountryOfPlaceOfMaintenanceOfComputerServersStoringAccountingData',serverPhone:'in-ca:PhoneWithSTDISDCodeOfPlaceOfMaintenanceOfComputerServersStoringAccountingData',
  serviceProvider:'in-ca:NameOfTheServiceProvider',serviceIp:'in-ca:InternetProtocolAddressOfServiceProvider',serviceLocation:'in-ca:LocationOfTheServiceProvider',
  booksCloud:'in-ca:WhetherBooksOfAccountAndOtherBooksAndPapersAreMaintainedOnCloud',serviceAddress:'in-ca:AddressAsProvidedByTheServiceProvider',
  productCount:'in-ca:TotalNumberOfProductOrServiceCategory',productDescription:'in-ca:DescriptionOfPrincipalProductOrServicesCategory'
};

function v18Element(q){const i=String(q||'').indexOf(':');const p=i>0?q.slice(0,i):'';const n=i>0?q.slice(i+1):q;return state.elements.find(e=>e.prefix===p&&e.name===n)||null;}
function v18GeneralPresent(){return state.values?.[V18_C.company]||state.values?.[V18_C.cin]||state.values?.[V18_C.fyStart]||state.values?.[V18_C.fyEnd]||state.values?.[V18_C.nature]||state.values?.[V18_C.currency];}
function v18RoundingToScale(v){const s=String(v||'').toLowerCase().trim();if(s.includes('billion'))return 'Billions';if(s.includes('million'))return 'Millions';if(s.includes('crore'))return 'Crores';if(s.includes('lakh'))return 'Lakhs';if(s.includes('thousand'))return 'Thousands';return 'Actuals';}
function v18RoundingLabel(){return v18ScaleToRounding(state.profile.inputScale||'Actuals');}
function v18ScaleToRounding(v){const s=String(v||'').toLowerCase();if(s==='billions')return 'Billions';if(s==='millions')return 'Millions';if(s==='thousands')return 'Thousands';if(s==='lakhs')return 'Lakhs';if(s==='crores')return 'Crores';return 'Actual';}
function v18NormalizeIsoDate(v){const s=String(v??'').trim();if(!s)return '';if(/^\d{4}-\d{2}-\d{2}$/.test(s))return s;let m=s.match(/^(\d{2})[\/.\-](\d{2})[\/.\-](\d{4})$/);if(m)return `${m[3]}-${m[2]}-${m[1]}`;m=s.match(/^(\d{4})[\/.](\d{2})[\/.](\d{2})$/);if(m)return `${m[1]}-${m[2]}-${m[3]}`;return s;}
function v18NormalizeDateFacts(){for(const store of [state.values,state.prior]){for(const [k,v] of Object.entries(store||{})){const e=state.elements.find(x=>`${x.prefix}:${x.name}`===k);if(e&&/dateitemtype$/i.test(e.type||'')&&nonblank(v))store[k]=v18NormalizeIsoDate(v);}}for(const c of (state.contexts||[])){if(c.start)c.start=v18NormalizeIsoDate(c.start);if(c.end)c.end=v18NormalizeIsoDate(c.end);if(c.instant)c.instant=v18NormalizeIsoDate(c.instant);}state.profile.fyStart=v18NormalizeIsoDate(state.values?.[V18_C.fyStart]??state.profile.fyStart);state.profile.fyEnd=v18NormalizeIsoDate(state.values?.[V18_C.fyEnd]??state.profile.fyEnd);if(state.values?.[V18_C.fyStart])state.values[V18_C.fyStart]=state.profile.fyStart;if(state.values?.[V18_C.fyEnd])state.values[V18_C.fyEnd]=state.profile.fyEnd;}
function v18SyncPeriodCovered(){const a=state.values?.[V18_C.fyStart],b=state.values?.[V18_C.fyEnd];if(!a||!b)return;const derived=`${a.split('-').reverse().join('-')} to ${b.split('-').reverse().join('-')}`;const existing=String(state.values[V18_C.periodCovered]||'').trim();if(!existing||state._v18DerivedPeriod===existing){state.values[V18_C.periodCovered]=derived;state._v18DerivedPeriod=derived;}}
function v18SeedGeneralFromLegacyProfile(){if(state._v18LegacySeeded)return;state._v18LegacySeeded=true;state.values=state.values||{};const p=state.profile||{};const seeds=[[V18_C.cin,p.cin],[V18_C.company,p.companyName],[V18_C.pan,p.pan],[V18_C.fyStart,p.fyStart],[V18_C.fyEnd,p.fyEnd],[V18_C.nature,p.financialStatements],[V18_C.currency,p.currency],[V18_C.rounding,p.inputScale?v18ScaleToRounding(p.inputScale):''],[V18_C.cashflow,p.cashFlowMethod]];for(const [q,v] of seeds){if(!nonblank(state.values[q])&&nonblank(v))state.values[q]=v;}}
function syncGeneralInfoToProfile(){v18SeedGeneralFromLegacyProfile();v18NormalizeDateFacts();state.profile=state.profile||{};const v=state.values||{};state.profile.cin=String(v[V18_C.cin]??state.profile.cin??'').trim();state.profile.companyName=String(v[V18_C.company]??state.profile.companyName??'').trim();state.profile.pan=String(v[V18_C.pan]??state.profile.pan??'').trim();state.profile.fyStart=v18NormalizeIsoDate(v[V18_C.fyStart]??state.profile.fyStart??'');state.profile.fyEnd=v18NormalizeIsoDate(v[V18_C.fyEnd]??state.profile.fyEnd??'');if(state.profile.fyStart)v[V18_C.fyStart]=state.profile.fyStart;if(state.profile.fyEnd)v[V18_C.fyEnd]=state.profile.fyEnd;state.profile.financialStatements=String(v[V18_C.nature]??state.profile.financialStatements??'').trim();state.profile.currency=String(v[V18_C.currency]??state.profile.currency??'INR').trim();state.profile.inputScale=v[V18_C.rounding]?v18RoundingToScale(v[V18_C.rounding]):(state.profile.inputScale||'Actuals');state.profile.cashFlowMethod=String(v[V18_C.cashflow]??state.profile.cashFlowMethod??'').trim();state.profile.generalInfoEnabled=true;state.contexts=Array.isArray(state.contexts)?state.contexts:[];state.contexts[0]=state.contexts[0]||{id:'C1',entity:'',scheme:MCA_CIN_SCHEME,start:'',end:'',instant:'',dimensions:[]};state.contexts[0].entity=state.profile.cin;state.contexts[0].scheme=MCA_CIN_SCHEME;state.contexts[0].start=state.profile.fyStart;state.contexts[0].end=state.profile.fyEnd;state.contexts[0].instant='';}
function profileComplete(){syncGeneralInfoToProfile();return !!(state.profile.cin&&state.profile.companyName&&state.profile.fyStart&&state.profile.fyEnd&&state.profile.financialStatements&&state.profile.currency);}
function requireProfile(){return true;}

function v18EnumOptions(e){const raw=String(e?.enumerations||'');const out=[...raw.matchAll(/\(([^)]*)\)/g)].map(m=>m[1].trim()).filter(Boolean);return out;}
function v18Control(q,e,val,bad,prior=false){const disabled=false, priorVal=v18NormalizeIsoDate(state.prior?.[q]??'');if(prior)return `<div class="v18-prev-value ${priorVal!==''?'has-value':''}">${priorVal!==''?esc(priorVal):'—'}</div>`;const normalizedVal=/dateitemtype$/i.test(String(e?.type||''))?v18NormalizeIsoDate(val):val;if(q===V18_C.rounding){const roundingOpts=['Actual','Thousands','Lakhs','Millions','Crores','Billions'];return `<select class="fact-select ${bad?'cell-invalid':''}" data-general-fact="${esc(q)}"><option value="" ${normalizedVal===''?'selected':''}>Select…</option>${roundingOpts.map(o=>`<option value="${o}" ${String(o)===String(normalizedVal)?'selected':''}>${o}</option>`).join('')}</select>`;}if(isBooleanConcept(e))return `<select class="fact-select ${bad?'cell-invalid':''}" data-general-fact="${esc(q)}"><option value="" ${normalizedVal===''?'selected':''}>Select…</option><option value="true" ${String(val).toLowerCase()==='true'?'selected':''}>Yes</option><option value="false" ${String(val).toLowerCase()==='false'?'selected':''}>No</option></select>`;const opts=v18EnumOptions(e);if(opts.length)return `<select class="fact-select ${bad?'cell-invalid':''}" data-general-fact="${esc(q)}"><option value="" ${normalizedVal===''?'selected':''}>Select…</option>${opts.map(o=>`<option value="${esc(o)}" ${String(o)===String(normalizedVal)?'selected':''}>${esc(o)}</option>`).join('')}</select>`;const type=String(e?.type||'').toLowerCase();let t='text';if(type.includes('dateitemtype'))t='date';else if(type.includes('decimalitemtype')||type.includes('integeritemtype'))t='number';return `<input class="auto-grow ${bad?'cell-invalid':''}" data-general-fact="${esc(q)}" type="${t}" value="${esc(normalizedVal)}" placeholder="Enter ${esc(e?.label||q)}" ${t==='number'?'step="any"':''}>`;}
function v18GroupRows(items){return items.filter(q=>v18Element(q)).map(q=>{const e=v18Element(q),label=e.label||q.split(':')[1],val=state.values?.[q]??'',bad=state.cellIssues?.[q];return `<tr><td><b>${esc(label)}</b><div class="hint code">${esc(q)}</div></td><td>${v18Control(q,e,val,bad,false)}</td><td>${v18Control(q,e,val,bad,true)}</td></tr>`;}).join('');}
function v18GeneralInfoDashboard(){syncGeneralInfoToProfile();v18SyncPeriodCovered();const fy=yearLabel(state.profile.fyStart,state.profile.fyEnd),py=priorYearLabel(state.profile.fyStart,state.profile.fyEnd);const idRows=v18GroupRows([V18_C.company,V18_C.cin,V18_C.pan,V18_C.address,V18_C.industry,V18_C.registration,V18_C.category,V18_C.listed,V18_C.employees,V18_C.sustainability]);const docRows=v18GroupRows([V18_C.board,V18_C.periodCovered,V18_C.fyStart,V18_C.fyEnd,V18_C.nature,V18_C.content,V18_C.currency,V18_C.rounding,V18_C.cashflow,V18_C.annualReportLink]);const otherRows=v18GroupRows([V18_C.memberCloseFrom,V18_C.memberCloseTill,V18_C.rtaName,V18_C.rtaAddress,V18_C.electronicBooks,V18_C.serverAddress,V18_C.serverCity,V18_C.serverState,V18_C.serverPin,V18_C.serverDistrict,V18_C.serverIso,V18_C.serverCountry,V18_C.serverPhone,V18_C.serviceProvider,V18_C.serviceIp,V18_C.serviceLocation,V18_C.booksCloud,V18_C.serviceAddress]);const prodRows=v18GroupRows([V18_C.productCount,V18_C.productDescription]);const genModel=(typeof v15TableModels==='function')?v15TableModels(V18_GENERAL_ROLE)[0]:null;const genTable=genModel&&typeof v15TableCard==='function'?v15TableCard(V18_GENERAL_ROLE,genModel,fy,py):'';return `<div class="v18-general"><div class="dashboard-header"><div><h1>Disclosure of General Information about Company</h1><p class="hint">This section replaces the old Filing Profile. The current-year information entered here is stored as ordinary XBRL facts and is included in the generated instance.</p><p class="hint"><b>Current filing:</b> ${esc(fy)} &nbsp; • &nbsp; <b>Previous year comparison:</b> ${esc(py)}. The filing period is controlled by the two reporting-period dates below; XML import does not change them automatically.</p><p class="hint"><b>Financial figure scale:</b> <span class="badge">${esc(v18RoundingLabel())}</span> — imported from LevelOfRoundingUsedInFinancialStatements when available. Financial entry fields and XML export use this scale.</p></div><div class="toolbar"><button class="smallbtn primary" data-action="prescrutiny">Run all checks</button><button class="smallbtn" data-action="newFiling">Start new filing</button><button class="smallbtn" data-action="saveData">Save data</button><button class="smallbtn" data-action="saveProject">Save project file</button></div></div><div class="dashboard v18-metrics"><div class="metric"><b>${Object.keys(state.values||{}).length}</b><span>Current XBRL facts</span></div><div class="metric"><b>${Object.keys(state.prior||{}).length}</b><span>Previous-year facts</span></div><div class="metric"><b>${state.contexts.length}</b><span>Contexts</span></div><div class="metric"><b>${state.errors.length}</b><span>Errors</span></div></div><div class="card"><div class="toolbar"><div class="grow"><h2>Company information</h2><div class="hint">The values below are mapped directly to the C&I taxonomy concepts.</div></div><span class="status">XBRL facts</span></div><div class="table-wrap"><table class="data-table v18-general-table"><thead><tr><th style="width:45%">Information</th><th>Current filing — ${esc(fy)}</th><th>Previous year — imported</th></tr></thead><tbody>${idRows}</tbody></table></div></div><div class="card"><h2>Document information</h2><div class="table-wrap"><table class="data-table v18-general-table"><thead><tr><th style="width:45%">Information</th><th>Current filing — ${esc(fy)}</th><th>Previous year — imported</th></tr></thead><tbody>${docRows}</tbody></table></div><p class="hint">Changing the start/end reporting dates changes the current filing period used by XBRL contexts. Select the filing year here; the importer does not overwrite it.</p></div><div class="card"><h2>Other general information</h2><div class="table-wrap"><table class="data-table v18-general-table"><thead><tr><th style="width:45%">Information</th><th>Current filing — ${esc(fy)}</th><th>Previous year — imported</th></tr></thead><tbody>${otherRows}</tbody></table></div></div>${prodRows?`<div class="card"><h2>Principal product / service overview</h2><div class="table-wrap"><table class="data-table v18-general-table"><thead><tr><th style="width:45%">Information</th><th>Current filing</th><th>Previous year</th></tr></thead><tbody>${prodRows}</tbody></table></div></div>`:''}${genTable?`<div class="card"><h2>Principal product / service detail table</h2><p class="hint">This is the taxonomy-defined 400100 table. Add the required valid product/service member combinations and complete all line items shown for each combination.</p></div>${genTable}`:''}<div class="card v18-profile-help"><h2>Why this replaces Filing Profile</h2><p class="hint">CIN, company name, PAN, reporting period, nature of report, presentation currency, rounding and cash-flow method are no longer separate profile-only fields. They are entered as C&I taxonomy facts here, so the same values shown on this page are the values written to the XBRL instance.</p><p class="hint">CIN/DIN/PAN/date checks remain part of pre-scrutiny. The General Information section does not bypass those checks.</p></div><div class="card"><div class="toolbar"><button class="smallbtn primary" data-action="prescrutiny">Run all checks</button><button class="smallbtn" data-action="exportErrors">Download Excel-compatible error report</button><button class="smallbtn" data-action="exportCsv">Download CSV error report</button></div></div></div>`;}

/* Hide 400100 from the Filing-tabs navigator because it is now the dashboard's
   first-class disclosure. Keep the underlying taxonomy role available to the
   generator/table engine. */
function renderNav(){const items=[['dashboard','General Information'],['filing','Filing tabs'],['tagging','C&I tagging'],['contexts','Contexts & units'],['dimensions','Dimensions / members'],['footnotes','Footnotes'],['rules','C&I rules'],['errors','Errors / warnings']];$('nav').innerHTML=items.map(([id,n])=>`<button class="nav-item ${state.active===id?'active':''}" data-nav="${id}">${n}<span class="num">${id==='filing'?Math.max(0,state.elrs.length-1):''}</span></button>`).join('');document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{state.active=b.dataset.nav;if(state.active==='filing'&&isGeneralInformationRole(state.elrs[state.section]?.name))state.section=state.elrs.findIndex(e=>!isGeneralInformationRole(e.name));renderNav();renderTabs();render();});}
function renderTabs(){let html='';if(state.active==='filing'){const first=state.elrs.findIndex(e=>!isGeneralInformationRole(e.name));if(first<0){$('tabs').innerHTML='';return;}if(isGeneralInformationRole(state.elrs[state.section]?.name)||state.section<0||state.section>=state.elrs.length)state.section=first;html=`<div class="filing-tabbar"><div class="filing-tabbar-head"><b>Filing sections</b><span class="hint">${Math.max(0,state.elrs.length-1)} taxonomy sections • tap a section to open it</span></div><div class="filing-tabbar-scroll">${state.elrs.map((e,i)=>({e,i})).filter(x=>!isGeneralInformationRole(x.e.name)).map(({e,i})=>`<button type="button" class="tab ${state.section===i?'active':''}" data-sec="${i}">${esc(e.name.replace(/^\[[^\]]+\]\s*/,''))}</button>`).join('')}</div></div>`;}$('tabs').innerHTML=html;document.querySelectorAll('[data-sec]').forEach(b=>b.onclick=()=>{state.section=Number(b.dataset.sec);renderNav();renderTabs();render();});}
function dashboardView(){return v18GeneralInfoDashboard();}
/* General Information is now an actual user-facing 400100 disclosure. Do not raise the legacy year-based 'not applicable' error for the section itself. Other applicability checks remain intact. */
function evaluateElrApplicabilityRules(){
  if(state.profile.financialStatements==='Standalone'){
    for(const k of Object.keys(state.values||{})){
      if(/MinorityInterest/i.test(k)&&nonblank(state.values[k]))addRuleError('Standalone/consolidated applicability',k,'Minority interest is a consolidated-reporting disclosure under the supplied business-rule material.','Review and remove the fact for a standalone filing when not applicable.');
    }
  }
}

function runChecks(role){v18NormalizeDateFacts();syncGeneralInfoToProfile();v18SyncPeriodCovered();synchronizeAll();return baseRunChecks(role);}
function render(){syncGeneralInfoToProfile();v18SyncPeriodCovered();baseRender();const titles={dashboard:['Disclosure of General Information about Company','Company identity, reporting period and general information entered as real C&I taxonomy facts.'],filing:[state.elrs[state.section]?.name.replace(/^\[[^\]]+\]\s*/,''),'Taxonomy-driven filing data and complete disclosure table structures.'],tagging:['C&I tagging','Search the C&I taxonomy and tag source data to XBRL concepts.'],contexts:['Contexts & units','Reporting periods, entities, units and dimension-qualified contexts.'],dimensions:['Dimensions / members','Manage taxonomy axes, members and valid combinations.'],footnotes:['Footnotes','Attach supporting notes to reported facts.'],rules:['C&I Business Rules','C&I business-rule checks.'],errors:['Error / warning dashboard','Pre-scrutiny findings and correction navigation.']};$('pageTitle').textContent=titles[state.active]?.[0]||'';$('pageDesc').textContent=titles[state.active]?.[1]||'';const hm=document.querySelector('.hero-meta');if(hm)hm.innerHTML=`<span>C&I V1.2 • Business Rules V1.3</span><span>V21 • MCA V3 / V5.1 workflow</span>${profileComplete()?`<span class="status ok">${esc(state.profile.companyName)} • ${esc(yearLabel(state.profile.fyStart,state.profile.fyEnd))}</span>`:''}`;}
function actions(a){if(a==='saveData'){saveData();return;}if(a==='saveProject'){saveProjectFile();return;}return baseActions(a);}
function v18RefreshGeneralChrome(){const hm=document.querySelector('.hero-meta');if(hm){syncGeneralInfoToProfile();hm.innerHTML=`<span>C&I V1.2 • Business Rules V1.3</span><span>V21 • MCA V3 / V5.1 workflow</span>${profileComplete()?`<span class="status ok">${esc(state.profile.companyName)} • ${esc(yearLabel(state.profile.fyStart,state.profile.fyEnd))}</span>`:''}`;}const pc=document.querySelector('[data-general-fact="in-ca:PeriodCoveredByFinancialStatements"]');if(pc&&state.values[V18_C.periodCovered])pc.value=state.values[V18_C.periodCovered];}
function wire(){baseWire();document.querySelectorAll('[data-general-fact]').forEach(el=>{el.oninput=()=>{const q=el.dataset.generalFact,e=v18Element(q),stateVal=/dateitemtype$/i.test(String(e?.type||''))?v18NormalizeIsoDate(el.value):el.value;state.values[q]=stateVal;el.value=stateVal;if(q===V18_C.fyStart||q===V18_C.fyEnd)v18SyncPeriodCovered();if(q===V18_C.rounding)state.profile.inputScale=v18RoundingToScale(stateVal);if(q===V18_C.cashflow)state.profile.cashFlowMethod=stateVal;syncGeneralInfoToProfile();propagateLinks(q);autoCalculateParents('current');clearCellIssue(q);markDirty();growInput(el);v18RefreshGeneralChrome();};growInput(el);});document.querySelectorAll('[data-v15-add]').forEach(b=>b.onclick=()=>{const [role,tableId]=v15Unpack(b.dataset.v15Add);const row=v15CreateBlankTableRow(role,tableId);if(row){markDirty();render();toast('Member combination added. Select the valid member(s) and complete the table.');}});document.querySelectorAll('[data-v15-primary]').forEach(b=>b.onclick=()=>{const [role,tableId]=v15Unpack(b.dataset.v15Primary);v15CreatePrimaryMemberRows(role,tableId);});document.querySelectorAll('[data-v15-delete]').forEach(b=>b.onclick=()=>{const [role,tableId,idx]=v15Unpack(b.dataset.v15Delete);v15DeleteTableRow(role,tableId,Number(idx));toast('Table instance deleted.');});document.querySelectorAll('[data-v15-save]').forEach(b=>b.onclick=()=>{const [role,tableId,idx]=v15Unpack(b.dataset.v15Save);const row=v15Rows(role,tableId)[Number(idx)];if(row){row.savedAt=new Date().toISOString();markDirty();persistNow();toast('Table instance saved.');}});}

/* Keep current General Information identity facts helpful when a prior XML is
   imported: copy only stable entity-identification fields into Current, never
   the imported reporting-period dates. */
function importXml(file){state._v18ImportRunning=true;state._v18ImportFinishedAt=0;baseImportXml(file);const started=Date.now();const timer=setInterval(()=>{const done=state._v18ImportRunning===false||Date.now()-started>30000;if(done){clearInterval(timer);const map=[[V18_C.company,'companyName'],[V18_C.cin,'cin'],[V18_C.pan,'pan']];for(const [q] of map){if(!nonblank(state.values?.[q])&&nonblank(state.prior?.[q]))state.values[q]=state.prior[q];}syncGeneralInfoToProfile();markDirty();render();}},100);}

function saveProjectFile(){persistNow();const exportState=JSON.parse(JSON.stringify(state));exportState.appVersion=APP_VERSION;exportState.projectFormat='mca-cni-xbrl-workbench';exportState.savedAt=new Date().toISOString();const blob=new Blob([JSON.stringify(exportState,null,2)],{type:'application/json;charset=utf-8'});download(blob,'mca-cni-xbrl-project-v21-1.json');state.dirty=false;$('saveState').textContent='Project saved';toast('Project file saved. Keep this V19 project file as a portable backup.');}
function startNewFiling(){if(!confirm('Start a new filing? This clears the current filing data in this browser. Use Save project file first if you want a portable backup.'))return;const keep={meta:state.meta,elements:state.elements,presentation:state.presentation,calculations:state.calculations,definitions:state.definitions,elrs:state.elrs,rules:state.rules};const fresh={values:{},prior:{},priorFacts:{},historicalFacts:{},factOccurrences:{current:[],prior:[]},xbrlStore:{version:1,source:'new',contexts:[],units:[],facts:[],factIndex:{}},dimTables:{},importedContexts:[],importedUnits:[],importDiagnostics:[],cellIssues:{},errors:[],warnings:[],richText:{},priorRichText:{},links:[],footnotes:[],manualParentsEnabled:false,dirty:false,calculationOverrides:{},priorCalculated:{},profile:{cin:'',companyName:'',fyStart:'',fyEnd:'',currency:'',firstYear:false,financialStatements:'',inputScale:'Actuals',generalInfoEnabled:true,cashFlowMethod:''}};Object.assign(state,fresh,keep);try{localStorage.removeItem(PROJECT_KEY);}catch{}state.active='dashboard';state.section=state.elrs.findIndex(e=>!isGeneralInformationRole(e.name));normalizeState();renderNav();renderTabs();render();toast('New filing started. Enter the company/general information on the General Information dashboard.');}

function generateXml(){syncGeneralInfoToProfile();v18SyncPeriodCovered();if(!profileComplete()){toast('Complete the required General Information facts: company name, CIN, reporting dates, nature of report and presentation currency.');render();return;}synchronizeAll();if(state.errors.length){modal(`<div class="modal-head"><div><h2>XML generation blocked</h2><div class="hint">The filing still has ${state.errors.length} validation issue${state.errors.length===1?'':'s'}.</div></div><button class="close" onclick="closeModal()">Close</button></div><div class="card" style="box-shadow:none"><ul>${state.errors.slice(0,40).map(x=>`<li>${esc(x.message||x)}</li>`).join('')}</ul></div><div class="modal-actions"><button class="smallbtn primary" onclick="closeModal()">Close</button></div>`);return;}const xml=buildXbrlXml();if(!xml){toast('XML generation stopped because the filing contains invalid content.');return;}const issues=validateGeneratedXml(xml);if(issues.length){state.errors=issues.map(x=>({rule:'Generated instance structural check',concept:'XML',message:x,correction:'Correct the filing data/context/unit/dimension and generate again.'}));render();modal(`<div class="modal-head"><div><h2>XML generation blocked</h2><div class="hint">The internal structural gate found ${issues.length} issue${issues.length===1?'':'s'}.</div></div><button class="close" onclick="closeModal()">Close</button></div><div class="card" style="box-shadow:none"><ul>${issues.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div class="modal-actions"><button class="smallbtn primary" onclick="closeModal()">Close</button></div>`);return;}download(new Blob([xml],{type:'application/xml;charset=utf-8'}),'mca-cni-instance-v21.xml');toast('MCA C&I XBRL V21 instance generated. Validate it in the MCA XBRL Validation Tool V5.1 before filing.');}


load();
