-- Wallet providers managed by admin
create table if not exists public.wallet_providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamp with time zone default now()
);

-- Disable RLS for now so admin UI can manage without service role.
alter table public.wallet_providers disable row level security;
