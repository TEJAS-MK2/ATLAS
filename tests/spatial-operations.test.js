import test from 'node:test';
import assert from 'node:assert/strict';
import {collectGeometryPositions,updateGeometryVertex,createPointBuffer,createDensityGrid} from '../src/spatial-operations.js';

const feature=geometry=>({type:'Feature',properties:{name:'editable'},geometry});

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

test('edits nested GeometryCollection vertices without mutating source data',()=>{
 const original=feature({type:'GeometryCollection',geometries:[{type:'Point',coordinates:[88,22]},{type:'LineString',coordinates:[[89,23],[90,24]]}]});
 const changed=updateGeometryVertex(original,2,25,91);
 assert.deepEqual(collectGeometryPositions(changed.geometry),[[88,22],[89,23],[91,25]]);
 assert.deepEqual(collectGeometryPositions(original.geometry),[[88,22],[89,23],[90,24]]);
});

test('creates a closed geodesic buffer polygon with bounded radius',()=>{
 const buffer=createPointBuffer(22.5726,88.3639,500);
 assert.equal(buffer.geometry.type,'Polygon');
 assert.equal(buffer.geometry.coordinates[0].length,49);
 assert.deepEqual(buffer.geometry.coordinates[0][0],buffer.geometry.coordinates[0].at(-1));
 assert.equal(buffer.properties.radiusMeters,500);
 assert.equal(createPointBuffer(91,0,100),null);
 assert.equal(createPointBuffer(0,0,0),null);
 assert.equal(createPointBuffer(0,0,100001),null);
});

test('creates normalized density cells from point and multipoint features',()=>{
 const points=[feature({type:'Point',coordinates:[0,0]}),feature({type:'Point',coordinates:[1,1]}),feature({type:'MultiPoint',coordinates:[[1,1],[1,1]]})];
 const grid=createDensityGrid(points,8);
 assert.ok(grid.length>=1);
 assert.ok(grid.every(cell=>cell.geometry.type==='Polygon'&&cell.properties.intensity>0&&cell.properties.intensity<=1));
 assert.equal(grid.reduce((sum,cell)=>sum+cell.properties.count,0),4);
 assert.deepEqual(createDensityGrid([feature({type:'Point',coordinates:[0,0]})]),[]);
});
