import Link from 'next/link';
import { PublicationItem } from '@/components/PublicationItem';
import { Section } from '@/components/Section';
import { SeminarItem } from '@/components/SeminarItem';
import { SignalPlot } from '@/components/SignalPlot';
import itemStyles from '@/components/Items.module.css';
import { getLab, getPeople, getProfessor, getPublications, getResearchAreas, getSeminars } from '@/lib/content';
import styles from './home.module.css';

export default function HomePage() {
  const lab = getLab();
  const professor = getProfessor();
  const people = getPeople();
  const areas = getResearchAreas();
  const publications = getPublications().slice(0, 3);
  const highlights = getSeminars().filter((s) => s.highlight && s.file).slice(0, 5);

  return (
    <>
      <div className={`container ${styles.hero}`}>
        <div className={styles.heroText}>
          <h1 className={styles.name}>{lab.name}</h1>
          <p className={styles.fullName}>{lab.full_name}{lab.name_ko && <span lang="ko"> | {lab.name_ko}</span>}</p>
          <p className={styles.intro}>{lab.intro}</p>
        </div>
        <dl className={styles.facts}>
          <div><dt>Advisor</dt><dd><Link href="/members/professor/">{professor.name}</Link></dd></div>
          <div><dt>Affiliation</dt><dd>{professor.affiliation || lab.institution}</dd></div>
          {lab.location && <div><dt>Location</dt><dd>{lab.location}</dd></div>}
        </dl>
        <SignalPlot className={styles.plot} />
      </div>

      {highlights.length > 0 && (
        <Section id="highlights" title="Highlights" aside={<Link href="/seminars/">View all seminars</Link>}>
          <ol className={itemStyles.list}>
            {highlights.map((s) => <SeminarItem key={s.date + s.title} seminar={s} people={people} showTerm />)}
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
    </>
  );
}
