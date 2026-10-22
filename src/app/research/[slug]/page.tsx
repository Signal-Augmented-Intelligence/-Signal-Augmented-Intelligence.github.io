import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import itemStyles from '@/components/Items.module.css';
import { PageHeader } from '@/components/PageHeader';
import { PublicationItem } from '@/components/PublicationItem';
import { Section } from '@/components/Section';
import { SeminarItem } from '@/components/SeminarItem';
import { getPeople, getPublications, getResearchAreas, getSeminars } from '@/lib/content';
import styles from '../research.module.css';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return getResearchAreas().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const area = getResearchAreas().find((a) => a.slug === slug);
  return area ? { title: area.title, description: area.summary } : {};
}

export default async function ResearchAreaPage({ params }: Params) {
  const { slug } = await params;
  const area = getResearchAreas().find((a) => a.slug === slug);
  if (!area) notFound();
  const people = getPeople();
  const all = getPublications();
  const publications = area.publications.map((u) => all.find((p) => p.url === u)).filter((p) => p !== undefined);
  const seminars = getSeminars().filter((s) => s.topics.includes(area.slug));

  return (
    <>
      <PageHeader title={area.title} lede={area.summary} back={<Link href="/research/">Back to Research Areas</Link>} />
      {area.figure && (
        <figure className={`container ${styles.detailFigure}`}>
          <img src={area.figure} alt={area.figure_alt} />
          {area.figure_caption && <figcaption>{area.figure_caption}</figcaption>}
        </figure>
      )}
      {area.html && (
        <Section id="overview" title="Overview">
          <div className="prose" dangerouslySetInnerHTML={{ __html: area.html }} />
        </Section>
      )}
      {publications.length > 0 && (
        <Section id="related-publications" title="Related Publications">
          <ol className={itemStyles.list}>{publications.map((p) => <PublicationItem key={p.url} pub={p} people={people} />)}</ol>
        </Section>
      )}
      {seminars.length > 0 && (
        <Section id="related-seminars" title="Related Seminars">
          <ol className={itemStyles.list}>{seminars.map((s) => <SeminarItem key={s.date + s.title} seminar={s} people={people} showTerm />)}</ol>
        </Section>
      )}
    </>
  );
}
