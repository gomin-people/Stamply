"use client";

export default function LandingError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <p>문제가 발생했습니다.</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
