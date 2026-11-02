# Atlas — Geospatial Intelligence Platform

[![Validate and deploy Atlas](https://github.com/TEJAS-MK2/ATLAS/actions/workflows/pages.yml/badge.svg)](https://github.com/TEJAS-MK2/ATLAS/actions/workflows/pages.yml)
[![Demo](https://img.shields.io/badge/demo-live-brightgreen?logo=github)](https://tejas-mk2.github.io/ATLAS/)
[![GitHub stars](https://img.shields.io/github/stars/TEJAS-MK2/ATLAS?style=flat&logo=github)](https://github.com/TEJAS-MK2/ATLAS/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/TEJAS-MK2/ATLAS?style=flat&logo=github)](https://github.com/TEJAS-MK2/ATLAS/forks)
[![GitHub issues](https://img.shields.io/github/issues/TEJAS-MK2/ATLAS?style=flat&logo=github)](https://github.com/TEJAS-MK2/ATLAS/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/TEJAS-MK2/ATLAS/blob/main/LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/TEJAS-MK2/ATLAS?logo=git)](https://github.com/TEJAS-MK2/ATLAS/commits/main)
[![Top language](https://img.shields.io/github/languages/top/TEJAS-MK2/ATLAS)](https://github.com/TEJAS-MK2/ATLAS)
[![Node.js CI](https://img.shields.io/badge/CI-Node.js%2022-339933?logo=nodedotjs&logoColor=white)](https://github.com/TEJAS-MK2/ATLAS/blob/main/.github/workflows/pages.yml)
[![Backend](https://img.shields.io/badge/backend-Supabase-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-enabled-5A0FC8?logo=pwa&logoColor=white)](https://github.com/TEJAS-MK2/ATLAS)
[![Contributors](https://img.shields.io/github/contributors/TEJAS-MK2/ATLAS?logo=github)](https://github.com/TEJAS-MK2/ATLAS/graphs/contributors)
[![Commit activity](https://img.shields.io/github/commit-activity/m/TEJAS-MK2/ATLAS?logo=git)](https://github.com/TEJAS-MK2/ATLAS/graphs/commit-activity)
[![Repository size](https://img.shields.io/github/repo-size/TEJAS-MK2/ATLAS?logo=github)](https://github.com/TEJAS-MK2/ATLAS)
[![Languages](https://img.shields.io/github/languages/count/TEJAS-MK2/ATLAS)](https://github.com/TEJAS-MK2/ATLAS)
[![Open pull requests](https://img.shields.io/github/issues-pr/TEJAS-MK2/ATLAS?logo=github)](https://github.com/TEJAS-MK2/ATLAS/pulls)
[![Watchers](https://img.shields.io/github/watchers/TEJAS-MK2/ATLAS?style=flat&logo=github)](https://github.com/TEJAS-MK2/ATLAS/watchers)
[![Closed issues](https://img.shields.io/github/issues-closed/TEJAS-MK2/ATLAS?logo=github)](https://github.com/TEJAS-MK2/ATLAS/issues?q=is%3Aissue+is%3Aclosed)
[![Closed pull requests](https://img.shields.io/github/issues-pr-closed/TEJAS-MK2/ATLAS?logo=github)](https://github.com/TEJAS-MK2/ATLAS/pulls?q=is%3Apr+is%3Aclosed)
[![Latest release](https://img.shields.io/github/v/release/TEJAS-MK2/ATLAS?display_name=tag&logo=github)](https://github.com/TEJAS-MK2/ATLAS/releases)
[![Release date](https://img.shields.io/github/release-date/TEJAS-MK2/ATLAS?logo=github)](https://github.com/TEJAS-MK2/ATLAS/releases)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES_Modules-F7DF1E?logo=javascript&logoColor=000)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Leaflet](https://img.shields.io/badge/Maps-Leaflet-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Three.js](https://img.shields.io/badge/3D-Three.js-black?logo=threedotjs&logoColor=white)](https://threejs.org/)
[![OpenStreetMap](https://img.shields.io/badge/Data-OpenStreetMap-7EBC6F?logo=openstreetmap&logoColor=white)](https://www.openstreetmap.org/)
[![GeoJSON](https://img.shields.io/badge/Format-GeoJSON-8E44AD)](https://geojson.org/)
[![GitHub Pages](https://img.shields.io/badge/Hosting-GitHub_Pages-222222?logo=githubpages&logoColor=white)](https://pages.github.com/)

Atlas is a responsive, browser-based GIS workspace with interactive maps, a 3D Earth explorer, satellite imagery, opt-in GPS recording, OSM feature overlays, route planning and GeoJSON workflows.

## Platform capabilities
- Responsive desktop, tablet and mobile map console
- Street, light, dark, terrain and Esri World Imagery satellite basemaps
- 3D Earth explorer powered by globe.gl / Three.js
- Place search powered by Photon
- Permission-based browser geolocation and opt-in GPS track recording
- Shareable map-center links, seven-day guest map rooms with read-only share links, private edit capabilities, five-second viewer refresh, and Google Maps Street View handoff
- Driving routes via public OSRM demo routing
- Nearby POI discovery and park/water/building geometry overlays via OpenStreetMap Overpass
- Distance measurement, saved places, validated GeoJSON import/export, adjustable layer visibility/opacity, feature search/inspection, and geometry metrics
- Browser network diagnostics where supported
- Installable PWA with app icons, network-first asset refresh and offline navigation fallback

## Interface experience

Atlas uses a map-first command-workspace layout with a refreshed visual system, refined dark and light appearances, clearer active states, layered surfaces, more legible map controls and adaptive navigation for desktop, tablet and mobile. The map remains the primary workspace while the inspector and navigation adapt to available screen width.

The design tokens, responsive behaviour, accessibility considerations and manual device acceptance checklist are documented in [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md).

## Command palette

Use **Ctrl/⌘ + K** or **/** to open the keyboard-first command palette. Search and launch common actions including route planning, nearby discovery, distance measurement, GPS session controls, device location, the 3D globe, basemap switching, room sharing, pin creation and GeoJSON export. Arrow keys move through results, Enter runs the selected action, and Escape closes the palette.


## Project documentation

| Guide | Purpose |
|---|---|
| [Security policy](./SECURITY.md) | Responsible vulnerability reporting and security expectations |
| [Contributing](./CONTRIBUTING.md) | Development setup, coding standards, tests, and pull requests |
| [Code of Conduct](./CODE_OF_CONDUCT.md) | Community participation standards |
| [Support](./SUPPORT.md) | Bug reports, feature requests, and troubleshooting |
| [Changelog](./CHANGELOG.md) | Notable project updates |
| [Architecture](./docs/ARCHITECTURE.md) | Runtime components, data flow, and trust boundaries |
| [Privacy](./docs/PRIVACY.md) | Location handling, browser storage, sharing, and provider requests |
| [Threat model](./docs/THREAT_MODEL.md) | Assets, trust boundaries, and security review checklist |
| [Testing guide](./docs/TESTING.md) | Automated checks and manual acceptance plan |
| [Provider inventory](./docs/PROVIDERS.md) | External data services, attribution, and operational limits |
| [Design system](./docs/DESIGN_SYSTEM.md) | Visual tokens, responsive behaviour, and accessibility |

GitHub issue forms and a pull-request template are available under `.github/`. Dependabot checks GitHub Actions dependencies weekly, and CodeQL runs scheduled JavaScript security analysis.

## Local development
Requires Node.js 22+.

```bash
npm test
npm run check
node scripts/smoke-test.mjs
python3 -m http.server 8080
```
Open http://localhost:8080.

## Deployment
GitHub Actions runs unit tests and JavaScript syntax checks before publishing the repository root to GitHub Pages. A separate post-deployment job fetches the live homepage, application modules, styles, service worker, manifest and install icons to catch missing or empty production assets.
Live site: https://tejas-mk2.github.io/ATLAS/

## Data and privacy
- GPS is never requested automatically. A user must start a tracking session and grant browser permission. Stop tracking to end the session.
- Track points and saved places remain in browser memory/local storage; export GeoJSON to keep a portable copy.
- Share-map links encode the map center and zoom only. They do not upload location data to an Atlas server.
- Search, routing and OSM overlay requests are sent to Photon, OSRM and Overpass respectively.
- The Street View action opens Google Maps in a separate tab; imagery availability and coverage are controlled by Google.
- The globe uses public texture assets from the globe.gl project.
- Public demo services have rate limits and no production SLA. Configure licensed/self-hosted providers before high-volume or mission-critical use.
- Atlas has no accounts or passwords. Guest-room sharing is available; collaborative multi-user editing, live GPS participant presence and authoritative live traffic are not implemented. No fake traffic feed is presented.

## Guest-first backend foundation

A dedicated Supabase project has been provisioned in the Mumbai region for live guest map rooms. Atlas intentionally has **no registration, login, password, or account flow**.

- Project ref: `ichnpsxtiltquvtdgohz`
- Private schema: `atlas_private`
- The initial `shared_maps` table is private, has forced Row Level Security, and has no client grants or public policies.
- The website uses the `atlas-rooms` Edge Function for guest room snapshots. Local bookmarks remain browser-local unless included in a shared room.
- The browser uses only a publishable key. Server-side room operations validate input, apply rate limits, hash edit capabilities and enforce expiry; service-role credentials never enter the client.

## Stack
Vanilla JavaScript ES modules, Leaflet, globe.gl, Three.js, OpenStreetMap, Photon, OSRM, Overpass API and Esri World Imagery.

## License
See [LICENSE](./LICENSE).

Guest sharing details: see [Guest map rooms](./docs/GUEST_ROOMS.md). The live-room feature uses a dedicated Supabase Edge Function and private database schema; room links are read-only and the creator's edit capability stays in the browser session.
