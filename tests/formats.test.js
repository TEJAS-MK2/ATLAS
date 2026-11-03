import test from 'node:test';
import assert from 'node:assert/strict';
import {exportSpatialFile,parseSpatialFile} from '../src/formats.js';

test('CSV export records coordinate rows with escaped feature names',()=>{
 const features=[{type:'Feature',properties:{name:'River, east'},geometry:{type:'LineString',coordinates:[[88,22],[89,23]]}}];
 const result=exportSpatialFile(features,'csv');
 assert.match(result.content,/feature_name,geometry_type,vertex_index,longitude,latitude/);
 assert.match(result.content,/"River, east"/);
 assert.match(result.notice,/topology/);
});

test('CSV export round-trips feature_name and neutralizes spreadsheet formulas',()=>{
 const name='=1+1';
 const feature={type:'Feature',properties:{name},geometry:{type:'Point',coordinates:[88,22]}};
 const exported=exportSpatialFile([feature],'csv');
 assert.ok(exported.content.includes("\"'=1+1\""));
 const imported=parseSpatialFile('roundtrip.csv',exported.content);
 assert.equal(imported.features[0].properties.name,"'"+name);
});

test('KML export emits escaped names and polygon rings',()=>{
 const result=exportSpatialFile([{type:'Feature',properties:{name:'Park & lake'},geometry:{type:'Polygon',coordinates:[[[0,0],[1,0],[1,1],[0,0]]]}}],'kml');
 assert.match(result.content,/Park &amp; lake/);
 assert.match(result.content,/<Polygon>/);
 assert.match(result.content,/<outerBoundaryIs>/);
});

test('GPX export maps points and lines into waypoint and track elements',()=>{
 const result=exportSpatialFile([{type:'Feature',properties:{name:'Start'},geometry:{type:'Point',coordinates:[88,22]}},{type:'Feature',properties:{name:'Trail'},geometry:{type:'LineString',coordinates:[[88,22],[89,23]]}}],'gpx');
 assert.match(result.content,/<wpt lat="22" lon="88">/);
 assert.match(result.content,/<trk><name>Trail<\/name>/);
 assert.match(result.notice,/Polygon rings/);
});

test('JSON file dispatch remains supported and unsupported formats fail clearly',()=>{
 const collection={type:'FeatureCollection',features:[]};
 assert.deepEqual(parseSpatialFile('sample.geojson',JSON.stringify(collection)),collection);
 assert.throws(()=>parseSpatialFile('sample.zip',''),/Unsupported file format/);
});
