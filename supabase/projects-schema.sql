create table if not exists public.projects (
  id text primary key,
  title text not null default '',
  description text not null default '',
  stack text[] not null default '{}',
  image text not null default '',
  href text,
  gallery_images text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_sort_order_idx on public.projects (sort_order asc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

alter table public.projects enable row level security;

drop policy if exists "public can read projects" on public.projects;
create policy "public can read projects"
on public.projects
for select
to anon, authenticated
using (true);

drop policy if exists "authenticated can insert projects" on public.projects;
create policy "authenticated can insert projects"
on public.projects
for insert
to authenticated
with check (true);

drop policy if exists "authenticated can update projects" on public.projects;
create policy "authenticated can update projects"
on public.projects
for update
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated can delete projects" on public.projects;
create policy "authenticated can delete projects"
on public.projects
for delete
to authenticated
using (true);
