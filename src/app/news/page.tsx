import type { Metadata } from 'next';
import { NewsList } from '@/components/NewsList';
import { PageHeader } from '@/components/PageHeader';
import { getNews } from '@/lib/content';

export const metadata: Metadata = { title: '뉴스', description: 'Awards, presentations, and publications from SAI Lab.' };

export default function NewsPage() {
  const news = getNews();
  return (
    <>
      <PageHeader title="뉴스" />
      <div className="container">
        {news.length === 0 ? <p className="muted">No news yet.</p> : (
          <DateList items={news.map((n) => {
            const href = target(n.link);
            const label = `Source: ${n.text}`;
            return { date: formatDate(n.date), content: <><strong>{n.text}</strong>{href && <> {href.startsWith('/') && !href.startsWith('/files/')
              ? <Link href={href} aria-label={label}>Source</Link>
              : <a href={href} aria-label={label}>Source</a>}</>}</> };
          })} />
        )}
      </div>
    </>
  );
}
