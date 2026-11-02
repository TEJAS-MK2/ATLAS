import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');

test('all statically referenced application elements exist in the page',()=>{
  const ids=new Set([...html.matchAll(/\\bid="([^"]+)"/g)].map(m=>m[1]));
  const refs=[...app.matchAll(/\\$\\('([^']+)'\\)/g)].map(m=>m[1]);
  const generated=new Set(['inspectSave']);
  const missing=[...new Set(refs.filter(id=>!ids.has(id)&&!generated.has(id)))];
  assert.deepEqual(missing,[]);
});

test('page element IDs are unique',()=>{
  const ids=[...html.matchAll(/\\bid="([^"]+)"/g)].map(m=>m[1]);
  const duplicates=ids.filter((id,i)=>ids.indexOf(id)!==i);
  assert.deepEqual([...new Set(duplicates)],[]);
});

test('core advanced features are wired into the interface',()=>{
  for(const id of ['globeBtn','trackBtn','overlayBtn','streetViewBtn','globeModal','trackPanel','overlayPanel']) assert.match(html,new RegExp('id="'+id+'"'));
  assert.match(app,/watchPosition/);
  assert.match(app,/globeImageUrl/);
  assert.match(app,/World_Imagery/);
});
