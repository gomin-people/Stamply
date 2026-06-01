import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export * from "./palette";

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat("ko-KR").format(value);

export const formatPhoneNumber = (raw: string): string => {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("02")) {
    const d = digits.slice(0, 10);
    if (d.length <= 2) return d;
    if (d.length <= 6) return `${d.slice(0, 2)}-${d.slice(2)}`;
    // 9자리(국번3+가입자4): 2-3-4, 10자리(국번4+가입자4): 2-4-4
    const mid = d.length === 9 ? 5 : 6;
    return `${d.slice(0, 2)}-${d.slice(2, mid)}-${d.slice(mid)}`;
  }
  const d = digits.slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  // 10자리(지역번호3+국번3+가입자4): 3-3-4, 11자리(지역번호3+국번4+가입자4): 3-4-4
  const mid = d.length === 10 ? 6 : 7;
  return `${d.slice(0, 3)}-${d.slice(3, mid)}-${d.slice(mid)}`;
};

export const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isValidUrl = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const isValidPhone = (value: string): boolean => {
  return /^(02|0\d{1,2})-\d{3,4}-\d{4}$/.test(value);
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  try {
    const parts = dateStr.split("-");
    let date: Date;
    if (parts.length === 3) {
      const [year, month, day] = parts.map(Number);
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(dateStr);
    }
    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const weekDay = weekDays[date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekDay})`;
  } catch {
    return dateStr;
  }
};
