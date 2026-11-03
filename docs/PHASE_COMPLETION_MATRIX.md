# ATLAS 4.0 phase completion matrix

This is an evidence ledger for the ATLAS 4.0 stacked release. A feature existing in source code is not the same as being accepted for release.

## Change-control

- No new pull request was created during this hardening pass.
- PR #13 and PR #14 were merged in dependency order; `main` is now at merge commit `33681334d411e17f68bd36188838190517a436ec`.
- GitHub Pages deployment after PR #13 passed test, deploy and smoke jobs; PR #14 Pages workflow is the next production gate.
- PR #15 remains open and must pass CI/CodeQL before it is merged. No tag or release has been created.

## Phase status

| Phase | Scope | Evidence currently available | Status |
|---|---|---|---|
| 1 | Repository audit and architecture | Candidate compared with main; architecture and workflow files inspected | In progress; full independent review pending |
| 2 | Spatial query engine | `src/spatial.js`, spatial tests, antimeridian and polygon-hole cases | Implemented in candidate; CI verified on commit `5721d664` |
| 3 | Advanced GIS operations | `src/spatial-operations.js`, vertex editing, buffers, density-grid tests | Implemented in candidate; CI verified on commit `5721d664` |
| 4 | Data formats | `src/formats.js`, CSV/KML/GPX/GeoJSON tests, XML entity rejection and spreadsheet formula neutralization | Implemented in candidate; CI verified on commit `5721d664`; broader fixture acceptance pending |
| 5 | Release hardening | CI and CodeQL workflows include isolated branch; npm audit, unit, syntax and Playwright E2E steps passed on `5721d664` | PR #14 CI and CodeQL passed on `bf46c188`; final PR #15 candidate checks pending |
| 6 | UI/UX redesign | Updated app shell, styles, responsive and UI contract tests | Implementation present; visual and accessibility acceptance pending |
| 7 | Layer management studio | Layer controls, styling and export UI plus E2E/UI contract coverage | Implementation present; full interaction acceptance pending |
| 8 | Spatial analytics dashboard | Metrics, monitoring, history and dashboard UI/test coverage | Implementation present; numerical correctness and usability review pending |
| 9 | Mapping intelligence | Existing geocoding, routing, nearby and location controls | Implementation present; provider availability and end-to-end acceptance pending |
| 10 | Live collaboration | Room UI, Supabase Edge Function, migration and security contract tests | Implementation present; live multi-client and abuse-resistance tests pending |
| 11 | Workspace and personalization | Workspace UI and contract/E2E coverage | Implementation present; persistence and restore acceptance pending |
| 12 | Offline and PWA | Service worker, manifest, shell cache and compatibility E2E checks | Implementation present; offline/online and storage-quota device tests pending |
| 13 | Security and privacy | Security policy, XML parsing guards, CSV formula neutralization, room server-side controls, CodeQL | PR #14 CodeQL passed on `bf46c188`; manual threat-model review pending |
| 14 | Performance and QA | Chromium/Firefox/WebKit E2E suite passes on `5721d664` | PR #14 Playwright Chromium suite passed (20/20); large-data profiling, real Android and accessibility review pending |
| 15 | Release certification | Release checklist and this evidence ledger | HOLD; release authorization and outstanding acceptance evidence required |

## Verified GitHub Actions evidence

PR #14 head `bf46c188410e9d9d065b0f0b75a92338e9c88a21`:

- CI run [41705818701](https://github.com/TEJAS-MK2/ATLAS/actions/runs/41705818701): success — 92/92 unit tests, `npm run check`, and 20/20 Playwright tests; dependency audit reported 0 vulnerabilities.
- CodeQL run [41705818695](https://github.com/TEJAS-MK2/ATLAS/actions/runs/41705818695): success.
- PR #13 Pages run [41705701930](https://github.com/TEJAS-MK2/ATLAS/actions/runs/41705701930): test, deploy and smoke jobs all succeeded.

The final PR #15 merge commit must complete its own CI and CodeQL checks, followed by the main-branch Pages test/deploy/smoke workflow.

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

**HOLD for final release certification.** PR #13 and #14 are merged. PR #15 and its Pages deployment gates remain outstanding; physical-device, accessibility, manual security and representative GIS fixture acceptance also remain open.
