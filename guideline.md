# SAI Lab 웹사이트 가이드라인

SAI Lab (Signal Augmented Intelligence LAB), 한신대학교 · 지도교수 김선만

이 문서는 사이트를 **만들고, 고치고, 다음 관리자에게 넘길 때** 기준으로 삼는 문서입니다. 사이트를 맡게 되면 이 문서부터 끝까지 읽어 주세요.

- 작성: 2026-10-20 (박소영)
- 상태: 설계 확정, 구현 전
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
| 세미나 자료 저장소 | `seminars-public` (공개), `seminars-internal` (비공개) |
| 기술 | Jekyll + Academic Pages(Minimal Mistakes 계열), GitHub Pages, GitHub Actions |

## 2. 소유와 권한

- 조직의 **Owner는 교수님**입니다. 사이트·저장소·주소는 조직 소유이므로 관리자가 바뀌어도 유지됩니다.
- 현재 관리자도 Owner 권한을 갖고, 졸업·이탈 시 **조직에서 본인만 나가면** 됩니다 (8장 체크리스트).
- 구성원은 저장소별 **Write** 권한. `main` 브랜치는 직접 수정하지 않고 Pull Request로만 반영합니다.
- 도메인을 따로 살 경우: 판매처 계정과 결제 수단은 **교수님 명의**. 학생 명의로 사면 졸업 후 갱신이 끊길 수 있습니다.
- 외부 서비스 계정(Google Drive 등)을 쓰게 되면 그것도 교수님 또는 조직 명의로 만듭니다.

## 3. 디자인 기준

