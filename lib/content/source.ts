import { cache } from "react";

import { categories as bundledCategories } from "@/content/categories";
import { certificates as bundledCertificates } from "@/content/certificates";
import { news as bundledNews } from "@/content/news";
import { products as bundledProducts } from "@/content/products";
import { team as bundledTeam } from "@/content/team";
import { mediaUrl } from "@/lib/media";
import { publicClient } from "@/lib/supabase/public";
import type { Localized } from "@/lib/i18n";
import type {
  CategoryRow,
  CertificateRow,
  LocalizedJson,
  NewsRow,
  ProductRow,
  SpecJson,
  TeamMemberRow,
} from "@/lib/supabase/types";

import type {
  Category,
  Certificate,
  NewsItem,
  Product,
  Spec,
  TeamMember,
} from "./types";

/**
 * The site's single source of content.
 *
 * Every page reads through here rather than importing `content/*` directly.
 * When Supabase is configured the rows come from the database — which is what
 * the admin panel writes to; otherwise the modules in `content/` are served
 * unchanged, so the prototype still builds and runs on a clean checkout with
 * no environment at all.
 *
 * A failed query falls back too, and says so in the log: a database hiccup
 * should degrade to last-known-good content, not to an empty page. An *empty*
 * table is taken at face value — if the owner deletes every news item, the news
 * page is empty, it does not resurrect the seed data.
 */

function localized(value: LocalizedJson | null | undefined): Localized {
  return { en: value?.en ?? "", ru: value?.ru, uz: value?.uz };
}

function specs(value: SpecJson[] | null | undefined): Spec[] {
  if (!Array.isArray(value)) return [];
  return value.map((spec) => ({
    label: localized(spec?.label),
    value: localized(spec?.value),
  }));
}

/** Rows come back ordered; only the fallback needs to preserve author order. */
async function load<Row, Item>(
  table: "categories" | "certificates" | "news" | "products" | "team_members",
  order: { column: string; ascending: boolean },
  map: (row: Row) => Item,
  fallback: Item[],
): Promise<Item[]> {
  const supabase = publicClient();
  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order(order.column, { ascending: order.ascending });

  if (error) {
    console.warn(`[content] ${table}: ${error.message} — serving bundled content`);
    return fallback;
  }

  return (data as Row[]).map(map);
}

function toCategory(row: CategoryRow): Category {
  return {
    slug: row.slug,
    name: localized(row.name),
    shortName: localized(row.short_name),
    description: localized(row.description),
    image: mediaUrl(row.image_path),
  };
}

function toProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    category: row.category_slug,
    name: localized(row.name),
    latinName: row.latin_name ?? undefined,
    description: localized(row.description),
    specs: specs(row.specs),
    image: mediaUrl(row.image_path),
    featured: row.is_featured,
    regions: localized(row.regions),
    packaging: localized(row.packaging),
    hsCode: row.hs_code ?? undefined,
    availability: row.availability === "soon" ? "soon" : "available",
  };
}

function toNewsItem(row: NewsRow): NewsItem {
  return {
    slug: row.slug,
    date: row.published_at,
    title: localized(row.title),
    excerpt: localized(row.excerpt),
    body: localized(row.body),
    image: mediaUrl(row.image_path),
    tag: localized(row.tag),
  };
}

function toCertificate(row: CertificateRow): Certificate {
  return {
    slug: row.slug,
    name: row.name,
    issuer: row.issuer ?? undefined,
    description: localized(row.description),
    image: mediaUrl(row.image_path),
  };
}

function toTeamMember(row: TeamMemberRow): TeamMember {
  return {
    name: row.name,
    position: localized(row.position_title),
    group: row.team_group,
    photo: mediaUrl(row.photo_path),
    email: row.email ?? undefined,
  };
}

// `cache` scopes the result to one render pass, so a page that pulls products
// in three sections issues one query, not three.
export const getCategories = cache(() =>
  load<CategoryRow, Category>(
    "categories",
    { column: "position", ascending: true },
    toCategory,
    bundledCategories,
  ),
);

export const getProducts = cache(() =>
  load<ProductRow, Product>(
    "products",
    { column: "position", ascending: true },
    toProduct,
    bundledProducts,
  ),
);

export const getNews = cache(() =>
  load<NewsRow, NewsItem>(
    "news",
    { column: "published_at", ascending: false },
    toNewsItem,
    bundledNews,
  ),
);

export const getCertificates = cache(() =>
  load<CertificateRow, Certificate>(
    "certificates",
    { column: "position", ascending: true },
    toCertificate,
    bundledCertificates,
  ),
);

export const getTeam = cache(() =>
  load<TeamMemberRow, TeamMember>(
    "team_members",
    { column: "position", ascending: true },
    toTeamMember,
    bundledTeam,
  ),
);

export async function getCategory(slug: string): Promise<Category | undefined> {
  return (await getCategories()).find((category) => category.slug === slug);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((product) => product.slug === slug);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  return (await getProducts()).filter((product) => product.category === category);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return (await getProducts()).filter((product) => product.featured);
}

export async function getNewsItem(slug: string): Promise<NewsItem | undefined> {
  return (await getNews()).find((item) => item.slug === slug);
}

export async function getLatestNews(count: number): Promise<NewsItem[]> {
  return (await getNews()).slice(0, count);
}
