import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');

test('all statically referenced application elements exist in the page',()=>{
  const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
  const refs=[...app.matchAll(/\$\('([^']+)'\)/g)].map(m=>m[1]);
  const generated=new Set(['inspectSave']);
  const missing=[...new Set(refs.filter(id=>!ids.has(id)&&!generated.has(id)))];
  assert.deepEqual(missing,[]);
});

test('page element IDs are unique',()=>{
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  const duplicates=ids.filter((id,i)=>ids.indexOf(id)!==i);
  assert.deepEqual([...new Set(duplicates)],[]);
});

test('core advanced features are wired into the interface',()=>{
  for(const id of ['globeBtn','trackBtn','overlayBtn','streetViewBtn','globeModal','trackPanel','overlayPanel']) assert.match(html,new RegExp('id="'+id+'"'));
  assert.match(app,/watchPosition/);
  assert.match(app,/globeImageUrl/);
  assert.match(app,/World_Imagery/);
});
test('shared room pins are isolated from personal bookmarks',()=>{
  assert.match(app,/const roomPinsLayer=L\.layerGroup\(\)\.addTo\(map\)/);
  assert.match(app,/roomPinsLayer\.clearLayers\(\)/);
  assert.doesNotMatch(app,/saved=state\.pins/);
  assert.match(app,/scheduleRoomSync\(\);addMarker/);
});

test('all five basemaps are available from the layer cycle',()=>{
  assert.match(app,/const order=\['streets','light','dark','terrain','satellite'\]/);
  assert.match(app,/layers\.satellite=satelliteLayer/);
});

test('manual route input invalidates map-selected coordinates',()=>{
  assert.match(app,/routeStart.*addEventListener\('input',\(\)=>\{routeStart=null\}\)/);
  assert.match(app,/routeEnd.*addEventListener\('input',\(\)=>\{routeEnd=null\}\)/);
});

test('nearby search supports ways and relation centers without dropping zero coordinates',()=>{
  assert.match(app,/nwr\(around:/);
  assert.match(app,/Number\.isFinite\(x\.lat\)&&Number\.isFinite\(x\.lng\)/);
});

test('OSM overlay geometry preserves open ways as lines',()=>{
  assert.match(app,/closed\?\{type:'Polygon'/);
  assert.match(app,/\{type:'LineString',coordinates:ring\}/);
});
