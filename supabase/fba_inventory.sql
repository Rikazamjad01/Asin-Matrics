-- FBA Inventory Table
-- Stores synced inventory data from Amazon SP-API
create table if not exists public.fba_inventory (
  id uuid default gen_random_uuid() primary key,
  asin text not null,
  fn_sku text,
  seller_sku text,
  product_name text,
  condition text,
  total_quantity integer default 0,
  last_updated_time timestamp with time zone,
  synced_at timestamp with time zone default now(),

  unique(asin, seller_sku)
);

-- RLS: Allow authenticated users to read inventory
alter table public.fba_inventory enable row level security;
create policy "Authenticated users can read inventory"
on public.fba_inventory for select
to authenticated
using (true);
