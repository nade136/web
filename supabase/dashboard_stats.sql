-- Dashboard summary stats editable by admin
create table if not exists public.dashboard_stats (
  id uuid primary key default gen_random_uuid(),
  wallet_overview_amount text not null default '$0',
  wallet_overview_subtext text not null default '~0.00000000 BTC',
  overview_total_balance text not null default '$0',
  overview_change text not null default '+0.0%',
  overview_assets text not null default '0',
  overview_risk_level text not null default 'Medium',
  updated_at timestamp with time zone default now()
);

-- Disable RLS for now so admin UI can manage without service role.
alter table public.dashboard_stats disable row level security;
