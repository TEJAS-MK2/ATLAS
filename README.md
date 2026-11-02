# Atlas — Geospatial Intelligence

A responsive mapping workspace built around open geospatial services. Atlas combines interactive maps, place search, routing, nearby discovery, distance measurement, GeoJSON workflows, saved locations and lightweight browser network diagnostics.

## Features
- Responsive desktop and mobile map console
- OpenStreetMap street tiles plus CARTO light/dark and OpenTopoMap terrain layers
- Place search powered by Photon
- Browser geolocation (permission-based; never requested automatically)
- Driving routes via the public OSRM demo endpoint
- Nearby OpenStreetMap amenity discovery via Overpass API
- Distance measurement using the haversine formula
- Save locations locally and import/export GeoJSON
- Basic PWA shell caching for repeat visits
- Browser online status and Network Information API diagnostics when supported

## Run locally
Requires Node.js 20+.

```bash
npm test
npm run check
python3 -m http.server 8080
```
Open http://localhost:8080.

## Deployment
The GitHub Actions workflow tests the project and deploys the repository root to GitHub Pages on pushes to `main`. In repository Settings → Pages, select **GitHub Actions** as the build and deployment source.

Expected URL: https://tejas-mk2.github.io/MAP/

## Data, privacy and service limits
- Saved places are stored in this browser's local storage. Clearing browser data removes them; export GeoJSON for a backup.
- Location is accessed only after the user selects the locate action and grants browser permission.
- Search, routing and nearby discovery send the query or map area to their respective public services. Do not submit sensitive locations.
- Public tile and geocoding endpoints have usage policies and availability limits. For production/high-volume use, configure commercial or self-hosted providers.
- Network diagnostics are approximate. The Network Information API is not available in every browser; no IP address, packet capture or background device surveillance is performed.
- The app is a browser-based mapping client, not a replacement for emergency navigation or authoritative maps.

## Technology
Vanilla JavaScript ES modules, Leaflet, OpenStreetMap, Photon, OSRM and Overpass API. No build step or API key is required for the demo services.

## License
See [LICENSE](./LICENSE).
