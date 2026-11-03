# Testing and Quality Checks

## Automated checks

Requirements: Node.js 22+ and Python 3 for the local static test server.

```bash
npm install
npm test
npm run check
npm run test:e2e
node scripts/smoke-test.mjs
```

- `npm test` runs the Node.js built-in test runner, including geospatial, spatial-query, spatial-operations, spatial-analytics, history-window, UI-contract and security-contract tests.
- `npm run check` runs syntax checks on the main application modules.
- `npm run test:e2e` runs Playwright Chromium tests against a local static server. The suite checks map initialization, command palette behaviour, layer controls, GeoJSON import validation and inspection, saved map view persistence, and narrow mobile overflow.
- `scripts/smoke-test.mjs` checks the published site and required production assets when network access is available; it also rejects duplicate resource entries.

GitHub Actions runs unit tests, syntax checks, and browser tests before GitHub Pages deployment, then performs a production smoke check. CodeQL separately analyzes JavaScript/TypeScript.

## Release evidence

For every release candidate, record the exact commit SHA and the linked GitHub Actions run. A green workflow on a different commit is not evidence for the candidate. The production smoke job must run after Pages deployment and pass against the deployed URL. If a workflow or production endpoint cannot be inspected, mark that check as **not verified** rather than inferring success from configuration or badges.

## Manual UI acceptance

Check the interface at these viewport widths:

| Class | Suggested viewport |
|---|---:|
| Wide desktop | 1440 px |
| Compact desktop | 1280 px |
| Tablet | 900 px |
| Phone | 390 px |
| Narrow phone | 320 px |

Verify:
- Dark and light themes.
- Map controls and attribution remain visible.
- Command palette keyboard navigation and focus handling.
- Layer manager visibility, opacity, count, export, search, and clear actions.
- Saved map views persist and restore the selected basemap and zoom.
- Route, nearby, measurement, pin, and GeoJSON workflows.
- No horizontal overflow or obscured controls.
- Reduced-motion preference and keyboard-only operation.

## Device and permission checks

Automated tests cannot fully validate device geolocation, browser permission prompts, PWA installation, or offline map behaviour. Test those manually on supported devices. Use test locations and never attach private coordinates or room links to public bug reports.

## Reporting results

Record the command, environment, outcome, and any known limitation. Distinguish automated tests, static source checks, browser interaction tests, and real-device acceptance. Do not describe a feature as verified on a device unless it was actually tested there.
