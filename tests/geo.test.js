import test from 'node:test';import assert from 'node:assert/strict';import {haversine,formatDistance,validCoordinate,sanitizeName,featureCollection} from '../src/geo.js';
test('haversine returns zero for same point',()=>assert.equal(haversine({lat:0,lng:0},{lat:0,lng:0}),0));
test('haversine computes Kolkata to Delhi distance within tolerance',()=>{const d=haversine({lat:22.5726,lng:88.3639},{lat:28.6139,lng:77.209});assert.ok(d>1300000&&d<1320000)});
test('distance formatter handles metres and kilometres',()=>{assert.equal(formatDistance(420),'420 m');assert.equal(formatDistance(2500),'2.50 km');assert.equal(formatDistance(-1),'—')});
test('coordinate validator rejects out of range and non numeric values',()=>{assert.equal(validCoordinate(90,180),true);assert.equal(validCoordinate(91,0),false);assert.equal(validCoordinate('x',0),false)});
test('name sanitizer strips markup and limits length',()=>{assert.equal(sanitizeName(' <b>Park</b> '),'bPark/b');assert.equal(sanitizeName('x'.repeat(100)).length,80)});
test('feature collection has valid GeoJSON shape',()=>assert.deepEqual(featureCollection([]),{type:'FeatureCollection',features:[]}));
