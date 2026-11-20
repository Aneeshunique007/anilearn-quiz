-- Run this in your Supabase SQL Editor to enable cross-device cloud sync for AniLearn Quiz

create table if not exists public.quiz_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  xp integer not null default 0,
  hiragana_state jsonb,
  katakana_state jsonb,
  kanji_state jsonb,
  words_state jsonb,
  updated_at timestamptz not null default now()
);

alter table public.quiz_progress enable row level security;

create policy "Users can read own quiz progress"
  on public.quiz_progress
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own quiz progress"
  on public.quiz_progress
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own quiz progress"
  on public.quiz_progress
  for update
  using (auth.uid() = user_id);
