import Footer from '@/components/admin/Footer';
import Header from '@/components/admin/Header';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gomin-neutral-100">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col bg-gomin-neutral-100">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
