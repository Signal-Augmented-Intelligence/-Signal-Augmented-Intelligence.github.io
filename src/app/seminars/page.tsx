import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { getSeminars } from '@/lib/content';
import { SeminarsExplorer } from './SeminarsExplorer';

export const metadata: Metadata = { title: 'Seminars', description: 'Seminar slides from SAI Lab.' };

export default function SeminarsPage() {
  return (
    <>
      <PageHeader title="Seminars" lede="Slides from lab seminars" />
      <div className="container">
        <SeminarsExplorer seminars={getSeminars()} />
      </div>
    </>
  );
}
