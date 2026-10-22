import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { getLab, getPeople, getSeminars } from '@/lib/content';
import { UploadForm } from './UploadForm';

export const metadata: Metadata = { title: 'Seminar Upload', robots: { index: false, follow: false } };

export default function UploadPage() {
  const lab = getLab();
  const people = getPeople();
  const presenters = [
    ...people.filter((p) => p.group !== 'alumni'),
    ...people.filter((p) => p.group === 'alumni'),
  ].map((p) => ({ id: p.id, label: `${p.name}${p.name_ko ? ` | ${p.name_ko}` : ''}${p.group === 'alumni' ? ' (Alumni)' : ''}` }));
  const areas = [...new Set(getSeminars().map((seminar) => seminar.area).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  return (
    <>
      <PageHeader title="Seminar Upload" lede={<span lang="ko">올린 자료는 관리자 확인 후 Seminars 페이지에 반영됩니다.</span>} />
      <div className="container">
        <UploadForm endpoint={lab.upload_endpoint} presenters={presenters} areas={areas} />
      </div>
    </>
  );
}
