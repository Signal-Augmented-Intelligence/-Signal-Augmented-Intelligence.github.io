'use client';

import { type ChangeEvent, useRef, useState } from 'react';
import { ApiError } from '@admin/lib/api';
import { type FilePurpose, formatSize, uploadFile } from '@admin/lib/files';
import { useDialog } from './Dialog';
import styles from './Field.module.css';

/** 올리기가 끝난 파일. 항목 저장에는 id를 씁니다. */
export type FileValue = { id: string; name: string; size: number | null; preview_url: string | null; warnings: string[] };

type Busy = { kind: 'uploading'; name: string; percent: number } | { kind: 'processing'; name: string };

/**
 * 파일 하나를 고르면 바로 올리고, 칸 안에 상태를 보통 글자로 보여 줍니다 (세미나 업로드 설계 5장).
 * 고르기 전 → 올리는 중 42% → 처리 중 → 준비됨(이름, 공개용 크기, 바꾸기, 미리보기). 실패는 오류 팝업 뒤 고르기 전으로.
 * onPending: 올리는 동안의 Promise를 넘깁니다. 저장은 이것을 기다렸다가 이어서 합니다.
 */
export function FileUpload({ name, purpose, accept, maxBytes, tooLarge, value, onChange, onPending }: {
  name: string;
  purpose: FilePurpose;
  accept: string;
  maxBytes: number;
  tooLarge: string;
  value: FileValue | null;
  onChange: (value: FileValue | null) => void;
  onPending: (pending: Promise<FileValue | null> | null) => void;
}) {
  const dialog = useDialog();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<Busy | null>(null);

  const pick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > maxBytes) { void dialog.error('파일을 올리지 못했습니다', tooLarge); return; }

    setBusy({ kind: 'uploading', name: file.name, percent: 0 });
    const pending = uploadFile(
      file, purpose,
      (percent) => setBusy({ kind: 'uploading', name: file.name, percent }),
      () => setBusy({ kind: 'processing', name: file.name }),
    ).then((info): FileValue => {
      const next = { id: info.id, name: info.original_name || file.name, size: info.public_size_bytes ?? null, preview_url: info.preview_url, warnings: info.warnings ?? [] };
      onChange(next);
      return next;
    }).catch((err: unknown) => {
      void dialog.error('파일을 올리지 못했습니다', err instanceof ApiError ? err.message : undefined);
      return null;
    }).finally(() => { setBusy(null); onPending(null); });
    onPending(pending);
  };

  const status = busy
    ? (busy.kind === 'uploading' ? `올리는 중 ${busy.percent}%` : '처리 중')
    : value ? formatSize(value.size) : '';

  return (
    <span className={styles.upload}>
      <span className={styles.file} data-state={busy ? 'busy' : value ? 'ready' : 'empty'}>
        <input ref={input} type="file" name={name} accept={accept} onChange={pick} disabled={!!busy} tabIndex={value || busy ? -1 : 0} />
        {!value && !busy && <span className={styles.button}>파일 선택</span>}
        <span className={value || busy ? styles.chosen : styles.name}>{busy?.name ?? value?.name ?? '선택한 파일 없음'}</span>
        {status && <span className={styles.status}>{status}</span>}
        {value && !busy && (
          <span className={styles.change}>
            <button type="button" className="admin-text-button" onClick={() => input.current?.click()}>바꾸기</button>
            <button type="button" className="admin-text-button" onClick={() => onChange(null)}>빼기</button>
          </span>
        )}
      </span>
      {value?.preview_url && !busy && <img className={styles.preview} src={value.preview_url} alt="" />}
    </span>
  );
}
