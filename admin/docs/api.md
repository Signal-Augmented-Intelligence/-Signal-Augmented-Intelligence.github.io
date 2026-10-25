# 관리 서버 API

관리 화면(이 폴더의 앱)과 관리 서버(`sai-lab-admin`)가 주고받는 방식입니다. **이 문서가 원본입니다.** 관리 화면과 관리 서버는 모두 이 문서를 기준으로 만들고, API를 바꿀 때는 이 문서를 먼저 고칩니다.

- 용어: `SAI-Lab-서버-제작.md` 3장 (멤버, 사이트 관리자, 서버 담당자 / 관리 화면, 관리 서버, 공개 사이트)
- 화면 규칙: `SAI-Lab-관리화면-규칙-제안.md` 1부 (오류는 팝업, 성공은 알림 없이 바뀐 화면으로)
- 상태: 1차 (13장 3~5단계: 로그인·계정, 공개 반영·시스템 상태, 앨범·첫 화면 사진·세미나·세미나 분야). 2차 화면(멤버, 논문, News, 연구 분야, 랩 정보·시, 교수님, 변경 기록)은 그 단계에서 같은 틀로 덧붙입니다.

---

## 1. 공통 규칙

### 주소와 형식
- 모든 API는 관리 화면과 같은 주소의 `/api/v1/` 아래에 있습니다. 상태 확인만 `/health`입니다.
- 요청·응답은 JSON(UTF-8)입니다. 파일 올리기만 `multipart/form-data`입니다.
- 주소는 영문 소문자 복수형, JSON 필드는 `snake_case`입니다. 필드 이름은 공개 사이트 데이터(`content/*.yml`)와 맞춥니다.
- 날짜만 있는 값은 `YYYY-MM-DD`이고, 아는 만큼만 적은 값은 `YYYY` 또는 `YYYY-MM`입니다. 시각은 시간대를 포함한 ISO 8601입니다(`2026-10-25T17:30:00+09:00`).
- `id`는 관리 서버가 만드는 문자열입니다. 공개 사이트 주소에 쓰는 값(`slug`)은 `id`와 따로 둡니다.

### 메서드
| 동작 | 메서드 |
|---|---|
| 목록, 하나 보기 | GET |
| 추가 | POST (201) |
| 수정 | PATCH (바꾼 필드만) |
| 숨기기 / 다시 보이기 | PATCH `{ "hidden": true \| false }` |
| 순서 바꾸기 | PUT `…/order` `{ "ids": [...] }` (전체 순서) |
| 승인·반려 같은 동작 | POST `…/{id}/approve` 처럼 동사 주소 |

- **DELETE는 자료에 쓰지 않습니다**(원칙 4: 원본은 지우지 않음). 화면의 삭제는 숨기기입니다. 예외는 로그아웃(`DELETE /session`)뿐입니다.
- 목록은 숨긴 항목도 포함하고 `hidden`을 같이 줍니다. 페이지 나누기는 하지 않습니다.

### 공통 필드
편집할 수 있는 항목은 모두 아래 필드를 가집니다.

| 필드 | 형식 | 설명 |
|---|---|---|
| `id` | string | 관리 서버가 만듦 |
| `hidden` | boolean | 숨김 여부 |
| `sort_order` | number | 화면·공개 사이트 순서 (작을수록 앞) |
| `version` | number | 고칠 때마다 1씩 늘어남. 동시 수정 확인용 |
| `updated_at` | string (시각) | 마지막 수정 시각 |
| `updated_by` | string | 마지막으로 고친 계정 이름 |

### 응답 모양
- 성공: `{ "data": … }`. 목록이면 `data`가 배열입니다.
- 저장(추가·수정·숨기기·순서·승인)의 성공 응답에는 공개 반영 정보가 붙습니다: `{ "data": …, "publish": { "id": "pub_…", "state": "queued" } }` (4장).
- 실패: HTTP 상태 + `{ "error": { "code", "message", "fields"? } }`
  - `message`는 오류 팝업에 그대로 보여 줄 한국어 문장입니다.
  - `fields`는 칸별 오류입니다: `{ "title": "제목을 적어 주세요." }`. 화면은 팝업에 칸 이름과 함께 보여 주고, 닫으면 첫 칸으로 커서를 옮깁니다.

