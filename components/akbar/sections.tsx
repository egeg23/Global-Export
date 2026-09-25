import Image from "next/image";
import Link from "next/link";

import { ParallaxImage } from "@/components/akbar/parallax";
import { Reveal } from "@/components/akbar/reveal";
import { company, corporate, partners, services } from "@/content/akbar/company";
import { categories, doors, models, popular, swatches } from "@/lib/akbar/catalog";

/* ------------------------------------------------------------------ */
/* О фабрике — цифры, которые она публикует сама                        */
/* ------------------------------------------------------------------ */

export function Proof() {
  const facts = [
    { value: String(company.since), label: "год, с которого фабрика делает двери" },
    { value: company.plant, label: "собственного производства в Ташкенте" },
    { value: company.dealers, label: "дилерских сетей по Узбекистану" },
    { value: String(company.models), label: "позиций в каталоге" },
    { value: String(company.colors), label: "цвета и покрытия" },
    { value: company.tallHeight, label: "максимальная высота полотна" },
  ];
  return (
    <section id="fabrika" className="scroll-mt-16 bg-ak-ivory px-4 pb-20 pt-24 sm:px-8 lg:px-[4vw] lg:pb-28 lg:pt-32">
      <div className="mx-auto grid max-w-[100rem] gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <Reveal>
          <p className="ak-eyebrow text-ak-gold-600">О фабрике</p>
          <h2 className="mt-4 font-ak-display text-5xl font-medium leading-[0.98] sm:text-6xl">
            Ko‘ngil tinch — <em className="font-normal text-ak-walnut-500">на душе спокойно</em>
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ak-muted">
            Так звучит девиз Akbar Rich. За ним — собственный завод на четырёх гектарах и каталог, в
            котором рядом стоят строгий hi-tech и резная классика с патиной.
          </p>
        </Reveal>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
          {facts.map((fact, index) => (
            <Reveal key={fact.label} delay={index * 70} className="border-t border-ak-ink/15 pt-5">
              <dt className="sr-only">{fact.label}</dt>
              <dd className="font-ak-display text-5xl font-medium leading-none lg:text-6xl">{fact.value}</dd>
              <dd className="mt-3 max-w-[12rem] text-sm leading-snug text-ak-muted">{fact.label}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Коллекции дверей — девять разделов каталога                          */
/* ------------------------------------------------------------------ */

export function Collections() {
  return (
    <section className="overflow-hidden bg-ak-ink py-20 text-ak-ivory lg:py-28">
      <div className="mx-auto flex max-w-[100rem] flex-wrap items-end justify-between gap-6 px-4 sm:px-8 lg:px-[4vw]">
        <Reveal>
          <p className="ak-eyebrow text-ak-gold-300">Межкомнатные двери</p>
          <h2 className="mt-4 max-w-2xl font-ak-display text-5xl font-medium leading-[0.98] sm:text-6xl">
            Девять характеров одной фабрики
          </h2>
        </Reveal>
        <p className="max-w-sm text-base leading-relaxed text-ak-ivory/65">
          От эконома до трёхметровых и скрытых полотен. Листайте — у каждого раздела своя обложка и свои
          модели.
        </p>
      </div>

      <ul className="ak-rail mt-12 flex gap-4 overflow-x-auto px-4 pb-4 sm:px-8 lg:gap-5 lg:px-[4vw]">
        {doors.subcategories.map((sub, index) => (
          <li key={sub.id} className="w-[78vw] shrink-0 sm:w-[24rem]">
            <Link href={`/akbar/katalog/${sub.slug}`} className="group block">
              <span className="relative block aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-ak-ink-2">
                <Image
                  src={sub.cover}
                  alt={`Двери Akbar Rich: ${sub.name.toLowerCase()}`}
                  fill
                  sizes="(min-width: 640px) 24rem, 78vw"
                  className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-ak)] group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ak-ink/80 via-transparent to-transparent" />
                <span className="absolute left-5 top-5 font-ak-display text-lg text-ak-ivory/80">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                  <span className="font-ak-display text-[2rem] font-medium leading-none">{sub.name}</span>
                  <span className="shrink-0 text-xs text-ak-ivory/70">{models(sub.total)}</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Популярные модели — отметка из их каталога                           */
/* ------------------------------------------------------------------ */

export function Popular() {
  const list = popular.slice(0, 8);
  return (
    <section className="bg-ak-cream px-4 py-20 sm:px-8 lg:px-[4vw] lg:py-28">
      <div className="mx-auto max-w-[100rem]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="ak-eyebrow text-ak-gold-600">Популярные модели</p>
            <h2 className="mt-4 font-ak-display text-5xl font-medium leading-[0.98] sm:text-6xl">Их выбирают чаще</h2>
          </Reveal>
          <Link href="/akbar/katalog" className="ak-btn ak-btn-line">
            Весь каталог
          </Link>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 lg:gap-x-6">
          {list.map((item, index) => {
            const colors = swatches(item);
            const alt = item.variants.find((variant) => variant.thumb !== item.variants[0].thumb);
            return (
              <Reveal as="li" key={item.id} delay={(index % 4) * 80}>
                <Link href={`/akbar/katalog/${item.subSlug}#m-${item.id}`} className="group block">
                  <span className="relative block aspect-[420/512] overflow-hidden rounded-[1.25rem] bg-[#dcdcdc]">
                    <Image
                      src={item.variants[0].thumb}
                      alt={`${item.name}, ${item.variants[0].color.toLowerCase()}`}
                      fill
                      sizes="(min-width: 768px) 24vw, 50vw"
                      className="object-cover transition-opacity duration-500"
                    />
                    {alt && (
                      <Image
                        src={alt.thumb}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 24vw, 50vw"
                        className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    )}
                  </span>
                  <span className="mt-4 flex items-baseline justify-between gap-3">
                    <span className="font-ak-display text-2xl font-semibold leading-tight">{item.name}</span>
                  </span>
                  <span className="mt-1 block text-xs text-ak-muted">{item.sub}</span>
                  <span className="mt-3 flex items-center gap-1.5">
                    {colors.slice(0, 5).map((variant) => (
                      <span
                        key={variant.id}
                        title={variant.color}
                        className="h-4 w-4 rounded-full border border-ak-ink/15"
                        style={{ background: variant.swatch }}
                      />
                    ))}
                    {colors.length > 5 && <span className="ml-1 text-xs text-ak-muted">+{colors.length - 5}</span>}
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Три метра                                                            */
/* ------------------------------------------------------------------ */

export function Tall() {
  return (
    <section className="relative isolate overflow-hidden bg-ak-ink text-ak-ivory">
      <div className="absolute inset-0 -z-10">
        <ParallaxImage
          src="/akbar/hero/modern.webp"
          alt="Высокие двери Akbar Rich в американском орехе в современном интерьере"
          sizes="100vw"
          depth={18}
          className="h-full"
          imageClassName="object-cover object-[70%_50%]"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-ak-ink/90 via-ak-ink/55 to-ak-ink/10" />
      <div className="mx-auto flex min-h-[46rem] max-w-[100rem] flex-col justify-center px-4 py-24 sm:px-8 lg:min-h-svh lg:px-[4vw]">
        <Reveal className="max-w-2xl">
          <p className="ak-eyebrow text-ak-gold-300">Трёхметровые двери</p>
          <p className="mt-2 font-ak-display text-[9rem] font-medium leading-[0.85] text-ak-gold-300 sm:text-[13rem]">
            3 м
          </p>
          <h2 className="mt-4 font-ak-display text-4xl font-medium leading-[1.02] sm:text-5xl">
            Дверь в полный рост высокого потолка
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ak-ivory/75">
            Полотно высотой три метра и толщиной {company.tallThickness}. Любую модель каталога можно
            заказать в этой высоте — от классики с патиной до гладкого hi-tech.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#konstruktor" className="ak-btn ak-btn-gold">
              Выбрать высоту в конструкторе
            </a>
            <Link href="/akbar/katalog/tri-metra" className="ak-btn ak-btn-line-light">
              Трёхметровые модели
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Не только двери — разделы, которые у фабрики стоят в меню пустыми     */
/* ------------------------------------------------------------------ */

export function Beyond() {
  const byId = (id: string) => categories.find((category) => category.id === id)!;
  const tiles = [
    { category: byId("5"), image: byId("5").subcategories[0].cover, className: "lg:col-span-2 lg:row-span-2", tall: true },
    { category: byId("2"), image: byId("2").cover, className: "lg:col-span-2" },
    { category: byId("3"), image: byId("3").subcategories[0].cover, className: "" },
    { category: byId("4"), image: byId("4").subcategories[0].cover, className: "" },
    { category: byId("6"), image: byId("6").cover, className: "sm:col-span-2 lg:col-span-4" },
  ];
  return (
    <section className="bg-ak-ivory px-4 py-20 sm:px-8 lg:px-[4vw] lg:py-28">
      <div className="mx-auto max-w-[100rem]">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="ak-eyebrow text-ak-gold-600">Не только двери</p>
            <h2 className="mt-4 max-w-3xl font-ak-display text-5xl font-medium leading-[0.98] sm:text-6xl">
              Интерьер у одного производителя
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-ak-muted">
            Стеновые панели, проёмы и колонны, окна, плинтусы, обрешётки и мебельные створки — фабрика
            делает и их, чтобы весь интерьер держался в одном стиле.
          </p>
        </Reveal>

        <ul className="mt-12 grid auto-rows-[18rem] gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[20rem] lg:gap-5">
          {tiles.map(({ category, image, className }, index) => (
            <Reveal as="li" key={category.id} delay={index * 70} className={className}>
              <Link
                href={`/akbar/katalog/${category.subcategories[0].slug}`}
                className="group relative block h-full overflow-hidden rounded-[1.5rem] bg-ak-ink-2 text-ak-ivory"
              >
                <Image
                  src={image}
                  alt={category.name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-ak)] group-hover:scale-[1.05]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ak-ink/85 via-ak-ink/15 to-transparent" />
                <span className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6">
                  <span className="block font-ak-display text-3xl font-medium leading-none sm:text-4xl">{category.name}</span>
                  <span className="mt-3 flex flex-wrap gap-1.5">
                    {category.subcategories.slice(0, 4).map((sub) => (
                      <span key={sub.id} className="rounded-full border border-ak-ivory/25 px-2.5 py-1 text-[0.7rem]">
                        {sub.name}
                      </span>
                    ))}
                    {category.subcategories.length > 4 && (
                      <span className="rounded-full px-1 py-1 text-[0.7rem] text-ak-ivory/70">
                        ещё {category.subcategories.length - 4}
                      </span>
                    )}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Скрытые двери и панели                                              */
/* ------------------------------------------------------------------ */

export function Hidden() {
  return (
    <section className="bg-ak-wall px-4 py-20 sm:px-8 lg:px-[4vw] lg:py-28">
      <div className="mx-auto grid max-w-[100rem] items-center gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-16">
        <ParallaxImage
          src="/akbar/hero/hidden.webp"
          alt="Скрытые двери Akbar Rich в стене из стеновых панелей"
          sizes="(min-width: 1024px) 64vw, 100vw"
          depth={12}
          className="aspect-[16/10] rounded-[2rem]"
        />
        <Reveal>
          <p className="ak-eyebrow text-ak-gold-600">Скрытые двери</p>
          <h2 className="mt-4 font-ak-display text-5xl font-medium leading-[0.98]">Дверь, которой не видно</h2>
          <p className="mt-6 text-lg leading-relaxed text-ak-muted">
            Полотно встаёт вровень со стеной, а стеновые панели продолжают его рисунок. Коридор остаётся
            одной спокойной плоскостью — без коробок и наличников на виду.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/akbar/katalog/skrytye" className="ak-btn ak-btn-ink">
              Скрытые двери
            </Link>
            <Link href="/akbar/katalog/paneli-eksklyuziv" className="ak-btn ak-btn-line">
              Стеновые панели
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Как проходит заказ                                                  */
/* ------------------------------------------------------------------ */

export function Process() {
  return (
    <section id="servis" className="scroll-mt-16 bg-ak-ivory px-4 py-20 sm:px-8 lg:px-[4vw] lg:py-28">
      <div className="mx-auto max-w-[100rem]">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="ak-eyebrow text-ak-gold-600">Сервис</p>
            <h2 className="mt-4 max-w-3xl font-ak-display text-5xl font-medium leading-[0.98] sm:text-6xl">
              От консультации до установки
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-ak-muted">
            Консультация бесплатная. Отдел дизайна работает с понедельника по субботу, 9:00–18:00.
          </p>
        </Reveal>

        <ol className="relative mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <li aria-hidden="true" className="pointer-events-none absolute left-0 right-0 top-7 hidden border-t border-dashed border-ak-ink/20 lg:block" />
          {services.map((step, index) => (
            <Reveal as="li" key={step.title} delay={index * 90} className="relative">
              <span className="relative grid h-14 w-14 place-items-center rounded-full border border-ak-gold bg-ak-ivory font-ak-display text-2xl text-ak-gold-600">
                {index + 1}
              </span>
              <h3 className="mt-6 font-ak-display text-[1.75rem] font-semibold leading-tight">{step.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ak-muted">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Дилерам и корпоративным клиентам                                    */
/* ------------------------------------------------------------------ */

export function Partners() {
  return (
    <section id="partneram" className="ak-grain relative scroll-mt-16 overflow-hidden bg-ak-walnut px-4 py-20 text-ak-ivory sm:px-8 lg:px-[4vw] lg:py-28">
      <div className="relative mx-auto grid max-w-[100rem] gap-6 lg:grid-cols-2">
        <Reveal className="rounded-[2rem] border border-ak-ivory/15 bg-ak-ink/35 p-7 sm:p-10">
          <p className="ak-eyebrow text-ak-gold-300">Дилерам</p>
          <h2 className="mt-4 font-ak-display text-4xl font-medium leading-[1.02] sm:text-5xl">
            Более 30 дилерских сетей по Узбекистану — присоединяйтесь
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {partners.perks.map((perk) => (
              <li key={perk.title}>
                <p className="font-semibold">{perk.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ak-ivory/70">{perk.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-ak-ivory/15 pt-6">
            <p className="text-sm font-semibold">Требования к партнёру</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {partners.requirements.map((item) => (
                <li key={item} className="rounded-full border border-ak-ivory/20 px-3 py-1.5 text-xs">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <a href="#zayavka" className="ak-btn ak-btn-gold mt-8">
            Стать партнёром
          </a>
        </Reveal>

        <Reveal delay={120} className="flex flex-col rounded-[2rem] bg-ak-ivory p-7 text-ak-ink sm:p-10">
          <p className="ak-eyebrow text-ak-gold-600">Корпоративным клиентам</p>
          <h2 className="mt-4 font-ak-display text-4xl font-medium leading-[1.02] sm:text-5xl">
            Двери для жилого комплекса, отеля или офиса
          </h2>
          <ul className="mt-8 grid flex-1 gap-5">
            {corporate.map((item, index) => (
              <li key={item.title} className="flex gap-5 border-t border-ak-ink/10 pt-5">
                <span className="font-ak-display text-2xl text-ak-gold-600">0{index + 1}</span>
                <span>
                  <span className="block font-semibold">{item.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-ak-muted">{item.text}</span>
                </span>
              </li>
            ))}
          </ul>
          <a href="#zayavka" className="ak-btn ak-btn-ink mt-8 self-start">
            Обсудить объект
          </a>
        </Reveal>
      </div>
    </section>
  );
}
