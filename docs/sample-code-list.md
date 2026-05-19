# 샘플 코드 리스트

MVP 기획서 기반으로 개발 시작 전 작성할 샘플 코드 목록.
목적: mock 데이터로 화면이 렌더링되는 수준까지.

---

## 폴더 구조

```
components/
├── ui/       # 순수 UI 프리미티브 — 도메인 모름
├── user/     # 유저 사이드 전용
└── admin/    # 어드민 사이드 전용

utils/
types/
```

---

## 1. 유틸 (`utils/`)

| 파일 | 설명 |
| --- | --- |
| `cn.ts` | Tailwind 클래스 병합 |
| `fetcher.ts` | `NEXT_PUBLIC_API_URL` 기반 fetch 래퍼 |

---

## 2. 공통 UI 컴포넌트 (`components/ui/`)

| 파일 | 설명 |
| --- | --- |
| `Button.tsx` | primary / ghost variant |
| `Input.tsx` | text / select 폼 입력 |
| `Modal.tsx` | 범용 모달 (children 주입) |
| `Skeleton.tsx` | 이미지/데이터 로딩 중 표시 |

---

## 3. 유저 컴포넌트 (`components/user/`)

| 파일 | 설명 |
| --- | --- |
| `StampCard.tsx` | 스탬프 하나 — 완료/미완료 상태 |
| `StampBoard.tsx` | 스탬프 그리드 배치 |
| `MissionCard.tsx` | 미션 리스트 카드 (카드 UI용) |

---

## 4. 어드민 컴포넌트 (`components/admin/`)

| 파일 | 설명 |
| --- | --- |
| `StatsCard.tsx` | 현황 조회 숫자 카드 |

---

## 5. 유저 사이드 페이지 (`app/(user)/`)

mock 데이터로 렌더링. API 연동 없음.

| 페이지 | 경로 | 설명 |
| --- | --- | --- |
| 행사 입장 | `/event/[id]` | 포스터 이미지 + 시작하기 버튼 |
| 브로슈어 | `/event/[id]/brochure` | 이미지 슬라이드 |
| 미션 | `/event/[id]/missions` | 스탬프 UI / 카드 UI 전환 + 하단 QR 버튼 |
| 직원 확인 | `/event/[id]/complete` | 완료 화면 + 직원 확인 버튼 |

> 설문조사는 미션 페이지에서 Modal로 표시

---

## 6. 어드민 사이드 페이지 (`app/(admin)/`)

mock 데이터로 렌더링. API 연동 없음.

| 페이지 | 경로 | 설명 |
| --- | --- | --- |
| 로그인 | `/admin/login` | 카카오 로그인 버튼 |
| 행사 목록 | `/admin` | 행사 카드 리스트 |
| 행사 생성/수정 | `/admin/events/new` | 행사 정보 입력 폼 |
| 미션 관리 | `/admin/events/[id]/missions` | 미션 목록 + QR 발급 버튼 |
| 현황 조회 | `/admin/events/[id]/stats` | 참여자 통계 대시보드 |
