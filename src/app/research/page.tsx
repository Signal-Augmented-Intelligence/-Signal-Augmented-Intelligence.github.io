import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { getPublications, getResearchAreas } from '@/lib/content';
import { RESEARCH_TABS } from '@/lib/site';
import styles from './research.module.css';

export const metadata: Metadata = { title: 'Research Areas', description: 'Research areas at SAI Lab, Hanshin University.' };

export default function ResearchPage() {
  const areas = getResearchAreas();
  const publications = getPublications();
  return (
    <>
      <PageHeader title="Research" tabs={RESEARCH_TABS} />
      <Section id="areas" title="Research Areas">
        <ul className={styles.cards}>
          {areas.map((a) => {
            const count = a.publications.filter((u) => publications.some((p) => p.url === u)).length;
            return (
              <li key={a.slug} id={a.slug} className={styles.card}>
                <div className={styles.figure} aria-hidden={a.figure ? undefined : true}>
                  {a.figure && <img src={a.figure} alt={a.figure_alt} />}
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}><Link href={`/research/${a.slug}/`}>{a.title}</Link></h3>
                  <p className={styles.summary}>{a.summary}</p>
                  <p className={styles.foot}>
                    <Link href={`/research/${a.slug}/`}>Read more</Link>
                    {count > 0 && <span>{count} {count === 1 ? 'publication' : 'publications'}</span>}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}
