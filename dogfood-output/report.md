# Stamply QA Report — Admin 로그인/로그아웃

**날짜:** 2026-05-25  
**대상 URL:** http://localhost:3000/admin  
**범위:** 관리자 로그인 페이지, 대시보드 인증 가드, 로그아웃 버튼  
**결과 요약:** 이슈 2건 (Medium 1, Low 1) / 통과 2건

---

## 요약

| 심각도 | 건수 |
|--------|------|
| Critical | 0 |
| Medium | 1 |
| Low | 1 |
| Pass | 2 |

---

## ✅ 통과 항목

### PASS-001: 로그인 페이지 렌더링
- `/admin` 접근 시 로고, "행사 운영 관리자 로그인" 텍스트, 카카오 로그인 버튼 정상 표시
- 콘솔 에러 없음
- 스크린샷: `screenshots/initial.png`

### PASS-002: 인증 가드 리다이렉트
- 미인증 상태에서 `/admin/dashboard` 직접 접근 시 `/admin`으로 리다이렉트 동작
- `AdminUserInfo`의 `useEffect`에서 API 에러 감지 후 `router.replace('/admin')` 정상 작동

---

## ⚠️ 이슈

### ISSUE-001 [Medium]: 대시보드에 개발용 placeholder 텍스트 노출

**파일:** `app/(admin)/admin/dashboard/page.tsx:3`  
**증상:** 대시보드 최상단에 "토큰 발급 완료! 쿠키 확인" 텍스트가 그대로 노출됨

**재현 단계:**
1. 로그인 후 `/admin/dashboard` 접근
2. 페이지 상단에 "토큰 발급 완료! 쿠키 확인" 텍스트 노출 확인

**스크린샷:** `screenshots/issue-001-step-2.png`

**수정 방법:** 해당 텍스트를 실제 대시보드 콘텐츠로 교체 또는 제거

---

### ISSUE-002 [Low]: 클라이언트 사이드 인증 가드 — 대시보드 콘텐츠 순간 노출

**파일:** `app/(admin)/admin/dashboard/page.tsx`, `components/admin/admin-user-info.tsx`  
**증상:** 미인증 사용자가 `/admin/dashboard` URL 직접 접근 시, 리다이렉트 전 대시보드 UI(skeleton 포함)가 잠시 렌더링됨

**재현 단계:**
1. 로그인하지 않은 상태에서 `/admin/dashboard` 직접 입력
2. 대시보드 레이아웃이 약 1-2초 표시된 후 `/admin`으로 리다이렉트됨

**스크린샷:** `screenshots/issue-001-step-2.png`

**원인:** 인증 확인이 클라이언트 사이드(`useEffect`)에서만 이루어짐  
**권장 수정:** Next.js middleware에서 Supabase 세션 확인 후 서버 사이드 리다이렉트 적용

```ts
// middleware.ts 예시
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    // 세션 없으면 /admin으로 redirect
  }
}
```

---

## 로그아웃 테스트 (수동 확인 필요)

카카오 OAuth를 통한 실제 로그인 없이 자동화 테스트 불가.  
로그인 후 대시보드 우측 상단의 로그아웃 버튼(`aria-label="로그아웃"`) 클릭 → `/admin` 리다이렉트 여부를 수동으로 확인 필요.

**코드 분석 결과 (정상):**
- `POST /api/v1/admin/logout` → Supabase `signOut()` 호출
- 성공 시 `router.replace('/admin')` 동작 구현 확인 (`components/admin/logout.tsx:14`)
