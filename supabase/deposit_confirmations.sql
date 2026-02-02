-- User deposit confirmations for admin review
create table if not exists public.deposit_confirmations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  user_email text,
  token_symbol text not null,
  network text not null,
  address text not null,
  status text not null default 'pending',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Disable RLS for now so admin UI can manage without service role.
alter table public.deposit_confirmations disable row level security;
