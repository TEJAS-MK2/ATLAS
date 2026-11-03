# ATLAS 4.3 audit and acceptance matrix

## Baseline
- Current main at audit start: 555621d65ba7289924386c988f9a0fe9bd00e292 (ATLAS 4.2.0).
- Main-branch CI: success on that SHA.
- Main-branch CodeQL: success on that SHA.
- GitHub Pages deployment and post-deploy smoke: success on that SHA.
- Candidate branch: quality/atlas-4.3-ui-audit.
- Production remains unchanged while the candidate is reviewed.

## Workstreams
| Area | Repository evidence | Acceptance state |
|---|---|---|
| Spatial engine | Coordinate validation, antimeridian-aware query code and spatial operations | Automated tests exist; broader real-world fixtures still needed |
| Interchange | GeoJSON, KML, GPX and CSV adapters with XML and CSV safeguards | Automated format tests exist; manual fixture review pending |
| Map workspace | Search, basemaps, route, nearby, measurement, pins and 3D globe | Implemented; provider-dependent end-to-end acceptance remains |
| GIS studio | Overlay manager, styling, feature inspection, buffers, density and vertex editing | Implemented; representative datasets and large-layer profiling pending |
| Intelligence | Monitoring, history, route alternatives and dashboard preferences | Implemented; public-provider availability and numerical review pending |
| Collaboration | Supabase Edge Function, private schema, RLS, capability tokens and rate limits | Source-level safeguards present; live multi-client and deployment review pending |
| PWA | Versioned shell, local module cache and user-controlled update prompt | Automated compatibility tests exist; physical offline/device acceptance pending |
| UI/UX | Responsive dark/light workspace, map overlays, inspector and mobile dock | 4.3 visual layer added; visual, accessibility and device review pending |
| Security | CSP, CodeQL, XML parser guards, CSV formula neutralization and room capability checks | Automated checks pass on 4.2 baseline; 4.3 candidate and manual review pending |
| Repository governance | Security, contributing, support, privacy and architecture documents | Present; version and release evidence refreshed in this audit |
| Release | CI, CodeQL, Pages and production smoke workflows | 4.2 passed; 4.3 candidate must pass its own runs |

## Outstanding operational review
1. GPS acceptance PR #12's one-point export fix and permission tests are included in this candidate; close PR #12 as superseded after merge.
2. Review the five open Dependabot action updates against current workflow requirements.
3. Confirm whether Supabase rate-limit buckets are cleaned up and whether edge IP headers are trustworthy in the deployed environment.
4. Profile large imported datasets and check memory/interaction responsiveness.
5. Complete Android GPS, PWA install, offline recovery and safe-area checks on a physical device.
6. Complete keyboard-only, screen-reader, focus-order, contrast and reduced-motion review.
7. Confirm live-room create/read/update/expiry and rate-limit behaviour against the deployed Supabase project.

## Decision
**ATLAS 4.3 candidate — HOLD pending exact-head CI, CodeQL, review and post-merge Pages smoke.** No production change is made by this audit branch.
