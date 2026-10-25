/**
 * 관리 서버 API 연결 (계약: admin/docs/api.md 1장).
 * - 주소는 같은 origin의 /api/v1/. GitHub 등 다른 곳에는 요청하지 않고, 토큰도 갖지 않습니다.
 * - 바꾸는 요청에는 GET /session에서 받은 CSRF 토큰을 X-CSRF-Token으로 붙입니다.
 * - 성공은 `{ data, publish? }`, 실패는 `{ error: { code, message, fields? } }`를 ApiError로 바꿉니다.
 * - 관리 서버에 연결되지 않으면 code "NETWORK"인 ApiError를 던집니다.
 */

const BASE = '/api/v1';

export type ErrorCode =
  | 'VALIDATION_FAILED' | 'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT'
  | 'FILE_TOO_LARGE' | 'UNSUPPORTED_FILE' | 'RATE_LIMITED' | 'STORAGE_UNAVAILABLE' | 'INTERNAL'
  | 'NETWORK';

export class ApiError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly status: number,
    public readonly fields: Record<string, string> = {},
  ) {
    super(message);
  }
}

/** 저장 응답에 붙는 공개 반영 정보 (api.md 4장). */
export type Publish = { id: string; state: 'queued' | 'running' | 'done' | 'failed'; message?: string | null };
export type Result<T> = { data: T; publish?: Publish };

const NETWORK_MESSAGE = '관리 서버에 연결할 수 없습니다. 공개 사이트는 그대로 보입니다.';
const FALLBACK_MESSAGE = '요청을 처리하지 못했습니다. 잠시 뒤 다시 시도해 주세요.';

let csrfToken = '';
/** GET /session 응답에서 받은 CSRF 토큰을 기억합니다. 로그인·로그아웃 뒤에도 다시 넣습니다. */
export function setCsrfToken(token: string) {
  csrfToken = token;
}

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

async function request<T>(method: Method, path: string, body?: unknown): Promise<Result<T>> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  let payload: BodyInit | undefined;
  if (body instanceof FormData) payload = body;
  else if (body !== undefined) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }
  if (method !== 'GET' && csrfToken) headers['X-CSRF-Token'] = csrfToken;

  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, { method, headers, body: payload, credentials: 'same-origin' });
  } catch {
    throw new ApiError('NETWORK', NETWORK_MESSAGE, 0);
  }
  if (response.status === 204) return { data: undefined as T };

  let json: unknown = null;
  try { json = await response.json(); } catch { /* 본문 없음 */ }

  if (!response.ok) {
    const error = (json as { error?: { code?: ErrorCode; message?: string; fields?: Record<string, string> } } | null)?.error;
    throw new ApiError(error?.code ?? 'INTERNAL', error?.message ?? FALLBACK_MESSAGE, response.status, error?.fields ?? {});
  }
  return json as Result<T>;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
