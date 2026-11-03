# ATLAS Architecture

## Overview

ATLAS is a static, browser-first geospatial application. The GitHub Pages site serves the application shell and static assets. The main interface is implemented with vanilla JavaScript ES modules and Leaflet; the 3D globe uses globe.gl/Three.js.

## Runtime components

- `index.html`: application shell, semantic controls, panels, and external library loading.
- `styles.css`: responsive layout, themes, map controls, dialogs, and reduced-motion rules.
- `app.js`: map lifecycle, basemaps, place search, routing, measurement, bookmarks, GPS, overlays, import/export, and command palette.
- `room-ui.js`: guest map-room client integration.
- `src/geo.js`: coordinate validation, distance calculations, naming helpers, and GeoJSON utilities.
- `src/spatial.js`: local spatial query primitives for geometry extents, antimeridian-aware bounds intersection, and point-in-polygon selection.
- `src/spatial-operations.js`: immutable geometry vertex editing, geodesic point buffers, and local density-grid generation.
- `sw.js` and `manifest.webmanifest`: PWA install/offline behaviour.
- `supabase/functions/atlas-rooms`: server-side room operations, when deployed in the associated Supabase project.
- `tests/` and `scripts/`: automated tests, static checks, and production smoke verification.

## Data flow

1. The browser loads the static application from GitHub Pages.
2. Leaflet renders the selected map tiles and application overlays.
3. Search, route, and nearby-discovery requests are sent to their configured public providers.
4. Saved places and GPS track points are held in browser storage/session state and can be exported as GeoJSON.
5. Guest room operations go through the `atlas-rooms` Supabase Edge Function. Server-only credentials must remain in the function environment.

## Trust boundaries

- Browser input, URL parameters, imported GeoJSON, provider responses, and shared room payloads are untrusted.
- Validate coordinates and feature structures before using them.
- Escape untrusted strings before writing HTML.
- Treat room edit capabilities as secrets; never log or publish them.
- Do not put service-role credentials in static files or client bundles.

## Build and deployment

The project intentionally has a lightweight Node.js toolchain. `npm test` runs Node's built-in test runner, `npm run check` performs syntax checks, and `scripts/smoke-test.mjs` checks published production assets. GitHub Actions runs tests before GitHub Pages deployment and runs smoke checks after deployment.

## Operational limitations

Public geospatial providers may rate-limit requests or change availability. Browser geolocation depends on device permissions and secure-context support. Offline behaviour is limited to cached application assets and does not imply offline map-tile coverage. Real-device acceptance remains necessary for GPS, PWA installation, and offline scenarios.
