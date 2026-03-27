-- Trip roster: track who is going on each trip
create table if not exists public.trip_roster (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  team_member_id uuid not null references public.team_members(id) on delete cascade,
  status text not null default 'invited' check (status in ('invited', 'going', 'not_going', 'maybe')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (trip_id, team_member_id)
);

-- RLS
alter table public.trip_roster enable row level security;

create policy "Team members can view trip roster"
  on public.trip_roster for select
  using (
    exists (
      select 1 from public.team_members tm
      join public.trips t on t.id = trip_roster.trip_id
      where tm.team_id = t.team_id
        and tm.user_id = auth.uid()
    )
  );

create policy "Team managers can manage trip roster"
  on public.trip_roster for all
  using (
    exists (
      select 1 from public.team_members tm
      join public.trips t on t.id = trip_roster.trip_id
      where tm.team_id = t.team_id
        and tm.user_id = auth.uid()
        and tm.role in ('manager', 'coach', 'admin')
    )
  );

-- Auto-update updated_at
create or replace function public.set_trip_roster_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trip_roster_updated_at
  before update on public.trip_roster
  for each row execute function public.set_trip_roster_updated_at();
