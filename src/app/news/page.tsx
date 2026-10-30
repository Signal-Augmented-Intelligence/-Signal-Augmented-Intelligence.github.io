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
        {news.length === 0 ? <p className="muted">No news yet.</p> : <NewsList news={news} />}
      </div>
    </>
  );
}
