-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Focus Areas
create table focus_areas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  color text,
  created_at timestamptz default now()
);

-- Goals
create table goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  focus_area_id uuid references focus_areas,
  title text not null,
  description text,
  status text check (status in ('active', 'on_hold', 'archived')),
  created_at timestamptz default now()
);

-- Daily Check-ins
create table daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  date date not null,
  mood int,
  energy int,
  brain_dump text,
  ai_summary text,
  created_at timestamptz default now()
);

-- Daily Priorities
create table daily_priorities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  checkin_id uuid references daily_checkins,
  title text not null,
  focus_area_id uuid references focus_areas,
  is_completed boolean default false,
  created_at timestamptz default now()
);

-- Focus Blocks
create table focus_blocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  started_at timestamptz,
  ended_at timestamptz,
  focus_area_id uuid references focus_areas,
  mode text check (mode in ('deep', 'admin', 'recovery', 'distraction')),
  notes text
);

-- Daily Reviews
create table daily_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  date date not null,
  wins text,
  obstacles text,
  ai_summary text,
  ai_tomorrow_suggestion text,
  created_at timestamptz default now()
);

-- Weekly Summaries
create table weekly_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  week_start_date date not null,
  data_snapshot jsonb,
  ai_insights text,
  ai_experiments text,
  created_at timestamptz default now()
);

-- Weekly Experiments
create table weekly_experiments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  week_start_date date not null,
  description text,
  status text check (status in ('planned', 'active', 'completed', 'dropped')),
  created_at timestamptz default now()
);

-- RLS Policies (Basic)
alter table focus_areas enable row level security;
create policy "Users can manage their own focus areas" on focus_areas for all using (auth.uid() = user_id);

alter table goals enable row level security;
create policy "Users can manage their own goals" on goals for all using (auth.uid() = user_id);

alter table daily_checkins enable row level security;
create policy "Users can manage their own checkins" on daily_checkins for all using (auth.uid() = user_id);

alter table daily_priorities enable row level security;
create policy "Users can manage their own priorities" on daily_priorities for all using (auth.uid() = user_id);

alter table focus_blocks enable row level security;
create policy "Users can manage their own focus blocks" on focus_blocks for all using (auth.uid() = user_id);

alter table daily_reviews enable row level security;
create policy "Users can manage their own reviews" on daily_reviews for all using (auth.uid() = user_id);

alter table weekly_summaries enable row level security;
create policy "Users can manage their own summaries" on weekly_summaries for all using (auth.uid() = user_id);

alter table weekly_experiments enable row level security;
create policy "Users can manage their own experiments" on weekly_experiments for all using (auth.uid() = user_id);
