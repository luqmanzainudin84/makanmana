-- ============================================
-- MakanMana? — Supabase Schema untuk Group Mode
-- Jalankan ni dalam Supabase Dashboard > SQL Editor
-- ============================================

-- Sessions: satu group voting session
create table sessions (
  id text primary key,                -- room code, e.g. "482913"
  status text not null default 'lobby', -- lobby | voting | revealed
  food_pool jsonb not null,           -- snapshot senarai makanan untuk session ni
  host_name text not null,
  created_at timestamptz not null default now()
);

-- Members: ahli dalam satu session
create table members (
  id uuid primary key default gen_random_uuid(),
  session_id text not null references sessions(id) on delete cascade,
  name text not null,
  has_voted boolean not null default false,
  vote_choice text,                   -- food.id yang dia vote
  has_vetoed boolean not null default false,
  joined_at timestamptz not null default now()
);

-- Group History: untuk elak ulang makanan dalam group (2 minggu)
-- group_key = hash ringkas dari host_name + member names supaya group sama leh dikenali
create table group_history (
  id uuid primary key default gen_random_uuid(),
  group_key text not null,
  food_id text not null,
  food_name text not null,
  date_won date not null default current_date
);

-- Index untuk query laju
create index idx_members_session on members(session_id);
create index idx_group_history_key on group_history(group_key);

-- Enable Realtime untuk table yang perlu live update
alter publication supabase_realtime add table members;
alter publication supabase_realtime add table sessions;

-- Row Level Security — untuk MVP kita buka akses publik penuh
-- (tiada auth user lagi, semua guna anon key)
alter table sessions enable row level security;
alter table members enable row level security;
alter table group_history enable row level security;

create policy "Public full access sessions" on sessions for all using (true) with check (true);
create policy "Public full access members" on members for all using (true) with check (true);
create policy "Public full access group_history" on group_history for all using (true) with check (true);

-- Nota: policy "public full access" ni sesuai untuk MVP/testing dengan kawan-kawan.
-- Bila nak production proper, perlu refine RLS supaya lebih secure (cth host-only delete).
