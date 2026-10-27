'use client';

import { createContext, type FormEvent, type ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Section } from '@/components/Section';
import { api, ApiError, setCsrfToken, setUnauthenticatedHandler, signedOut } from '@admin/lib/api';
import { errorBody, fieldList } from '@admin/lib/errors';
import { clearLocalWork } from '@admin/lib/edit';
import type { System } from '@admin/lib/types';
import { useDialog } from './Dialog';
import { Field, focusField } from './Field';
import styles from './Dialog.module.css';
import formStyles from './Field.module.css';

/**
 * 로그인 상태 (api.md 1장 "로그인", 3장). 랩 공용 계정 하나라 비밀번호만 받습니다.
 * - 화면을 열면 GET /session으로 로그인 여부와 CSRF 토큰을 받습니다.
 * - 로그인 전이거나 어느 요청이든 401이 오면, 메뉴 대신 그 자리에 로그인 칸이 나옵니다(따로 화면을 두지 않음).
 *   세션이 만료됐을 때는 각 폼의 임시 입력을 이어서 씁니다. 명시적으로 로그아웃하면 공용 컴퓨터의 임시 입력을 지웁니다.
 * - 로그아웃, 비밀번호 바꾸기(팝업)는 헤더에서 부릅니다.
 */
type State = 'checking' | 'in' | 'out';
type Session = { state: State; login: (password: string) => Promise<void>; logout: () => Promise<void>; changePassword: () => void };

const SessionContext = createContext<Session | null>(null);

export function useSession(): Session {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useSession must be used inside <SessionProvider>');
  return session;
}

type SessionData = { logged_in: boolean; csrf_token: string };

export function SessionProvider({ children }: { children: ReactNode }) {
  const dialog = useDialog();
  const [state, setState] = useState<State>('checking');
  const [changing, setChanging] = useState(false);

  const apply = (data: SessionData) => {
    setCsrfToken(data.csrf_token);
    setState(data.logged_in ? 'in' : 'out');
  };

  const check = useCallback(async () => {
    try {
      apply((await api.get<SessionData>('/session')).data);
    } catch (err) {
      if (await dialog.error('불러오지 못했습니다', errorBody(err), { retry: true })) void check();
    }
  }, [dialog]);

  useEffect(() => {
    // 로그인이 풀린 뒤에는 로그인 칸을 보이고, 다음 로그인에 쓸 CSRF 토큰을 새로 받습니다.
    setUnauthenticatedHandler(() => { setState('out'); void check(); });
    void check();
  }, [check]);

  const login = async (password: string) => {
    apply((await api.post<SessionData>('/session', { password })).data);
  };

  const logout = async () => {
    try {
      await api.delete('/session');
    } catch (err) {
      if (!signedOut(err)) { await dialog.error('로그아웃하지 못했습니다', errorBody(err)); return; }
    }
    clearLocalWork();
    setState('out');
    void check();
  };

  return (
    <SessionContext.Provider value={{ state, login, logout, changePassword: () => setChanging(true) }}>
      {children}
      {changing && <PasswordDialog onClose={() => setChanging(false)} />}
    </SessionContext.Provider>
  );
}

/** 로그인 전에 각 화면 본문 자리에 나오는 로그인 칸. 제목 아래 선도 폼 폭(40rem)까지만 둡니다. */
export function LoginForm() {
  const dialog = useDialog();
  const { login } = useSession();
  const form = useRef<HTMLFormElement>(null);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!password) {
      await dialog.error('로그인하지 못했습니다', '비밀번호를 적어 주세요.');
      focusField(form.current, ['password']);
      return;
    }
    setBusy(true);
    try {
      await login(password);
    } catch (err) {
      await dialog.error('로그인하지 못했습니다', err instanceof ApiError && err.fields.password ? err.fields.password : errorBody(err));
      setPassword('');
      focusField(form.current, ['password']);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={formStyles.narrow}>
    <Section title="로그인">
      <form ref={form} className="admin-form" onSubmit={submit} noValidate>
        <Field label="비밀번호">
          <input type="password" name="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
        </Field>
        <div className="admin-actions">
          <button type="submit" className="admin-button" disabled={busy}>{busy ? '로그인 중' : '로그인'}</button>
        </div>
      </form>
    </Section>
    </div>
  );
}

