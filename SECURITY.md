# Security Policy

## Supported versions

Security fixes are made against the latest code on the `main` branch and the currently published GitHub Pages build. Older snapshots and forks are not maintained by this project.

## Reporting a vulnerability

Please do **not** report exploitable vulnerabilities in a public GitHub issue, discussion, screenshot, or social post.

1. Open the repository's [Security tab](https://github.com/TEJAS-MK2/ATLAS/security).
2. If **Report a vulnerability** is available, use GitHub's private vulnerability reporting flow and include the details below.
3. If private reporting is unavailable, contact the repository maintainer through a private channel listed on the maintainer's GitHub profile. Do not publish exploit details while waiting for a response.

Include:
- A concise description and potential impact.
- Affected URL, file, component, and commit if known.
- Reproduction steps or a minimal proof of concept.
- Any relevant logs, screenshots, or suggested mitigation.

Please allow maintainers reasonable time to investigate and coordinate a fix before public disclosure. Do not access, modify, or delete data that is not yours, and do not disrupt the live service during testing.

## Scope and security notes

ATLAS is a browser-based mapping application. Treat location data, room edit capabilities, API credentials, and imported GeoJSON as sensitive.

- Never commit API keys, Supabase service-role credentials, room edit tokens, personal location traces, or other secrets.
- Client-side configuration must contain only credentials explicitly designed to be public.
- GPS tracking is opt-in. Test with locations and data you control.
- Validate untrusted input at trust boundaries; escape text inserted into HTML.
- Do not assume public map/search/routing providers offer an availability or security SLA.

## Response

The maintainers will acknowledge reports when practical, assess severity and reproducibility, and coordinate a fix and disclosure. No response-time guarantee is made by this community project.
