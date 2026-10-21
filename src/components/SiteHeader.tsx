import Link from 'next/link';
import { getLab, hasContact } from '@/lib/content';
import { MAIN_NAV } from '@/lib/site';
import { NavLinks } from './NavLinks';
import { SignalMark } from './SignalMark';
import styles from './SiteHeader.module.css';

export function SiteHeader() {
  const lab = getLab();
  const items = MAIN_NAV.filter((i) => !i.requiresContact || hasContact(lab));
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          {lab.logo ? <img src={lab.logo} alt="" height={24} className={styles.logo} /> : <SignalMark className={styles.mark} />}
          <span className={styles.name}>{lab.name}</span>
        </Link>
        <nav aria-label="Main">
          <NavLinks items={items} className={styles.nav} linkClassName={styles.link} />
        </nav>
      </div>
    </header>
  );
}
