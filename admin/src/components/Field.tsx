'use client';

import { type ChangeEvent, type ReactNode, useState } from 'react';
import styles from './Field.module.css';

/**
 * 입력 칸 묶음. 라벨은 위, 선택 항목은 "(선택)", 안내는 칸 아래 보조색 (규칙 문서 1부 4장).
 * 오류는 칸에 표시하지 않고 오류 팝업으로 알립니다. 팝업을 닫으면 `name`으로 칸을 찾아 커서를 옮깁니다.
 */
export function Field({ label, optional, hint, children }: { label: string; optional?: boolean; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="admin-field">
      <span>{label}{optional && <small> (선택)</small>}</span>
      {children}
      {hint && <span className="admin-hint">{hint}</span>}
    </label>
  );
}

/** 파일 선택 칸: "파일 선택" 버튼과 고른 파일 이름. 브라우저 기본 버튼 글자(언어별로 다름)를 쓰지 않습니다. */
export function FilePicker({ name, accept, multiple, onFiles }: { name: string; accept?: string; multiple?: boolean; onFiles?: (files: File[]) => void }) {
  const [label, setLabel] = useState('');
  const change = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setLabel(files.length === 0 ? '' : files.length === 1 ? files[0].name : `${files.length}개 파일`);
    onFiles?.(files);
  };
  return (
    <span className={styles.file}>
      <input type="file" name={name} accept={accept} multiple={multiple} onChange={change} />
      <span className={styles.button}>파일 선택</span>
      <span className={styles.name}>{label || '선택한 파일 없음'}</span>
    </span>
  );
}

/** 오류 팝업을 닫은 뒤 첫 번째 틀린 칸으로 커서를 옮깁니다. */
export function focusField(form: HTMLFormElement | null, names: string[]) {
  const first = names.map((n) => form?.elements.namedItem(n)).find((el): el is HTMLElement => el instanceof HTMLElement);
  first?.focus();
}
