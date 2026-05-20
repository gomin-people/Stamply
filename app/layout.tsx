import type { Metadata } from "next";
import { Nanum_Gothic, Geist } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { cn } from "@/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const nanumGothic = Nanum_Gothic({
  variable: "--font-nanum-gothic",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

export const metadata: Metadata = {
  title: "Stamply",
  description: "팝업스토어 디지털 스탬프 랠리 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={cn("h-full", "antialiased", nanumGothic.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
