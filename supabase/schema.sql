-- 1. Enable Extensions
create extension if not exists "vault" with schema "vault";
create extension if not exists "pg_cron" with schema "extensions";

-- 2. Profiles Table (Extends Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- 3. Amazon Connections Table
create table if not exists public.amazon_connections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  seller_id text not null,
  marketplace_id text not null,

  -- Secrets Reference (Stored in Vault)
  sp_refresh_token_vault_id uuid,

  is_active boolean default true,
  created_at timestamp with time zone default now(),
  unique(user_id, seller_id)
);

alter table public.amazon_connections enable row level security;
create policy "Users can manage their own connections"
on public.amazon_connections for all using (auth.uid() = user_id);

-- 4. Initial Tables for Amazon Data
create table if not exists public.amazon_sales_history (
  id uuid default gen_random_uuid() primary key,
  connection_id uuid references public.amazon_connections(id) on delete cascade,
  order_id text not null,
  sku text,
  amount decimal,
  currency text,
  purchase_date timestamp with time zone,
  created_at timestamp with time zone default now()
);

alter table public.amazon_sales_history enable row level security;
create policy "Users can view data from their connections"
on public.amazon_sales_history for select
using (exists (
  select 1 from public.amazon_connections
  where id = amazon_sales_history.connection_id
  and user_id = auth.uid()
));
