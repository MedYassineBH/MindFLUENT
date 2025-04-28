/* sqlfluff:disable */
-- Create progress tracking tables
create table if not exists user_progress (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    activity_type text not null,
    total_time_spent interval default '0'::interval,
    total_activities_completed integer default 0,
    average_score numeric(5,2) default 0.0,
    last_activity_date timestamptz default now(),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable RLS
alter table user_progress enable row level security;

-- Create policies
create policy "Users can view own progress"
on user_progress for select
using (auth.uid() = user_id);

create policy "Users can update own progress"
on user_progress for update
using (auth.uid() = user_id);

-- Create update trigger
create or replace function update_updated_at_timestamp()
returns trigger as $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language plpgsql;

create trigger update_user_progress_timestamp
before update on user_progress
for each row
execute function update_updated_at_timestamp(); 
