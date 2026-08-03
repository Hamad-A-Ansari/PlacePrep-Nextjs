-- PlacePrep: Supabase schema migration
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- on the SAME project used by Switch FAANG.
--
-- Safety: this file ONLY creates two new tables (interviews, interview_feedback)
-- plus their indexes/policies. It does not touch, alter, or drop any existing
-- tables (recruiters, email_templates, etc.). Safe to run alongside them.
--
-- Auth: user identity comes from Supabase Auth's built-in `auth.users` table
-- (populated automatically by Google OAuth) — no separate `users` table is
-- created, mirroring the fact that Google gives us name/email/avatar already.

-- ---------------------------------------------------------------------------
-- interviews
-- ---------------------------------------------------------------------------
create table if not exists public.interviews (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  role         text not null,
  level        text not null,
  type         text not null,
  techstack    text[] not null default '{}',
  questions    text[] not null default '{}',
  finalized    boolean not null default false,
  cover_image  text,
  created_at   timestamptz not null default now()
);

create index if not exists interviews_user_id_idx on public.interviews (user_id);
create index if not exists interviews_created_at_idx on public.interviews (created_at desc);
create index if not exists interviews_finalized_idx on public.interviews (finalized);

alter table public.interviews enable row level security;

-- Users can see their own interviews (any state) OR anyone's finalized
-- interviews (mirrors the old getLatestInterviews / getInterviewsByUserId split).
drop policy if exists "interviews_select" on public.interviews;
create policy "interviews_select" on public.interviews
  for select
  using (auth.uid() = user_id or finalized = true);

-- Users can only insert interviews attributed to themselves.
-- (The /api/vapi/generate route uses the service role key, which bypasses
-- RLS entirely, so this policy governs client-side inserts only.)
drop policy if exists "interviews_insert" on public.interviews;
create policy "interviews_insert" on public.interviews
  for insert
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- interview_feedback
-- ---------------------------------------------------------------------------
create table if not exists public.interview_feedback (
  id                     uuid primary key default gen_random_uuid(),
  interview_id           uuid not null references public.interviews (id) on delete cascade,
  user_id                uuid not null references auth.users (id) on delete cascade,
  total_score            integer not null,
  category_scores        jsonb not null default '[]'::jsonb,
  strengths              text[] not null default '{}',
  areas_for_improvement  text[] not null default '{}',
  final_assessment       text,
  created_at             timestamptz not null default now(),
  -- one feedback row per (interview, user) - matches the old
  -- getFeedbackByInterviewId query which always used .limit(1)
  unique (interview_id, user_id)
);

create index if not exists interview_feedback_interview_id_idx on public.interview_feedback (interview_id);
create index if not exists interview_feedback_user_id_idx on public.interview_feedback (user_id);

alter table public.interview_feedback enable row level security;

drop policy if exists "interview_feedback_select" on public.interview_feedback;
create policy "interview_feedback_select" on public.interview_feedback
  for select
  using (auth.uid() = user_id);

drop policy if exists "interview_feedback_insert" on public.interview_feedback;
create policy "interview_feedback_insert" on public.interview_feedback
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "interview_feedback_update" on public.interview_feedback;
create policy "interview_feedback_update" on public.interview_feedback
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
