# ATLAS release readiness

## Current production baseline

- Production version: **4.3.0 — Aurora Spatial Workspace**.
- Production commit: 67f114dc731b4c8e13f04c885b4824f02b7961ca.
- PR #17 merged by squash on 2026-11-03.
- Main CI: [run 41714691171](https://github.com/TEJAS-MK2/ATLAS/actions/runs/41714691171) — success.
- Main CodeQL: [run 41714690992](https://github.com/TEJAS-MK2/ATLAS/actions/runs/41714690992) — success.
- GitHub Pages test, deployment and production smoke: [run 41714690979](https://github.com/TEJAS-MK2/ATLAS/actions/runs/41714690979) — success.
- Live HTML, versioned Aurora stylesheet, app module and service worker were independently fetched from the published site; all returned HTTP 200 and reported the 4.3.0 build/cache v12.

## 4.3 release gates

- [x] Exact-main CI passes: dependency install, npm audit, unit tests, syntax checks and Playwright browser matrix.
- [x] CodeQL passes on the exact production commit.
- [x] Pages test, deployment and post-deployment production smoke pass.
- [x] Published HTML, CSS, JS, manifest and service-worker cache versions verified.
- [x] Desktop, mobile, light-theme, narrow-phone layout and offline cache acceptance pass in Playwright.
- [x] GPS permission-granted/denied flows and single-point GeoJSON export acceptance pass in Playwright.
- [ ] Review representative real-world GeoJSON, KML, GPX and CSV fixtures, including invalid and very large inputs.
- [ ] Complete manual keyboard, focus-order, screen-reader, reduced-motion and contrast review.
- [ ] Complete physical Android browser/PWA/GPS and offline-recovery checks.
- [ ] Test live map rooms with multiple independent clients and verify expiry, authorization and abuse limits.
- [ ] Confirm Supabase rate-limit retention/cleanup and trusted client-IP behaviour in the deployed environment.
- [ ] Review the five open Dependabot action PRs individually against current main.

## Repository audit notes

- package-lock.json previously declared root package version 4.0.0 while package.json declared 4.2.0. Both now align at 4.3.0 and are covered by regression tests.
- The prior stylesheet had accumulated many repeated selectors and appended version-specific patches. 4.3 adds a separately versioned visual layer to avoid extending styles.css again; full cascade consolidation remains follow-up work because it needs screenshot-based visual regression coverage.
- The 4.3 audit found and fixed out-of-order Photon search results and invalid one-point GPS GeoJSON export.
- GPS acceptance PR #12 was closed as superseded after its code and browser tests were integrated into PR #17.
- Five Dependabot workflow-action PRs remain open; review them one by one and do not batch-merge stale action updates.

## Remaining operational review

The automated release is complete. Physical-device, accessibility, live Supabase abuse/retention and representative large-dataset checks remain outstanding. Do not claim those checks passed until performed. A green CI or production smoke run is not a substitute for them.
