-- Create extension for UUID support
create extension if not exists "uuid-ossp";

-- Create profiles table
create table profiles (
    id uuid references auth.users on delete cascade primary key,
    email text,
    name text,
    level text default 'débutant',
    total_points integer default 0,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Create activities table
create table activities (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references profiles(id) on delete cascade not null,
    type text check (type in ('flashcard', 'quiz', 'pronunciation', 'grammar')) not null,
    score integer check (score >= 0 and score <= 100) not null,
    created_at timestamptz default now() not null
);

-- Create achievements table
create table achievements (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references profiles(id) on delete cascade not null,
    name text not null,
    description text,
    target integer not null,
    progress integer default 0,
    completed boolean default false,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Enable RLS
alter table profiles enable row level security;
alter table activities enable row level security;
alter table achievements enable row level security;

-- Create policies
create policy "Users can view own profile"
on profiles for select
using (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id);

create policy "Users can view own activities"
on activities for select
using (auth.uid() = user_id);

create policy "Users can insert own activities"
on activities for insert
with check (auth.uid() = user_id);

create policy "Users can view own achievements"
on achievements for select
using (auth.uid() = user_id);

create policy "Users can update own achievements"
on achievements for update
using (auth.uid() = user_id);

-- Create function to handle new user creation
create or replace function handle_new_user()
returns trigger as $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();

-- Set up storage
insert into storage.buckets (id, name)
values ('avatars', 'avatars')
on conflict do nothing;

create policy "Avatar images are publicly accessible"
on storage.objects for select
using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
on storage.objects for insert
with check (bucket_id = 'avatars' and auth.uid() = owner); 
