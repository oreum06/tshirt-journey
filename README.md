# 티셔츠 한 벌의 여행

9,900원짜리 흰 티셔츠 한 벌을 따라 목화밭에서 가나의 쓰레기 산까지 내려가는 모바일 인터랙티브 다큐멘터리.
공공칠빵(7팀) 사회공헌 프로젝트 · 해결안 2 (SDG 12.8).

- 기획서: PRD「티셔츠 한 벌의 여행」 / 검토 메모: [`docs/PRD-review.md`](docs/PRD-review.md)
- 스택: Vite + React + TypeScript, GSAP ScrollTrigger, html-to-image, 인라인 SVG

## 실행

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/
```

URL 해시로 장면 바로 이동: `#ch0` ~ `#ch9` · 발표 모드: `?mode=present` (← → 로 챕터 이동)

## 작업 규칙 (AI 바이브 코딩 시 항상 함께 붙일 것)

1. **수치는 프롬프트에 직접 쓰지 않는다.** 모든 카피·수치·출처는 `src/data/chapters.ts` 한 파일에서만 관리한다. 배포 전 팀원 2명이 교차 검수.
2. 애니메이션은 `transform`·`opacity`만. 챕터 안 스크럽은 스테이지의 CSS 변수 `--p0`~`--p9`(0~1)로 구동한다.
3. 색은 `src/styles/tokens.css` 토큰만 쓴다. 텍스트 대비가 부족한 SDG 색(`--sdg6-water`, `--sdg7-energy`)은 그래픽 전용.
4. 카피 톤: 해요체, 한 문장 25자 안팎, "당신 탓" 대신 "구조의 문제 + 내가 할 수 있는 일". 추정치는 "약".
5. 카피를 바꾸면 폰트 서브셋을 다시 만든다: `pip install fonttools brotli && python3 scripts/subset-fonts.py`

## 구조

```
src/
  data/chapters.ts      # 챕터 카피·수치·출처 (유일한 데이터 원본)
  styles/tokens.css     # 컬러·타이포·간격 토큰
  styles/app.css        # 레이아웃·장면·모션
  components/           # Stage, Shirt, Chrome(Hud·ProgressDots·SourceSheet·Toast),
                        # ChapterSection, StatCard, Widgets, Receipt
  lib/analytics.ts      # GA4 이벤트 래퍼 (chapter_view, ending_choice, receipt_share, cta_click)
```

## 배포 전에 채울 값 (PRD 열린 질문)

| 항목 | 위치 |
| --- | --- |
| 21% 파티 구글 폼 링크 | `PARTY_FORM_URL` in `src/data/chapters.ts` |
| 인스타 캠페인 계정 | `INSTAGRAM_URL` |
| 파티 후 교환된 옷 수 | `EXCHANGED_COUNT` (null이면 "파티 후 공개") |
| Ch.0 가격 칩 금액 | `PRICES` |
| GA4 측정 ID | 저장소 Settings → Secrets and variables → Actions → Variables에 `GA_ID` |

## 배포

`main`에 push하면 GitHub Actions가 빌드해 GitHub Pages로 배포한다 (`.github/workflows/deploy.yml`).
처음 한 번은 저장소 **Settings → Pages → Source를 "GitHub Actions"** 로 바꿔야 한다.

Vercel을 쓰려면 저장소를 Vercel에 import하고 환경변수 `VITE_SITE_URL`(끝에 `/`)과 `VITE_GA_ID`만 넣으면 된다 (`base: './'`라 경로 설정 불필요).

유입 경로 구분: 링크마다 `?utm_source=instagram` / `qr` / `kakao`.
