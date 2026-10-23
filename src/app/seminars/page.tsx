import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { getPeople, getSeminars } from '@/lib/content';
import { SeminarsExplorer } from './SeminarsExplorer';

export const metadata: Metadata = { title: 'Seminars', description: 'Seminar slides from SAI Lab.' };

/** Adds the presenter's English and Korean names so the search can find them (the data stores a people.yml id). */
function withPresenterNames() {
  const people = getPeople();
  return getSeminars().map((s) => {
    const person = people.find((p) => p.id === s.presenter);
    return { ...s, presenterNames: person ? `${person.name} ${person.name_ko}` : s.presenter };
  });
}

export default function SeminarsPage() {
  return (
    <>
      <PageHeader title="Seminars" lede="Slides from lab seminars" />
      <div className="container">
        <SeminarsExplorer seminars={withPresenterNames()} />
      </div>
    </>
  );
}
