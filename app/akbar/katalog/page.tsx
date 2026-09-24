import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AkbarFooter } from "@/components/akbar/footer";
import { AkbarHeader } from "@/components/akbar/header";
import { Reveal } from "@/components/akbar/reveal";
import { categories, models, sections } from "@/lib/akbar/catalog";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Межкомнатные двери, окна, плинтусы, обрешётки, стеновые панели и мебельные створки фабрики Akbar Rich.",
};

export default function CatalogPage() {
  return (
    <>
      <AkbarHeader />
      <main id="content" className="bg-ak-ivory px-4 pb-24 pt-28 sm:px-8 lg:px-[4vw] lg:pt-36">
        <div className="mx-auto max-w-[100rem]">
          <p className="ak-eyebrow text-ak-gold-600">Каталог</p>
          <h1 className="mt-4 font-ak-display text-6xl font-medium leading-none sm:text-7xl">Всё, что делает фабрика</h1>

          <div className="mt-16 grid gap-20">
            {categories.map((category, index) => (
              <section key={category.id} aria-labelledby={`cat-${category.id}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ak-ink/15 pb-4">
                  <h2 id={`cat-${category.id}`} className="font-ak-display text-4xl font-medium sm:text-5xl">
                    <span className="mr-4 text-xl text-ak-gold-600">0{index + 1}</span>
                    {category.name}
                  </h2>
                  <span className="text-sm text-ak-muted">{sections(category.subcategories.length)}</span>
                </div>
                <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-5">
                  {category.subcategories.map((sub, order) => (
                    <Reveal as="li" key={sub.id} delay={(order % 5) * 60}>
                      <Link href={`/akbar/katalog/${sub.slug}`} className="group block">
                        <span className="relative block aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-ak-wall-2">
                          <Image
                            src={sub.cover}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 19vw, (min-width: 768px) 32vw, 50vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                          />
                        </span>
                        <span className="mt-3 block font-semibold group-hover:text-ak-walnut-500">{sub.name}</span>
                        <span className="text-xs text-ak-muted">{models(sub.total)}</span>
                      </Link>
                    </Reveal>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>
      <AkbarFooter />
    </>
  );
}
