"use client";

import {
  forwardRef,
  useImperativeHandle,
  useState,
  useMemo,
  useRef,
} from "react";
import { Plus, X, Info } from "lucide-react";
import { type StepFormHandle } from "@/types";
import { generatePalette, hexToHsl, hslToHex } from "@/utils";
import MissionPageClient from "@/components/user/mission/MissionPageClient";

const EventStep3Form = forwardRef<StepFormHandle>(
  function EventStep3Form(_, ref) {
    // 1. 스탬프 모양 관련 상태
    const [stampImage, setStampImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 2. 테마 색상 단일 상태 관리 (Single Source of Truth: 오직 h 정수 상태만 보관!)
    const [h, setH] = useState(250);

    // 텍스트 필드 포커스 여부 및 입력 중인 문자열 상태 (슬라이더 드래그 시 렌더링 병목 및 피드백 루프 원천 차단)
    const [isFocused, setIsFocused] = useState(false);
    const [typingValue, setTypingValue] = useState("");

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
        if (!stampImage) {
          alert("스탬프 모양 이미지를 업로드해주세요.");
          return false;
        }
        return true;
      },
      getData: () => ({
        stampImageUrl: stampImage,
        themeColor: keyColor,
      }),
    }));

    // Hex 입력 필드 변경 핸들러 (입력 완료 시 HSL 파싱 후 슬라이더 상태 h를 업데이트하여 일방통행 전파)
    const handleHexInputChange = (val: string) => {
      // 16진수 문자(0-9, a-f, A-F)만 필터링하여 남김 (공백, #, 한글 등 외부 문자 자동 소거)
      let cleanHex = val.replace(/[^0-9a-fA-F]/g, "");

      // 최대 6자리로 입력 제한
      cleanHex = cleanHex.substring(0, 6);

      // 항상 맨 앞에 '#'을 결합하고 대문자로 통일하여 자동 포맷팅
      const formattedInput =
        cleanHex.length > 0 ? `#${cleanHex.toUpperCase()}` : "#";
      setTypingValue(formattedInput);

      // 유효한 Hex 규격(3자리 또는 6자리 16진수)일 때만 슬라이더 상태(h)를 업데이트하여 튐 현상 방지
      const isValidHexFormat = cleanHex.length === 3 || cleanHex.length === 6;

      if (isValidHexFormat) {
        try {
          const formatted = `#${cleanHex}`;
          // 입력된 컬러코드에 해당하는 HSL Hue 값으로 슬라이더 바 상태 동적 업데이트
          const [parsedH] = hexToHsl(formatted);
          setH(Math.round(parsedH));
        } catch {
          // 타이핑 중의 에러는 무시
        }
      }
    };

    // 스탬프 업로드 핸들러
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // 파일 확장자 검증 (허용: png, jpg, jpeg, webp)
      const allowedExtensions = ["png", "jpg", "jpeg", "webp"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        alert(
          "지원하지 않는 파일 형식입니다. (png, jpg, jpeg, webp 이미지만 업로드 가능)"
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setStampImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    };

    const handleUploadBoxClick = () => {
      fileInputRef.current?.click();
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setStampImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    // preview용 props 객체들의 참조 고정 (React.memo 최적화 매칭)
    const previewEvent = useMemo(
      () => ({
        id: 0,
        title: "Stamply",
        stampImageUrl: stampImage,
      }),
      [stampImage]
    );

    const previewMissions = useMemo(
      () => [
        {
          id: 1,
          title: "미션 1",
          description: "점심먹기 뭐먹지\n배고프다",
          isCompleted: true,
        },
        {
          id: 2,
          title: "미션 1",
          description: "점심먹기 뭐먹지\n배고프다",
          isCompleted: true,
        },
        {
          id: 3,
          title: "미션 1",
          description: "점심먹기 뭐먹지\n배고프다",
          isCompleted: false,
        },
      ],
      []
    );

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
          .pointer-events-none * {
            transition: none !important;
            transition-duration: 0s !important;
          }
        `}</style>

        {/* 좌측 컨트롤 영역 */}
        <div className="flex-1 space-y-8">
          {/* 스탬프 모양 업로드 */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-gomin-neutral-700">
              스탬프 모양
            </h3>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {stampImage ? (
              <div className="relative w-[150px] h-[150px] rounded-2xl border border-gomin-neutral-200 bg-gomin-neutral-50 flex items-center justify-center p-4 group transition-all hover:shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={stampImage}
                  alt="스탬프 모양 미리보기"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white shadow-md border border-gomin-neutral-100 flex items-center justify-center text-gomin-neutral-500 hover:text-gomin-black hover:scale-105 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={handleUploadBoxClick}
                className="w-[150px] h-[150px] rounded-2xl border-2 border-dashed border-gomin-neutral-200 bg-gomin-neutral-50/50 hover:bg-gomin-neutral-50 hover:border-gomin-neutral-300 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all p-3 text-center select-none"
              >
                <div className="w-8 h-8 rounded-full bg-white border border-gomin-neutral-100 shadow-sm flex items-center justify-center text-gomin-neutral-400">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[13px] font-extrabold text-gomin-neutral-600">
                    스탬프 이미지 업로드
                  </p>
                  <p className="text-[10px] font-bold text-gomin-neutral-400 leading-normal">
                    1:1 비율 권장
                    <br />
                    투명 배경 PNG
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 테마 색상 */}
          <div className="space-y-5">
            <h3 className="text-base font-bold text-gomin-neutral-700">
              테마 색상
            </h3>

            {/* Hue 슬라이더 트랙 */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="360"
                value={h}
                onChange={(e) => {
                  const newH = Number(e.target.value);
                  setH(newH);
                }}
                className="theme-hue-slider w-full h-[18px] rounded-full appearance-none cursor-pointer outline-none shadow-inner border border-black/5"
                style={{
                  background:
                    "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                }}
              />
            </div>

            {/* 색상 칩 및 Hex 입력창 */}
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2">
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
              </div>
            </div>

            {/* 느낌표 안내 문구 */}
            <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-gomin-primary-100/50 border border-gomin-primary-100 text-gomin-primary-700/90">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-xs font-bold leading-normal">
                선택한 테마 색상은 진입 페이지, 설문조사 등 행사의 모든 페이지에
                일괄 적용됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* 우측 실시간 미리보기 영역 */}
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
      </div>
    );
  }
);

export default EventStep3Form;
