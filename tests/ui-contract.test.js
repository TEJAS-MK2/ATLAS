import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const readme=readFileSync(new URL('../README.md',import.meta.url),'utf8');

test('all statically referenced application elements exist in the page',()=>{
  const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
  const refs=[...app.matchAll(/\$\('([^']+)'\)/g)].map(m=>m[1]);
  const generated=new Set(['inspectSave']);
  const missing=[...new Set(refs.filter(id=>!ids.has(id)&&!generated.has(id)))];
  assert.deepEqual(missing,[]);
});

test('page element IDs are unique',()=>{
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  const duplicates=ids.filter((id,i)=>ids.indexOf(id)!==i);
  assert.deepEqual([...new Set(duplicates)],[]);
});

test('core advanced features are wired into the interface',()=>{
  for(const id of ['globeBtn','trackBtn','overlayBtn','streetViewBtn','globeModal','trackPanel','overlayPanel']) assert.match(html,new RegExp('id="'+id+'"'));
  assert.match(app,/watchPosition/);
  assert.match(app,/globeImageUrl/);
  assert.match(app,/World_Imagery/);
});
test('shared room pins are isolated from personal bookmarks',()=>{
  assert.match(app,/const roomPinsLayer=L\.layerGroup\(\)\.addTo\(map\)/);
  assert.match(app,/roomPinsLayer\.clearLayers\(\)/);
  assert.doesNotMatch(app,/saved=state\.pins/);
  assert.match(app,/scheduleRoomSync\(\);savedMarkers\.set\(place\.id,addMarker/);
});

test('all five basemaps are available from the layer cycle',()=>{
  assert.match(app,/const order=\['streets','light','dark','terrain','satellite'\]/);
  assert.match(app,/layers\.satellite=satelliteLayer/);
});

test('manual route input invalidates map-selected coordinates',()=>{
  assert.match(app,/routeStart.*addEventListener\('input',\(\)=>\{routeStart=null\}\)/);
  assert.match(app,/routeEnd.*addEventListener\('input',\(\)=>\{routeEnd=null\}\)/);
});

test('nearby search supports ways and relation centers without dropping zero coordinates',()=>{
  assert.match(app,/nwr\(around:/);
  assert.match(app,/Number\.isFinite\(x\.lat\)&&Number\.isFinite\(x\.lng\)/);
});

test('OSM overlay geometry preserves open ways as lines',()=>{
  assert.match(app,/closed\?\{type:'Polygon'/);
  assert.match(app,/\{type:'LineString',coordinates:ring\}/);
});
test('measurement mode disables map double-click zoom while drawing',()=>{
  assert.match(app,/map\.doubleClickZoom\.disable\(\)/);
  assert.match(app,/map\.doubleClickZoom\.enable\(\)/);
});

test('deleting a saved place removes its current-session marker',()=>{
  assert.match(app,/savedMarkers\.set\(place\.id,addMarker/);
  assert.match(app,/savedMarkers\.delete\(removed\.id\)/);
});

test('compact mobile layouts keep the globe and GPS actions visible',()=>{
  assert.doesNotMatch(css,/\.top-actions #globeBtn\{display:none\}/);
  assert.doesNotMatch(css,/\.top-actions #trackBtn\{display:none\}/);
  assert.match(css,/\.top-actions #themeBtn\{display:none\}/);
});
test('GPS restart begins a clean track instead of joining sessions',()=>{
  assert.match(app,/trackPoints=\[\];trackDistance=0;if\(trackLine\)map\.removeLayer\(trackLine\)/);
});

test('room creation and loading tolerate blocked session storage',()=>{
  assert.match(app,/try\{sessionStorage\.setItem\(/);
  assert.match(app,/catch\{roomEditToken=null\}/);
});

test('programmatic basemap changes synchronize shared rooms',()=>{
  assert.match(app,/activeLayerName'\)\.textContent=layerNames\[name\]\|\|name;scheduleRoomSync\(\)/);
});


test('command palette is present, accessible and exposes its keyboard shortcut',()=>{
  for(const id of ['commandOpen','commandPalette','commandTitle','commandClose','commandInput','commandList']) assert.match(html,new RegExp('id="'+id+'"'));
  assert.match(html,/<dialog id="commandPalette"/);
  assert.match(html,/aria-labelledby="commandTitle"/);
  assert.match(app,/e\.ctrlKey\|\|e\.metaKey/);
  assert.match(app,/ArrowDown/);
  assert.match(app,/ArrowUp/);
  assert.match(app,/runCommand/);
});
test('command palette actions are connected to existing Atlas features',()=>{
  for(const id of ["'route'","'nearby'","'measure'","'gps'","'locate'","'globe'","'satellite'","'room'","'export'"]) assert.ok(app.includes(id),id);
  assert.match(app,/setTool\('route'\)/);
  assert.match(app,/openGlobe\(\)/);
  assert.match(app,/setLayer\('satellite'\)/);
});
test('command palette respects light theme and small mobile viewports',()=>{
  assert.match(css,/body\.light-ui \.command-palette/);
  assert.match(css,/@media\(max-width:360px\)/);
  assert.match(css,/prefers-reduced-motion:reduce/);
});


test('GeoJSON overlay manager exposes visibility, opacity, feature count and export',()=>{
  for(const id of ['overlayVisibility','overlayOpacity','overlayOpacityValue','overlayCount','overlayExport']) assert.match(html,new RegExp('id="'+id+'"'));
  assert.match(app,/geoOverlay\.setStyle\(/);
  assert.match(app,/geoOverlayFeatures\.length/);
  assert.match(app,/application\/geo\+json/);
  assert.match(app,/overlayVisibility'\)\.onchange/);
});
test('GeoJSON overlay manager disables controls when no layer is loaded',()=>{
  assert.match(app,/disabled=!geoOverlay/);
  assert.match(app,/geoOverlayFeatures=\[\]/);
  assert.match(app,/finally\{\$\('overlayLoad'\)\.disabled=false/);
});

test('map center displays DMS coordinates and overlay bounds summary',()=>{assert.match(html,/id="centerDms"/);assert.match(html,/id="overlayBounds"/);assert.match(app,/coordinateToDMS\(c\.lat,c\.lng\)/);assert.match(app,/Bounds unavailable/)});
test('clearing workspace resets GeoJSON feature state as well as the map layer',()=>{assert.match(app,/geoOverlayFeatures=\[\];geoOverlayKind=null/);assert.match(app,/Workspace layers cleared/)});

test('saved map view manager is wired to local browser storage',()=>{for(const id of ['viewsPanel','viewName','viewsSave','viewsList','viewsInfo'])assert.match(html,new RegExp('id="'+id+'"'));assert.match(app,/localStorage\.setItem\('atlas\.views'/);assert.match(app,/data-view-index/);assert.match(app,/title:'Saved map views'/)});

test('Field Console design tokens and social metadata are present',()=>{
  assert.match(css,/ATLAS \/ FIELD CONSOLE/);
  assert.match(css,/--accent:#77e2c2/);
  assert.match(css,/@media\(max-width:380px\)/);
  assert.match(html,/property="og:image"/);
  assert.match(html,/name="twitter:card" content="summary_large_image"/);
  assert.match(html,/assets\/atlas-social\.svg/);
});
test('README badges point to real repository workflows and avoid unverified release claims',()=>{
  assert.match(readme,/actions\/workflows\/pages\.yml/);
  assert.match(readme,/actions\/workflows\/codeql\.yml/);
  assert.doesNotMatch(readme,/img\.shields\.io\/github\/v\/release|img\.shields\.io\/github\/release-date/);
});

test('ATLAS 3.2 spatial analytics and layer styling controls are present',()=>{
  for(const id of ['spatialMetrics','spatialSearch','spatialSummary','styleColor','styleWeight','styleFill','styleLine','styleApply']) assert.match(html,new RegExp('id="'+id+'"'));
  assert.match(app,/atlas:overlay-data/);
  assert.match(app,/atlas:layer-style/);
});
test('ATLAS 3.2 workspace profiles expose save, restore and local persistence',()=>{
  for(const id of ['workspacePanel','workspaceName','workspaceInspector','workspaceTheme','workspaceSave','workspaceList','workspaceOpenBtn']) assert.match(html,new RegExp('id="'+id+'"'));
  assert.match(app,/atlas:restore-workspace/);
  assert.match(readFileSync(new URL('../src/atlas32.js',import.meta.url),'utf8'),/atlas\.workspaces/);
});

test('ATLAS 3.3 monitoring, history and dashboard controls are present and wired',()=>{
 for(const id of ['atlasMonitorPanel','atlasHistoryPanel','atlasDashboardPanel','monitorStart','monitorStop','monitorPollNow','monitorRadius','monitorInterval','monitorCategory','historyStats','historyChart','dashboardWidgets','dashboardReset']) assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(html,/src\/atlas33\.js/);
 assert.match(app,/atlas:route-calculated/);
 assert.match(readFileSync(new URL('../src/atlas33.js',import.meta.url),'utf8'),/atlas\.history/);
});
test('ATLAS 3.3 dashboard widget hooks are unique and map to inspector surfaces',()=>{
 for(const id of ['center','summary','network','session','selection']) assert.match(html,new RegExp('data-dashboard-widget="'+id+'"'));
 assert.match(readFileSync(new URL('../src/atlas33.js',import.meta.url),'utf8'),/atlas\.dashboard\.widgets/);
});
test('route planner requests alternatives and exposes comparison choices',()=>{
 assert.match(app,/alternatives=true/);assert.match(app,/data-route-index/);assert.match(app,/atlas:route-calculated/);
});
