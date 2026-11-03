import {geometryMetrics,formatDistance,filterFeatures,validCoordinate} from './geo.js';

export function summarizeFeatures(features=[]){
  const counts={Point:0,MultiPoint:0,LineString:0,MultiLineString:0,Polygon:0,MultiPolygon:0,GeometryCollection:0,Other:0};
  let lengthMeters=0,areaSquareMeters=0,minLat=Infinity,minLng=Infinity,maxLat=-Infinity,maxLng=-Infinity;
  for(const feature of features){
    const geometry=feature?.geometry;
    if(!geometry)continue;
    counts[geometry.type in counts?geometry.type:'Other']++;
    const m=geometryMetrics(feature);
    lengthMeters+=m.lengthMeters||0;
    areaSquareMeters+=m.areaSquareMeters||0;
    if(m.bounds){minLat=Math.min(minLat,m.bounds[0][0]);minLng=Math.min(minLng,m.bounds[0][1]);maxLat=Math.max(maxLat,m.bounds[1][0]);maxLng=Math.max(maxLng,m.bounds[1][1]);}
  }
  const bounds=minLat===Infinity?null:{south:minLat,west:minLng,north:maxLat,east:maxLng};
  return {total:features.length,counts,lengthMeters,areaSquareMeters,bounds};
}

export function normalizeWorkspace(value){
  if(!value||typeof value!=='object'||typeof value.name!=='string')return null;
  const name=value.name.trim().replace(/[<>]/g,'').slice(0,48);
  const center=value.center;
  if(!name||!Array.isArray(center)||center.length!==2||!validCoordinate(center[0],center[1]))return null;
  const zoom=Number(value.zoom);
  const layers=['streets','light','dark','terrain','satellite'];
  if(!Number.isFinite(zoom)||zoom<2||zoom>19||!layers.includes(value.layer))return null;
  return {id:String(value.id||''),name,center:[center[0],center[1]],zoom,layer:value.layer,theme:value.theme==='light'?'light':'dark',inspectorVisible:value.inspectorVisible!==false};
}

