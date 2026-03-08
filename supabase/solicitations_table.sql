-- Create the solicitations table
create table if not exists public.solicitations (
  id uuid not null default gen_random_uuid (),
  amazon_order_id text not null,
  marketplace_id text not null default 'ATVPDKIKX0DER',
  status text not null,        -- 'sent', 'already_solicited', 'ineligible', 'error'
  http_status integer,         -- raw HTTP response code from Amazon
  error_message text,
  order_date timestamp with time zone,             -- when the order was placed
  solicited_at timestamp with time zone default now(),
  constraint solicitations_pkey primary key (id),
  constraint solicitations_order_uniq unique (amazon_order_id, marketplace_id)
) TABLESPACE pg_default;

-- Enable RLS
alter table public.solicitations enable row level security;

-- Allow dashboard reads (anon key)
create policy "Enable read access for all users on solicitations"
  on public.solicitations
  as PERMISSIVE
  for SELECT
  to public
  using (true);
