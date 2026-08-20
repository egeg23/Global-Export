-- Localised text is stored as jsonb {"en": "...", "ru": "...", "uz": "..."}
-- so a new language is a key, not a schema migration.

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.media (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  filename text not null,
  mime_type text,
  size_bytes integer,
  width integer,
  height integer,
  alt jsonb not null default '{}'::jsonb,
  folder text not null default 'general',
  created_at timestamptz not null default now()
);

create table public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  published_at date not null default current_date,
  title jsonb not null default '{}'::jsonb,
  excerpt jsonb not null default '{}'::jsonb,
  body jsonb not null default '{}'::jsonb,
  tag jsonb not null default '{}'::jsonb,
  image_path text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name jsonb not null default '{}'::jsonb,
  short_name jsonb not null default '{}'::jsonb,
  description jsonb not null default '{}'::jsonb,
  image_path text,
  position integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_slug text not null,
  name jsonb not null default '{}'::jsonb,
  latin_name text,
  description jsonb not null default '{}'::jsonb,
  -- [{ "label": {...}, "value": {...} }]
  specs jsonb not null default '[]'::jsonb,
  regions jsonb not null default '{}'::jsonb,
  packaging jsonb not null default '{}'::jsonb,
  hs_code text,
  image_path text,
  is_featured boolean not null default false,
  availability text not null default 'available'
    check (availability in ('available', 'soon')),
  position integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  issuer text,
  description jsonb not null default '{}'::jsonb,
  image_path text,
  position integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position_title jsonb not null default '{}'::jsonb,
  team_group text not null default 'directors'
    check (team_group in ('board', 'directors', 'export')),
  email text,
  photo_path text,
  position integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index news_published_idx on public.news (is_published, published_at desc);
create index products_category_idx on public.products (category_slug, position);
create index team_group_idx on public.team_members (team_group, position);

create trigger news_touch before update on public.news
  for each row execute function public.touch_updated_at();
create trigger categories_touch before update on public.categories
  for each row execute function public.touch_updated_at();
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();
create trigger certificates_touch before update on public.certificates
  for each row execute function public.touch_updated_at();
create trigger team_touch before update on public.team_members
  for each row execute function public.touch_updated_at();
