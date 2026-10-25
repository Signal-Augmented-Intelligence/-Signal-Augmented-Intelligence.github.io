'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api, type Publish } from './api';
import { useDialog } from '@admin/components/Dialog';

const POLL_MS = 3000;
const FAILED = '공개 사이트에 반영하지 못했습니다';
const FAILED_BODY = '저장한 내용은 남아 있습니다.';

/**
 * 저장 뒤 공개 반영을 지켜봅니다 (api.md 4장, 규칙 문서 6장).
 * 반영 중인 항목 id를 돌려주고, 끝나면 알림 없이 빼고, 실패하면 오류 팝업("다시 반영" / "닫기")을 띄웁니다.
 */
export function usePublish() {
  const dialog = useDialog();
  const [waiting, setWaiting] = useState<Record<string, string>>({}); // 항목 id → 반영 id
  const failing = useRef(false);

  const track = useCallback((itemId: string, publish?: Publish) => {
    if (!publish || publish.state === 'done') return;
    setWaiting((w) => ({ ...w, [itemId]: publish.id }));
  }, []);

  useEffect(() => {
    const ids = [...new Set(Object.values(waiting))];
    if (ids.length === 0) return;
    const timer = setInterval(async () => {
      for (const id of ids) {
        let state: Publish['state'];
        try { state = (await api.get<Publish>(`/publish/${id}`)).data.state; } catch { continue; }
        if (state !== 'done' && state !== 'failed') continue;
        let retried: Publish | null = null;
        if (state === 'failed' && !failing.current) {
          failing.current = true;
          const again = await dialog.error(FAILED, FAILED_BODY, { retry: true, retryLabel: '다시 반영' });
          failing.current = false;
          if (again) { try { retried = (await api.post<Publish>('/publish')).data; } catch { /* 다음 저장 때 다시 */ } }
        }
        setWaiting((w) => Object.fromEntries(Object.entries(w).flatMap(([item, pub]) => pub !== id ? [[item, pub]] : retried ? [[item, retried.id]] : [])));
      }
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [waiting, dialog]);

  return { publishing: (itemId: string) => itemId in waiting, track };
}
