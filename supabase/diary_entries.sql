-- Bảng nhật ký dùng chung cho trang /diary.
-- Chạy một lần trong Supabase Dashboard → SQL Editor.
-- Lưu ý: chính sách bên dưới cho phép BẤT KỲ AI vào web đều đọc, thêm, sửa, xoá được.

create table if not exists public.diary_entries (
  id text primary key,
  date date not null,
  title text not null default '',
  mood text not null default '',
  body text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.diary_entries enable row level security;

create policy "diary public read"   on public.diary_entries for select using (true);
create policy "diary public insert" on public.diary_entries for insert with check (true);
create policy "diary public update" on public.diary_entries for update using (true) with check (true);
create policy "diary public delete" on public.diary_entries for delete using (true);
