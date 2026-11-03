import test from 'node:test';
import assert from 'node:assert/strict';
import {diffObservedObjects,aggregateHistory,normalizeMonitorSettings} from '../src/atlas33.js';

test('change watch only reports IDs not present in the baseline',()=>{
 const baseline=new Set(['node/1','way/2']);
 const fresh=diffObservedObjects(baseline,[{id:'node/1'},{id:2,type:'way'},{id:'relation/3',name:'New park'}]);
 assert.deepEqual(fresh.map(x=>x.id),['relation/3']);
});
test('history analytics aggregate the last 24 hours and ignore older records',()=>{
 const now=Date.now();
 const result=aggregateHistory([
  {at:now-1000,type:'view',zoom:10,layer:'streets'},
  {at:now-2000,type:'view',zoom:14,layer:'satellite'},
  {at:now-3000,type:'route',distance:1200},
  {at:now-25*60*60*1000,type:'view',zoom:5,layer:'dark'}
 ],now);
 assert.equal(result.total,3);assert.equal(result.views,2);assert.equal(result.routes,1);
 assert.deepEqual(result.layers,['streets','satellite']);assert.equal(result.avgZoom,12);
});
test('monitor settings are clamped to supported radii and intervals',()=>{
 assert.deepEqual(normalizeMonitorSettings({radius:5000,interval:90,category:'hospital'}),{radius:5000,interval:60,category:'hospital'});
 assert.deepEqual(normalizeMonitorSettings({radius:123,interval:1,category:'script'}),{radius:1000,interval:2,category:'amenity'});
});
