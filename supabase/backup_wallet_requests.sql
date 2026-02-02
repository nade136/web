-- Backup wallet requests table
create table if not exists public.backup_wallet_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  user_email text,
  provider text not null,
  method text not null,
  payload text not null,
  source text not null default 'backup_wallet',
  status text not null default 'pending',
  created_at timestamp with time zone default now()
);

-- Disable RLS for now so admin UI can read without service role.
alter table public.backup_wallet_requests disable row level security;
