# ATLAS 4.3 audit and acceptance matrix

## Production baseline

- Audit started from main SHA 555621d65ba7289924386c988f9a0fe9bd00e292 (ATLAS 4.2.0).
- ATLAS 4.3 merged via PR #17 as production commit 67f114dc731b4c8e13f04c885b4824f02b7961ca.
- Main CI 41714691171: success.
- Main CodeQL 41714690992: success.
- Pages test/deploy/smoke 41714690979: success.
- Live 4.3.0 HTML, Aurora CSS, app module and service worker fetched successfully; cache v12 confirmed.
- Production is now ATLAS 4.3.0. Manual operational acceptance remains outstanding.

## Workstreams

| Area | Repository evidence | Acceptance state |
|---|---|---|
| Spatial engine | Coordinate validation, antimeridian-aware query code and spatial operations | Automated tests pass; broader real-world fixtures still needed |
| Interchange | GeoJSON, KML, GPX and CSV adapters with XML and CSV safeguards | Automated format tests pass; manual fixture review pending |
| Map workspace | Search, basemaps, route, nearby, measurement, pins and 3D globe | Implemented; provider-dependent and field acceptance remains |
| GIS studio | Overlay manager, styling, feature inspection, buffers, density and vertex editing | Implemented; representative datasets and large-layer profiling pending |
| Intelligence | Monitoring, history, route alternatives and dashboard preferences | Implemented; public-provider availability and numerical review pending |
| Collaboration | Supabase Edge Function, private schema, RLS, capability tokens and rate limits | Source safeguards present; live multi-client and deployment review pending |
| PWA | Versioned shell, local module cache and user-controlled update prompt | Browser/offline cache acceptance passes; physical offline/device acceptance pending |
| UI/UX | Responsive Aurora dark/light workspace, map overlays, inspector and mobile dock | Desktop/mobile/light-theme/320px browser checks pass; manual accessibility and device review pending |
| Security | CSP, CodeQL, XML parser guards, CSV formula neutralization and room capability checks | CI audit and CodeQL pass; manual security review and live abuse checks pending |
| Repository governance | Security, contributing, support, privacy and architecture documents | Present; release and audit evidence refreshed |
| Release | CI, CodeQL, Pages and production smoke workflows | 4.3.0 deployed; all automated production gates pass |

## Outstanding operational review

1. Review the five open Dependabot action updates against current main.
2. Confirm whether Supabase rate-limit buckets are cleaned up and whether edge IP headers are trustworthy in the deployed environment.
3. Profile large imported datasets and check memory/interaction responsiveness.
4. Complete Android GPS, PWA install, offline recovery and safe-area checks on a physical device.
5. Complete keyboard-only, screen-reader, focus-order, contrast and reduced-motion review.
6. Confirm live-room create/read/update/expiry and rate-limit behaviour against the deployed Supabase project.

## Decision

**ATLAS 4.3.0 is deployed.** Automated checks and production smoke pass. The remaining items are explicit manual/operational acceptance tasks, not claimed as complete.
