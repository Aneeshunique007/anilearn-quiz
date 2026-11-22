-- Run this in your Supabase SQL Editor to enable instant Email/Password accounts & cross-device sync (no email verification needed)

create table if not exists public.quiz_accounts (
  email text primary key,
  password text not null,
  display_name text,
  xp integer not null default 0,
  hiragana_state jsonb,
  katakana_state jsonb,
  kanji_state jsonb,
  words_state jsonb,
  updated_at timestamptz not null default now()
);

alter table public.quiz_accounts enable row level security;

drop policy if exists "Allow anon read quiz_accounts" on public.quiz_accounts;
drop policy if exists "Allow anon insert quiz_accounts" on public.quiz_accounts;
drop policy if exists "Allow anon update quiz_accounts" on public.quiz_accounts;

create policy "Allow anon read quiz_accounts"
  on public.quiz_accounts
  for select
  using (true);

create policy "Allow anon insert quiz_accounts"
  on public.quiz_accounts
  for insert
  with check (true);

create policy "Allow anon update quiz_accounts"
  on public.quiz_accounts
  for update
  using (true);
