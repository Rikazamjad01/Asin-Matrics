-- Create the replenishment_metrics table
-- Fields based on confirmed Amazon Replenishment API (v2022-11-07) response
create table if not exists public.replenishment_metrics (
  id uuid not null default gen_random_uuid (),
  report_date date not null,
  marketplace_id text not null,

  -- Core performance metrics from SUBSCRIBE_AND_SAVE program
  shipped_subscription_units integer null default 0,
  total_subscriptions_revenue numeric(12, 2) null default 0,
  active_subscriptions integer null default 0,
  lost_revenue_due_to_oos numeric(12, 2) null default 0,
  not_delivered_due_to_oos integer null default 0,
  subscriber_avg_revenue numeric(12, 2) null default 0,
  subscriber_retention numeric(5, 4) null default 0,   -- e.g. 0.8500 = 85%
  currency_code text null default 'USD',

  synced_at timestamp with time zone null default now(),
  constraint replenishment_metrics_pkey primary key (id),
  constraint replenishment_metrics_date_marketplace_key unique (report_date, marketplace_id)
) TABLESPACE pg_default;

-- Enable RLS
alter table public.replenishment_metrics enable row level security;

-- Allow dashboard reads (anon key)
create policy "Enable read access for all users on replenishment_metrics"
  on public.replenishment_metrics
  as PERMISSIVE
  for SELECT
  to public
  using (true);
