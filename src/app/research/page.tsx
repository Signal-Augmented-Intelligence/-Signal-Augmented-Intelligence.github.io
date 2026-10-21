import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
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
      <ul className="container">
        {areas.map((a) => {
          const count = a.publications.filter((u) => publications.some((p) => p.url === u)).length;
          return (
            <li key={a.slug} id={a.slug} className={styles.area}>
              <p className={styles.count}>{count > 0 && `${count} ${count === 1 ? 'publication' : 'publications'}`}</p>
              <div>
                <h2 className={styles.title}><Link href={`/research/${a.slug}/`}>{a.title}</Link></h2>
                <p className={styles.summary}>{a.summary}</p>
                <p className={styles.more}><Link href={`/research/${a.slug}/`}>Read more</Link></p>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
