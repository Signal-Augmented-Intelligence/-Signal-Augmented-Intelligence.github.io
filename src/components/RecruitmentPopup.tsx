'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import type { Notice } from '@/lib/content';
import styles from './RecruitmentPopup.module.css';

function localDay() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function RecruitmentPopup({ notice }: { notice: Notice }) {
  const ref = useRef<HTMLDialogElement>(null);
  const key = `sai-recruitment-dismissed:${notice.id}`;
  useEffect(() => {
    const today = localDay();
    try { if (localStorage.getItem(key) === today) return; } catch { /* storage may be disabled */ }
    if (ref.current && !ref.current.open) ref.current.showModal();
  }, [key]);
  const dismiss = (todayOnly: boolean) => {
    if (todayOnly) {
      try { localStorage.setItem(key, localDay()); } catch { /* storage may be disabled */ }
    }
    ref.current?.close();
  };
  return <dialog ref={ref} className={styles.dialog} aria-labelledby="recruitment-title">
    <div className={styles.content}>
      <p className={styles.kicker}>SAI Lab</p>
      <h2 id="recruitment-title" className={styles.title}>{notice.title}</h2>
      {notice.body && <p className={styles.body}>{notice.body}</p>}
      {notice.link && <p className={styles.link}>{notice.link.startsWith('/')
        ? <Link href={notice.link} onClick={() => dismiss(false)}>자세히 보기</Link>
        : <a href={notice.link} target="_blank" rel="noopener noreferrer" onClick={() => dismiss(false)}>자세히 보기</a>}</p>}
    </div>
    <div className={styles.actions}>
      <button type="button" onClick={() => dismiss(true)}>오늘 하루 보지 않기</button>
      <button type="button" onClick={() => dismiss(false)}>닫기</button>
    </div>
  </dialog>;
}
