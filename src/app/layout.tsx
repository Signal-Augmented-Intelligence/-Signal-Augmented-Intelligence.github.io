import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import './globals.css';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { getLab } from '@/lib/content';
import { SITE_URL } from '@/lib/site';

const lab = getLab();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${lab.name} — ${lab.full_name}`, template: `%s | ${lab.name}` },
  description: `${lab.name} (${lab.full_name}) at ${lab.institution}. ${lab.intro}`,
  robots: lab.draft ? { index: false, follow: false } : undefined,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
