-- KYC submissions for admin review
create table if not exists public.kyc_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  user_email text,
  status text not null default 'pending',
  rejection_reason text,
  payload jsonb not null default '{}'::jsonb,
  documents jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  verified_at timestamp with time zone
);

-- Disable RLS for now so admin UI can manage without service role.
alter table public.kyc_requests disable row level security;
