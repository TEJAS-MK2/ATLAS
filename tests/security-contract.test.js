import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const functionSource=readFileSync(new URL('../supabase/functions/atlas-rooms/index.ts',import.meta.url),'utf8');
const migration=readFileSync(new URL('../supabase/migrations/20261102050000_atlas_private_guest_map_foundation.sql',import.meta.url),'utf8');
const config=readFileSync(new URL('../supabase/config.toml',import.meta.url),'utf8');

test('room Edge Function keeps service credentials server-side',()=>{
  assert.match(functionSource,/Deno\.env\.get\("SUPABASE_SERVICE_ROLE_KEY"\)/);
  assert.doesNotMatch(functionSource,/service_role\s*[:=]\s*['"][^'"]+['"]/i);
  assert.match(functionSource,/npm:@supabase\/supabase-js@2\.118\.0/);
});

test('guest room requests enforce body limits, origin checks and per-action rate limits',()=>{
  assert.match(functionSource,/byteLength\(rawBody\) > 300000/);
  assert.match(functionSource,/Origin not allowed/);
  assert.match(functionSource,/limited\(req,"create",5,900\)/);
  assert.match(functionSource,/limited\(req,"get",90,60\)/);
  assert.match(functionSource,/limited\(req,"update",30,60\)/);
});

test('Edge Function JWT bypass is explicitly tracked in Supabase config',()=>{
  assert.match(config,/\[functions\.atlas-rooms\]/);
  assert.match(config,/verify_jwt = false/);
});

test('guest room tables are private and protected by forced RLS',()=>{
  assert.match(migration,/create schema if not exists atlas_private/);
  assert.match(migration,/alter table atlas_private\.shared_maps enable row level security/);
  assert.match(migration,/alter table atlas_private\.shared_maps force row level security/);
  assert.match(migration,/revoke all on atlas_private\.shared_maps from public, anon, authenticated/);
});
