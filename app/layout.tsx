import type { Metadata } from "next";
import { Noto_Sans_KR, Monomaniac_One } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { cn } from "@/utils";

const notoSans = Noto_Sans_KR({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

const monomaniacOne = Monomaniac_One({
  variable: "--font-monomaniac-one",
  subsets: ["latin"],
  weight: "400",
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
      className={cn("h-full", "antialiased", notoSans.variable, "font-sans", monomaniacOne.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
