import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import ZaloButton from "@/components/ZaloButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Japan Bag Shop — Túi xách chính hãng từ Nhật Bản",
  description: "Order túi xách Coach, Gucci, Furla, Michael Kors hàng nội địa Nhật Bản về Việt Nam. Hàng chính hãng, giá tốt, ship toàn quốc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Footer />
        <ZaloButton />
      </body>
    </html>
  );
}
