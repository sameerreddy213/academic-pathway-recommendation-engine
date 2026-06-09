-- Run this in Supabase SQL editor
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  qualification text not null,
  experience text not null,
  profession text not null,
  career_goal text not null,
  recommendation text not null,
  recommendation_reason text not null,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (optional but recommended)
alter table submissions enable row level security;

-- Allow anonymous inserts and reads (no auth required per spec)
create policy "Allow anonymous inserts"
  on submissions for insert
  with check (true);

create policy "Allow anonymous selects"
  on submissions for select
  using (true);
