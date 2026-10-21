import type { Metadata } from 'next';
import itemStyles from '@/components/Items.module.css';
import { PageHeader } from '@/components/PageHeader';
import { PublicationItem } from '@/components/PublicationItem';
import { Section } from '@/components/Section';
import { getPeople, getPublications, PUBLICATION_TYPES } from '@/lib/content';
import { RESEARCH_TABS } from '@/lib/site';

export const metadata: Metadata = { title: 'Publications', description: 'Journal articles, conference papers, and conference posters from SAI Lab.' };

export default function PublicationsPage() {
  const people = getPeople();
  const publications = getPublications();
  const groups = PUBLICATION_TYPES.map((t) => ({ ...t, items: publications.filter((p) => p.type === t.id) })).filter((g) => g.items.length > 0);
  return (
    <>
      <PageHeader title="Research" tabs={RESEARCH_TABS} />
      {groups.map((g) => (
        <Section key={g.id} id={g.id} title={g.title} aside={<span className="muted">{g.items.length}</span>}>
          <ol className={itemStyles.list}>{g.items.map((p) => <PublicationItem key={p.url} pub={p} people={people} />)}</ol>
        </Section>
      ))}
    </>
  );
}
