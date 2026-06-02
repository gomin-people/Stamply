"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { hexToHsl, formatHexColor } from "@/utils";

type Props = {
  h: number;
  onHueChange: (hue: number) => void;
  keyColor: string;
};

/**
 * 테마 컬러 피커 (슬라이더 + Hex 직접 입력 + 안내 문구) 컴포넌트
 */
export default function ThemeColorPicker({ h, onHueChange, keyColor }: Props) {
  // 텍스트 필드 포커스 여부 및 입력 중인 문자열 상태 (슬라이더 드래그 시 렌더링 병목 및 피드백 루프 원천 차단)
  const [isFocused, setIsFocused] = useState(false);
  const [typingValue, setTypingValue] = useState("");

  // Hex 입력 필드 변경 핸들러 (입력 완료 시 HSL 파싱 후 슬라이더 상태 h를 업데이트하여 일방통행 전파)
  const handleHexInputChange = (val: string) => {
    // 외부 유틸리티를 활용해 16진수 필터링, 대문자 변환, # 자동 접두사 포맷팅 처리
    const { cleanHex, formattedInput } = formatHexColor(val);
    setTypingValue(formattedInput);

    // 유효한 Hex 규격(3자리 또는 6자리 16진수)일 때만 슬라이더 상태(h)를 업데이트하여 튐 현상 방지
    const isValidHexFormat = cleanHex.length === 3 || cleanHex.length === 6;

    if (isValidHexFormat) {
      try {
        const formatted = `#${cleanHex}`;
        // 입력된 컬러코드에 해당하는 HSL Hue 값으로 슬라이더 바 상태 동적 업데이트
        const [parsedH] = hexToHsl(formatted);
        onHueChange(Math.round(parsedH));
      } catch {
        // 타이핑 중의 에러는 무시
      }
    }
  };

  return (
    <div className="space-y-5 text-gomin-black">
      <h3 className="text-base font-bold text-gomin-neutral-700">테마 색상</h3>

      {/* Hue 슬라이더 트랙 */}
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max="360"
          value={h}
          onChange={(e) => {
            const newH = Number(e.target.value);
            onHueChange(newH);
          }}
          className="theme-hue-slider w-full h-[18px] rounded-full appearance-none cursor-pointer outline-none shadow-inner border border-black/5"
          style={{
            background:
              "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
          }}
        />
      </div>

      {/* 색상 칩 및 Hex 입력창 */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* 피커가 비활성화된 순수 색상 표시 칩 */}
          <div
            className="w-12 h-12 rounded-xl border border-gomin-neutral-200 shadow-sm shrink-0"
            style={{ backgroundColor: keyColor }}
          />
          <input
            type="text"
            value={isFocused ? typingValue : keyColor}
            onFocus={() => {
              setIsFocused(true);
              setTypingValue(keyColor);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
            onChange={(e) => handleHexInputChange(e.target.value)}
            placeholder="#5435EB"
            className="h-12 w-32 bg-white border border-gomin-neutral-200 rounded-xl px-3 font-mono text-sm font-bold text-gomin-neutral-700 uppercase focus:outline-none focus:border-gomin-neutral-400 focus:ring-1 focus:ring-gomin-neutral-400 shadow-sm transition-all"
          />
          <span className="text-xs font-bold text-gomin-neutral-400 leading-normal max-w-lg">
            ※ 입력하신 색상의 색조(Hue)만 추출하여 반영하며, 모바일 화면
            가독성을 보장하기 위해 채도와 명도는 고정된 최적의 값으로 자동
            조정됩니다.
          </span>
        </div>
      </div>

      {/* 느낌표 안내 문구 */}
      <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-gomin-primary-100/50 border border-gomin-primary-100 text-gomin-primary-700/90">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="text-xs font-bold leading-normal">
          선택한 테마 색상은 진입 페이지, 설문조사 등 행사의 모든 페이지에 일괄
          적용됩니다.
        </p>
      </div>
    </div>
  );
}
