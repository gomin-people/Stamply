# Modal 컴포넌트 코드 컨벤션

## 파일 목록

| 파일 | 역할 |
|---|---|
| `ModalPortal.tsx` | 모든 모달의 렌더링 기반 — DOM Portal + 스크롤 잠금 |
| `ModalAlert.tsx` | 확인/취소 버튼이 있는 알럿 다이얼로그 |
| `ModalActionSheet.tsx` | 하단에서 올라오는 액션 시트 (삭제/취소) |
| `ModalFullPage.tsx` | 화면 전체를 덮는 풀페이지 모달 |
| `ModalPopup.tsx` | 하단 시트 형태의 범용 팝업 |
| `ModalPostCode.tsx` | 우편번호 검색 전용 하단 시트 |
| `ModalPicture.tsx` | 사진 전체화면 뷰어 |
| `ModalLoading.tsx` | 로딩 스피너 오버레이 |
| `ModalToast.tsx` | 자동으로 사라지는 토스트 메시지 |

---

## 1. ModalPortal — 렌더링 기반

```tsx
// SSR 방지: 모든 모달은 dynamic import + ssr: false 로 ModalPortal 불러옴
const ModalPortal = dynamic(() => import('./ModalPortal'), { ssr: false });

// #main-content 엘리먼트에 Portal로 렌더링
// 마운트 시 #main-layout 의 overflow/touchAction 을 hidden/none 으로 잠금
// 언마운트 시 자동 복원 (useLayoutEffect cleanup)
```

---

## 2. Props 인터페이스 공통 패턴

```tsx
interface ModalProps {
  enable: boolean;       // 필수 — 모달 표시 여부를 외부에서 제어
  onClose: () => void;   // 닫기 콜백 (ModalPopup, ModalFullPage, ModalPostCode)
  onCancel?: () => void; // 취소 콜백 (ModalAlert, ModalActionSheet, ModalPicture)
  onConfirm: () => void; // 확인 콜백 (ModalAlert)
  children?: ReactNode;  // 내용 슬롯 (ModalAlert, ModalFullPage, ModalPopup, ModalToast)
  title?: string;        // 선택적 헤더 제목 (ModalPopup, ModalPostCode)
}
```

- `enable` prop 이 **진실의 원천(source of truth)** — 컴포넌트가 자체적으로 열고 닫지 않음
- 인터페이스 이름은 대부분 `ModalProps`, export 가 필요한 경우에만 `export interface` 사용
- `FC<ModalProps>` 타입으로 컴포넌트 선언

---

## 3. 애니메이션 지연 닫기 패턴

모든 모달(Toast 제외)에서 동일하게 사용:

```tsx
const [modalOpen, setModalOpen] = useState<boolean>(enable);

useEffect(() => {
  if (!enable) {
    // 닫힐 때: 250ms 애니메이션 재생 후 DOM에서 제거
    setTimeout(() => {
      setModalOpen(false);
    }, 250);
  } else {
    setModalOpen(true);
    // 히스토리 조작 + popstate 등록 (아래 섹션 참조)
  }
  return () => window.removeEventListener('popstate', closeModal);
}, [enable]);
```

- `enable = false` → 즉시 DOM 제거하지 않고 **250ms 대기** → 닫힘 애니메이션 완료 후 unmount
- `modalOpen` 은 DOM 마운트 제어용, `enable` 은 애니메이션 클래스 전환용으로 역할이 분리됨

---

## 4. 뒤로가기(popstate) 연동 패턴

로딩/토스트를 제외한 모든 모달에 적용:

```tsx
const { asPath, basePath } = useCustomRouter();
const currentPath = `${basePath}${asPath}`;

// 열릴 때: 현재 경로를 history에 push → 브라우저 뒤로가기가 모달 닫기로 동작
window.history.pushState(undefined, '', currentPath);
window.addEventListener('popstate', closeModal);

// 닫힐 때 (X 버튼, 취소 버튼):
window.history.go(-1); // push 했던 항목 제거
onClose();             // 부모에게 닫힘 통보

const closeModal = (e: PopStateEvent) => {
  e.preventDefault();
  onClose();
  window.removeEventListener('popstate', closeModal); // 리스너 즉시 해제
};
```

- `window.history.pushState` 로 히스토리 스택에 가상 진입점 추가
- 뒤로가기 시 `popstate` 이벤트로 모달 닫기 처리
- 버튼 클릭으로 닫을 때는 반드시 `window.history.go(-1)` 호출하여 스택 정리

---

## 5. 애니메이션 클래스 패턴

```tsx
// enable 값에 따라 Tailwind 커스텀 애니메이션 클래스 토글
className={`... ${enable ? 'animate-fade-in' : 'animate-fade-out'}`}
className={`... ${enable ? 'animate-fade-in-up' : 'animate-fade-out-up'}`}
```

