import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CatalogGrid } from "@/components/akbar/catalog-grid";
import { AkbarFooter } from "@/components/akbar/footer";
import { AkbarHeader } from "@/components/akbar/header";
import { allSubcategories, categories, findSubcategory, models } from "@/lib/akbar/catalog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allSubcategories.map(({ sub }) => ({ slug: sub.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = findSubcategory(slug);
  if (!found) return {};
  return {
    title: `${found.sub.name} — ${found.category.name.toLowerCase()}`,
    description: `${found.category.name}: раздел «${found.sub.name}» — модели, покрытия и цвета фабрики Akbar Rich.`,
  };
}

export default async function SubcategoryPage({ params }: Props) {
  const { slug } = await params;
  const found = findSubcategory(slug);
  if (!found) notFound();
  const { category, sub } = found;
  const hidden = sub.total - sub.items.length;

  return (
    <>
      <AkbarHeader />
      <main id="content" className="bg-ak-ivory px-4 pb-24 pt-28 sm:px-8 lg:px-[4vw] lg:pt-36">
        <div className="mx-auto max-w-[100rem]">
          <nav aria-label="Навигация по сайту" className="text-xs text-ak-muted">
            <Link href="/akbar" className="hover:text-ak-gold-600">Главная</Link>
            <span className="mx-2">/</span>
            <Link href="/akbar/katalog" className="hover:text-ak-gold-600">Каталог</Link>
            <span className="mx-2">/</span>
            <span>{category.name}</span>
          </nav>

          <ul className="ak-rail -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-wrap lg:px-0">
            {categories.map((entry) => (
              <li key={entry.id} className="shrink-0">
                <Link
                  href={`/akbar/katalog/${entry.subcategories[0].slug}`}
                  aria-current={entry.id === category.id ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors ${
                    entry.id === category.id ? "border-ak-ink bg-ak-ink text-ak-ivory" : "border-ak-ink/20 hover:border-ak-ink"
                  }`}
                >
                  {entry.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14">
            <aside>
              <p className="ak-eyebrow text-ak-gold-600">Разделы</p>
              <ul className="ak-rail -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:gap-0 lg:overflow-visible lg:px-0">
                {category.subcategories.map((entry) => (
                  <li key={entry.id} className="shrink-0 lg:border-b lg:border-ak-ink/10">
                    <Link
                      href={`/akbar/katalog/${entry.slug}`}
                      aria-current={entry.id === sub.id ? "page" : undefined}
                      className={`flex min-h-11 items-center justify-between gap-4 rounded-full border px-4 text-sm transition-colors lg:rounded-none lg:border-0 lg:px-0 lg:py-3 ${
                        entry.id === sub.id
                          ? "border-ak-gold bg-ak-cream font-semibold lg:bg-transparent lg:text-ak-walnut-500"
                          : "border-ak-ink/15 hover:text-ak-gold-600"
                      }`}
                    >
                      {entry.name}
                      <span className="hidden text-xs font-normal text-ak-muted lg:inline">{entry.total}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>

            <section aria-labelledby="sub-title">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="ak-eyebrow text-ak-gold-600">{category.name}</p>
                  <h1 id="sub-title" className="mt-3 font-ak-display text-5xl font-medium leading-none sm:text-6xl">
                    {sub.name}
                  </h1>
                </div>
                <p className="text-sm text-ak-muted">
                  {models(sub.total)}
                  {hidden > 0 && ` · в прототипе показаны ${sub.items.length}`}
                </p>
              </div>

              <div className="mt-10">
                <CatalogGrid items={sub.items} sub={`${category.short} · ${sub.name}`} />
              </div>

              <div className="mt-16 flex flex-wrap items-center justify-between gap-6 rounded-[2rem] bg-ak-ink p-7 text-ak-ivory sm:p-10">
                <div>
                  <p className="font-ak-display text-3xl font-medium leading-tight sm:text-4xl">Не нашли нужную модель?</p>
                  <p className="mt-2 max-w-lg text-ak-ivory/70">
                    Любую позицию сделают в вашем цвете и размере. Расскажите менеджеру, что нужно.
                  </p>
                </div>
                <Link href="/akbar#zayavka" className="ak-btn ak-btn-gold">
                  Оставить заявку
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <AkbarFooter />
    </>
  );
}
