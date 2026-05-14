"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*").order("id", {
      ascending: false,
    });

    if (data) {
      setProducts(data);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  async function handleDelete(id: number) {
    const confirmed = confirm("Xác nhận xóa sản phẩm này?");

    if (!confirmed) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      alert("Xóa thất bại");
      return;
    }

    fetchProducts();
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
      } else {
        setIsAuthChecking(false);
        fetchProducts();
      }
    });
  }, [router]);
  function resetForm() {
    setName("");
    setPrice("");
    setImage("");
    setFile(null);
    setDescription("");
    setEditingId(null);
    setFileInputKey((k) => k + 1);
  }

  async function uploadImage(file: File): Promise<string> {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from("products")
      .upload(fileName, file, { upsert: true });

    if (error) throw new Error("Upload ảnh thất bại");

    const { data: { publicUrl } } = supabase.storage
      .from("products")
      .getPublicUrl(data.path);

    return publicUrl;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = image;

      if (file) {
        imageUrl = await uploadImage(file);
      }

      if (editingId) {
        const { error: updateError } = await supabase
          .from("products")
          .update({ name, price: Number(price), image: imageUrl, description })
          .eq("id", editingId);

        if (updateError) {
          alert("Cập nhật thất bại");
          return;
        }

        alert("Cập nhật sản phẩm thành công!");
      } else {
        if (!file) {
          alert("Vui lòng chọn ảnh sản phẩm");
          return;
        }

        const { error: insertError } = await supabase.from("products").insert({
          name,
          price: Number(price),
          image: imageUrl,
          description,
        });

        if (insertError) {
          alert("Tạo sản phẩm thất bại");
          return;
        }

        alert("Tạo sản phẩm thành công!");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  if (isAuthChecking) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Đang kiểm tra đăng nhập...
      </div>
    );
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
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-100"
          >
            Đăng xuất
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Tên sản phẩm"
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
            placeholder="Giá (¥)"
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
            key={fileInputKey}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full rounded-xl border p-3"
          />

          <textarea
            placeholder="Mô tả sản phẩm"
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
              ? "Đang lưu..."
              : editingId
                ? "Cập nhật sản phẩm"
                : "Thêm sản phẩm"}
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
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-bold">{product.name}</h2>
                  <p className="text-sm text-gray-500">¥{product.price.toLocaleString()}</p>
                </div>
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
                  Sửa
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
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
