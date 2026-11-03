import {validCoordinate} from './geo.js';

function cloneJson(value){return JSON.parse(JSON.stringify(value));}

export function collectGeometryPositions(geometry){
  const positions=[];
  const visit=value=>{
    if(!Array.isArray(value))return;
    if(typeof value[0]==='number'){
      if(value.length>=2&&validCoordinate(value[1],value[0]))positions.push([value[0],value[1]]);
      return;
    }
    for(const child of value)visit(child);
  };
  const visitGeometry=g=>{
    if(!g||typeof g!=='object')return;
    if(g.type==='GeometryCollection'){
      if(Array.isArray(g.geometries))for(const child of g.geometries)visitGeometry(child);
      return;
    }
    visit(g.coordinates);
  };
  visitGeometry(geometry);
  return positions;
}

export function updateGeometryVertex(feature,vertexIndex,latitude,longitude){
  if(!feature||feature.type!=='Feature'||!Number.isInteger(vertexIndex)||vertexIndex<0||!validCoordinate(latitude,longitude))return null;
  const next=cloneJson(feature);
  let index=0,updated=false;
  const visitPosition=(position,parent=null,siblingIndex=-1,ringAllowed=false)=>{
    if(!Array.isArray(position)||typeof position[0]!=='number'||updated)return;
    if(index++!==vertexIndex)return;
    const closedRing=ringAllowed&&Array.isArray(parent)&&parent.length>=4&&Array.isArray(parent[0])&&Array.isArray(parent[parent.length-1])&&parent[0][0]===parent[parent.length-1][0]&&parent[0][1]===parent[parent.length-1][1];
    position[0]=longitude;position[1]=latitude;
    if(closedRing&&siblingIndex===0)parent[parent.length-1]=[...position];
    else if(closedRing&&siblingIndex===parent.length-1)parent[0]=[...position];
    updated=true;
  };
  const visitLine=(line,ringAllowed=false)=>{
    if(!Array.isArray(line))return;
    for(let i=0;i<line.length&&!updated;i++)visitPosition(line[i],line,i,ringAllowed);
  };
  const visitGeometry=g=>{
    if(!g||typeof g!=='object'||updated)return;
    if(g.type==='GeometryCollection'){
      if(Array.isArray(g.geometries))for(const child of g.geometries){visitGeometry(child);if(updated)break;}
      return;
    }
    const coordinates=g.coordinates;
    if(g.type==='Point')visitPosition(coordinates);
    else if(g.type==='MultiPoint'||g.type==='LineString')visitLine(coordinates);
    else if(g.type==='MultiLineString'){if(Array.isArray(coordinates))for(const line of coordinates){visitLine(line);if(updated)break;}}
    else if(g.type==='Polygon'){if(Array.isArray(coordinates))for(const ring of coordinates){visitLine(ring,true);if(updated)break;}}
    else if(g.type==='MultiPolygon'){if(Array.isArray(coordinates))for(const polygon of coordinates){for(const ring of polygon){visitLine(ring,true);if(updated)break;}if(updated)break;}}
  };
  visitGeometry(next.geometry);
  return updated?next:null;
}

function clipLongitudeBoundary(points,boundary,keepGreater){
  if(!points.length)return [];
  const inside=point=>keepGreater?point[0]>=boundary-1e-10:point[0]<=boundary+1e-10;
  const intersection=(a,b)=>{
    const delta=b[0]-a[0];
    if(Math.abs(delta)<1e-12)return [boundary,a[1]];
    const t=(boundary-a[0])/delta;
    return [boundary,a[1]+(b[1]-a[1])*t];
  };
  const output=[];
  let previous=points[points.length-1],previousInside=inside(previous);
  for(const current of points){
    const currentInside=inside(current);
    if(currentInside){
      if(!previousInside)output.push(intersection(previous,current));
      output.push(current);
    }else if(previousInside)output.push(intersection(previous,current));
    previous=current;previousInside=currentInside;
  }
  return output;
}

function polygonGeometryFromUnwrappedRing(closedRing){
  const openRing=closedRing.slice(0,-1);
  if(openRing.length<3)return null;
  let minLng=Infinity,maxLng=-Infinity;
  for(const point of openRing){minLng=Math.min(minLng,point[0]);maxLng=Math.max(maxLng,point[0]);}
  const firstStrip=Math.floor((minLng+180)/360),lastStrip=Math.floor((maxLng+180)/360),polygons=[];
  for(let strip=firstStrip;strip<=lastStrip;strip++){
    const west=-180+360*strip,east=180+360*strip;
    let clipped=clipLongitudeBoundary(openRing,west,true);
    clipped=clipLongitudeBoundary(clipped,east,false);
    const clean=[];
    for(const point of clipped){
      if(!clean.length||Math.abs(clean[clean.length-1][0]-point[0])>1e-10||Math.abs(clean[clean.length-1][1]-point[1])>1e-10)clean.push(point);
    }
    if(clean.length>1&&Math.abs(clean[0][0]-clean.at(-1)[0])<1e-10&&Math.abs(clean[0][1]-clean.at(-1)[1])<1e-10)clean.pop();
    if(clean.length<3)continue;
    const shifted=clean.map(([lng,lat])=>[lng-360*strip,lat]);
    shifted.push([...shifted[0]]);
    polygons.push([shifted]);
  }
  if(!polygons.length)return null;
  return polygons.length===1?{type:'Polygon',coordinates:polygons[0]}:{type:'MultiPolygon',coordinates:polygons};
}

