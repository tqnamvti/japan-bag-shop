import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";

export default async function ProductsPage() {
  const { data: products, error } = await supabase.from("products").select("*");

  if (error) {
    return <main className="p-4">Error loading products</main>;
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl p-4">
        <h1 className="mb-6 text-3xl font-bold">Products</h1>

        <div
          className="
            grid
            grid-cols-2
            gap-4

            md:grid-cols-3
            lg:grid-cols-4
          "
        >
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
      </main>
    </>
  );
}
