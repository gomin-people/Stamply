import IconStamply from "@/components/icons/IconStamply";

export default function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center pb-32">
      <IconStamply
        className="text-gomin-neutral-300 animate-spin"
        width={40}
        height={40}
        style={{ animationDuration: "1.5s", overflow: "visible" }}
      />
    </div>
  );
}
