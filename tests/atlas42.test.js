import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const html=read('../index.html'),css=read('../styles.css'),sw=read('../sw.js'),app=read('../app.js');
const pkg=JSON.parse(read('../package.json')),manifest=JSON.parse(read('../manifest.webmanifest')),smoke=read('../scripts/smoke-test.mjs');

test('ATLAS 4.2 release metadata and browser assets are versioned together',()=>{
  assert.equal(pkg.version,'4.2.0');
  assert.match(html,/<title>ATLAS 4\.2 — Spatial Intelligence Workspace<\/title>/);
  assert.match(html,/data-atlas-build="4\.2\.0"/);
  assert.match(html,/styles\.css\?v=4\.2\.0/);
  assert.match(html,/app\.js\?v=4\.2\.0/);
  assert.equal(manifest.short_name,'ATLAS 4.2');
  assert.match(sw,/atlas-shell-v11/);\n  assert.match(smoke,/<title>ATLAS 4.2 — Spatial Intelligence Workspace<\\/title>/);\n  assert.match(smoke,/atlas-shell-v11/);
});

test('ATLAS 4.2 PWA checks for updates without relying on the browser HTTP cache',()=>{
  assert.match(app,/updateViaCache:'none'/);
  assert.match(app,/registration\.update\(\)/);
  assert.match(app,/controllerchange/);
  assert.match(app,/updateReload/);
  assert.match(app,/updateNoticeShown/);
  assert.match(html,/id=\"updateNotice\"/);
  assert.ok(app.includes("updateReload')?.addEventListener('click',()=>location.reload())"));
  assert.match(sw,/fetch\(request,\{cache:'no-store'\}\)/);
  assert.match(sw,/self\.clients\.claim\(\)/);
});

test('ATLAS 4.2 command surface has deliberate desktop and mobile layouts',()=>{
  assert.match(css,/ATLAS 4\.2/);
  assert.match(css,/grid-template-columns:clamp\(250px,20vw,292px\)/);
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(css,/body\.light-ui \.floating-panel/);
  assert.match(css,/min-height:44px/);
});

test('ATLAS 4.2 keeps the primary GIS workflow controls present',()=>{
  for(const id of ['searchInput','routeGo','nearbyGo','measureClear','overlayLoad','spatialBufferCreate','spatialHeatmapCreate','workspaceSave','monitorStart'])assert.match(html,new RegExp('id="'+id+'"'));
});
