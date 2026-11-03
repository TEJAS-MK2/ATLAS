# ATLAS 4.0 release readiness

This checklist is maintained on the isolated `work/atlas-4.0-ci-repair` branch. It is not a release approval and does not authorize merging or deployment.

## Change-control boundaries

- [x] Work is isolated from `main`.
- [x] No pull request was created as part of this work.
- [x] No pull request was merged.
- [x] No production deployment was initiated.
- [ ] Do not merge or deploy until the release gates below are reviewed and explicitly authorized.

## Automated verification

- [x] Correct the stale release metadata assertion: the application is version 4.0.0, not 3.6.0.
- [x] Configure CI to run on the isolated repair branch.
- [x] Obtain a successful CI run on the current branch head (CI run 41701455044, commit 5721d664).
- [x] `npm ci --no-audit --no-fund` completes.
- [x] `npm audit --audit-level=high` completes successfully (no high-severity threshold failure).
- [x] `npm test` passes.
- [x] `npm run check` passes.
- [x] Playwright Chromium, Firefox and WebKit suites pass.
- [ ] Production smoke test passes against the candidate build.

**Current verification status:** automated CI is passing on current branch head `5721d664cb7685f93307555e4de52d2197973c33`. CI run [41701455044](https://github.com/TEJAS-MK2/ATLAS/actions/runs/41701455044) completed successfully, including dependency installation, high-severity npm audit gate, unit tests, syntax checks, Playwright browser installation, and E2E tests. CodeQL run [41701455113](https://github.com/TEJAS-MK2/ATLAS/actions/runs/41701455113) also completed successfully. These results do not replace physical-device acceptance, manual security review, or production smoke testing.

## GIS acceptance

- [ ] GeoJSON import/export preserves supported geometry and feature properties.
- [ ] KML, GPX and CSV import/export round trips are checked with representative fixtures.
- [ ] Polygon holes, multipolygons, geometry collections and invalid coordinates are covered.
- [ ] Buffer and density operations are checked for expected units, bounds and empty input.
- [ ] Geometry editing updates the rendered layer and exported source consistently.
- [ ] Layer visibility, opacity, style reset and removal remain synchronized with map state.
- [ ] Large feature collections are tested for responsiveness and memory behaviour.

## Browser, mobile and accessibility acceptance

- [ ] Chromium desktop and mobile viewport checks.
- [ ] Firefox and WebKit desktop checks.
- [ ] Real Android browser acceptance on a physical device.
- [ ] Touch targets, keyboard navigation, focus visibility and reduced motion.
- [ ] Screen-reader labels and dialog focus management.
- [ ] Offline shell behaviour is checked separately from network-dependent map tiles and providers.

## Security and privacy acceptance

- [ ] Review CSP and external provider allowlists against actual runtime requirements.
- [ ] Review imported file parsing and all HTML insertion points for untrusted data handling.
- [ ] Confirm GPS permission is opt-in and stopping/restarting tracking clears stale session state.
- [ ] Confirm live-room sharing explains what map state is shared and protects edit credentials.
- [ ] Confirm no secrets, private location traces or room credentials are committed.
- [ ] Review dependency audit output and CodeQL results for the current candidate commit.

## Documentation and release operations

- [x] `SECURITY.md` exists.
- [x] `CONTRIBUTING.md` exists.
- [x] README documents the current major capabilities and external-provider limitations.
- [ ] Verify README badges against current workflow results before claiming checks pass.
- [ ] Update changelog only with changes that are actually present and verified.
- [ ] Record tested browser versions, device model/OS, viewport sizes and test evidence.
- [ ] Obtain explicit release authorization before any merge or production deployment.

## Release decision

**HOLD.** Automated CI for the corrected branch and real-device acceptance are still outstanding. This document intentionally records unverified gates instead of marking them complete.
