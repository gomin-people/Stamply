'use client';

import { useEffect, useMemo } from 'react';
import { useEventTheme } from '@/contexts/EventThemeProvider';
import { generatePalette } from '@/utils';

interface ThemeInitializerProps {
  primaryColor: string;
}

export function ThemeInitializer({ primaryColor }: ThemeInitializerProps) {
  const { primaryColor: contextColor, setPrimaryColor } = useEventTheme();

  // 클라이언트 마운트 및 primaryColor 변경 시 전역 컨텍스트 상태 동기화
  useEffect(() => {
    if (primaryColor) {
      setPrimaryColor(primaryColor);
    }
  }, [primaryColor, setPrimaryColor]);

  // 현재 활성화된 테마 컬러 결정 (1순위: 컨텍스트 컬러, 2순위: props 컬러)
  const activeColor = contextColor || primaryColor || '#5435EB';

  // SSR 및 실시간 변경 시점에 즉시 주입할 7단계 명암 팔레트 생성
  const palette = useMemo(() => {
    try {
      return generatePalette(activeColor);
    } catch {
      return generatePalette('#5435EB');
    }
  }, [activeColor]);

  // SSR 및 최초 브라우저 렌더링 단계에서 FOUC(색상 깜빡임) 방지를 위해 style 태그 즉시 출력
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          :root {
            --primary-100: ${palette['100']};
            --primary-200: ${palette['200']};
            --primary-300: ${palette['300']};
            --primary-400: ${palette['400']};
            --primary-500: ${palette['500']};
            --primary-600: ${palette['600']};
            --primary-700: ${palette['700']};
            --primary-color: ${palette['700']};
          }
        `,
      }}
    />
  );
}
