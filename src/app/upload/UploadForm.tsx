'use client';

import { type FormEvent, useState } from 'react';
import styles from './upload.module.css';

const MAX_BYTES = 20 * 1024 * 1024;
const MAX_COVER_BYTES = 2 * 1024 * 1024;
const COVER_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

type Status = { kind: 'idle' | 'sending' | 'done' | 'error'; message: string; url?: string };

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = () => reject(new Error('파일을 읽지 못했습니다.'));
    reader.readAsDataURL(file);
  });
}

/** Sends the form to the Apps Script relay, which opens a pull request for the site manager. */
export function UploadForm({ endpoint, presenters, areas }: { endpoint: string; presenters: { id: string; label: string }[]; areas: string[] }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle', message: '' });
  const disabled = !endpoint || status.kind === 'sending';

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get('file');
    const pdf = file instanceof File && file.size > 0 ? file : null;
    const coverFile = data.get('cover');
    const cover = coverFile instanceof File && coverFile.size > 0 ? coverFile : null;
    if (pdf && pdf.size > MAX_BYTES) return setStatus({ kind: 'error', message: 'PDF가 20 MB를 넘습니다. 용량을 줄여서 다시 올려 주세요.' });
    if (pdf && !/\.pdf$/i.test(pdf.name)) return setStatus({ kind: 'error', message: 'PDF 파일만 올릴 수 있습니다.' });
    if (cover && !pdf) return setStatus({ kind: 'error', message: '표지 이미지를 올리려면 PDF도 함께 올려 주세요.' });
    if (cover && cover.size > MAX_COVER_BYTES) return setStatus({ kind: 'error', message: '표지 이미지가 2 MB를 넘습니다.' });
    if (cover && !COVER_TYPES.includes(cover.type)) return setStatus({ kind: 'error', message: '표지는 JPG, PNG, WebP 이미지만 올릴 수 있습니다.' });

    setStatus({ kind: 'sending', message: '보내는 중입니다.' });
    try {
      const payload = {
        code: String(data.get('code') ?? ''),
        date: String(data.get('date') ?? ''),
        presenter: String(data.get('presenter') ?? ''),
        title: String(data.get('title') ?? '').trim(),
        summary: String(data.get('summary') ?? '').trim(),
        area: String(data.get('area') ?? '').trim(),
        file: pdf ? await toBase64(pdf) : '',
        cover: cover ? await toBase64(cover) : '',
        cover_type: cover?.type ?? '',
      };
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
      const reply = (await response.json()) as { ok: boolean; url?: string; error?: string };
      if (!reply.ok) return setStatus({ kind: 'error', message: reply.error ?? '제출하지 못했습니다.' });
      form.reset();
      setStatus({ kind: 'done', message: '접수되었습니다. 관리자 확인 후 반영됩니다.', url: reply.url });
    } catch (error) {
      setStatus({ kind: 'error', message: `제출하지 못했습니다: ${(error as Error).message}` });
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} lang="ko" aria-disabled={!endpoint}>
      {!endpoint && <p className={styles.notice}>업로드 주소가 아직 설정되지 않았습니다. 관리자에게 문의해 주세요.</p>}
      <label className={styles.field}>
        <span>업로드 코드</span>
        <input type="password" name="code" required autoComplete="off" />
      </label>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>게시물 날짜</span>
          <input type="date" name="date" required />
        </label>
        <label className={styles.field}>
          <span>발표자</span>
          <select name="presenter" required defaultValue="">
            <option value="" disabled>선택</option>
            {presenters.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </label>
      </div>
      <label className={styles.field}>
        <span>제목</span>
        <input type="text" name="title" required maxLength={200} />
      </label>
      <label className={styles.field}>
        <span>개요 한 문장</span>
        <input type="text" name="summary" required maxLength={300} />
      </label>
      <label className={styles.field}>
        <span>분야 <small>(선택, 입력한 분야가 Seminars의 Areas에 표시됩니다)</small></span>
        <input type="text" name="area" list="seminar-areas" maxLength={80} />
        <datalist id="seminar-areas">{areas.map((area) => <option key={area} value={area} />)}</datalist>
      </label>
      <label className={styles.field}>
        <span>PDF <small>(선택, 20 MB 이하)</small></span>
        <input type="file" name="file" accept="application/pdf,.pdf" />
      </label>
      <label className={styles.field}>
        <span>PDF 표지 이미지 <small>(선택, JPG·PNG·WebP, 2 MB 이하)</small></span>
        <input type="file" name="cover" accept="image/jpeg,image/png,image/webp" />
      </label>
      <div className={styles.actions}>
        <button type="submit" disabled={disabled}>{status.kind === 'sending' ? '보내는 중' : '제출'}</button>
        <p role="status" aria-live="polite" className={status.kind === 'error' ? styles.error : styles.status}>
          {status.message}
          {status.url && <> <a href={status.url}>요청 보기</a></>}
        </p>
      </div>
    </form>
  );
}
