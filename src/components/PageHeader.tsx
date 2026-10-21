import type { ReactNode } from 'react';
import type { NavItem } from '@/lib/site';
import { NavLinks } from './NavLinks';
import styles from './PageHeader.module.css';

/** Page title, optional one-line description, and optional section tabs. */
export function PageHeader({ title, lede, tabs, back }: { title: string; lede?: ReactNode; tabs?: NavItem[]; back?: ReactNode }) {
  return (
    <div className={styles.wrap}>
      <div className="container">
        {back && <p className={styles.back}>{back}</p>}
        <h1 className={styles.title}>{title}</h1>
        {lede && <p className={styles.lede}>{lede}</p>}
        {tabs && (
          <nav aria-label={`${title} sections`}>
            <NavLinks items={tabs} className={styles.tabs} linkClassName={styles.tab} />
          </nav>
        )}
      </div>
    </div>
  );
}
