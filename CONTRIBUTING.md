# Contributing to ATLAS

Thanks for helping improve ATLAS. Contributions should make the mapping workspace more useful, accessible, reliable, and privacy-conscious.

## Before starting

- Search existing issues and pull requests to avoid duplicate work.
- For a substantial feature or architecture change, open an issue first to discuss scope.
- Keep changes focused. Avoid unrelated formatting or generated-file churn.
- Never include real personal location history, credentials, access tokens, or private room links in commits, tests, screenshots, or fixtures.

## Development setup

Requirements: Node.js 22 or newer and Git.

```bash
git clone https://github.com/TEJAS-MK2/ATLAS.git
cd ATLAS
npm test
npm run check
node scripts/smoke-test.mjs
python3 -m http.server 8080
```

Open http://localhost:8080. Some integrations require network access and may be rate-limited by their public providers.

## Change guidelines

- Preserve the map-first experience and responsive behaviour across desktop and mobile.
- Keep browser geolocation opt-in and clearly explain when location data is shared.
- Never add fake telemetry, fabricated traffic, or claims of real-time data without a real source.
- Use semantic HTML, accessible labels, keyboard support, visible focus, and reduced-motion support.
- Escape untrusted text before inserting it into HTML. Validate imported GeoJSON and coordinates.
- Keep secrets on the server. Never expose Supabase service-role credentials in browser code.
- Prefer small, dependency-light changes and reuse existing project patterns.
- Update documentation when behaviour, setup, privacy, or deployment changes.

## Tests and verification

Before opening a pull request, run:

```bash
npm test
npm run check
node scripts/smoke-test.mjs
```

Add or update tests for changed behaviour. For UI changes, describe the viewport sizes and browsers checked. For location, offline, or permission-sensitive behaviour, distinguish automated checks from real-device testing.

## Pull requests

- Use a clear, imperative title (for example, "Improve GeoJSON overlay inspection").
- Explain the problem, the approach, and any trade-offs.
- Link related issues with closing keywords when appropriate.
- Include screenshots for visible UI changes and note desktop/mobile behaviour.
- List tests actually run and their results; do not claim checks that were not performed.
- Call out privacy, security, data migration, or configuration implications.
- Keep the pull request focused and ready for review.

By submitting a contribution, you agree that your contributions are provided under the repository's MIT license.
