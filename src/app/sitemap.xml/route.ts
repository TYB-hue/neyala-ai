import { type MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const urls = ['/', '/plan', '/favorites', '/about', '/help', '/privacy', '/terms'];
 
  return urls.map((url) => ({
    loc: url,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: url === '/' ? 1.0 : 0.7,
  }));
}


