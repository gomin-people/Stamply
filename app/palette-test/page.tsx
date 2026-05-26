'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { generatePalette, hexToHsl, hslToHex } from '@/utils';

export default function PaletteTestPage() {
  // 색상 컨트롤러의 상태 소스: HSL 상태 관리
  // 채도(S)와 명도(L)는 각각 85% 및 50% 상수로 엄격하게 고정하여 디자인 일관성 유지
  const [h, setH] = useState(250);
  const s = 85;
  const l = 50;

  // Hex 입력 필드 상태값 (HSL 상태값과 양방향 연동됨)
  const [hexInput, setHexInput] = useState('#5435EB');
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  // 현재 HSL 값을 기반으로 실시간 키 컬러 Hex 추출
  const keyColor = useMemo(() => {
    return hslToHex(h, s, l);
  }, [h, s, l]);

  // HSL 상태값 변화에 따라 Hex 입력 필드 텍스트 동기화
  useEffect(() => {
    setHexInput(keyColor);
  }, [keyColor]);

  // 유틸리티 함수를 호출하여 7단계 명암 컬러 팔레트 오브젝트 실시간 생성
  const palette = useMemo(() => {
    try {
      return generatePalette(keyColor);
    } catch (e) {
      return generatePalette('#5435EB');
    }
  }, [keyColor]);

  // 사용자가 Hex 코드를 타이핑하거나 붙여넣었을 때 HSL 슬라이더 동기화
  const handleHexInputChange = (val: string) => {
    setHexInput(val);
    const cleanHex = val.replace(/^#/, '');
    if (cleanHex.length === 3 || cleanHex.length === 6) {
      try {
        const [parsedH] = hexToHsl(val);
        setH(Math.round(parsedH));
      } catch (e) {
        // 타이핑 중에 완성되지 않은 Hex 코드로 인한 파싱 오류는 무시
      }
    }
  };

  // 컬러 칩 클릭 시 해당 Hex 색상 코드 클립보드 복사
  const handleCopy = (step: string, hexCode: string) => {
    navigator.clipboard.writeText(hexCode);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* 헤더 영역 */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-semibold uppercase tracking-wider">
            팔레트 테스트용 페이지
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            컬러 팔레트 생성 테스트
          </h1>
          <p className="text-base text-slate-500 max-w-2xl mx-auto">
            슬라이더를 좌우로 움직이며 실시간 HSL 값의 변화와 명암 팔레트 생성 결과를 직관적으로 감상해보세요.
          </p>
        </div>

        {/* 입력 및 조절 패널 영역 */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              🎨 실시간 색상 컨트롤러
            </h2>
            <div className="flex items-center gap-2 font-mono text-sm bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
              <span className="text-slate-500">HEX:</span>
              <span className="text-indigo-600 font-bold uppercase">{keyColor}</span>
              <span className="text-slate-350">|</span>
              <span className="text-slate-500">HSL:</span>
              <span className="text-indigo-600 font-bold">{h}°, {s}%, {l}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 좌측: Hue 색상 단독 슬라이더 영역 (채도와 명도는 85%/50% 고정) */}
            <div className="lg:col-span-2 flex flex-col justify-center space-y-6">
              {/* Hue 색상 조절 슬라이더 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-700">색상 조절 슬라이더 (Hue Only)</span>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl font-mono text-xs">
                    {h}° / 360°
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={h}
                  onChange={(e) => setH(Number(e.target.value))}
                  className="w-full h-4 rounded-2xl appearance-none cursor-pointer accent-indigo-600 transition-all hover:scale-[1.005]"
                  style={{
                    background:
                      'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                  }}
                />
                <p className="text-xs text-slate-500 leading-normal">
                  💡 디자인 단일 톤의 일관성을 극대화하기 위해 **채도(S)는 85%**, **명도(L)는 50%**로 고정되어 있습니다. 슬라이더를 통해 가장 어울리는 브랜드 색상 톤(Hue)을 탐색해 보세요.
                </p>
              </div>
            </div>

            {/* 우측: Hex 텍스트 입력창 및 마우스 컬러 피커 영역 */}
            <div className="flex items-center bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
              {/* Hex 색상 텍스트 입력부 */}
              <div className="space-y-2 w-full">
                <label className="text-xs font-semibold text-slate-500 block">
                  Hex 코드 직접 입력 또는 피커
                </label>
                <div className="flex gap-2">
                  <div className="relative w-12 h-10 rounded-xl overflow-hidden border border-slate-300 shrink-0 shadow-sm bg-white">
                    <input
                      type="color"
                      value={keyColor}
                      onChange={(e) => handleHexInputChange(e.target.value)}
                      className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer bg-transparent scale-150"
                    />
                  </div>
                  <input
                    type="text"
                    value={hexInput}
                    onChange={(e) => handleHexInputChange(e.target.value)}
                    placeholder="#5435EB"
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 실시간 생성 완료된 7단계 색상 그리드 영역 */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            📊 실시간 생성된 7단계 색상 목록
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {(Object.keys(palette) as Array<keyof typeof palette>).sort((a, b) => Number(b) - Number(a)).map((step) => {
              const hexVal = palette[step];
              const isKey = step === '700';

              return (
                <div
                  key={step}
                  onClick={() => handleCopy(step, hexVal)}
                  className="group relative flex flex-col bg-slate-50 border border-slate-200/60 rounded-2xl p-3 text-center cursor-pointer hover:border-slate-400 hover:shadow-md transition-all active:scale-95"
                >
                  <div
                    className="w-full aspect-square rounded-xl shadow-inner border border-black/5 transition-transform group-hover:scale-[1.02]"
                    style={{ backgroundColor: hexVal }}
                  />
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs font-bold text-slate-800">{step}</span>
                      {isKey && (
                        <span className="text-[9px] px-1 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold shrink-0">
                          KEY
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wide">
                      {hexVal}
                    </div>
                  </div>

                  {/* 클릭하여 복사되었을 때의 피드백 뱃지 오버레이 */}
                  {copiedStep === step ? (
                    <div className="absolute inset-0 bg-white/95 rounded-2xl flex items-center justify-center text-xs font-bold text-emerald-600 border border-emerald-200 animate-pulse shadow-inner">
                      복사됨!
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 bg-white/70 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-slate-400 text-[10px] pointer-events-none shadow-sm">
                      📋
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* layout.tsx에 들어갈 실제 변수 주입 방식과 동일하게 :root 가상 클래스에 변수 매핑 */}
        <style>{`
          :root {
            --primary-700: ${palette['700']};
            --primary-600: ${palette['600']};
            --primary-500: ${palette['500']};
            --primary-400: ${palette['400']};
            --primary-300: ${palette['300']};
            --primary-200: ${palette['200']};
            --primary-100: ${palette['100']};
            --primary-color: ${palette['700']};
          }

          /* 인라인 style을 없애고 오직 CSS 변수를 참조해 그리는 다이나믹 컴포넌트 클래스들 */
          .themed-btn-primary {
            background-color: var(--primary-700);
            box-shadow: 0 4px 14px 0 var(--primary-200);
            transition: all 0.2s ease-in-out;
          }
          .themed-btn-primary:hover {
            background-color: var(--primary-600);
          }
          .themed-btn-primary:active {
            transform: scale(0.99);
          }

          .themed-btn-outline {
            border: 1px solid var(--primary-400);
            color: var(--primary-700);
            background-color: transparent;
            transition: all 0.2s ease-in-out;
          }
          .themed-btn-outline:hover {
            background-color: var(--primary-100);
            border-color: var(--primary-200);
          }

          .themed-badge-light {
            background-color: var(--primary-100);
            color: var(--primary-700);
            border: 1px solid var(--primary-200);
          }

          .themed-badge-filled {
            background-color: var(--primary-600);
            color: #ffffff;
          }

          .themed-list-item-active {
            background-color: var(--primary-100);
            border: 1px solid var(--primary-200);
          }
          .themed-list-item-active-bullet {
            background-color: var(--primary-700);
          }
          .themed-list-item-active-text {
            color: var(--primary-700);
          }
          .themed-list-item-active-points {
            color: var(--primary-600);
          }
        `}</style>

        {/* 실제 UI 컴포넌트 dynamic theme 연동 미리보기 영역 */}
        <div
          className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm space-y-6"
        >
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            🖥️ CSS 변수 테마 연동 미리보기 (Dynamic Preview)
          </h2>

          <p className="text-xs text-slate-500">
            아래 컴포넌트들은 인라인 style이나 React 마우스 핸들러 없이, 오직 상단 <code>&lt;style&gt;</code> 태그에 주입된 클래스명으로 일괄 제어됩니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* 다이나믹 테마 버튼 미리보기 영역 */}
            <div className="bg-slate-50 border border-slate-200/40 rounded-2xl p-5 space-y-4">
              <span className="text-xs font-bold text-slate-400 block tracking-wider uppercase">
                Buttons (Hover & Normal)
              </span>

              <div className="space-y-3">
                {/* 메인 프라이머리 테마 버튼 */}
                <button
                  className="themed-btn-primary w-full py-3.5 rounded-xl font-bold text-white shadow-md"
                >
                  시작하기 (themed-btn-primary)
                </button>

                {/* 서브 아웃라인 테마 버튼 */}
                <button
                  className="themed-btn-outline w-full py-3.5 rounded-xl font-bold border"
                >
                  이전으로 돌아가기 (themed-btn-outline)
                </button>
              </div>
            </div>

            {/* 다이나믹 테마 배지 및 리스트 아이템 미리보기 영역 */}
            <div className="bg-slate-50 border border-slate-200/40 rounded-2xl p-5 space-y-4">
              <span className="text-xs font-bold text-slate-400 block tracking-wider uppercase">
                Badges & List Items
              </span>

              <div className="space-y-3">
                {/* 배지 라인업 */}
                <div className="flex gap-2">
                  <span
                    className="themed-badge-light px-3 py-1.5 rounded-full text-xs font-extrabold border"
                  >
                    진행 중인 이벤트
                  </span>

                  <span
                    className="themed-badge-filled px-3 py-1.5 rounded-full text-xs font-extrabold"
                  >
                    NEW
                  </span>
                </div>

                {/* 리스트 아이템 활성화 상태 예시 */}
                <div
                  className="themed-list-item-active p-3.5 rounded-xl border flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="themed-list-item-active-bullet w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
                    />
                    <span
                      className="themed-list-item-active-text text-sm font-semibold"
                    >
                      미션 완료: 스탬프 찍기
                    </span>
                  </div>
                  <span
                    className="themed-list-item-active-points text-xs font-bold"
                  >
                    + 100P
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