| 클래스 | 용도 |
|---|---|
| `animate-fade-in` | 딤드 배경, 얼럿 다이얼로그 |
| `animate-fade-out` | 위의 닫힘 방향 |
| `animate-fade-in-up` | 하단 시트, 액션시트, 토스트 |
| `animate-fade-out-up` | 위의 닫힘 방향 |

---

## 6. 레이아웃 구조 패턴

### 딤드 배경 (오버레이)
```tsx
<div className={`fixed top-0 max-w-[var(--max-width)] w-full h-screen bg-black opacity-50 ${...}`} />
```

### 모달 콘텐츠 컨테이너
```tsx
// 센터 다이얼로그 (ModalAlert, ModalPicture)
<div className="fixed max-w-[var(--modal-max-width)] w-full rounded-lg overflow-hidden ..." />

// 하단 시트 (ModalPopup, ModalPostCode, ModalActionSheet)
<div className="fixed bottom-0 max-w-[var(--modal-max-width)] w-full max-h-[90vh] bg-white rounded-t-[20px] ..." />

// 풀페이지 (ModalFullPage)
<div className="fixed top-0 max-w-[var(--max-width)] w-full h-full z-50 ..." />
```

### CSS 변수
| 변수 | 용도 |
|---|---|
| `var(--max-width)` | 앱 전체 최대 너비 (배경 오버레이) |
| `var(--modal-max-width)` | 모달 콘텐츠 최대 너비 |

### 공통 z-index
```tsx
z-50   // 모달 루트 래퍼
z-50   // 콘텐츠 (로딩 스피너 등 특정 경우)
```

### 스크롤 제한
```tsx
// 스크롤 가능한 내부 영역
className="w-full max-h-[calc(90vh-72px)] overflow-hidden overflow-y-auto"
//                              ↑ 헤더 높이(55px) + 버튼 영역(17px) 제외
```

---

## 7. 렌더링 조건
```tsx
return (
  <>
    {modalOpen && (
      <ModalPortal>
        {/* 콘텐츠 */}
      </ModalPortal>
    )}
  </>
);
```
- Fragment(`<>`) + 조건부 렌더링으로 감싸는 것이 표준 패턴

---

## 8. 예외 — ModalLoading / ModalToast

### ModalLoading
- `window.history` 조작 없음 (뒤로가기로 닫지 않음)
- `children` 없음 — `LoadingSpinner` 컴포넌트 내장

### ModalToast
- `window.history` 조작 없음
- 2000ms 후 `onClose()` 자동 호출 → 250ms 후 `setModalOpen(false)`
- 딤드 배경 없음 (`bg-transparent`)

---

## 샘플 코드 — 새 모달 작성 템플릿

```tsx
import dynamic from 'next/dynamic';
import { FC, ReactNode, useEffect, useState } from 'react';
import useCustomRouter from '@hooks/useCoustomRouter';

const ModalPortal = dynamic(() => import('./ModalPortal'), { ssr: false });

interface ModalXxxProps {
  enable: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
}

const ModalXxx: FC<ModalXxxProps> = ({ enable, title = '', children, onClose }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(enable);
  const { asPath, basePath } = useCustomRouter();
  const currentPath = `${basePath}${asPath}`;

  useEffect(() => {
    if (!enable) {
      setTimeout(() => {
        setModalOpen(false);
      }, 250);
    } else {
      setModalOpen(true);
      window.history.pushState(undefined, '', currentPath);
      window.addEventListener('popstate', closeModal);
    }
    return () => window.removeEventListener('popstate', closeModal);
  }, [enable]);

  const closeModal = (e: PopStateEvent) => {
    e.preventDefault();
    onClose();
    window.removeEventListener('popstate', closeModal);
  };

  return (
    <>
      {modalOpen && (
        <ModalPortal>
          <div className="fixed top-0 max-w-[var(--max-width)] w-full h-screen z-50 flex justify-center">
            {/* 딤드 배경 */}
            <div
              className={`fixed top-0 max-w-[var(--max-width)] w-full h-screen bg-black opacity-50 ${
                enable ? 'animate-fade-in' : 'animate-fade-out'
              }`}
            />
            {/* 콘텐츠 */}
            <div
              className={`fixed bottom-0 max-w-[var(--modal-max-width)] w-full max-h-[90vh] bg-white rounded-t-[20px] touch-none ${
                enable ? 'animate-fade-in-up' : 'animate-fade-out-up'
              }`}>
              {/* 헤더 */}
              <div className="relative w-full h-[55px] flex justify-center items-center px-[24px] border-b border-gray3">
                <span className="text-gray900 font-semibold text-[16px]">{title}</span>
              </div>
              {/* 바디 */}
              <div className="w-full max-h-[calc(90vh-72px)] overflow-hidden overflow-y-auto">
                {children}
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  );
};

export default ModalXxx;
```
