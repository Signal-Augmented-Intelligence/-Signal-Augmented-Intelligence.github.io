'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { MENU, type Role } from '@admin/lib/menu';
import styles from './AdminShell.module.css';

/**
 * 페이지 띠 아래의 틀: 왼쪽 메뉴 + 본문. 960px 이하에서는 메뉴가 본문 위의 접히는 목록이 됩니다.
 * `role`이 없으면(로그인 전·확인 전) 모든 메뉴를 보여 줍니다. 막는 것은 관리 서버가 합니다.
 */
export function AdminShell({ role, children }: { role?: Role; children: ReactNode }) {
  const path = usePathname();
  const items = MENU.filter((m) => !role || m.roles.includes(role));
  const list = (
    <ul className={styles.menu}>
      {items.map((m) => {
        const current = m.href === '/' ? path === '/' : path.startsWith(m.href);
        return (
          <li key={m.href}>
            {m.ready
              ? <a href={m.href} aria-current={current ? 'page' : undefined}>{m.title}</a>
              : <span className={styles.pending} title={`${m.note} (준비 중)`}>{m.title}</span>}
          </li>
        );
      })}
    </ul>
  );
  return (
    <div className={`container ${styles.shell}`}>
      <nav className={styles.side} aria-label="관리 메뉴">{list}</nav>
      <details className={styles.fold}>
        <summary>메뉴</summary>
        <nav aria-label="관리 메뉴">{list}</nav>
      </details>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
