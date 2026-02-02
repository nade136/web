-- Deposit tokens managed by admin
create table if not exists public.deposit_tokens (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  symbol text not null unique,
  price text not null default '$0.00',
  networks text[] not null default '{}',
  addresses jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamp with time zone default now()
);

-- Disable RLS for now so admin UI can manage without service role.
alter table public.deposit_tokens disable row level security;
