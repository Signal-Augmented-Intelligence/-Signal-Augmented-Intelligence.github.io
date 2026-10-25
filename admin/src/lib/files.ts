import { api, ApiError } from './api';

/** 파일 (api.md 5장). 항목과 따로 먼저 올리고, ready가 된 파일의 id를 항목에 넣어 저장합니다. */
export type FilePurpose = 'album' | 'home' | 'seminar_pdf' | 'seminar_cover' | 'person';
export type FileInfo = {
  id: string;
  purpose: FilePurpose;
  status: 'processing' | 'ready' | 'failed';
  original_name: string;
  preview_url: string | null;
  public_size_bytes?: number | null;
  message?: string | null;
  warnings?: string[];
};

const POLL_MS = 1000;

/** 올리고, 처리가 끝날 때까지 기다립니다. 처리 실패는 ApiError로 던집니다. */
export async function uploadFile(file: File, purpose: FilePurpose, onProgress: (percent: number) => void, onProcessing: () => void): Promise<FileInfo> {
  const form = new FormData();
  form.append('file', file);
  form.append('purpose', purpose);
  const { data } = await api.upload<FileInfo>('/files', form, onProgress);
  onProcessing();
  let info = data;
  while (info.status === 'processing') {
    await new Promise((r) => setTimeout(r, POLL_MS));
    info = (await api.get<FileInfo>(`/files/${info.id}`)).data;
  }
  if (info.status === 'failed') throw new ApiError('UNSUPPORTED_FILE', info.message || '파일을 처리하지 못했습니다.', 200);
  return info;
}

export const getFile = async (id: string) => (await api.get<FileInfo>(`/files/${id}`)).data;

/** 8.4 MB, 820 KB */
export function formatSize(bytes: number | null | undefined): string {
  if (!bytes) return '';
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
