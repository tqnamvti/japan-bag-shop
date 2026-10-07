"use client";

import dynamic from "next/dynamic";

// Nhật ký tải từ Supabase phía trình duyệt nên không render sẵn trên server.
const DiaryApp = dynamic(() => import("./DiaryApp"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#e8e2d6]" />,
});

export default function DiaryClient() {
  return <DiaryApp />;
}
