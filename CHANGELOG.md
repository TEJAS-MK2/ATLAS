## 4.3.0 — 2026-11-04

- Introduced the Aurora spatial workspace design layer in a separately versioned stylesheet.
- Refined desktop navigation, map controls, floating panels, intelligence cards, dark/light themes and mobile navigation ergonomics.
- Aligned package and lockfile versions and updated PWA asset/cache versioning.
- Fixed out-of-order place-search responses and added desktop/mobile visual regression coverage.
- Refreshed release, design-system and audit documentation; added regression coverage for the new visual layer.

# Changelog

## Unreleased — ATLAS 4.0 release hardening

- Precache all statically imported ATLAS 4.0 modules and an explicit allowlist of core CDN libraries; bump the service-worker cache version to invalidate stale shells.
- Fix empty FeatureCollection imports and clear stale geometry editor selection when the active layer changes.
- Reject incomplete or invalid KML/GPX coordinates and XML DTD/entity declarations.
- Preserve multi-geometry types in ATLAS KML round trips, accept exported CSV feature-name headers, and neutralize spreadsheet formula prefixes.
- Remove large-array spread operations from geometry export and handle antimeridian-crossing buffers and density grids with split, valid GeoJSON polygons.
- Add regression coverage for import edge cases, offline cache contracts, formula-safe CSV, cross-browser compatibility and mobile layout.
- Fix point-in-polygon selection for antimeridian-crossing outer rings and holes; treat equivalent +180° and -180° point longitudes as the same meridian.
- Harden the Content Security Policy and expand post-deployment smoke checks for ATLAS 4.0 modules.

## Unreleased — ATLAS 4.0 data interoperability

- Add KML, GPX and CSV coordinate-table import/export alongside GeoJSON.
- Document format fidelity: GPX exports polygon boundaries as tracks; CSV exports coordinate rows without topology.
- Add regression coverage for KML, GPX and CSV exports and format dispatch.

## Unreleased — ATLAS 4.0 Advanced GIS

- Add immutable GeoJSON vertex editing, geodesic point buffers and browser-local density grid generation.
- Add separate map analysis overlays so buffer/density visualizations do not mutate source layers.
- Add automated unit and browser regression coverage for geometry editing, buffer validation and density grids.

## Unreleased — ATLAS 4.0 foundation

- Add reusable local spatial query primitives for GeoJSON geometry bounds, antimeridian-aware bounding-box intersection, and point containment in Polygon/MultiPolygon geometries with hole handling.
- Add focused regression coverage for invalid extents, nested geometry collections, polygon boundaries, holes, multipolygons, and feature selection.

## 3.6.0 — Field Console refinement

- Refine map-first interface hierarchy, control states and surface consistency.
- Improve touch targets, mobile safe-area spacing and floating-panel scrolling.
- Strengthen keyboard focus visibility and reduced-motion handling.
- Preserve existing map tools and browser-local privacy boundaries.


## 3.5.0 — Reliability and quality hardening

- Corrected historical activity analytics to use a rolling 24-hour timeline instead of grouping events by wall-clock hour.
- Hardened monitoring settings and observed-object identifier handling against malformed browser data.
- Escaped persisted basemap labels in the history panel and removed a duplicate production smoke-test resource.
- Added regression coverage for rolling-window boundaries, malformed settings, object identifiers, and smoke-test resource uniqueness.

## 3.4.0 — Field Console refresh

- Refined the full application shell, navigation, search, map controls, inspector cards, dialogs and floating panels with a consistent visual system.
- Reworked phone navigation into a compact four-tool dock and tightened map overlays for small screens.
- Improved focus visibility, touch target consistency, hover/active feedback, theme surfaces and reduced-motion handling.
- Updated the application version and service-worker shell cache for the 3.4 release.

## 3.3.0 — Geospatial intelligence

- Added opt-in geospatial change monitoring using active-tab OpenStreetMap/Overpass polling, with newly observed object alerts and adjustable radius/category/interval.
- Added route alternative comparison using public OSRM route alternatives.
- Added browser-local historical map and route analytics with hourly activity chart.
- Added customizable inspector dashboard widgets and a refreshed responsive Field Console interface.
- Added focused unit, UI contract, and Playwright coverage for ATLAS 3.3.


Notable project changes are recorded here. Dates and entries are added when changes are released; this file is not an exhaustive commit history.

## Unreleased

- Refined the interface into the ATLAS Field Console visual system with upgraded dark/light surfaces, navigation, controls and responsive layouts.
- Added social preview metadata and a custom repository hero graphic.
- Reorganized README badges into build/security, repository activity and technology groups; removed unverified release and coverage claims.
- Expanded design-system documentation and added SEO/social metadata.


- Added validated GeoJSON imports, feature search/inspection, geometry metrics, and spatial bounds summaries.
- Added named map views stored locally in the browser, with save, restore, and delete actions.
- Added Playwright Chromium browser tests to the deployment gate.
- Expanded coordinate display with decimal and DMS formats.
- Added repository governance, privacy, security, architecture, and contributor documentation.
- Added CodeQL analysis and Dependabot configuration.

## 2.1 — Command workspace

- Added a keyboard-first command palette with Ctrl/⌘ + K and / shortcuts.
- Added searchable actions for map tools, location controls, basemap selection, sharing, pins, and GeoJSON export.
- Refined focus, responsive, light-theme, and reduced-motion presentation.
- Expanded UI contract tests and design-system documentation.

## 2.0 — Geospatial workspace

- Added interactive map tools, route planning, nearby discovery, saved places, and GeoJSON workflows.
- Added 3D globe exploration, GPS tracking controls, and map-room sharing.
- Added installable PWA support and GitHub Pages deployment checks.


## 4.2.0 — 2026-11-03

- Reworked the visual system across the top bar, tool dock, map controls, floating panels and live intelligence inspector.
- Improved mobile navigation and touch targets while retaining the four primary map tools.
- Added explicit asset versioning and stronger service-worker update checks to prevent stale installed shells.
- Changed same-origin PWA asset refreshes to network-first requests that bypass the browser HTTP cache, while retaining offline cache fallback.
- Updated release metadata, documentation and regression contracts.
