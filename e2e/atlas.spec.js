import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>{await page.goto('/');await expect(page.locator('#map')).toBeVisible();await expect(page.locator('#map.leaflet-container')).toBeVisible({timeout:20000})});
test('application shell and map initialize without horizontal overflow',async({page})=>{await expect(page.locator('.app-shell')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true)});
test('command palette opens, filters actions and closes with Escape',async({page})=>{await page.keyboard.press('Control+k');await expect(page.locator('#commandPalette')).toBeVisible();await page.locator('#commandInput').fill('satellite');await expect(page.locator('#commandList')).toContainText('Switch to satellite imagery');await page.keyboard.press('Escape');await expect(page.locator('#commandPalette')).not.toBeVisible()});
test('layer manager starts safely with controls disabled',async({page})=>{await page.locator('#overlayBtn').click();await expect(page.locator('#overlayPanel')).toBeVisible();await expect(page.locator('#overlayCount')).toHaveText('0');await expect(page.locator('#overlayExport')).toBeDisabled();await expect(page.locator('#overlayFeatureSearch')).toBeDisabled()});
test('valid GeoJSON import creates searchable features and exposes metrics',async({page})=>{const file={name:'sample.geojson',mimeType:'application/geo+json',buffer:Buffer.from(JSON.stringify({type:'FeatureCollection',features:[{type:'Feature',properties:{name:'Kolkata Test Point'},geometry:{type:'Point',coordinates:[88.3639,22.5726]}},{type:'Feature',properties:{name:'Test Route'},geometry:{type:'LineString',coordinates:[[88.36,22.57],[88.37,22.58]]}}]}))};await page.locator('#importFile').setInputFiles(file);await expect(page.locator('#toast')).toContainText('2 GeoJSON features imported');await page.locator('#overlayBtn').click();await expect(page.locator('#overlayCount')).toHaveText('2');await page.locator('#overlayFeatureSearch').fill('Kolkata');await expect(page.locator('#overlayFeatureList')).toContainText('Kolkata Test Point');await expect(page.locator('#overlayFeatureList')).not.toContainText('Test Route');await expect(page.locator('#overlayMetrics')).toContainText('total length')});
test('invalid GeoJSON import is rejected without creating a layer',async({page})=>{const file={name:'bad.geojson',mimeType:'application/geo+json',buffer:Buffer.from(JSON.stringify({type:'FeatureCollection',features:[{type:'Feature',properties:{},geometry:{type:'Point',coordinates:[181,0]}}]}))};await page.locator('#importFile').setInputFiles(file);await expect(page.locator('#toast')).toContainText('Import failed');await page.locator('#overlayBtn').click();await expect(page.locator('#overlayCount')).toHaveText('0')});
test('320px mobile viewport has no horizontal overflow',async({page})=>{await page.setViewportSize({width:320,height:720});await page.reload();await expect(page.locator('#map.leaflet-container')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true)});

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
  await page.locator('#styleApply').click();
  await expect(page.locator('.leaflet-overlay-pane path').first()).toHaveAttribute('stroke','#ff3366');
  await expect(page.locator('.leaflet-overlay-pane path').first()).toHaveAttribute('stroke-width','5');
  await expect(page.locator('.leaflet-overlay-pane path').first()).toHaveAttribute('fill-opacity','0.4');
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
