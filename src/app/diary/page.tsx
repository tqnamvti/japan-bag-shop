import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import DiaryClient from "@/components/diary/DiaryClient";
import { serif, sans } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Nhật kí — Bảo Ngọc Order",
};

export default function DiaryPage() {
  return (
    <>
      <div className="print:hidden">
        <Navbar />
      </div>
      <div className={`${serif.variable} ${sans.variable} w-full`}>
        <DiaryClient />
      </div>
    </>
  );
}
