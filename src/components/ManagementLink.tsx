'use client';

import { usePathname } from 'next/navigation';
import { MANAGEMENT_HOME, MANAGEMENT_PATHS, MANAGEMENT_URL } from '@/lib/site';

/** 푸터의 "관리 화면": 지금 보고 있는 페이지를 고치는 관리 화면으로 바로 갑니다 (같은 탭). */
export function ManagementLink({ className }: { className?: string }) {
  const pathname = usePathname() ?? '/';
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const target = path === '/' ? MANAGEMENT_HOME : MANAGEMENT_PATHS.find((m) => m.site.some((s) => path.startsWith(s)))?.admin ?? '/';
  return <a className={className} href={new URL(target, MANAGEMENT_URL).href}>관리 화면</a>;
}
