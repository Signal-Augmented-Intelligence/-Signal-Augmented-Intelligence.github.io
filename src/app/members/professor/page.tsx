import type { Metadata } from 'next';
import { DateList } from '@/components/DateList';
import { PageHeader } from '@/components/PageHeader';
import { PhotoSlot } from '@/components/PhotoSlot';
import { Section } from '@/components/Section';
import { getProfessor } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { MEMBERS_TABS } from '@/lib/site';
import styles from './professor.module.css';

export const metadata: Metadata = { title: 'Professor', description: 'Prof. Seon Man Kim, advisor of SAI Lab, Hanshin University.' };

export default function ProfessorPage() {
  const p = getProfessor();
  const dated = p.services.filter((s) => s.date);
  const years = [...new Set(dated.map((s) => s.date.slice(0, 4)))];
  const undated = p.services.filter((s) => !s.date);

  return (
    <>
      <PageHeader title="Members" tabs={MEMBERS_TABS} />

      <div className={`container ${styles.profile}`}>
        <PhotoSlot photo={p.photo} alt={p.name} className={styles.photo} />
        <div>
          <h2 className={styles.name}>{p.name} <span lang="ko" className={styles.nameKo}>{p.name_ko}</span></h2>
          <p className={styles.position}>{p.position}</p>
          <p>{p.affiliation}</p>
          {p.field && <p className="muted">{p.field}</p>}
          <dl className={styles.contact}>
            {p.office && <><dt>Office</dt><dd>{p.office}</dd></>}
            {p.email && <><dt>Email</dt><dd><a href={`mailto:${p.email}`}>{p.email}</a></dd></>}
            {p.phone && <><dt>Tel</dt><dd className="num">{p.phone}</dd></>}
          </dl>
          {p.links.length > 0 && <p className={styles.links}>{p.links.map((l) => <a key={l.url} href={l.url}>{l.label}</a>)}</p>}
        </div>
      </div>

      {p.bio && <Section id="biography" title="Biography"><p className="prose">{p.bio}</p></Section>}

      <Section id="education" title={p.career.length ? 'Education & Career' : 'Education'}>
        <DateList items={[
          ...p.education.map((e) => ({ date: formatDate(e.date, 'month'), content: `${e.degree}, ${e.school}` })),
          ...p.career.map((c) => ({ date: c.period, content: c.role })),
        ]} />
      </Section>

      <Section id="research-areas" title="Research Areas">
        <ul className={styles.areas}>
          {p.research_areas.map((r) => (
            <li key={r.en}>{r.en}<span lang="ko" className={styles.ko}>{r.ko}</span></li>
          ))}
        </ul>
        {p.keywords && <p className={styles.keywords} lang="ko">{p.keywords}</p>}
      </Section>

      {p.teaching.length > 0 && (
        <Section id="teaching" title="Courses Taught">
          <DateList items={p.teaching.map((c) => ({ date: c.terms, content: c.course }))} />
        </Section>
      )}

      <Section id="publications" title="Publications">
        <ul className={styles.pubs}>
          {p.publications.map((pub) => (
            <li key={pub.title}>
              <span className={`${styles.pubDate} num`}>{pub.date}</span>
              <div>
                <p className={styles.pubTitle}>{pub.doi ? <a href={`https://doi.org/${pub.doi}`}>{pub.title}</a> : pub.title}</p>
                <p className={styles.pubMeta}>{pub.authors}. <em>{pub.venue}</em></p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="intellectual-property" title="Intellectual Property">
        <h3 className={styles.sub}>Software registrations</h3>
        <DateList items={p.software.map((s) => ({ date: s.date, content: s.title, note: s.note }))} />
        <h3 className={styles.sub}>Patents</h3>
        <DateList items={p.patents.map((s) => ({
          date: s.date || '—',
          content: s.title,
          note: [s.status, s.number].filter(Boolean).join(', '),
        }))} />
      </Section>

      <Section id="projects" title="Research Projects">
        <DateList items={p.projects.map((s) => ({ date: s.period, content: s.title, note: [s.role, s.funding].filter(Boolean).join(', ') }))} />
      </Section>

      <Section id="academic-services" title="Academic Services">
        {years.map((y) => (
          <div key={y} className={styles.yearGroup}>
            <h3 className={styles.sub}>{y}</h3>
            <DateList items={dated.filter((s) => s.date.startsWith(y)).map((s) => ({ date: formatDate(s.date, 'day'), content: s.text }))} />
          </div>
        ))}
        {undated.length > 0 && (
          <div className={styles.yearGroup}>
            <h3 className={styles.sub}>Other</h3>
            <ul className={styles.plain}>{undated.map((s) => <li key={s.text}>{s.text}</li>)}</ul>
          </div>
        )}
      </Section>

      {p.student_awards.length > 0 && (
        <Section id="student-awards" title="Student Awards">
          <ul className={styles.plain}>{p.student_awards.map((a) => <li key={a}>{a}</li>)}</ul>
        </Section>
      )}
    </>
  );
}
