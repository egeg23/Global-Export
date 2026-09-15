import Image from "next/image";
import Link from "next/link";

import { ProjectSwitcher } from "@/components/adar/showcase/project-switcher";
import { Shell } from "@/components/adar/ui/shell";
import { Wordmark } from "@/components/adar/ui/wordmark";
import { sets } from "@/content/adar/catalog";
import { comparison, concepts } from "@/content/adar/concepts";
import { priceRange } from "@/lib/adar/catalog";
import { formatNumber } from "@/lib/adar/format";
import { cn } from "@/lib/cn";

/**
 * Витрина проекта ADAR.
 *
 * Одна страница, с которой заказчик открывает три варианта своей будущей
 * главной, сравнивает их построчно и видит смету по каждому. Решение от него
 * нужно ровно одно — выбрать вариант.
 */
export default function AdarShowcase() {
  return (
    <main className="pb-24">
      <section className="relative isolate overflow-hidden bg-adar-green-950 text-adar-cream-50">
        <Image
          src="/adar/photos/tree-ornaments.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-adar-green-950/75 via-adar-green-950/90 to-adar-green-950"
        />

        <Shell size="wide" className="py-10">
          <ProjectSwitcher active="adar" tone="dark" />
        </Shell>

        <Shell size="wide" className="pb-20 lg:pb-28">
          <Wordmark tone="gold" />

          <h1 className="mt-10 max-w-4xl font-adar-display text-[2.75rem] leading-[1.02] sm:text-6xl xl:text-7xl">
            Три варианта нового сайта — рабочие, а не картинки
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-adar-cream-50/70">
            По ссылкам ниже открывается не макет, а работающая страница: можно
            искать по каталогу, двигать бюджет, считать партию, отправлять
            заявку. Наполнено вашими же материалами с adar.uz — все{" "}
            {sets.length} наборов, цены от {formatNumber(priceRange.min)} до{" "}
            {formatNumber(priceRange.max)} сум и состав каждого набора
            до последней конфеты.
          </p>

          <p className="mt-9 inline-flex flex-wrap items-center gap-x-3 gap-y-1 border-l-2 border-adar-gold-500 pl-5 text-sm text-adar-cream-50/60">
            <span className="font-medium text-adar-cream-50">Что нужно от вас:</span>
            выбрать один вариант — его доводим до конца.
          </p>
        </Shell>
      </section>

      {/* Три варианта */}
      <Shell size="wide" className="pt-16 lg:pt-24">
        <ul className="grid gap-5 lg:grid-cols-3">
          {concepts.map((concept) => (
            <li key={concept.id}>
              <article
                className={cn(
                  "flex h-full flex-col rounded-adar-lg border p-7 transition-colors duration-300",
                  concept.id === "plus"
                    ? "border-adar-gold-500/50 bg-white"
                    : "border-adar-green-900/10 bg-white/70",
                )}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-adar-display text-2xl text-adar-gold-600">
                    {concept.index}
                  </span>
                  {concept.id === "plus" ? (
                    <span className="rounded-full bg-adar-gold-500 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-adar-green-950">
                      Оптимально
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-5 font-adar-display text-3xl text-adar-green-950">
                  «{concept.name}»
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-adar-ink-muted">
                  {concept.tagline}
                </p>

                <p className="mt-7 flex items-baseline gap-3">
                  <span className="font-adar-display text-5xl leading-none text-adar-green-900 tabular-nums">
                    ${concept.estimate.total}
                  </span>
                  <span className="text-sm text-adar-ink-subtle">{concept.estimate.days}</span>
                </p>

                <ul className="mt-7 grid gap-2.5 border-t border-adar-green-900/10 pt-6 text-sm text-adar-ink-muted">
                  {concept.highlights.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="text-adar-gold-600">
                        ·
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap gap-3 pt-8">
                  <Link
                    href={concept.href}
                    prefetch={false}
                    className="rounded-full bg-adar-green-900 px-6 py-3 text-sm font-medium text-adar-cream-50 transition-colors duration-300 hover:bg-adar-green-800"
                  >
                    Открыть вариант
                  </Link>
                  <Link
                    href={`${concept.href}#smeta`}
                    prefetch={false}
                    className="rounded-full border border-adar-green-900/15 px-6 py-3 text-sm font-medium text-adar-green-900 transition-colors duration-300 hover:border-adar-green-900/35"
                  >
                    Смета
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Shell>

      {/* Построчное сравнение */}
      <Shell size="wide" className="pt-20 lg:pt-28">
        <h2 className="font-adar-display text-4xl leading-tight text-adar-green-950 sm:text-5xl">
          Что входит в каждый вариант
        </h2>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
            <thead>
              <tr>
                <th scope="col" className="w-2/5 pb-5 font-medium text-adar-ink-subtle">
                  Возможность
                </th>
                {concepts.map((concept) => (
                  <th key={concept.id} scope="col" className="pb-5 text-center">
                    <span className="block font-adar-display text-xl text-adar-green-950">
                      «{concept.name}»
                    </span>
                    <span className="mt-1 block text-adar-ink-subtle tabular-nums">
                      ${concept.estimate.total}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.title} className="border-t border-adar-green-900/10">
                  <th scope="row" className="py-4 pr-6 text-left font-normal text-adar-ink">
                    {row.title}
                  </th>
                  {row.values.map((value, index) => (
                    <td key={index} className="py-4 text-center align-middle">
                      {value === true ? (
                        <span className="text-adar-green-500" title="входит">
                          <span className="sr-only">входит</span>
                          <span aria-hidden="true">✓</span>
                        </span>
                      ) : value === false ? (
                        <span className="text-adar-ink-subtle/45">
                          <span className="sr-only">не входит</span>
                          <span aria-hidden="true">—</span>
                        </span>
                      ) : (
                        <span className="text-adar-ink-muted">{value}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t-2 border-adar-green-900/25">
                <th scope="row" className="py-5 text-left font-medium text-adar-ink">
                  Стоимость
                </th>
                {concepts.map((concept) => (
                  <td
                    key={concept.id}
                    className="py-5 text-center font-adar-display text-2xl text-adar-green-900 tabular-nums"
                  >
                    ${concept.estimate.total}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Shell>

      {/* Версия для встречи */}
      <Shell size="wide" className="pt-10">
        <Link
          href="/adar/print"
          prefetch={false}
          className="group flex flex-wrap items-center justify-between gap-4 rounded-adar border border-adar-green-900/12 bg-white/70 px-6 py-5 transition-colors hover:border-adar-green-900/30"
        >
          <span>
            <span className="block font-adar-display text-xl text-adar-green-950">
              Версия для печати
            </span>
            <span className="mt-1 block text-sm text-adar-ink-muted">
              Четыре листа A4 в чёрно-белом: варианты, построчное сравнение с
              колонкой для отметок заказчика и сметы. Печатается из браузера
              или сохраняется в PDF.
            </span>
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-adar-green-900">
            Открыть
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </span>
        </Link>
      </Shell>

      {/* Честный статус */}
      <Shell size="wide" className="pt-20 lg:pt-28">
        <div className="grid gap-10 border-t border-adar-green-900/12 pt-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="font-adar-display text-3xl text-adar-green-950">
              Что здесь настоящее
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-adar-ink-subtle">
              Прототип наполнялся без выдумок: где данных не было, поле осталось
              пустым, а не заполнилось правдоподобным.
            </p>
          </div>

          <div className="space-y-5 text-sm leading-relaxed text-adar-ink-muted lg:col-span-7">
            <p>
              Все {sets.length} наборов, цены, фотографии и составы перенесены
              с adar.uz. Телефоны, адрес, время работы, история компании
              и логотипы заказчиков — тоже ваши.
            </p>
            <p>
              Тематические направления, кроме новогоднего, показаны с пометкой
              «под заказ»: на сайте они заявлены, но товаров в них нет,
              и придумывать ассортимент мы не стали.
            </p>
            <p>
              Формы в прототипе ничего не отправляют — заявка показывает
              состояние «принято» и на этом останавливается. На рабочем сайте
              она уходит на почту и мгновенным сообщением.
            </p>
            <p className="text-adar-ink-subtle">
              Для сравнения:{" "}
              <a
                href="https://adar.uz/"
                target="_blank"
                rel="noopener"
                className="underline underline-offset-4 hover:text-adar-ink"
              >
                нынешний сайт adar.uz
              </a>
              .
            </p>
          </div>
        </div>
      </Shell>
    </main>
  );
}
