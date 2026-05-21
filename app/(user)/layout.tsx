import { EventThemeProvider } from "@/contexts/EventThemeProvider";
import LayoutHeader from "@/components/user/LayoutHeader";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <EventThemeProvider>
      <div className="flex flex-col min-h-screen">
        <LayoutHeader />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </EventThemeProvider>
  );
}
