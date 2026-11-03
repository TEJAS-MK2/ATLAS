# ATLAS 4.0 release checklist

This checklist is the release gate for the stacked ATLAS 4.0 pull requests. A checked automated gate must refer to the final commit on the relevant PR head; a checked device gate requires a human to test a physical device.

## Pull request order

- [ ] PR #13 — spatial foundation reviewed and merged.
- [ ] PR #14 — advanced GIS reviewed, retargeted to `main`, revalidated and merged.
- [ ] PR #15 — release hardening reviewed, retargeted to `main`, revalidated and merged.

Do not merge a later phase before its prerequisite is integrated. Do not merge with unresolved high-severity findings or failing required checks.

## Automated release gates

- [ ] `npm ci` installs exactly from the committed lockfile.
- [ ] `npm audit --audit-level=high` reports no high or critical dependency advisories.
- [ ] `npm test` passes on the final combined main-based PR head.
- [ ] `npm run check` passes.
- [ ] Chromium regression and offline-shell tests pass.
- [ ] Firefox compatibility tests pass.
- [ ] WebKit compatibility tests pass.
- [ ] Pixel 7 mobile-emulation tests pass.
- [ ] CodeQL reports no new alerts.
- [ ] GitHub Pages deployment succeeds.
- [ ] Post-deployment smoke test checks the live page and all required ATLAS 4.0 modules.
- [ ] Confirm the deployed commit SHA matches the reviewed release commit.

## Physical-device acceptance

- [ ] Android installation and standalone launch.
- [ ] GPS permission prompt, denial, retry and tracking stop behaviour.
- [ ] Touch targets, map gestures, bottom navigation and viewport rotation.
- [ ] Offline app-shell launch after a successful online installation.
- [ ] Clear documentation that basemap tiles and live provider data are not guaranteed offline.
- [ ] Import/export of representative GeoJSON, KML, GPX and CSV files on device.

## Release and rollback

- [ ] Tag the reviewed release commit only after every required gate passes.
- [ ] Keep the preceding production deployment identified for rollback.
- [ ] Verify the live site after deployment and check browser console/network errors.
- [ ] If smoke or acceptance checks fail, restore the previous known-good Pages deployment and investigate before retrying.

## Evidence

Record the final main-based commit SHA, CI run, CodeQL run, Pages deployment and smoke-test result in the release notes. Do not use branch-only or emulated-device results as evidence for physical-device acceptance.
