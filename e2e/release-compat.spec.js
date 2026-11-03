import {test,expect} from '@playwright/test';

test.beforeEach(async({page})=>{
 await page.goto('/');
 await expect(page.locator('#map.leaflet-container')).toBeVisible({timeout:20000});
});

test('release compatibility: map shell renders without horizontal overflow',async({page})=>{
 await expect(page.locator('.topbar')).toBeVisible();
 await expect(page.locator('#map')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});

test('release compatibility: PWA caches all local application modules',async({page})=>{
 const cached=await page.evaluate(async()=>{
  if(!('serviceWorker'in navigator))return false;
  await navigator.serviceWorker.ready;
  const cache=await caches.open('atlas-shell-v11');
  const paths=['./app.js?v=4.2.0','./src/spatial.js','./src/spatial-operations.js','./src/formats.js','./src/atlas32.js?v=4.2.0','./src/atlas33.js?v=4.2.0'];
  for(const path of paths)if(!await cache.match(new URL(path,location.href).href))return false;
  return true;
 });
 expect(cached).toBe(true);
});

test('release compatibility: empty GeoJSON import leaves the layer manager stable',async({page})=>{
 const file={name:'empty.geojson',mimeType:'application/geo+json',buffer:Buffer.from(JSON.stringify({type:'FeatureCollection',features:[]}))};
 await page.locator('#importFile').setInputFiles(file);
 await expect(page.locator('#toast')).toContainText('0 GeoJSON features imported');
 await page.locator('#overlayBtn').click();
 await expect(page.locator('#overlayCount')).toHaveText('0');
 await expect(page.locator('#overlayExport')).toBeDisabled();
});
