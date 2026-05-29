"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/user/header/Header";

const shouldHideHeader = (pathname: string) => {
  // 1. 최상위 루트(/)인 경우 숨김
  if (pathname === "/") return true;

  // 경로의 세그먼트 분석 (예: '/event/coex/brochure' => ['event', 'coex', 'brochure'])
  const segments = pathname.split("/").filter(Boolean);

  // 2. 최초 진입 페이지 (/event/[slug]) 형태인 경우 숨김
  // 세그먼트가 ['event', '이벤트명'] 형태로 2개인 경우입니다.
  if (segments.length === 2 && segments[0] === "event") {
    return true;
  }

  // 3. 완료 페이지 (.../complete) 형태인 경우 숨김
  if (segments[segments.length - 1] === "complete") {
    return true;
  }

  // 4. QR 스캔 페이지 (.../qr-check) 형태인 경우 숨김
  if (segments[segments.length - 1] === 'qr-check') {
    return true;
  }

  return false;
};

const LayoutHeader = () => {
  const pathname = usePathname();

  // 헤더를 숨겨야 하는 페이지이면 아무것도 렌더링하지 않습니다.
  if (shouldHideHeader(pathname)) {
    return null;
  }

  return <Header showBackButton={true} />;
};

export default LayoutHeader;
