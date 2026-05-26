import LayoutFooter from '@/components/admin/LayoutFooter';
import LayoutHeader from '@/components/admin/LayoutHeader';
import LayoutSidebar from '@/components/admin/LayoutSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gomin-neutral-100">
      <LayoutSidebar />
      <div className="flex min-w-0 flex-1 flex-col bg-gomin-neutral-100">
        <LayoutHeader />
        <main className="flex-1">{children}</main>
        <LayoutFooter />
      </div>
    </div>
  );
}
