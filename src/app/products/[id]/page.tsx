import Image from "next/image";
import Navbar from "@/components/Navbar";
import { products } from "@/data/products";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return <main className="p-4">Product not found</main>;
  }

  return (
    <>
      <Navbar />

      <main
        className="
          mx-auto
          grid
          max-w-6xl
          gap-8
          p-4

          md:grid-cols-2
        "
      >
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

          <button
            className="
              mt-8
              w-full
              rounded-2xl
              bg-black
              py-4
              text-white
              md:w-auto
              md:px-8
            "
          >
            Đặt hàng ngay
          </button>
        </div>
      </main>
    </>
  );
}
