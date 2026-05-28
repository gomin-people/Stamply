import LayoutHeader from '@/components/user/header/LayoutHeader';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <LayoutHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
