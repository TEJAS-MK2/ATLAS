const CACHE='atlas-shell-v11';
const SHELL=['./','./index.html','./styles.css?v=4.2.0','./app.js?v=4.2.0','./room-ui.js?v=4.2.0','./src/geo.js','./src/spatial.js','./src/spatial-operations.js','./src/formats.js','./src/atlas32.js?v=4.2.0','./src/atlas33.js?v=4.2.0','./manifest.webmanifest','./icons/atlas-192.svg','./icons/atlas-512.svg'];
const EXTERNAL_SHELL=[
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/globe.gl@2.41.10/dist/globe.gl.min.js'
];

async function cacheExternalShell(){
  const cache=await caches.open(CACHE);
  await Promise.all(EXTERNAL_SHELL.map(async url=>{
    try{
      const response=await fetch(url,{mode:'cors',cache:'no-store'});
      if(response.ok)await cache.put(url,response);
    }catch(error){
      // External libraries are optional during installation; online requests can populate the cache later.
    }
  }));
}

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING')self.skipWaiting();
});

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE)
    .then(cache=>cache.addAll(SHELL))
    .then(cacheExternalShell)
    .then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys()
    .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
    .then(()=>self.clients.claim()));
});

// Cache the application shell and a small allowlist of required CDN libraries.
// Map tiles and provider responses remain network-only and are not promised offline.
self.addEventListener('fetch',event=>{
  const request=event.request;
  const url=new URL(request.url);
  if(request.method!=='GET')return;
  const sameOrigin=url.origin===self.location.origin;
  const externalShell=EXTERNAL_SHELL.includes(url.href)&&['script','style'].includes(request.destination);
  if(!sameOrigin&&!externalShell)return;

  event.respondWith((async()=>{
    const cached=await caches.match(request);
    try{
      const response=await fetch(request,{cache:'no-store'});
      if(response.ok){
        const cache=await caches.open(CACHE);
        await cache.put(request,response.clone());
      }
      return response;
    }catch(error){
      if(cached)return cached;
      if(request.mode==='navigate'){
        const shell=await caches.match('./index.html');
        if(shell)return shell;
      }
      throw error;
    }
  })());
});
