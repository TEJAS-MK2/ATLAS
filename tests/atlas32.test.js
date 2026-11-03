import test from 'node:test';
import assert from 'node:assert/strict';
import {summarizeFeatures,normalizeWorkspace} from '../src/atlas32.js';

test('spatial analytics summarize geometry counts, line length, polygon area and bounds',()=>{
  const features=[
    {type:'Feature',properties:{name:'Road'},geometry:{type:'LineString',coordinates:[[0,0],[0,1]]}},
    {type:'Feature',properties:{name:'Park'},geometry:{type:'Polygon',coordinates:[[[0,0],[1,0],[1,1],[0,1],[0,0]]]}},
    {type:'Feature',properties:{name:'Pin'},geometry:{type:'Point',coordinates:[2,2]}}
  ];
  const result=summarizeFeatures(features);
  assert.equal(result.total,3);
  assert.equal(result.counts.LineString,1);
  assert.equal(result.counts.Polygon,1);
  assert.equal(result.counts.Point,1);
  assert.ok(result.lengthMeters>500000);
  assert.ok(result.areaSquareMeters>1e10);
  assert.deepEqual(result.bounds,{south:0,west:0,north:2,east:2});
});

test('empty feature set has stable zero metrics',()=>{
  const result=summarizeFeatures();
  assert.equal(result.total,0);
  assert.equal(result.lengthMeters,0);
  assert.equal(result.areaSquareMeters,0);
  assert.equal(result.bounds,null);
});

test('workspace profiles are validated and normalized',()=>{
  const valid=normalizeWorkspace({id:'abc',name:'Field survey',center:[22.57,88.36],zoom:13,layer:'satellite',theme:'light',inspectorVisible:false});
  assert.deepEqual(valid,{id:'abc',name:'Field survey',center:[22.57,88.36],zoom:13,layer:'satellite',theme:'light',inspectorVisible:false});
  assert.equal(normalizeWorkspace({name:'Bad',center:[91,0],zoom:12,layer:'streets'}),null);
  assert.equal(normalizeWorkspace({name:'Bad',center:[0,0],zoom:25,layer:'streets'}),null);
  assert.equal(normalizeWorkspace({name:'Bad',center:[0,0],zoom:12,layer:'unknown'}),null);
});
