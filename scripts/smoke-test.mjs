const base = new URL(process.env.ATLAS_BASE_URL || 'https://tejas-mk2.github.io/ATLAS/');
const resources = [
  { path: './', label: 'homepage', includes: '<div class="app-shell">' },
  { path: './index.html', label: 'HTML entrypoint', includes: 'id="map"' },
  { path: './styles.css', label: 'stylesheet', includes: '.app-shell' },
  { path: './app.js', label: 'application module', includes: "L.map('map'" },
  { path: './room-ui.js', label: 'room UI module', includes: 'shareRoomTopBtn' },
  { path: './src/geo.js', label: 'geospatial utilities', includes: 'haversine' },
  { path: './sw.js', label: 'service worker', includes: "request.mode==='navigate'" },
  { path: './manifest.webmanifest', label: 'PWA manifest', json: true },
  { path: './icons/atlas-192.svg', label: '192px PWA icon', includes: '<svg' },
  { path: './icons/atlas-512.svg', label: '512px PWA icon', includes: '<svg' }
];

async function checkResource(resource) {
  const url = new URL(resource.path, base);
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`${resource.label}: HTTP ${response.status} (${url})`);
  const body = await response.text();
  if (!body.trim()) throw new Error(`${resource.label}: empty response`);
  if (body.includes('Page not found') || body.includes('<h1>404</h1>')) throw new Error(`${resource.label}: GitHub Pages returned its 404 document`);
  if (resource.includes && !body.includes(resource.includes)) throw new Error(`${resource.label}: expected content marker was not found`);
  if (resource.json) {
    const manifest = JSON.parse(body);
    if (!manifest.start_url || !Array.isArray(manifest.icons) || manifest.icons.length < 2) throw new Error('PWA manifest is missing install metadata');
    for (const icon of manifest.icons) {
      if (!resources.some(item => item.path === new URL(icon.src, url).pathname.replace(base.pathname, './'))) {
        const iconResponse = await fetch(new URL(icon.src, url), { cache: 'no-store', signal: AbortSignal.timeout(20000) });
        if (!iconResponse.ok) throw new Error(`PWA icon unavailable: ${icon.src} (HTTP ${iconResponse.status})`);
      }
    }
  }
  console.log(`PASS ${resource.label}: HTTP ${response.status} · ${body.length} bytes`);
  return body;
}

const bodies = await Promise.all(resources.map(checkResource));
const html = bodies[0];
for (const marker of ['id="map"', 'id="routeGo"', 'id="nearbyGo"', 'id="trackStartStop"', 'id="roomCreate"', 'id="globeModal"']) {
  if (!html.includes(marker)) throw new Error(`Homepage is missing required interface element ${marker}`);
}
console.log(`ATLAS production smoke test passed: ${resources.length} resources checked at ${base.href}`);
