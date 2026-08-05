-- ============================================================
-- Legality Sekolah Tengah — Supabase schema
-- Run this in Supabase SQL Editor (Project > SQL Editor > New query)
-- ============================================================

-- Extension for UUIDs
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Profiles: links a Supabase Auth user to a role (user / admin)
-- ------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ------------------------------------------------------------
-- Schools
-- ------------------------------------------------------------
create table if not exists schools (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete set null, -- PIC who created it

  -- Step 1 (Add School)
  school_name text not null,
  pic_name text not null,
  type text not null check (type in ('A', 'B', 'C', 'New')),

  -- Step 2 (Detail view, editable)
  branch text check (branch in ('Central', 'North', 'East Coast', 'Borneo')),
  state text check (state in (
    'Johor','Kedah','Kelantan','Melaka','Negeri Sembilan','Pahang','Perak',
    'Perlis','Penang','Sabah','Sarawak','Selangor','Terengganu'
  )),
  email text,
  contact_number text,
  website text,
  tiktok text,
  instagram text,
  note text, -- "for PIC reference" small note

  -- Admin-only field
  legality_status text not null default 'Not Legal' check (
    legality_status in ('Legal w/ BnW', 'Legal w/o BnW', 'Potentially Legal', 'Not Legal')
  ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_schools_owner on schools(owner_id);

-- Keep updated_at fresh on every save
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_schools_updated_at on schools;
create trigger trg_schools_updated_at
  before update on schools
  for each row execute procedure set_updated_at();

-- ------------------------------------------------------------
-- Teachers (Teacher CRM)
-- ------------------------------------------------------------
create table if not exists teachers (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  name text not null,
  position text,
  subject text,
  phone text,
  state text,
  created_at timestamptz not null default now()
);

create index if not exists idx_teachers_school on teachers(school_id);

-- ------------------------------------------------------------
-- MOM notes (long-text minutes-of-meeting entries per school)
-- ------------------------------------------------------------
create table if not exists mom_notes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_mom_school on mom_notes(school_id);

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table profiles enable row level security;
alter table schools enable row level security;
alter table teachers enable row level security;
alter table mom_notes enable row level security;

-- Profiles: a user can read their own profile
create policy "read own profile" on profiles
  for select using (auth.uid() = id);

-- NOTE: The backend (Render API) uses the Supabase SERVICE ROLE key,
-- which bypasses RLS entirely. These policies matter only if the
-- frontend ever talks to Supabase directly. Since this project's
-- frontend calls the Render backend (not Supabase directly), the
-- backend is responsible for enforcing who can see/edit what
-- (see backend/middleware/auth.js).

create policy "users manage own schools" on schools
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "users manage own teachers" on teachers
  for all using (
    exists (select 1 from schools s where s.id = school_id and s.owner_id = auth.uid())
  );

create policy "users manage own mom notes" on mom_notes
  for all using (
    exists (select 1 from schools s where s.id = school_id and s.owner_id = auth.uid())
  );
