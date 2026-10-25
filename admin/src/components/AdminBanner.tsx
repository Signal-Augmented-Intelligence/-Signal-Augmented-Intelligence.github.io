import type { ReactNode } from 'react';
import ph from '@/components/PageHeader.module.css';

/**
 * 관리 화면의 남색 띠. 공개 사이트 PageHeader와 같은 스타일 파일을 쓰되, 아래 여백(gap)은 두지 않습니다.
 * 띠 바로 아래에 메뉴(AdminShell)가 붙고, 여백은 AdminShell이 정합니다.
 */
export function AdminBanner({ title, lede }: { title: string; lede?: ReactNode }) {
  return (
    <div className={ph.banner}>
      <div className="container">
        <h1 className={ph.title}>{title}</h1>
        {lede && <p className={ph.lede}>{lede}</p>}
      </div>
    </div>
  );
}
