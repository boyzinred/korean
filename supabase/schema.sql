-- Korean study site: the tables cloud sync and the study log need.
-- Run in Supabase → SQL Editor → New query. Every statement is safe to run
-- again, so after a change to this file run the whole file once more.
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

-- ---------------------------------------------------------------------------
-- The study log: one row per answer, written by shared-vocab/study-log.js and
-- read by the dashboard on index.html. Rows are only ever added, except that
-- "Count as correct" rewrites the answer it corrects, which is why the id is
-- made on the device and a write is an upsert.
--
--   run_id   one exercise run, from its first answer to its last
--   day      the device's own date when it was answered, so a day is the day
--            you lived, not UTC's
--   page     the page's id (the review bank's id where it has one)
--   exercise vocab, drill, comprehension, sentence, order, test, …
--   item_id  the page's id for the word or question, where it has one
--   attempt  1 for the first try at a question, 2+ for a retry of it
--   ms       time since the run's previous answer (or its first question),
--            capped so a question left open over lunch is not an hour of study
--   data     mode, direction, what was given, run type, overridden, …

create table if not exists public.study_events (
  id        uuid        primary key,
  user_id   uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  run_id    uuid        not null,
  at        timestamptz not null,
  day       date        not null,
  page      text        not null,
  exercise  text        not null,
  item_id   text,
  ko        text,
  en        text,
  correct   boolean     not null,
  attempt   smallint    not null default 1,
  ms        integer,
  data      jsonb       not null default '{}'::jsonb
);

create index if not exists study_events_user_day on public.study_events (user_id, day);
create index if not exists study_events_user_item on public.study_events (user_id, page, item_id);
create index if not exists study_events_user_run on public.study_events (user_id, run_id);

alter table public.study_events enable row level security;

drop policy if exists "own study events" on public.study_events;
create policy "own study events" on public.study_events
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- The summaries the dashboard reads, so it downloads totals rather than every
-- answer. security_invoker runs each view as the reader, so the policy above
-- still decides which rows it sees.
--
-- A question is scored on its first try: questions counts the attempt-1 rows,
-- first_right the ones of those that were right.

create or replace view public.study_daily with (security_invoker = true) as
select
  user_id,
  day,
  page,
  exercise,
  coalesce(data ->> 'mode', '')                       as mode,
  coalesce(data ->> 'dir', '')                        as dir,
  count(*) filter (where attempt = 1)                 as questions,
  count(*) filter (where attempt = 1 and correct)     as first_right,
  count(*)                                            as answers,
  coalesce(sum(ms), 0)                                as ms,
  count(distinct run_id)                              as runs
from public.study_events
group by user_id, day, page, exercise, coalesce(data ->> 'mode', ''), coalesce(data ->> 'dir', '');

create or replace view public.study_items with (security_invoker = true) as
select
  user_id,
  page,
  item_id,
  max(ko)                                             as ko,
  max(en)                                             as en,
  count(*) filter (where attempt = 1)                 as questions,
  count(*) filter (where attempt = 1 and not correct) as missed,
  max(at)                                             as last_at,
  max(at) filter (where not correct)                  as last_missed_at,
  max(at) filter (where correct)                      as last_right_at
from public.study_events
where item_id is not null
group by user_id, page, item_id;

create or replace view public.study_runs with (security_invoker = true) as
select
  user_id,
  run_id,
  page,
  exercise,
  min(at)                                             as started,
  max(at)                                             as ended,
  count(*) filter (where attempt = 1)                 as questions,
  count(*) filter (where attempt = 1 and correct)     as first_right,
  count(*)                                            as answers,
  coalesce(sum(ms), 0)                                as ms,
  max(data ->> 'mode')                                as mode,
  max(data ->> 'run')                                 as run
from public.study_events
group by user_id, run_id, page, exercise;
