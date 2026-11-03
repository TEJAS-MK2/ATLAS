# ATLAS visual design system

**Current direction: ATLAS 4.3 Aurora.** A map-first spatial intelligence workspace with calm dark surfaces, precise controls, readable data panels and a restrained mint accent. The map remains the primary canvas; chrome supports rather than competes with it.

## Principles
- **Map first:** preserve usable map area and keep controls discoverable.
- **Operational clarity:** distinguish actions, selected state, measured data, provider status and static labels.
- **Quiet depth:** use layered surfaces, subtle borders and controlled elevation instead of heavy glow or decorative clutter.
- **Responsive by intent:** desktop keeps navigation and inspection close to the map; phones prioritize the map and a four-action dock.
- **Accessible by default:** visible focus, keyboard-operable controls, adequate touch targets, readable contrast and reduced-motion support.
- **Honest telemetry:** do not imply live server, GPS, network, traffic or provider health unless it is actually measured.

## Tokens
| Token | Dark | Light |
|---|---|---|
| App background | #07131b | #edf4f0 |
| Panel | #0b1b25 | #f9fcfa |
| Raised surface | #102631 | #f1f7f3 |
| Divider | rgba(153,190,195,.15) | rgba(39,91,73,.13) |
| Primary text | #edf7f5 | #183a32 |
| Muted text | #91a9ae | #66847a |
| Accent | #75e4c3 | #168b69 |

Space Grotesk is used for product headings and DM Sans for interface text. Use 10–17px radii, subtle gradients and restrained shadows. Numeric values should use tabular figures where helpful.

## Layout
| Width | Intended layout |
|---|---|
| 1500px+ | Expanded navigation, map and live-inspector columns |
| 1181–1499px | Balanced three-column workspace |
| 761–1180px | Navigation and map; inspector yields space to the map |
| 391–760px | Compact header, full map and four-action bottom dock |
| 320–390px | Minimal header actions, scroll-safe floating panels and safe-area spacing |

The 4.3 stylesheet is a separate versioned layer (styles-v43.css) loaded after the compatibility stylesheet. Keep existing element IDs and event hooks stable when refining visuals.

## Interaction and accessibility
- All actions need visible hover, focus, disabled and selected states.
- Never remove focus-visible outlines globally.
- Respect prefers-reduced-motion.
- Keep touch controls usable at narrow widths and account for device safe areas.
- Preserve Leaflet map attribution above the map canvas.
- Use opaque or sufficiently contrasted control surfaces over map tiles.
- Avoid color-only communication for errors, selection or status.

## Verification
Run npm ci --no-audit --no-fund, npm audit --audit-level=high, npm test, npm run check, npm run test:e2e and node scripts/smoke-test.mjs. Review dark/light themes at 1440, 1280, 900, 390 and 320 CSS pixels. Physical-device GPS, PWA install, offline recovery, screen-reader and live-room acceptance remain separate checks.

## Data and motion
- Route alternatives are provider estimates, not traffic-aware ETAs.
- Monitoring depends on public Overpass availability and is not a guaranteed real-time feed.
- History, saved places and workspace preferences are browser-local unless a user explicitly shares a live map room.
- Map tiles and provider data are network-dependent; caching the app shell does not make the basemap fully offline.
