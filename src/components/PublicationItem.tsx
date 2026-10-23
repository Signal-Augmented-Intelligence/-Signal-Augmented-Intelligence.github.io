import Link from 'next/link';
import { Fragment } from 'react';
import { type Person, type Publication, PUBLICATION_TYPES } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { PersonName } from './PersonName';
import styles from './Items.module.css';

/**
 * One publication: title, authors, venue and date, then a plain bold line for type / status
 * (labels are text, never coloured tags) and text links. Awards are not shown.
 */
export function PublicationItem({ pub, people }: { pub: Publication; people: Person[] }) {
  const type = PUBLICATION_TYPES.find((t) => t.id === pub.type)?.label ?? pub.type;
  const labels = [type, pub.status].filter(Boolean);
  return (
    <li className={styles.item} data-type={pub.type}>
      <p className={styles.title}><Link href={pub.url}>{pub.title}</Link></p>
      <p className={styles.authors}>
        {pub.authors.map((a, i) => (
          <Fragment key={a + i}>{i > 0 && ', '}<PersonName name={a} people={people} linkFaculty={false} /></Fragment>
        ))}
      </p>
      <p className={styles.venue}>{pub.venue}, <span className="num">{formatDate(pub.pub_date)}</span></p>
      <p className={styles.labels}>
        {labels.map((l) => <span key={l}>{l}</span>)}
        {pub.links.map((l) => <a key={l.url} href={l.url}>{l.label}</a>)}
      </p>
    </li>
  );
}
