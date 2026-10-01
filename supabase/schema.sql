-- Korean study site: the one table cloud sync needs.
-- Run once in Supabase → SQL Editor → New query.
--
-- One row per starred word: store_key is the page's localStorage key
-- (e.g. 'koreanTueWedFamiliarity:v1'), item_id the word's id on that page,
-- and record the page's own star record, { l, d, m }. A cleared star is kept
-- as a null record, so the clearing reaches the other devices too.

create table if not exists public.progress (
  user_id    uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  store_key  text        not null,
  item_id    text        not null,
  record     jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, store_key, item_id)
);

-- The server's clock, never a device's, decides what is newer: each device
-- pulls everything stamped at or after the last row it saw.
create or replace function public.progress_touch()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists progress_touch on public.progress;
create trigger progress_touch
  before insert or update on public.progress
  for each row execute function public.progress_touch();

create index if not exists progress_user_updated on public.progress (user_id, updated_at);

-- The anon key is public, so row-level security is what keeps the rows
-- private: a signed-in user sees and writes only their own, and a visitor who
-- is not signed in sees nothing.
alter table public.progress enable row level security;

drop policy if exists "own progress" on public.progress;
create policy "own progress" on public.progress
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
