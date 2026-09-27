const puppeteer = require('puppeteer');

// Runs in the page as well as against DOM fixtures. Never invent missing offer data.
function extractOffers(maxHotels) {
  return [...document.querySelectorAll('[data-testid="property-card"]')].slice(0, maxHotels).flatMap(card => {
    const text = selector => card.querySelector(selector)?.textContent?.trim() || '';
    const name = text('[data-testid="title"]');
    const priceText = text('[data-testid="price-and-discounted-price"]');
    const link = card.querySelector('a[data-testid="title-link"]')?.href;
    // Only accept the requested USD currency; this is the displayed stay total.
    const amount = priceText.match(/(?:US\$|USD|\$)\s*([\d,]+(?:\.\d{1,2})?)/);
    const total = amount ? Number(amount[1].replace(/,/g, '')) : 0;
    if (!name || !link || !Number.isFinite(total) || total <= 0) return [];
    const url = new URL(link);
    if (url.protocol !== 'https:' || !/(^|\.)booking\.com$/.test(url.hostname) || !url.pathname.startsWith('/hotel/')) return [];
    const image = card.querySelector('img[data-testid="image"], img[src*="bstatic.com"]');
    const score = text('[data-testid="review-score"]').match(/(?:Scored\s*)?(\d+(?:\.\d+)?)\s*(?:out of 10)?/i);
    const rating = score ? Number(score[1]) : 0;
    return [{ id: url.pathname, name, price: total, totalPrice: total, priceBasis: 'stay', priceText, currency: 'USD', rating: rating <= 10 ? rating : 0, stars: 0, images: image?.src ? [image.src] : [], bookingUrl: url.toString(), address: text('[data-testid="address"]'), location: {lat: 0,lng: 0}, amenities: [], description: text('[data-testid="price-for-x-nights"]'), taxNote: text('[data-testid="taxes-and-charges"]'), scrapedAt: new Date().toISOString(), source: 'Booking.com' }];
  });
}
class BookingHotelScraper {
  buildSearchUrl(destination, checkin, checkout, adults = 2) {
    if (!checkin || !checkout || checkout <= checkin) throw new Error('Valid travel dates are required.');
    return 'https://www.booking.com/searchresults.html?' + new URLSearchParams({ss: destination, checkin, checkout, group_adults: String(adults), group_children: '0', no_rooms: '1', selected_currency: 'USD', lang: 'en-us'});
  }
  async scrapeHotels(destination, maxHotels = 10, headless = true, _useApi = false, checkin, checkout, travelGroup = '') {
    const searchUrl = this.buildSearchUrl(destination, checkin, checkout, travelGroup === 'solo' ? 1 : 2);
    let browser;
    try {
      browser = await puppeteer.launch({headless, ...(process.env.PUPPETEER_EXECUTABLE_PATH ? {executablePath: process.env.PUPPETEER_EXECUTABLE_PATH} : {}), args: process.platform === 'linux' ? ['--disable-dev-shm-usage'] : []});
      const page = await browser.newPage();
      await page.setViewport({width: 1365, height: 900});
      await page.setExtraHTTPHeaders({'Accept-Language': 'en-US,en;q=0.9'});
      await page.goto(searchUrl, {waitUntil: 'domcontentloaded', timeout: 15000});
      await page.waitForSelector('[data-testid="property-card"]', {timeout: 7000}).catch(() => {});
      const title = await page.title();
      const body = await page.evaluate(() => document.body.innerText.slice(0, 4000));
      if (/captcha|verify you are human|verify.*robot|access denied|unusual traffic|security check|are you a robot/i.test(title + ' ' + body)) throw new Error('BOOKING_BLOCKED');
      const hotels = await page.evaluate(extractOffers, Math.min(maxHotels, 10));
      if (!hotels.length && !/no (properties|results)|0 properties found/i.test(body)) throw new Error('BOOKING_UNAVAILABLE');
      return hotels;
    } finally { if (browser) await browser.close(); }
  }
}
module.exports = BookingHotelScraper;
module.exports.extractOffers = extractOffers;
if (require.main === module) {
  new BookingHotelScraper().scrapeHotels(process.argv[2], Number(process.argv[3]) || 10, process.argv[4] !== 'false', false, process.argv[6], process.argv[7], process.argv[8])
    .then(hotels => console.log(JSON.stringify(hotels)))
    .catch(error => { console.error(/BOOKING_BLOCKED/.test(error.message) ? 'BOOKING_BLOCKED' : 'BOOKING_UNAVAILABLE'); process.exitCode = 1; });
}
