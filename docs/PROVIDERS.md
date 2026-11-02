# External Data and Service Providers

ATLAS depends on external providers for some map and collaboration features. Coverage, licensing, availability, rate limits, and privacy practices are controlled by each provider.

| Feature | Provider | Purpose |
|---|---|---|
| Street map tiles | OpenStreetMap tile service | Base map rendering |
| Light/dark map tiles | CARTO basemaps | Alternate base map styles |
| Terrain tiles | OpenTopoMap | Terrain presentation |
| Satellite imagery | Esri World Imagery | Satellite base map |
| Place search | Photon | Geocoding and place suggestions |
| Route calculation | OSRM public demo | Driving route geometry |
| Nearby places and overlays | OpenStreetMap Overpass API | Points of interest and map features |
| 3D globe textures | globe.gl public assets | Earth visualization |
| Street View handoff | Google Maps | Opens a separate map view |
| Guest map rooms | Supabase | Server-side room snapshots and sharing |

## Operational guidance

- Public/demo endpoints are suitable for development and modest interactive use, not guaranteed production workloads.
- Respect each provider's usage policy, attribution requirements, and rate limits.
- Do not assume all services are available in every region or network.
- Provider requests can expose request metadata, including IP address and requested search terms or coordinates.
- For higher-volume or mission-critical deployments, review provider terms and configure appropriate licensed or self-hosted services.
- Update this inventory whenever a provider is added, removed, or replaced.

## Attribution

Keep required attribution visible in the map UI and follow each provider's published attribution and tile-usage requirements.
