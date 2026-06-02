"use client";

import { forwardRef, useImperativeHandle, useState, useMemo } from "react";
import { type StepFormHandle } from "@/types";
import { generatePalette, hslToHex } from "@/utils";
import StampUploadSection from "./themestamp/StampUploadSection";
import ThemeColorPicker from "./themestamp/ThemeColorPicker";
import ThemePreviewPanel from "./themestamp/ThemePreviewPanel";

/**
 * 테마 & 스탬프 설정 Form 컴포넌트 (Step 3)
 */
const EventThemeStampForm = forwardRef<StepFormHandle>(
  function EventThemeStampForm(_, ref) {
    // 1. 스탬프 모양 관련 상태 (브로슈어 업로드 페이지 방식을 벤치마킹한 미리보기용 + 실제 업로드용 이중 상태)
    const [stampPreviewUrl, setStampPreviewUrl] = useState<string | null>(null);
    const [stampFileUrl, setStampFileUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // 2. 테마 색상 단일 상태 관리 (Single Source of Truth: 오직 h 정수 상태만 보관!)
    const [h, setH] = useState(250);

    // h 상태로부터 실시간 키 컬러 및 팔레트 100% 동적 유도 (S=85, L=50 규격 강제)
    const keyColor = useMemo(() => {
      return hslToHex(h, 85, 50);
    }, [h]);

    // 7단계 컬러 팔레트 생성
    const palette = useMemo(() => {
      try {
        return generatePalette(keyColor);
      } catch {
        return generatePalette("#5435EB");
      }
    }, [keyColor]);

    // 부모 컴포넌트에 넘길 validate 및 getData 정의
    useImperativeHandle(ref, () => ({
      validate: () => {
        if (isUploading) {
          alert(
            "스탬프 모양 이미지가 스토리지에 업로드 중입니다. 잠시만 기다려주세요."
          );
          return false;
        }
        return true;
      },
      getData: () => ({
        stampImageUrl: stampFileUrl, // Storage 서버에 적재 완료된 실제 public HTTP URL을 최종 폼 데이터로 제출
        themeColor: keyColor,
      }),
    }));

    return (
      <div className="flex flex-col lg:flex-row gap-10 p-2 text-gomin-black">
        {/* 스타일 인젝션: 무지개 range 슬라이더 핸들의 배경을 실시간 선택한 키 컬러로 동적 반영 */}
        <style>{`
          input[type="range"].theme-hue-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: ${keyColor};
            border: 3px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
            cursor: pointer;
            transition: transform 0.1s ease-in-out;
          }
          input[type="range"].theme-hue-slider::-webkit-slider-thumb:hover {
            transform: scale(1.15);
          }
          input[type="range"].theme-hue-slider::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: ${keyColor};
            border: 3px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
            cursor: pointer;
            transition: transform 0.1s ease-in-out;
          }
          input[type="range"].theme-hue-slider::-moz-range-thumb:hover {
            transform: scale(1.15);
          }
          
          /* 프리뷰 모바일 프레임 내부의 모든 요소들의 transition을 0s로 강제하여 드래그 시 엇박자 반응 딜레이 완벽 제거 */
          .preview-mobile-frame * {
            transition: none !important;
            transition-duration: 0s !important;
          }
        `}</style>

        {/* 좌측 컨트롤 영역 */}
        <div className="flex-1 space-y-8">
          <StampUploadSection
            stampPreviewUrl={stampPreviewUrl}
            onPreviewChange={setStampPreviewUrl}
            onFileUrlChange={setStampFileUrl}
            onUploadingChange={setIsUploading}
          />
          <ThemeColorPicker h={h} onHueChange={setH} keyColor={keyColor} />
        </div>

        {/* 우측 실시간 미리보기 영역 */}
        <ThemePreviewPanel
          stampImage={stampPreviewUrl} // 실시간 모바일 미리보기에는 로컬 Object URL(지연 0초)을 즉시 렌더링
          palette={palette}
        />
      </div>
    );
  }
);

export default EventThemeStampForm;
