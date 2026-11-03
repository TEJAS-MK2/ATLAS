import {validCoordinate} from './geo.js';

function xmlDocument(source){
  const doc=new DOMParser().parseFromString(source,'application/xml');
  if(doc.querySelector('parsererror'))throw new Error('The XML document is malformed.');
  return doc;
}
function descendants(node,name){
  const namespaced=Array.from(node.getElementsByTagNameNS?.('*',name)||[]);
  return namespaced.length?namespaced:Array.from(node.getElementsByTagName?.(name)||[]);
}
function localName(node){return String(node?.localName||node?.nodeName||'').split(':').pop();}
function firstDescendant(node,name){return descendants(node,name)[0]||null;}
function parseCoordinateText(value){
  return String(value||'').trim().split(/\s+/).map(token=>{
    const raw=token.split(',');if(raw.length<2||!raw[0].trim()||!raw[1].trim())return null;const parts=raw.map(Number),lng=parts[0],lat=parts[1];
    return validCoordinate(lat,lng)?[lng,lat]:null;
  }).filter(Boolean);
}
function closeRing(ring){
  if(ring.length<3)return [];
  const first=ring[0],last=ring[ring.length-1];
  return first[0]===last[0]&&first[1]===last[1]?ring:[...ring,[...first]];
}
function parseKmlGeometry(element){
  const type=localName(element);
  if(type==='MultiGeometry'){
    const geometries=Array.from(element.children).map(parseKmlGeometry).filter(Boolean);
    return geometries.length?{type:'GeometryCollection',geometries}:null;
  }
  if(type==='Point'){
    const coords=parseCoordinateText(firstDescendant(element,'coordinates')?.textContent);
    return coords.length?{type:'Point',coordinates:coords[0]}:null;
  }
  if(type==='LineString'){
    const coords=parseCoordinateText(firstDescendant(element,'coordinates')?.textContent);
    return coords.length>=2?{type:'LineString',coordinates:coords}:null;
  }
  if(type==='Polygon'){
    const outer=firstDescendant(element,'outerBoundaryIs');
    const outerRing=outer?closeRing(parseCoordinateText(firstDescendant(outer,'coordinates')?.textContent)):[];
    if(!outerRing.length)return null;
    const holes=descendants(element,'innerBoundaryIs').map(boundary=>closeRing(parseCoordinateText(firstDescendant(boundary,'coordinates')?.textContent))).filter(ring=>ring.length);
    return {type:'Polygon',coordinates:[outerRing,...holes]};
  }
  return null;
}
function parseKml(source){
  const doc=xmlDocument(source),features=[];
  for(const placemark of descendants(doc,'Placemark')){
    const geometryNode=Array.from(placemark.children).find(child=>['Point','LineString','Polygon','MultiGeometry'].includes(localName(child)));
    if(!geometryNode)continue;
    const geometry=parseKmlGeometry(geometryNode);
    if(geometry)features.push({type:'Feature',properties:{name:firstDescendant(placemark,'name')?.textContent?.trim()||'KML feature'},geometry});
  }
  return features;
}
function parseGpx(source){
  const doc=xmlDocument(source),features=[];
  for(const point of descendants(doc,'wpt')){
    const lat=Number(point.getAttribute('lat')),lng=Number(point.getAttribute('lon'));
    if(validCoordinate(lat,lng))features.push({type:'Feature',properties:{name:firstDescendant(point,'name')?.textContent?.trim()||'GPX waypoint'},geometry:{type:'Point',coordinates:[lng,lat]}});
  }
  for(const route of descendants(doc,'rte')){
    const coords=descendants(route,'rtept').map(point=>[Number(point.getAttribute('lon')),Number(point.getAttribute('lat'))]).filter(p=>validCoordinate(p[1],p[0]));
    if(coords.length>=2)features.push({type:'Feature',properties:{name:firstDescendant(route,'name')?.textContent?.trim()||'GPX route'},geometry:{type:'LineString',coordinates:coords}});
  }
  for(const track of descendants(doc,'trk')){
    const segments=descendants(track,'trkseg').map(segment=>descendants(segment,'trkpt').map(point=>[Number(point.getAttribute('lon')),Number(point.getAttribute('lat'))]).filter(p=>validCoordinate(p[1],p[0]))).filter(segment=>segment.length>=2);
    if(segments.length)features.push({type:'Feature',properties:{name:firstDescendant(track,'name')?.textContent?.trim()||'GPX track'},geometry:segments.length===1?{type:'LineString',coordinates:segments[0]}:{type:'MultiLineString',coordinates:segments}});
  }
  return features;
}
function parseCsvRows(source){
  const rows=[];let row=[],field='',quoted=false;
  for(let i=0;i<source.length;i++){
    const char=source[i];
    if(quoted){if(char==='"'&&source[i+1]==='"'){field+='"';i++;}else if(char==='"')quoted=false;else field+=char;continue;}
    if(char==='"'&&field===''){quoted=true;continue;}
    if(char===','){row.push(field);field='';continue;}
    if(char==='\n'||char==='\r'){if(char==='\r'&&source[i+1]==='\n')i++;row.push(field);field='';if(row.some(value=>value.trim()))rows.push(row);row=[];continue;}
    field+=char;
  }
  if(quoted)throw new Error('CSV contains an unterminated quoted field.');
  row.push(field);if(row.some(value=>value.trim()))rows.push(row);
  return rows;
}
function parseCsv(source){
  const rows=parseCsvRows(source);
  if(rows.length<2)throw new Error('CSV needs a header and at least one coordinate row.');
  const headers=rows[0].map(value=>value.trim().toLowerCase());
  const latIndex=headers.findIndex(value=>['lat','latitude','y'].includes(value));
  const lngIndex=headers.findIndex(value=>['lon','lng','long','longitude','x'].includes(value));
  if(latIndex<0||lngIndex<0)throw new Error('CSV needs latitude and longitude columns.');
  const nameIndex=headers.findIndex(value=>['name','title','label'].includes(value));
  const features=[];
  for(let i=1;i<rows.length;i++){
    const latText=String(rows[i][latIndex]??'').trim(),lngText=String(rows[i][lngIndex]??'').trim();if(!latText||!lngText)continue;const lat=Number(latText),lng=Number(lngText);
    if(!validCoordinate(lat,lng))continue;
    features.push({type:'Feature',properties:{name:nameIndex>=0&&rows[i][nameIndex]?.trim()?rows[i][nameIndex].trim():'CSV point '+i},geometry:{type:'Point',coordinates:[lng,lat]}});
  }
  if(!features.length)throw new Error('CSV contains no valid coordinate rows.');
  return features;
}
export function parseSpatialFile(filename,source){
  const extension=String(filename).split('.').pop().toLowerCase();
  if(extension==='json'||extension==='geojson')return JSON.parse(source);
  let features;
  if(extension==='kml')features=parseKml(source);
  else if(extension==='gpx')features=parseGpx(source);
  else if(extension==='csv')features=parseCsv(source);
  else throw new Error('Unsupported file format. Use GeoJSON, KML, GPX or CSV.');
  if(!features.length)throw new Error('No supported geospatial features were found in this file.');
  return {type:'FeatureCollection',features};
}
function xmlEscape(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));}
function coordinatesText(coords){return coords.map(p=>p[0]+','+p[1]+(p.length>2?','+p[2]:'')).join(' ');}
function kmlGeometry(geometry){
  if(!geometry)return '';
  if(geometry.type==='Point')return '<Point><coordinates>'+coordinatesText([geometry.coordinates])+'</coordinates></Point>';
  if(geometry.type==='MultiPoint')return '<MultiGeometry>'+geometry.coordinates.map(p=>kmlGeometry({type:'Point',coordinates:p})).join('')+'</MultiGeometry>';
  if(geometry.type==='LineString')return '<LineString><coordinates>'+coordinatesText(geometry.coordinates)+'</coordinates></LineString>';
  if(geometry.type==='MultiLineString')return '<MultiGeometry>'+geometry.coordinates.map(p=>kmlGeometry({type:'LineString',coordinates:p})).join('')+'</MultiGeometry>';
  if(geometry.type==='Polygon')return '<Polygon><outerBoundaryIs><LinearRing><coordinates>'+coordinatesText(geometry.coordinates[0]||[])+'</coordinates></LinearRing></outerBoundaryIs>'+(geometry.coordinates.slice(1).map(ring=>'<innerBoundaryIs><LinearRing><coordinates>'+coordinatesText(ring)+'</coordinates></LinearRing></innerBoundaryIs>').join(''))+'</Polygon>';
  if(geometry.type==='MultiPolygon')return '<MultiGeometry>'+geometry.coordinates.map(coordinates=>kmlGeometry({type:'Polygon',coordinates})).join('')+'</MultiGeometry>';
  if(geometry.type==='GeometryCollection')return '<MultiGeometry>'+geometry.geometries.map(kmlGeometry).join('')+'</MultiGeometry>';
  return '';
}
function collectPositions(geometry){
  const out=[],visit=value=>{if(!Array.isArray(value))return;if(typeof value[0]==='number'){if(validCoordinate(value[1],value[0]))out.push(value);return;}value.forEach(visit);};
  if(geometry?.type==='GeometryCollection')geometry.geometries.forEach(g=>out.push(...collectPositions(g)));
  else visit(geometry?.coordinates);
  return out;
}
function gpxElements(feature){
  const name=xmlEscape(feature.properties?.name||'ATLAS feature'),g=feature.geometry;
  if(!g)return '';
  const point=(p,tag)=>'<'+tag+' lat="'+p[1]+'" lon="'+p[0]+'"></'+tag+'>';
  if(g.type==='Point')return point(g.coordinates,'wpt').replace('</wpt>','<name>'+name+'</name></wpt>');
  if(g.type==='MultiPoint')return g.coordinates.map(p=>point(p,'wpt').replace('</wpt>','<name>'+name+'</name></wpt>')).join('');
  const segments=g.type==='LineString'?[g.coordinates]:g.type==='MultiLineString'?g.coordinates:g.type==='Polygon'?g.coordinates:g.type==='MultiPolygon'?g.coordinates.flat():[];
  if(segments.length)return '<trk><name>'+name+'</name>'+segments.filter(s=>s.length>=2).map(s=>'<trkseg>'+s.map(p=>point(p,'trkpt')).join('')+'</trkseg>').join('')+'</trk>';
  if(g.type==='GeometryCollection')return g.geometries.map(child=>gpxElements({type:'Feature',properties:feature.properties,geometry:child})).join('');
  return '';
}
export function exportSpatialFile(features,format){
  if(!Array.isArray(features)||!features.length)throw new Error('There is no active layer to export.');
  if(format==='geojson')return {content:JSON.stringify({type:'FeatureCollection',features},null,2),mime:'application/geo+json',notice:'GeoJSON preserves feature geometry and properties.'};
  if(format==='kml'){
    const placemarks=features.map(feature=>'<Placemark><name>'+xmlEscape(feature.properties?.name||'ATLAS feature')+'</name>'+kmlGeometry(feature.geometry)+'</Placemark>').join('');
    return {content:'<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document>'+placemarks+'</Document></kml>',mime:'application/vnd.google-earth.kml+xml',notice:'KML export complete.'};
  }
  if(format==='gpx'){
    const elements=features.map(gpxElements).join('');
    return {content:'<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" creator="ATLAS" xmlns="http://www.topografix.com/GPX/1/1">'+elements+'</gpx>',mime:'application/gpx+xml',notice:'GPX export complete. Polygon rings are exported as tracks.'};
  }
  if(format==='csv'){
    const quote=value=>'"'+String(value??'').replace(/"/g,'""')+'"';
    const rows=[['feature_name','geometry_type','vertex_index','longitude','latitude'].join(',')];
    for(const feature of features)collectPositions(feature.geometry).forEach((point,index)=>rows.push([quote(feature.properties?.name||'ATLAS feature'),quote(feature.geometry?.type||'Unknown'),index,point[0],point[1]].join(',')));
    return {content:rows.join('\n'),mime:'text/csv',notice:'CSV exports coordinate rows; geometry topology and properties are not preserved.'};
  }
  throw new Error('Unsupported export format.');
}
