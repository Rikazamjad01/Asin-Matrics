create table if not exists public.financial_events (
  id uuid not null default gen_random_uuid(),
  transaction_id text not null,
  amazon_order_id text,
  posted_date timestamp with time zone not null,
  transaction_type text not null,      -- 'Shipment', 'Refund', etc.
  seller_sku text,
  currency text default 'USD',
  revenue numeric default 0,     -- Product charge
  fees numeric default 0,        -- Amazon referral and FBA fulfillment fees
  constraint financial_events_pkey primary key (id),
  constraint financial_events_uniq unique (transaction_id)
) TABLESPACE pg_default;

alter table public.financial_events enable row level security;
create policy "Enable read for all" on public.financial_events as PERMISSIVE for SELECT to public using (true);
