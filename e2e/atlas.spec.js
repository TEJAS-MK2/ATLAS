import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>{await page.goto('/');await expect(page.locator('#map')).toBeVisible();await expect(page.locator('#map.leaflet-container')).toBeVisible({timeout:20000})});
test('application shell and map initialize without horizontal overflow',async({page})=>{await expect(page.locator('.app-shell')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true)});
test('command palette opens, filters actions and closes with Escape',async({page})=>{await page.keyboard.press('Control+k');await expect(page.locator('#commandPalette')).toBeVisible();await page.locator('#commandInput').fill('satellite');await expect(page.locator('#commandList')).toContainText('Switch to satellite imagery');await page.keyboard.press('Escape');await expect(page.locator('#commandPalette')).not.toBeVisible()});
test('layer manager starts safely with controls disabled',async({page})=>{await page.locator('#overlayBtn').click();await expect(page.locator('#overlayPanel')).toBeVisible();await expect(page.locator('#overlayCount')).toHaveText('0');await expect(page.locator('#overlayExport')).toBeDisabled();await expect(page.locator('#overlayFeatureSearch')).toBeDisabled()});
test('valid GeoJSON import creates searchable features and exposes metrics',async({page})=>{const file={name:'sample.geojson',mimeType:'application/geo+json',buffer:Buffer.from(JSON.stringify({type:'FeatureCollection',features:[{type:'Feature',properties:{name:'Kolkata Test Point'},geometry:{type:'Point',coordinates:[88.3639,22.5726]}},{type:'Feature',properties:{name:'Test Route'},geometry:{type:'LineString',coordinates:[[88.36,22.57],[88.37,22.58]]}}]}))};await page.locator('#importFile').setInputFiles(file);await expect(page.locator('#toast')).toContainText('2 GeoJSON features imported');await page.locator('#overlayBtn').click();await expect(page.locator('#overlayCount')).toHaveText('2');await page.locator('#overlayFeatureSearch').fill('Kolkata');await expect(page.locator('#overlayFeatureList')).toContainText('Kolkata Test Point');await expect(page.locator('#overlayFeatureList')).not.toContainText('Test Route');await expect(page.locator('#overlayMetrics')).toContainText('total length')});
test('invalid GeoJSON import is rejected without creating a layer',async({page})=>{const file={name:'bad.geojson',mimeType:'application/geo+json',buffer:Buffer.from(JSON.stringify({type:'FeatureCollection',features:[{type:'Feature',properties:{},geometry:{type:'Point',coordinates:[181,0]}}]}))};await page.locator('#importFile').setInputFiles(file);await expect(page.locator('#toast')).toContainText('Import failed');await page.locator('#overlayBtn').click();await expect(page.locator('#overlayCount')).toHaveText('0')});
test('320px mobile viewport has no horizontal overflow',async({page})=>{await page.setViewportSize({width:320,height:720});await page.reload();await expect(page.locator('#map.leaflet-container')).toBeVisible();await expect(page.locator('#workspaceMapBtn')).toBeVisible();await page.locator('#workspaceMapBtn').click();await expect(page.locator('#workspacePanel')).toBeVisible();await page.locator('#workspaceClose').click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true)});

test('saved map views persist locally and can be restored',async({page})=>{await page.keyboard.press('Control+k');await page.locator('#commandInput').fill('saved map views');await page.locator('[data-command="views"]').click();await page.locator('#viewName').fill('Kolkata workspace');await page.locator('#viewsSave').click();await expect(page.locator('#viewsList')).toContainText('Kolkata workspace');await page.reload();await page.keyboard.press('Control+k');await page.locator('#commandInput').fill('saved map views');await page.locator('[data-command="views"]').click();await expect(page.locator('#viewsList')).toContainText('Kolkata workspace');await page.locator('[data-view-index="0"]').click();await expect(page.locator('#viewsPanel')).not.toBeVisible()});

