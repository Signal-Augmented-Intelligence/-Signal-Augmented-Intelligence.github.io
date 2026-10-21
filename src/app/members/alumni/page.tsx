import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { getPeople } from '@/lib/content';
import { MEMBERS_TABS } from '@/lib/site';
import styles from '../members.module.css';

export const metadata: Metadata = { title: 'Alumni', description: 'Alumni of SAI Lab, Hanshin University.' };

export default function AlumniPage() {
  const alumni = getPeople().filter((p) => p.group === 'alumni');
  return (
    <>
      <PageHeader title="Members" tabs={MEMBERS_TABS} />
      <div className="container">
        {alumni.length === 0 ? (
          <p className="muted">No alumni yet.</p>
        ) : (
          <ul className={styles.alumni}>
            {alumni.map((p) => (
              <li key={p.id} id={p.id}>
                <span className={styles.name}>{p.url ? <a href={p.url}>{p.name}</a> : p.name}</span>
                {p.name_ko && <span lang="ko" className={styles.nameKo}>{p.name_ko}</span>}
                <span className="muted">{p.after}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
