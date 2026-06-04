type KeyTransformer = (key: string) => string;

/**
 * snake_case 문자열을 camelCase로 변환합니다.
 *
 * @param value - 변환할 문자열
 * @returns camelCase 문자열
 */
export function snakeToCamel(value: string) {
  return value.replace(/_([a-z0-9])/g, (_, character: string) =>
    character.toUpperCase()
  );
}

/**
 * camelCase 문자열을 snake_case로 변환합니다.
 *
 * @param value - 변환할 문자열
 * @returns snake_case 문자열
 */
export function camelToSnake(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

/**
 * 객체 또는 배열 내부의 모든 key를 camelCase로 변환합니다.
 *
 * @param value - 변환할 값
 * @returns key가 camelCase로 변환된 값
 */
export function toCamelKeys(value: unknown): unknown {
  return transformKeys(value, snakeToCamel);
}

/**
 * 객체 또는 배열 내부의 모든 key를 snake_case로 변환합니다.
 *
 * @param value - 변환할 값
 * @returns key가 snake_case로 변환된 값
 */
export function toSnakeKeys(value: unknown): unknown {
  return transformKeys(value, camelToSnake);
}

function transformKeys(value: unknown, transformKey: KeyTransformer): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => transformKeys(item, transformKey));
  }

  if (!isPlainObject(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      transformKey(key),
      transformKeys(item, transformKey),
    ])
  );
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
