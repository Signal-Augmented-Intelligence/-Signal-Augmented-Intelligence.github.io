/**
 * Reads the lab's content files at build time. All page content comes from content/.
 * Nothing here runs in the browser.
 */
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';
import { marked } from 'marked';

const ROOT = path.join(process.cwd(), 'content');

function readYaml<T>(file: string, fallback: T): T {
  const value = load(fs.readFileSync(path.join(ROOT, file), 'utf8'));
  return (value ?? fallback) as T;
}

function readMarkdownDir<T>(dir: string): (T & { slug: string; html: string })[] {
  const full = path.join(ROOT, dir);
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const text = fs.readFileSync(path.join(full, f), 'utf8');
      const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
      if (!match) throw new Error(`${dir}/${f}: missing front matter`);
      const data = (load(match[1]) ?? {}) as T;
      const body = match[2].trim();
      return { ...data, slug: f.replace(/\.md$/, ''), html: body ? (marked.parse(body) as string) : '' };
    });
}

const str = (v: unknown) => (v === null || v === undefined ? '' : String(v));

/* ---------- lab ---------- */
export type Lab = {
  name: string;
  full_name: string;
  name_ko: string;
  institution: string;
  advisor: string;
  intro: string;
  email: string;
  location: string;
  logo: string;
  upload_endpoint: string;
  draft: boolean;
};
export function getLab(): Lab {
  const raw = readYaml<Record<string, unknown>>('lab.yml', {});
  return {
    name: str(raw.name),
    full_name: str(raw.full_name),
    name_ko: str(raw.name_ko),
    institution: str(raw.institution),
    advisor: str(raw.advisor),
    intro: str(raw.intro),
    email: str(raw.email),
    location: str(raw.location),
    logo: str(raw.logo),
    upload_endpoint: str(raw.upload_endpoint),
    draft: raw.draft !== false,
  };
}
export const hasContact = (lab: Lab) => lab.email !== '' || lab.location !== '';

/* ---------- people ---------- */
export type Group = 'faculty' | 'phd' | 'ms' | 'undergrad' | 'alumni';
export type Person = {
  id: string;
  name: string;
  name_ko: string;
  group: Group;
  role: string;
  bio: string;
  photo: string;
  url: string;
  after: string;
};
export function getPeople(): Person[] {
  return readYaml<Record<string, unknown>[]>('people.yml', []).map((p) => ({
    id: str(p.id),
    name: str(p.name),
    name_ko: str(p.name_ko),
    group: str(p.group) as Group,
    role: str(p.role),
    bio: str(p.bio),
    photo: str(p.photo),
    url: str(p.url),
    after: str(p.after),
  }));
}
/** Where a member's name links to (author lists, seminar presenters). */
export function personHref(p: Person): string {
  if (p.group === 'faculty') return '/members/professor/';
  if (p.group === 'alumni') return `/members/alumni/#${p.id}`;
  return `/members/our-team/#${p.id}`;
}

/* ---------- professor ---------- */
export type Professor = {
  name: string;
  name_ko: string;
  position: string;
  affiliation: string;
  field: string;
  office: string;
  email: string;
  phone: string;
  photo: string;
  links: { label: string; url: string }[];
  bio: string;
  education: { degree: string; date: string; school: string }[];
  career: { period: string; role: string }[];
  research_areas: { en: string; ko: string }[];
  keywords: string;
  teaching: { course: string; terms: string }[];
  publications: { date: string; title: string; venue: string; authors: string; doi: string }[];
  software: { date: string; title: string; note: string }[];
  patents: { status: string; date: string; title: string; number: string }[];
  projects: { period: string; title: string; role: string; funding: string }[];
  services: { date: string; text: string }[];
  student_awards: string[];
};
export function getProfessor(): Professor {
  const raw = readYaml<Record<string, unknown>>('professor.yml', {});
  const list = <T,>(key: string) => ((raw[key] as T[] | null) ?? []).map((item) =>
    typeof item === 'object' && item !== null
      ? (Object.fromEntries(Object.entries(item).map(([k, v]) => [k, str(v)])) as T)
      : (str(item) as T),
  );
  return {
    name: str(raw.name),
    name_ko: str(raw.name_ko),
    position: str(raw.position),
    affiliation: str(raw.affiliation),
    field: str(raw.field),
    office: str(raw.office),
    email: str(raw.email),
    phone: str(raw.phone),
    photo: str(raw.photo),
    links: list('links'),
    bio: str(raw.bio),
    education: list('education'),
    career: list('career'),
    research_areas: list('research_areas'),
    keywords: str(raw.keywords),
    teaching: list('teaching'),
    publications: list('publications'),
    software: list('software'),
    patents: list('patents'),
    projects: list('projects'),
    services: list('services'),
    student_awards: list('student_awards'),
  };
}

