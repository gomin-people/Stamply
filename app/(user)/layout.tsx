import { EventThemeProvider } from "@/contexts/EventThemeProvider";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <EventThemeProvider>{children}</EventThemeProvider>;
}
