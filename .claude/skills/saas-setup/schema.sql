-- ============================================================
-- SaaS Setup: Supabase Schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. PROFILES TABLE
-- Stores user profile data and subscription status.
-- Linked to auth.users via id (UUID).
-- ============================================================

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  subscription_status text not null default 'free' check (subscription_status in ('free', 'pro')),
  lemonsqueezy_customer_id text,
  lemonsqueezy_subscription_id text,
  subscription_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile (but NOT subscription fields)
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No insert policy for users -- profile is created by the trigger below
-- No delete policy -- users cannot delete their own profile

-- ============================================================
-- 2. WEBHOOK EVENTS TABLE
-- Tracks processed webhook events for idempotency.
-- Only accessible via service role (no user-facing RLS policy).
-- ============================================================

create table if not exists public.webhook_events (
  id bigint generated always as identity primary key,
  event_id text unique not null,
  event_name text not null,
  payload jsonb,
  processed_at timestamptz not null default now()
);

-- Enable RLS but add NO user policies (service role only)
alter table public.webhook_events enable row level security;

-- ============================================================
-- 3. AUTO-CREATE PROFILE ON SIGNUP
-- Trigger that creates a profiles row whenever a new user signs up.
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  );
  return new;
end;
$$;

-- Drop existing trigger if it exists (safe re-run)
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 4. UPDATED_AT AUTO-UPDATE
-- Keeps the updated_at column current on profile changes.
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_profiles_updated on public.profiles;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- 5. INDEXES
-- ============================================================

create index if not exists idx_profiles_subscription_status
  on public.profiles (subscription_status);

create index if not exists idx_webhook_events_event_id
  on public.webhook_events (event_id);

-- ============================================================
-- DONE. Verify by running:
--   select * from public.profiles limit 1;
--   select * from public.webhook_events limit 1;
-- ============================================================
