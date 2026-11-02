create table if not exists atlas_private.atlas_rate_limits (
  key_hash text not null,
  bucket_start timestamptz not null,
  hits integer not null default 0 check (hits >= 0),
  primary key (key_hash, bucket_start)
);
alter table atlas_private.atlas_rate_limits enable row level security;
alter table atlas_private.atlas_rate_limits force row level security;
revoke all on atlas_private.atlas_rate_limits from public, anon, authenticated;

alter table atlas_private.shared_maps
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists read_token_hash text;

create or replace function public.atlas_rate_limit(p_key_hash text, p_limit integer, p_window_seconds integer)
returns boolean language plpgsql security definer set search_path=pg_catalog,atlas_private
as $$
declare v_bucket timestamptz; v_hits integer;
begin
  if p_key_hash is null or length(p_key_hash)<32 or p_limit<1 or p_window_seconds<1 then return false; end if;
  v_bucket:=to_timestamp(floor(extract(epoch from clock_timestamp())/p_window_seconds)*p_window_seconds);
  insert into atlas_private.atlas_rate_limits(key_hash,bucket_start,hits) values(p_key_hash,v_bucket,1)
  on conflict(key_hash,bucket_start) do update set hits=atlas_private.atlas_rate_limits.hits+1 returning hits into v_hits;
  return v_hits<=p_limit;
end; $$;

create or replace function public.atlas_create_shared_map(p_title text,p_map_state jsonb,p_edit_token_hash text,p_expires_at timestamptz)
returns uuid language plpgsql security definer set search_path=pg_catalog,atlas_private
as $$
declare v_id uuid;
begin
  if p_title is null or char_length(p_title) not between 1 and 120 or p_map_state is null
     or jsonb_typeof(p_map_state)<>'object' or pg_column_size(p_map_state)>262144
     or p_edit_token_hash is null or length(p_edit_token_hash)<>64
     or p_expires_at<=now() or p_expires_at>now()+interval '30 days' then raise exception 'Invalid shared map input'; end if;
  insert into atlas_private.shared_maps(title,map_state,public_read,edit_token_hash,expires_at)
  values(p_title,p_map_state,true,p_edit_token_hash,p_expires_at) returning id into v_id;
  return v_id;
end; $$;

create or replace function public.atlas_get_shared_map(p_id uuid)
returns table(id uuid,title text,map_state jsonb,created_at timestamptz,updated_at timestamptz,expires_at timestamptz)
language sql security definer set search_path=pg_catalog,atlas_private
as $$
  select s.id,s.title,s.map_state,s.created_at,s.updated_at,s.expires_at from atlas_private.shared_maps s
  where s.id=p_id and s.public_read=true and (s.expires_at is null or s.expires_at>now()) limit 1;
$$;

create or replace function public.atlas_update_shared_map(p_id uuid,p_edit_token_hash text,p_map_state jsonb)
returns boolean language plpgsql security definer set search_path=pg_catalog,atlas_private
as $$
declare v_count integer;
begin
  if p_map_state is null or jsonb_typeof(p_map_state)<>'object' or pg_column_size(p_map_state)>262144 then raise exception 'Invalid map state'; end if;
  update atlas_private.shared_maps set map_state=p_map_state,updated_at=now()
  where id=p_id and edit_token_hash=p_edit_token_hash and (expires_at is null or expires_at>now());
  get diagnostics v_count=row_count;
  return v_count=1;
end; $$;

revoke all on function public.atlas_rate_limit(text,integer,integer) from public,anon,authenticated;
revoke all on function public.atlas_create_shared_map(text,jsonb,text,timestamptz) from public,anon,authenticated;
revoke all on function public.atlas_get_shared_map(uuid) from public,anon,authenticated;
revoke all on function public.atlas_update_shared_map(uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.atlas_rate_limit(text,integer,integer) to service_role;
grant execute on function public.atlas_create_shared_map(text,jsonb,text,timestamptz) to service_role;
grant execute on function public.atlas_get_shared_map(uuid) to service_role;
grant execute on function public.atlas_update_shared_map(uuid,text,jsonb) to service_role;
create index if not exists shared_maps_expiry_cleanup_idx on atlas_private.shared_maps(expires_at) where expires_at is not null;
