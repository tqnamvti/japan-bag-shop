import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";

export default async function HomePage() {
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false })
    .limit(4);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-stone-900 text-white">
        <div className="mx-auto max-w-4xl px-4 py-24 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-stone-400">
            Order từ Nhật Bản về Việt Nam
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            Túi Xách Nhật Bản
            <br />
            <span className="text-stone-300">Chính Hãng</span>
          </h1>
          <p className="mx-auto mb-10 max-w-md text-stone-400 md:text-lg">
            Coach, Gucci, Furla, Michael Kors — hàng nội địa Nhật tuyển chọn,
            ship tận nhà toàn quốc.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/products"
              className="w-full rounded-2xl bg-white px-8 py-3 font-semibold text-black transition hover:bg-stone-100 sm:w-auto"
            >
              Xem sản phẩm
            </Link>
            <a
              href="https://zalo.me/YOUR_ZALO_NUMBER"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-2xl border border-stone-600 px-8 py-3 font-semibold transition hover:border-white hover:text-white sm:w-auto"
            >
              Liên hệ Zalo
            </a>
          </div>
        </div>
      </section>

      {/* Featured products */}
      {products && products.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Sản phẩm nổi bật</h2>
            <Link
              href="/products"
              className="text-sm text-gray-500 transition hover:text-black"
            >
              Xem tất cả →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>
        </section>
      )}

      {/* Why us */}
      <section className="bg-stone-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-10 text-center text-2xl font-bold">
            Tại sao chọn chúng tôi?
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { label: "01", title: "Hàng chính hãng", desc: "100% authentic từ Nhật Bản" },
              { label: "02", title: "Ship toàn quốc", desc: "Giao hàng tận nơi trên cả nước" },
              { label: "03", title: "Giá tốt nhất", desc: "Thẳng từ Nhật, không qua trung gian" },
              { label: "04", title: "Tư vấn nhiệt tình", desc: "Hỗ trợ qua Zalo 24/7" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="mb-3 text-xs font-bold tracking-widest text-stone-400">
                  {item.label}
                </p>
                <h3 className="mb-1 font-bold">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="px-4 py-16 text-center">
        <p className="mb-2 text-sm text-gray-500">Cần tư vấn hoặc đặt hàng?</p>
        <h2 className="mb-6 text-2xl font-bold">Liên hệ ngay với chúng tôi</h2>
        <a
          href="https://zalo.me/YOUR_ZALO_NUMBER"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-2xl bg-black px-10 py-3 font-semibold text-white transition hover:bg-stone-800"
        >
          Nhắn Zalo ngay
        </a>
      </section>
    </>
  );
}
