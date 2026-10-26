/** api.md에 적힌 응답 모양 (쓰는 것만). */
export type Common = { id: string; hidden: boolean; sort_order: number; version: number; updated_at: string };

export type Presenter = { person_id: string } | { name: string };
export type Seminar = Common & {
  date: string;
  presenter: Presenter;
  title: string;
  summary: string;
  area_id: string | null;
  pdf_file_id: string | null;
  cover_file_id: string | null;
  highlight: boolean;
};
export type SeminarArea = Common & { name: string; seminar_count: number };
export type PickerPerson = { id: string; name: string; name_ko: string; group: string };

export type System = {
  storage: { connected: boolean };
  last_publish?: LastRun | null;
  last_backup?: LastRun | null;
  limits: { seminar_pdf_upload_mb: number; seminar_pdf_public_mb: number; photo_mb: number; photo_types: string[] };
  password_rule: string;
};

/** 앨범 행사 (api.md 6장). 목록에서는 photos 없이 photo_count만 옵니다. */
export type Album = Common & {
  slug: string;
  date: string; // YYYY-MM-DD 또는 YYYY-MM
  title: string;
  cover_photo_id: string | null;
  photo_count: number;
  photos?: AlbumPhoto[];
};
export type AlbumPhoto = Common & { file_id: string; preview_url: string | null; alt: string };

/** 첫 화면 사진 (api.md 7장). note는 관리 화면에서만 보입니다. */
export type HomeSlide = Common & { file_id: string; preview_url: string | null; note: string };

/** GET /system의 마지막 반영·백업 (api.md 4장). */
export type LastRun = { id?: string; state: 'queued' | 'running' | 'done' | 'failed'; finished_at: string | null; message?: string | null };
