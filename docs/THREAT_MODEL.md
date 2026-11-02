# ATLAS Threat Model

## Purpose

This document identifies the main security boundaries for the browser-first ATLAS application. It is a practical engineering aid, not a formal security certification.

## Assets to protect

- Precise user coordinates and GPS track history.
- Saved places and exported GeoJSON.
- Guest map-room content and room edit capabilities.
- Supabase server credentials and private database access.
- Integrity of application JavaScript, styles, and deployment workflows.

## Trust boundaries

| Boundary | Data crossing it | Main risks |
|---|---|---|
| Browser UI → application logic | Search text, form values, map clicks | Injection, malformed values |
| File import → GeoJSON parser | User-selected JSON | Oversized or malformed geometry, unexpected properties |
| Browser → public geospatial providers | Search terms, coordinates, tile requests | Provider metadata exposure, rate limits |
| Browser → room Edge Function | Room IDs, snapshots, edit capability | Unauthorized writes, replay, abuse |
| GitHub Actions → GitHub Pages | Repository source and workflow artifacts | Supply-chain compromise, unsafe workflow permissions |

## Existing safeguards and expectations

- Validate coordinate values before map operations.
- Escape user- and provider-controlled strings before HTML insertion.
- Keep GPS permission user-initiated.
- Keep service-role credentials server-side.
- Hash and validate room edit capabilities in the backend; never place them in public documentation or logs.
- Use least-privilege workflow permissions.
- Keep third-party actions pinned to reviewed major versions and monitor updates with Dependabot.
- Run CodeQL analysis for JavaScript/TypeScript.
- Avoid committing private location traces, tokens, or real user data.

## Residual risks

- Public provider endpoints receive normal network metadata and may be unavailable or rate-limited.
- Browser storage is not a secure vault; users and extensions with browser access may inspect it.
- A shared room link can expose the content intentionally saved to that room.
- Static-site security headers and CSP are constrained by the hosting platform and current HTML deployment model.
- Automated static analysis does not replace dependency review, manual testing, or backend policy review.

## Review checklist for new features

1. What new data is collected, stored, exported, or shared?
2. Is every new network destination documented?
3. Is untrusted input validated and escaped?
4. Are secrets kept out of browser bundles and logs?
5. Can the feature be abused to exhaust public providers or backend resources?
6. Are permissions and sharing actions explicit to the user?
7. Are tests added for invalid, missing, and boundary-case input?
