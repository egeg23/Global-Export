-- Anonymous visitors read published rows only; every write requires a signed-in
-- admin. The site itself never uses a service-role key.

alter table public.media enable row level security;
alter table public.news enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.certificates enable row level security;
alter table public.team_members enable row level security;

create policy "public reads published news"
  on public.news for select to anon, authenticated
  using (is_published or (select auth.uid()) is not null);

create policy "public reads published categories"
  on public.categories for select to anon, authenticated
  using (is_published or (select auth.uid()) is not null);

create policy "public reads published products"
  on public.products for select to anon, authenticated
  using (is_published or (select auth.uid()) is not null);

create policy "public reads published certificates"
  on public.certificates for select to anon, authenticated
  using (is_published or (select auth.uid()) is not null);

create policy "public reads published team"
  on public.team_members for select to anon, authenticated
  using (is_published or (select auth.uid()) is not null);

create policy "public reads media"
  on public.media for select to anon, authenticated
  using (true);

create policy "admins write news" on public.news for all to authenticated
  using (true) with check (true);
create policy "admins write categories" on public.categories for all to authenticated
  using (true) with check (true);
create policy "admins write products" on public.products for all to authenticated
  using (true) with check (true);
create policy "admins write certificates" on public.certificates for all to authenticated
  using (true) with check (true);
create policy "admins write team" on public.team_members for all to authenticated
  using (true) with check (true);
create policy "admins write media" on public.media for all to authenticated
  using (true) with check (true);

-- Public bucket: the files are product photos meant to be served to visitors.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 10485760,
  array['image/jpeg','image/png','image/webp','image/avif','application/pdf']
)
on conflict (id) do nothing;

create policy "anyone reads media files"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'media');

create policy "admins upload media files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media');

create policy "admins update media files"
  on storage.objects for update to authenticated
  using (bucket_id = 'media') with check (bucket_id = 'media');

create policy "admins delete media files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media');
