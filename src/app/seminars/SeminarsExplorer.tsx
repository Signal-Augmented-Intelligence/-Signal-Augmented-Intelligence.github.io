'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Seminar } from '@/lib/content';
import styles from './seminars.module.css';

const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
const fileUrl = (seminar: SeminarEntry) => seminar.file ? `/files/seminars/${seminar.file}` : '';
const coverUrl = (seminar: SeminarEntry) => seminar.cover ? `/images/seminars/${seminar.cover}` : '';

type SeminarEntry = Seminar & { presenterName: string; presenterNames: string };

export function SeminarsExplorer({ seminars }: { seminars: SeminarEntry[] }) {
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('');
  const areas = useMemo(() => {
    const counts = new Map<string, number>();
    seminars.forEach((seminar) => {
      if (seminar.area) counts.set(seminar.area, (counts.get(seminar.area) ?? 0) + 1);
    });
    return [...counts].sort(([a], [b]) => a.localeCompare(b)).map(([name, count]) => ({ name, count }));
  }, [seminars]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get('q') ?? '');
    const selected = params.get('area') ?? '';
    setArea(areas.some((item) => item.name === selected) ? selected : '');
  }, [areas]);

  function updateUrl(nextQuery: string, nextArea: string) {
    const url = new URL(window.location.href);
    if (nextQuery.trim()) url.searchParams.set('q', nextQuery.trim());
    else url.searchParams.delete('q');
    if (nextArea) url.searchParams.set('area', nextArea);
    else url.searchParams.delete('area');
    window.history.replaceState(null, '', url);
  }

  const words = normalize(query).split(' ').filter(Boolean);
  const filtered = seminars.filter((seminar) => {
    if (area && seminar.area !== area) return false;
    const searchable = normalize([seminar.title, seminar.summary, seminar.presenter, seminar.presenterNames, seminar.area].join(' '));
    return words.every((word) => searchable.includes(word));
  });

  return (
    <div className={styles.explorer}>
      <label className={styles.searchLabel} htmlFor="seminar-search">Search seminars</label>
      <input id="seminar-search" className={styles.search} type="search" value={query} placeholder="Title, summary, presenter or area" onChange={(event) => {
        setQuery(event.target.value);
        updateUrl(event.target.value, area);
      }} />
      <div className={styles.layout}>
        <nav aria-label="Seminar areas">
          <div className={styles.heading}><h2>Areas</h2></div>
          <div className={styles.areas}>
            <button type="button" className={styles.areaFilter} aria-pressed={!area} onClick={() => { setArea(''); updateUrl(query, ''); }}>
              <span>All</span><span className="num">{seminars.length}</span>
            </button>
            {areas.map((item) => (
              <button key={item.name} type="button" className={styles.areaFilter} aria-pressed={area === item.name} onClick={() => { setArea(item.name); updateUrl(query, item.name); }}>
                <span>{item.name}</span><span className="num">{item.count}</span>
              </button>
            ))}
          </div>
        </nav>
        <section aria-label="Seminar materials">
          <div className={styles.heading}>
            <h2>Materials</h2>
            <p className={styles.count} aria-live="polite">{filtered.length} {filtered.length === 1 ? 'material' : 'materials'} · Newest first</p>
          </div>
          {filtered.length > 0 ? (
            <ol className={styles.list}>
              {filtered.map((seminar, index) => {
                const file = fileUrl(seminar);
                const cover = coverUrl(seminar);
                return (
                  <li key={`${seminar.date}-${seminar.title}-${index}`} className={styles.row}>
                    <time className={`${styles.date} num`} dateTime={seminar.date}>{seminar.date.replaceAll('-', '.')}</time>
                    <div>
                      <h3 className={styles.title}>{file ? <a href={file}>{seminar.title}</a> : seminar.title}</h3>
                      {seminar.presenterName && <p className={styles.presenter}>{seminar.presenterName}</p>}
                      {seminar.area && <p className={styles.areaLabel}>{seminar.area}</p>}
                    </div>
                    <div className={styles.coverGroup}>
                      {cover && file && (
                        <a href={file} className={styles.cover} aria-label={`Open PDF: ${seminar.title}`}>
                          <img src={cover} alt="" loading="lazy" />
                        </a>
                      )}
                      {file && <a className={styles.pdf} href={file} aria-label={`PDF: ${seminar.title}`}>PDF</a>}
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : <p className={styles.empty}>{seminars.length === 0 ? 'No seminars have been posted yet.' : 'No matching materials.'}</p>}
        </section>
      </div>
    </div>
  );
}
