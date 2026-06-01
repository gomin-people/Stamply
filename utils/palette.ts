/**
 * hexToHsl은 Hex 색상 코드를 HSL 값으로 변환합니다.
 * 단축 포맷(#fff)과 전체 포맷(#ffffff)을 모두 지원하며, '#' 문자의 유무도 자동으로 처리합니다.
 *
 * @param hex - 변환할 Hex 색상 문자열
 * @returns [h, s, l] 형식의 튜플 (h: 0~360도, s: 0~100%, l: 0~100%)
 */
export function hexToHsl(hex: string): [number, number, number] {
  let cleaned = hex.replace(/^#/, "");
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // 유효하지 않은 Hex 코드인 경우 기본값으로 검은색 [0, 0, 0] 반환
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) {
    return [0, 0, 0];
  }

  const r = parseInt(cleaned.substring(0, 2), 16) / 255;
  const g = parseInt(cleaned.substring(2, 4), 16) / 255;
  const b = parseInt(cleaned.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

/**
 * hslToHex는 HSL 값을 '#'으로 시작하는 Hex 색상 코드로 변환합니다.
 *
 * @param h - 색상(Hue, 0~360도)
 * @param s - 채도(Saturation, 0~100%)
 * @param l - 명도(Lightness, 0~100%)
 * @returns Hex 색상 코드 문자열 (예: #3b82f6)
 */
export function hslToHex(h: number, s: number, l: number): string {
  // Hue 값을 [0, 360) 범위로 정규화 및 순환 처리
  h = ((h % 360) + 360) % 360;

  // 노란색~민트색 구간(30도 ~ 180도)에 대한 지각적 눈부심 명도/채도 보정
  if (h >= 30 && h <= 180) {
    let lReduction = 0;
    let sReduction = 0;

    if (h >= 30 && h <= 60) {
      // 30도에서 60도까지 서서히 보정치 증가
      const factor = (h - 30) / 30; // 0 -> 1
      lReduction = factor * 10; // 최대 10% 감쇄
      sReduction = factor * 10; // 최대 10% 감쇄
    } else if (h > 60 && h <= 120) {
      // 60도에서 120도까지 부드러운 전이
      // 60도: L -10%, S -10% | 120도: L -12%, S -10% (민트색 보정 대폭 강화)
      const ratio = (h - 60) / 60; // 0 -> 1
      lReduction = 10 + ratio * 2; // 10% -> 12%
      sReduction = 10; // 10%로 채도 감쇄 유지
    } else if (h > 120 && h <= 180) {
      // 120도에서 180도까지 서서히 원래 스펙(0)으로 복귀
      // 120도: L -12%, S -10% | 180도: L -0%, S -0%
      const factor = (180 - h) / 60; // 1 -> 0
      lReduction = factor * 12; // 최대 12%
      sReduction = factor * 10; // 최대 10%
    }

    l = Math.max(0, l - lReduction);
    s = Math.max(0, s - sReduction);
  }

  // 채도와 명도를 [0, 100] 범위 내로 고정(Clamping)
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const rHex = Math.round((r + m) * 255)
    .toString(16)
    .padStart(2, "0");
  const gHex = Math.round((g + m) * 255)
    .toString(16)
    .padStart(2, "0");
  const bHex = Math.round((b + m) * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`;
}

export type PaletteStep = "100" | "200" | "300" | "400" | "500" | "600" | "700";
export type ColorPalette = Record<PaletteStep, string>;

/**
 * 입력받은 키 컬러(700 단계)를 기준으로 HSL 오프셋 비율을 적용해 7단계의 테마 색상 팔레트를 생성합니다.
 *
 * @param keyColor - 기준이 될 키 컬러 Hex 문자열 (예: #5435EB)
 * @returns 700부터 100 단계까지의 Hex 색상이 맵핑된 객체
 */
export function generatePalette(keyColor: string): ColorPalette {
  const OFFSETS = {
    "700": { dH: 0, dS: 0, dL: 0 },
    "600": { dH: -1.2, dS: -3.8, dL: 4.6 },
    "500": { dH: -1.8, dS: -7.2, dL: 9.1 },
    "400": { dH: -2.1, dS: -10.5, dL: 14.0 },
    "300": { dH: -2.6, dS: -15.2, dL: 22.8 },
    "200": { dH: -3.0, dS: -19.8, dL: 33.5 },
    "100": { dH: -3.4, dS: -23.1, dL: 46.2 },
  } as const;

  // 입력받은 색상 코드에서 Hue(색상) 값을 구함
  const [h] = hexToHsl(keyColor);

  // 디자인 시스템의 단일 톤 일관성을 보장하기 위해 채도(S) 85%, 명도(L) 50%로 내부 강제 고정
  const s = 85;
  const l = 50;

  const result = {} as ColorPalette;

  for (const [step, offset] of Object.entries(OFFSETS)) {
    result[step as PaletteStep] = hslToHex(
      h + offset.dH,
      s + offset.dS,
      l + offset.dL
    );
  }
  return result;
}
