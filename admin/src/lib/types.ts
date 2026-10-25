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
  limits: { seminar_pdf_upload_mb: number; seminar_pdf_public_mb: number; photo_mb: number; photo_types: string[] };
  password_rule: string;
};
