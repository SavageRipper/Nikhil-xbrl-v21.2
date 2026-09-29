import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const bundle = fs.readFileSync(path.join(root, '..', 'app-bundled.js'), 'utf8');
const source = bundle.replace(/\nload\(\);\s*$/, '\n');

const elements = new Map();
function makeElement(id) {
  return {
    id, innerHTML: '', textContent: '', value: '', hidden: false,
    dataset: {}, style: {},
    classList: { add() {}, remove() {}, contains() { return false; } },
    addEventListener() {}, removeEventListener() {},
    querySelector() { return null; }, querySelectorAll() { return []; },
    setAttribute() {}, getAttribute() { return ''; },
    focus() {}, click() {},
  };
}
const documentStub = {
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, makeElement(id));
    return elements.get(id);
  },
  querySelectorAll() { return []; },
  querySelector() { return null; },
  createElement(tag) { return makeElement(tag); },
};

const context = {
  window: { addEventListener() {} },
  document: documentStub,
  localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  console,
  Blob: function Blob() {},
  URL: { createObjectURL() { return ''; }, revokeObjectURL() {} },
  setInterval, clearInterval, setTimeout, clearTimeout,
  performance: { now: () => Date.now() },
  confirm: () => true,
  FileReader: function FileReader() {},
  DOMParser: function DOMParser() {}, XMLSerializer: function XMLSerializer() {},
  TextEncoder, TextDecoder,
};
vm.createContext(context);
vm.runInContext(source, context, { timeout: 120000 });

const probe = `
(() => {
  Object.assign(state, {
    meta: window.MCA_DATA.meta,
    elements: window.MCA_DATA.elements,
    presentation: window.MCA_DATA.presentation,
    calculations: window.MCA_DATA.calculations,
    definitions: window.MCA_DATA.definitions,
    rules: window.MCA_DATA['business-rules'],
    elrs: window.MCA_DATA.elrs,
    active: 'dashboard', section: 0,
    values: {}, prior: {}, contexts: [], units: [], errors: [], warnings: [],
    profile: { cin:'', companyName:'', fyStart:'', fyEnd:'', currency:'', firstYear:false,
      financialStatements:'', inputScale:'Actuals', generalInfoEnabled:true, cashFlowMethod:'' }
  });
  normalizeState();
  const results = [];
  const navs = ['dashboard','filing','tagging','contexts','dimensions','footnotes','rules','errors'];
  for (const active of navs) {
    state.active = active;
    if (active === 'filing') {
      for (const [i, e] of state.elrs.entries()) {
        if (isGeneralInformationRole(e.name)) continue;
        state.section = i;
        renderNav(); renderTabs(); render();
        const html = document.getElementById('content').innerHTML;
        if (!html.trim()) throw new Error('Blank filing renderer at ELR index ' + i + ': ' + e.name);
        results.push(['filing', i, document.getElementById('pageTitle').textContent, html.length]);
      }
    } else {
      renderNav(); renderTabs(); render();
      const html = document.getElementById('content').innerHTML;
      if (!html.trim()) throw new Error('Blank renderer for section ' + active);
      results.push([active, -1, document.getElementById('pageTitle').textContent, html.length]);
    }
  }
  const generalModel = v15TableModels(V18_GENERAL_ROLE);
  if (generalModel.length !== 1) throw new Error('Expected one 400100 table model, found ' + generalModel.length);
  runChecks();
  return { results, elrs: state.elrs.length, filingCount: results.filter(x => x[0] === 'filing').length };
})()
`;
const result = vm.runInContext(probe, context, { timeout: 120000 });
assert.equal(result.elrs, 47, 'Expected 47 taxonomy ELRs');
assert.equal(result.filingCount, 46, 'Expected 46 Filing-tabs entries after hiding 400100 on the General Information dashboard');
assert.equal(result.results.length, 46 + 7, 'Expected all nav sections plus all filing tabs to render');
console.log(`V18 runtime renderer regression: PASS (${result.filingCount} filing tabs + 7 non-filing sections rendered; runChecks completed)`);
