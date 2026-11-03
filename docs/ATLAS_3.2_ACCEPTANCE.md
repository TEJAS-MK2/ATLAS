# ATLAS 3.2 acceptance checklist

This checklist distinguishes automated coverage from device-only acceptance. A checked item requires recorded evidence from the named environment.

## Automated checks (GitHub Actions)

- [ ] Unit tests (npm test)
- [ ] JavaScript syntax checks (npm run check)
- [ ] Chromium browser tests (npm run test:e2e)
- [ ] Production smoke test after GitHub Pages deployment

## Android physical-device checks

- [ ] Install the PWA from Chrome on Android.
- [ ] Launch the installed app in standalone mode and confirm map controls remain usable.
- [ ] Grant location permission and verify a current position is shown.
- [ ] Deny location permission and verify a clear, recoverable error.
- [ ] Start and stop GPS tracking; verify no tracking starts before explicit consent.
- [ ] Verify track export contains only the points recorded in that session.
- [ ] Open a saved workspace profile and confirm map center, zoom, basemap, theme and inspector visibility restore.
- [ ] Load/import a GeoJSON layer, filter features, inspect metrics and apply layer styling.
- [ ] Reload while offline and verify the cached app shell opens; verify external map tiles/services report unavailable gracefully.

## Collaboration checks

- [ ] Use two independent browser sessions to verify room editor/viewer permissions and pin isolation.
- [ ] Verify room expiration and error handling against the configured Supabase backend.

**Current status:** Android and two-session checks require physical-device or independent-session access. Do not mark them complete based only on static code inspection or CI.
