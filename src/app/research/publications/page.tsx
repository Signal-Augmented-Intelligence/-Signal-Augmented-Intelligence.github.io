import type { Metadata } from 'next';
import itemStyles from '@/components/Items.module.css';
import { PageHeader } from '@/components/PageHeader';
import { PublicationItem } from '@/components/PublicationItem';
import { getPeople, getPublications, PUBLICATION_TYPES } from '@/lib/content';
import { RESEARCH_LEDE, RESEARCH_TABS } from '@/lib/site';
import { PublicationFilter } from './PublicationFilter';
import styles from './publications.module.css';

export const metadata: Metadata = { title: 'Publications', description: 'Journal articles, conference papers, and conference posters from SAI Lab.' };

export default function PublicationsPage() {
  const people = getPeople();
  const publications = getPublications();
  const years = [...new Set(publications.map((p) => p.pub_date.slice(0, 4)))];
  const options = PUBLICATION_TYPES
    .map((t) => ({ id: t.id, title: t.title, count: publications.filter((p) => p.type === t.id).length }))
    .filter((o) => o.count > 0);

  return (
    <>
      <PageHeader title="Research" lede={RESEARCH_LEDE} tabs={RESEARCH_TABS} />
      <div className="container">
        <PublicationFilter options={options} total={publications.length}>
          <div className={styles.layout}>
            <nav className={styles.years} aria-label="Years">
              {years.map((y) => <a key={y} href={`#y${y}`} className="num">{y}</a>)}
            </nav>
            <div>
              {years.map((y) => (
                <section key={y} id={`y${y}`} data-year={y} className={styles.year}>
                  <h2 className={`${styles.yearTitle} num`}>{y}</h2>
                  <ol className={itemStyles.list}>
                    {publications.filter((p) => p.pub_date.startsWith(y)).map((p) => <PublicationItem key={p.url} pub={p} people={people} />)}
                  </ol>
                </section>
              ))}
            </div>
          </div>
        </PublicationFilter>
      </div>
    </>
  );
}
