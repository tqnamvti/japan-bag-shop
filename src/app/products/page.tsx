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
  category?: string;
};

const CATEGORIES = ["Tất cả", "Túi xách", "Mỹ phẩm"];

const BRANDS: Record<string, string[]> = {
  "Tất cả": ["Tất cả", "Coach", "Gucci", "Furla", "Michael Kors", "Shiseido", "SK-II", "Canmake"],
  "Túi xách": ["Tất cả", "Coach", "Gucci", "Furla", "Michael Kors", "Prada", "Tory Burch"],
  "Mỹ phẩm": ["Tất cả", "Shiseido", "SK-II", "Canmake", "Cezanne", "KOSE", "Hada Labo"],
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedBrand, setSelectedBrand] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        if (data) setProducts(data);
        setLoading(false);
      });
  }, []);

  function handleCategoryChange(cat: string) {
    setSelectedCategory(cat);
    setSelectedBrand("Tất cả");
  }

  function handleReset() {
    setSelectedCategory("Tất cả");
    setSelectedBrand("Tất cả");
    setSearch("");
  }

  function countByBrand(brand: string) {
    const inCategory = selectedCategory === "Tất cả"
      ? products
      : products.filter((p) => p.category === selectedCategory);
    if (brand === "Tất cả") return inCategory.length;
    return inCategory.filter((p) =>
      p.name.toLowerCase().includes(brand.toLowerCase())
    ).length;
  }

  const displayed = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "Tất cả" || p.category === selectedCategory;
    const matchesBrand =
      selectedBrand === "Tất cả" ||
      p.name.toLowerCase().includes(selectedBrand.toLowerCase());
    const matchesSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase().trim());
    return matchesCategory && matchesBrand && matchesSearch;
  });

  const currentBrands = BRANDS[selectedCategory] ?? BRANDS["Tất cả"];

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-7xl p-4">
          <div className="mb-4 h-9 w-52 animate-pulse rounded-xl bg-gray-200" />
          <div className="mb-4 flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 w-28 animate-pulse rounded-full bg-gray-200" />
            ))}
          </div>
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

        {/* Search */}
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
        />

        {/* Category tabs */}
        <div className="mb-4 flex gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                selectedCategory === cat
                  ? "bg-black text-white"
                  : "border border-gray-300 hover:border-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Brand filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {currentBrands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                selectedBrand === brand
                  ? "bg-stone-700 text-white"
                  : "border border-gray-200 text-gray-500 hover:border-gray-400"
              }`}
            >
              {brand} ({countByBrand(brand)})
            </button>
          ))}
        </div>

        {displayed.length === 0 ? (
          <div className="py-24 text-center text-gray-400">
            <p className="text-lg">Không tìm thấy sản phẩm nào</p>
            <button
              onClick={handleReset}
              className="mt-4 text-sm underline hover:text-black"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {displayed.map((product) => (
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