const $=id=>document.getElementById(id);
const emit=(name,detail)=>window.dispatchEvent(new CustomEvent(name,{detail}));
function safe(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function init(){
  const required=['spatialMetrics','spatialSearch','spatialSummary','styleColor','styleWeight','styleFill','styleLine','styleApply','workspacePanel','workspaceName','workspaceInspector','workspaceTheme','workspaceSave','workspaceList','workspaceOpenBtn','workspaceClose'];
  if(required.some(id=>!$(id)))return;
  let features=[],mapState={center:[22.5726,88.3639],zoom:12,layer:'streets',theme:'dark',inspectorVisible:true};
  let profiles=readProfiles();
  function readProfiles(){try{const parsed=JSON.parse(localStorage.getItem('atlas.workspaces')||'[]');return Array.isArray(parsed)?parsed.map(normalizeWorkspace).filter(Boolean).slice(0,20):[]}catch{return[]}}
  function persist(){try{localStorage.setItem('atlas.workspaces',JSON.stringify(profiles));return true}catch{return false}}
  function updateAnalytics(){
    const visible=filterFeatures(features,$('spatialSearch').value);
    const summary=summarizeFeatures(visible);
    const counts=Object.entries(summary.counts).filter(([,n])=>n).map(([type,n])=>type+': '+n).join(' · ')||'No geometry types';
    $('spatialMetrics').textContent=summary.total+' features · '+counts;
    $('spatialSummary').textContent=summary.total+' filtered · '+formatDistance(summary.lengthMeters)+' total line length · '+(summary.areaSquareMeters/1e6).toFixed(3)+' km² polygon area';
    if(summary.bounds){const b=summary.bounds;$('spatialSummary').textContent+=' · Bounds '+b.south.toFixed(4)+', '+b.west.toFixed(4)+' to '+b.north.toFixed(4)+', '+b.east.toFixed(4);}
  }
  function renderProfiles(){
    $('workspaceList').innerHTML=profiles.length?profiles.map((p,i)=>'<div class="saved-view-row"><button type="button" class="saved-view-open" data-atlas-restore="'+i+'"><b>'+safe(p.name)+'</b><small>'+safe(p.layer)+' · zoom '+p.zoom+' · '+safe(p.theme)+'</small></button><button type="button" class="saved-view-delete" data-atlas-delete="'+i+'" aria-label="Delete '+safe(p.name)+'">×</button></div>').join(''):'<p class="empty-note">No saved workspace profiles yet.</p>';
  }
  function capture(){
    return {...mapState,theme:$('workspaceTheme').value,inspectorVisible:$('workspaceInspector').checked};
  }
  function saveProfile(){
    const name=$('workspaceName').value.trim().replace(/[<>\\u0000-\\u001f]/g,'').slice(0,48);
    if(!name){$('workspaceName').focus();return;}
    const previous=profiles.slice();
    profiles.unshift(normalizeWorkspace({id:globalThis.crypto?.randomUUID?.()||String(Date.now()),name,...capture()}));
    profiles=profiles.filter(Boolean).slice(0,20);
    if(!persist()){profiles=previous;return;}
    $('workspaceName').value='';renderProfiles();
  }
  $('workspaceOpenBtn').addEventListener('click',()=>{emit('atlas:request-map-state');$('workspacePanel').classList.remove('hidden');$('workspaceName').focus()});
  $('workspaceClose').addEventListener('click',()=>$('workspacePanel').classList.add('hidden'));
  $('workspaceSave').addEventListener('click',saveProfile);
  $('workspaceInspector').addEventListener('change',()=>{document.body.classList.toggle('atlas-hide-inspector',!$('workspaceInspector').checked);mapState.inspectorVisible=$('workspaceInspector').checked});
  $('workspaceTheme').addEventListener('change',()=>{document.body.classList.toggle('light-ui',$('workspaceTheme').value==='light');mapState.theme=$('workspaceTheme').value});
  $('workspaceList').addEventListener('click',e=>{
    const remove=e.target.closest('[data-atlas-delete]');
    if(remove){const previous=profiles.slice();profiles.splice(Number(remove.dataset.atlasDelete),1);if(!persist())profiles=previous;renderProfiles();return;}
    const open=e.target.closest('[data-atlas-restore]');
    if(open){const profile=profiles[Number(open.dataset.atlasRestore)];if(!profile)return;emit('atlas:restore-workspace',profile);mapState={...profile};$('workspaceInspector').checked=profile.inspectorVisible;$('workspaceTheme').value=profile.theme;$('workspacePanel').classList.add('hidden');}
  });
  $('styleWeight').addEventListener('input',()=>$('styleWeightValue').textContent=$('styleWeight').value+' px');
  $('styleFill').addEventListener('input',()=>$('styleFillValue').textContent=$('styleFill').value+'%');
  $('styleLine').addEventListener('input',()=>$('styleLineValue').textContent=$('styleLine').value+'%');
  $('styleApply').addEventListener('click',()=>emit('atlas:layer-style',{color:$('styleColor').value,weight:Number($('styleWeight').value),fillOpacity:Number($('styleFill').value)/100,opacity:Number($('styleLine').value)/100}));
  $('spatialSearch').addEventListener('input',updateAnalytics);
  window.addEventListener('atlas:overlay-data',e=>{features=Array.isArray(e.detail?.features)?e.detail.features:[];updateAnalytics()});
  window.addEventListener('atlas:map-state',e=>{if(e.detail&&Array.isArray(e.detail.center))mapState={...mapState,...e.detail};if($('workspaceInspector'))$('workspaceInspector').checked=mapState.inspectorVisible!==false;if($('workspaceTheme'))$('workspaceTheme').value=mapState.theme||'dark'});
  renderProfiles();updateAnalytics();
}
if(typeof document!=='undefined'&&document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else if(typeof document!=='undefined')init();
