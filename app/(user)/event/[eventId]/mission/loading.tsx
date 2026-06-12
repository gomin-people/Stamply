const MissionLoading = () => {
  return (
    <div className="flex flex-col relative bg-gomin-white h-full pb-21.5">
      <main className="flex-1 max-w-md w-full mx-auto px-6 pt-4 pb-1.5 overflow-x-hidden">
        {/* 타이틀 & 브로슈어 버튼 */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="h-11 w-52 rounded-xl bg-gomin-neutral-100 animate-pulse" />
          <div className="w-13 h-13 shrink-0 rounded-full bg-gomin-neutral-100 animate-pulse" />
        </div>

        {/* 진행 상황 문구 */}
        <div className="mb-4 min-h-14 flex flex-col justify-center gap-2.5">
          <div className="h-8 w-60 rounded-xl bg-gomin-neutral-100 animate-pulse" />
          <div className="h-8 w-44 rounded-xl bg-gomin-neutral-100 animate-pulse" />
        </div>

        {/* 뷰 토글 */}
        <div className="flex justify-end mb-5">
          <div className="h-9 w-20 rounded-lg bg-gomin-neutral-100 animate-pulse" />
        </div>

        {/* 미션 카드 그리드 */}
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl bg-gomin-neutral-100 animate-pulse"
            />
          ))}
        </div>
      </main>

      {/* 버튼 */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
        <div className="h-14 w-full rounded-[20px] bg-gomin-neutral-100 animate-pulse" />
      </div>
    </div>
  );
};

export default MissionLoading;
