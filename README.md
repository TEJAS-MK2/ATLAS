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

## Extended badge wall

The following 100 additional badges summarize documented Atlas components, workflows and capabilities. This section is collapsible to keep the README easy to scan.

<details>
<summary>Show all 100 additional badges</summary>

### Mapping & rendering
[![ Leaflet — Interactive maps ](https://img.shields.io/badge/Leaflet-Interactive%20maps-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Three.js — 3D rendering ](https://img.shields.io/badge/Three.js-3D%20rendering-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ globe.gl — 3D globe ](https://img.shields.io/badge/globe.gl-3D%20globe-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ OpenStreetMap — Map data ](https://img.shields.io/badge/OpenStreetMap-Map%20data-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Esri imagery — Satellite basemap ](https://img.shields.io/badge/Esri%20imagery-Satellite%20basemap-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Street basemap — Map layer ](https://img.shields.io/badge/Street%20basemap-Map%20layer-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Light basemap — Map layer ](https://img.shields.io/badge/Light%20basemap-Map%20layer-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Dark basemap — Map layer ](https://img.shields.io/badge/Dark%20basemap-Map%20layer-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Terrain basemap — Map layer ](https://img.shields.io/badge/Terrain%20basemap-Map%20layer-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Satellite basemap — Map layer ](https://img.shields.io/badge/Satellite%20basemap-Map%20layer-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Map layers — Layer controls ](https://img.shields.io/badge/Map%20layers-Layer%20controls-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Map controls — Interactive UI ](https://img.shields.io/badge/Map%20controls-Interactive%20UI-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Responsive maps — Mobile ready ](https://img.shields.io/badge/Responsive%20maps-Mobile%20ready-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Desktop maps — Responsive UI ](https://img.shields.io/badge/Desktop%20maps-Responsive%20UI-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Tablet maps — Responsive UI ](https://img.shields.io/badge/Tablet%20maps-Responsive%20UI-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Map center links — Shareable view ](https://img.shields.io/badge/Map%20center%20links-Shareable%20view-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Zoom controls — Map navigation ](https://img.shields.io/badge/Zoom%20controls-Map%20navigation-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Pan controls — Map navigation ](https://img.shields.io/badge/Pan%20controls-Map%20navigation-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Street View handoff — Google Maps ](https://img.shields.io/badge/Street%20View%20handoff-Google%20Maps-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Web mapping — Browser GIS ](https://img.shields.io/badge/Web%20mapping-Browser%20GIS-informational)](https://github.com/TEJAS-MK2/ATLAS)
### Geospatial workflows
[![ GeoJSON — Import ](https://img.shields.io/badge/GeoJSON-Import-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ GeoJSON — Export ](https://img.shields.io/badge/GeoJSON-Export-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ GPS tracking — Opt in ](https://img.shields.io/badge/GPS%20tracking-Opt%20in-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Browser geolocation — Permission based ](https://img.shields.io/badge/Browser%20geolocation-Permission%20based-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Track recording — User controlled ](https://img.shields.io/badge/Track%20recording-User%20controlled-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Track export — GeoJSON ](https://img.shields.io/badge/Track%20export-GeoJSON-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Distance measurement — Map tool ](https://img.shields.io/badge/Distance%20measurement-Map%20tool-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Saved places — Local storage ](https://img.shields.io/badge/Saved%20places-Local%20storage-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Place search — Photon ](https://img.shields.io/badge/Place%20search-Photon-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Nearby POIs — OpenStreetMap ](https://img.shields.io/badge/Nearby%20POIs-OpenStreetMap-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Building overlays — Overpass ](https://img.shields.io/badge/Building%20overlays-Overpass-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Park overlays — Overpass ](https://img.shields.io/badge/Park%20overlays-Overpass-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Water overlays — Overpass ](https://img.shields.io/badge/Water%20overlays-Overpass-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Driving routes — OSRM ](https://img.shields.io/badge/Driving%20routes-OSRM-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Route planning — Public demo ](https://img.shields.io/badge/Route%20planning-Public%20demo-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Coordinate sharing — URL encoded ](https://img.shields.io/badge/Coordinate%20sharing-URL%20encoded-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Map snapshots — Guest rooms ](https://img.shields.io/badge/Map%20snapshots-Guest%20rooms-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Seven day rooms — Expiry ](https://img.shields.io/badge/Seven%20day%20rooms-Expiry-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Read only links — Guest sharing ](https://img.shields.io/badge/Read%20only%20links-Guest%20sharing-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Private edit token — Capability based ](https://img.shields.io/badge/Private%20edit%20token-Capability%20based-informational)](https://github.com/TEJAS-MK2/ATLAS)
### Browser & user experience
[![ Progressive Web App — PWA ](https://img.shields.io/badge/Progressive%20Web%20App-PWA-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Offline shell — Cache ](https://img.shields.io/badge/Offline%20shell-Cache-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Local bookmarks — Browser storage ](https://img.shields.io/badge/Local%20bookmarks-Browser%20storage-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Local track data — Browser storage ](https://img.shields.io/badge/Local%20track%20data-Browser%20storage-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ No user accounts — Accountless ](https://img.shields.io/badge/No%20user%20accounts-Accountless-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ No passwords — Accountless ](https://img.shields.io/badge/No%20passwords-Accountless-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Guest sharing — Enabled ](https://img.shields.io/badge/Guest%20sharing-Enabled-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Viewer refresh — 5 seconds ](https://img.shields.io/badge/Viewer%20refresh-5%20seconds-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Mobile layout — Responsive ](https://img.shields.io/badge/Mobile%20layout-Responsive-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Desktop layout — Responsive ](https://img.shields.io/badge/Desktop%20layout-Responsive-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Tablet layout — Responsive ](https://img.shields.io/badge/Tablet%20layout-Responsive-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Network diagnostics — Browser support ](https://img.shields.io/badge/Network%20diagnostics-Browser%20support-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ File import — GeoJSON ](https://img.shields.io/badge/File%20import-GeoJSON-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ File export — GeoJSON ](https://img.shields.io/badge/File%20export-GeoJSON-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Map search — Photon ](https://img.shields.io/badge/Map%20search-Photon-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ External Street View — Google Maps ](https://img.shields.io/badge/External%20Street%20View-Google%20Maps-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Permission first GPS — Privacy ](https://img.shields.io/badge/Permission%20first%20GPS-Privacy-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Manual tracking — User initiated ](https://img.shields.io/badge/Manual%20tracking-User%20initiated-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Public map services — Rate limited ](https://img.shields.io/badge/Public%20map%20services-Rate%20limited-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ No live traffic claims — Transparent data ](https://img.shields.io/badge/No%20live%20traffic%20claims-Transparent%20data-informational)](https://github.com/TEJAS-MK2/ATLAS)
### Backend & privacy design
[![ Supabase — Backend ](https://img.shields.io/badge/Supabase-Backend-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Edge Functions — atlas-rooms ](https://img.shields.io/badge/Edge%20Functions-atlas--rooms-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Private schema — atlas_private ](https://img.shields.io/badge/Private%20schema-atlas_private-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Row Level Security — Forced ](https://img.shields.io/badge/Row%20Level%20Security-Forced-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Capability tokens — Room editing ](https://img.shields.io/badge/Capability%20tokens-Room%20editing-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Hashed capabilities — Server side ](https://img.shields.io/badge/Hashed%20capabilities-Server%20side-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Rate limiting — Enabled ](https://img.shields.io/badge/Rate%20limiting-Enabled-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Room expiry — 7 days ](https://img.shields.io/badge/Room%20expiry-7%20days-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Read only viewers — Guest rooms ](https://img.shields.io/badge/Read%20only%20viewers-Guest%20rooms-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Creator edit access — Capability ](https://img.shields.io/badge/Creator%20edit%20access-Capability-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Publishable key — Browser only ](https://img.shields.io/badge/Publishable%20key-Browser%20only-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Service role — Server only ](https://img.shields.io/badge/Service%20role-Server%20only-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ No client secrets — Design ](https://img.shields.io/badge/No%20client%20secrets-Design-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Input validation — Server side ](https://img.shields.io/badge/Input%20validation-Server%20side-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Private shared maps — Database ](https://img.shields.io/badge/Private%20shared%20maps-Database-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Private rate limits — Database ](https://img.shields.io/badge/Private%20rate%20limits-Database-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Mumbai region — ap-south-1 ](https://img.shields.io/badge/Mumbai%20region-ap--south--1-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Guest first — Architecture ](https://img.shields.io/badge/Guest%20first-Architecture-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Local first bookmarks — Privacy ](https://img.shields.io/badge/Local%20first%20bookmarks-Privacy-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ No account database — Architecture ](https://img.shields.io/badge/No%20account%20database-Architecture-informational)](https://github.com/TEJAS-MK2/ATLAS)
### Engineering & delivery
[![ JavaScript — ES modules ](https://img.shields.io/badge/JavaScript-ES%20modules-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Node.js — 22 CI ](https://img.shields.io/badge/Node.js-22%20CI-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Node.js — 20 plus local ](https://img.shields.io/badge/Node.js-20%20plus%20local-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ npm — Scripts ](https://img.shields.io/badge/npm-Scripts-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Node test runner — Unit tests ](https://img.shields.io/badge/Node%20test%20runner-Unit%20tests-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Syntax checks — npm run check ](https://img.shields.io/badge/Syntax%20checks-npm%20run%20check-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ GitHub Actions — CI workflow ](https://img.shields.io/badge/GitHub%20Actions-CI%20workflow-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ GitHub Pages — Deployment ](https://img.shields.io/badge/GitHub%20Pages-Deployment-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Pages artifact — Upload ](https://img.shields.io/badge/Pages%20artifact-Upload-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Pages deploy — Deploy action ](https://img.shields.io/badge/Pages%20deploy-Deploy%20action-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Workflow dispatch — Manual run ](https://img.shields.io/badge/Workflow%20dispatch-Manual%20run-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Push to main — CI trigger ](https://img.shields.io/badge/Push%20to%20main-CI%20trigger-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Deploy gate — Tests first ](https://img.shields.io/badge/Deploy%20gate-Tests%20first-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ MIT — License ](https://img.shields.io/badge/MIT-License-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Public repository — GitHub ](https://img.shields.io/badge/Public%20repository-GitHub-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Issue tracking — GitHub ](https://img.shields.io/badge/Issue%20tracking-GitHub-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Pull requests — GitHub ](https://img.shields.io/badge/Pull%20requests-GitHub-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Commit history — Git ](https://img.shields.io/badge/Commit%20history-Git-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Documentation — README ](https://img.shields.io/badge/Documentation-README-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ Guest room guide — Docs ](https://img.shields.io/badge/Guest%20room%20guide-Docs-informational)](https://github.com/TEJAS-MK2/ATLAS)

</details>

## More Atlas badges

A second compact badge collection covering the documented interface, mapping data sources and guest-room architecture.

<details>
<summary>Show 50 more badges</summary>

### Map interaction
[![Map panning](https://img.shields.io/badge/Map%20panning-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Map zooming](https://img.shields.io/badge/Map%20zooming-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Layer switching](https://img.shields.io/badge/Layer%20switching-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Map centering](https://img.shields.io/badge/Map%20centering-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Map sharing](https://img.shields.io/badge/Map%20sharing-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Coordinate links](https://img.shields.io/badge/Coordinate%20links-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Map viewport](https://img.shields.io/badge/Map%20viewport-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Interactive controls](https://img.shields.io/badge/Interactive%20controls-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Map exploration](https://img.shields.io/badge/Map%20exploration-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Geospatial UI](https://img.shields.io/badge/Geospatial%20UI-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
### Location & navigation
[![GPS permission](https://img.shields.io/badge/GPS%20permission-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Location search](https://img.shields.io/badge/Location%20search-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Place discovery](https://img.shields.io/badge/Place%20discovery-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Nearby features](https://img.shields.io/badge/Nearby%20features-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Route display](https://img.shields.io/badge/Route%20display-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Route requests](https://img.shields.io/badge/Route%20requests-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Track sessions](https://img.shields.io/badge/Track%20sessions-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Track points](https://img.shields.io/badge/Track%20points-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Distance tools](https://img.shields.io/badge/Distance%20tools-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Street imagery](https://img.shields.io/badge/Street%20imagery-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
### Data formats & sources
[![GeoJSON files](https://img.shields.io/badge/GeoJSON%20files-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Open map data](https://img.shields.io/badge/Open%20map%20data-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![OSM Overpass](https://img.shields.io/badge/OSM%20Overpass-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Photon search](https://img.shields.io/badge/Photon%20search-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![OSRM routing](https://img.shields.io/badge/OSRM%20routing-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Esri World Imagery](https://img.shields.io/badge/Esri%20World%20Imagery-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Public basemaps](https://img.shields.io/badge/Public%20basemaps-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Map tiles](https://img.shields.io/badge/Map%20tiles-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Vector features](https://img.shields.io/badge/Vector%20features-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Geographic data](https://img.shields.io/badge/Geographic%20data-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
### Web platform
[![Browser application](https://img.shields.io/badge/Browser%20application-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Vanilla JavaScript](https://img.shields.io/badge/Vanilla%20JavaScript-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ES module imports](https://img.shields.io/badge/ES%20module%20imports-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Static site hosting](https://img.shields.io/badge/Static%20site%20hosting-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![HTTPS deployment](https://img.shields.io/badge/HTTPS%20deployment-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![PWA manifest](https://img.shields.io/badge/PWA%20manifest-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Service worker cache](https://img.shields.io/badge/Service%20worker%20cache-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Local browser data](https://img.shields.io/badge/Local%20browser%20data-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![URL state sharing](https://img.shields.io/badge/URL%20state%20sharing-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Responsive interface](https://img.shields.io/badge/Responsive%20interface-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
### Guest rooms & controls
[![Guest map rooms](https://img.shields.io/badge/Guest%20map%20rooms-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Room snapshots](https://img.shields.io/badge/Room%20snapshots-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Viewer access](https://img.shields.io/badge/Viewer%20access-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Creator controls](https://img.shields.io/badge/Creator%20controls-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Edit capability](https://img.shields.io/badge/Edit%20capability-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Room expiration](https://img.shields.io/badge/Room%20expiration-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Polling refresh](https://img.shields.io/badge/Polling%20refresh-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Server validation](https://img.shields.io/badge/Server%20validation-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Request throttling](https://img.shields.io/badge/Request%20throttling-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Private database](https://img.shields.io/badge/Private%20database-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)

</details>

## Atlas badge collection — volume 3

Another 100 topic badges for the project's documented geospatial workflows, integrations, privacy model, engineering workflow and user experience.

<details>
<summary>Expand 100 additional badges</summary>

### Geospatial foundations
[![Latitude and longitude](https://img.shields.io/badge/Latitude%20and%20longitude-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Geographic coordinates](https://img.shields.io/badge/Geographic%20coordinates-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Web map projection](https://img.shields.io/badge/Web%20map%20projection-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Map viewport state](https://img.shields.io/badge/Map%20viewport%20state-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Zoom level state](https://img.shields.io/badge/Zoom%20level%20state-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Interactive baselayers](https://img.shields.io/badge/Interactive%20baselayers-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Raster map tiles](https://img.shields.io/badge/Raster%20map%20tiles-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Map attribution](https://img.shields.io/badge/Map%20attribution-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Map scale context](https://img.shields.io/badge/Map%20scale%20context-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Geographic visualization](https://img.shields.io/badge/Geographic%20visualization-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Point features](https://img.shields.io/badge/Point%20features-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Line features](https://img.shields.io/badge/Line%20features-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Polygon features](https://img.shields.io/badge/Polygon%20features-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Feature collections](https://img.shields.io/badge/Feature%20collections-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Spatial overlays](https://img.shields.io/badge/Spatial%20overlays-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Map markers](https://img.shields.io/badge/Map%20markers-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Place coordinates](https://img.shields.io/badge/Place%20coordinates-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Route geometry](https://img.shields.io/badge/Route%20geometry-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Track geometry](https://img.shields.io/badge/Track%20geometry-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Geographic exports](https://img.shields.io/badge/Geographic%20exports-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
### External integrations
[![Photon geocoder](https://img.shields.io/badge/Photon%20geocoder-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![OSRM routing service](https://img.shields.io/badge/OSRM%20routing%20service-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Overpass queries](https://img.shields.io/badge/Overpass%20queries-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![OpenStreetMap ecosystem](https://img.shields.io/badge/OpenStreetMap%20ecosystem-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Esri imagery tiles](https://img.shields.io/badge/Esri%20imagery%20tiles-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Google Maps handoff](https://img.shields.io/badge/Google%20Maps%20handoff-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Supabase project](https://img.shields.io/badge/Supabase%20project-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Supabase Functions](https://img.shields.io/badge/Supabase%20Functions-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Supabase database](https://img.shields.io/badge/Supabase%20database-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![GitHub repository](https://img.shields.io/badge/GitHub%20repository-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![GitHub Actions workflow](https://img.shields.io/badge/GitHub%20Actions%20workflow-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![GitHub Pages site](https://img.shields.io/badge/GitHub%20Pages%20site-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Shields.io badges](https://img.shields.io/badge/Shields.io%20badges-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Browser APIs](https://img.shields.io/badge/Browser%20APIs-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Geolocation API](https://img.shields.io/badge/Geolocation%20API-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Local storage API](https://img.shields.io/badge/Local%20storage%20API-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![URL sharing](https://img.shields.io/badge/URL%20sharing-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Static asset delivery](https://img.shields.io/badge/Static%20asset%20delivery-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Public service endpoints](https://img.shields.io/badge/Public%20service%20endpoints-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![External data providers](https://img.shields.io/badge/External%20data%20providers-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
### Privacy principles
[![Permission based location](https://img.shields.io/badge/Permission%20based%20location-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![User initiated tracking](https://img.shields.io/badge/User%20initiated%20tracking-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Explicit tracking start](https://img.shields.io/badge/Explicit%20tracking%20start-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Explicit tracking stop](https://img.shields.io/badge/Explicit%20tracking%20stop-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Browser side bookmarks](https://img.shields.io/badge/Browser%20side%20bookmarks-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Browser side tracks](https://img.shields.io/badge/Browser%20side%20tracks-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![No automatic GPS](https://img.shields.io/badge/No%20automatic%20GPS-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![No account registration](https://img.shields.io/badge/No%20account%20registration-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![No password collection](https://img.shields.io/badge/No%20password%20collection-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![No client service secrets](https://img.shields.io/badge/No%20client%20service%20secrets-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Private schema boundary](https://img.shields.io/badge/Private%20schema%20boundary-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Forced row security](https://img.shields.io/badge/Forced%20row%20security-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Server side capability checks](https://img.shields.io/badge/Server%20side%20capability%20checks-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Hashed edit credentials](https://img.shields.io/badge/Hashed%20edit%20credentials-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Room lifetime limits](https://img.shields.io/badge/Room%20lifetime%20limits-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Read only sharing](https://img.shields.io/badge/Read%20only%20sharing-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Input validation boundary](https://img.shields.io/badge/Input%20validation%20boundary-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Rate limit controls](https://img.shields.io/badge/Rate%20limit%20controls-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Provider transparency](https://img.shields.io/badge/Provider%20transparency-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Local data portability](https://img.shields.io/badge/Local%20data%20portability-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
### Development workflow
[![Node test command](https://img.shields.io/badge/Node%20test%20command-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![JavaScript syntax validation](https://img.shields.io/badge/JavaScript%20syntax%20validation-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![ES module runtime](https://img.shields.io/badge/ES%20module%20runtime-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Node package scripts](https://img.shields.io/badge/Node%20package%20scripts-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Continuous integration](https://img.shields.io/badge/Continuous%20integration-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Workflow test job](https://img.shields.io/badge/Workflow%20test%20job-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Deployment dependency gate](https://img.shields.io/badge/Deployment%20dependency%20gate-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Pages artifact upload](https://img.shields.io/badge/Pages%20artifact%20upload-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Pages deployment action](https://img.shields.io/badge/Pages%20deployment%20action-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Manual workflow trigger](https://img.shields.io/badge/Manual%20workflow%20trigger-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Main branch trigger](https://img.shields.io/badge/Main%20branch%20trigger-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Git commit history](https://img.shields.io/badge/Git%20commit%20history-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Repository issue tracker](https://img.shields.io/badge/Repository%20issue%20tracker-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Pull request workflow](https://img.shields.io/badge/Pull%20request%20workflow-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![MIT licensed project](https://img.shields.io/badge/MIT%20licensed%20project-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Project README](https://img.shields.io/badge/Project%20README-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Guest room documentation](https://img.shields.io/badge/Guest%20room%20documentation-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Local HTTP preview](https://img.shields.io/badge/Local%20HTTP%20preview-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Node.js development](https://img.shields.io/badge/Node.js%20development-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Static hosting workflow](https://img.shields.io/badge/Static%20hosting%20workflow-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
### Product experience
[![Mobile first access](https://img.shields.io/badge/Mobile%20first%20access-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Desktop map workspace](https://img.shields.io/badge/Desktop%20map%20workspace-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Tablet friendly layout](https://img.shields.io/badge/Tablet%20friendly%20layout-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Responsive map canvas](https://img.shields.io/badge/Responsive%20map%20canvas-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Interactive 3D globe](https://img.shields.io/badge/Interactive%203D%20globe-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Satellite map view](https://img.shields.io/badge/Satellite%20map%20view-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Terrain map view](https://img.shields.io/badge/Terrain%20map%20view-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Dark map theme](https://img.shields.io/badge/Dark%20map%20theme-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Light map theme](https://img.shields.io/badge/Light%20map%20theme-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Street map view](https://img.shields.io/badge/Street%20map%20view-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Place lookup workflow](https://img.shields.io/badge/Place%20lookup%20workflow-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Nearby POI workflow](https://img.shields.io/badge/Nearby%20POI%20workflow-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Driving route workflow](https://img.shields.io/badge/Driving%20route%20workflow-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Distance measurement tool](https://img.shields.io/badge/Distance%20measurement%20tool-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Saved location workflow](https://img.shields.io/badge/Saved%20location%20workflow-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![GeoJSON import workflow](https://img.shields.io/badge/GeoJSON%20import%20workflow-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![GeoJSON export workflow](https://img.shields.io/badge/GeoJSON%20export%20workflow-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Guest room viewer](https://img.shields.io/badge/Guest%20room%20viewer-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Shareable map links](https://img.shields.io/badge/Shareable%20map%20links-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)
[![Browser network checks](https://img.shields.io/badge/Browser%20network%20checks-Atlas-informational)](https://github.com/TEJAS-MK2/ATLAS)

</details>
