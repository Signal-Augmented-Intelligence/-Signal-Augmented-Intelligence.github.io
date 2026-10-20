# SAI Lab 사이트 초안 — 공개 전 확인 사항

작성: 2026-10-20 · 기준 자료: `LAB_SITE_HANDOFF.md`(2026-10-06 개인 사이트 자료)

## 이번 초안에 실은 내용과 근거
| 항목 | 실은 내용 | 근거 / 상태 |
| --- | --- | --- |
| 연구실명·소속·지도교수 | SAI Lab (Signal Augmented Intelligence), Hanshin University, Prof. Seon Man Kim | 2026-10-20 사용자 확인: AINC가 아닌 SAI Lab. 국문 명칭 미정 |
| 홈 소개 | 3개 연구 주제를 "최근 연구"로 소개 | 공개 논문 6편에서 묶은 것. 연구실 공식 미션·연구 분야 아님 |
| Research | 한국어 음성 인식 / 로봇 음향 신호 처리 / 학사 규정 QA 언어 모델 | 주제명은 임시. 교수님 확인 필요 |
| People | Faculty: Seon Man Kim (Advisor) · Students: So Yeong Park | 다른 공저자(신현재, 석진태, 김민준)는 구성원 여부·동의 미확인이라 싣지 않음 |
| Publications | 6편 (저널 1, 국제학회 1, 포스터 4) | 개인 사이트 기록 그대로. 저자 순서 보존, 개인 역할(First author 등)은 제외 |
| News | 수상 2, 게재 승인 1, 발표 2 | 모두 Publications 항목과 연결 |

## 의도적으로 뺀 것
- DCASE 2026 Task 6: 현재 수행 상태와 공개 범위 재확인 전이라 제외
- 연락처·주소·이메일, Join/Contact 페이지: 공식 정보 없음
- 로고·파비콘·사진·연구실 색상: 공식 파일 없음 (개인 사이트 🌿 파비콘·프로필 사진 미사용)
- 논문 원문 PDF/DOCX·상장 PDF: 개인 사이트 자산이므로 복사하지 않음. Qwen3-ASR 논문은 KCI 기록만 연결
- 인쇄 DOI(10.7776/ASK.2026.45.5.582): 실제 연결 여부 미확인이라 표기하지 않음

## 받아야 할 자료 / 결정
1. 국문 연구실명, 로고·색상 가이드 유무. 기존 AINC Lab 이름으로 나온 논문을 SAI Lab 실적으로 실어도 되는지
2. 교수님 공개 약력·연구 관심·사진·연구실 대표 연락처와 위치
3. 현재 구성원 명단과 각자 공개 동의(이름 표기, 역할, 기간, 링크, 사진)
4. 연구 주제의 공식 분류와 설명 문구
5. Qwen3-ASR 논문: 45(5) 582–590 권호가 나온 상태에서 "Accepted Aug 25, 2026" 표기를 유지할지, 게재 완료로 바꿀지
6. 언어: 영어 단일 / 한국어 병기
7. 조직 `Signal-Augmented-Intelligence` 생성 완료. 저장소 `Signal-Augmented-Intelligence.github.io` 생성, 교수님 Owner 초대, 이후 도메인 여부
8. 모집 여부 (있으면 Join 페이지 추가)

## 공개 전 기술 체크
- `_config.yml`: `url` 채우기, `draft: false`
- `bundle exec jekyll build` → `python3 scripts/check-site.py`
- 실제 브라우저에서 데스크톱·모바일 재확인
