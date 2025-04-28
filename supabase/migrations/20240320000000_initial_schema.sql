/* sqlfluff:disable
  Initial Schema for MindFluent App

  Tables:
  1. activities - Tracks user learning activities
  2. achievements - Stores user achievements and badges
*/

-- Create activities table
create table if not exists activities (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    activity_type text not null,
    content jsonb not null default '{}'::jsonb,
    score integer default 0,
    duration interval,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create achievements table
create table if not exists achievements (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    achievement_type text not null,
    title text not null,
    description text,
    earned_at timestamptz default now(),
    metadata jsonb default '{}'::jsonb
);

-- Enable RLS on activities
alter table activities enable row level security;

-- Enable RLS on achievements
alter table achievements enable row level security;

-- Create policies for activities
create policy "Users can read own activities"
on activities
for select
using (auth.uid() = user_id);

create policy "Users can insert own activities"
on activities
for insert
with check (auth.uid() = user_id);

-- Create policies for achievements
create policy "Users can read own achievements"
on achievements
for select
using (auth.uid() = user_id);

create policy "Users can insert own achievements"
on achievements
for insert
with check (auth.uid() = user_id);

-- Create function to update timestamp
create or replace function update_updated_at_column()
returns trigger as $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language plpgsql;

-- Create trigger for updating timestamp on activities
create trigger update_activities_updated_at
before update on activities
for each row
execute function update_updated_at_column(); 
