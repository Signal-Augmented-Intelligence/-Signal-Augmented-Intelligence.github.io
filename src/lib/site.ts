/** Menus and tabs. Page content lives in content/; this file only decides structure. */
export type NavItem = { title: string; href: string; match?: string[]; requiresContact?: boolean };

export const MAIN_NAV: NavItem[] = [
  { title: 'Members', href: '/members/professor/', match: ['/members/'] },
  { title: 'Research', href: '/research/', match: ['/research/', '/publications/'] },
  { title: 'Seminars', href: '/seminars/', match: ['/seminars/'] },
  { title: 'Contact', href: '/contact/', match: ['/contact/'], requiresContact: true },
];

export const MEMBERS_TABS: NavItem[] = [
  { title: 'Professor', href: '/members/professor/' },
  { title: 'Our Team', href: '/members/our-team/' },
  { title: 'Alumni', href: '/members/alumni/' },
];

export const RESEARCH_TABS: NavItem[] = [
  { title: 'Areas', href: '/research/' },
  { title: 'Publications', href: '/research/publications/' },
];

export const FOOTER_LINKS: NavItem[] = [
  { title: 'Research Areas', href: '/research/' },
  { title: 'Publications', href: '/research/publications/' },
  { title: 'Seminars', href: '/seminars/' },
  { title: 'News', href: '/news/' },
  { title: 'Contact', href: '/contact/', requiresContact: true },
];

/** Our Team sections, in display order. Faculty is on Professor, alumni on Alumni. */
export const TEAM_GROUPS = [
  { id: 'phd', title: 'Ph.D. Students' },
  { id: 'ms', title: 'M.S. Students' },
  { id: 'undergrad', title: 'Undergraduate Researchers' },
] as const;

export const SITE_URL = 'https://signal-augmented-intelligence.github.io';
