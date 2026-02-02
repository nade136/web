create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  user_email text,
  title text not null,
  message text not null,
  type text not null,
  metadata jsonb default '{}'::jsonb,
  is_read boolean default false,
  created_at timestamptz default now()
);

alter table public.notifications disable row level security;
