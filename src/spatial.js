import {validCoordinate} from './geo.js';

function coordinateFromPosition(position){
  if(!Array.isArray(position)||position.length<2||!validCoordinate(position[1],position[0]))return null;
  return {lat:position[1],lng:position[0]};
}

export function normalizeBounds(value){
  let south,west,north,east;
  if(Array.isArray(value)&&value.length===2&&Array.isArray(value[0])&&Array.isArray(value[1])){
    [[south,west],[north,east]]=value;
  }else if(value&&typeof value==='object'){
    ({south,west,north,east}=value);
  }else return null;
  if(![south,west,north,east].every(Number.isFinite))return null;
  if(south < -90||north > 90||south>north||west < -180||west>180||east < -180||east>180)return null;
  return {south,west,north,east};
}

function longitudeSegments(west,east){
  return west<=east?[[west,east]]:[[-180,east],[west,180]];
}

export function boundsIntersect(a,b){
  const left=normalizeBounds(a),right=normalizeBounds(b);
  if(!left||!right||left.north<right.south||right.north<left.south)return false;
  return longitudeSegments(left.west,left.east).some(x=>longitudeSegments(right.west,right.east).some(y=>x[0]<=y[1]&&y[0]<=x[1]));
}

export function geometryBounds(geometry){
  if(!geometry||typeof geometry!=='object'||Array.isArray(geometry))return null;
  let south=Infinity,north=-Infinity,count=0;
  const longitudes=[];
  const visitPosition=position=>{
    const point=coordinateFromPosition(position);
    if(!point)return;
    south=Math.min(south,point.lat);north=Math.max(north,point.lat);
    longitudes.push(((point.lng+180)%360+360)%360);count++;
  };
  const walk=value=>{
    if(!Array.isArray(value))return;
    if(typeof value[0]==='number'){visitPosition(value);return;}
    value.forEach(walk);
  };
  const visit=g=>{
    if(!g||typeof g!=='object')return;
    if(g.type==='GeometryCollection'){
      if(Array.isArray(g.geometries))g.geometries.forEach(visit);
      return;
    }
    walk(g.coordinates);
  };
  visit(geometry);
  if(!count)return null;
  longitudes.sort((a,b)=>a-b);
  let largestGap=-1,gapIndex=0;
  for(let i=0;i<longitudes.length;i++){
    const next=i===longitudes.length-1?longitudes[0]+360:longitudes[i+1];
    const gap=next-longitudes[i];
    if(gap>largestGap){largestGap=gap;gapIndex=i;}
  }
  const west=longitudes[(gapIndex+1)%longitudes.length]-180;
  const east=longitudes[gapIndex]-180;
  return {south,west,north,east};
}

export function geometryIntersectsBounds(geometry,bounds){
  const target=normalizeBounds(bounds),extent=geometryBounds(geometry);
  return Boolean(target&&extent&&boundsIntersect(extent,target));
}

export function filterFeaturesByBounds(features,bounds){
  if(!Array.isArray(features)||!normalizeBounds(bounds))return [];
  return features.filter(feature=>feature?.type==='Feature'&&geometryIntersectsBounds(feature.geometry,bounds));
}

function pointOnSegment(point,a,b,epsilon=1e-10){
  const cross=(point.lng-a[0])*(b[1]-a[1])-(point.lat-a[1])*(b[0]-a[0]);
  if(Math.abs(cross)>epsilon)return false;
  const dot=(point.lng-a[0])*(b[0]-a[0])+(point.lat-a[1])*(b[1]-a[1]);
  if(dot < -epsilon)return false;
  const length=(b[0]-a[0])**2+(b[1]-a[1])**2;
  if(length<=epsilon*epsilon)return Math.abs(point.lng-a[0])<=epsilon&&Math.abs(point.lat-a[1])<=epsilon;
  return dot<=length+epsilon;
}

function unwrapLongitude(longitude,reference){
  let value=longitude;
  while(value-reference>180)value-=360;
  while(value-reference< -180)value+=360;
  return value;
}

function ringCoordinatesNearPoint(point,ring){
  if(!ring.every(position=>coordinateFromPosition(position)))return null;
  const extent=geometryBounds({type:'LineString',coordinates:ring});
  if(!extent||extent.west<=extent.east)return {point,ring:ring.map(position=>[position[0],position[1]])};
  const span=(extent.east-extent.west+360)%360;
  const center=extent.west+span/2;
  const reference=((center+180)%360+360)%360-180;
  return {
    point:{...point,lng:unwrapLongitude(point.lng,reference)},
    ring:ring.map(position=>[unwrapLongitude(position[0],reference),position[1]])
  };
}

export function pointInRing(point,ring){
  if(!point||!validCoordinate(point.lat,point.lng)||!Array.isArray(ring)||ring.length<4)return false;
  const unwrapped=ringCoordinatesNearPoint(point,ring);
  if(!unwrapped)return false;
  const target=unwrapped.point,coordinates=unwrapped.ring;
  let inside=false;
  for(let i=0,j=coordinates.length-1;i<coordinates.length;j=i++){
    const a=coordinates[j],b=coordinates[i];
    if(pointOnSegment(target,a,b))return true;
    const crosses=(a[1]>target.lat)!==(b[1]>target.lat);
    if(crosses){
      const intersection=(b[0]-a[0])*(target.lat-a[1])/(b[1]-a[1])+a[0];
      if(target.lng<intersection)inside=!inside;
    }
  }
  return inside;
}

export function pointInPolygon(point,polygon){
  if(!Array.isArray(polygon)||!polygon.length||!pointInRing(point,polygon[0]))return false;
  for(let i=1;i<polygon.length;i++)if(pointInRing(point,polygon[i]))return false;
  return true;
}

export function geometryContainsPoint(geometry,point){
  if(!geometry||typeof geometry!=='object'||!point||!validCoordinate(point.lat,point.lng))return false;
  if(geometry.type==='GeometryCollection')return Array.isArray(geometry.geometries)&&geometry.geometries.some(item=>geometryContainsPoint(item,point));
  if(geometry.type==='Polygon')return pointInPolygon(point,geometry.coordinates);
  if(geometry.type==='MultiPolygon')return Array.isArray(geometry.coordinates)&&geometry.coordinates.some(poly=>pointInPolygon(point,poly));
  const samePosition=candidate=>Boolean(candidate&&Math.abs(candidate.lat-point.lat)<=1e-10&&Math.min(Math.abs(candidate.lng-point.lng),360-Math.abs(candidate.lng-point.lng))<=1e-10);
  if(geometry.type==='Point')return samePosition(coordinateFromPosition(geometry.coordinates));
  if(geometry.type==='MultiPoint')return Array.isArray(geometry.coordinates)&&geometry.coordinates.some(position=>samePosition(coordinateFromPosition(position)));
  return false;
}

export function filterFeaturesContainingPoint(features,point){
  if(!Array.isArray(features)||!point||!validCoordinate(point.lat,point.lng))return [];
  return features.filter(feature=>feature?.type==='Feature'&&geometryContainsPoint(feature.geometry,point));
}
