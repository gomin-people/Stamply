import IconStamplo from "@/components/icons/IconStamplo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <p className="text-gomin-neutral-700 text-lg font-bold">404 ERROR</p>
      <p className="text-gomin-neutral-400 text-sm">
        페이지를 찾을 수 없습니다
      </p>
      <IconStamplo
        className="text-gomin-neutral-300 mt-4"
        width={64}
        height={64}
      />
    </div>
  );
}
