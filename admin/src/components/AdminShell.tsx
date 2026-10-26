'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { currentMenu, MENU } from '@admin/lib/menu';
import { LoginForm, useSession } from './Session';
import styles from './AdminShell.module.css';

/**
 * 페이지 띠 아래의 틀: 왼쪽 메뉴 + 본문.
 * 960px 이하에서는 메뉴가 띠 아래의 가로 탭(공개 사이트의 탭과 같은 모양)이 됩니다. 접기 버튼은 두지 않고, 오른쪽 끝을 흐리게 해서 넘친 탭이 있음을 보입니다.
 * PC에서는 한신대학교 로고를 메뉴 바로 아래에 둡니다.
 * 가로 탭에는 누를 수 있는 화면만 둡니다. "준비 중" 메뉴까지 넣으면 탭이 화면 밖으로 밀려 Album 같은 화면이 안 보입니다.
 * 로그인 전에는 메뉴를 두지 않고 본문 자리에 로그인 칸을 둡니다. 로그인 상태를 확인하는 동안은 비워 둡니다.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { state } = useSession();
  const items = MENU;
  if (state !== 'in') {
    return (
      <div className={`${styles.frame} ${styles.single}`}>
        <div className={`container ${styles.body}`}>{state === 'out' && <LoginForm />}</div>
      </div>
    );
  }
  return (
    <div className={styles.frame}>
      <nav className={styles.nav} aria-label="관리 메뉴">
        <div className={`container ${styles.navInner}`}>
          <ul className={styles.menu}>
            {items.map((m, i) => {
              const current = currentMenu(path) === m;
              const groupStart = i > 0 && items[i - 1].group !== m.group;
              return (
                <li key={m.href} className={[groupStart && styles.groupStart, !m.ready && styles.pendingItem].filter(Boolean).join(' ') || undefined}>
                  {m.ready ? (
                    <a href={m.href} className={styles.item} aria-current={current ? 'page' : undefined}>{m.title}</a>
                  ) : (
                    <span className={`${styles.item} ${styles.pending}`} aria-disabled="true" title={m.note}>
                      {m.title}<span className={styles.soon}>준비 중</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <div className={styles.university}>
            <Image src="/images/admin/hanshin-university.png" width={696} height={228} alt="한신대학교" />
          </div>
        </div>
      </nav>
      <div className={`container ${styles.body}`}>{children}</div>
    </div>
  );
}
