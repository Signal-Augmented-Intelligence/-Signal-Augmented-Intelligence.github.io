import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';
import { Hero } from '@/components/Hero';
import { PersonName } from '@/components/PersonName';
import {
  getLab, getPeople, getPoem, getPublications, getResearchAreas, getSeminars,
  type Person, type Publication, PUBLICATION_TYPES, SEMINAR_TYPES, type Seminar, seminarFileUrl,
} from '@/lib/content';
import { formatDate } from '@/lib/format';
import styles from './home.module.css';

function Block({ id, title, more, tone = 'surface', children }: { id: string; title: string; more?: { href: string; label: string }; tone?: 'surface' | 'paper'; children: ReactNode }) {
  return (
    <section id={id} className={styles.block} data-tone={tone}>
      <div className="container">
        <div className={styles.blockHead}>
          <h2 className={styles.blockTitle}>{title}</h2>
          {more && <Link href={more.href} className={styles.more}>{more.label}</Link>}
        </div>
        {children}
      </div>
    </section>
  );
}

function PublicationCard({ pub, people }: { pub: Publication; people: Person[] }) {
  const type = PUBLICATION_TYPES.find((t) => t.id === pub.type);
  return (
    <li className={styles.card}>
      <p className={styles.kicker}>{type?.label ?? pub.type} <span className="num">{pub.pub_date.slice(0, 4)}</span></p>
      <h3 className={styles.cardTitle}><Link href={pub.url}>{pub.title}</Link></h3>
      <p className={styles.cardMeta}>
        {pub.authors.map((a, i) => <Fragment key={a + i}>{i > 0 && ', '}<PersonName name={a} people={people} /></Fragment>)}
      </p>
      <p className={styles.venue}>{pub.venue}</p>
      {(pub.award || pub.links.length > 0) && (
        <p className={styles.chips}>
          {pub.award && <span className={styles.chip} data-kind="award">{pub.award}</span>}
          {pub.links.map((l) => <a key={l.url} href={l.url} className={styles.chip}>{l.label}</a>)}
        </p>
      )}
    </li>
  );
}

function SeminarCard({ seminar, people }: { seminar: Seminar; people: Person[] }) {
  const file = seminarFileUrl(seminar);
  return (
    <li className={styles.card}>
      <p className={styles.kicker}>{SEMINAR_TYPES[seminar.type] ?? 'Seminar'} <span className="num">{formatDate(seminar.date)}</span></p>
      <h3 className={styles.cardTitle}>{file ? <a href={file}>{seminar.title}</a> : seminar.title}</h3>
      <p className={styles.cardMeta}><PersonName name={seminar.presenter} people={people} /></p>
      {seminar.summary && <p className={styles.cardText}>{seminar.summary}</p>}
      {file && <p className={styles.chips}><a href={file} className={styles.chip}>PDF</a></p>}
    </li>
  );
}

export default function HomePage() {
  const lab = getLab();
  const poem = getPoem();
  const people = getPeople();
  const areas = getResearchAreas();
  const publications = getPublications();
  const recent = publications.slice(0, 3);
  const highlights = getSeminars().filter((s) => s.highlight && s.file).slice(0, 4);

  return (
    <>
      <Hero name={lab.name} fullName={lab.full_name} nameKo={lab.name_ko} quote={poem.hero} poemTitle={poem.stanzas.length > 0 ? poem.title : ''} />

      <div className={styles.body}>
        <Block id="about" title="About the lab">
          <p className={styles.lead}>{lab.intro}</p>
        </Block>

        {highlights.length > 0 && (
          <Block id="highlights" title="Highlights" more={{ href: '/seminars/', label: 'View all seminars' }}>
            <ol className={styles.cards} data-cols="2">
              {highlights.map((s) => <SeminarCard key={s.date + s.title} seminar={s} people={people} />)}
            </ol>
          </Block>
        )}

        <Block id="research" title="Research Areas" more={{ href: '/research/', label: 'View all' }}>
          <ul className={styles.cards} data-cols="3">
            {areas.map((a) => {
              const count = a.publications.filter((u) => publications.some((p) => p.url === u)).length;
              return (
                <li key={a.slug} className={styles.card}>
                  <h3 className={styles.cardTitle}><Link href={`/research/${a.slug}/`}>{a.title}</Link></h3>
                  <p className={styles.cardText}>{a.summary}</p>
                  <p className={styles.cardFoot}>
                    <Link href={`/research/${a.slug}/`}>Read more</Link>
                    {count > 0 && <span className="muted">{count} {count === 1 ? 'publication' : 'publications'}</span>}
                  </p>
                </li>
              );
            })}
          </ul>
        </Block>

        <Block id="recent-publications" title="Recent Publications" more={{ href: '/research/publications/', label: 'View all' }}>
          <ol className={styles.cards} data-cols="1">
            {recent.map((p) => <PublicationCard key={p.url} pub={p} people={people} />)}
          </ol>
        </Block>

        {poem.stanzas.length > 0 && (
          <Block id="poem" title={poem.title} tone="paper">
            <div className={styles.poem} lang="ko">
              {poem.stanzas.map((stanza, i) => (
                <div key={i}>{stanza.map((line) => <p key={line}>{line}</p>)}</div>
              ))}
              {poem.credit && <p className={styles.credit}>{poem.credit}</p>}
            </div>
          </Block>
        )}
      </div>
    </>
  );
}
