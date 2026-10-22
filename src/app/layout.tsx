import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@fontsource-variable/instrument-sans/wght.css';
import '@fontsource/stix-two-text/400-italic.css';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import './globals.css';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { getLab } from '@/lib/content';
import { SITE_URL } from '@/lib/site';

const lab = getLab();

/** Runs before paint: opens Home as a night sky once per session on wide screens (see components/Hero.tsx). */
const HERO_SCRIPT = "try{var d=document.documentElement;if(location.pathname==='/'&&!sessionStorage.getItem('sai-hero-seen')&&matchMedia('(min-width: 961px)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.hero='night'}}catch(e){}";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${lab.name} — ${lab.full_name}`, template: `%s | ${lab.name}` },
  description: `${lab.name} (${lab.full_name}) at ${lab.institution}. ${lab.intro}`,
  robots: lab.draft ? { index: false, follow: false } : undefined,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: HERO_SCRIPT }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
