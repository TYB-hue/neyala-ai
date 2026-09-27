const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const Scraper = require('../scripts/hotel_scraper_booking');
function offers(price, name = 'Example Hotel', link = 'https://www.booking.com/hotel/it/example.html') {
  const elements = {
    '[data-testid="title"]': {textContent: name},
    '[data-testid="price-and-discounted-price"]': {textContent: price},
    'a[data-testid="title-link"]': {href: link},
  };
  return JSON.parse(JSON.stringify(vm.runInNewContext(`(${Scraper.extractOffers.toString()})(10)`, {URL, document: {querySelectorAll: () => [{querySelector: selector => elements[selector]}]}})));
}
test('hotel search preserves dates and occupancy and requires a checkout', () => {
  const s = new Scraper();
  const u = new URL(s.buildSearchUrl('Rome, Italy','2026-10-03','2026-10-06',1));
  assert.equal(u.searchParams.get('checkin'),'2026-10-03');
  assert.equal(u.searchParams.get('checkout'),'2026-10-06');
  assert.equal(u.searchParams.get('group_adults'),'1');
  assert.throws(() => s.buildSearchUrl('Rome'));
});
test('scraped price remains the stay total; missing ratings and photos are not invented', () => {
  const [hotel] = offers('US$ 1,234.56');
  assert.equal(hotel.totalPrice,1234.56);
  assert.equal(hotel.priceBasis,'stay');
  assert.equal(hotel.rating,0);
  assert.deepEqual(hotel.images,[]);
});
test('missing prices, unsupported currencies and unrelated booking URLs are rejected', () => {
  for(const price of ['', 'Sold out', '€ 125', 'US$ 0']) assert.equal(offers(price).length,0);
  assert.equal(offers('US$ 125','Hotel','https://example.com/hotel/it/a').length,0);
  assert.equal(offers('US$ 125','').length,0);
});
