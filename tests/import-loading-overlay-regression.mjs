import fs from 'node:fs';
import assert from 'node:assert/strict';

for (const file of ['app.js','app-bundled.js']) {
  const src = fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  assert.match(src, /state\._v18ImportRunning=false;state\._v18ImportFinishedAt=Date\.now\(\);hideBusy\(\);try\{render\(\)/,
    `${file}: success import path must clear busy overlay before final render`);
  assert.match(src, /state\._v18ImportRunning=false;state\._v18ImportFinishedAt=Date\.now\(\);hideBusy\(\);showImportDiagnostics\(file\.name,0/,
    `${file}: error import path must clear busy overlay`);
}
console.log('Import loading overlay regression: PASS');
