# AGENTS.md

이 파일은 Codex와 다른 코딩 에이전트가 이 저장소에서 작업할 때 따를 프로젝트 지침입니다.

## 프로젝트 개요

Stamply는 팝업스토어 현장의 종이 브로슈어와 스탬프 방식을 디지털화하는 서비스입니다.

- 랜딩페이지: 서비스 소개
- 유저 모바일웹: 관람객 QR 스캔 및 미션 수행
- 어드민 PC웹: 운영자 실시간 현황 관리

## 기술 스택

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- TanStack Query
- Zustand
- Supabase
- Jest, Testing Library
- pnpm

## 주요 명령어

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm test
```

개발 서버는 기본적으로 `http://localhost:3000`을 사용합니다.

## 폴더 구조

- `app/`: Next.js App Router 라우트
  - `app/(landing)/`: 랜딩페이지
  - `app/(user)/`: 유저 모바일웹
  - `app/(admin)/`: 어드민 PC웹
  - `app/api/`: Route Handler API
  - `app/reference/`: Scalar API Reference
- `components/`: 공용 및 화면별 UI 컴포넌트
- `features/`: 도메인별 API 호출, React Query 훅, 프론트 로직
- `hooks/`: 공용 커스텀 훅
- `stores/`: Zustand 스토어
- `utils/`: 공용 유틸리티
- `utils/supabase/`: Supabase 클라이언트
- `constants/`: 상수
- `types/`: 공용 타입 및 API 모델 타입
- `test/`: 테스트 유틸리티 및 테스트 코드
- `supabase/migrations/`: Supabase 마이그레이션

## DB 구조

확인 기준:

- 2026-06-01 06:10:30 UTC에 Supabase SQL Editor에서 `pg_catalog`, `information_schema`, `pg_policies`, `storage.buckets`를 조회한 결과를 기준으로 작성한다.
- 로컬 `supabase/migrations/` 디렉터리는 현재 비어 있다.
- 모든 테이블은 `public` 스키마의 일반 테이블(`relkind = r`)이다.
- 모든 테이블은 RLS가 활성화되어 있고(`rls_enabled = true`), 강제 RLS는 꺼져 있다(`rls_forced = false`).
- `public` 스키마에 view와 사용자 정의 trigger는 없다.

### 테이블

#### `events`

행사 기본 정보를 저장한다.

| 컬럼                 | 타입                          | 제약/기본값                         | 설명                     |
| -------------------- | ----------------------------- | ----------------------------------- | ------------------------ |
| `id`                 | `integer`                     | PK, identity `BY DEFAULT`, NOT NULL | 행사 ID                  |
| `user_id`            | `uuid`                        | NOT NULL                            | 행사 소유 운영자 ID      |
| `title`              | `text`                        | NOT NULL                            | 행사명                   |
| `start_date`         | `date`                        | NOT NULL                            | 행사 시작일              |
| `end_date`           | `date`                        | NOT NULL                            | 행사 종료일              |
| `start_time`         | `timestamp without time zone` | NOT NULL                            | 행사 시작 시간           |
| `end_time`           | `timestamp without time zone` | NOT NULL                            | 행사 종료 시간           |
| `operating_remarks`  | `text`                        | nullable                            | 운영 시간 안내           |
| `location`           | `text`                        | NOT NULL                            | 행사 위치                |
| `location_url`       | `text`                        | nullable                            | 행사 위치 URL            |
| `notice`             | `text`                        | nullable                            | 행사 공지사항            |
| `contact_phone`      | `text`                        | nullable                            | 문의 연락처              |
| `contact_email`      | `text`                        | nullable                            | 문의 이메일              |
| `production`         | `text`                        | NOT NULL                            | 주최 이름                |
| `poster_image_url`   | `text`                        | NOT NULL                            | 포스터 이미지 URL        |
| `brochure_image_url` | `json`                        | nullable                            | 브로슈어 이미지 URL      |
| `stamp_image_url`    | `text`                        | nullable                            | 커스텀 스탬프 이미지 URL |
| `primary_color`      | `text`                        | NOT NULL, default `'#5435EB'::text` | 행사 대표 색상           |
| `reward_stock`       | `integer`                     | NOT NULL, default `0`               | 리워드 수령 개수         |
| `created_at`         | `timestamp without time zone` | NOT NULL                            | 생성 시각                |
| `updated_at`         | `timestamp without time zone` | NOT NULL                            | 수정 시각                |

