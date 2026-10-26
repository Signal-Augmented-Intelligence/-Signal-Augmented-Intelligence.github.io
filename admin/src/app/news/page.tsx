import { AdminBanner } from '@admin/components/AdminBanner';
import { AdminShell } from '@admin/components/AdminShell';
import { NewsScreen } from './NewsScreen';

export const metadata = { title: 'News' };

export default function NewsPage() {
  return <><AdminBanner title="News" /><AdminShell><NewsScreen /></AdminShell></>;
}
