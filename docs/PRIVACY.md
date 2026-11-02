# Privacy and Location Data

ATLAS is designed as a browser-first mapping workspace. This document describes the data flows currently implemented; it is not legal advice or a guarantee about third-party providers.

## Location permissions

- The application does not request GPS permission on initial page load.
- A user action is required to locate the device or start a GPS tracking session.
- Browser permission prompts and precise-location access are controlled by the browser and operating system.
- Stop a tracking session when finished. Review and clear browser data if you no longer want locally stored bookmarks.

## Browser-held data

Saved places use browser local storage. GPS track points are held in the active application session until exported; availability across reloads is not guaranteed. Shared room edit capability is held in the browser session where applicable. Anyone with a read-only room link may be able to view the map content shared to that room until it expires.

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

Do not start GPS tracking unless needed. Avoid sharing live room links publicly when they contain sensitive places. Clear saved places in the application when available, and manage browser site data to remove local application storage.

## Changes

If a feature adds a new data collection, storage location, or third-party provider, update this document and the README before release.
