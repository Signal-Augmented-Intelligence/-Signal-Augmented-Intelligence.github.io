import Link from 'next/link';
import { getPublications, type NewsItem } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { DateList } from './DateList';

/**
 * News entries as a date list. A link to a paper id (/publications/…/) opens the paper itself (article or PDF);
 * other links are used as written.
 */
export function NewsList({ news }: { news: NewsItem[] }) {
  const publications = getPublications();
  const target = (link: string) => (link.startsWith('/publications/') ? publications.find((p) => p.url === link)?.href ?? '' : link);
  return (
    <DateList wide items={news.map((n) => {
      const href = target(n.link);
      const label = `Details: ${n.text}`;
      return { date: formatDate(n.date), content: <>{n.text}{href && <> {href.startsWith('/') && !href.startsWith('/files/')
        ? <Link href={href} aria-label={label}>Details</Link>
        : <a href={href} aria-label={label}>Details</a>}</>}</> };
    })} />
  );
}
