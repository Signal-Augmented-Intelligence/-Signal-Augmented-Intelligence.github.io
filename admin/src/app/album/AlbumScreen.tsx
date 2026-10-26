'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import { Section } from '@/components/Section';
import { useDialog } from '@admin/components/Dialog';
import list from '@admin/components/List.module.css';
import { api, ApiError, type Publish, signedOut } from '@admin/lib/api';
import { errorBody } from '@admin/lib/errors';
import { formatDay } from '@admin/lib/format';
import type { Album, System } from '@admin/lib/types';
import { usePublish } from '@admin/lib/usePublish';
import { AlbumForm } from './AlbumForm';
import { AlbumPhotos } from './AlbumPhotos';
import styles from './album.module.css';

/**
 * Album 한 화면 (규칙 문서 3-1, api.md 6장).
 * 행사 목록(날짜 최신순), 목록 위에서 행사 추가, 줄의 "사진"으로 그 자리에서 펼쳐 사진을 다루고, "고치기"로 날짜·이름을 고칩니다.
 * 공개 사이트에는 숨기지 않은 사진이 1장 이상인 행사만 나옵니다.
 */
const HIDE_BODY = '숨기면 공개 사이트에서 이 행사가 보이지 않습니다. 원본은 남아 있어 다시 보이게 할 수 있습니다.';

const byDate = (a: Album, b: Album) => b.date.localeCompare(a.date);

export function AlbumScreen() {
  const dialog = useDialog();
  const { publishing, track } = usePublish();
  const [system, setSystem] = useState<System | null>(null);
  const [albums, setAlbums] = useState<Album[] | null>(null);
  const [editing, setEditing] = useState<string | null>(null); // 'new' 또는 행사 id
  const [opened, setOpened] = useState<string | null>(null); // 사진을 펼친 행사 id
  const [busyRow, setBusyRow] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [sys, list] = await Promise.all([api.get<System>('/system'), api.get<Album[]>('/albums')]);
      setSystem(sys.data);
      setAlbums([...list.data].sort(byDate));
    } catch (err) {
      if (signedOut(err)) return;
      if (await dialog.error('불러오지 못했습니다', errorBody(err), { retry: true })) void load();
    }
  }, [dialog]);

  useEffect(() => { void load(); }, [load]);

  const replace = useCallback((a: Album) => setAlbums((l) => l && [a, ...l.filter((x) => x.id !== a.id)].sort(byDate)), []);
  const fromPhotos = useCallback((a: Album) => setAlbums((l) => l && l.map((x) => (x.id === a.id ? { ...x, ...a, photos: undefined } : x))), []);

  if (!system || !albums) return <p className="admin-muted">불러오는 중입니다.</p>;

  const saved = (a: Album, publish?: Publish) => {
    const isNew = editing === 'new';
    replace({ ...a, photo_count: a.photo_count ?? 0 });
    track(a.id, publish);
    setEditing(null);
    if (isNew) setOpened(a.id); // 새 행사는 바로 사진을 올릴 수 있게 펼칩니다.
  };

  const setHidden = async (a: Album, hidden: boolean) => {
    if (hidden && !(await dialog.confirm('행사를 숨길까요?', HIDE_BODY, '숨기기'))) return;
    setBusyRow(a.id);
    try {
      const res = await api.patch<Album>(`/albums/${a.id}`, { hidden, version: a.version });
      replace({ ...a, ...res.data });
      track(a.id, res.publish);
    } catch (err) {
      if (signedOut(err)) return;
      await dialog.error('저장하지 못했습니다', errorBody(err));
      if (err instanceof ApiError && err.code === 'CONFLICT') void load();
    } finally {
      setBusyRow(null);
    }
  };

  const status = (a: Album) => publishing(a.id) ? '반영 중' : a.hidden ? '숨김' : '공개 중';

  return (
    <Section title="행사" aside={editing !== 'new' && (
      <button type="button" className="admin-text-button" onClick={() => setEditing('new')}>행사 추가</button>
    )}>
      {editing === 'new' && (
        <div className={`${list.open} ${styles.form}`}>
          <AlbumForm onSaved={saved} onCancel={() => setEditing(null)} onConflict={load} />
        </div>
      )}
      {albums.length === 0 && editing !== 'new' ? (
        <p className="admin-muted">아직 등록된 행사가 없습니다.</p>
      ) : (
        <ul className={list.list}>
          {albums.map((a) => editing === a.id ? (
            <li key={a.id} className={`${list.open} ${styles.form}`}>
              <AlbumForm album={a} onSaved={saved} onCancel={() => setEditing(null)} onConflict={load} />
            </li>
          ) : (
            <Fragment key={a.id}>
              <li className={list.row}>
                <div className={list.main}>
                  <p className={list.title}>{a.title}</p>
                  <p className={list.meta}>
                    <span className="num">{formatDay(a.date)}</span>
                    <span>사진 <span className="num">{a.photo_count}</span>장</span>
                  </p>
                </div>
                <span className={list.status}>{status(a)}</span>
                <span className={list.actions}>
                  <button type="button" className="admin-text-button" aria-expanded={opened === a.id} onClick={() => setOpened(opened === a.id ? null : a.id)}>
                    {opened === a.id ? '사진 접기' : '사진'}
                  </button>
                  <button type="button" className="admin-text-button" disabled={busyRow === a.id || editing !== null} onClick={() => setEditing(a.id)}>고치기</button>
                  {a.hidden
                    ? <button type="button" className="admin-text-button" disabled={busyRow === a.id} onClick={() => setHidden(a, false)}>다시 보이기</button>
                    : <button type="button" className="admin-text-button" disabled={busyRow === a.id} onClick={() => setHidden(a, true)}>숨기기</button>}
                </span>
              </li>
              {opened === a.id && (
                <li className={list.open}>
                  <AlbumPhotos albumId={a.id} system={system} onAlbum={fromPhotos} track={track} />
                </li>
              )}
            </Fragment>
          ))}
        </ul>
      )}
    </Section>
  );
}

