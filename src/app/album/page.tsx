import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { getAlbums } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { AlbumGrid } from './AlbumGrid';

export const metadata: Metadata = { title: 'Album', description: 'Photos from SAI Lab, Hanshin University.' };

export default function AlbumPage() {
  const albums = getAlbums();
  return (
    <>
      <PageHeader title="Album" />
      {albums.length === 0 && <p className="container muted">Photos will be posted here.</p>}
      {albums.map((a, i) => (
        <Section key={a.date + a.title} id={`album-${i + 1}`} title={a.title} aside={<span className="muted num">{formatDate(a.date)}</span>}>
          <AlbumGrid title={a.title} photos={a.photos} />
        </Section>
      ))}
    </>
  );
}
