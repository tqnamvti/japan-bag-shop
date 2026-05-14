import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-6xl font-bold text-stone-200">404</p>
        <h1 className="mt-4 text-2xl font-bold">Trang không tìm thấy</h1>
        <p className="mt-2 text-gray-500">
          Trang bạn đang tìm không tồn tại hoặc đã bị xóa.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/"
            className="rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Về trang chủ
          </Link>
          <Link
            href="/products"
            className="rounded-2xl border px-6 py-3 text-sm font-semibold transition hover:border-black"
          >
            Xem sản phẩm
          </Link>
        </div>
      </main>
    </>
  );
}
