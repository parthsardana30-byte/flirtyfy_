-- Run this in your Supabase SQL Editor

-- Create matches table
create table public.matches (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  character_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, character_id)
);

-- Create messages table
create table public.messages (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  character_id text not null,
  role text not null check (role in ('user', 'model')),
  text text not null,
  timestamp bigint not null,
  reaction text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.matches enable row level security;
alter table public.messages enable row level security;

-- Create policies for matches
create policy "Users can view their own matches"
  on public.matches for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own matches"
  on public.matches for insert
  with check ( auth.uid() = user_id );

-- Create policies for messages
create policy "Users can view their own messages"
  on public.messages for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own messages"
  on public.messages for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own messages"
  on public.messages for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own messages"
  on public.messages for delete
  using ( auth.uid() = user_id );
