import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');

test('ATLAS 4.0 release metadata is synchronized',()=>{
  assert.equal(pkg.version,'4.0.0');
  assert.match(html,/<title>ATLAS 4\.0 — Geospatial Field Console<\/title>/);
  assert.match(html,/ATLAS ENGINE <b>v4\.0\.0<\/b>/);
  assert.match(sw,/atlas-shell-v10/);
});

test('Field Console responsive dock preserves the four core tools on mobile',()=>{
  assert.match(css, /\.sidebar \.tool-section:first-of-type/);
  assert.match(css,/grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
  assert.match(css, /\.sidebar \.tool-section:not\(:first-of-type\)/);
  assert.match(css,/@media\(max-width:390px\)/);
});

test('Field Console includes accessible focus and reduced-motion treatments',()=>{
  assert.match(css, /\.tool:focus-visible/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css,/button:disabled/);
});

test('ATLAS 3.5 keeps all three intelligence surfaces wired into the map UI',()=>{
  for(const id of ['atlasMonitorPanel','atlasHistoryPanel','atlasDashboardPanel','atlas33Quickbar']) assert.match(html,new RegExp('id="'+id+'"'));
});
