export function haversine(a,b){const R=6371000,rad=x=>x*Math.PI/180;const dLat=rad(b.lat-a.lat),dLon=rad(b.lng-a.lng);const q=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.sqrt(q));}
export function formatDistance(m){if(!Number.isFinite(m)||m<0)return '—';return m>=1000?(m/1000).toFixed(m>=10000?1:2)+' km':Math.round(m)+' m';}
export function validCoordinate(lat,lng){return typeof lat==='number'&&Number.isFinite(lat)&&typeof lng==='number'&&Number.isFinite(lng)&&Math.abs(lat)<=90&&Math.abs(lng)<=180;}
export function sanitizeName(value){return String(value??'').replace(/[<>\u0000-\u001f]/g,'').trim().slice(0,80);}
export function featureCollection(features=[]){return {type:'FeatureCollection',features};}
