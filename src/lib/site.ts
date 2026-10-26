/** Menus and tabs. Page content lives in content/; this file only decides structure. */
/** `requires`: shown only when the lab has official contact details / at least one album with photos. */
export type NavItem = { title: string; href: string; match?: string[]; requires?: 'contact' | 'album' };

export const MAIN_NAV: NavItem[] = [
  { title: 'Members', href: '/members/professor/', match: ['/members/'] },
  { title: 'Research', href: '/research/', match: ['/research/', '/publications/'] },
  { title: 'Seminars', href: '/seminars/', match: ['/seminars/'] },
  { title: 'Album', href: '/album/', match: ['/album/'], requires: 'album' },
  { title: 'Contact', href: '/contact/', match: ['/contact/'], requires: 'contact' },
];

/** One-line descriptions under each section's page banner. */

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
  { title: 'Album', href: '/album/', requires: 'album' },
  { title: 'Contact', href: '/contact/', requires: 'contact' },
];

/** Our Team sections, in display order. Faculty is on Professor, alumni on Alumni. */
export const TEAM_GROUPS = [
  { id: 'phd', title: 'Ph.D. Students' },
  { id: 'ms', title: 'M.S. Students' },
  { id: 'undergrad', title: 'Undergraduate Researchers' },
] as const;

export const SITE_URL = 'https://signal-augmented-intelligence.github.io';
export const MANAGEMENT_URL = 'https://sai-lab-admin.tail6d485a.ts.net/';

/**
 * 공개 사이트 주소 → 그 내용을 고치는 관리 화면 주소 (푸터의 "관리 화면" 링크).
 * 위에서부터 처음 맞는 것을 씁니다. 관리 화면에 아직 없는 화면(Research, News)은 관리 화면 첫 화면으로 보냅니다.
 */
export const MANAGEMENT_PATHS: { site: string[]; admin: string }[] = [
  { site: ['/members/', '/people/'], admin: '/members/' },
  { site: ['/seminars/', '/upload/'], admin: '/seminars/' },
  { site: ['/album/'], admin: '/album/' },
];
/** 공개 사이트 첫 화면(/)은 관리 화면 Home(첫 화면 사진)으로 갑니다. */
export const MANAGEMENT_HOME = '/home/';
