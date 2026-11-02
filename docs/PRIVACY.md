# Privacy and Location Data

ATLAS is a browser-first mapping workspace. This document describes implemented data flows; it is not legal advice or a guarantee about third-party providers.

## Location permissions

- GPS permission is not requested on initial page load.
- A user action is required to locate the device or start a GPS tracking session.
- Browser permission prompts and precise-location access are controlled by the browser and operating system.
- Stop a tracking session when finished. Review and clear browser data if you no longer want locally stored bookmarks or saved views.

## Browser-held data

Saved places and named map views are stored in browser local storage. A saved map view contains a user-selected label, map center, zoom level, and basemap. GPS track points are held in the active application session until exported; availability across reloads is not guaranteed. Shared room edit capability is held in the browser session where applicable. Anyone with a read-only room link may be able to view the map content shared to that room until it expires.

Browser storage is not a secure vault. Anyone with access to the browser profile or suitable browser extensions may be able to inspect it.

## Third-party requests

Depending on the features used, the browser may contact:
- OpenStreetMap tile and Overpass services for map tiles and feature data.
- Photon for place search.
- OSRM for route calculations.
- Esri World Imagery for satellite tiles.
- Google Maps when the user opens the Street View handoff.
- Supabase for guest map-room operations.

Those providers receive request metadata such as IP address and requested coordinates/area as part of normal network operation. Their own privacy policies and retention practices apply.

## Sharing and exports

- Share-position links encode the map center and zoom in the URL.
- Guest map rooms transmit the content explicitly saved to a room. A room may include map position and shared pins; GPS-driven map movement can reveal changing location when the user chooses to share it.
- GeoJSON exports may contain precise coordinates. Treat exported files and shared links as sensitive.

## User choices

Do not start GPS tracking unless needed. Avoid sharing live room links publicly when they contain sensitive places. Remove saved places and map views in the application when available, or manage browser site data to clear local application storage.

## Changes

If a feature adds a new data collection, storage location, or third-party provider, update this document and the README before release.
