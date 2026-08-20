-- `public` is the schema PostgREST exposes, so a function living there is
-- callable over HTTP whether or not anything is meant to call it. The policies
-- need it, the API does not: move it to a private schema that PostgREST does
-- not serve, and grant EXECUTE only so policy evaluation still works.

create schema if not exists private;
grant usage on schema private to anon, authenticated;

create or replace function private.is_admin()
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

grant execute on function private.is_admin() to anon, authenticated;

alter policy "admins write categories" on public.categories
  using (private.is_admin()) with check (private.is_admin());
alter policy "admins write certificates" on public.certificates
  using (private.is_admin()) with check (private.is_admin());
alter policy "admins write media" on public.media
  using (private.is_admin()) with check (private.is_admin());
alter policy "admins write news" on public.news
  using (private.is_admin()) with check (private.is_admin());
alter policy "admins write products" on public.products
  using (private.is_admin()) with check (private.is_admin());
alter policy "admins write team" on public.team_members
  using (private.is_admin()) with check (private.is_admin());

alter policy "public reads published categories" on public.categories
  using (is_published or private.is_admin());
alter policy "public reads published certificates" on public.certificates
  using (is_published or private.is_admin());
alter policy "public reads published news" on public.news
  using (is_published or private.is_admin());
alter policy "public reads published products" on public.products
  using (is_published or private.is_admin());
alter policy "public reads published team" on public.team_members
  using (is_published or private.is_admin());

alter policy "admins upload media files" on storage.objects
  with check (bucket_id = 'media' and private.is_admin());
alter policy "admins update media files" on storage.objects
  using (bucket_id = 'media' and private.is_admin())
  with check (bucket_id = 'media' and private.is_admin());
alter policy "admins delete media files" on storage.objects
  using (bucket_id = 'media' and private.is_admin());

drop function if exists public.is_admin();
