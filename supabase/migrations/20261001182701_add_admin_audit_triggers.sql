create schema if not exists private;

create or replace function private.audit_admin_mutation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid;
  entity uuid;
  details jsonb;
begin
  actor := auth.uid();
  entity := case when tg_op = 'DELETE' then old.id else new.id end;
  details := jsonb_build_object(
    'operation', lower(tg_op),
    'old', case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) else null end,
    'new', case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) else null end
  );
  insert into public.audit_logs(actor_id, entity_type, entity_id, action, details)
  values (actor, tg_table_name, entity, lower(tg_op), details);
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

revoke all on function private.audit_admin_mutation() from public, anon, authenticated;

drop trigger if exists audit_leads on public.leads;
create trigger audit_leads after insert or update or delete on public.leads for each row execute function private.audit_admin_mutation();
drop trigger if exists audit_clients on public.clients;
create trigger audit_clients after insert or update or delete on public.clients for each row execute function private.audit_admin_mutation();
drop trigger if exists audit_suppliers on public.suppliers;
create trigger audit_suppliers after insert or update or delete on public.suppliers for each row execute function private.audit_admin_mutation();
drop trigger if exists audit_experiences on public.experiences;
create trigger audit_experiences after insert or update or delete on public.experiences for each row execute function private.audit_admin_mutation();
drop trigger if exists audit_quotes on public.quotes;
create trigger audit_quotes after insert or update or delete on public.quotes for each row execute function private.audit_admin_mutation();
drop trigger if exists audit_quote_items on public.quote_items;
create trigger audit_quote_items after insert or update or delete on public.quote_items for each row execute function private.audit_admin_mutation();
drop trigger if exists audit_reservations on public.reservations;
create trigger audit_reservations after insert or update or delete on public.reservations for each row execute function private.audit_admin_mutation();
drop trigger if exists audit_payments on public.payments;
create trigger audit_payments after insert or update or delete on public.payments for each row execute function private.audit_admin_mutation();
drop trigger if exists audit_operations on public.operations;
create trigger audit_operations after insert or update or delete on public.operations for each row execute function private.audit_admin_mutation();
drop trigger if exists audit_profiles on public.profiles;
create trigger audit_profiles after insert or update or delete on public.profiles for each row execute function private.audit_admin_mutation();