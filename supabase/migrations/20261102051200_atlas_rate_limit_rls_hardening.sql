alter table atlas_private.atlas_rate_limits enable row level security;
alter table atlas_private.atlas_rate_limits force row level security;
revoke all on atlas_private.atlas_rate_limits from public, anon, authenticated;
