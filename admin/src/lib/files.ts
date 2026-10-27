import { api, ApiError } from './api';

/** 파일 (api.md 5장). 항목과 따로 먼저 올리고, ready가 된 파일의 id를 항목에 넣어 저장합니다. */
export type FilePurpose = 'album' | 'home' | 'seminar_pdf' | 'seminar_cover' | 'person' | 'research_figure' | 'publication_pdf';
export type FileInfo = {
  id: string;
  purpose: FilePurpose;
  status: 'processing' | 'ready' | 'failed';
  original_name: string;
  preview_url: string | null;
  content_url?: string | null;
  public_size_bytes?: number | null;
  message?: string | null;
  warnings?: string[];
};

const POLL_MS = 1000;

/**
 * 올리고, 처리가 끝날 때까지 기다립니다. 처리 실패는 code "FILE_FAILED"인 ApiError로 던집니다.
 * onProcessing에는 처리 중인 파일 정보를 넘깁니다. 이때부터는 id로 다시 기다릴 수 있습니다(waitForFile).
 */
export async function uploadFile(file: File, purpose: FilePurpose, onProgress: (percent: number) => void, onProcessing: (info: FileInfo) => void): Promise<FileInfo> {
  const form = new FormData();
  form.append('file', file);
  form.append('purpose', purpose);
  const { data } = await api.upload<FileInfo>('/files', form, onProgress);
  if (data.status === 'processing') onProcessing(data);
  return waitForFile(data);
}

/** 처리 중인 파일이 ready 또는 failed가 될 때까지 묻습니다. 새로고침 뒤 처리 중이던 파일을 이어서 기다릴 때도 씁니다. */
export async function waitForFile(start: Pick<FileInfo, 'id' | 'status'> & Partial<FileInfo>): Promise<FileInfo> {
  let info = start;
  while (info.status === 'processing') {
    await new Promise((r) => setTimeout(r, POLL_MS));
    info = (await api.get<FileInfo>(`/files/${info.id}`)).data;
  }
  if (info.status === 'failed') throw new ApiError('FILE_FAILED', info.message || '파일을 처리하지 못했습니다.', 200);
  return info as FileInfo;
}

export const getFile = async (id: string) => (await api.get<FileInfo>(`/files/${id}`)).data;

/** 8.4 MB, 820 KB */
export function formatSize(bytes: number | null | undefined): string {
  if (!bytes) return '';
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
