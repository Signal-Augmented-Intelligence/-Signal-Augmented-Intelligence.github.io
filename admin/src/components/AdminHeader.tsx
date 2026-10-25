import { SignalMark } from '@/components/SignalMark';
import site from '@/components/SiteHeader.module.css';
import styles from './AdminHeader.module.css';

/**
 * 공개 사이트와 같은 남색 헤더. 왼쪽: 신호 표시 + "SAI Lab" │ "관리". 오른쪽: "공개 사이트"(새 탭).
 * 로그인한 뒤에는 오른쪽에 "비밀번호 바꾸기"(팝업)와 "로그아웃"이 붙습니다(공용 계정이라 이름은 없음).
 */
export function AdminHeader({ siteUrl, loggedIn = false, onChangePassword, onLogout }: {
  siteUrl: string;
  loggedIn?: boolean;
  onChangePassword?: () => void;
  onLogout?: () => void;
}) {
  return (
    <header className={site.header}>
      <div className={`container ${site.inner} ${styles.inner}`}>
        <a href="/" className={site.brand}>
          <SignalMark className={site.mark} />
          <span className={site.name}>SAI Lab</span>
          <span className={styles.divider} aria-hidden="true" />
          <span className={styles.area}>관리</span>
        </a>
        <ul className={styles.actions}>
          <li><a className={site.link} href={siteUrl} target="_blank" rel="noopener noreferrer">공개 사이트</a></li>
          {loggedIn && (
            <>
              <li><button type="button" className={`${site.link} ${styles.button}`} onClick={onChangePassword}>비밀번호 바꾸기</button></li>
              <li><button type="button" className={`${site.link} ${styles.button}`} onClick={onLogout}>로그아웃</button></li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}