/* ---------- publications ---------- */
export const PUBLICATION_TYPES = [
  { id: 'journal', title: 'Journal Articles', label: 'Journal article' },
  { id: 'conference-paper', title: 'Conference Papers', label: 'Conference paper' },
  { id: 'conference-poster', title: 'Conference Posters', label: 'Conference poster' },
  { id: 'other', title: 'Others', label: 'Other' },
] as const;
export type Publication = {
  slug: string;
  url: string;
  title: string;
  title_ko: string;
  type: string;
  authors: string[];
  venue: string;
  pub_date: string;
  status: string;
  award: string;
  links: { label: string; url: string }[];
  excerpt: string;
  figure: string;
  figure_alt: string;
  figure_caption: string;
  html: string;
};
export function getPublications(): Publication[] {
  return readMarkdownDir<Record<string, unknown>>('publications')
    .map((p) => ({
      slug: str(p.permalink).replace(/^\/publications\/|\/$/g, '') || p.slug,
      url: str(p.permalink) || `/publications/${p.slug}/`,
      title: str(p.title),
      title_ko: str(p.title_ko),
      type: str(p.type),
      authors: ((p.authors as string[]) ?? []).map(str),
      venue: str(p.venue),
      pub_date: str(p.pub_date),
      status: str(p.status),
      award: str(p.award),
      links: ((p.links as { label: string; url: string }[] | null) ?? []).map((l) => ({ label: str(l.label), url: str(l.url) })),
      excerpt: str(p.excerpt),
      figure: str(p.figure),
      figure_alt: str(p.figure_alt),
      figure_caption: str(p.figure_caption),
      html: p.html,
    }))
    .sort((a, b) => b.pub_date.localeCompare(a.pub_date));
}

/* ---------- research areas ---------- */
export type ResearchArea = {
  slug: string;
  title: string;
  order: number;
  summary: string;
  figure: string;
  figure_alt: string;
  figure_caption: string;
  publications: string[];
  html: string;
};
export function getResearchAreas(): ResearchArea[] {
  return readMarkdownDir<Record<string, unknown>>('research')
    .map((r) => ({
      slug: r.slug,
      title: str(r.title),
      order: Number(r.order ?? 99),
      summary: str(r.summary),
      figure: str(r.figure),
      figure_alt: str(r.figure_alt),
      figure_caption: str(r.figure_caption),
      publications: ((r.publications as string[] | null) ?? []).map(str),
      html: r.html,
    }))
    .sort((a, b) => a.order - b.order);
}

/* ---------- seminars ---------- */
export const SEMINAR_TYPES: Record<string, string> = {
  research: 'Research meeting',
  'paper-review': 'Paper review',
  tutorial: 'Tutorial',
  invited: 'Invited talk',
};
export type Seminar = {
  date: string;
  term: string;
  presenter: string;
  title: string;
  summary: string;
  type: string;
  topics: string[];
  file: string;
  highlight: boolean;
};
/** Mar–Aug: Spring, Sep–Dec: Fall, Jan–Feb: Winter of the previous year. */
export function termOf(date: string): string {
  const [y, m] = date.split('-').map(Number);
  if (m >= 9) return `${y} Fall`;
  if (m >= 3) return `${y} Spring`;
  return `${y - 1} Winter`;
}
export function getSeminars(): Seminar[] {
  return readYaml<Record<string, unknown>[]>('seminars.yml', [])
    .map((s) => {
      const date = str(s.date).slice(0, 10);
      return {
        date,
        term: str(s.term) || termOf(date),
        presenter: str(s.presenter),
        title: str(s.title),
        summary: str(s.summary),
        type: str(s.type),
        topics: ((s.topics as string[] | null) ?? []).map(str),
        file: str(s.file),
        highlight: s.highlight === true,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}
export const seminarFileUrl = (s: Seminar) => (s.file ? `/files/seminars/${s.file}` : '');

/* ---------- news ---------- */
export type NewsItem = { date: string; text: string; link: string };
export function getNews(): NewsItem[] {
  return readYaml<Record<string, unknown>[]>('news.yml', [])
    .map((n) => ({ date: str(n.date), text: str(n.text), link: str(n.link) }))
    .sort((a, b) => b.date.localeCompare(a.date));
}
