import Link from 'next/link';
import { Fragment } from 'react';
import { type Person, type Publication } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { PersonName } from './PersonName';
import styles from './Items.module.css';

/**
 * One publication in three short lines: title, authors, then venue and date with text links.
 * Type, status and awards stay in the data and on the detail page, not in lists.
 */
export function PublicationItem({ pub, people }: { pub: Publication; people: Person[] }) {
  return (
    <li className={styles.item}>
      <p className={styles.title}><Link href={pub.url}>{pub.title}</Link></p>
      <p className={styles.authors}>
        {pub.authors.map((a, i) => (
          <Fragment key={a + i}>{i > 0 && ', '}<PersonName name={a} people={people} linkFaculty={false} /></Fragment>
        ))}
      </p>
      <p className={styles.venue}>
        <em>{pub.venue}</em>, <span className="num">{formatDate(pub.pub_date)}</span>
        {pub.links.map((l) => <a key={l.url} className={styles.link} href={l.url}>{l.label}</a>)}
      </p>
    </li>
  );
}
