# ATLAS 4.0 phase completion matrix

This is an evidence ledger for the isolated `work/atlas-4.0-ci-repair` candidate. A feature existing in source code is not the same as being accepted for release.

## Change-control

- Work only on `work/atlas-4.0-ci-repair`.
- No new pull requests, merges, production-branch updates, tags, releases, or deployments are authorized.
- Production `main` remains the baseline; compare before and after every change.

## Phase status

| Phase | Scope | Evidence currently available | Status |
|---|---|---|---|
| 1 | Repository audit and architecture | Candidate compared with main; architecture and workflow files inspected | In progress; full independent review pending |
| 2 | Spatial query engine | `src/spatial.js`, spatial tests, antimeridian and polygon-hole cases | Implemented in candidate; CI verified on commit `5721d664` |
| 3 | Advanced GIS operations | `src/spatial-operations.js`, vertex editing, buffers, density-grid tests | Implemented in candidate; CI verified on commit `5721d664` |
| 4 | Data formats | `src/formats.js`, CSV/KML/GPX/GeoJSON tests, XML entity rejection and spreadsheet formula neutralization | Implemented in candidate; CI verified on commit `5721d664`; broader fixture acceptance pending |
| 5 | Release hardening | CI and CodeQL workflows include isolated branch; npm audit, unit, syntax and Playwright E2E steps passed on `5721d664` | Automated baseline passed; latest documentation commit checks are running |
| 6 | UI/UX redesign | Updated app shell, styles, responsive and UI contract tests | Implementation present; visual and accessibility acceptance pending |
| 7 | Layer management studio | Layer controls, styling and export UI plus E2E/UI contract coverage | Implementation present; full interaction acceptance pending |
| 8 | Spatial analytics dashboard | Metrics, monitoring, history and dashboard UI/test coverage | Implementation present; numerical correctness and usability review pending |
| 9 | Mapping intelligence | Existing geocoding, routing, nearby and location controls | Implementation present; provider availability and end-to-end acceptance pending |
| 10 | Live collaboration | Room UI, Supabase Edge Function, migration and security contract tests | Implementation present; live multi-client and abuse-resistance tests pending |
| 11 | Workspace and personalization | Workspace UI and contract/E2E coverage | Implementation present; persistence and restore acceptance pending |
| 12 | Offline and PWA | Service worker, manifest, shell cache and compatibility E2E checks | Implementation present; offline/online and storage-quota device tests pending |
| 13 | Security and privacy | Security policy, XML parsing guards, CSV formula neutralization, room server-side controls, CodeQL | Automated checks passed on `5721d664`; manual threat-model review pending |
| 14 | Performance and QA | Chromium/Firefox/WebKit E2E suite passes on `5721d664` | Browser automation baseline passed; large-data profiling, real Android and accessibility review pending |
| 15 | Release certification | Release checklist and this evidence ledger | HOLD; release authorization and outstanding acceptance evidence required |

## Verified GitHub Actions evidence

Commit `5721d664cb7685f93307555e4de52d2197973c33`:

- CI run [41701455044](https://github.com/TEJAS-MK2/ATLAS/actions/runs/41701455044): success.
  - `npm ci --no-audit --no-fund`
  - `npm audit --audit-level=high`
  - `npm test`
  - `npm run check`
  - Playwright browser installation and `npm run test:e2e`
- CodeQL run [41701455113](https://github.com/TEJAS-MK2/ATLAS/actions/runs/41701455113): success.

A later documentation-only commit updates this ledger and the release checklist. Its own CI and CodeQL runs must finish successfully before this ledger is considered current-head verified.

## Remaining acceptance evidence

1. Confirm CI and CodeQL on the latest branch head.
2. Capture actual browser versions and Playwright test reports.
3. Validate representative real-world import/export fixtures and geometry edge cases.
4. Perform real Android device testing, including touch, GPS permission, offline recovery and PWA installation.
5. Test two or more independent clients against live collaboration; verify authorization, rate limiting, origin validation and expiry.
6. Profile large datasets and document memory, rendering latency and limits.
7. Complete keyboard, screen-reader, focus-management and reduced-motion checks.
8. Review CSP, external providers, HTML insertion sinks, dependencies, secrets and privacy flows manually.
9. Run the production smoke test only against a separately approved candidate target; do not deploy as part of this work.

## Release decision

**HOLD.** Automated CI and CodeQL passed on the verified candidate commit above. Do not describe the full 15-phase programme as complete until every outstanding acceptance item has evidence. No merge or deployment is authorized by this document.
