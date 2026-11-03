# ATLAS visual design system

Version 3.5 visual direction: a focused geospatial operations console. The map remains the dominant workspace; navigation and inspection surfaces support it without competing for attention.

## Design principles
- **Map first:** controls frame the map instead of turning the page into a generic analytics dashboard.
- **High signal:** clear hierarchy, compact metadata, strong selected states and restrained accent usage.
- **Honest telemetry:** display only measurements the application actually obtains. Never imply a live server, GPS, network or traffic status that has not been measured.
- **Touch ready:** map controls and primary actions remain comfortably targetable on phones.
- **Accessible motion:** visible keyboard focus, semantic controls, reduced-motion support and contrast-aware dark/light themes.

## Core tokens
| Token | Dark | Light |
|---|---|---|
| App background | #08131b | #eaf1ee |
| Panel | #0d1c26 | #fbfdfb |
| Raised surface | #122531 | #f0f6f2 |
| Divider | #203945 | #d5e2dc |
| Primary text | #eaf3f5 | #183538 |
| Muted text | #8ba1ad | #607b77 |
| Accent | #77e2c2 | #238b6d |

Typography uses Space Grotesk for product headings and DM Sans for interface text. Surfaces use layered navy/green gradients, subtle borders, restrained shadows and 10–16px corner radii. Avoid excessive glow, glass effects that reduce legibility, and decorative metric cards with invented values.

## Responsive layout
| Width | Layout |
|---|---|
| 1500px and wider | Expanded navigation, map and inspector columns |
| 1181–1499px | Three-column console with compact panels |
| 901–1180px | Navigation rail and map; inspector yields to map |
| 651–900px | Compact navigation and map |
| 381–650px | Full-screen map with compact header and bottom tool dock |
| 320–380px | Minimal header actions and scroll-safe floating panels |

The CSS refinement preserves existing map/control IDs. Keep Leaflet attribution visible in all layouts.

## Interaction and accessibility
- Every action should have a visible hover and focus state.
- Keep focus-visible outlines high contrast and never remove them globally.
- Respect prefers-reduced-motion.
- Use semantic buttons and labels for actions and inputs.
- Keep text legible over map tiles with opaque or blurred control surfaces.
- Avoid relying on color alone for selected or error states.
- Do not add fake network health, traffic, live location or server status.

## Verification matrix
Run npm test, npm run check, npm run test:e2e and node scripts/smoke-test.mjs before release. Then manually review 1440px, 1280px, 900px, 390px and 320px viewports, both themes, keyboard-only use, reduced motion, map attribution, GPS permissions, PWA install and offline behaviour.

## ATLAS 3.3 intelligence surfaces
- Event monitoring is explicit opt-in and polls public Overpass endpoints only while the browser tab remains open. The first poll establishes a baseline; subsequent newly observed OSM object IDs become in-session events. This is not a guaranteed real-time feed.
- Route comparisons use public OSRM alternatives. Distance and duration are estimates, not traffic-aware ETAs.
- Historical activity is browser-local and bounded to 500 map/route events.
- Dashboard widget visibility is a browser-local preference; no telemetry is uploaded.

## Implementation
The refinement layer is appended to styles.css under ATLAS / FIELD CONSOLE. It intentionally preserves application DOM hooks and core JavaScript behaviours.


## ATLAS 3.4 Field Console refresh

- The top bar, navigation rail, inspector, floating tools and map controls share a consistent 10–20px radius scale, layered surfaces and restrained elevation.
- The map remains the dominant canvas; desktop uses a balanced three-column workspace, tablet yields the inspector to the map, and phone uses a four-tool bottom dock.
- Touch controls remain visible above the map; floating panels respect safe viewport space and remain scrollable.
- Focus rings, disabled states, selection states and reduced-motion overrides are explicit. Hover movement is limited to fine pointers.
- Dark and light themes have independently tuned surface, border and control treatments. No fake live status, traffic data or device telemetry is introduced.
