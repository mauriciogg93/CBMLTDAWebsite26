// robots.txt as an endpoint: it reads the site URL from the Astro config,
// so there is nothing to maintain when the domain changes.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const cuerpo = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${new URL('sitemap-index.xml', site).href}`,
    '',
  ].join('\n');

  return new Response(cuerpo, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
