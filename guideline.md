# SAI Lab 웹사이트 가이드라인

SAI Lab (Signal Augmented Intelligence LAB), 한신대학교 · 지도교수 김선만

이 문서는 사이트를 **만들고, 고치고, 다음 관리자에게 넘길 때** 기준으로 삼는 문서입니다. 사이트를 맡게 되면 이 문서부터 끝까지 읽어 주세요.

- 작성: 2026-10-20 (박소영) · 개정: 2026-10-21 (메뉴 구조, 교수님 페이지, 세미나 업로드, Next.js 전환)
- 상태: 3차 구현 (공개 전, `draft: true`)
- 관련 문서: `SAI-Lab-웹사이트-기획안.md` (배경·검토 과정), `SAI-Lab-웹사이트-레퍼런스와-세미나기능.md` (레퍼런스 조사)

---

## 1. 기본 정보

| 항목 | 값 |
| --- | --- |
| 연구실 | SAI Lab — Signal Augmented Intelligence |
| 소속 | Hanshin University |
| 지도교수 | Prof. Seon Man Kim (김선만) |
| GitHub 조직 | [`Signal-Augmented-Intelligence`](https://github.com/Signal-Augmented-Intelligence) |
| 사이트 저장소 | `Signal-Augmented-Intelligence/Signal-Augmented-Intelligence.github.io` |
| 사이트 주소 | `https://signal-augmented-intelligence.github.io/` |
| 세미나 PDF | 사이트 저장소 `public/files/seminars/` |
| 기술 | Next.js(React) 정적 내보내기, GitHub Pages, GitHub Actions, 업로드 중계는 Google Apps Script |

## 2. 소유와 권한

- 조직의 **Owner는 교수님**입니다. 사이트·저장소·주소는 조직 소유이므로 관리자가 바뀌어도 유지됩니다.
- **관리자**는 조직 Owner 권한으로 Pull Request를 확인·병합합니다. 졸업·이탈 시 조직에서 본인만 나가면 됩니다 (9장).
- GitHub을 쓰는 구성원은 저장소 **Write** 권한으로 웹 편집 → Pull Request. `main`은 직접 수정하지 않습니다.
- GitHub을 쓰지 않는 구성원은 계정 없이 **세미나 업로드 페이지**(`/upload/`)를 씁니다 (6장). 업로드도 Pull Request로만 들어오므로 관리자 확인 전에는 사이트에 반영되지 않습니다.
- 공용 계정은 만들지 않습니다.
- 업로드 중계 스크립트, 도메인 등 외부 서비스는 **교수님(또는 랩 공식) 명의**로 만듭니다. 학생 명의로 두면 졸업 후 끊깁니다.

## 3. 디자인 기준

메뉴와 하위 페이지 구성, 여백감은 [KAIST Smart Sound Lab](https://sound.kaist.ac.kr/)을 참고했습니다. 새 장식을 더하지 말고 아래 결을 유지합니다.

### 글자
| 요소 | 값 |
| --- | --- |
| 글꼴 | 영문 Instrument Sans, 한글 Pretendard, 수식 STIX Two Text 이탤릭. 모두 npm 패키지로 사이트에 포함 |
| 본문 | 16px, line-height 1.6 |
| 페이지 제목 | 36px, weight 650 |
| Home 랩명 | 96px, weight 600, 자간 -0.045em |
| 섹션 제목 | 18px, weight 650 |
| 항목 제목 (논문·세미나) | 16px, weight 600 |
| 메타데이터 (날짜·저자·학회) | 14px, 보조색. 날짜 숫자는 고정폭 |

### 정렬
- 콘텐츠 최대 폭 1160px, 좌측 정렬.
- 모든 페이지가 같은 **2단 격자**를 씁니다: 왼쪽 220px에 섹션 제목, 오른쪽에 내용 (`src/components/Section.tsx`). 섹션 사이에는 가는 구분선.
- 날짜가 있는 목록은 왼쪽에 날짜 칸을 두고 내용을 맞춥니다 (`DateList`, `SeminarItem`).

### 신호 모티프와 첫 화면
- Home 첫 화면 오른쪽에 **흐린 수식 몇 개가 별자리처럼** 놓입니다 (`src/components/heroSky.ts`).
- 새로고침하거나 주소로 들어올 때마다(넓은 화면, 모션 허용) 첫 화면이 6초 동안 남색 밤하늘이 되고 수식이 유성처럼 떨어진 뒤, 1.5초에 걸쳐 흰 화면으로 돌아옵니다. 사이트 안에서 메뉴로 Home에 돌아오면 처음부터 흰 화면입니다. 시간은 `heroSky.ts`의 `NIGHT_MS`.
- 첫 화면의 시구와 아래 시 전문은 `content/poem.yml` (`hero`: 첫 화면에 보일 연 번호).
- 헤더의 랩명 옆 작은 신호 표시(`SignalMark.tsx`)는 로고 파일이 정해지면(`content/lab.yml`의 `logo`) 로고로 바뀝니다.
- 이 밖에 파형 장식, 그라데이션, 움직임은 더하지 않습니다.

### 색
| 이름 | 라이트 | 다크 | 용도 |
| --- | --- | --- | --- |
| paper | #ffffff | #0f141b | 배경 |
| surface | #f4f6f9 | #161d26 | 푸터, 빈 사진 칸 |
| ink | #152030 | #e6ebf2 | 본문 |
| muted | #5a6677 | #9aa6b5 | 메타데이터 |
| rule | #dce2ea | #27313d | 구분선 |
| accent | #2452c6 | #85a7ff | 링크, 현재 메뉴·탭 |
| night | #0d1830 | — | Home 첫 방문 때의 밤하늘 |

다크 모드는 기기 설정을 따릅니다. 색은 `src/app/globals.css` 맨 위에서만 정의합니다.

### 쓰지 않는 것
이미지 슬라이드, 카드 레이아웃 남발, 둥근 태그 배지, 그림자, 출처 없는 이미지·아이콘, 애니메이션, 모든 제목 위의 대문자 이름표.

### 언어
- **영어 기본 + 국문 병기.** 메뉴·섹션 제목·날짜·이름표는 영어.
- 사람 이름은 영문 이름 옆(또는 아래)에 국문 이름.
- 원래 국문인 고유명사(과제명, 학회명, 위원회명)와 영어로 옮기면 길거나 어색한 제목은 **국문 그대로** 씁니다.

### 화면 범위
**PC 화면이 기준**입니다. 960px 이하에서는 2단 격자가 1단으로, 640px 이하에서는 헤더·목록이 좁은 화면용으로 바뀝니다. 모바일 세부 다듬기는 나중에 합니다 (11장).

## 4. 메뉴와 페이지

상위 메뉴: **Members, Research, Seminars** (+ `content/lab.yml`에 공식 연락처가 들어가면 **Contact**). 메뉴와 탭 구성은 `src/lib/site.ts`. News는 상위 메뉴에 두지 않고 푸터 바로가기에만 둡니다.

| 주소 | 페이지 | 파일 (`src/app/` 기준) |
| --- | --- | --- |
| `/` | Home | `page.tsx` |
| `/members/professor/` | Members ▸ Professor (`/members/`도 여기로) | `members/professor/` + `content/professor.yml` |
| `/members/our-team/` | Members ▸ Our Team | `members/our-team/` + `content/people.yml` |
| `/members/alumni/` | Members ▸ Alumni | `members/alumni/` |
| `/research/` | Research ▸ Areas | `research/page.tsx` + `content/research/*.md` |
| `/research/<주제>/` | 주제 상세 | `research/[slug]/` |
| `/research/publications/` | Research ▸ Publications (`/publications/`도 여기로) | `research/publications/` |
| `/publications/<논문>/` | 논문 상세 | `publications/[slug]/` + `content/publications/*.md` |
| `/seminars/` | Seminars | `seminars/` + `content/seminars.yml` |
| `/news/` | News | `news/` + `content/news.yml` |
| `/contact/` | Contact | `contact/` |
| `/upload/` | 세미나 업로드 (메뉴·검색 노출 없음) | `upload/` |

예전 주소 `/people/`, `/people/seon-man-kim/`은 새 주소로 자동 이동합니다.

### Home
랩명 → 시 한 연과 전문 링크, 지도교수·소속, 수식 별자리 → **Highlights** (세미나 중 `highlight: true`이고 PDF가 있는 것, 최신 5건) → Research Areas → Recent Publications 3편 → 시 전문(`#poem`). Highlights가 하나도 없으면 그 섹션은 나오지 않습니다.

### Members ▸ Professor
사진(선택) · 이름 · 직위 · 소속 · 연락처 → Biography(입력 시) → Education & Career → Research Areas → Courses Taught(입력 시) → Publications → Intellectual Property → Research Projects → Academic Services(연도별, 날짜 없는 항목은 Other) → Student Awards. 비어 있는 항목은 표시되지 않습니다.

### Members ▸ Our Team
- 섹션: **Ph.D. Students → M.S. Students → Undergraduate Researchers** (사람이 있는 섹션만 표시)
- 한 사람: **사진 칸 + 옆에 영문 이름 / 국문 이름 / 역할 / 한 줄 소개 / (선택) Website 링크**, PC에서 한 줄에 두 명. 개인 페이지는 따로 없습니다.
- 사진 칸: 3:4 세로, 모두 같은 크기. 사진이 없으면 같은 크기의 옅은 빈 칸만 둡니다 (아이콘·이니셜 넣지 않음).
- 파일: `public/images/people/<id>.jpg`, 긴 변 800px, 200KB 이하. 본인이 제공하고 게시에 동의한 것만.

### Members ▸ Alumni
사진 없이 한 줄: 이름, 국문 이름, 현재 소속 (진로는 본인 동의 시에만).

### Research ▸ Areas / 주제 상세
- 목록: 왼쪽에 관련 논문 수, 오른쪽에 제목 + 한 줄 설명 + Read more
- 상세: Back to Research Areas → 제목 → 대표 그림(선택) → Overview → Related Publications → Related Seminars(세미나의 `topics`에 이 주제가 있는 것)
- 주제 분류와 명칭은 교수님 확정 전 임시입니다.

### Research ▸ Publications
- 섹션: **Journal Articles → Conference Papers → Conference Posters → Others** (국내/국제 학회는 나누지 않음), 섹션 안 최신순. 종류 목록은 `src/lib/content.ts`의 `PUBLICATION_TYPES`
- 항목: 제목(상세 링크) / 저자(구성원 이름은 Members로 자동 링크, 굵게 하지 않음) / 학회·저널, 날짜 / 상태·수상 / 링크 한 줄
- 상세 페이지: Details(저자, 학회, 종류, 날짜, 상태, 수상, 링크) → 대표 그림(선택) → Overview

### Seminars
- 학기별 섹션(왼쪽 칸에 학기), 학기 안 최신순
- 항목: 날짜 / **제목**(PDF가 있으면 제목도 PDF 링크) / 발표자 · 종류 / 개요 한 문장 / 오른쪽 `PDF`
- 학기는 날짜로 자동 계산: 3–8월 Spring, 9–12월 Fall, 1–2월 전년도 Winter (`term`으로 직접 지정 가능)

### News
날짜 + 한 문장 + 근거 링크. 대학 뉴스보다 외부 언론 링크 우선.

## 5. 데이터 파일 (내용은 여기서만 고침)

화면 코드(`src/`)는 디자인·구조를 바꿀 때만 수정합니다. 내용은 전부 `content/`에 있고, 빌드할 때 읽힙니다.

| 파일 | 내용 |
| --- | --- |
| `content/lab.yml` | 랩명, 소속, 지도교수, 소개 문구, 공식 이메일·위치(비우면 표시 안 함, Contact 메뉴도 숨김), 로고, 업로드 중계 주소, `draft` |
| `content/professor.yml` | 교수님 페이지 전체. 출처와 확인일은 파일 맨 위 주석에 |
| `content/people.yml` | 구성원 (교수님 포함 — 논문 저자 자동 링크용) |
| `content/research/*.md` | 연구 주제 1개당 파일 1개 |
| `content/publications/*.md` | 논문 1편당 파일 1개 |
| `content/seminars.yml` | 세미나 |
| `public/files/seminars/` | 세미나 PDF |
| `public/images/people/` | 구성원 사진 |
| `content/news.yml` | 소식 |
| `content/poem.yml` | 연구실 시 (첫 화면 시구, Home 아래 전문) |

### people.yml
```yaml
- id: so-yeong-park            # 영문 소문자-하이픈. 바꾸지 않음 (논문·세미나가 이 id로 연결됨)
  name: "So Yeong Park"
  name_ko: "박소영"
  group: undergrad             # faculty / phd / ms / undergrad / alumni
  role: "Undergraduate Researcher"
  since: 2025-06
  until:                       # 졸업·이탈 시 입력하고 group을 alumni로
  bio: "Korean speech recognition, LLM applications"   # 사진 옆 한 줄 소개 (본인 작성)
  photo: so-yeong-park.jpg     # 없으면 비워 둠 → 회색 칸
  url: "https://green4849.github.io/"
  after: ""                    # alumni 진로 (동의 시)
```

### content/research/짧은이름.md
```yaml
---
title: "Korean speech recognition"
order: 2                       # Research 목록 순서
summary: "한 줄 설명"
figure: ""                     # 대표 그림 (선택), figure_alt / figure_caption 함께
publications:                  # 관련 논문 permalink
  - /publications/qwen3-asr-evaluation/
---
Overview 본문 (비우면 summary를 씀)
```
- 파일 이름(확장자 제외)이 주제 id입니다. 세미나 `topics`에 이 id를 쓰면 주제 상세에 자동으로 붙습니다.

### content/publications/YYYY-짧은이름.md
```yaml
---
title: "…"
title_ko: ""                   # 국문 제목 있으면
type: journal                  # journal / conference-paper / conference-poster / other
authors: ["So Yeong Park", "Seon Man Kim"]   # 출판된 순서 그대로. people.yml의 name과 같으면 자동 링크
venue: "…"
pub_date: "2026-06-19"         # 아는 만큼만: "2026", "2026-08"도 가능
status: ""                     # 예: "Accepted Aug 25, 2026"
award: ""
links: []                      # - label: "DOI"  /  url: "https://…"
permalink: "/publications/짧은이름/"   # 한 번 정하면 바꾸지 않음
excerpt: "한 문장 요약"
---
개요 2–3문장.
```

### seminars.yml
```yaml
- date: 2026-10-21                     # 따옴표 없이 YYYY-MM-DD
  presenter: so-yeong-park             # people.yml id (외부 발표자는 이름을 그대로 써도 됨)
  title: "Decoding parameters for Korean ASR"
  summary: "한 문장 개요"
  type: research                       # 선택: research / paper-review / tutorial / invited
  topics: [korean-asr]                 # 선택: content/research/ 파일 이름
  file: "2026-10-21-so-yeong-park.pdf" # 선택: public/files/seminars/ 안의 PDF. 비우면 제목만 표시
  highlight: false                     # 관리자가 지정. true면 Home Highlights에 표시
```
- **필수는 날짜·발표자·제목·개요 한 문장**뿐입니다. 나머지는 없어도 됩니다.
- 올리는 기준은 **올린다 / 안 올린다** 하나입니다. PDF가 있으면 링크, 없으면 제목만 나옵니다.
- `highlight`는 발표자가 아니라 관리자(또는 교수님)가 정합니다. PDF가 있는 항목만 Home에 나옵니다.

## 6. 세미나 자료 올리기

### 방법 1 — 업로드 페이지 (GitHub 계정 없이)
1. 사이트의 `/upload/` 주소를 엽니다 (랩 안에서만 공유).
2. 업로드 코드, 발표일, 발표자, 제목, 개요 한 문장, PDF(선택, 20 MB 이하)를 넣고 제출합니다.
3. 자동으로 Pull Request가 만들어집니다. 관리자가 내용을 확인하고 필요하면 `highlight: true`로 바꾼 뒤 병합합니다.
4. 병합 후 몇 분 뒤 Seminars 페이지에 반영됩니다. 잘못 올렸으면 관리자가 Pull Request를 닫으면 끝입니다.

### 방법 2 — GitHub 웹 편집
`public/files/seminars/`에 PDF 업로드("Add file → Upload files") → `content/seminars.yml`에 한 항목 추가 → Pull Request.

### 업로드 중계 설정 (관리자, 처음 한 번)
업로드 페이지는 정적 사이트라 파일을 직접 받을 수 없어서, Google Apps Script가 받아 Pull Request로 바꿔 줍니다. 코드는 `tools/upload-relay/Code.gs`.

1. **교수님(또는 랩 공식) Google 계정**으로 [script.google.com](https://script.google.com)에서 새 프로젝트를 만들고 `Code.gs` 내용을 붙여 넣습니다.
2. GitHub에서 **세분화된 토큰(fine-grained token)** 을 만듭니다: 리소스 소유자 `Signal-Augmented-Intelligence`, 저장소는 사이트 저장소 하나만, 권한은 Contents(읽기·쓰기)와 Pull requests(읽기·쓰기)만. 만료일을 정하고 달력에 갱신일을 적어 둡니다.
3. Apps Script의 프로젝트 설정 → 스크립트 속성에 `UPLOAD_CODE`(랩 안에서 공유할 코드)와 `GITHUB_TOKEN`(2의 토큰)을 넣습니다. **토큰은 사이트 코드나 문서에 절대 적지 않습니다.**
4. 배포 → 새 배포 → 유형 "웹 앱", 실행 계정 "나", 액세스 "모든 사용자"로 배포하고 웹 앱 주소를 복사합니다.
5. 그 주소를 `content/lab.yml`의 `upload_endpoint`에 넣고 Pull Request로 반영합니다. 비어 있는 동안 업로드 페이지는 비활성화되어 있습니다.
6. 업로드 코드를 바꾸려면 3의 `UPLOAD_CODE`만 고치면 됩니다. 토큰이 만료되면 2–3을 다시 합니다.

구현 때 확인할 것: Apps Script가 한 번에 받을 수 있는 크기에 맞춰 업로드 페이지의 20 MB 상한을 조정합니다.

## 7. 콘텐츠 원칙

1. **확인된 사실만** 싣습니다. 모르는 날짜는 연도까지만, 미확인 정보는 비워 둡니다.
2. 논문의 **종류와 상태를 섞지 않습니다** (저널 / 학회 논문 / 포스터, 게재 승인 / 게재 / 발표).
3. 결과 수치를 쓸 때는 **조건을 함께** 씁니다.
4. **사람 정보는 본인 동의 후** 게시합니다 (이름 표기, 역할, 한 줄 소개, 사진, 링크, 진로).
5. **동의 기록은 공개 저장소에 두지 않습니다** (비공개 문서에 보관).
6. 공개 금지: 개인 이메일·전화번호·학번·주민번호, 내부 서버 주소, 비공개 실험 결과, 로그인 정보, 토큰.
7. 근거 링크는 외부 언론 > 학회·기관 기록 > 대학 뉴스 순.
8. 소개 문구는 무엇을 연구하는지만 담담하게 씁니다. 홍보성 문장은 쓰지 않습니다.

## 8. 수정·배포·점검

### 일반 수정 (git을 몰라도 가능)
GitHub 웹에서 데이터 파일 열기 → 연필 아이콘 → 수정 → "Propose changes" → Pull Request → 관리자 승인 → 자동 배포.

### Pull Request 확인 (관리자)
- [ ] 당사자 동의를 받았다
- [ ] 세미나: 제목과 개요 한 문장이 있다 / Home에 올릴지(`highlight`) 정했다
- [ ] 개인정보가 없다

### 자동 확인 (GitHub Actions)
`npm ci` → `npm run build`(타입 검사 포함, 결과는 `out/`) → `npm run check`(내부 링크·앵커, 렌더링된 페이지의 개인정보 패턴). 데이터 파일 자체는 따로 검사하지 않습니다.

화면 코드를 고칠 때 로컬 확인: `npm install` 후 `npm run dev` (Node 22).

### `draft: true` 동안
배포는 되지만 검색엔진 노출을 막고(`noindex`, robots `Disallow`) 푸터에 내부 검토용 문구가 붙습니다. 공개 승인 후 `content/lab.yml`에서 `draft: false`로 바꿉니다.

저장소 Settings → Pages → Source는 **GitHub Actions**여야 합니다.

### 확인 방법
사이트는 GitHub 배포 주소에서 확인합니다. 화면 확인은 실제 브라우저에서 본 경우에만 "확인 완료"라고 기록합니다.

## 9. 인수인계 체크리스트

**넘기는 사람**
- [ ] 다음 관리자를 조직 Owner로 초대하고 수락 확인
- [ ] 업로드 중계(Apps Script)의 소유 계정과 토큰 만료일 전달
- [ ] 이 문서의 "현재 상태"(10장) 갱신
- [ ] 진행 중인 Pull Request·미반영 자료 목록 전달
- [ ] 비공개 동의 기록 위치 전달
- [ ] 본인 항목을 `alumni`로 이동
- [ ] 마지막으로 조직에서 본인 탈퇴 (교수님 Owner 유지 확인 후)

**받는 사람**
- [ ] 이 문서 정독
- [ ] 데이터 파일 수정 → PR → 배포 한 번 직접 해 보기
- [ ] 업로드 페이지로 테스트 제출 → PR 확인 후 닫기

## 10. 현재 상태와 남은 일 (2026-10-21)

| 항목 | 상태 |
| --- | --- |
| GitHub 조직·사이트 저장소 | 생성 완료. 교수님 Owner 초대 확인 필요 |
| 사이트 구조 | 3차 구현: Next.js로 화면 전면 교체. Members(Professor/Our Team/Alumni), Research(Areas/Publications), Seminars, News(푸터), Contact(연락처 입력 시), 업로드 페이지 |
| 세미나 항목 | 아직 없음 ("No seminars have been posted yet." 표시) |
| 업로드 중계 | 코드 포함, Apps Script 배포·`upload_endpoint` 입력 전 |
| 랩 대표색·로고 | 로고 정비 중 (확정 전에는 신호 표시 + "SAI Lab") |
| 연구 주제 분류·소개 문구 | 교수님 확정 필요 (현재 임시) |
| 교수님 페이지 | 공개 출처 기준 1차. 약력·경력·담당 과목·사진은 교수님께 받아야 함. 과제 역할·연구비 표기는 교수님 확인 필요 |
| 구성원 명단·사진·한 줄 소개·동의 | 수집 전 |
| 공식 연락처 | 미정 (Contact 메뉴 숨김 상태) |
| 화면 확인 | 빌드 결과를 PC(1440px)·좁은 화면(390px)에서 캡처로 확인. 배포 주소에서 한 번 더 확인 필요 |

## 11. 나중에 고려할 것

| 항목 | 내용 |
| --- | --- |
| 저작권 검토 | 논문 리뷰 슬라이드의 타인 그림, 자료 라이선스 표기, 한 번 공개한 파일은 회수 불가 |
| 모바일 | 기본 반응형은 적용됨. 모바일 세부 간격·글자 크기 다듬기 |
| 검색 | 자료가 쌓이면 제목·발표자·주제 검색 |
| 세미나 주제별 보기 | 자료가 쌓이면 학기별 옆에 주제별 탭 |
| PDF 보관 위치 | 저장소 용량이 1 GB에 가까워지면 Releases나 별도 저장소로 이전 |
| 비공개 자료 | 내부 전용 자료가 필요해지면 그때 구분 추가 |
| PDF 정리 | 메타데이터 제거, 용량 압축 |
| 업로드 양식 확대 | 한 줄 소개·논문·소식용 양식, 학교 Google 계정 로그인 제한 |
| 이전 사이트 자료 | AINC 사이트의 세미나·과제·학회 발표·교수님 약력 이관 (별도 작업) |
| 데모 영상 | 주제 상세에 영상이 생기면 추가 |
