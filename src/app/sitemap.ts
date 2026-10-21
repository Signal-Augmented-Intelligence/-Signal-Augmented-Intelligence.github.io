import type { MetadataRoute } from 'next';
import { getPublications, getResearchAreas } from '@/lib/content';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/members/professor/', '/members/our-team/', '/members/alumni/', '/research/', '/research/publications/', '/seminars/', '/news/'];
  return [
    ...pages,
    ...getResearchAreas().map((a) => `/research/${a.slug}/`),
    ...getPublications().map((p) => p.url),
  ].map((path) => ({ url: `${SITE_URL}${path}` }));
}