#### `missions`

행사별 미션을 저장한다.

| 컬럼          | 타입                          | 제약/기본값                         | 설명           |
| ------------- | ----------------------------- | ----------------------------------- | -------------- |
| `id`          | `integer`                     | PK, identity `BY DEFAULT`, NOT NULL | 미션 ID        |
| `events_id`   | `integer`                     | FK `events.id`, NOT NULL            | 소속 행사 ID   |
| `title`       | `text`                        | NOT NULL                            | 미션명         |
| `description` | `text`                        | nullable                            | 미션 설명      |
| `sort_order`  | `smallint`                    | NOT NULL                            | 미션 표시 순서 |
| `is_active`   | `boolean`                     | NOT NULL                            | 미션 활성 여부 |
| `created_at`  | `timestamp without time zone` | NOT NULL                            | 생성 시각      |
| `updated_at`  | `timestamp without time zone` | NOT NULL                            | 수정 시각      |

#### `qr_codes`

입장, 미션, 리워드 QR 토큰을 저장한다.

| 컬럼          | 타입                          | 제약/기본값                           | 설명             |
| ------------- | ----------------------------- | ------------------------------------- | ---------------- |
| `id`          | `integer`                     | PK, identity `BY DEFAULT`, NOT NULL   | QR 코드 ID       |
| `events_id`   | `integer`                     | FK `events.id`, NOT NULL              | 소속 행사 ID     |
| `missions_id` | `integer`                     | FK `missions.id`, nullable            | 미션 ID          |
| `type`        | `public.type`                 | NOT NULL                              | QR 타입          |
| `token`       | `uuid`                        | NOT NULL, default `gen_random_uuid()` | QR URL 고유 토큰 |
| `created_at`  | `timestamp without time zone` | NOT NULL                              | 생성 시각        |

#### `participant_users`

행사 참여자를 저장한다.

| 컬럼                | 타입                          | 제약/기본값                           | 설명                               |
| ------------------- | ----------------------------- | ------------------------------------- | ---------------------------------- |
| `id`                | `integer`                     | PK, identity `BY DEFAULT`, NOT NULL   | 임시 유저 ID                       |
| `events_id`         | `integer`                     | FK `events.id`, NOT NULL              | 참여 중인 행사 ID                  |
| `user_id`           | `text`                        | nullable                              | 사용자 ID                          |
| `event_user_id`     | `uuid`                        | NOT NULL, default `gen_random_uuid()` | 쿠키에 사용되는 임시 참여자 식별자 |
| `gender`            | `public.gender`               | nullable                              | 성별                               |
| `age_range`         | `text`                        | nullable                              | 나이대                             |
| `is_reward_claimed` | `boolean`                     | NOT NULL, default `false`             | 리워드 수령 여부                   |
| `created_at`        | `timestamp without time zone` | NOT NULL                              | 생성 시각                          |

#### `mission_completions`

참여자별 미션 완료 기록을 저장한다.

| 컬럼                   | 타입                          | 제약/기본값                         | 설명              |
| ---------------------- | ----------------------------- | ----------------------------------- | ----------------- |
| `id`                   | `integer`                     | PK, identity `BY DEFAULT`, NOT NULL | 미션 완료 기록 ID |
| `events_id`            | `integer`                     | FK `events.id`, NOT NULL            | 행사 ID           |
| `missions_id`          | `integer`                     | FK `missions.id`, NOT NULL          | 완료 미션 ID      |
| `participant_users_id` | `integer`                     | FK `participant_users.id`, NOT NULL | 임시 유저 ID      |
| `completed_at`         | `timestamp without time zone` | NOT NULL, default `now()`           | 미션 완료 시각    |

#### `user_info`

사용자 권한 정보를 저장한다.

| 컬럼      | 타입          | 제약/기본값  | 설명      |
| --------- | ------------- | ------------ | --------- |
| `user_id` | `integer`     | PK, NOT NULL | 사용자 ID |
| `role`    | `public.role` | NOT NULL     | 권한      |

### Enum

