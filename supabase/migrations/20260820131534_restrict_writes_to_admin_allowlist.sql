-- Write access was granted to the `authenticated` role, which is every signed-in
-- user. Supabase allows public sign-ups by default, so a stranger could have
-- registered and edited the site. Writes now require membership of an explicit
-- allowlist instead, which holds regardless of the sign-up setting.

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Members may see the roster; nobody may change it through the API. Adding an
-- administrator is a deliberate act performed against the database.
create policy "admins read the roster"
  on public.admins for select
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_admin() from public, anon, authenticated;

-- Seed the roster with the account created for the site owner.
insert into public.admins (user_id, email)
select id, email from auth.users where email = 'admin@globalex.uz'
on conflict (user_id) do nothing;

-- Re-point every write policy at the allowlist.
drop policy if exists "admins write categories" on public.categories;
create policy "admins write categories" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins write certificates" on public.certificates;
create policy "admins write certificates" on public.certificates
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins write media" on public.media;
create policy "admins write media" on public.media
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins write news" on public.news;
create policy "admins write news" on public.news
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins write products" on public.products;
create policy "admins write products" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins write team" on public.team_members;
create policy "admins write team" on public.team_members
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Unpublished rows are drafts: only an administrator should see them.
drop policy if exists "public reads published categories" on public.categories;
create policy "public reads published categories" on public.categories
  for select to anon, authenticated using (is_published or public.is_admin());

drop policy if exists "public reads published certificates" on public.certificates;
create policy "public reads published certificates" on public.certificates
  for select to anon, authenticated using (is_published or public.is_admin());

drop policy if exists "public reads published news" on public.news;
create policy "public reads published news" on public.news
  for select to anon, authenticated using (is_published or public.is_admin());

drop policy if exists "public reads published products" on public.products;
create policy "public reads published products" on public.products
  for select to anon, authenticated using (is_published or public.is_admin());

drop policy if exists "public reads published team" on public.team_members;
create policy "public reads published team" on public.team_members
  for select to anon, authenticated using (is_published or public.is_admin());

-- Storage: uploading and deleting files is likewise allowlist-only.
drop policy if exists "admins upload media files" on storage.objects;
create policy "admins upload media files" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admins update media files" on storage.objects;
create policy "admins update media files" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admins delete media files" on storage.objects;
create policy "admins delete media files" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
