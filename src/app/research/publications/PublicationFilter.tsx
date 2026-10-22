'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import styles from './publications.module.css';

type Option = { id: string; title: string; count: number };

/** Type filter for the server-rendered list below it; hides non-matching items and empty years. */
export function PublicationFilter({ options, total, children }: { options: Option[]; total: number; children: ReactNode }) {
  const [active, setActive] = useState('all');
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = list.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>('[data-type]').forEach((el) => {
      el.hidden = active !== 'all' && el.dataset.type !== active;
    });
    root.querySelectorAll<HTMLElement>('[data-year]').forEach((group) => {
      group.hidden = !group.querySelector('[data-type]:not([hidden])');
    });
  }, [active]);

  const all = [{ id: 'all', title: 'All', count: total }, ...options];
  return (
    <>
      <div className={styles.filter} role="group" aria-label="Filter by type">
        {all.map((o) => (
          <button key={o.id} type="button" aria-pressed={active === o.id} onClick={() => setActive(o.id)}>
            {o.title} <span className="num">{o.count}</span>
          </button>
        ))}
      </div>
      <div ref={list}>{children}</div>
    </>
  );
}
