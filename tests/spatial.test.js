import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeBounds,boundsIntersect,geometryBounds,geometryIntersectsBounds,
  filterFeaturesByBounds,pointInRing,pointInPolygon,geometryContainsPoint,
  filterFeaturesContainingPoint
} from '../src/spatial.js';

const square=[[0,0],[4,0],[4,4],[0,4],[0,0]];
const polygon={type:'Polygon',coordinates:[square]};
const feature=geometry=>({type:'Feature',properties:{name:'sample'},geometry});

test('normalizes supported bounds shapes and rejects invalid extents',()=>{
  assert.deepEqual(normalizeBounds([[1,2],[3,4]]),{south:1,west:2,north:3,east:4});
  assert.deepEqual(normalizeBounds({south:1,west:2,north:3,east:4}),{south:1,west:2,north:3,east:4});
  assert.equal(normalizeBounds({south:4,west:2,north:1,east:4}),null);
  assert.equal(normalizeBounds({south:-91,west:0,north:1,east:2}),null);
});

test('bounds intersection handles overlap, separation and antimeridian extents',()=>{
  assert.equal(boundsIntersect({south:0,west:0,north:2,east:2},{south:1,west:1,north:3,east:3}),true);
  assert.equal(boundsIntersect({south:0,west:0,north:1,east:1},{south:2,west:2,north:3,east:3}),false);
  assert.equal(boundsIntersect({south:-1,west:170,north:1,east:-170},{south:0,west:175,north:2,east:179}),true);
  assert.equal(boundsIntersect({south:-1,west:170,north:1,east:-170},{south:0,west:-20,north:2,east:20}),false);
});

test('geometry bounds traverse nested and collection coordinates safely',()=>{
  assert.deepEqual(geometryBounds(polygon),{south:0,west:0,north:4,east:4});
  assert.deepEqual(geometryBounds({type:'GeometryCollection',geometries:[polygon,{type:'Point',coordinates:[8,9]}]}),{south:0,west:0,north:9,east:8});
  assert.equal(geometryBounds({type:'Point',coordinates:[181,0]}),null);
  assert.equal(geometryBounds(null),null);
});

test('geometry bounds choose the short longitude arc across the antimeridian',()=>{
  const crossing={type:'Polygon',coordinates:[[[179,0],[-179,0],[-179,1],[179,1],[179,0]]]};
  assert.deepEqual(geometryBounds(crossing),{south:0,west:179,north:1,east:-179});
  assert.equal(geometryIntersectsBounds(crossing,{south:0,west:175,north:1,east:180}),true);
  assert.equal(geometryIntersectsBounds(crossing,{south:0,west:0,north:1,east:10}),false);
});

test('bounds filter returns intersecting valid GeoJSON features only',()=>{
  const items=[feature(polygon),feature({type:'Point',coordinates:[8,8]}),{type:'Feature',geometry:null}];
  assert.deepEqual(filterFeaturesByBounds(items,{south:1,west:1,north:2,east:2}),[items[0]]);
  assert.equal(geometryIntersectsBounds(polygon,{south:5,west:5,north:6,east:6}),false);
  assert.deepEqual(filterFeaturesByBounds(items,null),[]);
});

test('point-in-ring includes boundary and rejects points outside',()=>{
  assert.equal(pointInRing({lat:2,lng:2},square),true);
  assert.equal(pointInRing({lat:0,lng:2},square),true);
  assert.equal(pointInRing({lat:5,lng:2},square),false);
  assert.equal(pointInRing({lat:2,lng:2},[[0,0],[1,1],[0,0]]),false);
});

test('closed rings do not treat the duplicated closing vertex as a zero-length edge',()=>{
  assert.equal(pointInRing({lat:5,lng:2},square),false);
  assert.equal(pointInRing({lat:0,lng:0},square),true);
});

test('polygon containment respects holes and multipolygon components',()=>{
  const withHole={type:'Polygon',coordinates:[square,[[1,1],[3,1],[3,3],[1,3],[1,1]]]};
  assert.equal(geometryContainsPoint(withHole,{lat:.5,lng:.5}),true);
  assert.equal(geometryContainsPoint(withHole,{lat:2,lng:2}),false);
  assert.equal(geometryContainsPoint(withHole,{lat:1,lng:2}),false);
  assert.equal(geometryContainsPoint({type:'MultiPolygon',coordinates:[[square],[[[10,10],[12,10],[12,12],[10,12],[10,10]]]]},{lat:11,lng:11}),true);
});

test('geometry collections and point features support exact location selection',()=>{
  const point=feature({type:'Point',coordinates:[2,2]});
  const collection=feature({type:'GeometryCollection',geometries:[polygon]});
  assert.equal(geometryContainsPoint(point.geometry,{lat:2,lng:2}),true);
  assert.equal(geometryContainsPoint(collection.geometry,{lat:3,lng:3}),true);
  assert.deepEqual(filterFeaturesContainingPoint([point,collection],{lat:2,lng:2}),[point,collection]);
  assert.deepEqual(filterFeaturesContainingPoint([point],{lat:91,lng:0}),[]);
});