### 오류 코드
| code | HTTP | 뜻 | 화면 동작 |
|---|---|---|---|
| `VALIDATION_FAILED` | 400 | 입력이 규칙에 맞지 않음 | 오류 팝업 (`fields`) |
| `UNAUTHENTICATED` | 401 | 로그인 필요·만료 | 로그인 화면으로, 쓰던 내용은 브라우저에 임시 보관 |
| `FORBIDDEN` | 403 | 권한 없음 | 오류 팝업 |
| `NOT_FOUND` | 404 | 항목 없음 | 오류 팝업 후 목록으로 |
| `CONFLICT` | 409 | 그사이 다른 사람이 고침 (`version` 다름) | 오류 팝업 "다른 사람이 먼저 고쳤습니다. 새로 불러온 뒤 다시 고쳐 주세요." |
| `FILE_TOO_LARGE` | 413 | 파일 용량 초과 | 오류 팝업 |
| `UNSUPPORTED_FILE` | 415 | 허용하지 않는 파일 형식 | 오류 팝업 |
| `RATE_LIMITED` | 429 | 로그인 시도 너무 많음 | 오류 팝업 (`retry_after` 초) |
| `STORAGE_UNAVAILABLE` | 503 | 원본 파일 저장소(외장 디스크)가 연결되지 않음 | 오류 팝업, 파일 올리기 막음 |
| `INTERNAL` | 500 | 관리 서버 오류 | 오류 팝업 |

관리 서버에 아예 연결되지 않으면(네트워크 오류) 화면은 "관리 서버에 연결할 수 없습니다. 공개 사이트는 그대로 보입니다."를 오류 팝업으로 보여 줍니다.

### 로그인과 권한
- 로그인은 쿠키 세션입니다(HttpOnly, Secure, SameSite=Strict).
- 바꾸는 요청(POST·PATCH·PUT·DELETE)에는 헤더 `X-CSRF-Token`을 붙입니다. 값은 `GET /session`에서 받습니다.
- 권한은 `member`(멤버)와 `site_manager`(사이트 관리자) 둘입니다. 각 API에 필요한 권한을 적습니다. 화면은 권한에 따라 메뉴를 보이거나 숨기지만, 막는 것은 관리 서버가 합니다.

### 문서 틀
각 API는 다음 순서로 적습니다: **주소** · **권한** · **요청** · **응답** · **오류**(공통 외) · **쓰는 화면**.

---

## 2. 상태 확인

### `GET /health`
- 권한: 없음
- 응답: `200` `{ "ok": true }`
- 쓰는 곳: 랩 서버 상태 확인, 터널 연결 확인 (화면에서는 쓰지 않음)

---

## 3. 로그인과 계정 (3단계)

### `GET /api/v1/session` — 현재 로그인 상태
- 권한: 없음
- 응답:
  ```json
  { "data": { "user": { "id": "acc_1", "name": "박소영", "login": "soyeong", "role": "site_manager" }, "csrf_token": "…" } }
  ```
  로그인하지 않았으면 `"user": null`(200).
- 쓰는 화면: 모든 화면을 열 때 (메뉴·헤더의 이름)

### `POST /api/v1/session` — 로그인
- 권한: 없음 (CSRF 토큰은 `GET /session`에서 받은 것)
- 요청: `{ "login": "soyeong", "password": "…" }`
- 응답: `200` `GET /session`과 같은 모양
- 오류: `VALIDATION_FAILED`(아이디·비밀번호 틀림 — 어느 쪽이 틀렸는지 알리지 않음), `RATE_LIMITED`(여러 번 실패해 잠김), 계정 잠금은 `FORBIDDEN`
- 쓰는 화면: 로그인

### `DELETE /api/v1/session` — 로그아웃
- 권한: 로그인한 사용자
- 응답: `204`
- 쓰는 화면: 헤더의 "로그아웃"

### `POST /api/v1/session/password` — 내 비밀번호 바꾸기
- 권한: 로그인한 사용자
- 요청: `{ "current_password": "…", "new_password": "…" }`
- 응답: `204`
- 오류: `VALIDATION_FAILED` (`current_password` 틀림, `new_password` 규칙 미달 — 규칙은 `GET /system`의 `password_rule`)
- 쓰는 화면: 비밀번호 바꾸기