**기준 디자인은 박소영 개인 사이트([green4849.github.io](https://green4849.github.io/))입니다.** 새 장식을 더하지 말고 이 결을 유지합니다.

### 타이포그래피
| 요소 | 값 |
| --- | --- |
| 글꼴 | Roboto 가변 폰트, 사이트에 로컬 포함 (`assets/fonts/roboto/`) |
| 본문 | 16px, weight 320, line-height 1.5 |
| 콘텐츠 최대 폭 | 1000px, **단일 컬럼** (좌측 사이드바 없음) |
| 페이지 제목 | 2rem, weight 400 |
| 섹션 제목 | 1.25rem, weight 400, 아래 구분선 |
| 항목 제목 (논문·세미나) | 1rem, weight 500 |
| 메타데이터 (날짜·종류·수상) | 0.875rem |
| 한글 | Roboto에 한글이 없어 시스템 글꼴로 표시됨. 국문이 많아지면 한글 글꼴(예: Pretendard 로컬 포함) 추가 검토 |

### 색과 브랜딩
- 랩 대표색(로고의 파란색 계열)은 **링크와 현재 메뉴 표시에만** 씁니다. 배경이나 면을 채우는 데 쓰지 않습니다.
- 라이트·다크 모드 모두 본문 대비 4.5:1 이상.
- 로고: 확정된 공식 파일만 사용. 마스트헤드 왼쪽 작은 워드마크와 파비콘. 확정 전에는 텍스트 "SAI Lab"만.

### 쓰지 않는 것
큰 그라데이션 첫 화면, 이미지 슬라이드, 카드 레이아웃 남발, 둥근 태그 배지, 과한 버튼, 출처 없는 이미지·아이콘, 애니메이션.

### 접근성
키보드 포커스 표시, 모든 이미지 대체 텍스트, 움직임 줄이기 설정 존중.

## 4. 메뉴와 페이지

메뉴: **Home · Research · People · Publications · Seminars · News** (+ 공식 연락처가 정해지면 Contact)

### Home
랩명(+로고) → 소개 2–3문장 → 연구 주제 목록 → 최근 소식 3건 → 최근 논문 3편 → 연락처 한 줄

### Research
주제마다: 제목 / 설명 2–3문장 / 대표 그림 1개(캡션에 출처 논문과 조건) / 관련 논문 목록. 주제 분류와 명칭은 교수님 확정.

### People (참고: [KAIST MAC Lab People](https://mac.kaist.ac.kr/people.html))
- 섹션 순서: **Faculty → PhD Students → MS Students → Undergraduate Researchers → Alumni**
- 현재 구성원 항목: **사진 칸** / 이름 `English | 한글` / 역할 / (선택) 관심 분야 한 줄 / (선택) 개인 사이트 링크
- **사진 칸 규칙**
  - 비율 3:4 세로, 모든 사람 같은 크기. 데스크톱 4열, 태블릿 3열, 모바일 2열 그리드
  - 파일: `images/people/<id>.jpg`, 600×800px 이상으로 받아 긴 변 800px로 줄여 저장, 200KB 이하
  - 사진이 없는 사람은 **같은 크기의 옅은 회색 빈 칸**만 둡니다 (아이콘·이니셜·임의 이미지 넣지 않음) → 그리드 줄이 맞음
  - 사진은 본인이 제공하고 게시에 동의한 것만
- Alumni: 사진 없이 한 줄. `이름 | 한글 — MS 2026 → 진로` 형식, 진로는 본인 동의 시에만
- 한 사람은 한 섹션에만 (학위 과정이 바뀌면 이동)
- 이메일은 공개하지 않는 것이 기본

### Publications (참고: [NAIST NLP Publications](https://nlp.naist.jp/en/publications/))
- 섹션: **Journal Articles → Conference Papers → Conference Posters → Others** (국내/국제 학회는 나누지 않음)
- 페이지 상단에 섹션 목차, 섹션 안은 최신순
- 항목: 제목(상세 페이지 링크) / 저자(구성원 이름은 People로 자동 링크, 굵게 하지 않음) / 학회·저널, 날짜 / 상태·수상은 메타데이터 줄에 글자로
- 링크는 한 줄로: `DOI · Paper · Code · Slides` — 실제로 있는 것만
- 상세 페이지 구조(개인 사이트에서 확정한 형식): 서지 → 원문·기록 링크 → 대표 그림 1개 → 개요 2–3문장 → 관련 발표·수상. 방법·실험표·개인 기여 섹션은 넣지 않음

### Seminars (PDF 자료실)
- 녹화·초록·상세 페이지 없이 **발표 PDF를 내려받는 용도**로만 사용
- 학기별 섹션(`2026 Fall`), 페이지 상단에 학기 목차, 학기 안은 최신순
- 항목 형식 (Publications와 같은 결):
```
Oct 21   Decoding parameters for Korean ASR              PDF
         So Yeong Park · Research meeting
Oct 14   Paper review: …                        Members only
         …
```
  - 날짜: 메타데이터 크기, 고정 폭 / 제목: 1rem·500 / 발표자·종류: 0.875rem / 오른쪽: `PDF` 또는 `Members only`
  - 모바일: 날짜 → 제목 → 발표자·종류 → PDF 세로 배치
- 종류: Research meeting · Paper review · Tutorial · Invited talk

### News
날짜(작게) + 한 문장 + 근거 링크. 수상·게재·발표·행사. 대학 뉴스보다 외부 언론 링크 우선.

## 5. 데이터 파일 (내용은 여기서만 고침)

템플릿(`_layouts/`, `_includes/`)은 디자인을 바꿀 때만 수정합니다. 내용 수정은 아래 파일에서만 합니다.

| 파일 | 내용 |
| --- | --- |
| `_data/lab.yml` | 랩명(영·국문), 풀네임, 소속, 지도교수, 공식 이메일, 위치, 로고 경로 |
| `_data/people.yml` | 구성원 |
| `_publications/*.md` | 논문 1편당 파일 1개 |
| `_data/research.yml` | 연구 주제 |
| `_data/seminars.yml` | 세미나 |
| `_data/news.yml` | 소식 |
| `_data/links.yml` | 수상·언론·행사 근거 링크 목록 |

### people.yml
```yaml
- id: so-yeong-park            # 영문 소문자-하이픈. 바꾸지 않음 (논문·세미나가 이 id로 연결됨)
  name: "So Yeong Park"
  name_ko: "박소영"
  group: undergrad             # faculty / phd / ms / undergrad / alumni
  role: "Undergraduate Researcher"
  since: 2025-06
  until:                       # 졸업·이탈 시 입력하고 group을 alumni로
  interests: "Korean speech recognition, LLM applications"
  photo: so-yeong-park.jpg     # 없으면 비워 둠 → 회색 빈 칸
  url: "https://green4849.github.io/"
  after: ""                    # alumni 진로 (동의 시)
```

### _publications/YYYY-짧은이름.md
```yaml
---
title: "…"
title_ko: "…"                  # 국문 제목 있으면
type: journal                  # journal / conference-paper / conference-poster / other
authors: ["So Yeong Park", "Seon Man Kim"]   # 출판된 순서 그대로
venue: "…"
date: "2026-06-19"             # 아는 만큼만: "2026", "2026-08"도 가능
status: ""                     # 예: "Accepted Aug 25, 2026"
award: ""                      # 예: "Paper Encouragement Award"
links:
  - { label: "DOI", url: "…" }
  - { label: "Paper", url: "…" }
figure: ""                     # 대표 그림 (선택)
---
개요 2–3문장.
```

### seminars.yml
```yaml
- date: 2026-10-21
  presenter: so-yeong-park      # people.yml id
  title: "Decoding parameters for Korean ASR"
  type: research                # research / paper-review / tutorial / invited
  access: public                # public / members / hidden
  file: 2026-fall/2026-10-21-park.pdf
```

## 6. 세미나 자료 운영

### 공개 범위 — 항목마다 `access`로 직접 지정
| 값 | 사이트 표시 | 파일 위치 |
| --- | --- | --- |
| `public` | 제목 + `PDF` 링크 | `seminars-public` 저장소의 학기 Release |
| `members` | 제목 + `Members only` (조직 구성원이 GitHub 로그인 시 열림) | `seminars-internal` 저장소의 학기 Release |
| `hidden` | 사이트에 표시 안 함 | `seminars-internal` |

- 미발표 연구 결과, 다른 사람 논문의 그림을 옮긴 논문 리뷰 → `members` 또는 `hidden`
- 애매하면 `members`로 시작. **한 번 공개한 파일은 나중에 비공개로 바꿔도 이미 내려받은 사본은 회수할 수 없습니다.**
- `members` 항목의 제목은 공개 사이트에 보입니다. 제목도 숨겨야 하면 `hidden`.

### 왜 Releases에 두나
- 사이트 저장소에 PDF를 쌓으면 GitHub Pages 한도(사이트 1 GB, 파일당 100 MB)에 걸립니다.
- Release 첨부파일은 파일당 2 GiB 미만이면 되고 총량·대역폭 제한이 없습니다 ([GitHub Docs — About releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)).
- 조직 소유라 관리자가 졸업해도 링크가 유지됩니다.
- 학기마다 Release 하나 (태그 예: `2026-fall`).

### 발표자가 올리는 순서
1. PPT를 **PDF로 내보내기** (사이트에는 PDF만 올림)
2. PDF 압축 (권장 20 MB 이하)
3. 공개 범위에 맞는 저장소의 해당 학기 Release에 첨부 (없으면 관리자에게 요청)
4. `_data/seminars.yml`에 한 항목 추가 → Pull Request
5. 관리자 확인 후 병합 → 몇 분 뒤 사이트 반영

## 7. 콘텐츠 원칙

1. **확인된 사실만** 싣습니다. 모르는 날짜는 연도까지만, 미확인 정보는 비워 둡니다.
2. 논문의 **종류와 상태를 섞지 않습니다** (저널 / 학회 논문 / 포스터, 게재 승인 / 게재 / 발표).
3. 결과 수치를 쓸 때는 **조건을 함께** 씁니다.
4. **사람 정보는 본인 동의 후** 게시합니다 (이름 표기, 역할, 기간, 사진, 링크, 진로).
5. **동의 기록은 공개 저장소에 두지 않습니다** (비공개 문서에 보관).
6. 공개 금지: 개인 이메일·전화번호·학번·주민번호, 내부 서버 주소, 비공개 실험 결과, 로그인 정보.
7. 원고·상장 원본을 올릴 때는 파일 안의 이메일·메타데이터·직인 공개에 대해 당사자 동의를 받습니다.
8. 근거 링크는 외부 언론 > 학회·기관 기록 > 대학 뉴스 순. 본인 이름이 명시된 기사인지, 행사 보도인지 구분해 기록합니다.

## 8. 수정·배포·점검

### 일반 수정 (git을 몰라도 가능)
GitHub 웹에서 데이터 파일 열기 → 연필 아이콘 → 수정 → "Propose changes" → Pull Request → 관리자 승인 → 자동 배포.

### Pull Request 체크리스트
- [ ] 당사자 동의를 받았다
- [ ] 출처 링크가 있다 / 날짜는 아는 만큼만 썼다
- [ ] 개인정보가 없다
- [ ] 세미나 `access`와 파일 저장소가 일치한다

### 자동 검사 (GitHub Actions)
빌드, 내부 링크·앵커, 필수 필드, 개인정보 패턴(전화번호·학번·주민번호 형식, 개인 이메일), 세미나 `access`·파일 위치 일치. `_config.yml`의 `draft: true` 동안에는 검색 차단 + 배포 중단.

### 로컬 미리보기
```sh
bundle install
bundle exec jekyll serve --host 127.0.0.1
JEKYLL_ENV=production bundle exec jekyll build --strict_front_matter && python3 scripts/check-site.py
```
화면 확인은 데스크톱·모바일 실제 브라우저에서 한 경우에만 "확인 완료"라고 기록합니다.

### 정기 점검
- 학기 초: People 명단, 졸업생 이동, 새 학기 세미나 Release 생성
- 학회 시즌 후: 논문·수상·소식 반영
- 연 1회: 깨진 외부 링크, 도메인 갱신(있다면)

## 9. 인수인계 체크리스트

**넘기는 사람**
- [ ] 다음 관리자를 조직 Owner로 초대하고 수락 확인
- [ ] 이 문서의 "현재 상태"(10장) 갱신
- [ ] 진행 중인 Pull Request·미반영 자료 목록 전달
- [ ] 비공개 동의 기록 위치 전달
- [ ] 본인 People 항목을 Alumni로 이동
- [ ] 마지막으로 조직에서 본인 탈퇴 (교수님 Owner 유지 확인 후)

**받는 사람**
- [ ] 이 문서 정독, 로컬 빌드 한 번 성공
- [ ] 데이터 파일 수정 → PR → 배포 한 번 직접 해 보기
- [ ] 세미나 Release 첨부 한 번 해 보기

## 10. 현재 상태와 남은 일 (2026-10-20)

| 항목 | 상태 |
| --- | --- |
| GitHub 조직 | 생성 완료. 교수님 Owner 초대 확인 필요 |
| 사이트 저장소 / 세미나 저장소 | 미생성 |
| 로컬 시안 | `sai-lab-site/` (이 가이드라인 확정 전 구조라 재정리 필요) |
| 로고 | 정비 중 |
| 연구 주제 분류·소개 문구 | 교수님 확정 필요 |
| AINC Lab 시절 논문을 SAI Lab 실적으로 실을지 | 교수님 확인 필요 |
| 구성원 명단·사진·동의 | 수집 전 |
| 공식 연락처·위치 | 미정 |
| 논문 리뷰 세미나 공개 범위 | 미정 (`members` 또는 `hidden` 권장) |
| 언어 | 영어 기본 + 국문 병기 권장, 미확정 |
