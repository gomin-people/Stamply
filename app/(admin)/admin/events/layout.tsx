import Footer from "@/components/admin/common/Footer";
import Header from "@/components/admin/common/Header";
import Sidebar from "@/components/admin/common/Sidebar";

export default function AdminEventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gomin-neutral-100">
      <Sidebar />
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
