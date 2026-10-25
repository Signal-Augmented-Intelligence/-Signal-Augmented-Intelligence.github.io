import { Fragment } from 'react';
import { type Person, type Publication } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { PersonName } from './PersonName';
import styles from './Items.module.css';

/**
 * One publication in three short lines: title, authors, then venue and date.
 * The title opens the published article (DOI, KCI …) or, for a conference paper not in a journal, its PDF.
 * Type, status and awards stay in the data only.
 */
export function PublicationItem({ pub, people }: { pub: Publication; people: Person[] }) {
  return (
    <li className={styles.item}>
      <p className={styles.title}>{pub.href ? <a href={pub.href}>{pub.title}</a> : pub.title}</p>
      <p className={styles.authors}>
        {pub.authors.map((a, i) => (
          <Fragment key={a + i}>{i > 0 && ', '}<span className="nowrap"><PersonName name={a} people={people} linkFaculty={false} /></span></Fragment>
        ))}
      </p>
      <p className={styles.venue}>
        <em>{pub.venue}</em>, <span className="num">{formatDate(pub.pub_date)}</span>
        {pub.href && <a className={styles.link} href={pub.href}>{pub.hrefLabel}</a>}
      </p>
    </li>
  );
}
