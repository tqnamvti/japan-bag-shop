import Image from "next/image";
import Link from "next/link";

type Props = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function ProductCard({ id, name, price, image }: Props) {
  return (
    <Link href={`/products/${id}`}>
      <div
        className="
          rounded-2xl
          border
          bg-white
          p-3
          transition
          hover:-translate-y-1
          hover:shadow-xl
        "
      >
        <div
          className="
            relative
            aspect-square
            overflow-hidden
            rounded-xl
          "
        >
          <Image src={image} alt={name} fill className="object-cover" />
        </div>

        <h2
          className="
            mt-3
            line-clamp-2
            text-sm
            font-semibold
            md:text-base
          "
        >
          {name}
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-gray-600
          "
        >
          {price.toLocaleString()} 円
        </p>

        <button
          className="
            mt-3
            w-full
            rounded-xl
            bg-black
            py-2
            text-sm
            text-white
            md:text-base
          "
        >
          Đặt hàng
        </button>
      </div>
    </Link>
  );
}
