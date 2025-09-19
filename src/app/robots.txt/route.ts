export function GET() {
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/sitemap.xml`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}


