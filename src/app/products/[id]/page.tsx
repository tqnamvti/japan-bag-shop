import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) return { title: "Không tìm thấy sản phẩm — Japan Bag Shop" };

  return {
    title: `${product.name} — Japan Bag Shop`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image, width: 800, height: 800, alt: product.name }],
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    return (
      <>
        <Navbar />

        <main className="p-4">Không tìm thấy sản phẩm</main>
      </>
    );
  }

  const { data: related } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", id)
    .limit(4);

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl p-4">
        {/* Back + Breadcrumb */}
        <div className="mb-6 flex flex-col gap-3">
          <Link
            href="/products"
            className="flex w-fit items-center gap-1 text-sm text-gray-500 hover:text-black"
          >
            ← Quay lại
          </Link>
          <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-black">Trang chủ</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-black">Sản phẩm</Link>
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </nav>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
        <div
          className="
            relative
            aspect-square
            overflow-hidden
            rounded-2xl
          "
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p
            className="
              mt-4
              text-2xl
              font-semibold
            "
          >
            {product.price.toLocaleString()} 円
          </p>

          <p
            className="
              mt-6
              leading-7
              text-gray-600
            "
          >
            {product.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 md:flex-row">
            <a
              href={`https://zalo.me/0709166103?text=${encodeURIComponent(`Mình muốn đặt hàng: ${product.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-2xl bg-black py-4 text-center text-white transition hover:bg-stone-800 md:w-auto md:px-8"
            >
              Đặt hàng qua Zalo
            </a>
            <a
              href="https://www.facebook.com/share/1EUdKktS5F/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-2xl bg-blue-600 py-4 text-center text-white transition hover:bg-blue-700 md:w-auto md:px-8"
            >
              Đặt hàng qua Facebook
            </a>
          </div>
        </div>
        </div>

        {/* Sản phẩm liên quan */}
        {related && related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-xl font-bold">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((item) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
