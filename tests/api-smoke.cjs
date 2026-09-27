// Run against an already-started local server. Uses no authenticated session or successful write request.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=process.env.TEST_BASE_URL || 'http://localhost:3000';
const root=path.join(__dirname,'../src/app/api');
const routes=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(entry.name==='route.ts'){const source=fs.readFileSync(file,'utf8');for(const match of source.matchAll(/export\s+(?:async\s+function|const)\s+(GET|POST|PATCH|DELETE|PUT)\b/g))routes.push({route:'/api/'+path.relative(root,dir).replace('[id]','audit-missing-record'),method:match[1]});}}}
walk(root);
(async()=>{let count=0;
for(const {route,method} of routes){
 const init={method,signal:AbortSignal.timeout(20000)};
 if(['POST','PATCH','PUT'].includes(method)){init.headers={'Content-Type':'application/json'};init.body='{}';}
 const response=await fetch(base+route,init);
 const json=await response.json();
 const protectedRoute=/^\/api\/(favorites|itinerar(?:y\/|ies\/)|user(?:\/|$))/.test(route);
 const expected=protectedRoute?401:/^\/api\/(test(?:-email|-itinerary)?|seed-collections)$/.test(route)?404:((route==='/api/esim'&&method==='GET')||route==='/api/logout')?200:400;
 assert.equal(response.status,expected,`${method} ${route}: ${JSON.stringify(json)}`);
 count++;
}
for(const route of ['/api/generate-itinerary','/api/generate-itinerary-stream','/api/contact','/api/hotel-details','/api/hotels','/api/hotels-real','/api/esim']){
 const r=await fetch(base+route,{method:'POST',headers:{'Content-Type':'application/json'},body:'{bad',signal:AbortSignal.timeout(10000)});assert.equal(r.status,400,route);assert.equal((await r.json()).code,'INVALID_JSON');count++;
}
for(const route of ['/api/generate-itinerary','/api/generate-itinerary-stream']){
 const r=await fetch(base+route,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({destination:'Tokyo',startDate:'2026-10-03',endDate:'2026-10-01'})});assert.equal(r.status,400);count++;
}
const hotel=await fetch(base+'/api/hotels-real',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({destination:'Tokyo, Japan',startDate:'2026-10-01',endDate:'2026-10-03',guestNationality:'MY',adults:2})});assert.equal(hotel.status,200);const hotels=await hotel.json();assert.ok(Array.isArray(hotels.hotels));assert.equal(hotels.availabilityVerified,!hotels.sandbox);count++;
console.log(`${count} API contract checks passed (${routes.length} route/method combinations).`);
})().catch(error=>{console.error(error);process.exitCode=1;});
