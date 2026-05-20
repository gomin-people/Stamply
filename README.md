# Stamply

팝업스토어 현장의 종이 브로슈어 + 스탬프 방식을 디지털화한 서비스.
관람객은 QR 스캔으로 미션을 수행하고, 운영자는 실시간으로 현황을 관리한다.

## 플랫폼

| 플랫폼          | 설명                        |
| --------------- | --------------------------- |
| 랜딩페이지      | 서비스 소개                 |
| 유저 (모바일웹) | 관람객 QR 스캔 및 미션 수행 |
| 어드민 (PC웹)   | 운영자 실시간 현황 관리     |

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **데이터 패칭**: TanStack Query, fetch
- **상태 관리**: Zustand
- **스타일**: Tailwind CSS
- **테스트**: Jest, Testing Library
- **빌드 도구**: pnpm

## 폴더 구조

```
app/
├── (landing)/   # 랜딩페이지
├── (user)/      # 유저 사이드 (모바일)
├── (admin)/     # 어드민 사이드 (PC)
├── api/         # Next.js Route Handler API
├── providers.tsx
└── layout.tsx

features/        # API 호출, React Query 훅, 도메인별 프론트 로직
components/      # 컴포넌트
hooks/           # 커스텀 훅
utils/           # 유틸 함수
├── api.ts       # API 응답, 쿠키, 파싱, 에러 유틸
└── supabase/    # Supabase 서버 클라이언트
constants/       # 상수
types/
└── models/      # API 응답 타입
test/
└── components/  # 컴포넌트 테스트
```

## 시작하기

```bash
pnpm install
```

`.env.example`을 참고해 `.env.development` 파일을 생성한다.

```bash
pnpm dev
```

## 테스트

```bash
pnpm test
```
