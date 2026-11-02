export function haversine(a,b){const R=6371000,rad=x=>x*Math.PI/180;const dLat=rad(b.lat-a.lat),dLon=rad(b.lng-a.lng);const q=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.sqrt(q));}
export function formatDistance(m){if(!Number.isFinite(m)||m<0)return '—';return m>=1000?(m/1000).toFixed(m>=10000?1:2)+' km':Math.round(m)+' m';}
export function validCoordinate(lat,lng){return typeof lat==='number'&&Number.isFinite(lat)&&typeof lng==='number'&&Number.isFinite(lng)&&Math.abs(lat)<=90&&Math.abs(lng)<=180;}
export function sanitizeName(value){return String(value??'').replace(/[<>\u0000-\u001f]/g,'').trim().slice(0,80);}
export function featureCollection(features=[]){return {type:'FeatureCollection',features};}
const EARTH_RADIUS=6371008.8;
function walkCoordinates(value,visit,state){
 if(!Array.isArray(value)||value.length===0)throw new Error('Invalid or empty GeoJSON coordinates.');
 if(typeof value[0]==='number'){
  if(value.length<2||!validCoordinate(value[1],value[0])||value.slice(2).some(n=>typeof n!=='number'||!Number.isFinite(n)))throw new Error('GeoJSON contains an invalid coordinate.');
  state.count++;if(state.count>state.maxCoordinates)throw new Error('GeoJSON exceeds the coordinate limit.');
  visit([value[0],value[1]]);return;
 }
 for(const item of value)walkCoordinates(item,visit,state);
}
function validateGeometry(g,state){
 if(g===null)return;
 if(!g||typeof g!=='object'||Array.isArray(g))throw new Error('Invalid GeoJSON geometry.');
 if(g.type==='GeometryCollection'){if(!Array.isArray(g.geometries)||g.geometries.length>1000)throw new Error('Invalid geometry collection.');g.geometries.forEach(x=>validateGeometry(x,state));return}
 if(!['Point','MultiPoint','LineString','MultiLineString','Polygon','MultiPolygon'].includes(g.type))throw new Error('Unsupported GeoJSON geometry type.');
 walkCoordinates(g.coordinates,()=>{},state);
}
export function validateFeatureCollection(value,{maxFeatures=5000,maxCoordinates=100000}={}){
 if(!value||typeof value!=='object'||value.type!=='FeatureCollection'||!Array.isArray(value.features))throw new Error('Expected a GeoJSON FeatureCollection.');
 if(value.features.length>maxFeatures)throw new Error('GeoJSON exceeds the feature limit of '+maxFeatures+'.');
 const state={count:0,maxCoordinates};
 for(const f of value.features){if(!f||typeof f!=='object'||Array.isArray(f)||f.type!=='Feature')throw new Error('Invalid GeoJSON feature.');if(f.properties!==null&&f.properties!==undefined&&(typeof f.properties!=='object'||Array.isArray(f.properties)))throw new Error('Feature properties must be an object or null.');validateGeometry(f.geometry,state)}
 return {type:'FeatureCollection',features:value.features};
}
export function coordinateToDMS(lat,lng){
 if(!validCoordinate(lat,lng))throw new Error('Coordinates are outside valid latitude/longitude bounds.');
 const part=(v,pos,neg)=>{const a=Math.abs(v),d=Math.floor(a),mf=(a-d)*60,m=Math.floor(mf),s=((mf-m)*60).toFixed(2);return d+'° '+m+"' "+s+'" '+(v>=0?pos:neg)};
 return part(lat,'N','S')+'  '+part(lng,'E','W');
}
function lineLength(c){let n=0;for(let i=1;i<c.length;i++)n+=haversine({lat:c[i-1][1],lng:c[i-1][0]},{lat:c[i][1],lng:c[i][0]});return n}
function ringArea(r){if(r.length<4)return 0;let s=0;for(let i=0;i<r.length-1;i++){const a=r[i],b=r[i+1];s+=(b[0]-a[0])*Math.PI/180*(2+Math.sin(a[1]*Math.PI/180)+Math.sin(b[1]*Math.PI/180))}return Math.abs(s*EARTH_RADIUS*EARTH_RADIUS/2)}
export function geometryMetrics(feature){
 const g=feature?.type==='Feature'?feature.geometry:feature;if(!g)return {lengthMeters:0,areaSquareMeters:0,bounds:null};
 let lengthMeters=0,areaSquareMeters=0,minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
 const line=c=>{lengthMeters+=lineLength(c)},polygon=rings=>{rings.forEach((r,i)=>{line(r);if(i===0)areaSquareMeters+=ringArea(r);else areaSquareMeters=Math.max(0,areaSquareMeters-ringArea(r))})};
 const visit=x=>{if(!x)return;if(x.type==='GeometryCollection'){x.geometries.forEach(visit);return}walkCoordinates(x.coordinates,p=>{minX=Math.min(minX,p[0]);maxX=Math.max(maxX,p[0]);minY=Math.min(minY,p[1]);maxY=Math.max(maxY,p[1])},{count:0,maxCoordinates:1000000});if(x.type==='LineString')line(x.coordinates);else if(x.type==='MultiLineString')x.coordinates.forEach(line);else if(x.type==='Polygon')polygon(x.coordinates);else if(x.type==='MultiPolygon')x.coordinates.forEach(polygon)};
 visit(g);return {lengthMeters,areaSquareMeters,bounds:minX===Infinity?null:[[minY,minX],[maxY,maxX]]};
}
export function filterFeatures(features,query=''){
 const q=String(query).trim().toLocaleLowerCase();if(!q)return features.slice();
 return features.filter(f=>[f?.id,f?.geometry?.type,JSON.stringify(f?.properties??{})].join(' ').toLocaleLowerCase().includes(q));
}
