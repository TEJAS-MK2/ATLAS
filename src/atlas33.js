import {formatDistance} from './geo.js';

export function diffObservedObjects(previous,current){
  const known=previous instanceof Set?previous:new Set(previous||[]);
  return (current||[]).filter(item=>item&&item.id!==undefined&&!known.has(String(item.id))).map(item=>({...item,id:String(item.id)}));
}
export function aggregateHistory(entries=[],now=Date.now()){
  const hourMs=60*60*1000;
  const cutoff=now-24*hourMs;
  const source=Array.isArray(entries)?entries:[];
  const recent=source.filter(x=>x&&Number.isFinite(x.at)&&x.at>=cutoff&&x.at<=now);
  const views=recent.filter(x=>x.type==='view');
  const routes=recent.filter(x=>x.type==='route');
  const layers=[...new Set(views.map(x=>x.layer).filter(Boolean))];
  const zoomValues=views.map(x=>Number(x.zoom)).filter(x=>Number.isFinite(x));
  const avgZoom=zoomValues.length?zoomValues.reduce((sum,x)=>sum+x,0)/zoomValues.length:0;
  // The chart is a rolling 24-hour timeline, not 24 buckets keyed by wall-clock hour.
  const buckets=Array.from({length:24},(_,hour)=>({hour,count:0}));
  for(const item of recent){
    const hour=Math.min(23,Math.floor((item.at-cutoff)/hourMs));
    buckets[hour].count++;
  }
  return {total:recent.length,views:views.length,routes:routes.length,layers,avgZoom,buckets};
}
export function normalizeMonitorSettings(value={}){
  value=value&&typeof value==='object'?value:{};
  const radius=Number(value.radius),interval=Number(value.interval),category=String(value.category||'amenity');
  return {radius:[250,500,1000,2500,5000].includes(radius)?radius:1000,interval:Number.isFinite(interval)?Math.max(2,Math.min(60,Math.round(interval))):5,category:['amenity','restaurant','cafe','hospital','pharmacy','fuel','tourism'].includes(category)?category:'amenity'};
}
const $=id=>document.getElementById(id);
const safe=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const distance=(a,b)=>{const rad=n=>n*Math.PI/180,R=6371000,dLat=rad(b.lat-a.lat),dLng=rad(b.lng-a.lng),q=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;return 2*R*Math.asin(Math.sqrt(q))};
function init(){
 const ids=['atlasMonitorPanel','atlasHistoryPanel','atlasDashboardPanel','monitorStart','monitorStop','monitorPollNow','monitorRadius','monitorInterval','monitorCategory','monitorStatus','monitorEvents','historyStats','historyChart','dashboardWidgets','atlas33Quickbar'];
 if(ids.some(id=>!$(id)))return;
 let watchTimer=null,watchBusy=false,baselineReady=false,knownIds=new Set(),watchCenter=null,history=[];
 const settings=(()=>{try{return normalizeMonitorSettings(JSON.parse(localStorage.getItem('atlas.monitor.settings')||'{}'))}catch{return normalizeMonitorSettings()}})();
 $('monitorRadius').value=String(settings.radius);$('monitorInterval').value=String(settings.interval);$('monitorCategory').value=settings.category;
 try{const raw=JSON.parse(localStorage.getItem('atlas.history')||'[]');history=Array.isArray(raw)?raw.filter(x=>x&&Number.isFinite(x.at)).slice(-500):[]}catch{history=[]}
 let events=[];
 function persistHistory(){try{localStorage.setItem('atlas.history',JSON.stringify(history.slice(-500)))}catch{}}
 function record(type,detail={}){history.push({at:Date.now(),type,...detail});history=history.slice(-500);persistHistory();renderHistory()}
 function renderHistory(){
  const stats=aggregateHistory(history);
  $('historyStats').innerHTML='<div class="atlas33-stat-grid"><div><small>MAP UPDATES · 24H</small><b>'+stats.views+'</b></div><div><small>ROUTES · 24H</small><b>'+stats.routes+'</b></div><div><small>AVG. ZOOM</small><b>'+(stats.avgZoom?stats.avgZoom.toFixed(1):'—')+'</b></div><div><small>BASEMAPS USED</small><b>'+stats.layers.length+'</b></div></div><p class="atlas33-muted">'+stats.total+' locally recorded map and route events · '+(safe(stats.layers.join(', '))||'No basemap history')+'</p>';
  const max=Math.max(1,...stats.buckets.map(x=>x.count));
  const bars=stats.buckets.map((x,i)=>{const height=Math.max(2,Math.round(x.count/max*76)),xPos=8+i*16,label=i===23?'last hour':(24-i)+'–'+(23-i)+'h ago';return '<rect x="'+xPos+'" y="'+(86-height)+'" width="9" height="'+height+'" rx="2" class="atlas33-bar"><title>'+label+' · '+x.count+' events</title></rect>'}).join('');
  $('historyChart').innerHTML='<svg viewBox="0 0 400 104" role="img" aria-label="Map activity by local hour over the last 24 hours"><path d="M4 86H396" class="atlas33-chart-axis"/>'+bars+'</svg><div class="atlas33-chart-labels"><span>24 hours ago</span><span>Local time</span><span>Now</span></div>';
 }
 function renderEvents(){
  $('monitorEvents').innerHTML=events.length?events.slice(0,30).map(item=>'<article class="atlas33-event"><div><b>'+safe(item.name)+'</b><small>'+safe(item.kind)+' · '+safe(item.timestamp||'Timestamp unavailable')+'</small></div><span>'+safe(item.distanceLabel)+'</span></article>').join(''):'<p class="atlas33-muted">No newly observed objects in this watch session. The first poll establishes a baseline.</p>';
 }
 function setStatus(message,state='idle'){$('monitorStatus').textContent=message;$('monitorStatus').dataset.state=state}
 function queryFor(center,config){
  const filter=config.category==='amenity'?'[amenity]':config.category==='tourism'?'[tourism]':'[amenity='+config.category+']';
  return '[out:json][timeout:20];(node(around:'+config.radius+','+center.lat+','+center.lng+')'+filter+';way(around:'+config.radius+','+center.lat+','+center.lng+')'+filter+';relation(around:'+config.radius+','+center.lat+','+center.lng+')'+filter+';);out center meta 80;';
 }
 async function fetchObjects(center,config){
  const body='data='+encodeURIComponent(queryFor(center,config));let lastError;
  for(const endpoint of ['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter']){
   try{
    const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body,signal:AbortSignal.timeout(22000)});
    if(!response.ok)throw new Error('OpenStreetMap query returned HTTP '+response.status);
    const data=await response.json();if(!Array.isArray(data.elements))throw new Error('Unexpected OpenStreetMap response');
    return data.elements.map(x=>({id:x.type+'/'+x.id,type:x.type,lat:x.lat??x.center?.lat,lng:x.lon??x.center?.lon,tags:x.tags||{},timestamp:x.timestamp||null})).filter(x=>Number.isFinite(x.lat)&&Number.isFinite(x.lng));
   }catch(error){lastError=error}
  }
  throw lastError||new Error('Geospatial event source unavailable');
 }
 async function poll(){
  if(watchBusy||!watchCenter)return;watchBusy=true;setStatus('Checking OpenStreetMap…','busy');
  try{
   const config=normalizeMonitorSettings({radius:Number($('monitorRadius').value),interval:Number($('monitorInterval').value),category:$('monitorCategory').value});
   const objects=await fetchObjects(watchCenter,config),fresh=baselineReady?diffObservedObjects(knownIds,objects):[];
   objects.forEach(x=>knownIds.add(x.id));baselineReady=true;
   const currentEvents=fresh.map(item=>{const tags=item.tags||{},name=tags.name||tags.amenity||tags.tourism||'Unnamed map feature';return {...item,name,kind:tags.amenity||tags.tourism||item.type,distanceLabel:formatDistance(distance(watchCenter,{lat:item.lat,lng:item.lng})),timestamp:item.timestamp?new Date(item.timestamp).toLocaleString():'Newly observed in this session'}});
   events=[...currentEvents,...events].slice(0,60);renderEvents();
   setStatus('Watching '+objects.length+' mapped objects · checked '+new Date().toLocaleTimeString(),'live');
   if(fresh.length){const message=fresh.length+' newly observed map object'+(fresh.length===1?'':'s')+' in your watch area.';if('Notification'in window&&Notification.permission==='granted')new Notification('ATLAS geospatial alert',{body:message});window.dispatchEvent(new CustomEvent('atlas:geospatial-alert',{detail:{count:fresh.length,center:watchCenter}}))}
  }catch(error){setStatus(error.message||'Watch request failed.','error')}
  finally{watchBusy=false}
 }
 function startWatch(){
  if(watchTimer)clearInterval(watchTimer);
  const config=normalizeMonitorSettings({radius:Number($('monitorRadius').value),interval:Number($('monitorInterval').value),category:$('monitorCategory').value});
  try{localStorage.setItem('atlas.monitor.settings',JSON.stringify(config))}catch{}
  const state=window.__atlas33MapState;watchCenter=state?.center?{lat:state.center[0],lng:state.center[1]}:{lat:22.5726,lng:88.3639};
  baselineReady=false;knownIds=new Set();events=[];renderEvents();
  $('monitorStart').disabled=true;$('monitorStop').disabled=false;$('monitorPollNow').disabled=false;
  poll();watchTimer=setInterval(poll,config.interval*60000);
  if('Notification'in window&&Notification.permission==='default')Notification.requestPermission().catch(()=>{});
 }
 function stopWatch(){
  if(watchTimer)clearInterval(watchTimer);watchTimer=null;watchCenter=null;
  $('monitorStart').disabled=false;$('monitorStop').disabled=true;$('monitorPollNow').disabled=true;
  setStatus('Monitoring stopped · no background polling','idle');
 }
 function renderWidgets(){
  const widgets=[['center','Map center'],['summary','Map summary'],['network','Device network'],['session','Session analytics'],['selection','Selected location']];
  let enabled;try{enabled=JSON.parse(localStorage.getItem('atlas.dashboard.widgets')||'null')}catch{enabled=null}
  if(!Array.isArray(enabled))enabled=widgets.map(x=>x[0]);
  $('dashboardWidgets').innerHTML=widgets.map(([id,label])=>'<label class="atlas33-widget-toggle"><input type="checkbox" data-widget="'+id+'" '+(enabled.includes(id)?'checked':'')+'> '+label+'</label>').join('');
  function apply(){widgets.forEach(([id])=>{const el=document.querySelector('[data-dashboard-widget="'+id+'"]'),input=$('dashboardWidgets').querySelector('[data-widget="'+id+'"]');if(el&&input)el.hidden=!input.checked});try{localStorage.setItem('atlas.dashboard.widgets',JSON.stringify(widgets.filter(([id])=>$('dashboardWidgets').querySelector('[data-widget="'+id+'"]').checked).map(x=>x[0])))}catch{}}
  $('dashboardWidgets').addEventListener('change',apply);apply();
  $('dashboardReset').addEventListener('click',()=>{$('dashboardWidgets').querySelectorAll('input').forEach(x=>x.checked=true);apply()});
 }
 function open(id){document.querySelectorAll('.atlas33-panel').forEach(panel=>panel.classList.add('hidden'));$(id).classList.remove('hidden')}
 document.querySelectorAll('[data-atlas33-open]').forEach(button=>button.addEventListener('click',()=>open(button.dataset.atlas33Open)));
 document.querySelectorAll('[data-atlas33-close]').forEach(button=>button.addEventListener('click',()=>$(button.dataset.atlas33Close).classList.add('hidden')));
 $('monitorStart').addEventListener('click',startWatch);$('monitorStop').addEventListener('click',stopWatch);$('monitorPollNow').addEventListener('click',poll);
 $('monitorInterval').addEventListener('change',()=>{if(watchTimer){clearInterval(watchTimer);watchTimer=setInterval(poll,normalizeMonitorSettings({interval:Number($('monitorInterval').value)}).interval*60000)}});
 window.addEventListener('atlas:map-state',event=>{const d=event.detail;if(!d||!Array.isArray(d.center))return;window.__atlas33MapState=d;record('view',{center:d.center,zoom:d.zoom,layer:d.layer})});
 window.addEventListener('atlas:route-calculated',event=>{const d=event.detail||{};record('route',{distance:d.distance,duration:d.duration,alternatives:d.alternatives||1})});
 renderWidgets();renderHistory();renderEvents();window.addEventListener('pagehide',stopWatch);
}
if(typeof document!=='undefined'&&document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else if(typeof document!=='undefined')init();