### 계정 (`/api/v1/accounts`) — 사이트 관리자만
계정 필드: `id`, `name`(표시 이름), `login`, `role`(`member` / `site_manager`), `locked`(boolean), `person_id`(멤버 데이터와 연결, 없으면 null), `last_login_at`, 공통 필드.

| 주소 | 설명 | 요청 | 응답 |
|---|---|---|---|
| `GET /accounts` | 목록 | — | 계정 배열 |
| `POST /accounts` | 추가 | `{ name, login, role, person_id? }` | `201` 계정 + `temporary_password`(한 번만 보여 줌) |
| `PATCH /accounts/{id}` | 이름·권한·연결 바꾸기, 숨기기(비활성) | 바꾼 필드 + `version` | 계정 |
| `POST /accounts/{id}/unlock` | 잠금 해제 | — | 계정 |
| `POST /accounts/{id}/reset-password` | 비밀번호 초기화 | — | `{ temporary_password }` (한 번만) |

- 숨긴 계정은 로그인할 수 없습니다. 자기 계정은 숨기거나 권한을 낮출 수 없습니다(`FORBIDDEN`).
- 사이트 관리자가 한 명도 남지 않게 되는 변경은 막습니다(`VALIDATION_FAILED`).
- 쓰는 화면: 운영 › 계정

---

## 4. 공개 반영과 시스템 상태 (4단계)

### 반영 정보 (`publish`)
저장 응답의 `publish`와 아래 API가 같은 모양을 씁니다.

```json
{ "id": "pub_20261025_173000", "state": "running", "requested_at": "…", "finished_at": null, "message": null }
```
- `state`: `queued`(대기) → `running`(공개 사이트 만드는 중) → `done`(공개 사이트에 보임) / `failed`(실패, `message`에 한국어 사유)
- 짧은 시간에 저장이 여러 번 오면 관리 서버가 한 번의 반영으로 묶을 수 있습니다. 그때는 여러 저장 응답이 같은 `publish.id`를 받습니다.

### `GET /api/v1/publish/{id}` — 반영 하나의 상태
- 권한: 로그인한 사용자
- 응답: 반영 정보
- 화면: 저장 직후 몇 초 간격으로 묻고, `failed`면 오류 팝업("공개 사이트에 반영하지 못했습니다. 저장한 내용은 남아 있습니다." + "다시 반영")을 띄웁니다. `done`이면 알림 없이 "반영 중" 글자만 없앱니다.

### `POST /api/v1/publish` — 다시 반영
- 권한: 사이트 관리자
- 요청: 없음 (현재 저장된 내용 전체로 다시 반영)
- 응답: `202` 반영 정보
- 쓰는 화면: 오류 팝업의 "다시 반영", 첫 화면

### `GET /api/v1/system` — 시스템 상태와 제한값
- 권한: 로그인한 사용자
- 응답:
  ```json
  { "data": {
      "storage": { "connected": true },
      "last_publish": { "id": "…", "state": "done", "finished_at": "…" },
      "last_backup": { "state": "done", "finished_at": "…" },
      "pending_seminars": 2,
      "limits": { "seminar_pdf_mb": 20, "photo_mb": 30, "photo_types": ["image/jpeg","image/png","image/webp","image/heic"] },
      "password_rule": "8자 이상"
  } }
  ```
  `last_backup`은 백업 기능 전(8단계)에는 `null`입니다.
- 쓰는 화면: 첫 화면, 파일 올리기 칸(제한값 안내, 저장소 연결 여부)

---

## 5. 파일 (5단계)

파일은 항목과 따로 먼저 올리고, 처리가 끝난 파일의 `id`를 항목에 넣어 저장합니다.

### `POST /api/v1/files` — 올리기
- 권한: 로그인한 사용자
- 요청: `multipart/form-data` — `file`(파일 하나), `purpose`(`album` / `home` / `seminar_pdf` / `seminar_cover` / `person` …)
- 응답: `201`
  ```json
  { "data": { "id": "file_…", "purpose": "album", "status": "processing", "original_name": "IMG_9157.HEIC", "preview_url": null } }
  ```
