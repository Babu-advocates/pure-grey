-- Create cart_items table
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id text not null,
  name text not null,
  price text not null,
  image text,
  quantity integer not null default 1,
  unit text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

-- Enable RLS
alter table public.cart_items enable row level security;

-- Create policies
create policy "Users can view their own cart items"
  on public.cart_items
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own cart items"
  on public.cart_items
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own cart items"
  on public.cart_items
  for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own cart items"
  on public.cart_items
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists cart_items_user_id_idx on public.cart_items(user_id);

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
drop trigger if exists handle_cart_items_updated_at on public.cart_items;
create trigger handle_cart_items_updated_at
  before update on public.cart_items
  for each row
  execute procedure public.handle_updated_at();