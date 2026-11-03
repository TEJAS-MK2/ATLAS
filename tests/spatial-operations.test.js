import test from 'node:test';
import assert from 'node:assert/strict';
import {collectGeometryPositions,updateGeometryVertex,createPointBuffer,createDensityGrid} from '../src/spatial-operations.js';

const feature=geometry=>({type:'Feature',properties:{name:'editable'},geometry});
function polygonRings(geometry){
 if(geometry.type==='Polygon')return geometry.coordinates;
 if(geometry.type==='MultiPolygon')return geometry.coordinates.flat();
 return [];
}
function assertValidWrappedRings(geometry){
 for(const ring of polygonRings(geometry)){
  assert.deepEqual(ring[0],ring.at(-1));
  for(let i=1;i<ring.length;i++)assert.ok(Math.abs(ring[i][0]-ring[i-1][0])<=180,'ring edge must not jump across the world');
  for(const [lng,lat] of ring){assert.ok(lng>=-180&&lng<=180);assert.ok(lat>=-90&&lat<=90);}
 }
}

test('collects valid coordinate positions from nested geometry and collections',()=>{
 const geometry={type:'GeometryCollection',geometries:[{type:'LineString',coordinates:[[88,22],[89,23]]},{type:'Point',coordinates:[90,24]}]};
 assert.deepEqual(collectGeometryPositions(geometry),[[88,22],[89,23],[90,24]]);
 assert.deepEqual(collectGeometryPositions({type:'Point',coordinates:[181,0]}),[]);
});

test('updates one selected GeoJSON vertex immutably and rejects invalid selections',()=>{
 const original=feature({type:'LineString',coordinates:[[88,22],[89,23]]});
 const changed=updateGeometryVertex(original,1,24,90);
 assert.deepEqual(changed.geometry.coordinates,[[88,22],[90,24]]);
 assert.deepEqual(original.geometry.coordinates,[[88,22],[89,23]]);
 assert.equal(updateGeometryVertex(original,4,24,90),null);
 assert.equal(updateGeometryVertex(original,0,91,90),null);
});

test('editing a closed polygon ring keeps its closing coordinate synchronized',()=>{
 const original=feature({type:'Polygon',coordinates:[[[0,0],[1,0],[1,1],[0,1],[0,0]]]});
 const changed=updateGeometryVertex(original,0,2,3);
 assert.deepEqual(changed.geometry.coordinates[0][0],[3,2]);
 assert.deepEqual(changed.geometry.coordinates[0][0],changed.geometry.coordinates[0].at(-1));
 assert.deepEqual(original.geometry.coordinates[0][0],[0,0]);
 const closingEdit=updateGeometryVertex(original,4,4,5);
 assert.deepEqual(closingEdit.geometry.coordinates[0][0],[5,4]);
 assert.deepEqual(closingEdit.geometry.coordinates[0][0],closingEdit.geometry.coordinates[0].at(-1));
});

test('closed-looking MultiPoint vertices are edited independently, not mirrored',()=>{
 const original=feature({type:'MultiPoint',coordinates:[[0,0],[1,1],[0,0]]});
 const changed=updateGeometryVertex(original,0,2,3);
 assert.deepEqual(changed.geometry.coordinates,[[3,2],[1,1],[0,0]]);
 assert.deepEqual(original.geometry.coordinates,[[0,0],[1,1],[0,0]]);
});

test('edits nested GeometryCollection vertices without mutating source data',()=>{
 const original=feature({type:'GeometryCollection',geometries:[{type:'Point',coordinates:[88,22]},{type:'LineString',coordinates:[[89,23],[90,24]]}]});
 const changed=updateGeometryVertex(original,2,25,91);
 assert.deepEqual(collectGeometryPositions(changed.geometry),[[88,22],[89,23],[91,25]]);
 assert.deepEqual(collectGeometryPositions(original.geometry),[[88,22],[89,23],[90,24]]);
});

test('creates a closed geodesic buffer with bounded radius',()=>{
 const buffer=createPointBuffer(22.5726,88.3639,500);
 assert.equal(buffer.geometry.type,'Polygon');
 assert.equal(buffer.geometry.coordinates[0].length,49);
 assertValidWrappedRings(buffer.geometry);
 assert.equal(buffer.properties.radiusMeters,500);
 assert.equal(createPointBuffer(91,0,100),null);
 assert.equal(createPointBuffer(0,0,0),null);
 assert.equal(createPointBuffer(0,0,100001),null);
 assert.equal(createPointBuffer(89.9,0,50000),null);
});

test('splits geodesic buffers cleanly at the antimeridian',()=>{
 const buffer=createPointBuffer(0,179.99,5000);
 assert.equal(buffer.geometry.type,'MultiPolygon');
 assert.ok(buffer.geometry.coordinates.length>=2);
 assertValidWrappedRings(buffer.geometry);
});

test('creates normalized density cells from point and multipoint features',()=>{
 const points=[feature({type:'Point',coordinates:[0,0]}),feature({type:'Point',coordinates:[1,1]}),feature({type:'MultiPoint',coordinates:[[1,1],[1,1]]})];
 const grid=createDensityGrid(points,8);
 assert.ok(grid.length>=1);
 assert.ok(grid.every(cell=>cell.geometry.type==='Polygon'&&cell.properties.intensity>0&&cell.properties.intensity<=1));
 assert.equal(grid.reduce((sum,cell)=>sum+cell.properties.count,0),4);
 assert.deepEqual(createDensityGrid([feature({type:'Point',coordinates:[0,0]})]),[]);
});

test('density grid uses the short longitude arc across the antimeridian',()=>{
 const points=[feature({type:'Point',coordinates:[179.9,0]}),feature({type:'Point',coordinates:[-179.9,0.1]}),feature({type:'Point',coordinates:[179.95,0.05]})];
 const grid=createDensityGrid(points,8);
 assert.ok(grid.length>0);
 const longitudes=grid.flatMap(cell=>collectGeometryPositions(cell.geometry).map(point=>point[0]));
 assert.ok(longitudes.some(lng=>lng>179.8));
 assert.ok(longitudes.some(lng=>lng< -179.8));
 assert.equal(grid.reduce((sum,cell)=>sum+cell.properties.count,0),3);
 for(const cell of grid)assertValidWrappedRings(cell.geometry);
});
