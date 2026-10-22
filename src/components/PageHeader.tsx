import type { ReactNode } from 'react';
import type { NavItem } from '@/lib/site';
import { NavLinks } from './NavLinks';
import styles from './PageHeader.module.css';

/** Navy page banner (title, one-line description, optional back link) and an optional tab bar under it. */
export function PageHeader({ title, lede, tabs, back }: { title: string; lede?: ReactNode; tabs?: NavItem[]; back?: ReactNode }) {
  return (
    <>
      <div className={styles.banner}>
        <div className="container">
          {back && <p className={styles.back}>{back}</p>}
          <h1 className={styles.title}>{title}</h1>
          {lede && <p className={styles.lede}>{lede}</p>}
        </div>
      </div>
      {tabs && (
        <nav className={styles.tabBar} aria-label={`${title} sections`}>
          <div className="container">
            <NavLinks items={tabs} className={styles.tabs} linkClassName={styles.tab} />
          </div>
        </nav>
      )}
      <div className={styles.gap} />
    </>
  );
}
