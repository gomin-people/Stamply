import IconStamplo from "@/components/icons/IconStamplo";

export default function AdminUnavailablePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center">
      <p className="text-gomin-neutral-700 text-lg font-bold">
        PC에서 접속해주세요
      </p>
      <p className="text-gomin-neutral-400 text-sm text-center">
        관리자 페이지는 모바일을 지원하지 않습니다
      </p>
      <IconStamplo
        className="text-gomin-neutral-300 mt-4"
        width={64}
        height={64}
      />
    </div>
  );
}
