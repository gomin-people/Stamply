import LayoutHeader from "@/components/user/header/LayoutHeader";
import MainWrapper from "@/components/user/layout/MainWrapper";
import { Toaster } from "@/components/ui/sonner";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-svh overflow-hidden">
      <LayoutHeader />
      <MainWrapper>{children}</MainWrapper>
      <Toaster />
    </div>
  );
}
