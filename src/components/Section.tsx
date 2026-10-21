import type { ReactNode } from 'react';
import styles from './Section.module.css';

/**
 * A content block with its heading in a left label column (PC) and content on the right.
 * `aside` sits under the heading, e.g. a "View all" link.
 */
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
