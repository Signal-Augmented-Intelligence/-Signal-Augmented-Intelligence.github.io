import type { Metadata } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { PersonName } from '@/components/PersonName';
import { Section } from '@/components/Section';
import { getPeople, getPublications, PUBLICATION_TYPES } from '@/lib/content';
import { formatDate } from '@/lib/format';
import styles from './publication.module.css';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return getPublications().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const pub = getPublications().find((p) => p.slug === slug);
  return pub ? { title: pub.title, description: pub.excerpt } : {};
}

export default async function PublicationPage({ params }: Params) {
  const { slug } = await params;
  const pub = getPublications().find((p) => p.slug === slug);
  if (!pub) notFound();
  const people = getPeople();
  const type = PUBLICATION_TYPES.find((t) => t.id === pub.type);

  return (
    <>
      <PageHeader title={pub.title} lede={pub.title_ko ? <span lang="ko">{pub.title_ko}</span> : undefined} back={<Link href="/research/publications/">Back to Publications</Link>} />
      <Section id="details" title="Details">
        <dl className={styles.details}>
          <dt>Authors</dt>
          <dd>{pub.authors.map((a, i) => <Fragment key={a + i}>{i > 0 && ', '}<PersonName name={a} people={people} /></Fragment>)}</dd>
          <dt>Venue</dt><dd>{pub.venue}</dd>
          <dt>Type</dt><dd>{type?.label ?? pub.type}</dd>
          <dt>Date</dt><dd className="num">{formatDate(pub.pub_date)}</dd>
          {pub.status && <><dt>Status</dt><dd>{pub.status}</dd></>}
          {pub.award && <><dt>Award</dt><dd>{pub.award}</dd></>}
          {pub.links.length > 0 && <><dt>Links</dt><dd className={styles.links}>{pub.links.map((l) => <a key={l.url} href={l.url}>{l.label}</a>)}</dd></>}
        </dl>
      </Section>
      {pub.figure && (
        <Section id="figure" title="Figure">
          <figure className={styles.figure}>
            <img src={pub.figure} alt={pub.figure_alt} />
            {pub.figure_caption && <figcaption>{pub.figure_caption}</figcaption>}
          </figure>
        </Section>
      )}
      {pub.html && (
        <Section id="overview" title="Overview">
          <div className="prose" dangerouslySetInnerHTML={{ __html: pub.html }} />
        </Section>
      )}
    </>
  );
}
