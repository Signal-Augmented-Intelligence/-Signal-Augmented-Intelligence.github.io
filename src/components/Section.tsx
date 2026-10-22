import type { ReactNode } from 'react';
import styles from './Section.module.css';

/** A content block: heading with an optional link on the right, a dark rule, then the content. */
export function Section({ id, title, aside, children }: { id?: string; title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className={`container ${styles.section}`}>
      <div className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        {aside && <div className={styles.aside}>{aside}</div>}
      </div>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
