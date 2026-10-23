import { PageHeader } from '@/components/PageHeader';

/** 없는 주소: 같은 틀의 한국어 안내. */
export default function NotFound() {
  return (
    <>
      <PageHeader title="페이지를 찾을 수 없습니다" />
      <p className="container">이 주소에는 화면이 없습니다. <a href="/">관리 화면 첫 화면</a>으로 이동해 주세요.</p>
    </>
  );
}
