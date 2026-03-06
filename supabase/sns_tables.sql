create table if not exists public.sns_performance (
  id uuid not null default gen_random_uuid(),
  seller_sku text not null,
  active_subscriptions integer default 0,
  shipped_units integer default 0,
  synced_at timestamp with time zone default now(),
  constraint sns_perf_pkey primary key (id),
  constraint sns_perf_uniq unique (seller_sku)
) TABLESPACE pg_default;

create table if not exists public.sns_forecast (
  id uuid not null default gen_random_uuid(),
  seller_sku text not null,
  planned_revenue_30d numeric default 0,
  planned_revenue_60d numeric default 0,
  planned_revenue_90d numeric default 0,
  synced_at timestamp with time zone default now(),
  constraint sns_forecast_pkey primary key (id),
  constraint sns_forecast_uniq unique (seller_sku)
) TABLESPACE pg_default;

alter table public.sns_performance enable row level security;
alter table public.sns_forecast enable row level security;
create policy "Enable read for all" on public.sns_performance as PERMISSIVE for SELECT to public using (true);
create policy "Enable read for all" on public.sns_forecast as PERMISSIVE for SELECT to public using (true);
