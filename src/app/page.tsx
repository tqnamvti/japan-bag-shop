import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import OrderForm from "@/components/OrderForm";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ data: bags }, { data: cosmetics }, { data: supplements }, { data: jobPosts }] = await Promise.all([
    supabase.from("products").select("*").eq("category", "Túi xách").order("id", { ascending: false }).limit(3),
    supabase.from("products").select("*").eq("category", "Mỹ phẩm").order("id", { ascending: false }).limit(3),
    supabase.from("products").select("*").eq("category", "Thực phẩm chức năng").order("id", { ascending: false }).limit(3),
    supabase.from("job_posts").select("*").order("created_at", { ascending: false }).limit(3),
  ]);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-stone-900 text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:py-24">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-stone-400">
            Order từ Nhật Bản về Việt Nam
          </p>
          <h1 className="mb-5 text-3xl font-bold leading-tight md:text-6xl">
            Túi Xách & Mỹ Phẩm
            <br />
            <span className="text-stone-300">Nhật Chính Hãng</span>
          </h1>
          <p className="mx-auto mb-8 max-w-md text-sm text-stone-400 md:text-lg">
            Túi xách cao cấp & mỹ phẩm nội địa Nhật — hàng authentic tuyển chọn,
            ship tận nhà toàn quốc.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/products"
              className="rounded-2xl bg-white px-8 py-3 font-semibold text-black transition hover:bg-stone-100"
            >
              Xem sản phẩm
            </Link>
            <a
              href="https://zalo.me/0709166103"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-stone-600 px-8 py-3 font-semibold transition hover:border-white hover:text-white"
            >
              Liên hệ Zalo
            </a>
          </div>
        </div>
      </section>

      {/* Túi xách mới nhất */}
      {bags && bags.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 pt-10 md:pt-16">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold md:text-2xl">Túi xách</h2>
            <Link
              href="/products?category=Túi xách"
              className="shrink-0 whitespace-nowrap text-sm text-gray-500 transition hover:text-black"
            >
              Xem tất cả →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {bags.map((product) => (
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

      {/* Mỹ phẩm mới nhất */}
      {cosmetics && cosmetics.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 py-10 md:py-16">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold md:text-2xl">Mỹ phẩm</h2>
            <Link
              href="/products?category=Mỹ phẩm"
              className="shrink-0 whitespace-nowrap text-sm text-gray-500 transition hover:text-black"
            >
              Xem tất cả →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {cosmetics.map((product) => (
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

      {/* Thực phẩm chức năng mới nhất */}
      {supplements && supplements.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 py-10 md:py-16">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold md:text-2xl">Thực phẩm chức năng</h2>
            <Link
              href="/products?category=Thực phẩm chức năng"
              className="shrink-0 whitespace-nowrap text-sm text-gray-500 transition hover:text-black"
            >
              Xem tất cả →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {supplements.map((product) => (
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

      {/* Order theo yêu cầu */}
      <section className="bg-stone-50 py-12">
        <div className="mx-auto max-w-lg px-4">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold md:text-2xl">Order theo yêu cầu</h2>
            <p className="mt-2 text-sm text-gray-500">
              Thấy sản phẩm đẹp trên mạng? Gửi hình cho chúng tôi —
              chúng tôi sẽ tìm và order về cho bạn.
            </p>
          </div>
          <OrderForm />
        </div>
      </section>

      {/* Why us */}
      <section className="bg-stone-50 py-10 md:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-6 text-center text-xl font-bold md:mb-10 md:text-2xl">
            Tại sao chọn chúng tôi?
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
            {[
              { label: "01", title: "Hàng chính hãng", desc: "100% authentic từ Nhật Bản" },
              { label: "02", title: "Ship toàn quốc", desc: "Giao hàng tận nơi trên cả nước" },
              { label: "03", title: "Giá tốt nhất", desc: "Thẳng từ Nhật, không qua trung gian" },
              { label: "04", title: "Tư vấn nhiệt tình", desc: "Hỗ trợ qua Zalo 24/7" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-white p-4 shadow-sm md:p-5">
                <p className="mb-2 text-xs font-bold tracking-widest text-stone-400">
                  {item.label}
                </p>
                <h3 className="mb-1 text-sm font-bold md:text-base">{item.title}</h3>
                <p className="text-xs text-gray-500 md:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tuyển dụng */}
      {jobPosts && jobPosts.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 py-10 md:py-16">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold md:text-2xl">Tuyển dụng Nhật Bản</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {jobPosts.map((job) => (
              <div key={job.id} className="rounded-2xl border bg-white overflow-hidden hover:shadow-md transition">
                {job.image_url ? (
                  <img
                    src={job.image_url}
                    alt={job.title}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="h-44 w-full bg-stone-100" />
                )}
                <div className="p-4">
                  <p className="mb-1 text-xs text-blue-500">
                    {new Date(job.posted_at).toLocaleDateString("vi-VN")}
                  </p>
                  <h3 className="mb-2 font-bold leading-snug line-clamp-2">{job.title}</h3>
                  {job.description && (
                    <p className="text-sm text-gray-500 line-clamp-3">{job.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA bottom */}
      <section className="px-4 py-12 text-center md:py-16">
        <p className="mb-2 text-sm text-gray-500">Cần tư vấn hoặc đặt hàng?</p>
        <h2 className="mb-6 text-xl font-bold md:text-2xl">
          Liên hệ ngay với chúng tôi
        </h2>
        <a
          href="https://zalo.me/0709166103"
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
