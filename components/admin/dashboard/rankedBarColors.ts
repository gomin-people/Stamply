type RankedBarColorOptions = {
  darkColor: string;
  includeInScale?: (value: number) => boolean;
  lightColor: string;
};

export const getRankedBarColors = <T>(
  items: T[],
  getValue: (item: T) => number,
  { darkColor, includeInScale, lightColor }: RankedBarColorOptions
) => {
  const rankedItems = items
    .map((item, index) => {
      const value = getValue(item);
      const normalizedValue = Number.isFinite(value) ? value : 0;

      return {
        index,
        value: normalizedValue,
      };
    })
    .filter(({ value }) => includeInScale?.(value) ?? true)
    .sort((a, b) => b.value - a.value || a.index - b.index);

  const maxRank = Math.max(rankedItems.length - 1, 1);
  const colorByIndex = new Map<number, string>();

  rankedItems.forEach(({ index }, rank) => {
    colorByIndex.set(
      index,
      interpolateHexColor(darkColor, lightColor, rank / maxRank)
    );
  });

  return items.map((_, index) => colorByIndex.get(index) ?? lightColor);
};

const interpolateHexColor = (
  startColor: string,
  endColor: string,
  ratio: number
) => {
  const start = parseHexColor(startColor);
  const end = parseHexColor(endColor);
  const boundedRatio = Math.min(Math.max(ratio, 0), 1);

  const red = interpolateColorChannel(start.red, end.red, boundedRatio);
  const green = interpolateColorChannel(start.green, end.green, boundedRatio);
  const blue = interpolateColorChannel(start.blue, end.blue, boundedRatio);

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
};

const parseHexColor = (color: string) => {
  const hex = color.replace("#", "");

  return {
    red: parseInt(hex.slice(0, 2), 16),
    green: parseInt(hex.slice(2, 4), 16),
    blue: parseInt(hex.slice(4, 6), 16),
  };
};

const interpolateColorChannel = (
  startValue: number,
  endValue: number,
  ratio: number
) => Math.round(startValue + (endValue - startValue) * ratio);

const toHex = (value: number) => value.toString(16).padStart(2, "0");
