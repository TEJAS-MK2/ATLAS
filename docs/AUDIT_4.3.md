# ATLAS 4.3 repository audit

**Audit date:** 2026-11-04  
**Repository:** TEJAS-MK2/ATLAS  
**Production baseline:** 555621d65ba7289924386c988f9a0fe9bd00e292  
**Candidate branch:** quality/atlas-4.3-ui-audit

## Scope inspected
Repository tree, application shell, base styles, app and room modules, service worker, manifest, package metadata and lockfile, unit/UI/deployment/security contracts, CI/CodeQL/Pages workflows, GIS format/spatial modules, Supabase Edge Function and migrations, README, design system and release documents. The live GitHub Pages HTML returned HTTP 200 during inspection.

## Findings

### Fixed in the 4.3 candidate
1. **Package metadata drift (low):** package.json declared 4.2.0 while package-lock.json still declared 4.0.0 in its root package entries. Align both to 4.3.0 and add a regression assertion.
2. **Stale user-facing version labels (low):** page title, social metadata, workspace panel labels and build marker still described 4.2/4.0. Update current-facing labels and versioned asset URLs to 4.3.0.
3. **PWA cache invalidation (medium):** add a distinct 4.3 stylesheet and bump the shell cache to v12 so installed sessions fetch the new visual layer. Preserve network-first refresh and offline fallback.
4. **Place-search race (low):** overlapping Photon requests could return out of order and overwrite results for a newer query. The 4.3 candidate invalidates stale responses when input changes.
5. **CSS cascade complexity (medium):** the existing styles.css is approximately 101 KB with hundreds of selector blocks and repeated selectors from incremental releases. Add a separately versioned design layer instead of extending the legacy file further. Full cascade consolidation remains a follow-up requiring screenshot-based visual regression.
6. **Stale release documentation (low):** design, release readiness and phase matrix documents did not reflect the merged 4.2 production baseline. Refresh them and record explicit 4.3 gates.

### Reviewed; follow-up verification required
- **Guest-room rate-limit retention:** the migration creates time-bucketed rows in atlas_private.atlas_rate_limits, but no cleanup schedule is visible in the inspected migrations. Verify whether an external scheduled job exists; add bounded retention if not.
- **Client-IP trust:** the Edge Function uses cf-connecting-ip then x-real-ip. Verify which headers are injected/overwritten by the deployed Supabase edge gateway before relying on IP-based abuse controls.
- **Large imports:** GeoJSON/KML/GPX/CSV parsing is performed in the browser. Add explicit file/feature/coordinate limits and performance tests after measuring realistic use cases.
- **Style consolidation:** existing appended CSS rules create override complexity. Avoid a risky wholesale cascade rewrite until visual baselines exist for desktop, tablet and narrow mobile.
- **External providers:** map tiles, geocoding, routing, Overpass, Google Fonts and unpkg dependencies are availability/rate-limit boundaries. They are documented as external dependencies, not guaranteed services.
- **Static hosting headers:** CSP is delivered through a meta tag. GitHub Pages does not provide the same configurable response-header control as a custom server; review this constraint when changing providers or inline styles.

## Existing safeguards observed
- CSP limits scripts, connections, images, workers and document embedding.
- Supabase service-role credentials are read from Edge Function environment variables, not committed to browser source.
- Guest-room functions validate origin, request size, action, map state and capability token; use rate-limit RPCs and private RLS-protected tables.
- XML imports reject DTD/entity declarations; CSV export neutralizes spreadsheet formula prefixes.
- GPS is user-initiated and track data is described as browser-local until exported/shared.
- CI includes npm audit, unit tests, syntax checks and Playwright browser coverage; CodeQL runs separately.

## Repository state at audit start
- Open PR #12 (GPS acceptance) is based on an old main commit. Its own branch CI runs succeeded, but GitHub currently reports it as not mergeable against the current main. It needs rebase and exact-head checks.
- Five Dependabot workflow-action PRs are open and GitHub reports them as not currently mergeable. Review one by one after refreshing their base.
- 4.2 CI, CodeQL and Pages deployment/smoke all passed on the production baseline SHA. This is not evidence for the 4.3 candidate.

## Not performed
No local full-repository test execution, physical Android device acceptance, screen-reader test, live Supabase abuse test, manual pen test, or 4.3 production deployment is claimed by this report.
