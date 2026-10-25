import { AdminBanner } from '@admin/components/AdminBanner';
import { AdminShell } from '@admin/components/AdminShell';

/** 첫 화면. 관리 서버 API가 생기면 본문 자리에 로그인 칸, 로그인 뒤에는 마지막 반영·백업과 승인 대기 세미나가 들어갑니다. */
export default function AdminHome() {
  return (
    <>
      <AdminBanner title="관리 화면" />
      <AdminShell>{null}</AdminShell>
    </>
  );
}
