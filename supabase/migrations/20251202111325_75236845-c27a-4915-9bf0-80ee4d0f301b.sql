-- Create orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address text not null,
  city text not null,
  state text not null,
  pincode text not null,
  total_amount numeric(10,2) not null,
  status text not null default 'pending',
  items jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.orders enable row level security;

-- Policies for users
create policy "Users can view their own orders"
  on public.orders
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their own orders"
  on public.orders
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Policies for admins
create policy "Admins can view all orders"
  on public.orders
  for select
  to authenticated
  using (is_admin(auth.uid()));

create policy "Admins can update orders"
  on public.orders
  for update
  to authenticated
  using (is_admin(auth.uid()));

create policy "Admins can delete orders"
  on public.orders
  for delete
  to authenticated
  using (is_admin(auth.uid()));

-- Create index for faster queries
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

-- Trigger for updated_at
create trigger handle_orders_updated_at
  before update on public.orders
  for each row
  execute procedure public.handle_updated_at();