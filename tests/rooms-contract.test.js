import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const edge=readFileSync(new URL('../supabase/functions/atlas-rooms/index.ts',import.meta.url),'utf8');
const migration=readFileSync(new URL('../supabase/migrations/20261102051000_atlas_guest_rooms.sql',import.meta.url),'utf8');

test('guest room UI is fully wired',()=>{
  for(const id of ['shareRoomBtn','roomPanel','roomTitle','roomCreate','roomDetails','roomStatus','roomUrl','roomCopy','roomSync']) assert.match(html,new RegExp('id="'+id+'"'));
  for(const id of ['shareRoomBtn','roomCreate','roomSync','roomCopy']) assert.match(app,new RegExp("\\$\\('"+id+"'\\)"));
});

test('room editor capability is never embedded in the share URL',()=>{
  assert.match(app,/sessionStorage\\.setItem\\('atlas\\.room\\.'/);
  assert.match(app,/roomShareUrl\\(id\\).*#room=/);
  assert.doesNotMatch(app,/roomShareUrl\\(id\\).*editToken/);
});

test('edge function enforces server-side capability checks and abuse controls',()=>{
  for(const token of ['SUPABASE_SERVICE_ROLE_KEY','crypto.subtle.digest','atlas_rate_limit','atlas_create_shared_map','atlas_get_shared_map','atlas_update_shared_map','Access-Control-Allow-Origin','Request too large']) assert.ok(edge.includes(token),token);
  assert.match(edge,/verify_jwt/); // Deployment setting is verified separately; function source documents capability auth.
  assert.match(edge,/body\\.editToken/);
  assert.match(edge,/validState/);
});

test('database migration keeps room and rate-limit storage private',()=>{
  assert.match(migration,/atlas_private\\.atlas_rate_limits/);
  assert.match(migration,/force row level security/i);
  assert.match(migration,/revoke all on function public\\.atlas_create_shared_map/i);
  assert.match(migration,/grant execute on function public\\.atlas_update_shared_map.*service_role/i);
});