- 오류: `FILE_TOO_LARGE`, `UNSUPPORTED_FILE`, `STORAGE_UNAVAILABLE`
- 관리 서버가 하는 일(서버 제작 문서 7장): 회전 보정, 위치 정보 등 메타데이터 제거, 용도별 크기 맞추기, PDF 문서 정보 제거, 세미나 PDF 첫 쪽 표지 만들기, 학술 DB 다운로드 표시 확인

### `GET /api/v1/files/{id}` — 처리 상태
- 응답: `status`가 `processing` → `ready`(사용 가능, `preview_url` 있음) / `failed`(`message`)
- PDF에 학술 DB 다운로드 표시가 있으면 `ready`와 함께 `warnings: ["학술 DB에서 내려받은 표시가 있습니다. …"]`를 줍니다. 화면은 저장 전에 확인 창으로 보여 줍니다.
- `preview_url`은 관리 화면 안에서만 쓰는 주소입니다. 원본 파일 경로는 주지 않습니다.

---

## 6. 앨범 (5단계)

### 필드
| 대상 | 필드 |
|---|---|
| 행사 | `id`, `slug`(공개 주소 `/album/<slug>/`, 한 번 정하면 바꾸지 않음), `date`(`YYYY-MM-DD` / `YYYY-MM`), `title`, `cover_photo_id`(대표 사진, null이면 첫 사진), `photos`(사진 배열, 목록에서는 개수 `photo_count`만), 공통 필드 |
| 사진 | `id`, `file_id`, `preview_url`, `alt`(사진 설명), 공통 필드 |

### API
| 주소 | 권한 | 설명 | 요청 |
|---|---|---|---|
| `GET /albums` | 사이트 관리자 | 행사 목록 (최신 날짜 먼저) | — |
| `POST /albums` | 사이트 관리자 | 행사 추가 | `{ date, title, slug? }` (`slug` 없으면 날짜·제목으로 만듦) |
| `GET /albums/{id}` | 사이트 관리자 | 행사와 사진 전체 | — |
| `PATCH /albums/{id}` | 사이트 관리자 | 날짜·제목·대표 사진·숨기기 | 바꾼 필드 + `version` |
| `POST /albums/{id}/photos` | 사이트 관리자 | 사진 추가 (여러 장) | `{ photos: [{ file_id, alt? }] }` |
| `PATCH /albums/{id}/photos/{photo_id}` | 사이트 관리자 | 설명 바꾸기·숨기기 | 바꾼 필드 + `version` |
| `PUT /albums/{id}/photos/order` | 사이트 관리자 | 사진 순서 | `{ ids: [...] }` |

- 대표 사진으로 숨긴 사진을 고를 수 없습니다(`VALIDATION_FAILED`). 대표 사진을 숨기면 `cover_photo_id`가 null(첫 사진)로 돌아갑니다.
- 공개 사이트에는 숨기지 않은 사진이 1장 이상인 행사만 나옵니다.
- 쓰는 화면: 내용 › 앨범 (목록, 행사 편집)

---

## 7. 첫 화면 사진 (5단계)

필드: `id`, `file_id`, `preview_url`, `note`(사이트 관리자용 메모, 공개되지 않음), 공통 필드

| 주소 | 권한 | 설명 | 요청 |
|---|---|---|---|
| `GET /home-slides` | 사이트 관리자 | 목록 (공개 순서대로) | — |
| `POST /home-slides` | 사이트 관리자 | 추가 | `{ file_id, note? }` (파일 `purpose: home`) |
| `PATCH /home-slides/{id}` | 사이트 관리자 | 메모·숨기기 | 바꾼 필드 + `version` |
| `PUT /home-slides/order` | 사이트 관리자 | 순서 | `{ ids: [...] }` |

- 쓰는 화면: 내용 › 첫 화면 사진

---

## 8. 세미나 (5단계)

