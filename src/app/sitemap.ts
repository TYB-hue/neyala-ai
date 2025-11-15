import { type MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const urls = ['/', '/plan', '/favorites', '/about', '/help', '/privacy', '/terms'];
 
  return urls.map((url) => ({
    url: url,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: url === '/' ? 1.0 : 0.7,
  }));
}

