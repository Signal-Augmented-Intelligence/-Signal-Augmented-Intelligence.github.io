import type { Metadata } from 'next';
import itemStyles from '@/components/Items.module.css';
import { PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { SeminarItem } from '@/components/SeminarItem';
import { getPeople, getSeminars } from '@/lib/content';

export const metadata: Metadata = { title: 'Seminars', description: 'Seminar slides from SAI Lab.' };

export default function SeminarsPage() {
  const people = getPeople();
  const seminars = getSeminars();
  const terms = [...new Set(seminars.map((s) => s.term))];
  return (
    <>
      <PageHeader title="Seminars" lede="Slides from lab seminars" />
      {terms.length === 0 && <p className="container muted">No seminars have been posted yet.</p>}
      {terms.map((term) => (
        <Section key={term} id={term.toLowerCase().replace(/\s+/g, '-')} title={term}>
          <ol className={itemStyles.list}>
            {seminars.filter((s) => s.term === term).map((s) => <SeminarItem key={s.date + s.title} seminar={s} people={people} />)}
          </ol>
        </Section>
      ))}
    </>
  );
}
