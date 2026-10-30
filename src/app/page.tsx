import Link from 'next/link';
import { Hero } from '@/components/Hero';
import itemStyles from '@/components/Items.module.css';
import { PublicationItem } from '@/components/PublicationItem';
import { Section } from '@/components/Section';
import { SeminarItem } from '@/components/SeminarItem';
import { getHomeSlides, getLab, getNotices, getPeople, getPoem, getPublications, getResearchAreas, getSeminars } from '@/lib/content';
import { RecruitmentPopup } from '@/components/RecruitmentPopup';
import styles from './home.module.css';

export default function HomePage() {
  const lab = getLab();
  const poem = getPoem();
  const people = getPeople();
  const areas = getResearchAreas();
  const publications = getPublications().slice(0, 3);
  const highlights = getSeminars().filter((s) => s.highlight && s.file).slice(0, 5);
  const popup = getNotices().find((notice) => notice.popup && notice.kind === 'recruitment');

  return (
    <>
      {popup && <RecruitmentPopup notice={popup} />}
      <Hero
        name={lab.name}
        institution={lab.institution}
        quote={poem.hero}
        poemTitle={poem.stanzas.length > 0 ? poem.title : ''}
        slides={getHomeSlides()}
      />

      {highlights.length > 0 && (
        <Section id="highlights" title="Recent Seminars" aside={<Link href="/seminars/">View all seminars</Link>}>
          <ol className={itemStyles.list}>
            {highlights.map((s) => <SeminarItem key={s.date + s.title} seminar={s} people={people} />)}
          </ol>
        </Section>
      )}

      <Section id="research" title="Research Areas" aside={<Link href="/research/">All areas</Link>}>
        <ul className={styles.areas}>
          {areas.map((a) => (
            <li key={a.slug}>
              <h3 className={styles.areaTitle}><Link href={`/research/${a.slug}/`}>{a.title}</Link></h3>
              <p className={styles.areaSummary}>{a.summary}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="recent-publications" title="Recent Publications" aside={<Link href="/research/publications/">All publications</Link>}>
        <ol className={itemStyles.list}>
          {publications.map((p) => <PublicationItem key={p.url} pub={p} people={people} />)}
        </ol>
      </Section>

      {poem.stanzas.length > 0 && (
        <Section id="poem" title={poem.title}>
          <div className={styles.poem} lang="ko">
            {poem.stanzas.map((stanza, i) => (
              <div key={i}>{stanza.map((line) => <p key={line}>{line}</p>)}</div>
            ))}
            {poem.credit && <p className={styles.credit}>{poem.credit}</p>}
          </div>
        </Section>
      )}
    </>
  );
}
