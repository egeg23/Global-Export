import type { Category, Product } from "@/lib/content/types";
import { t, type Locale } from "@/lib/i18n";

/**
 * The shape the catalogue grid actually needs.
 *
 * Passing full `Product` objects to the client component would serialise every
 * specification, packing note and all three translations of each field into the
 * page payload — roughly 150 KB of which the browser uses a fraction. This is
 * the projection for one locale.
 */
export type CatalogItem = {
  slug: string;
  category: string;
  /** Short category name, resolved on the server so the client needs no lookup. */
  categoryLabel?: string;
  name: string;
  latinName?: string;
  /** Pre-lowercased haystack for the search box. */
  search: string;
  image?: string;
  specLabel?: string;
  specValue?: string;
  availability?: "available" | "soon";
};

export function toCatalogItem(
  product: Product,
  locale: Locale,
  categoryLabel?: string,
): CatalogItem {
  const name = t(product.name, locale);
  const description = t(product.description, locale);
  const spec = product.specs?.[0];

  return {
    slug: product.slug,
    category: product.category,
    categoryLabel,
    name,
    latinName: product.latinName,
    search: `${name} ${product.latinName ?? ""} ${description}`.toLowerCase(),
    image: product.image,
    specLabel: spec ? t(spec.label, locale) : undefined,
    specValue: spec ? t(spec.value, locale) : undefined,
    availability: product.availability,
  };
}

export function toCatalogItems(
  products: Product[],
  locale: Locale,
  categories: Category[] = [],
): CatalogItem[] {
  const labels = new Map(
    categories.map((category) => [category.slug, t(category.shortName, locale)]),
  );
  return products.map((product) =>
    toCatalogItem(product, locale, labels.get(product.category)),
  );
}
