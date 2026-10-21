import Link from 'next/link';
import { Fragment } from 'react';
import type { Person, Publication } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { PersonName } from './PersonName';
import styles from './Items.module.css';

export function PublicationItem({ pub, people }: { pub: Publication; people: Person[] }) {
  const note = [pub.status, pub.award].filter(Boolean);
  return (
    <li className={styles.item}>
      <p className={styles.title}><Link href={pub.url}>{pub.title}</Link></p>
      <p className={styles.authors}>
        {pub.authors.map((a, i) => (
          <Fragment key={a + i}>{i > 0 && ', '}<PersonName name={a} people={people} /></Fragment>
        ))}
      </p>
      <p className={styles.meta}>{pub.venue}, <span className="num">{formatDate(pub.pub_date)}</span></p>
      {note.length > 0 && <p className={styles.note}>{note.join('. ')}</p>}
      {pub.links.length > 0 && (
        <p className={styles.links}>{pub.links.map((l) => <a key={l.url} href={l.url}>{l.label}</a>)}</p>
      )}
    </li>
  );
}
