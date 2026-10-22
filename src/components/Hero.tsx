'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { METEORS, NIGHT_MS, STARS } from './heroSky';
import styles from './Hero.module.css';

/** Renders "e^{jωn}" with a real superscript. */
function Formula({ text }: { text: string }) {
  const parts = text.split(/\^\{([^}]*)\}/);
  return <>{parts.map((part, i) => (i % 2 === 1 ? <sup key={i}>{part}</sup> : part))}</>;
}

type Props = {
  name: string;
  fullName: string;
  nameKo: string;
  quote: string[];
  poemTitle: string;
  advisor: string;
  affiliation: string;
  location: string;
};

/**
 * Home first screen. On the first visit of a session (wide screens, motion allowed) the page opens as a night sky
 * with falling formulas, then fades to the normal page after NIGHT_MS. The inline script in the root layout
 * sets html[data-hero="night"] before paint; this component ends that phase.
 */
export function Hero({ name, fullName, nameKo, quote, poemTitle, advisor, affiliation, location }: Props) {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.hero !== 'night') return;
    try { sessionStorage.setItem('sai-hero-seen', '1'); } catch {}
    const timer = window.setTimeout(() => { root.dataset.hero = 'day'; }, NIGHT_MS);
    return () => {
      window.clearTimeout(timer);
      root.dataset.hero = 'day';
    };
  }, []);

  return (
    <section className={styles.hero} aria-label={name}>
      <div className={styles.sky} aria-hidden="true" />
      <div className={`container ${styles.grid}`}>
        <div className={styles.text}>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.fullName}>{fullName}{nameKo && <span lang="ko"> | {nameKo}</span>}</p>
          {quote.length > 0 && (
            <blockquote className={styles.quote} lang="ko">
              {quote.map((line) => <p key={line}>{line}</p>)}
            </blockquote>
          )}
          {poemTitle && <p className={styles.poemLink} lang="ko"><a href="#poem">「{poemTitle}」 전문 읽기</a></p>}
        </div>

        <div className={styles.field} aria-hidden="true">
          {STARS.map((s) => (
            <span key={s.text} className={styles.star} style={{ left: s.left, top: s.top, fontSize: s.size, opacity: s.opacity }}><Formula text={s.text} /></span>
          ))}
          <div className={styles.meteors}>
            {METEORS.map((m) => (
              <span key={m.text} className={styles.meteor} style={{ left: m.left, top: m.top, fontSize: m.size, animationDuration: `${m.duration}s`, animationDelay: `${m.delay}s` }}><Formula text={m.text} /></span>
            ))}
          </div>
        </div>

        <dl className={styles.facts}>
          <div><dt>Advisor</dt><dd><Link href="/members/professor/">{advisor}</Link></dd></div>
          <div><dt>Affiliation</dt><dd>{affiliation}</dd></div>
          {location && <div><dt>Location</dt><dd>{location}</dd></div>}
        </dl>
      </div>
    </section>
  );
}
