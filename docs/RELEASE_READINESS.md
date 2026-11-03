# ATLAS release readiness

## Current production baseline
- Production version: **4.2.0**.
- Production commit: 555621d65ba7289924386c988f9a0fe9bd00e292.
- The 4.2 CI, CodeQL and GitHub Pages test/deploy/smoke workflows passed on that exact main-branch commit.
- The current 4.3 audit and UI refresh is isolated on quality/atlas-4.3-ui-audit; it is not production until merged and deployed.

## 4.3 release gates
- [ ] Latest branch CI passes: dependency install, audit, unit tests, syntax checks and browser matrix.
- [ ] CodeQL passes on the exact candidate commit.
- [ ] Pages test, deployment and production smoke checks pass after merge.
- [ ] Check the live 4.3 HTML, CSS, JS, manifest and service-worker cache version.
- [ ] Review representative GeoJSON, KML, GPX and CSV fixtures, including invalid and large inputs.
- [ ] Complete keyboard, focus, reduced-motion, screen-reader and contrast review.
- [ ] Complete physical Android browser/PWA/GPS and offline-recovery checks.
- [ ] Test live map rooms with multiple independent clients and verify expiry, authorization and abuse limits.
- [ ] Confirm Supabase rate-limit retention/cleanup and trusted client-IP behaviour in the deployed environment.
- [ ] Review the five open Dependabot action PRs against current main. PR #12's GPS fix is integrated into this candidate; close it as superseded after merge.

## Repository audit notes
- package-lock.json previously declared root package version 4.0.0 while package.json declared 4.2.0. The 4.3 branch aligns both files.
- The prior stylesheet had accumulated many repeated selectors and appended version-specific patches. 4.3 adds a separately versioned visual layer to avoid adding another large block to styles.css; a full cascade consolidation remains a follow-up because it needs visual regression coverage.
- The previous design-system and phase-completion documents described older release states. They are refreshed with the 4.3 candidate and evidence requirements.
- Open GPS QA PR #12 is based on an old main SHA and is not mergeable. Its one-point GeoJSON fix and GPS permission tests are included in the 4.3 candidate; close it as superseded after PR #17 merges.
- Five open Dependabot workflow PRs are not currently mergeable according to GitHub metadata. Review and test them individually; do not batch-merge stale action updates.

## Release policy
Do not claim physical-device acceptance, complete manual security review, live Supabase abuse resistance or production deployment unless those checks were actually performed. A successful workflow on another SHA is not evidence for the candidate. Keep production unchanged until the PR is reviewed and the required checks pass.
