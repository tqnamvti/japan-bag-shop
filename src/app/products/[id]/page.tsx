import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

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

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl p-4">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-black">Trang chủ</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-black">Sản phẩm</Link>
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </nav>

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

          <a
            href={`https://zalo.me/0709166103?text=${encodeURIComponent(`Mình muốn đặt hàng: ${product.name}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              mt-8
              block
              w-full
              rounded-2xl
              bg-black
              py-4
              text-center
              text-white
              transition
              hover:bg-stone-800

              md:inline-block
              md:w-auto
              md:px-8
            "
          >
            Đặt hàng qua Zalo
          </a>
        </div>
        </div>
      </main>
    </>
  );
}
