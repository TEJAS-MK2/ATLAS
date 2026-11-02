# Atlas guest map rooms

Atlas supports account-free shared map rooms through the dedicated Supabase backend.

- Create a room from the Live map room action.
- The read-only URL contains an unguessable room identifier only.
- The creator's edit capability is retained in that browser session and is not placed in the URL.
- Rooms expire after seven days.
- Viewers poll for snapshots every five seconds.
- Snapshots contain the map center, zoom, basemap and up to 100 saved pins.
- GPS tracks remain local and are not broadcast automatically.

The Edge Function validates room state, hashes edit capabilities, applies request limits, and uses server-side database credentials. The browser contains only the public publishable key. Private database tables have forced row-level security and no client grants.

This implementation is near-real-time snapshot sharing, not WebSocket presence or a live multi-user GPS feed.
