const CACHE='atlas-shell-v5';
const SHELL=['./','./index.html','./styles.css','./app.js','./room-ui.js','./src/geo.js','./manifest.webmanifest','./icons/atlas-192.svg','./icons/atlas-512.svg'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys()
    .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
    .then(()=>self.clients.claim()));
});

// Prefer fresh network responses, but keep same-origin assets available offline.
// Only navigation requests fall back to index.html; never return HTML for a missing JS/CSS asset.
self.addEventListener('fetch',event=>{
  const request=event.request;
  const url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin)return;

  event.respondWith((async()=>{
    const cached=await caches.match(request);
    try{
      const response=await fetch(request);
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
