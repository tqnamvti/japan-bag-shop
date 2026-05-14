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
  category: string;
};

type CustomOrder = {
  id: number;
  image_url: string;
  note: string;
  created_at: string;
};

type JobPost = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  posted_at: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "jobs">("products");

  // --- Product state ---
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Túi xách");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  // --- Order state ---
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);

  // --- Job state ---
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobFile, setJobFile] = useState<File | null>(null);
  const [jobPostedAt, setJobPostedAt] = useState(new Date().toISOString().split("T")[0]);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [jobFileKey, setJobFileKey] = useState(0);
  const [jobImageUrl, setJobImageUrl] = useState("");
  const [jobLoading, setJobLoading] = useState(false);

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*").order("id", { ascending: false });
    if (data) setProducts(data);
  }

  async function fetchCustomOrders() {
    const { data } = await supabase
      .from("custom_orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setCustomOrders(data);
  }

  async function fetchJobPosts() {
    const { data } = await supabase
      .from("job_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setJobPosts(data);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
      } else {
        setIsAuthChecking(false);
        fetchProducts();
        fetchCustomOrders();
        fetchJobPosts();
      }
    });
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  // --- Product handlers ---
  function resetForm() {
    setName("");
    setPrice("");
    setImage("");
    setFile(null);
    setDescription("");
    setCategory("Túi xách");
    setEditingId(null);
    setFileInputKey((k) => k + 1);
  }

  async function uploadImage(file: File, bucket: string): Promise<string> {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true });
    if (error) throw new Error("Upload ảnh thất bại");
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return publicUrl;
  }

  async function handleDelete(id: number) {
    const confirmed = confirm("Xác nhận xóa sản phẩm này?");
    if (!confirmed) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { alert("Xóa thất bại"); return; }
    fetchProducts();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = image;
      if (file) imageUrl = await uploadImage(file, "products");

      if (editingId) {
        const { error } = await supabase
          .from("products")
          .update({ name, price: Number(price), image: imageUrl, description, category })
          .eq("id", editingId);
        if (error) { alert("Cập nhật thất bại"); return; }
        alert("Cập nhật sản phẩm thành công!");
      } else {
        if (!file) { alert("Vui lòng chọn ảnh sản phẩm"); return; }
        const { error } = await supabase.from("products").insert({
          name, price: Number(price), image: imageUrl, description, category,
        });
        if (error) { alert("Tạo sản phẩm thất bại"); return; }
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

  // --- Order handlers ---
  async function handleDeleteOrder(id: number) {
    const confirmed = confirm("Xác nhận xóa đơn order này?");
    if (!confirmed) return;
    await supabase.from("custom_orders").delete().eq("id", id);
    fetchCustomOrders();
  }

  // --- Job handlers ---
  function resetJobForm() {
    setJobTitle("");
    setJobDescription("");
    setJobFile(null);
    setJobImageUrl("");
    setJobPostedAt(new Date().toISOString().split("T")[0]);
    setEditingJobId(null);
    setJobFileKey((k) => k + 1);
  }

  async function handleSubmitJob(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setJobLoading(true);
    try {
      let imageUrl = jobImageUrl;
      if (jobFile) imageUrl = await uploadImage(jobFile, "jobs");

      if (editingJobId) {
        const { error } = await supabase
          .from("job_posts")
          .update({ title: jobTitle, description: jobDescription, image_url: imageUrl, posted_at: jobPostedAt })
          .eq("id", editingJobId);
        if (error) { alert("Cập nhật thất bại"); return; }
        alert("Cập nhật bài tuyển dụng thành công!");
      } else {
        const { error } = await supabase.from("job_posts").insert({
          title: jobTitle,
          description: jobDescription,
          image_url: imageUrl,
          posted_at: jobPostedAt,
        });
        if (error) { alert("Tạo bài thất bại"); return; }
        alert("Đăng bài tuyển dụng thành công!");
      }
      resetJobForm();
      fetchJobPosts();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    } finally {
      setJobLoading(false);
    }
  }

  async function handleDeleteJob(id: number) {
    const confirmed = confirm("Xác nhận xóa bài tuyển dụng này?");
    if (!confirmed) return;
    await supabase.from("job_posts").delete().eq("id", id);
    fetchJobPosts();
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
      <main className="mx-auto max-w-2xl p-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-100"
          >
            Đăng xuất
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === "products" ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-black"
            }`}
          >
            Sản phẩm ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === "orders" ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-black"
            }`}
          >
            Đơn order ({customOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === "jobs" ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-black"
            }`}
          >
            Tuyển dụng ({jobPosts.length})
          </button>
        </div>

        {/* Tab: Sản phẩm */}
        {activeTab === "products" && (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border p-3 text-sm"
              >
                <option value="Túi xách">Túi xách</option>
                <option value="Mỹ phẩm">Mỹ phẩm</option>
              </select>
              <input
                type="text"
                placeholder="Tên sản phẩm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border p-3"
              />
              <input
                type="number"
                placeholder="Giá (¥)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full rounded-xl border p-3"
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
                className="h-32 w-full rounded-xl border p-3"
              />
              <div className="flex gap-2">
                <button disabled={loading} className="flex-1 rounded-xl bg-black py-4 text-white">
                  {loading ? "Đang lưu..." : editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="rounded-xl border px-4 py-4 text-sm hover:bg-gray-100">
                    Hủy
                  </button>
                )}
              </div>
            </form>

            <div className="mt-10 space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between rounded-2xl border p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h2 className="font-bold">{product.name}</h2>
                      <p className="text-xs text-gray-400">{product.category}</p>
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
                        setCategory(product.category ?? "Túi xách");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="rounded-xl bg-blue-500 px-4 py-2 text-white"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="rounded-xl bg-red-500 px-4 py-2 text-white"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Tab: Đơn order */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {customOrders.length === 0 ? (
              <p className="py-16 text-center text-gray-400">Chưa có đơn order nào</p>
            ) : (
              customOrders.map((order) => (
                <div key={order.id} className="flex gap-4 rounded-2xl border p-4">
                  <img
                    src={order.image_url}
                    alt="order"
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <p className="text-sm text-gray-700">{order.note || "Không có ghi chú"}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="self-start rounded-xl bg-red-500 px-3 py-1.5 text-sm text-white"
                  >
                    Xóa
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Tuyển dụng */}
        {activeTab === "jobs" && (
          <>
            <form onSubmit={handleSubmitJob} className="space-y-4">
              <input
                type="text"
                placeholder="Tiêu đề bài tuyển dụng"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
                className="w-full rounded-xl border p-3"
              />
              <input
                type="date"
                value={jobPostedAt}
                onChange={(e) => setJobPostedAt(e.target.value)}
                className="w-full rounded-xl border p-3 text-sm"
              />
              <input
                key={jobFileKey}
                type="file"
                accept="image/*"
                onChange={(e) => setJobFile(e.target.files?.[0] || null)}
                className="w-full rounded-xl border p-3"
              />
              <textarea
                placeholder="Mô tả ngắn về vị trí tuyển dụng..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border p-3 text-sm"
              />
              <div className="flex gap-2">
                <button disabled={jobLoading} className="flex-1 rounded-xl bg-black py-4 text-white">
                  {jobLoading ? "Đang lưu..." : editingJobId ? "Cập nhật bài" : "Đăng bài tuyển dụng"}
                </button>
                {editingJobId && (
                  <button type="button" onClick={resetJobForm} className="rounded-xl border px-4 py-4 text-sm hover:bg-gray-100">
                    Hủy
                  </button>
                )}
              </div>
            </form>

            <div className="mt-10 space-y-4">
              {jobPosts.length === 0 ? (
                <p className="py-16 text-center text-gray-400">Chưa có bài tuyển dụng nào</p>
              ) : (
                jobPosts.map((job) => (
                  <div key={job.id} className="flex gap-4 rounded-2xl border p-4">
                    {job.image_url ? (
                      <img
                        src={job.image_url}
                        alt={job.title}
                        className="h-16 w-16 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 shrink-0 rounded-xl bg-gray-100" />
                    )}
                    <div className="flex flex-1 flex-col justify-between">
                      <p className="font-semibold leading-snug">{job.title}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(job.posted_at).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2 self-start">
                      <button
                        onClick={() => {
                          setEditingJobId(job.id);
                          setJobTitle(job.title);
                          setJobDescription(job.description ?? "");
                          setJobImageUrl(job.image_url ?? "");
                          setJobPostedAt(job.posted_at);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="rounded-xl bg-blue-500 px-3 py-1.5 text-sm text-white"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="rounded-xl bg-red-500 px-3 py-1.5 text-sm text-white"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
}
