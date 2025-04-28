/* sqlfluff:disable
  Profiles Schema for MindFluent App
  
  This migration adds the profiles table and related security policies
*/

-- Create profiles table
create table if not exists profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    username text unique,
    full_name text,
    avatar_url text,
    language_preferences jsonb default '{"learning": [], "native": []}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    constraint username_length check (char_length(username) >= 3)
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
on profiles for select
using (true);

create policy "Users can insert their own profile"
on profiles for insert
with check (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Create function to handle updated_at
create or replace function handle_updated_at()
returns trigger as $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger on_profiles_updated
before update on profiles
for each row
execute function handle_updated_at();