export function createPointBuffer(latitude,longitude,radiusMeters,steps=48){
  if(!validCoordinate(latitude,longitude)||!Number.isFinite(radiusMeters)||radiusMeters<1||radiusMeters>100000)return null;
  const count=Math.max(16,Math.min(128,Math.floor(steps)||48));
  const earth=6371008.8,latRad=latitude*Math.PI/180,angular=radiusMeters/earth;
  if(angular>(90-Math.abs(latitude))*Math.PI/180)return null;
  const ring=[];
  let previousLongitude=longitude;
  for(let i=0;i<count;i++){
    const bearing=2*Math.PI*i/count;
    const nextLat=Math.asin(Math.sin(latRad)*Math.cos(angular)+Math.cos(latRad)*Math.sin(angular)*Math.cos(bearing));
    const nextLng=(longitude*Math.PI/180)+Math.atan2(Math.sin(bearing)*Math.sin(angular)*Math.cos(latRad),Math.cos(angular)-Math.sin(latRad)*Math.sin(nextLat));
    let lng=nextLng*180/Math.PI;
    while(lng-previousLongitude>180)lng-=360;
    while(lng-previousLongitude< -180)lng+=360;
    ring.push([lng,nextLat*180/Math.PI]);
    previousLongitude=lng;
  }
  ring.push([...ring[0]]);
  const geometry=polygonGeometryFromUnwrappedRing(ring);
  if(!geometry)return null;
  return {type:'Feature',properties:{name:'Point buffer ('+Math.round(radiusMeters)+' m)',atlasRole:'buffer',radiusMeters},geometry};
}

function minimalLongitudeExtent(points){
  const longitudes=points.map(([lng])=>((lng+180)%360+360)%360).sort((a,b)=>a-b);
  let largestGap=-1,gapIndex=0;
  for(let i=0;i<longitudes.length;i++){
    const next=i===longitudes.length-1?longitudes[0]+360:longitudes[i+1];
    const gap=next-longitudes[i];
    if(gap>largestGap){largestGap=gap;gapIndex=i;}
  }
  const west=longitudes[(gapIndex+1)%longitudes.length]-180;
  const east=longitudes[gapIndex]-180;
  const span=(east-west+360)%360;
  return {west,span};
}
function unwrapLongitude(longitude,west){
  let value=longitude;
  while(value<west-1e-10)value+=360;
  while(value>=west+360)value-=360;
  return value;
}

export function createDensityGrid(features,cellCount=12){
  if(!Array.isArray(features))return [];
  const points=[];
  for(const feature of features)if(feature?.type==='Feature')for(const point of collectGeometryPositions(feature.geometry))points.push(point);
  if(points.length<2)return [];
  const size=Math.max(2,Math.min(32,Math.floor(cellCount)||12));
  let south=Infinity,north=-Infinity;
  for(const [,lat] of points){south=Math.min(south,lat);north=Math.max(north,lat);}
  const {west,span}=minimalLongitudeExtent(points);
  const lngSpan=Math.max(span,0.0001),latSpan=Math.max(north-south,0.0001);
  const midLatitude=(south+north)/2,longitudeScale=lngSpan*Math.max(0.01,Math.cos(midLatitude*Math.PI/180));
  const aspect=Math.max(latSpan,longitudeScale);
  const rows=Math.min(size,Math.max(2,Math.ceil(size*latSpan/aspect)));
  const cols=Math.min(size,Math.max(2,Math.ceil(size*longitudeScale/aspect)));
  const counts=new Map();
  for(const [lng,lat] of points){
    const x=unwrapLongitude(lng,west);
    const col=Math.min(cols-1,Math.max(0,Math.floor((x-west)/lngSpan*cols)));
    const row=Math.min(rows-1,Math.max(0,Math.floor((lat-south)/latSpan*rows)));
    const key=row+':'+col;
    counts.set(key,(counts.get(key)||0)+1);
  }
  let max=0;for(const count of counts.values())max=Math.max(max,count);
  return [...counts.entries()].map(([key,count])=>{
    const [row,col]=key.split(':').map(Number);
    const x0=west+lngSpan*col/cols,x1=west+lngSpan*(col+1)/cols;
    const y0=south+latSpan*row/rows,y1=south+latSpan*(row+1)/rows;
    const geometry=polygonGeometryFromUnwrappedRing([[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]]);
    return {type:'Feature',properties:{name:'Density cell',atlasRole:'density',count,intensity:count/max},geometry};
  }).filter(feature=>feature.geometry);
}
