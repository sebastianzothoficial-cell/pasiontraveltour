create table if not exists public.ai_runs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  mode text not null check (mode in ('analyze','quote')),
  prompt text not null,
  output text,
  model text,
  status text not null default 'completed' check (status in ('completed','error')),
  created_at timestamptz not null default now()
);
alter table public.ai_runs enable row level security;
drop policy if exists "staff_read_ai_runs" on public.ai_runs;
drop policy if exists "staff_insert_ai_runs" on public.ai_runs;
create policy "staff_read_ai_runs" on public.ai_runs for select using (public.is_staff());
create policy "staff_insert_ai_runs" on public.ai_runs for insert with check (public.is_staff() and actor_id = auth.uid());
grant select, insert on public.ai_runs to authenticated;