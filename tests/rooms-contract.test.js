import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const edge=readFileSync(new URL('../supabase/functions/atlas-rooms/index.ts',import.meta.url),'utf8');
const migration=readFileSync(new URL('../supabase/migrations/20261102051000_atlas_guest_rooms.sql',import.meta.url),'utf8');

test('guest room controls exist and are wired',()=>{
  for(const id of ['shareRoomBtn','roomPanel','roomTitle','roomCreate','roomDetails','roomStatus','roomUrl','roomCopy','roomSync']) assert.ok(html.includes('id="'+id+'"'),id);
  for(const id of ['shareRoomBtn','roomCreate','roomSync','roomCopy']) assert.ok(app.includes("$('#"+id+"')"),id);
});

test('share URL contains only the room identifier, never the edit capability',()=>{
  assert.ok(app.includes("sessionStorage.setItem('atlas.room.'+roomId,roomEditToken)"));
  assert.ok(app.includes("function roomShareUrl(id){return location.origin+location.pathname+'#room='+encodeURIComponent(id)}"));
  assert.ok(!app.includes("function roomShareUrl(id){return location.origin+location.pathname+'#room='+encodeURIComponent(id)+'&token="));
});

test('edge function applies capability checks and abuse controls',()=>{
  for(const term of ['SUPABASE_SERVICE_ROLE_KEY','crypto.subtle.digest','atlas_rate_limit','atlas_create_shared_map','atlas_get_shared_map','atlas_update_shared_map','Access-Control-Allow-Origin','Request too large','verify_jwt=false']) assert.ok(edge.includes(term),term);
  assert.ok(edge.includes('body.editToken'));
  assert.ok(edge.includes('validState'));
});

test('database migration keeps room and rate-limit storage private',()=>{
  assert.ok(migration.includes('atlas_private.atlas_rate_limits'));
  assert.ok(migration.toLowerCase().includes('force row level security'));
  assert.ok(migration.toLowerCase().includes('revoke all on function public.atlas_create_shared_map'));
  assert.ok(migration.toLowerCase().includes('grant execute on function public.atlas_update_shared_map'));
});
