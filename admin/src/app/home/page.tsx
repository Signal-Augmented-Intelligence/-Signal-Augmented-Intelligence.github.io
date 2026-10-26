import { AdminBanner } from '@admin/components/AdminBanner';
import { AdminShell } from '@admin/components/AdminShell';
import { HomeSlidesScreen } from './HomeSlidesScreen';

export const metadata = { title: 'Home' };

/** Home: 지금은 첫 화면 사진만. 시와 랩 정보는 API가 정해지면 같은 화면의 Section으로 덧붙입니다. */
export default function HomePage() {
  return (
    <>
      <AdminBanner title="Home" />
      <AdminShell><HomeSlidesScreen /></AdminShell>
    </>
  );
}
