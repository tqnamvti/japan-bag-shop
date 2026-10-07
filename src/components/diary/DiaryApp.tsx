"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Entry = { id: string; date: string; title: string; mood: string; body: string };
type PrintMode = "one" | "all";
type SaveState = "saved" | "saving" | "error";

const TABLE = "diary_entries";
const WEEK = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const MOODS = ["Vui", "Bình yên", "Biết ơn", "Mệt", "Buồn", "Lo âu"];

// Giấy kẻ dòng, cỡ chữ 20px
const FS = 20;
const LH = Math.round(FS * 1.6);
const PAPER_BG = `repeating-linear-gradient(to bottom, transparent 0, transparent ${LH - 1}px, #ddd5c5 ${LH - 1}px, #ddd5c5 ${LH}px)`;

const iso = (d: Date) => {
  const z = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
};
const parse = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const uid = () => crypto.randomUUID();
const blank = (date = iso(new Date())): Entry => ({ id: uid(), date, title: "", mood: "", body: "" });
const byDate = (a: Entry, b: Entry) => (a.date < b.date ? -1 : 1);


function fmt(e: Entry, sorted: Entry[]) {
  const d = parse(e.date);
  return {
    ...e,
    dayNum: String(d.getDate()).padStart(2, "0"),
    weekday: WEEK[d.getDay()],
    monthYear: `tháng ${d.getMonth() + 1}, ${d.getFullYear()}`,
    dateShort: d.toLocaleDateString("vi-VN"),
    pageNo: sorted.indexOf(e) + 1,
  };
}

type Formatted = ReturnType<typeof fmt>;

function PageHeader({ p }: { p: Formatted }) {
  return (
    <div className="flex items-end justify-between gap-6 border-b border-[#2b2622] pb-[18px]">
      <div className="flex items-end gap-5">
        <div className="text-[clamp(72px,14vw,104px)] font-medium leading-[0.8]">{p.dayNum}</div>
        <div className="flex flex-col gap-1.5 pb-1">
          <div className="font-[family-name:var(--font-vn)] text-xs font-semibold uppercase tracking-[0.16em]">
            {p.weekday}
          </div>
          <div className="text-[22px] italic">{p.monthYear}</div>
        </div>
      </div>
      <div className="pb-1.5 font-[family-name:var(--font-vn)] text-[11px] uppercase tracking-[0.12em] text-[#6f665b]">
        Trang {p.pageNo}
      </div>
    </div>
  );
}

function PageFooter({ p }: { p: Formatted }) {
  return (
    <div className="flex justify-between pt-4 font-[family-name:var(--font-vn)] text-[10px] uppercase tracking-[0.12em] text-[#8a8073]">
      <span>Nhật ký</span>
      <span>{p.dateShort}</span>
    </div>
  );
}

type Load = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; entries: Entry[] };

// Tải nhật ký dùng chung từ Supabase rồi mới hiển thị cuốn sổ.
export default function DiaryApp() {
  const [load, setLoad] = useState<Load>({ status: "loading" });

  useEffect(() => {
    supabase
      .from(TABLE)
      .select("id, date, title, mood, body")
      .order("date")
      .then(({ data, error }) => {
        if (error) setLoad({ status: "error", message: error.message });
        else setLoad({ status: "ready", entries: data ?? [] });
      });
  }, []);

  if (load.status === "ready") return <DiaryBook initial={load.entries} />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e8e2d6] px-6 text-center font-[family-name:var(--font-vn)] text-sm text-[#6f665b] print:hidden">
      {load.status === "loading" ? "Đang mở nhật ký…" : `Không tải được nhật ký: ${load.message}`}
    </div>
  );
}

