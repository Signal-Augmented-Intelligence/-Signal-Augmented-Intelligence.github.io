'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { MENU } from '@admin/lib/menu';
import styles from './AdminShell.module.css';

/**
 * 페이지 띠 아래의 틀: 왼쪽 메뉴 + 본문.
 * 960px 이하에서는 메뉴가 띠 아래의 가로 탭(공개 사이트의 탭과 같은 모양)이 됩니다. 접기 버튼은 두지 않습니다.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const items = MENU;
  return (
    <div className={styles.frame}>
      <nav className={styles.nav} aria-label="관리 메뉴">
        <div className={`container ${styles.navInner}`}>
          <ul className={styles.menu}>
            {items.map((m, i) => {
              const current = m.href === '/' ? path === '/' : path.startsWith(m.href);
              const groupStart = i > 0 && items[i - 1].group !== m.group;
              return (
                <li key={m.href} className={groupStart ? styles.groupStart : undefined}>
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
        </div>
      </nav>
      <div className={`container ${styles.body}`}>{children}</div>
    </div>
  );
}
