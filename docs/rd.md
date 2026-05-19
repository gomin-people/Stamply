
# Stamply

팝업스토어 현장의 종이 브로슈어 + 스탬프 방식을 디지털화한 서비스.
관람객은 QR 스캔으로 미션을 수행하고, 운영자는 실시간으로 현황을 관리한다.

---

## 플랫폼 구성

한 프로젝트 안에서 Next.js Route Groups로 세 플랫폼을 분리한다.

| 그룹 | 경로 | 설명 |
|------|------|------|
| `(landing)` | `/` | 랜딩페이지 |
| `(user)` | `/missions` 등 | 모바일웹, 관람객 사이드 |
| `(admin)` | `/admin` 등 | PC웹, 운영자 사이드 |

**Route Groups를 쓰는 이유**
괄호 폴더명은 URL에 영향을 주지 않는다. `app/(user)/missions/page.tsx` → URL은 `/missions`.
각 그룹이 독립적인 `layout.tsx`를 가질 수 있어서, 어드민(PC 사이드바)과 유저(모바일 풀스크린)를 완전히 다른 레이아웃으로 분리하면서도 URL을 오염시키지 않는다.

**라우팅 작성 방법**
- 파일 경로: `app/(user)/missions/page.tsx`
- 코드에서 이동: `router.push('/missions')` (괄호 그룹명은 URL에 포함하지 않음)

---

## 기술 스택

- **Framework**: Next.js (App Router)
- **데이터 패칭**: TanStack Query (`@tanstack/react-query`), fetch
- **상태 관리**: Zustand
- **빌드 도구**: pnpm
- **테스트**: Jest + Testing Library

---

## 폴더 구조

```
app/
├── (landing)/
│   ├── layout.tsx       # 랜딩 전용 레이아웃
│   ├── page.tsx
│   ├── error.tsx        # 에러 바운더리
│   └── loading.tsx      # 로딩 스켈레톤
├── (user)/
│   ├── layout.tsx       # 모바일 최적화 레이아웃
│   ├── page.tsx
│   ├── error.tsx
│   └── loading.tsx
├── (admin)/
│   ├── layout.tsx       # PC 최적화 레이아웃
│   ├── page.tsx
│   ├── error.tsx
│   └── loading.tsx
├── providers.tsx        # TanStack Query 등 전역 Provider
├── layout.tsx           # 루트 레이아웃
├── not-found.tsx        # 전역 404
└── globals.css

ui/          # 공통 컴포넌트 (e.g. ui/Button.tsx)
hooks/       # 커스텀 훅
utils/       # 유틸 함수
constants/   # 상수값, 에러 텍스트 등 파일로 분리
types/
  models/    # API 응답 타입 (Models/ prefix)
test/
  ui/        # 컴포넌트 테스트 (e.g. test/ui/Button.test.tsx)
```

---

## 타입 컨벤션

- API 응답값은 `Models/` 뒤에 붙여서 사용 (e.g. `ModelsStamp`)
- Props는 `type` 선언
- 그 외 타입은 `interface` 사용

---

## 환경 설정

- `.env.example` — 팀원 공유용, 커밋에 포함
- `.env.development`, `.env.production` — 실제 값, gitignore 처리

---

## 코드 품질

- ESLint + Prettier 세팅
- Path alias 세팅 (`@ui/*`, `@hooks/*`, `@utils/*`, `@constants/*`, `@types/*`)

---

## 보안

- `middleware.ts`로 `(admin)` 경로 보호 (로그인한 사용자만 접근)