- `public.gender`: `MALE`, `FEMALE`, `UNKNOWN`
- `public.type`: `MISSION`, `ENTRY`, `REWARD`
- `public.role`: `ADMIN`, `USER`

### 관계

- `missions.events_id` -> `events.id` (`ON DELETE CASCADE`)
- `qr_codes.events_id` -> `events.id` (`ON DELETE CASCADE`)
- `qr_codes.missions_id` -> `missions.id` (`ON DELETE CASCADE`)
- `participant_users.events_id` -> `events.id` (`ON DELETE CASCADE`)
- `mission_completions.events_id` -> `events.id` (`ON DELETE CASCADE`)
- `mission_completions.missions_id` -> `missions.id` (`ON DELETE CASCADE`)
- `mission_completions.participant_users_id` -> `participant_users.id` (`ON DELETE CASCADE`)

### 제약조건

- `PK_EVENTS`: `events(id)`
- `PK_MISSIONS`: `missions(id)`
- `PK_QR_CODES`: `qr_codes(id)`
- `PK_PARTICIPANT_USERS`: `participant_users(id)`
- `PK_MISSION_COMPLETIONS`: `mission_completions(id)`
- `PK_USER_INFO`: `user_info(user_id)`
- `mission_completions_event_mission_participant_unique`: `UNIQUE (events_id, missions_id, participant_users_id)`
- `mission_completions_participant_users_id_missions_id_key`: `UNIQUE (participant_users_id, missions_id)`

### 인덱스

- `PK_EVENTS`: unique primary index on `events(id)`
- `PK_MISSIONS`: unique primary index on `missions(id)`
- `PK_QR_CODES`: unique primary index on `qr_codes(id)`
- `PK_PARTICIPANT_USERS`: unique primary index on `participant_users(id)`
- `PK_MISSION_COMPLETIONS`: unique primary index on `mission_completions(id)`
- `PK_USER_INFO`: unique primary index on `user_info(user_id)`
- `mission_completions_event_mission_participant_unique`: unique index on `mission_completions(events_id, missions_id, participant_users_id)`
- `mission_completions_participant_users_id_missions_id_key`: unique index on `mission_completions(participant_users_id, missions_id)`

### RLS 정책

모든 테이블은 RLS가 활성화되어 있다. 조회된 정책은 아래뿐이다.

| 테이블     | 정책                                         | 명령     | 역할            | USING                    | WITH CHECK               |
| ---------- | -------------------------------------------- | -------- | --------------- | ------------------------ | ------------------------ |
| `events`   | `users can create own events`                | `INSERT` | `authenticated` | -                        | `(auth.uid() = user_id)` |
| `events`   | `users can read own events`                  | `SELECT` | `authenticated` | `(auth.uid() = user_id)` | -                        |
| `events`   | `users can update own events`                | `UPDATE` | `authenticated` | `(auth.uid() = user_id)` | `(auth.uid() = user_id)` |
| `events`   | `users can delete own events`                | `DELETE` | `authenticated` | `(auth.uid() = user_id)` | -                        |
| `missions` | `Enable insert for authenticated users only` | `INSERT` | `authenticated` | -                        | `true`                   |
| `missions` | `Enable select for authenticated users only` | `SELECT` | `authenticated` | `true`                   | -                        |
| `qr_codes` | `Enable insert for authenticated users only` | `INSERT` | `authenticated` | -                        | `true`                   |
| `qr_codes` | `Enable select for authenticated users only` | `SELECT` | `authenticated` | `true`                   | -                        |

조회 결과 기준으로 `mission_completions`, `participant_users`, `user_info`에는 명시적 RLS 정책이 없다. 이 테이블 접근 경로를 바꿀 때는 service role 사용 여부와 RLS 동작을 먼저 검증한다.

### RPC

`public` 스키마에 정의된 함수는 다음과 같다.

| 함수                          | 인자 | 반환               | 속성                                       | 설명                                                                 |
| ----------------------------- | ---- | ------------------ | ------------------------------------------ | -------------------------------------------------------------------- |
| `get_priority_admin_event`    | 없음 | `TABLE(id bigint)` | `LANGUAGE sql`, `STABLE`, security invoker | 진행 중, 예정, 종료 행사 순으로 우선순위를 계산해 행사 ID 1개를 반환 |
| `get_priority_admin_event_id` | 없음 | `bigint`           | `LANGUAGE sql`, `STABLE`, security invoker | 진행 중, 예정, 종료 행사 순으로 우선순위를 계산해 행사 ID 1개를 반환 |

