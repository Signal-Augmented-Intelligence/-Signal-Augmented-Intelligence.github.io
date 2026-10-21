import type { ReactNode } from 'react';
import styles from './DateList.module.css';

/** Two-column list: a date or period on the left, the entry on the right. */
export function DateList({ items }: { items: { date: string; content: ReactNode; note?: string }[] }) {
  return (
    <ul className={styles.list}>
      {items.map((item, i) => (
        <li key={i} className={styles.row}>
          <span className={`${styles.date} num`}>{item.date}</span>
          <span>
            {item.content}
            {item.note && <span className={styles.note}>{item.note}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}
