import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

const root=fileURLToPath(new URL('../',import.meta.url));
const html=readFileSync(resolve(root,'index.html'),'utf8');
const manifest=JSON.parse(readFileSync(resolve(root,'manifest.webmanifest'),'utf8'));
const worker=readFileSync(resolve(root,'sw.js'),'utf8');
const workflow=readFileSync(resolve(root,'.github/workflows/pages.yml'),'utf8');

test('all local HTML assets exist in the published repository',()=>{
  const refs=[...html.matchAll(/(?:src|href)="(\.\/[^"]+)"/g)].map(match=>match[1]);
  for(const ref of refs)assert.ok(existsSync(resolve(root,ref.slice(2))),`missing local asset: ${ref}`);
});

test('PWA manifest declares correctly sized install icons',()=>{
  assert.equal(manifest.start_url,'./');
  assert.equal(manifest.scope,'./');
  assert.ok(manifest.icons.some(icon=>icon.sizes==='192x192'));
  assert.ok(manifest.icons.some(icon=>icon.sizes==='512x512'));
  for(const icon of manifest.icons)assert.ok(existsSync(resolve(root,icon.src.slice(2))));
});

test('offline fallback is limited to document navigations',()=>{
  assert.match(worker,/request\.mode==='navigate'/);
  assert.match(worker,/if\(cached\)return cached/);
  assert.match(worker,/fetch\(request\)/);
});

test('Pages deployment checks out source before packaging and runs tests first',()=>{
  const deploy=workflow.slice(workflow.indexOf('  deploy:'));
  assert.match(deploy,/needs: test/);
  assert.match(deploy,/actions\/checkout@v6/);
  assert.match(deploy,/actions\/upload-pages-artifact@v4/);
  assert.match(workflow,/smoke:\n    needs: deploy/);
  assert.match(workflow,/node scripts\/smoke-test\.mjs/);
});
