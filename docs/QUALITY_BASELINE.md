# ATLAS 3.5 Reliability Baseline

## Scope

This review starts from the inspected ATLAS 3.4 main-branch head and is isolated on `quality/atlas-3.5-reliability`. Existing map, route, GPS, GeoJSON, workspace, dashboard, and room features are preserved. No release version or production deployment is changed by this branch.

## Confirmed findings and changes

1. **Historical chart bucketing was misleading.** The chart was labelled as a recent 24-hour timeline, but its data was grouped by local wall-clock hour. It now uses 24 consecutive one-hour buckets relative to the rolling window, with explicit boundary and future-record tests.
2. **Malformed local monitoring settings were not normalized safely.** The settings normalizer now accepts null/non-object input and keeps the existing supported defaults and clamps.
3. **Observed-object identifiers accepted null and empty IDs.** The change detector now ignores missing, null, empty, and duplicate identifiers.
4. **Persisted basemap labels entered an HTML string without escaping.** The history panel now escapes the joined basemap labels before rendering.
5. **The production smoke-test resource list contained the ATLAS 3.3 module twice.** The duplicate was removed and a guard now fails if resource paths are duplicated.
6. **Release evidence guidance was underspecified.** Testing documentation now requires evidence to match the exact candidate commit and post-deployment smoke result.

## Validation performed in this environment

- Inspected the repository's latest available main-branch commit, application modules, test files, deployment workflow, service worker, package scripts, and release documentation through the connected GitHub integration.
- Created this isolated branch from the inspected main-branch head and committed the fixes and regression tests.
- Executed a standalone Node.js assertion harness for the modified rolling-window bucketing, 24-hour boundary handling, future-event exclusion, malformed history input, monitor settings normalization, and observed-object ID filtering. All assertions passed.
- Re-fetched changed repository files from the branch to verify the committed source and tests.

## Not verified here

- Full repository `npm test`, `npm run check`, and Playwright browser suite: not run. The execution environment could not resolve `github.com` for a repository checkout, and the GitHub integration does not execute repository commands.
- GitHub Actions run status for this branch: not retrieved.
- Production smoke test and live Pages response: not run from this environment.
- Physical Android/desktop acceptance, GPS permission prompts, PWA installation, offline map tiles, and external provider availability: not tested.

## Release gates

Do not merge or tag a release until the branch's GitHub Actions checks pass, the production smoke test passes against the deployed URL, and the manual device matrix in [TESTING.md](./TESTING.md) is completed for the supported devices and viewports.
