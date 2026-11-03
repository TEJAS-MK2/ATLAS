import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const html=read('../index.html'),css=read('../styles-v43.css'),sw=read('../sw.js'),app=read('../app.js');
const pkg=JSON.parse(read('../package.json')),lock=JSON.parse(read('../package-lock.json')),manifest=JSON.parse(read('../manifest.webmanifest')),smoke=read('../scripts/smoke-test.mjs');

test('ATLAS 4.3 release metadata and cache versions are aligned',()=>{
  assert.equal(pkg.version,'4.3.0');
  assert.equal(lock.packages[''].version,pkg.version);
  assert.match(html,/<title>ATLAS 4\.3 — Spatial Intelligence Workspace<\/title>/);
  assert.match(html,/data-atlas-build="4\.3\.0"/);
  assert.match(html,/styles-v43\.css\?v=4\.3\.0/);
  assert.match(html,/app\.js\?v=4\.3\.0/);
  assert.equal(manifest.short_name,'ATLAS 4.3');
  assert.match(sw,/atlas-shell-v12/);
  assert.match(sw,/styles-v43\.css\?v=4\.3\.0/);
  assert.ok(smoke.includes('ATLAS 4.3 — Aurora spatial workspace'));
  assert.ok(smoke.includes('atlas-shell-v12'));
});

test('Aurora workspace styles cover desktop, mobile, light mode and reduced motion',()=>{
  assert.match(css,/--atlas-accent:#75e4c3/);
  assert.match(css,/grid-template-columns:clamp\(248px,19vw,286px\)/);
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
  assert.match(css,/body\.light-ui \.insight-card/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(css,/focus-visible/);
  assert.match(css,/min-height:44px/);\n  assert.match(css,/\.map-control\\{width:44px;height:44px;min-width:44px;min-height:44px/);
});

test('PWA updates remain user-controlled and keep the offline shell',()=>{
  assert.match(app,/updateViaCache:'none'/);
  assert.match(app,/registration\.update\(\)/);
  assert.match(app,/updateNoticeShown/);
  assert.match(app,/updateReload/);
  assert.ok(app.includes("updateReload')?.addEventListener('click',()=>location.reload())"));
  assert.match(sw,/fetch\(request,\{cache:'no-store'\}\)/);
  assert.match(sw,/self\.clients\.claim\(\)/);
  assert.match(sw,/request\.mode==='navigate'/);
});

test('critical map and spatial workflows remain in the 4.3 page',()=>{
  for(const id of ['searchInput','routeGo','nearbyGo','measureClear','overlayLoad','spatialBufferCreate','spatialHeatmapCreate','workspaceSave','monitorStart','styleApply','trackStartStop','roomCreate']) {
    assert.match(html,new RegExp('id="'+id+'"'));
  }
});

test('the page does not expose a fake online telemetry badge',()=>{
  assert.match(html,/MAP WORKSPACE/);
  assert.doesNotMatch(html,/MAP ONLINE/);
});
