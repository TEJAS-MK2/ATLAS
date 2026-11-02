# Atlas — Geospatial Intelligence Platform

Atlas is a responsive, browser-based GIS workspace with interactive maps, a 3D Earth explorer, satellite imagery, opt-in GPS recording, OSM feature overlays, route planning and GeoJSON workflows.

## Platform capabilities
- Responsive desktop, tablet and mobile map console
- Street, light, dark, terrain and Esri World Imagery satellite basemaps
- 3D Earth explorer powered by globe.gl / Three.js
- Place search powered by Photon
- Permission-based browser geolocation and opt-in GPS track recording
- Shareable map-center links and Google Maps Street View handoff
- Driving routes via public OSRM demo routing
- Nearby POI discovery and park/water/building geometry overlays via OpenStreetMap Overpass
- Distance measurement, saved places, GeoJSON import/export and track export
- Browser network diagnostics where supported
- PWA shell caching for repeat visits

## Local development
Requires Node.js 20+.

```bash
npm test
npm run check
python3 -m http.server 8080
```
Open http://localhost:8080.

## Deployment
GitHub Actions runs unit tests and JavaScript syntax checks before publishing the repository root to GitHub Pages.
Live site: https://tejas-mk2.github.io/ATLAS/

## Data and privacy
- GPS is never requested automatically. A user must start a tracking session and grant browser permission. Stop tracking to end the session.
- Track points and saved places remain in browser memory/local storage; export GeoJSON to keep a portable copy.
- Share-map links encode the map center and zoom only. They do not upload location data to an Atlas server.
- Search, routing and OSM overlay requests are sent to Photon, OSRM and Overpass respectively.
- The Street View action opens Google Maps in a separate tab; imagery availability and coverage are controlled by Google.
- The globe uses public texture assets from the globe.gl project.
- Public demo services have rate limits and no production SLA. Configure licensed/self-hosted providers before high-volume or mission-critical use.
- This static GitHub Pages edition does not include user accounts, cross-device cloud sync, authoritative live traffic, or server-side location sharing. Those require a secured backend, provider credentials and explicit deployment configuration. No fake authentication or traffic feed is presented.

## Guest-first backend foundation

A dedicated Supabase project has been provisioned in the Mumbai region for future map-sharing services. Atlas intentionally has **no registration, login, password, or account flow**.

- Project ref: `ichnpsxtiltquvtdgohz`
- Private schema: `atlas_private`
- The initial `shared_maps` table is private, has forced Row Level Security, and has no client grants or public policies.
- The static website does not currently read or write this private table. Guest bookmarks remain browser-local, and map-center links remain URL-based.
- Do not put a Supabase service-role key in the browser. Any future guest cloud-sharing API must be mediated by a server-side Edge Function with input validation, rate limiting, token hashing, expiry and explicit read/write scopes.

## Stack
Vanilla JavaScript ES modules, Leaflet, globe.gl, Three.js, OpenStreetMap, Photon, OSRM, Overpass API and Esri World Imagery.

## License
See [LICENSE](./LICENSE).
