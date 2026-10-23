import { SignalMark } from '@/components/SignalMark';
import site from '@/components/SiteHeader.module.css';
import styles from './AdminHeader.module.css';

/** 공개 사이트와 같은 남색 헤더. 왼쪽에 신호 표시 + "SAI Lab" │ "관리", 오른쪽에 공개 사이트 링크(새 탭). */
export function AdminHeader({ siteUrl }: { siteUrl: string }) {
  return (
    <header className={site.header}>
      <div className={`container ${site.inner} ${styles.inner}`}>
        <a href="/" className={site.brand}>
          <SignalMark className={site.mark} />
          <span className={site.name}>SAI Lab</span>
          <span className={styles.divider} aria-hidden="true" />
          <span className={styles.area}>관리</span>
        </a>
        <a className={`${site.link} ${styles.external}`} href={siteUrl} target="_blank" rel="noopener noreferrer">공개 사이트</a>
      </div>
    </header>
  );
}
