import Link from "next/link";

import { ProductCard } from "@/components/cards/product-card";
import { ArrowRight } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Dictionary } from "@/content/dictionaries";
import { toCatalogItems } from "@/lib/content/catalog";
import { getCategories, getProducts } from "@/lib/content/source";
import { localeHref, type Locale } from "@/lib/i18n";

export async function FeaturedProducts({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const featured = products.filter((product) => product.featured);
  const items = toCatalogItems(featured.length > 0 ? featured : products, locale, categories).slice(0, 6);
  if (items.length === 0) return null;

  return (
    <section className="bg-sand-50 py-24 lg:py-32">
      <Container>
        <SectionHeading
          eyebrow={dict.catalog.eyebrow}
          title={dict.catalog.title}
          text={dict.catalog.intro}
          action={
            <Link
              href={localeHref(locale, "catalog")}
              className="group inline-flex items-center gap-2 text-[0.95rem] font-medium text-forest-800"
            >
              <span className="link-underline">{dict.common.viewAll}</span>
              <ArrowRight />
            </Link>
          }
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal as="li" key={item.slug} delay={(index % 3) * 80}>
              <ProductCard
                item={item}
                locale={locale}
                showCategory
                comingSoonLabel={dict.product.comingSoon}
              />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
