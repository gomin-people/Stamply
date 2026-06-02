"use client";

import { useMemo } from "react";
import MissionPageClient from "@/components/user/mission/MissionPageClient";

type Props = {
  stampImage: string | null;
  palette: Record<string, string>;
};

const PREVIEW_MISSIONS = [
  {
    id: 1,
    title: "미션 1",
    description: "행사장 부스 방문하고\n첫 번째 스탬프 받기",
    isCompleted: true,
  },
  {
    id: 2,
    title: "미션 2",
    description: "포토존에서 사진 촬영 후\n두 번째 스탬프 획득하기",
    isCompleted: true,
  },
  {
    id: 3,
    title: "미션 3",
    description: "행사 만족도 설문조사에\n참여하여 완성하기",
    isCompleted: false,
  },
];

/**
 * 실시간 모바일 유저 화면 미리보기 패널 컴포넌트
 */
export default function ThemePreviewPanel({ stampImage, palette }: Props) {
  // preview용 props 객체들의 참조 고정 (React.memo 최적화 매칭)
  const previewEvent = useMemo(
    () => ({
      id: 0,
      title: "Stamply",
      stampImageUrl: stampImage,
    }),
    [stampImage]
  );

  const previewMissions = useMemo(() => PREVIEW_MISSIONS, []);

  // 실시간 미리보기에 주입할 CSS 변수 정의
  const previewThemeVars = {
    "--primary-700": palette["700"],
    "--primary-600": palette["600"],
    "--primary-500": palette["500"],
    "--primary-400": palette["400"],
    "--primary-300": palette["300"],
    "--primary-200": palette["200"],
    "--primary-100": palette["100"],
    "--primary-color": palette["700"],
  } as React.CSSProperties;

  return (
    <div className="w-full lg:w-[400px] bg-[#EBE7FD]/50 p-6 rounded-[32px] flex flex-col items-center justify-center shrink-0 shadow-inner border border-[#E1DBFA]">
      {/* 유저 화면 미리보기 뱃지 */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[11px] font-extrabold text-[#5435EB] shadow-sm mb-5 select-none border border-[#ECE7FC]">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        유저 화면 미리보기
      </div>

      {/* 모바일 폰 프레임 */}
      <div
        className="w-[280px] h-[550px] bg-white rounded-[36px] shadow-2xl border-[6px] border-white overflow-hidden relative flex items-center justify-center pointer-events-none select-none"
        style={previewThemeVars}
      >
        {/* 표준 모바일 규격 해상도로 1:1 렌더링 후 scale 하드웨어 가속 축소 */}
        <div
          className="w-[390px] h-[760px] bg-white flex flex-col shrink-0"
          style={{
            transform: "scale(0.718)",
            transformOrigin: "center",
          }}
        >
          <MissionPageClient
            event={previewEvent}
            eventId="preview"
            initialMissions={previewMissions}
            isPreview={true}
          />
        </div>
      </div>

      {/* 실시간 적용 안내 문구 */}
      <p className="mt-4 text-[11px] font-bold text-gomin-neutral-500 text-center leading-relaxed">
        선택한 테마 색상이 유저 화면에
        <br />
        실시간으로 적용됩니다
      </p>
    </div>
  );
}
