"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function OrderForm() {
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fileKey, setFileKey] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      alert("Vui lòng chọn ảnh sản phẩm muốn order");
      return;
    }
    setLoading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("orders")
        .upload(fileName, file);

      if (uploadError) throw new Error("Upload ảnh thất bại");

      const { data: { publicUrl } } = supabase.storage
        .from("orders")
        .getPublicUrl(uploadData.path);

      const { error } = await supabase
        .from("custom_orders")
        .insert({ image_url: publicUrl, note });

      if (error) throw new Error("Gửi yêu cầu thất bại");

      setSuccess(true);
      setNote("");
      setFile(null);
      setPreview(null);
      setFileKey((k) => k + 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-4xl">✓</p>
        <p className="mt-3 text-lg font-bold">Đã gửi yêu cầu!</p>
        <p className="mt-1 text-sm text-gray-500">
          Chúng tôi sẽ liên hệ qua Zalo sớm nhất có thể.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-sm underline hover:text-black"
        >
          Gửi yêu cầu khác
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
      {/* Preview ảnh */}
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="preview"
            className="w-full rounded-xl object-cover max-h-64"
          />
          <button
            type="button"
            onClick={() => { setPreview(null); setFile(null); setFileKey((k) => k + 1); }}
            className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
          >
            Xóa
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center hover:border-black">
          <span className="text-2xl text-gray-400">+</span>
          <span className="text-sm font-medium">Chọn ảnh sản phẩm</span>
          <span className="text-xs text-gray-400">JPG, PNG, WEBP...</span>
          <input
            key={fileKey}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}

      <textarea
        placeholder="Ghi chú thêm: màu sắc, size, ngân sách, link tham khảo..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        className="w-full resize-none rounded-xl border p-3 text-sm outline-none focus:border-black"
      />

      <button
        disabled={loading}
        className="w-full rounded-2xl bg-black py-3 font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50"
      >
        {loading ? "Đang gửi..." : "Gửi yêu cầu order"}
      </button>
    </form>
  );
}
