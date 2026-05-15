-- ============================================================
-- ZYX Platform — Supabase Schema
-- Run this in your Supabase SQL Editor (supabase.com/dashboard)
-- ============================================================

-- Profiles (auto-created on signup)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text default 'member' check (role in ('admin', 'member', 'viewer')),
  department text,
  phone text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view all profiles" on public.profiles
  for select using (auth.role() = 'authenticated');

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    case when (select count(*) from public.profiles) = 0 then 'admin' else 'member' end
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Team invitations
create table if not exists public.invitations (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  role text default 'member',
  invited_by uuid references public.profiles(id) on delete cascade,
  status text default 'pending' check (status in ('pending', 'accepted', 'expired')),
  token text unique default encode(gen_random_bytes(32), 'hex'),
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '7 days')
);

alter table public.invitations enable row level security;

create policy "Admins can manage invitations" on public.invitations
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Anyone can read own invitation" on public.invitations
  for select using (email = (select email from public.profiles where id = auth.uid()));

-- Tasks
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  status text default 'todo' check (status in ('todo', 'in_progress', 'review', 'done')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  assignee_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete cascade,
  due_date date,
  tags text[] default '{}',
  list_id uuid,
  position integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.tasks enable row level security;

create policy "Authenticated users can manage tasks" on public.tasks
  for all using (auth.role() = 'authenticated');

-- Task Lists
create table if not exists public.task_lists (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  color text default '#3b82f6',
  created_by uuid references public.profiles(id) on delete cascade,
  position integer default 0,
  created_at timestamptz default now()
);

alter table public.task_lists enable row level security;

create policy "Authenticated users can manage task lists" on public.task_lists
  for all using (auth.role() = 'authenticated');

-- Planning items
create table if not exists public.planning_items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  type text default 'feature' check (type in ('feature', 'bug', 'milestone', 'idea', 'campaign')),
  status text default 'backlog' check (status in ('backlog', 'planned', 'in_progress', 'completed', 'cancelled')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  quarter text,
  start_date date,
  end_date date,
  owner_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete cascade,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.planning_items enable row level security;

create policy "Authenticated users can manage planning" on public.planning_items
  for all using (auth.role() = 'authenticated');

-- Documents
create table if not exists public.documents (
  id uuid default gen_random_uuid() primary key,
  title text not null default 'Sin título',
  content text default '',
  emoji text default '📄',
  created_by uuid references public.profiles(id) on delete cascade,
  last_edited_by uuid references public.profiles(id) on delete set null,
  is_public boolean default false,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.documents enable row level security;

create policy "Authenticated users can manage documents" on public.documents
  for all using (auth.role() = 'authenticated');

-- Events / Calendar
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  type text default 'event',
  color text default '#3b82f6',
  date date not null,
  end_date date,
  all_day boolean default true,
  created_by uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now()
);

alter table public.events enable row level security;

create policy "Authenticated users can manage events" on public.events
  for all using (auth.role() = 'authenticated');

-- Seed default task lists
insert into public.task_lists (name, color, position) values
  ('Por Hacer', '#6b7280', 0),
  ('En Progreso', '#3b82f6', 1),
  ('En Revisión', '#f59e0b', 2),
  ('Completado', '#22c55e', 3)
on conflict do nothing;
