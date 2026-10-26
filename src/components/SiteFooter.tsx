import Link from 'next/link';
import { getLab } from '@/lib/content';
import { visibleNav } from '@/lib/nav';
import { FOOTER_LINKS, MANAGEMENT_URL } from '@/lib/site';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
  const lab = getLab();
  const links = visibleNav(FOOTER_LINKS);
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div>
          <p className={styles.lab}>{lab.name}</p>
          <p className="muted">{lab.full_name}</p>
          {lab.institution === 'Hanshin University'
            ? <img src="/images/hanshin-university.png" alt={lab.institution} className={styles.universityLogo} />
            : <p className="muted">{lab.institution}</p>}
          {lab.location && <p className="muted">{lab.location}</p>}
          {lab.email && <p><a href={`mailto:${lab.email}`}>{lab.email}</a></p>}
        </div>
        <nav aria-label="Quick links">
          <ul className={styles.links}>
            {links.map((l) => (
              <li key={l.href}><Link href={l.href}>{l.title}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="container">
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} {lab.name}</p>
          <a href={MANAGEMENT_URL}>관리 화면</a>
          {lab.draft && <p>Draft for internal review. Not yet approved for publication.</p>}
        </div>
      </div>
    </footer>
  );
}
