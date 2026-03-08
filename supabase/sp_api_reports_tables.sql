-- Sales & Traffic Report Table
-- Stores data from GET_SALES_AND_TRAFFIC_REPORT (by ASIN, by date)
create table if not exists public.sales_traffic_report (
  id uuid default gen_random_uuid() primary key,
  report_date date not null,
  asin text not null,
  parent_asin text,
  -- Traffic
  sessions integer default 0,
  session_percentage numeric(6,2) default 0,
  page_views integer default 0,
  page_views_percentage numeric(6,2) default 0,
  buy_box_percentage numeric(6,2) default 0,
  -- Sales
  units_ordered integer default 0,
  units_ordered_b2b integer default 0,
  ordered_product_sales numeric(12,2) default 0,
  ordered_product_sales_b2b numeric(12,2) default 0,
  total_order_items integer default 0,
  total_order_items_b2b integer default 0,
  -- Conversion
  unit_session_percentage numeric(6,2) default 0,
  unit_session_percentage_b2b numeric(6,2) default 0,
  -- Meta
  synced_at timestamp with time zone default now(),

  unique(report_date, asin)
);

-- RLS: Allow authenticated users to read
alter table public.sales_traffic_report enable row level security;
create policy "Authenticated users can read sales traffic"
on public.sales_traffic_report for select
to authenticated
using (true);

-- FBA Inventory Detail Table (GET_FBA_MYI_ALL_INVENTORY_DATA)
create table if not exists public.fba_inventory_detail (
  id uuid default gen_random_uuid() primary key,
  sku text not null,
  fn_sku text,
  asin text,
  product_name text,
  product_condition text,
  your_price numeric(10,2),
  mfn_listing_exists text,
  mfn_fulfillable_quantity integer default 0,
  afn_listing_exists text,
  afn_warehouse_quantity integer default 0,
  afn_fulfillable_quantity integer default 0,
  afn_unsellable_quantity integer default 0,
  afn_reserved_quantity integer default 0,
  afn_total_quantity integer default 0,
  per_unit_volume numeric(10,4),
  afn_inbound_working_quantity integer default 0,
  afn_inbound_shipped_quantity integer default 0,
  afn_inbound_receiving_quantity integer default 0,
  afn_researching_quantity integer default 0,
  afn_reserved_future_supply integer default 0,
  afn_future_supply_buyable integer default 0,
  synced_at timestamp with time zone default now(),

  unique(sku)
);

alter table public.fba_inventory_detail enable row level security;
create policy "Authenticated users can read fba inventory detail"
on public.fba_inventory_detail for select
to authenticated
using (true);

-- FBA Inventory Planning Table (GET_FBA_INVENTORY_PLANNING_DATA)
create table if not exists public.fba_inventory_planning (
  id uuid default gen_random_uuid() primary key,
  snapshot_date date,
  sku text not null,
  fn_sku text,
  asin text,
  product_name text,
  product_condition text,
  available integer default 0,
  pending_removal_quantity integer default 0,
  inv_age_0_to_90_days integer default 0,
  inv_age_91_to_180_days integer default 0,
  inv_age_181_to_270_days integer default 0,
  inv_age_271_to_365_days integer default 0,
  inv_age_365_plus_days integer default 0,
  qty_to_be_charged_ltsf_6_mo integer default 0,
  qty_to_be_charged_ltsf_12_mo integer default 0,
  estimated_ltsf_next_charge numeric(10,2),
  weeks_of_cover_t7 numeric(6,1),
  weeks_of_cover_t30 numeric(6,1),
  weeks_of_cover_t60 numeric(6,1),
  weeks_of_cover_t90 numeric(6,1),
  units_shipped_t7 integer default 0,
  units_shipped_t30 integer default 0,
  units_shipped_t60 integer default 0,
  units_shipped_t90 integer default 0,
  recommended_action text,
  recommended_removal_quantity integer default 0,
  synced_at timestamp with time zone default now(),

  unique(sku)
);

alter table public.fba_inventory_planning enable row level security;
create policy "Authenticated users can read fba inventory planning"
on public.fba_inventory_planning for select
to authenticated
using (true);

-- Brand Analytics Search Terms Table (GET_BRAND_ANALYTICS_SEARCH_TERMS_REPORT)
create table if not exists public.brand_search_terms (
  id uuid default gen_random_uuid() primary key,
  report_date date not null,
  search_term text not null,
  search_frequency_rank integer,
  -- Top 3 clicked ASINs
  asin_1 text,
  click_share_1 numeric(6,2),
  conversion_share_1 numeric(6,2),
  asin_2 text,
  click_share_2 numeric(6,2),
  conversion_share_2 numeric(6,2),
  asin_3 text,
  click_share_3 numeric(6,2),
  conversion_share_3 numeric(6,2),
  synced_at timestamp with time zone default now(),

  unique(report_date, search_term)
);

alter table public.brand_search_terms enable row level security;
create policy "Authenticated users can read brand search terms"
on public.brand_search_terms for select
to authenticated
using (true);
