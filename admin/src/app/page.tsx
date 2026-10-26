import { AdminBanner } from '@admin/components/AdminBanner';
import { AdminShell } from '@admin/components/AdminShell';
import { StartScreen } from './StartScreen';

/** 첫 화면. 로그인 전에는 본문 자리에 로그인 칸(AdminShell), 로그인 뒤에는 마지막 반영·백업과 저장소 연결. */
export default function AdminHome() {
  return (
    <>
      <AdminBanner title="관리 화면" />
      <AdminShell><StartScreen /></AdminShell>
    </>
  );
}
