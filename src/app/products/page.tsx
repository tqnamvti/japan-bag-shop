"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
};

const BRANDS = ["Tất cả", "Coach", "Gucci", "Furla", "Michael Kors", "Prada", "Tory Burch"];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("Tất cả");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        if (data) {
          setProducts(data);
          setFiltered(data);
        }
        setLoading(false);
      });
  }, []);

  function handleFilter(brand: string) {
    setSelectedBrand(brand);
    if (brand === "Tất cả") {
      setFiltered(products);
    } else {
      setFiltered(
        products.filter((p) =>
          p.name.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-7xl p-4">
          <div className="mb-4 h-9 w-52 animate-pulse rounded-xl bg-gray-200" />
          <div className="mb-6 flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-gray-200" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border p-3">
                <div className="aspect-square animate-pulse rounded-xl bg-gray-200" />
                <div className="mt-3 h-4 animate-pulse rounded-lg bg-gray-200" />
                <div className="mt-2 h-3 w-20 animate-pulse rounded-lg bg-gray-200" />
                <div className="mt-3 h-9 animate-pulse rounded-xl bg-gray-200" />
              </div>
            ))}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl p-4">
        <h1 className="mb-6 text-3xl font-bold">Tất cả sản phẩm</h1>

        {/* Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {BRANDS.map((brand) => (
            <button
              key={brand}
              onClick={() => handleFilter(brand)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedBrand === brand
                  ? "bg-black text-white"
                  : "border border-gray-300 hover:border-black"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center text-gray-400">
            <p className="text-lg">Không có sản phẩm nào</p>
            <button
              onClick={() => handleFilter("Tất cả")}
              className="mt-4 text-sm underline hover:text-black"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
