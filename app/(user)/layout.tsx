import LayoutHeader from "@/components/user/header/LayoutHeader";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-svh overflow-hidden">
      <LayoutHeader />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
