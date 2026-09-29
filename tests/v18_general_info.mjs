import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('..',import.meta.url);
const app=fs.readFileSync(new URL('app.js',root),'utf8');
const html=fs.readFileSync(new URL('index.html',root),'utf8');
const bundle=fs.readFileSync(new URL('app-bundled.js',root),'utf8');
const required=[
'in-ca:NameOfCompany','in-ca:CorporateIdentityNumber','in-ca:PermanentAccountNumberOfEntity',
'in-ca:DateOfStartOfReportingPeriod','in-ca:DateOfEndOfReportingPeriod','in-ca:NatureOfReportStandaloneConsolidated',
'in-ca:DescriptionOfPresentationCurrency','in-ca:LevelOfRoundingUsedInFinancialStatements','in-ca:TypeOfCashFlowStatement'
];
for(const q of required)assert.match(app,new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
assert.match(app,/V18_GENERAL_ROLE/);assert.match(app,/function v18GeneralInfoDashboard/);assert.match(app,/function syncGeneralInfoToProfile/);
assert.match(app,/data-general-fact/);assert.match(app,/saveProjectFile\(\)/);assert.match(app,/mca-cni-xbrl-project-v19\.json/);assert.match(app,/mca-cni-instance-v19\.xml/);
assert.match(app,/function runChecks\(role\)\{v18NormalizeDateFacts\(\);syncGeneralInfoToProfile/);
assert.match(html,/MCA C&I XBRL Workbench/);assert.match(html,/app-bundled\.js/);
assert.equal(bundle.includes('const APP_VERSION=\'19.0.0\''),true);
assert.match(app,/function v18SeedGeneralFromLegacyProfile/);assert.match(app,/_v18LegacySeeded/);
assert.match(app,/if\(!nonblank\(state\.values\[q\]\)\&\&nonblank\(v\)\)state\.values\[q\]=v/);
assert.match(app,/for\(const \[k,v\] of Object\.entries\(src\|\|\{\}\)\)/);
assert.match(app,/state\.values/);
assert.match(app,/MCA C&I XBRL V19 instance generated/);
assert.match(app,/General Information is now an actual user-facing 400100 disclosure/);
assert.match(app,/function evaluateElrApplicabilityRules\(\)\{\n  if\(state\.profile\.financialStatements==='Standalone'/);
assert.match(app,/current-year information entered here is stored as ordinary XBRL facts/);
assert.match(app,/v15TableCard\(V18_GENERAL_ROLE/);
const bundleStart=bundle.indexOf('window.MCA_DATA=')+'window.MCA_DATA='.length;const bundleEnd=bundle.indexOf('\nconst state=',bundleStart);const data=JSON.parse(bundle.slice(bundleStart,bundleEnd).replace(/;\s*$/,''));
const tableData=data.definitions.filter(r=>r.role==='[400100] Disclosure of general information about company').map(r=>r.name);
for(const name of ['ProductOrServiceCategoryITC4DigitCode','DescriptionOfProductOrServiceCategory','TurnoverOfProductOrServiceCategory','HighestTurnoverContributingProductOrServiceITC8DigitCode','DescriptionOfProductOrService','UnitOfMeasurementOfHighestContributingProductOrService','TurnoverOfHighestContributingProductOrService','QuantityOfHighestContributingProductOrServiceInUom'])assert.ok(tableData.includes(name),`${name} is not present in the 400100 taxonomy definition data`);
const requiredNames=required.map(q=>{const i=q.indexOf(':');return [q.slice(0,i),q.slice(i+1)]});
for(const [prefix,name] of requiredNames)assert.ok(data.elements.some(e=>e.prefix===prefix&&e.name===name),`${prefix}:${name} is missing from bundled taxonomy`);
console.log('V18 General Information tests: PASS');