function DiaryBook({ initial }: { initial: Entry[] }) {
  const [entries, setEntries] = useState<Entry[]>(() => (initial.length ? initial : [blank()]));
  const [curId, setCurId] = useState(() => [...entries].sort(byDate).at(-1)!.id);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  // Các trang đã sửa nhưng chưa ghi lên Supabase
  const dirty = useRef(new Set<string>());
  const [full, setFull] = useState(false);
  const [printMode, setPrintMode] = useState<PrintMode>("one");
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const sorted = [...entries].sort(byDate);
  const raw = entries.find((e) => e.id === curId) ?? sorted[sorted.length - 1];
  const cur = fmt(raw, sorted);

  // Ghi các trang đã sửa lên Supabase sau khi ngừng gõ 600ms
  useEffect(() => {
    if (!dirty.current.size) return;
    const t = setTimeout(async () => {
      const ids = [...dirty.current];
      dirty.current.clear();
      const rows = entries
        .filter((e) => ids.includes(e.id))
        .map((e) => ({ ...e, updated_at: new Date().toISOString() }));
      const { error } = await supabase.from(TABLE).upsert(rows);
      if (error) ids.forEach((id) => dirty.current.add(id));
      setSaveState(error ? "error" : dirty.current.size ? "saving" : "saved");
    }, 600);
    return () => clearTimeout(t);
  }, [entries]);

  // Cảnh báo khi nội dung vượt quá một trang A4
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const el = bodyRef.current;
      if (el) setFull(el.scrollHeight > el.clientHeight + 2);
    });
    return () => cancelAnimationFrame(id);
  }, [raw.body, raw.id]);

  function update(patch: Partial<Entry>) {
    dirty.current.add(raw.id);
    setEntries(entries.map((e) => (e.id === raw.id ? { ...e, ...patch } : e)));
    setSaveState("saving");
  }

  function newDay() {
    const today = iso(new Date());
    let date = today;
    if (entries.some((e) => e.date === today)) {
      const d = parse(sorted[sorted.length - 1].date);
      d.setDate(d.getDate() + 1);
      date = iso(d);
      if (date < today) date = today;
    }
    const existing = entries.find((e) => e.date === date);
    if (existing) {
      setCurId(existing.id);
      return;
    }
    // Trang mới chỉ được lưu khi bắt đầu viết
    const n = blank(date);
    setEntries([...entries, n]);
    setCurId(n.id);
  }

  async function remove() {
    if (!confirm(`Xoá trang nhật ký ngày ${cur.dateShort}?`)) return;
    dirty.current.delete(raw.id);
    const { error } = await supabase.from(TABLE).delete().eq("id", raw.id);
    if (error) {
      alert(`Không xoá được: ${error.message}`);
      return;
    }
    let rest = entries.filter((e) => e.id !== raw.id);
    if (!rest.length) rest = [blank()];
    setEntries(rest);
    setCurId(rest[rest.length - 1].id);
  }

  function print(mode: PrintMode) {
    setPrintMode(mode);
    setTimeout(() => window.print(), 300);
  }

  const printList = (printMode === "all" ? sorted : [raw]).map((e) => fmt(e, sorted));

  return (
    <>
      <style>{"@media print{@page{size:A4;margin:0}html,body{background:#fff}}"}</style>

      {/* Màn hình */}
      <div className="flex min-h-screen flex-wrap bg-[#e8e2d6] font-[family-name:var(--font-vn)] text-[#2b2622] print:hidden">
        <aside className="flex max-w-full flex-[0_0_280px] flex-col gap-6 border-r border-[#d8d0c1] bg-[#f4efe5] px-5 py-7 max-md:flex-[1_1_100%] max-md:border-b max-md:border-r-0">
          <div className="flex flex-col gap-1">
            <div className="font-[family-name:var(--font-serif)] text-[34px] font-medium leading-none">Nhật ký</div>
            <div className="text-xs text-[#6f665b]">{entries.length} trang đã viết</div>
          </div>

          <button
            onClick={newDay}
            className="h-11 cursor-pointer rounded-md border-none bg-[#2b2622] text-sm font-medium text-[#f4efe5] transition-colors hover:bg-[#9a4f2e]"
          >
            + Viết ngày mới
          </button>

          <div className="-mx-2 flex flex-1 flex-col gap-0.5 overflow-auto max-md:max-h-64">
            {[...sorted].reverse().map((e) => {
              const f = fmt(e, sorted);
              return (
                <button
                  key={e.id}
                  onClick={() => setCurId(e.id)}
                  className={`grid cursor-pointer grid-cols-[44px_1fr] items-center gap-3 rounded-md border-none px-2 py-2.5 text-left text-[#2b2622] hover:bg-[#e9e2d4] ${
                    e.id === raw.id ? "bg-[#e4dccc]" : "bg-transparent"
                  }`}
                >
                  <span className="text-center font-[family-name:var(--font-serif)] text-[30px] font-medium leading-none">
                    {f.dayNum}
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-[11px] uppercase tracking-[0.08em] text-[#6f665b]">
                      {f.weekday} · {f.dateShort}
                    </span>
                    <span className="truncate text-[13px]">{e.title || "Chưa có tiêu đề"}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 border-t border-[#d8d0c1] pt-5">
            <button
              onClick={() => print("one")}
              className="h-11 cursor-pointer rounded-md border border-[#2b2622] bg-transparent text-sm font-medium text-[#2b2622] transition-colors hover:bg-[#2b2622] hover:text-[#f4efe5]"
            >
              Tải trang này (PDF)
            </button>
            <button
              onClick={() => print("all")}
              className="h-11 cursor-pointer rounded-md border border-[#d8d0c1] bg-transparent text-sm text-[#2b2622] transition-colors hover:border-[#2b2622]"
            >
              Tải tất cả các trang
            </button>
            <div className="text-[11px] leading-normal text-[#6f665b]">
              Chọn “Lưu dưới dạng PDF” trong hộp thoại in. Khổ A4, mỗi ngày một trang.
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-[1_1_600px] flex-col items-start gap-3.5 overflow-auto px-4 pb-16 pt-10 md:px-6">
          <div className="mx-auto flex w-[794px] max-w-full flex-wrap items-center justify-between gap-3 text-[13px] text-[#6f665b]">
            <label className="flex items-center gap-2.5">
              Ngày
              <input
                type="date"
                value={raw.date}
                onChange={(ev) => ev.target.value && update({ date: ev.target.value })}
                className="h-9 rounded-md border border-[#d8d0c1] bg-[#fbf8f1] px-2.5 text-[13px] outline-none"
              />
            </label>
            <div className="flex flex-wrap items-center gap-4">
              {full && <span className="text-[#9a4f2e]">Trang đã đầy, phần vượt sẽ bị cắt khi in</span>}
              <span className={saveState === "error" ? "text-[#9a4f2e]" : ""}>
                {saveState === "saved" ? "Đã lưu" : saveState === "saving" ? "Đang lưu…" : "Lưu thất bại, đang thử lại khi bạn gõ tiếp"}
              </span>
              <button
                onClick={remove}
                className="cursor-pointer border-none bg-transparent text-[13px] text-[#6f665b] underline hover:text-[#9a4f2e]"
              >
                Xoá trang
              </button>
            </div>
          </div>

          <div className="mx-auto flex h-[1123px] w-[794px] max-w-full flex-none flex-col bg-[#fbf8f1] px-6 pb-12 pt-16 font-[family-name:var(--font-serif)] text-[#2b2622] shadow-[0_1px_2px_rgba(43,38,34,0.08),0_12px_40px_rgba(43,38,34,0.12)] md:px-[72px]">
            <PageHeader p={cur} />

            <div className="flex flex-wrap items-center gap-2 pb-1 pt-4 font-[family-name:var(--font-vn)]">
              <span className="mr-1.5 text-[11px] uppercase tracking-[0.12em] text-[#6f665b]">Tâm trạng</span>
              {MOODS.map((m) => {
                const on = raw.mood === m;
                return (
                  <button
                    key={m}
                    onClick={() => update({ mood: on ? "" : m })}
                    className={`h-7 shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-3 text-xs ${
                      on ? "border-[#2b2622] bg-[#2b2622] text-[#fbf8f1]" : "border-[#cfc6b5] bg-transparent text-[#2b2622]"
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>

            <input
              value={raw.title}
              onChange={(ev) => update({ title: ev.target.value })}
              placeholder="Tiêu đề cho ngày hôm nay…"
              className="w-full border-none bg-transparent pb-2 pt-[18px] font-[family-name:var(--font-serif)] text-[34px] font-medium italic text-[#2b2622] outline-none"
            />

            <textarea
              ref={bodyRef}
              value={raw.body}
              onChange={(ev) => update({ body: ev.target.value })}
              placeholder="Hôm nay của bạn thế nào?"
              className="mt-2 w-full flex-1 resize-none overflow-hidden border-none bg-transparent p-0 font-[family-name:var(--font-serif)] text-[#2b2622] outline-none [background-attachment:local]"
              style={{ fontSize: FS, lineHeight: `${LH}px`, backgroundImage: PAPER_BG }}
            />

            <PageFooter p={cur} />
          </div>
        </main>
      </div>

      {/* Bản in: mỗi ngày một trang A4 */}
      <div className="hidden print:block">
        {printList.map((p) => (
          <div
            key={p.id}
            className="flex h-[297mm] w-[210mm] break-after-page flex-col overflow-hidden bg-white px-[19mm] pb-[13mm] pt-[17mm] font-[family-name:var(--font-serif)] text-[#2b2622] [print-color-adjust:exact]"
          >
            <PageHeader p={p} />
            {p.mood && (
              <div className="flex items-center gap-2 pb-1 pt-4 font-[family-name:var(--font-vn)]">
                <span className="mr-1.5 text-[11px] uppercase tracking-[0.12em] text-[#6f665b]">Tâm trạng</span>
                <span className="h-7 shrink-0 whitespace-nowrap rounded-full border border-[#2b2622] bg-[#2b2622] px-3 text-xs leading-[26px] text-[#fbf8f1]">
                  {p.mood}
                </span>
              </div>
            )}
            <div className="min-h-[30px] pb-2 pt-[18px] text-[34px] font-medium italic">{p.title}</div>
            <div
              className="mt-2 flex-1 overflow-hidden whitespace-pre-wrap break-words"
              style={{ fontSize: FS, lineHeight: `${LH}px`, backgroundImage: PAPER_BG }}
            >
              {p.body}
            </div>
            <PageFooter p={p} />
          </div>
        ))}
      </div>
    </>
  );
}
