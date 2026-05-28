"use client";

import { useEffect, useMemo } from "react";
import { generatePalette } from "@/utils";

interface ThemeInitializerProps {
  primaryColor: string;
}

export function ThemeInitializer({ primaryColor }: ThemeInitializerProps) {
  const activeColor = primaryColor || "#5435EB";

  // props로 받은 색상으로 즉시 7단계 테마 팔레트 생성 (클라이언트/서버 공통)
  const palette = useMemo(() => {
    try {
      return generatePalette(activeColor);
    } catch {
      return generatePalette("#5435EB");
    }
  }, [activeColor]);

  // 클라이언트 사이드 마운트 직후 전역 :root DOM 객체에 테마 변수 2차 직접 주입 (하이드레이션 격차 완벽 해소)
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary-100", palette["100"]);
    root.style.setProperty("--primary-200", palette["200"]);
    root.style.setProperty("--primary-300", palette["300"]);
    root.style.setProperty("--primary-400", palette["400"]);
    root.style.setProperty("--primary-500", palette["500"]);
    root.style.setProperty("--primary-600", palette["600"]);
    root.style.setProperty("--primary-700", palette["700"]);
    root.style.setProperty("--primary-color", palette["700"]);
  }, [palette]);

  // SSR 및 최초 브라우저 렌더링 단계에서 FOUC(색상 깜빡임) 방지를 위해 style 태그 즉시 출력
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          :root {
            --primary-100: ${palette["100"]};
            --primary-200: ${palette["200"]};
            --primary-300: ${palette["300"]};
            --primary-400: ${palette["400"]};
            --primary-500: ${palette["500"]};
            --primary-600: ${palette["600"]};
            --primary-700: ${palette["700"]};
            --primary-color: ${palette["700"]};
          }
        `,
      }}
    />
  );
}
