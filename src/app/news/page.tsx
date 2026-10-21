import type { Metadata } from 'next';
import Link from 'next/link';
import { DateList } from '@/components/DateList';
import { PageHeader } from '@/components/PageHeader';
import { getNews } from '@/lib/content';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = { title: 'News', description: 'Awards, presentations, and publications from SAI Lab.' };

export default function NewsPage() {
  const news = getNews();
  return (
    <>
      <PageHeader title="News" />
      <div className="container">
        {news.length === 0 ? <p className="muted">No news yet.</p> : (
          <DateList items={news.map((n) => ({
            date: formatDate(n.date),
            content: <>{n.text}{n.link && <> <Link href={n.link}>Details</Link></>}</>,
          }))} />
        )}
      </div>
    </>
  );
}
