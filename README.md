# 🎯 Stamply

팝업스토어 현장의 종이 브로슈어 + 스탬프 방식을 디지털화한 서비스.  
관람객은 QR 스캔으로 미션을 수행하고, 운영자는 실시간으로 현황을 관리한다.

## ✨ 주요 기능

### 👤 유저 (모바일웹)

- **📷 QR 입장** — 행사 입구 QR 스캔 시 임시 userId 발급, 쿠키 기반 상태 복원
- **📖 브로슈어** — 행사 포스터 이미지 슬라이드 / 행사 상세 정보 확인
- **🎯 스탬프 미션** — 스탬프 UI / 리스트 UI 전환, 부스별 QR 스캔으로 미션 완료
- **🎁 설문 + 완료** — 전체 미션 완료 후 설문 제출 → 직원 확인 화면

### 🛠️ 어드민 (PC웹)

- **🎪 행사 관리** — 행사 CRUD, 테마 컬러 지정, 브로슈어 이미지 업로드
- **🗂️ 미션 관리** — 미션 CRUD, 부스별 QR 생성 및 다운로드
- **📊 대시보드** — 참여자 수, 미션 완료율, 시간대별 입장 추이, 설문 응답 분포 차트

### 🌐 랜딩페이지

서비스 소개 및 어드민 시작 페이지 (2차 MVP 제작 예정)

## 🧰 기술 스택

| 구분           | 사용 기술                    |
| -------------- | ---------------------------- |
| Framework      | Next.js 16 (App Router)      |
| Language       | TypeScript                   |
| 데이터 패칭    | TanStack Query v5            |
| 상태 관리      | Zustand                      |
| 스타일         | Tailwind CSS v4, shadcn/ui   |
| 애니메이션     | Framer Motion                |
| 폼 유효성      | Zod                          |
| 차트           | Recharts                     |
| 드래그앤드롭   | dnd-kit                      |
| BaaS           | Supabase (DB, Storage, Auth) |
| 인증           | Kakao OAuth                  |
| 테스트         | Jest, Testing Library        |
| 패키지 매니저  | pnpm                         |

## 🗂️ 아키텍처

```
app/
├── (landing)/          # 랜딩페이지
├── (user)/             # 유저 사이드 (모바일)
│   └── event/[eventId]/
│       ├── brochure/   # 브로슈어
│       ├── mission/    # 미션 목록
│       ├── qr-check/   # QR 스캔
│       ├── complete/   # 완료 + 설문
│       └── detail/     # 행사 상세
├── (admin)/            # 어드민 사이드 (PC)
│   └── admin/events/[eventId]/
│       ├── dashboard/  # 현황 대시보드
│       └── missions/   # 미션 관리
└── api/v1/             # Route Handler (REST API + OpenAPI 3.1)

features/               # 도메인별 API 호출 · React Query 훅
components/             # 공통 컴포넌트
stores/                 # Zustand 스토어
hooks/                  # 커스텀 훅
utils/                  # 유틸 함수 (API, Supabase 클라이언트 등)
types/models/           # API 응답 타입
```

## 👥 팀원

| 이름 | 역할 |
| --- | --- |
| 권우진 | Frontend, UI/UX Designer |
| 김현미 | Frontend, Project Manager |
| 김예림 | Frontend, 기획자 |
| 이현성 | Frontend, Backend, Infra |

## 🚀 시작하기

```bash
pnpm install
```

`.env.example`을 참고해 `.env.development` 파일을 생성한다.

```bash
pnpm dev
```

## 🧪 테스트

```bash
pnpm test
```

## 📚 API Reference

로컬 서버 실행 후 아래 주소에서 OpenAPI 3.1 문서를 확인할 수 있다.

| 항목          | 주소                               |
| ------------- | ---------------------------------- |
| Scalar UI     | http://localhost:3000/reference    |
| OpenAPI JSON  | http://localhost:3000/openapi.json |
