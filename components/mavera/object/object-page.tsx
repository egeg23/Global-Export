import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ObjectInteractive } from "@/components/mavera/object/interactive";
import { Rise } from "@/components/mavera/reveal";
import { VariantBar } from "@/components/mavera/variant-bar";
import { money, type TierId } from "@/components/present/mavera/theme";
import { projects } from "@/content/mavera/data";
import { voices } from "@/content/mavera/voice";
import { cn } from "@/lib/cn";
import { area, corpusCount, summaryOf } from "@/lib/mavera/flats";

/**
 * Карточка жилого комплекса — одна на три варианта.
 *
 * Провалиться в объект можно из любого варианта, и страница везде решает одну
 * задачу: показать дом, дать выбрать квартиру и посчитать платёж. Различается
 * подача — она приходит из токенов мира и трёх развилок по варианту: первый
 * экран, показ квартир и радиусы.
 *
 * Делать три разные страницы под одно и то же действие было бы честно только
 * если бы различался сценарий покупки. Он не различается.
 */
export function ObjectPage({ variant, slug }: { variant: TierId; slug: string }) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const voice = voices[variant];
  const summary = summaryOf(slug);
  const corpuses = corpusCount(project);
  const home = `/mavera/${variant}`;

  const specs = [
    { label: "Площадь", value: project.area },
    { label: "Корпусов", value: String(corpuses) },
    { label: "Этажность", value: project.floors },
    { label: "Квартир", value: project.flats },
    { label: "Сегмент", value: project.segment },
    { label: "Сдача", value: project.due },
  ];

  const gallery = [project.photo, "/images/mavera/interior.jpg", "/images/mavera/facade.jpg", "/images/mavera/park.jpg"];
  const rounded = variant === "premium" ? "rounded-[var(--w-radius-lg)]" : variant === "lux" ? "rounded-[2px]" : "";

  return (
    <div data-world={variant}>
      <VariantBar current={variant} />

      <header className="sticky top-0 z-40 border-b border-[var(--w-line)] bg-[var(--w-bg)]/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-6 px-5 py-4 sm:px-8">
          <Link href={home} prefetch={false} className="text-lg font-semibold tracking-[0.3em]">
            MAVERA
          </Link>
          <nav className="hidden gap-8 text-sm text-[var(--w-muted)] md:flex">
            <Link href={home} prefetch={false} className="transition-colors hover:text-[var(--w-ink)]">
              Все проекты
            </Link>
            <span>Выбор квартиры</span>
            <span>Ипотека</span>
            <span>Контакты</span>
          </nav>
          <span className="text-sm tabular-nums">+998 (__) ___-__-__</span>
        </div>
      </header>

      {/* Первый экран: у каждого варианта своя подача. */}
      <section
        className={cn(
          "relative isolate overflow-hidden",
          variant === "standard" ? "border-b border-[var(--w-line)]" : "flex min-h-[70svh] items-end",
        )}
      >
        {variant === "standard" ? (
          <div className="mx-auto grid w-full max-w-[1500px] lg:grid-cols-2">
            <div className="flex flex-col justify-center px-5 py-14 sm:px-8">
              <Rise>
                <p className="text-sm text-[var(--w-muted)]">
                  <Link href={home} prefetch={false} className="hover:text-[var(--w-ink)]">
                    Каталог
                  </Link>{" "}
                  / ЖК «{project.name}»
                </p>
                <h1 className="mt-5 text-[clamp(2rem,4vw,3.4rem)] leading-[1.06]">
                  ЖК «{project.name}»
                </h1>
                <p className="mt-4 text-lg text-[var(--w-muted)]">{project.district}</p>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--w-muted)]">
                  {voice.claims[slug]}
                </p>
                <p className="mt-8 text-2xl font-medium tabular-nums">
                  от {money(summary.minPriceUsd, "uzs")}
                  <span className="ml-2 text-base font-normal text-[var(--w-muted)]">
                    · {summary.free} квартир в продаже
                  </span>
                </p>
              </Rise>
            </div>
            <div className="relative min-h-[300px] border-t border-[var(--w-line)] lg:border-l lg:border-t-0">
              <Image src={project.photo} alt="" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </div>
        ) : (
          <>
            <Image src={project.photo} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--w-bg)] via-[var(--w-bg)]/55 to-[var(--w-bg)]/10"
            />
            <div className="mx-auto w-full max-w-[1500px] px-5 pb-12 sm:px-8">
              <Rise
                className={cn(
                  "max-w-2xl p-7 sm:p-10",
                  rounded,
                  variant === "lux"
                    ? "bg-[var(--w-surface)]/92 shadow-[var(--w-shadow)] backdrop-blur-sm"
                    : "border border-[var(--w-line)] bg-[var(--w-bg)]/70 backdrop-blur-xl",
                )}
              >
                <p className="text-sm text-[var(--w-muted)]">
                  <Link href={home} prefetch={false} className="hover:text-[var(--w-ink)]">
                    Проекты
                  </Link>{" "}
                  / ЖК «{project.name}»
                </p>
                <h1 className="mt-4 text-[clamp(2rem,4.6vw,3.8rem)] leading-[1.04]">
                  ЖК «{project.name}»
                </h1>
                <p className="mt-4 text-base leading-relaxed text-[var(--w-muted)] sm:text-lg">
                  {voice.claims[slug]}
                </p>
                <p className="mt-7 text-xl font-medium tabular-nums sm:text-2xl">
                  от {money(summary.minPriceUsd, "uzs")}
                  <span className="ml-2 text-sm font-normal text-[var(--w-muted)]">
                    · {summary.free} квартир в продаже
                  </span>
                </p>
              </Rise>
            </div>
          </>
        )}
      </section>

      {/* Характеристики */}
      <section className="border-b border-[var(--w-line)]">
        <dl className="mx-auto grid w-full max-w-[1500px] sm:grid-cols-3 lg:grid-cols-6">
          {specs.map((spec, index) => (
            <Rise
              key={spec.label}
              delay={index * 50}
              className="border-b border-[var(--w-line)] px-5 py-7 last:border-b-0 sm:px-6 lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <dt className="text-[0.65rem] uppercase tracking-[0.14em] text-[var(--w-muted)]">
                {spec.label}
              </dt>
              <dd className="mt-2 text-lg tabular-nums">{spec.value}</dd>
            </Rise>
          ))}
        </dl>
      </section>

      {/* Галерея */}
      <section className="mx-auto w-full max-w-[1500px] px-5 py-16 sm:px-8">
        <Rise className="grid gap-3 sm:grid-cols-4">
          {gallery.map((photo, index) => (
            <div
              key={photo}
              className={cn(
                "relative overflow-hidden",
                rounded,
                index === 0 ? "sm:col-span-2 sm:row-span-2 aspect-[4/3]" : "aspect-[4/3]",
              )}
            >
              <Image
                src={photo}
                alt=""
                fill
                sizes="(min-width: 640px) 25vw, 100vw"
                className="object-cover transition-transform duration-700 ease-[var(--w-ease)] hover:scale-[1.04] motion-reduce:transform-none"
              />
            </div>
          ))}
        </Rise>
      </section>

      {/* Выбор квартиры и расчёт платежа */}
      <section id="flats" className="border-y border-[var(--w-line)] bg-[var(--w-paper)]">
        <div className="mx-auto w-full max-w-[1500px] px-5 py-16 sm:px-8">
          <Rise className="max-w-2xl">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">
              Выбор квартиры
            </p>
            <h2 className="mt-4 text-[clamp(1.8rem,3.2vw,2.8rem)] leading-[1.08]">
              {summary.free} квартир от {area(summary.minArea)} до {area(summary.maxArea)} м²
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--w-muted)]">
              Фильтруйте по комнатности, корпусу, этажу и бюджету. Выбранная квартира
              сразу попадает в расчёт платежа справа.
            </p>
          </Rise>

          <Rise delay={120} className="mt-10">
            <ObjectInteractive slug={slug} variant={variant} />
          </Rise>
        </div>
      </section>

      {/* Расположение */}
      <section className="mx-auto w-full max-w-[1500px] px-5 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <Rise className="lg:col-span-4">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">
              Расположение
            </p>
            <h2 className="mt-4 text-[clamp(1.6rem,2.8vw,2.4rem)] leading-[1.1]">
              {project.district} район
            </h2>
            <dl className="mt-8 border-t border-[var(--w-line)]">
              {[
                ["До метро", "12 минут пешком"],
                ["Школа и садик", "внутри квартала"],
                ["До центра", "20 минут на машине"],
                ["Паркинг", "подземный, 1 место на квартиру"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-6 border-b border-[var(--w-line)] py-3.5">
                  <dt className="text-sm text-[var(--w-muted)]">{label}</dt>
                  <dd className="text-sm">{value}</dd>
                </div>
              ))}
            </dl>
          </Rise>

          <Rise delay={100} className={cn("relative aspect-[16/9] overflow-hidden lg:col-span-8", rounded)}>
            <Image src="/images/mavera/park.jpg" alt="" fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
            <span
              className={cn(
                "absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-medium",
                "bg-[var(--w-accent)] text-[var(--w-accent-ink)]",
              )}
            >
              ЖК
            </span>
          </Rise>
        </div>
      </section>

      {/* Заявка */}
      <section className="border-t border-[var(--w-line)] bg-[var(--w-paper)]">
        <div className="mx-auto grid w-full max-w-[1500px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2">
          <Rise>
            <h2 className="text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.08]">{voice.closing.title}</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--w-muted)]">
              {voice.closing.text}
            </p>
          </Rise>

          <Rise delay={120}>
            <div className={cn("border border-[var(--w-line)] bg-[var(--w-surface)] p-6 sm:p-8", rounded)}>
              <div className="flex flex-col gap-4">
                {["Имя", "Телефон"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field}
                    className={cn(
                      "w-full border border-[var(--w-line)] bg-[var(--w-bg)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--w-accent)]",
                      rounded,
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                className={cn(
                  "mt-5 w-full bg-[var(--w-accent)] px-6 py-3.5 text-sm font-medium text-[var(--w-accent-ink)] transition-opacity hover:opacity-90",
                  variant === "premium" ? "w-glow rounded-full" : rounded,
                )}
              >
                {voice.closing.primary}
              </button>
              <p className="mt-4 text-xs text-[var(--w-muted)]">
                Демонстрация: заявка никуда не уходит.
              </p>
            </div>
          </Rise>
        </div>
      </section>

      <footer className="border-t border-[var(--w-line)]">
        <div className="mx-auto flex w-full max-w-[1500px] flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-[var(--w-muted)] sm:px-8">
          <Link href={home} prefetch={false} className="transition-colors hover:text-[var(--w-ink)]">
            ← Все проекты MAVERA
          </Link>
          <span className="tracking-[0.3em] text-[var(--w-ink)]">MAVERA</span>
        </div>
      </footer>
    </div>
  );
}

/** Адреса объектов — общие для всех трёх вариантов. */
export function objectParams() {
  return projects.map((project) => ({ slug: project.slug }));
}
