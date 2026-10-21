import Link from 'next/link';
import { getLab, hasContact } from '@/lib/content';
import { FOOTER_LINKS } from '@/lib/site';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
  const lab = getLab();
  const links = FOOTER_LINKS.filter((i) => !i.requiresContact || hasContact(lab));
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div>
          <p className={styles.lab}>{lab.name}</p>
          <p className="muted">{lab.full_name}</p>
          <p className="muted">{lab.institution}{lab.location && `, ${lab.location}`}</p>
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
          {lab.draft && <p>Draft for internal review. Not yet approved for publication.</p>}
        </div>
      </div>
    </footer>
  );
}