test('Field Console visual system renders a compact responsive workspace',async({page})=>{
  await expect(page.locator('.topbar')).toBeVisible();
  await expect(page.locator('.brand')).toBeVisible();
  await expect(page.locator('.search-wrap')).toBeVisible();
  const accent=await page.locator('.brand-mark').evaluate(el=>getComputedStyle(el).backgroundImage);
  expect(accent).toContain('gradient');
  await page.setViewportSize({width:390,height:844});
  await expect(page.locator('.sidebar')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});

test('ATLAS 3.2 spatial analytics and layer styling work on imported GeoJSON',async({page})=>{
  const file={name:'atlas-32.geojson',mimeType:'application/geo+json',buffer:Buffer.from(JSON.stringify({type:'FeatureCollection',features:[
    {type:'Feature',properties:{name:'Test boundary'},geometry:{type:'Polygon',coordinates:[[[88.36,22.57],[88.37,22.57],[88.37,22.58],[88.36,22.58],[88.36,22.57]]]}},
    {type:'Feature',properties:{name:'Test road'},geometry:{type:'LineString',coordinates:[[88.36,22.57],[88.37,22.58]]}}
  ]}))};
  await page.locator('#importFile').setInputFiles(file);
  await expect(page.locator('#toast')).toContainText('2 GeoJSON features imported');
  await page.locator('#overlayBtn').click();
  await expect(page.locator('#spatialMetrics')).toContainText('2 features');
  await expect(page.locator('#spatialMetrics')).toContainText('Polygon: 1');
  for(const [id,value] of [['styleColor','#ff3366'],['styleWeight','5'],['styleFill','40'],['styleLine','80']]) await page.locator('#'+id).evaluate((el,next)=>{el.value=next;el.dispatchEvent(new Event('input',{bubbles:true}));},value);
  await page.evaluate(()=>{window.__atlasAppliedStyle=null;window.addEventListener('atlas:layer-style-applied',e=>window.__atlasAppliedStyle=e.detail,{once:true})});
  await page.locator('#styleApply').click();
  await expect.poll(()=>page.evaluate(()=>window.__atlasAppliedStyle?.color)).toBe('#ff3366');
  await expect.poll(()=>page.evaluate(()=>window.__atlasAppliedStyle?.weight)).toBe(5);
  await expect.poll(()=>page.evaluate(()=>window.__atlasAppliedStyle?.opacity)).toBe(0.8);
  await expect.poll(()=>page.evaluate(()=>window.__atlasAppliedStyle?.fillOpacity)).toBe(0.4);
});

test('workspace profiles persist and restore map presentation settings',async({page})=>{
  await page.locator('input[name="layer"][value="satellite"]').check();
  await page.locator('#workspaceOpenBtn').click();
  await page.locator('#workspaceName').fill('ATLAS 3.2 field profile');
  await page.locator('#workspaceTheme').selectOption('light');
  await page.locator('#workspaceInspector').uncheck();
  await page.locator('#workspaceSave').click();
  await expect(page.locator('#workspaceList')).toContainText('ATLAS 3.2 field profile');
  await page.locator('#workspaceTheme').selectOption('dark');
  await page.locator('#workspaceInspector').check();
  await page.locator('input[name="layer"][value="streets"]').check();
  await page.locator('[data-atlas-restore="0"]').click();
  await expect(page.locator('body')).toHaveClass(/light-ui/);
  await expect(page.locator('body')).toHaveClass(/atlas-hide-inspector/);
  await expect(page.locator('#activeLayerName')).toHaveText('Satellite');
  await page.reload();
  await page.locator('#workspaceOpenBtn').click();
  await expect(page.locator('#workspaceList')).toContainText('ATLAS 3.2 field profile');
});

test('ATLAS 3.3 dashboard widgets can be customized and persist',async({page})=>{
 await page.locator('[data-atlas33-open="atlasDashboardPanel"]').click();
 await expect(page.locator('#atlasDashboardPanel')).toBeVisible();
 await page.locator('#dashboardWidgets input[data-widget="network"]').uncheck();
 await expect(page.locator('[data-dashboard-widget="network"]')).toBeHidden();
 await page.reload();
 await expect(page.locator('[data-dashboard-widget="network"]')).toBeHidden();
 await page.locator('[data-atlas33-open="atlasDashboardPanel"]').click();
 await page.locator('#dashboardReset').click();
 await expect(page.locator('[data-dashboard-widget="network"]')).toBeVisible();
});
test('ATLAS 3.3 event monitor establishes a baseline and alerts on newly observed OSM objects',async({page})=>{
 let calls=0;
 await page.route('https://overpass-api.de/api/interpreter',async route=>{
  calls++;
  const elements=calls===1?[{type:'node',id:101,lat:22.5727,lon:88.3639,tags:{name:'Baseline Cafe',amenity:'cafe'},timestamp:'2026-11-03T04:00:00Z'}]:[
   {type:'node',id:101,lat:22.5727,lon:88.3639,tags:{name:'Baseline Cafe',amenity:'cafe'},timestamp:'2026-11-03T04:00:00Z'},
   {type:'node',id:102,lat:22.573,lon:88.364,tags:{name:'New Park Cafe',amenity:'cafe'},timestamp:'2026-11-03T05:00:00Z'}
  ];
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({elements})});
 });
 await page.locator('[data-atlas33-open="atlasMonitorPanel"]').click();
 await page.locator('#monitorStart').click();
 await expect(page.locator('#monitorStatus')).toContainText('Watching 1 mapped objects');
 await page.locator('#monitorPollNow').click();
 await expect(page.locator('#monitorEvents')).toContainText('New Park Cafe');
 await expect(page.locator('#monitorStatus')).toContainText('Watching 2 mapped objects');
 await page.locator('#monitorStop').click();
 await expect(page.locator('#monitorStatus')).toContainText('Monitoring stopped');
});
test('ATLAS 3.3 history panel renders local activity analytics',async({page})=>{
 await page.locator('[data-atlas33-open="atlasHistoryPanel"]').click();
 await expect(page.locator('#historyStats')).toContainText('MAP UPDATES');
 await expect(page.locator('#historyChart svg')).toBeVisible();
});
test('ATLAS 3.3 route comparison UI can select an alternate route',async({page})=>{
 await page.route('https://photon.komoot.io/api/**',async route=>{
  const url=new URL(route.request().url()),q=url.searchParams.get('q')||'';
  const coords=q.toLowerCase().includes('destination')?[88.40,22.59]:[88.36,22.57];
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({features:[{geometry:{type:'Point',coordinates:coords},properties:{name:q}}]})});
 });
 await page.route('https://router.project-osrm.org/route/v1/**',async route=>{
  const line=offset=>({type:'LineString',coordinates:[[88.36,22.57],[88.38,22.58+offset],[88.40,22.59]]});
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({code:'Ok',routes:[{distance:5000,duration:600,geometry:line(0)},{distance:6200,duration:720,geometry:line(.005)}]})});
 });
 await page.locator('[data-tool="route"]').click();
 await page.locator('#routeStart').fill('Origin');
 await page.locator('#routeEnd').fill('Destination');
 await page.locator('#routeGo').click();
 await expect(page.locator('#routeInfo')).toContainText('Option 2');
 await page.locator('[data-route-index="1"]').click();
 await expect(page.locator('[data-route-index="1"]')).toHaveAttribute('aria-pressed','true');
});

