import type { Metadata } from 'next';
import Link from 'next/link';
import { DateList } from '@/components/DateList';
import { PageHeader } from '@/components/PageHeader';
import { getNews, getPublications } from '@/lib/content';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = { title: 'News', description: 'Awards, presentations, and publications from SAI Lab.' };

export default function NewsPage() {
  const news = getNews();
  const publications = getPublications();
  /** A news link to a paper id (/publications/…/) opens the paper itself: article or PDF. Other links are used as written. */
  const target = (link: string) => (link.startsWith('/publications/') ? publications.find((p) => p.url === link)?.href ?? '' : link);
  return (
    <>
      <PageHeader title="News" />
      <div className="container">
        {news.length === 0 ? <p className="muted">No news yet.</p> : (
          <DateList items={news.map((n) => ({
            date: formatDate(n.date),
            content: <>{n.text}{target(n.link) && <> {target(n.link).startsWith('/') && !target(n.link).startsWith('/files/') ? <Link href={target(n.link)}>Details</Link> : <a href={target(n.link)}>Details</a>}</>}</>,
          }))} />
        )}
      </div>
    </>
  );
}