const PASSWORD_LABELS = { current_password: '지금 비밀번호', new_password: '새 비밀번호', new_password_confirm: '새 비밀번호 확인' };
const PASSWORD_EMPTY: Record<keyof typeof PASSWORD_LABELS, string> = {
  current_password: '지금 비밀번호를 적어 주세요.',
  new_password: '새 비밀번호를 적어 주세요.',
  new_password_confirm: '새 비밀번호를 한 번 더 적어 주세요.',
};

/**
 * 헤더의 "비밀번호 바꾸기" 팝업 (api.md 3장). 바꾸면 알림 없이 닫힙니다.
 * 이 창은 로그인이 유지되고, 다른 곳의 로그인은 관리 서버가 끊습니다.
 * 랩 공용 계정 하나라 잘못 치면 모두 로그인하지 못하므로, 새 비밀번호를 한 번 더 받아 같은지 화면에서 확인합니다(서버로는 보내지 않음).
 */
function PasswordDialog({ onClose }: { onClose: () => void }) {
  const dialog = useDialog();
  const ref = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [rule, setRule] = useState('');
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    ref.current?.showModal();
    api.get<System>('/system').then((res) => setRule(res.data.password_rule)).catch(() => { /* 규칙 글자만 빠짐 */ });
  }, []);

  const close = () => { ref.current?.close(); onClose(); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const empty = [!current && 'current_password', !next && 'new_password', !confirm && 'new_password_confirm'].filter((x): x is keyof typeof PASSWORD_LABELS => !!x);
    if (empty.length > 0) {
      const lines = empty.map((k) => PASSWORD_EMPTY[k]);
      await dialog.error('비밀번호를 바꾸지 못했습니다', lines.length === 1 ? lines[0] : fieldList(lines));
      focusField(form.current, empty);
      return;
    }
    if (next !== confirm) {
      await dialog.error('비밀번호를 바꾸지 못했습니다', '새 비밀번호와 새 비밀번호 확인이 다릅니다. 다시 적어 주세요.');
      setConfirm('');
      focusField(form.current, ['new_password_confirm']);
      return;
    }
    setBusy(true);
    try {
      await api.post('/session/password', { current_password: current, new_password: next });
      close();
    } catch (err) {
      if (signedOut(err)) { close(); return; }
      await dialog.error('비밀번호를 바꾸지 못했습니다', errorBody(err, PASSWORD_LABELS));
      if (err instanceof ApiError) focusField(form.current, Object.keys(err.fields));
    } finally {
      setBusy(false);
    }
  };

  return (
    <dialog ref={ref} className={styles.dialog} aria-labelledby="password-title" onCancel={(e) => { e.preventDefault(); if (!busy) close(); }}>
      <h2 id="password-title" className={styles.title}>비밀번호 바꾸기</h2>
      <form ref={form} className={`admin-form ${styles.body}`} onSubmit={submit} noValidate>
        <Field label="지금 비밀번호">
          <input type="password" name="current_password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} autoFocus />
        </Field>
        <Field label="새 비밀번호" limit={rule || undefined}>
          <input type="password" name="new_password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} />
        </Field>
        <Field label="새 비밀번호 확인">
          <input type="password" name="new_password_confirm" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </Field>
        <div className={styles.actions}>
          <button type="button" className="admin-text-button" onClick={close} disabled={busy}>취소</button>
          <button type="submit" className="admin-button" disabled={busy}>{busy ? '바꾸는 중' : '바꾸기'}</button>
        </div>
      </form>
    </dialog>
  );
}