test('GPS tracking starts only after explicit action and records a simulated location',async({page,context})=>{
 await context.grantPermissions(['geolocation'],{origin:'http://127.0.0.1:4173'});
 await context.setGeolocation({latitude:22.5726,longitude:88.3639,accuracy:12});
 await page.locator('#trackBtn').click();
 await expect(page.locator('#trackPanel')).toBeVisible();
 await expect(page.locator('#trackStatus')).toContainText('Not recording');
 await page.locator('#trackStartStop').click();
 await expect(page.locator('#trackStatus')).toContainText('Recording',{timeout:10000});
 await expect(page.locator('#trackPoints')).toHaveText('1');
 await page.locator('#trackStartStop').click();
 await expect(page.locator('#trackStatus')).toHaveText('Session paused');
});

test('GPS permission denial stops tracking and reports a recoverable message',async({page,context})=>{
 await context.grantPermissions([],{origin:'http://127.0.0.1:4173'});
 await page.locator('#trackBtn').click();
 await page.locator('#trackStartStop').click();
 await expect(page.locator('#toast')).toContainText('Location permission denied.',{timeout:10000});
 await expect(page.locator('#trackStatus')).toHaveText('Session paused');
 await expect(page.locator('#trackStartStop')).toHaveText('Start new session');
});
