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
  const visit=(value,parent=null,siblingIndex=-1)=>{
    if(!Array.isArray(value)||updated)return;
    if(typeof value[0]==='number'){
      if(index++===vertexIndex){
        const closedRing=Array.isArray(parent)&&parent.length>=4&&Array.isArray(parent[0])&&Array.isArray(parent[parent.length-1])&&parent[0][0]===parent[parent.length-1][0]&&parent[0][1]===parent[parent.length-1][1];
        value[0]=longitude;value[1]=latitude;
        if(closedRing&&siblingIndex===0)parent[parent.length-1]=[...value];
        else if(closedRing&&siblingIndex===parent.length-1)parent[0]=[...value];
        updated=true;
      }
      return;
    }
    for(let i=0;i<value.length;i++){visit(value[i],value,i);if(updated)break;}
  };
  const visitGeometry=g=>{
    if(!g||typeof g!=='object'||updated)return;
    if(g.type==='GeometryCollection'){
      if(Array.isArray(g.geometries))for(const child of g.geometries){visitGeometry(child);if(updated)break;}
      return;
    }
    visit(g.coordinates);
  };
  visitGeometry(next.geometry);
  return updated?next:null;
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
    lng=((lng+540)%360)-180;
    ring.push([lng,nextLat*180/Math.PI]);
  }
  ring.push([...ring[0]]);
  return {type:'Feature',properties:{name:'Point buffer ('+Math.round(radiusMeters)+' m)',atlasRole:'buffer',radiusMeters},geometry:{type:'Polygon',coordinates:[ring]}};
}

export function createDensityGrid(features,cellCount=12){
  if(!Array.isArray(features))return [];
  const points=features.flatMap(feature=>feature?.type==='Feature'?collectGeometryPositions(feature.geometry):[]);
  if(points.length<2)return [];
  const size=Math.max(2,Math.min(32,Math.floor(cellCount)||12));
  let south=Infinity,north=-Infinity,west=Infinity,east=-Infinity;
  for(const [lng,lat] of points){south=Math.min(south,lat);north=Math.max(north,lat);west=Math.min(west,lng);east=Math.max(east,lng);}
  const latSpan=Math.max(north-south,0.0001),lngSpan=Math.max(east-west,0.0001);
  const rows=Math.min(size,Math.max(2,Math.ceil(size*latSpan/Math.max(latSpan,lngSpan))));
  const cols=Math.min(size,Math.max(2,Math.ceil(size*lngSpan/Math.max(latSpan,lngSpan))));
  const counts=new Map();
  for(const [lng,lat] of points){
    const col=Math.min(cols-1,Math.floor((lng-west)/lngSpan*cols));
    const row=Math.min(rows-1,Math.floor((lat-south)/latSpan*rows));
    const key=row+':'+col;
    counts.set(key,(counts.get(key)||0)+1);
  }
  const max=Math.max(...counts.values());
  return [...counts.entries()].map(([key,count])=>{
    const [row,col]=key.split(':').map(Number);
    const x0=west+lngSpan*col/cols,x1=west+lngSpan*(col+1)/cols;
    const y0=south+latSpan*row/rows,y1=south+latSpan*(row+1)/rows;
    return {type:'Feature',properties:{name:'Density cell',atlasRole:'density',count,intensity:count/max},geometry:{type:'Polygon',coordinates:[[[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]]]}};
  });
}
