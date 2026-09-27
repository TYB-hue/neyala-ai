const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, file);
const { readItineraryStream } = require('../src/lib/itinerary-stream.ts');
const { itineraryRequestSchema } = require('../src/lib/itinerary-request.ts');
const { parseGroqJson } = require('../src/lib/schema-validation.ts');
const { apiError } = require('../src/lib/api-response.ts');
const { formatContactEmailHTML } = require('../src/lib/email-service.ts');
const sample = { destination: 'Tokyo, Japan', startDate: '2026-10-01', endDate: '2026-10-03' };
function stream(events, size=1) {
  const bytes = new TextEncoder().encode(events);
  return new Response(new ReadableStream({ start(c) { for(let i=0;i<bytes.length;i+=size)c.enqueue(bytes.slice(i,i+size)); c.close(); } }));
}
test('dates, required fields and types are validated', () => {
  assert.equal(itineraryRequestSchema.parse(sample).travelGroup,'solo');
  for(const overrides of [{destination:[]},{startDate:'2026-02-30'},{endDate:'2026-10-01'},{endDate:'2026-12-01'},{requirements:'halal'}]) assert.equal(itineraryRequestSchema.safeParse({...sample,...overrides}).success,false);
});
test('stream handles split JSON, CRLF and multibyte text', async () => {
  const data={destination:'東京',itineraries:[{day:1}]};
  const response=stream('data: {"status":"started"}\r\n\r\ndata: '+JSON.stringify({status:'completed',data})+'\r\n\r\n');
  assert.deepEqual(await readItineraryStream(response),data);
});
test('provider errors are surfaced rather than swallowed or retried', async () => {
  await assert.rejects(readItineraryStream(stream('data: {"status":"error","error":"Service unavailable"}\n\n')), /Service unavailable/);
});
test('truncated, malformed and empty streams fail clearly', async () => {
  for(const content of ['','data: {bad}\n\n','data: {"status":"generating"}\n\n']) await assert.rejects(readItineraryStream(stream(content)));
});
test('non-200 API error is preserved',async()=>{
  await assert.rejects(readItineraryStream(new Response(JSON.stringify({error:'Bad dates'}),{status:400})),/Bad dates/);
});
test('malformed request JSON maps to 400',async()=>{
  const response=apiError(new SyntaxError('secret parser details'));
  assert.equal(response.status,400); assert.equal((await response.json()).code,'INVALID_JSON');
});
test('contact HTML escapes untrusted fields',()=>{
  const html=formatContactEmailHTML({firstName:'<script>alert(1)</script>',lastName:'Test',email:'sample@example.com',subject:'Test',message:'<img src=x onerror=alert(1)>'});
  assert.ok(!html.includes('<script>')); assert.ok(html.includes('&lt;script&gt;'));
});
test('AI schema rejects incomplete data, invalid coordinates and negative costs',()=>{
  const activity={activity:'Senso-ji',description:'Visit temple',time:'09:00',location:{lat:35,lng:139}};
  const valid={destination:'Tokyo',dates:{start:'2026-10-01',end:'2026-10-02'},overview:{history:'History',culture:'Culture'},airport:{name:'Haneda',info:'Airport'},hotels:[],itineraries:[{day:1,date:'2026-10-02',title:'Tokyo',morning:activity,afternoon:activity,restaurant:{name:'Restaurant',cuisine:'Japanese',description:'Lunch'}}],transportation:[],estimatedCost:{accommodation:100,activities:20,transportation:10,food:30,total:160}};
  assert.equal(parseGroqJson(JSON.stringify(valid)).destination,'Tokyo');
  assert.throws(()=>parseGroqJson('{"destination":"Tokyo"}'));
  assert.throws(()=>parseGroqJson(JSON.stringify({...valid,estimatedCost:{...valid.estimatedCost,food:-1}})));
  const bad=JSON.parse(JSON.stringify(valid));bad.itineraries[0].morning.location.lat=100;
  assert.throws(()=>parseGroqJson(JSON.stringify(bad)));
});

const { normalizeLiteRates } = require('../src/lib/liteapi.ts');
test('LiteAPI joins metadata, keeps stay totals and sandbox status, and excludes package-only rates', () => {
 const offer = { offerRetailRate: { amount: 123.45, currency: 'USD' }, rateType: 'standard', rates: [{name: 'Double', retailRate: { taxesAndFees: [{included:false,description:'City tax',amount:5,currency:'USD'}] }}] };
 const data = { sandbox:true, hotels:[{id:'h1',name:'Real Hotel',main_photo:'https://static.cupid.travel/a.jpg'}], data:[{hotelId:'h1',roomTypes:[offer]}] };
 const [hotel] = normalizeLiteRates(data);
 assert.equal(hotel.name,'Real Hotel'); assert.equal(hotel.price,123.45); assert.equal(hotel.sandbox,true); assert.equal(hotel.bookingUrl,''); assert.match(hotel.taxNote,/5 USD extra/);
 assert.equal(normalizeLiteRates({...data,data:[{hotelId:'h1',roomTypes:[{...offer,rateType:'package'}]}]}).length,0);
 assert.equal(normalizeLiteRates({...data,hotels:[]}).length,0);
});
test('live hotel search rejects sandbox credentials before making a provider request', async () => {
 const previous = process.env.LITEAPI_API_KEY;
 process.env.LITEAPI_API_KEY = 'sandbox_test';
 try {
   const { searchLiteHotels } = require('../src/lib/liteapi.ts');
   await assert.rejects(searchLiteHotels({destination:'Rome, Italy',startDate:'2026-10-03',endDate:'2026-10-06',adults:1,guestNationality:''}), error => error.code === 'HOTEL_PRODUCTION_REQUIRED');
 } finally { if (previous === undefined) delete process.env.LITEAPI_API_KEY; else process.env.LITEAPI_API_KEY = previous; }
});
