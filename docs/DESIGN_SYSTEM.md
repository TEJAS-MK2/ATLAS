# Atlas interface design system

This document records the 2026 command-workspace refresh so future UI work stays consistent.

## Product direction

Atlas is a map-first geospatial workspace. The map remains the primary canvas; surrounding controls should be quiet, legible and fast to scan. The interface uses a restrained dark operations-console palette rather than decorative dashboards or fake telemetry.

## Visual tokens

| Token | Dark value | Purpose |
|---|---|---|
| Background | `#08121a` | App canvas |
| Panel | `#0d1b25` | Navigation and inspector |
| Raised panel | `#122531` | Cards and controls |
| Divider | `#203642` | Structural separation |
| Text | `#eaf2f3` | Primary content |
| Muted | `#8ba0aa` | Supporting labels |
| Accent | `#75e0c1` | Active state and primary action |

The light appearance is available through the existing appearance toggle. Both themes retain contrast-aware surfaces and control states.

## Layout behaviour

- Wide desktop: navigation rail, flexible map canvas and intelligence inspector.
- Compact desktop/tablet: navigation rail and map canvas; inspector yields space to the map.
- Mobile: map-first layout, compact top search/actions and a bottom tool dock.
- Narrow phones: secondary theme control yields space before GPS and map actions.
- Floating tools remain scrollable within the visible map area.

## Interaction principles

- Active tools and selected layers have visible state.
- Keyboard focus uses a high-contrast outline.
- Controls have touch-friendly hit areas and restrained hover/press feedback.
- Reduced-motion preferences are respected.
- Map attribution remains visible and readable.
- No fabricated live data, traffic, network metrics or location presence is introduced for visual effect.

## Implementation

The refresh is implemented as a final, clearly labelled design-system layer in `styles.css`. It intentionally preserves the existing DOM hooks and JavaScript contracts so map, route, GPS, room, globe, import/export and saved-place behaviours remain wired to the same controls.

## Acceptance checklist

- [ ] Verify desktop layout at 1440px and 1280px.
- [ ] Verify tablet layout around 900px.
- [ ] Verify phone layout at 390px and 320px.
- [ ] Check dark and light appearance.
- [ ] Check keyboard focus and reduced motion.
- [ ] Verify map attribution, floating panels and globe modal are not obscured.
- [ ] Complete device-level GPS permission and offline acceptance tests on real devices.
