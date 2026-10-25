import { AdminBanner } from '@admin/components/AdminBanner';
import { AdminShell } from '@admin/components/AdminShell';

/** 없는 주소: 다른 관리 화면과 같은 띠·메뉴 틀. */
export default function NotFound() {
  return (
    <>
      <AdminBanner title="페이지를 찾을 수 없습니다" />
      <AdminShell>
        <p>이 주소에는 화면이 없습니다. <a href="/">첫 화면으로</a></p>
      </AdminShell>
    </>
  );
}
