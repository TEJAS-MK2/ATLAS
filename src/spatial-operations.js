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
    value.forEach(visit);
  };
  const visitGeometry=g=>{
    if(!g||typeof g!=='object')return;
    if(g.type==='GeometryCollection'){
      if(Array.isArray(g.geometries))g.geometries.forEach(visitGeometry);
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
  const visit=(value,parent=null,siblingIndex=-1,ringAllowed=false)=>{
    if(!Array.isArray(value)||updated)return;
    if(typeof value[0]==='number'){
      if(index++===vertexIndex){
        const closedRing=ringAllowed&&Array.isArray(parent)&&parent.length>=4&&Array.isArray(parent[0])&&Array.isArray(parent[parent.length-1])&&parent[0][0]===parent[parent.length-1][0]&&parent[0][1]===parent[parent.length-1][1];
        value[0]=longitude;value[1]=latitude;
        if(closedRing&&siblingIndex===0)parent[parent.length-1]=[...value];
        else if(closedRing&&siblingIndex===parent.length-1)parent[0]=[...value];
        updated=true;
      }
      return;
    }
    for(let i=0;i<value.length;i++){visit(value[i],value,i,ringAllowed);if(updated)break;}
  };
  const visitGeometry=g=>{
    if(!g||typeof g!=='object'||updated)return;
    if(g.type==='GeometryCollection'){
      if(Array.isArray(g.geometries))for(const child of g.geometries){visitGeometry(child);if(updated)break;}
      return;
    }
    if(g.type==='Polygon'){
      for(const ring of g.coordinates||[]){visit(ring,null,-1,true);if(updated)break;}
    }else if(g.type==='MultiPolygon'){
      for(const polygon of g.coordinates||[]){
        for(const ring of polygon||[]){visit(ring,null,-1,true);if(updated)break;}
        if(updated)break;
      }
    }else visit(g.coordinates);
  };
  visitGeometry(next.geometry);
  return updated?next:null;
}

function clipRingAtLongitude(ring,boundary,keepGreater){
  const output=[];
  for(let i=0;i<ring.length-1;i++){
    const a=ring[i],b=ring[i+1],aInside=keepGreater?a[0]>=boundary:a[0]<=boundary,bInside=keepGreater?b[0]>=boundary:b[0]<=boundary;
    if(aInside&&bInside)output.push(b);
    else if(aInside&&!bInside){const t=(boundary-a[0])/(b[0]-a[0]);output.push([boundary,a[1]+(b[1]-a[1])*t]);}
    else if(!aInside&&bInside){const t=(boundary-a[0])/(b[0]-a[0]);output.push([boundary,a[1]+(b[1]-a[1])*t],b);}
  }
  if(output.length>=3)output.push([...output[0]]);
  return output;
}
function splitAntimeridianRing(ring){
  const min=Math.min(...ring.map(point=>point[0])),max=Math.max(...ring.map(point=>point[0]));
  const firstStrip=Math.floor((min+180)/360),lastStrip=Math.floor((max+180)/360),polygons=[];
  for(let strip=firstStrip;strip<=lastStrip;strip++){
    const west=-180+strip*360,east=180+strip*360;
    let clipped=clipRingAtLongitude(ring,west,true);
    if(clipped.length)clipped=clipRingAtLongitude(clipped,east,false);
    if(clipped.length>=4){const shifted=clipped.map(([lng,lat])=>[lng-strip*360,lat]);polygons.push([shifted]);}
  }
  return polygons;
}
export function createPointBuffer(latitude,longitude,radiusMeters,steps=48){
  if(!validCoordinate(latitude,longitude)||!Number.isFinite(radiusMeters)||radiusMeters<1||radiusMeters>100000)return null;
  const count=Math.max(16,Math.min(128,Math.floor(steps)||48));
  const earth=6371008.8,latRad=latitude*Math.PI/180,angular=radiusMeters/earth;
  const ring=[];
  for(let i=0;i<count;i++){
    const bearing=2*Math.PI*i/count;
    const nextLat=Math.asin(Math.sin(latRad)*Math.cos(angular)+Math.cos(latRad)*Math.sin(angular)*Math.cos(bearing));
    const nextLng=(longitude*Math.PI/180)+Math.atan2(Math.sin(bearing)*Math.sin(angular)*Math.cos(latRad),Math.cos(angular)-Math.sin(latRad)*Math.sin(nextLat));
    let lng=nextLng*180/Math.PI;
    while(lng-longitude>180)lng-=360;
    while(lng-longitude< -180)lng+=360;
    ring.push([lng,nextLat*180/Math.PI]);
  }
  ring.push([...ring[0]]);
  const polygons=splitAntimeridianRing(ring);
  const geometry=polygons.length>1?{type:'MultiPolygon',coordinates:polygons}:{type:'Polygon',coordinates:polygons[0]||[ring.map(([lng,lat])=>[((lng+180)%360+360)%360-180,lat])]};
  return {type:'Feature',properties:{name:'Point buffer ('+Math.round(radiusMeters)+' m)',atlasRole:'buffer',radiusMeters},geometry};
}

export function createDensityGrid(features,cellCount=12){
  if(!Array.isArray(features))return [];
  const points=features.flatMap(feature=>feature?.type==='Feature'?collectGeometryPositions(feature.geometry):[]);
  if(points.length<2)return [];
  const size=Math.max(2,Math.min(32,Math.floor(cellCount)||12));
  const longitudes=points.map(([lng])=>((lng%360)+360)%360).sort((a,b)=>a-b);
  let largestGap=-1,gapIndex=0;
  for(let i=0;i<longitudes.length;i++){const next=i===longitudes.length-1?longitudes[0]+360:longitudes[i+1],gap=next-longitudes[i];if(gap>largestGap){largestGap=gap;gapIndex=i;}}
  const arcStart=longitudes[(gapIndex+1)%longitudes.length];
  const unwrapped=points.map(([lng,lat])=>{let x=((lng%360)+360)%360;if(x<arcStart)x+=360;return [x,lat];});
  let south=Infinity,north=-Infinity,west=Infinity,east=-Infinity;
  for(const [lng,lat] of unwrapped){south=Math.min(south,lat);north=Math.max(north,lat);west=Math.min(west,lng);east=Math.max(east,lng);}
  const latSpan=Math.max(north-south,0.0001),lngSpan=Math.max(east-west,0.0001);
  const rows=Math.min(size,Math.max(2,Math.ceil(size*latSpan/Math.max(latSpan,lngSpan))));
  const cols=Math.min(size,Math.max(2,Math.ceil(size*lngSpan/Math.max(latSpan,lngSpan))));
  const counts=new Map();
  for(const [lng,lat] of unwrapped){const col=Math.min(cols-1,Math.floor((lng-west)/lngSpan*cols)),row=Math.min(rows-1,Math.floor((lat-south)/latSpan*rows)),key=row+':'+col;counts.set(key,(counts.get(key)||0)+1);}
  const max=Math.max(...counts.values()),cells=[];
  const rectangle=(x0,x1,y0,y1)=>{
    const pieces=[];let cursor=x0;
    while(cursor<x1-1e-12){
      const boundary=180+360*Math.floor((cursor-180)/360+1);
      const end=Math.min(x1,boundary),shift=360*Math.floor(((cursor+end)/2+180)/360);
      const a=cursor-shift,b=end-shift;
      pieces.push([[[a,y0],[b,y0],[b,y1],[a,y1],[a,y0]]]);
      cursor=end;
    }
    return pieces.length===1?{type:'Polygon',coordinates:pieces[0]}:{type:'MultiPolygon',coordinates:pieces};
  };
  for(const [key,count] of counts){
    const [row,col]=key.split(':').map(Number),x0=west+lngSpan*col/cols,x1=west+lngSpan*(col+1)/cols,y0=south+latSpan*row/rows,y1=south+latSpan*(row+1)/rows;
    cells.push({type:'Feature',properties:{name:'Density cell',atlasRole:'density',count,intensity:count/max},geometry:rectangle(x0,x1,y0,y1)});
  }
  return cells;
}
