import test from 'node:test';
import assert from 'node:assert/strict';
import {exportSpatialFile,parseSpatialFile} from '../src/formats.js';

test('CSV export quotes feature names and neutralizes spreadsheet formulas',()=>{
 const features=[{type:'Feature',properties:{name:'=HYPERLINK("https://example.test","open")'},geometry:{type:'Point',coordinates:[88,22]}}];
 const result=exportSpatialFile(features,'csv');
 assert.match(result.content,/feature_name,geometry_type,vertex_index,longitude,latitude/);
 assert.match(result.content,/"'=HYPERLINK/);
 assert.match(result.notice,/neutralized/);
});

test('CSV export and import round-trip the exported feature_name column',()=>{
 const features=[{type:'Feature',properties:{name:'River, east'},geometry:{type:'LineString',coordinates:[[88,22],[89,23]]}}];
 const csv=exportSpatialFile(features,'csv').content;
 const imported=parseSpatialFile('roundtrip.csv',csv);
 assert.equal(imported.features.length,2);
 assert.deepEqual(imported.features.map(item=>item.properties.name),['River, east','River, east']);
 assert.deepEqual(imported.features.map(item=>item.geometry.coordinates),[[88,22],[89,23]]);
});

test('CSV formula neutralization survives an import round trip as literal text',()=>{
 const source=[{type:'Feature',properties:{name:'+SUM(1,2)'},geometry:{type:'Point',coordinates:[1,2]}}];
 const csv=exportSpatialFile(source,'csv').content;
 const imported=parseSpatialFile('formula.csv',csv);
 assert.equal(imported.features[0].properties.name,"'+SUM(1,2)");
});

test('CSV import rejects incomplete and invalid coordinate rows instead of silently dropping data',()=>{
 assert.throws(()=>parseSpatialFile('incomplete.csv','name,latitude,longitude\\nMissing longitude,22.5,\\n'),/CSV row 2 is missing latitude or longitude/);
 assert.throws(()=>parseSpatialFile('invalid.csv','name,latitude,longitude\\nOutside,91,88\\n'),/CSV row 2 contains invalid coordinates/);
});

test('KML export emits escaped names, polygon rings and ATLAS geometry metadata',()=>{
 const result=exportSpatialFile([{type:'Feature',properties:{name:'Park & lake'},geometry:{type:'MultiPolygon',coordinates:[[[[0,0],[1,0],[1,1],[0,0]]],[[[2,2],[3,2],[3,3],[2,2]]]]}}],'kml');
 assert.match(result.content,/Park &amp; lake/);
 assert.match(result.content,/<Polygon>/);
 assert.match(result.content,/<outerBoundaryIs>/);
 assert.match(result.content,/<Data name="atlasGeometryType"><value>MultiPolygon<\/value><\/Data>/);
 assert.match(result.notice,/ATLAS round trips/);
});

test('GPX export maps points and lines into waypoint and track elements',()=>{
 const result=exportSpatialFile([{type:'Feature',properties:{name:'Start'},geometry:{type:'Point',coordinates:[88,22]}},{type:'Feature',properties:{name:'Trail'},geometry:{type:'LineString',coordinates:[[88,22],[89,23]]}}],'gpx');
 assert.match(result.content,/<wpt lat="22" lon="88">/);
 assert.match(result.content,/<trk><name>Trail<\/name>/);
 assert.match(result.notice,/Polygon rings/);
});

test('GeometryCollection CSV export handles more than 65,536 positions without spread calls',()=>{
 const coordinates=Array.from({length:70000},(_,i)=>[i/1000,0]);
 const collection=[{type:'Feature',properties:{name:'Large collection'},geometry:{type:'GeometryCollection',geometries:[{type:'LineString',coordinates}]}}];
 const result=exportSpatialFile(collection,'csv');
 assert.equal(result.content.split('\n').length,70001);
});

test('JSON file dispatch remains supported and unsupported formats fail clearly',()=>{
 const collection={type:'FeatureCollection',features:[]};
 assert.deepEqual(parseSpatialFile('sample.geojson',JSON.stringify(collection)),collection);
 assert.throws(()=>parseSpatialFile('sample.zip',''),/Unsupported file format/);
});
