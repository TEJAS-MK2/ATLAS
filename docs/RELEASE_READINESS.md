# ATLAS 4.0 release readiness

This checklist tracks the ATLAS 4.0 stacked release. It is an evidence ledger, not a substitute for passing checks or device acceptance.

## Change-control boundaries

- [x] No new pull request was created during final hardening.
- [x] Existing PR #13 (spatial foundation) and PR #14 (advanced GIS) were merged in dependency order.
- [x] GitHub Pages test, deploy and smoke jobs passed after PR #13 merge.
- [ ] GitHub Pages test, deploy and smoke jobs must pass after PR #14 merge.
- [ ] PR #15 release-hardening must pass CI and CodeQL before merge.
- [ ] Do not tag or announce a release until the remaining acceptance gates are reviewed.

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

**Current verified PR #14 head:** `bf46c188410e9d9d065b0f0b75a92338e9c88a21`. CI run [41705818701](https://github.com/TEJAS-MK2/ATLAS/actions/runs/41705818701) passed: 92/92 unit tests, syntax checks and 20/20 Playwright tests; npm reported 0 vulnerabilities. CodeQL run [41705818695](https://github.com/TEJAS-MK2/ATLAS/actions/runs/41705818695) passed. The PR #14 Pages deployment and smoke workflow is still a separate gate. The PR #15 candidate must be validated on its final merge commit.

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

**HOLD for final release certification.** PR #13 and #14 are merged; PR #15 remains pending final CI/CodeQL and Pages verification. Real-device, accessibility, manual security and GIS fixture acceptance remain outstanding.
