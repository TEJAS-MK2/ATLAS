create schema if not exists atlas_private;
revoke all on schema atlas_private from public, anon, authenticated;

create table if not exists atlas_private.shared_maps (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Shared map',
  map_state jsonb not null,
  public_read boolean not null default false,
  edit_token_hash text,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  constraint shared_maps_title_length check (char_length(title) between 1 and 120),
  constraint shared_maps_state_object check (jsonb_typeof(map_state) = 'object'),
  constraint shared_maps_state_size check (pg_column_size(map_state) <= 262144),
  constraint shared_maps_expiry check (expires_at is null or expires_at > created_at)
);
create index if not exists shared_maps_created_at_idx on atlas_private.shared_maps(created_at desc);
create index if not exists shared_maps_expiry_idx on atlas_private.shared_maps(expires_at) where expires_at is not null;
alter table atlas_private.shared_maps enable row level security;
alter table atlas_private.shared_maps force row level security;
revoke all on atlas_private.shared_maps from public, anon, authenticated;
