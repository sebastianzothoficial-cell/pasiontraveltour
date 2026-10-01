create table if not exists public.ai_travel_requests (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new','contacted','quoted','won','lost')),
  intent_level text not null default 'SOLICITUD DE COTIZACIÓN' check (intent_level in ('EXPLORACIÓN','INTERÉS','ALTA INTENCIÓN','SOLICITUD DE COTIZACIÓN')),
  name text,
  country text,
  language text not null default 'es',
  whatsapp text,
  email text,
  travelers integer,
  adults integer,
  minors integer,
  travel_dates text,
  duration text,
  arrival_airport text,
  departure_airport text,
  flight_times text,
  hotel text,
  hotel_zone text,
  trip_reason text,
  interests jsonb not null default '[]'::jsonb,
  preferences jsonb not null default '[]'::jsonb,
  restrictions jsonb not null default '[]'::jsonb,
  pace text,
  budget text,
  services_requested jsonb not null default '[]'::jsonb,
  observations text,
  conversation_summary text,
  conversation jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb
);

alter table public.ai_travel_requests enable row level security;
drop policy if exists "staff_read_ai_travel_requests" on public.ai_travel_requests;
create policy "staff_read_ai_travel_requests"
  on public.ai_travel_requests for select
  using (public.is_staff());

grant select on public.ai_travel_requests to authenticated;

create index if not exists ai_travel_requests_created_at_idx on public.ai_travel_requests(created_at desc);
create index if not exists ai_travel_requests_session_id_idx on public.ai_travel_requests(session_id);
