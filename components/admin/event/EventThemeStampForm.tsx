"use client";

import { forwardRef, useImperativeHandle, useState, useMemo } from "react";
import { type StepFormHandle } from "@/types";
import { generatePalette, hslToHex, hexToHsl } from "@/utils";
import StampUploadSection from "./themeStamp/StampUploadSection";
import ThemeColorPicker from "./themeStamp/ThemeColorPicker";
import ThemePreviewPanel from "./themeStamp/ThemePreviewPanel";
import { toast } from "sonner";

type InitialData = {
  stampImageUrl?: string | null;
  primaryColor?: string;
};

type Props = {
  initialData?: InitialData;
  disabled?: boolean;
};

const EventThemeStampForm = forwardRef<StepFormHandle, Props>(
  function EventThemeStampForm({ initialData, disabled = false }, ref) {
    const [stampFileUrl, setStampFileUrl] = useState<string>(
      initialData?.stampImageUrl ?? ""
    );
    const [isUploading, setIsUploading] = useState(false);

    const [h, setH] = useState(() => {
      if (initialData?.primaryColor) {
        return hexToHsl(initialData.primaryColor)[0];
      }
      return 250;
    });

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

    const handleStampRemove = () => setStampFileUrl("");

    // 부모 컴포넌트에 넘길 validate 및 getData 정의
    useImperativeHandle(
      ref,
      () => ({
        validate: () => {
          if (isUploading) {
            toast.warning(
              "스탬프 모양 이미지가 스토리지에 업로드 중입니다. 잠시만 기다려주세요.",
              { id: "uploading" }
            );
            return false;
          }
          return true;
        },
        getData: () => ({
          stampImageUrl: stampFileUrl,
          primaryColor: keyColor,
        }),
      }),
      [stampFileUrl, isUploading, keyColor]
    );

    return (
      <div className="flex flex-row gap-10 text-gomin-black h-166">
        {/* 좌측 컨트롤 영역 */}
        <div className="flex-1 space-y-8">
          <StampUploadSection
            value={stampFileUrl}
            onUploadingChange={setIsUploading}
            onChange={setStampFileUrl}
            onRemove={handleStampRemove}
            disabled={disabled}
          />
          <hr className="border-gomin-neutral-100" />
          <ThemeColorPicker
            h={h}
            onHueChange={setH}
            keyColor={keyColor}
            disabled={disabled}
          />
        </div>

        {/* 우측 실시간 미리보기 영역 */}
        <ThemePreviewPanel
          stampImage={stampFileUrl} // 실시간 모바일 미리보기에는 로컬 Object URL(지연 0초)을 즉시 렌더링
          palette={palette}
        />
      </div>
    );
  }
);

export default EventThemeStampForm;
