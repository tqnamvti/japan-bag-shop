"use client";

import { useEffect, useState } from "react";
type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
};
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*").order("id", {
      ascending: false,
    });

    if (data) {
      setProducts(data);
    }
  }
  async function handleDelete(id: number) {
    const confirmed = confirm("Delete this product?");

    if (!confirmed) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      alert("Delete failed");
      return;
    }

    fetchProducts();
  }

  useEffect(() => {
    fetchProducts();
  }, []);
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  setLoading(true)

  try {
    if (editingId) { console.log("UPDATE ID:", editingId)
      // UPDATE
      const { error: updateError } =
        await supabase
          .from("products")
          .update({
            name,
            price: Number(price),
            image,
            description,
          })
          .eq("id", editingId)

      if (updateError) {
        alert("Update failed")
        return
      }

      alert("Product updated!")
      setEditingId(null)
      fetchProducts()
    } else {
      // CREATE
      const { error: insertError } =
        await supabase
          .from("products")
          .insert({
            name,
            price: Number(price),
            image,
            description,
          })

      if (insertError) {
        alert("Create failed")
        return
      }

      alert("Product created!")
    }

    fetchProducts()
  } finally {
    setLoading(false)
  }
}

  return (
    <>
      <Navbar />

      <main
        className="
          mx-auto
          max-w-2xl
          p-4
        "
      >
        <h1
          className="
            mb-6
            text-3xl
            font-bold
          "
        >
          Admin Dashboard
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              p-3
            "
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              p-3
            "
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="
    w-full
    rounded-xl
    border
    p-3
  "
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="
              h-32
              w-full
              rounded-xl
              border
              p-3
            "
          />

          <button
            disabled={loading}
            className="
    w-full
    rounded-xl
    bg-black
    py-4
    text-white
  "
          >
            {loading
              ? "Saving..."
              : editingId
                ? "Update Product"
                : "Create Product"}
          </button>
        </form>
        <div className="mt-10 space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="
        flex
        items-center
        justify-between
        rounded-2xl
        border
        p-4
      "
            >
              <div>
                <h2 className="font-bold">{product.name}</h2>

                <p>¥{product.price.toLocaleString()}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(product.id);
                    setName(product.name);
                    setPrice(product.price.toString());
                    setImage(product.image);
                    setDescription(product.description);
                  }}
                  className="
    rounded-xl
    bg-blue-500
    px-4
    py-2
    text-white
  "
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(product.id)}
                  className="
    rounded-xl
    bg-red-500
    px-4
    py-2
    text-white
  "
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