### Storage

- Bucket: `Stamply`
- 공개 여부: public
- 파일 크기 제한과 허용 MIME 타입 제한은 Supabase Storage API 기준으로 설정되어 있지 않다.

## 작업 원칙

- 사용자가 바로 작업하라는 직접적인 표현을 하지 않았다면 파일 수정, 명령 실행, 구현 작업을 먼저 진행하지 않는다.
- 이 경우 먼저 필요한 단계, 방법, 영향 범위, 확인할 내용을 설명하고 사용자의 다음 지시를 기다린다.
- 기존 코드 스타일과 폴더 경계를 먼저 확인하고 그 패턴을 따른다.
- React 컴포넌트와 헬퍼 함수는 특별한 이유가 없으면 화살표 함수로 선언한다.
- 컴포넌트 props 타입은 `interface`보다 `type Props = { ... }` 형태를 우선 사용한다.
- 스타일 색상, radius, shadow 등은 `app/globals.css`에 정의된 Tailwind 토큰을 우선 사용한다. 단일 화면에서만 쓰는 보조/장식 색상은 의미 없는 토큰을 늘리기보다 TSX의 Tailwind arbitrary value를 제한적으로 허용한다.
- App Router 규칙을 지키고, 서버 컴포넌트와 클라이언트 컴포넌트 경계를 명확히 한다.
- 클라이언트 상태는 기존 Zustand 패턴을 우선 사용하고, 서버 상태는 TanStack Query 패턴을 따른다.
- API 응답, 파싱, 에러 처리, 쿠키 관련 공용 로직은 `utils/api.ts`와 기존 유틸을 먼저 확인한다.
- Supabase 접근은 기존 `utils/supabase/` 헬퍼를 우선 사용한다.
- UI 컴포넌트는 기존 `components/ui/` 및 화면별 컴포넌트 구조를 재사용한다.
- 불필요한 리팩터링, 포맷 변경, 파일 이동은 피한다.
- 사용자가 만들지 않은 변경사항을 되돌리지 않는다.

## 커밋 메시지

- 커밋 메시지는 한글로 작성한다.
- 커밋 제목은 아래 구분 타이틀 중 하나로 시작한다.

### 커밋 구분 타이틀

- `feat`: 새로운 기능 개발
- `fix`: 기존 기능 버그 개선
- `refactor`: 로직 수정 없는 구조 개선
- `docs`: 문서 변경 사항 발생 시 (주석, README 등)
- `chore`: 코드 수정이 없는 변경 사항 (환경 셋업, Prettier 규칙, ESLint 규칙 등)
- `style`: 스타일 규칙 변경

## PR 설명

- PR 설명은 GitHub Markdown 문법으로 작성한다.
- 아래 템플릿을 기준으로 변경 내용, 의도, 리뷰 포인트를 명확히 작성한다.
- UI 변경이 포함된 경우 스크린샷 섹션을 유지하고 관련 화면을 첨부한다.

```markdown
## 무엇을 변경했나요?

(변경 내용 1~2줄 요약)

## 왜 이렇게 했나요?

(선택한 이유, 다른 방법 대신 이걸 선택한 이유)

## 리뷰어가 특히 봐줬으면 하는 부분

- [ ] (예: 이 로직이 엣지케이스를 잘 처리하는지)

## 스크린샷 (UI 변경 시)
```

## 검증 기준

변경 범위에 따라 가능한 검증을 실행한다.

- 일반 코드 변경: `pnpm lint`
- 로직 또는 컴포넌트 변경: `pnpm test`
- 빌드 영향이 큰 변경: `pnpm build`
- UI 변경: 개발 서버에서 실제 화면을 확인한다.

검증을 실행하지 못했거나 실패했으면 최종 응답에 이유와 남은 리스크를 명확히 적는다.

## API 문서

- Scalar API Reference UI: `http://localhost:3000/reference`
- OpenAPI JSON: `http://localhost:3000/openapi.json`