### 필드
| 필드 | 형식 | 설명 |
|---|---|---|
| `date` | `YYYY-MM-DD` | 세미나 날짜 |
| `presenter` | `{ "person_id": "…" }` 또는 `{ "name": "외부 발표자 이름" }` | 둘 중 하나 |
| `title`, `summary` | string | 필수. 개요는 한 문장 |
| `area_id` | string \| null | 세미나 분야 (9장) |
| `pdf_file_id`, `cover_file_id` | string \| null | 파일 `purpose: seminar_pdf` / `seminar_cover`. 표지가 없으면 관리 서버가 PDF 첫 쪽으로 만든 것 |
| `highlight` | boolean | 공개 사이트 첫 화면에 보일지 (사이트 관리자만 바꿈) |
| `status` | `pending` / `approved` / `rejected` | 승인 상태. 공개 사이트에는 `approved`이고 숨기지 않은 것만 |
| `submitted_by` | string | 올린 계정 이름 |
| `review_note` | string \| null | 반려 사유 (올린 사람에게 보임) |
| 공통 필드 | | |

### API
| 주소 | 권한 | 설명 | 요청 |
|---|---|---|---|
| `GET /seminars` | 멤버 / 사이트 관리자 | 목록. 멤버에게는 자기가 올린 것만, 사이트 관리자에게는 전부 | `?status=pending` 등으로 거르기 가능 |
| `POST /seminars` | 멤버 / 사이트 관리자 | 올리기. 멤버가 올리면 `pending`, 사이트 관리자가 올리면 바로 `approved` | 필드 (`status`, `highlight` 제외) |
| `GET /seminars/{id}` | 올린 사람 / 사이트 관리자 | 하나 보기 | — |
| `PATCH /seminars/{id}` | 올린 사람(`pending`·`rejected`일 때만) / 사이트 관리자 | 수정·숨기기. 반려된 것을 멤버가 고치면 다시 `pending` | 바꾼 필드 + `version` |
| `POST /seminars/{id}/approve` | 사이트 관리자 | 승인 → 공개 반영 | `{ highlight?: boolean, version }` |
| `POST /seminars/{id}/reject` | 사이트 관리자 | 반려 (공개되지 않음) | `{ review_note, version }` |

- 지금의 업로드 페이지(Apps Script 중계)를 대신합니다(서버 제작 문서 10장).
- 쓰는 화면: 내용 › 세미나 (멤버: 내 세미나 올리기·고치기), 운영 › 세미나 승인

---

## 9. 세미나 분야 (5단계)

필드: `id`, `name`(공개 사이트에 보이는 이름), `seminar_count`(읽기 전용), 공통 필드

| 주소 | 권한 | 설명 | 요청 |
|---|---|---|---|
| `GET /seminar-areas` | 로그인한 사용자 | 목록 (세미나 올리기의 선택 칸에도 씀) | — |
| `POST /seminar-areas` | 사이트 관리자 | 추가 | `{ name }` |
| `PATCH /seminar-areas/{id}` | 사이트 관리자 | 이름 바꾸기·숨기기 | 바꾼 필드 + `version` |
| `PUT /seminar-areas/order` | 사이트 관리자 | 순서 | `{ ids: [...] }` |

- 이름이 같은 분야는 만들 수 없습니다(`VALIDATION_FAILED`).
- 숨긴 분야는 올리기 선택 칸에 나오지 않습니다. 이미 그 분야인 세미나는 그대로 두고 공개 사이트 Areas 목록에서만 빠집니다.
- 쓰는 화면: 내용 › 세미나 분야, 세미나 올리기

---

## 10. 발표자 선택용 멤버 목록 (5단계, 읽기만)

### `GET /api/v1/people?view=picker`
- 권한: 로그인한 사용자
- 응답: `[{ "id", "name", "name_ko", "group" }]` (숨기지 않은 멤버와 교수님, 졸업생 포함)
- 쓰는 화면: 세미나 올리기의 발표자 선택. 멤버 편집 API는 6단계에서 덧붙입니다.

---

## 11. 변경 기록

| 날짜 | 내용 |
|---|---|
| 2026-10-25 | 처음 작성: 공통 규칙, 상태 확인, 로그인·계정, 공개 반영·시스템, 파일, 앨범, 첫 화면 사진, 세미나, 세미나 분야, 발표자 목록 |
