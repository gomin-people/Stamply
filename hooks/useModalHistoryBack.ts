import { useEffect } from "react";

/**
 * 모달이 열려 있을 때 브라우저 히스토리 엔트리를 추가해,
 * 안드로이드 백버튼(popstate)으로 모달만 닫히고 이전 페이지로 이동하지 않도록 한다.
 */
export const useModalHistoryBack = (isOpen: boolean, onClose: () => void) => {
  useEffect(() => {
    if (!isOpen) return;

    // 모달이 열릴 때 현재 URL로 히스토리 엔트리 하나 추가
    history.pushState({ modal: true }, "");

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, onClose]);
};
