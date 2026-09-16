import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Addon, ConfiguratorProvider } from "@/components/configurator/context";
import { maveraCatalog, maveraHrefs } from "@/content/mavera/catalog";
import { Live, Magnetic, Words } from "@/components/mavera/configurator/live";
import { DemoSubmit } from "@/components/mavera/demo-submit";
import { ParallaxFigure } from "@/components/mavera/lux/parallax-figure";
import { Rise } from "@/components/mavera/reveal";
import { News, Reviews } from "@/components/mavera/sections";
import { VariantBar } from "@/components/mavera/variant-bar";
import { money } from "@/components/present/mavera/theme";
import { projects, stats, terms } from "@/content/mavera/data";
import { district, materials, voices } from "@/content/mavera/voice";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Вариант 02 — «Люкс»" };

const featured = projects[1];
const voice = voices.lux;

/**
 * Вариант 02 — «Люкс», журнальный разворот.
 *
 * Тёплая бумага, засечные заголовки, асимметричная сетка, буквица и вынос в
 * поле. Проект продаётся не таблицей характеристик, а рассказом: кадр во весь
 * разворот, текст в две колонки, лента объектов, которую листают, как страницы.
 * Снимки едут медленнее текста — разворот перестаёт быть плоским.
 */
export default function MaveraLux() {
  return (
    <ConfiguratorProvider catalog={maveraCatalog} tier="lux" page="main" hrefs={maveraHrefs("lux", projects[0].slug)} frame="world">
      <VariantBar current="lux" />

      {/* Шапка-масthead: тонкие линейки, засечный логотип по центру. */}
      <header className="border-b border-[var(--w-line)]">
        <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8">
          <div className="flex items-center justify-between gap-6 py-3 text-[0.7rem] uppercase tracking-[0.2em] text-[var(--w-muted)]">
            <span>Ташкент</span>
            <span className="hidden sm:inline">Выпуск 01 · 2026</span>
            <Addon id="langs" inline scroll={false}>
              <span>RU / EN / UZ</span>
            </Addon>
          </div>
          <div className="border-t border-[var(--w-line)] py-6 text-center">
            <p className="font-[family-name:var(--w-display)] text-[clamp(2rem,6vw,3.6rem)] tracking-[0.3em]">
              MAVERA
            </p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-t border-[var(--w-line)] py-3 text-[0.72rem] uppercase tracking-[0.18em] text-[var(--w-muted)]">
            {[
              ["Проекты", "#projects"],
              ["Архитектура", "#interior"],
              ["Район", "#district"],
              ["Материалы", "#materials"],
              ["Запись на показ", "#coupon"],
            ].map(([item, href], index) => (
              <a
                key={item}
                href={href}
                className={cn("transition-colors hover:text-[var(--w-ink)]", index === 0 && "text-[var(--w-ink)]")}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Допник «Строка условий покупки»: в журнале — тонкая строка под шапкой. */}
      <Addon id="promo" as="section" className="border-b border-[var(--w-line)] bg-[var(--w-paper)]">
        <div className="mx-auto flex w-full max-w-[1500px] flex-wrap items-baseline justify-center gap-x-10 gap-y-1 px-5 py-3 text-[0.68rem] uppercase tracking-[0.16em] text-[var(--w-muted)] sm:px-8">
          {terms.map((term) => (
            <span key={term.label}>
              <span className="font-[family-name:var(--w-display)] text-base normal-case tracking-normal text-[var(--w-accent)]">
                {term.value}
              </span>{" "}
              {term.label}
            </span>
          ))}
        </div>
      </Addon>

      {/* Обложка выпуска: текст лежит поверх кадра, а не свисает под ним.

          Раньше карточка с заголовком выезжала на фотографию отрицательным
          отступом — и на узком экране пропадала под ней. Причина не в
          отступе: блок с фотографией позиционирован, карточка шла в потоке,
          а позиционированный элемент по правилам отрисовки всегда выше. Тут
          порядок задан явно: кадр и затемнение уходят за содержимое. */}
      <section className="relative isolate flex min-h-[86svh] items-end overflow-hidden">
        <Live id="hero" base="absolute inset-0 -z-20" className="w-kenburns">
          <Image
            src="/images/mavera/hero-editorial.jpg"
            alt="Фасад жилого дома"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </Live>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--w-bg)] via-[var(--w-bg)]/45 to-[var(--w-bg)]/5"
        />

        <div className="mx-auto w-full max-w-[1500px] px-5 pb-10 sm:px-8 lg:pb-16">
          {/* Допник «Живой первый экран»: слова заголовка всплывают по очереди, кадр наезжает. */}
          <Addon id="hero" flag className="max-w-2xl">
          <Rise className="bg-[var(--w-surface)]/92 p-7 shadow-[var(--w-shadow)] backdrop-blur-sm sm:p-10 lg:p-12">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">
              {voice.hero.eyebrow}
            </p>
            <h1 className="mt-5 text-[clamp(1.9rem,5vw,4.2rem)] leading-[1.04]">
              <Words text={voice.hero.titleTop} />
              <br />
              <Words text={voice.hero.titleBottom} offset={360} />
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--w-muted)] sm:text-lg">
              {voice.hero.lead}
            </p>
            <p className="mt-6 text-sm text-[var(--w-muted)]">
              Текст: редакция MAVERA · Фотографии: архив компании
            </p>
          </Rise>
          </Addon>
        </div>
      </section>

      {/* Лид с буквицей и выносом в поле — асимметрия 7 / 4. */}
      <section className="mx-auto w-full max-w-[1500px] px-5 py-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <Rise className="lg:col-span-7">
            <p className="w-dropcap text-lg leading-[1.75]">
              Четырнадцать лет назад мы построили первый дом на окраине Чиланзара — и
              через десять лет вернулись туда достраивать вторую очередь, потому что
              половина покупателей привела соседей. С тех пор у нас правило: квартал
              проектируется так, чтобы через двадцать лет он не выглядел компромиссом.
            </p>
            <p className="mt-6 text-lg leading-[1.75] text-[var(--w-muted)]">
              Это значит закрытый двор без машин, школу и садик внутри периметра,
              первые этажи под аренду, а не под квартиры, и материалы фасада, которые
              переживут два цикла ремонта. Дороже на старте — дешевле в эксплуатации.
            </p>
          </Rise>

          <Rise delay={140} className="lg:col-span-4 lg:col-start-9">
            <blockquote className="border-t-2 border-[var(--w-accent)] pt-6">
              <p className="font-[family-name:var(--w-display)] text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.3]">
                «Мы продаём не квадратные метры, а двадцать лет жизни в этом дворе».
              </p>
              <footer className="mt-4 text-sm text-[var(--w-muted)]">
                Главный архитектор MAVERA
              </footer>
            </blockquote>
          </Rise>
        </div>
      </section>

      {/* Проект выпуска: кадр слева едет медленнее, характеристики справа. */}
      <section className="border-y border-[var(--w-line)] bg-[var(--w-paper)]">
        <div className="mx-auto grid w-full max-w-[1500px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:gap-16">
          <Rise className="lg:col-span-7">
            <ParallaxFigure
              src={featured.photo}
              alt={`ЖК «${featured.name}»`}
              caption={`ЖК «${featured.name}», ${featured.district} — съёмка заказчика заменит этот кадр`}
              className="aspect-[4/3]"
              sizes="(min-width: 1024px) 58vw, 100vw"
            />
          </Rise>

          <Rise delay={120} className="lg:col-span-5 lg:pt-6">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">
              Проект выпуска
            </p>
            <h2 className="mt-5 text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.06]">
              ЖК «{featured.name}»
            </h2>
            <p className="mt-5 text-lg leading-[1.7] text-[var(--w-muted)]">{voice.claims[featured.slug]}</p>

            <dl className="mt-10 border-t border-[var(--w-line)]">
              {[
                ["Сегмент", featured.segment],
                ["Этажность", featured.floors],
                ["Квартир", featured.flats],
                ["Площадь", featured.area],
                ["Сдача", featured.due],
                ["Цена от", `${money(featured.priceUsd, "uzs")} за м²`],
              ].map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-6 border-b border-[var(--w-line)] py-3.5">
                  <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-[var(--w-muted)]">{label}</dt>
                  <dd className="font-[family-name:var(--w-display)] text-lg">{value}</dd>
                </div>
              ))}
            </dl>

            {/* Допник «Магнитные кнопки». */}
            <Addon id="magnetic" flag inline className="mt-8">
              <Magnetic>
                <Link
                  href={`/mavera/lux/${featured.slug}`}
                  prefetch={false}
                  className="inline-block border border-[var(--w-ink)] px-8 py-3.5 text-sm transition-colors duration-300 hover:bg-[var(--w-ink)] hover:text-[var(--w-surface)]"
                >
                  Выбрать квартиру в проекте
                </Link>
              </Magnetic>
            </Addon>
          </Rise>
        </div>
      </section>

      {/* Лента объектов — листается, как страницы журнала. */}
      <section id="projects" className="scroll-mt-6 py-20">
        <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8">
          <Rise className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-[clamp(1.8rem,3vw,2.8rem)]">{voice.portfolio.title}</h2>
            <p className="max-w-xs text-sm italic text-[var(--w-muted)]">{voice.portfolio.note}</p>
          </Rise>
        </div>

        <Rise delay={100} className="w-rail mt-10 flex gap-6 overflow-x-auto px-5 pb-6 sm:px-8">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/mavera/lux/${project.slug}`}
              prefetch={false}
              className="group w-[min(78vw,22rem)] shrink-0"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={project.photo}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 22rem, 78vw"
                  className="object-cover transition-transform duration-700 ease-[var(--w-ease)] hover:scale-[1.04] motion-reduce:transform-none"
                />
              </div>
              <p className="mt-4 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--w-accent)]">
                {project.segment} · {project.status}
              </p>
              <h3 className="mt-2 text-2xl">ЖК «{project.name}»</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--w-muted)]">{voice.claims[project.slug]}</p>
              <p className="mt-3 font-[family-name:var(--w-display)] text-lg">
                от {money(project.priceUsd, "uzs")}
                <span className="ml-1 text-sm text-[var(--w-muted)]">за м²</span>
              </p>
              <p className="mt-2 text-sm text-[var(--w-accent)]">
                Выбрать квартиру
                <span aria-hidden="true" className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </p>
            </Link>
          ))}
        </Rise>
      </section>

      {/* Разворот: интерьер и текст в две колонки. */}
      <section id="interior" className="scroll-mt-6 border-y border-[var(--w-line)]">
        <div className="mx-auto grid w-full max-w-[1500px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:gap-16">
          <Rise delay={80} className="lg:col-span-5 lg:order-2">
            <ParallaxFigure
              src="/images/mavera/interior.jpg"
              alt="Интерьер квартиры"
              className="aspect-[4/5]"
              depth={30}
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </Rise>

          <Rise className="lg:col-span-7 lg:order-1">
            <h2 className="text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.1]">
              Что остаётся, когда съезжает мебель
            </h2>
            <div className="mt-8 text-base leading-[1.8] text-[var(--w-muted)] lg:columns-2 lg:gap-10">
              <p className="mb-5">
                Планировка переживает три поколения жильцов, отделка — одно. Поэтому в
                проектах MAVERA сначала считают, как квартира разделится на комнаты через
                десять лет, а уже потом выбирают ламинат.
              </p>
              <p className="mb-5">
                Кухня-гостиная с окном в пол, спальня с прямым доступом к санузлу,
                кладовая, в которую помещается велосипед. Ни одного «тёмного» помещения:
                каждое имеет естественный свет или примыкает к нему.
              </p>
              <p>
                Высота потолка 2,9 метра в комфорте и 3,1 в бизнесе — разница
                чувствуется на второй день, а не на экскурсии.
              </p>
            </div>
          </Rise>
        </div>
      </section>

      {/* Только в «Люксе»: район как часть предложения. */}
      <section id="district" className="mx-auto w-full max-w-[1500px] scroll-mt-6 px-5 py-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <Rise className="lg:col-span-4">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">Район</p>
            <h2 className="mt-5 text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.08]">{district.title}</h2>
            <p className="mt-5 text-lg leading-[1.7] text-[var(--w-muted)]">{district.lead}</p>
          </Rise>

          <div className="lg:col-span-7 lg:col-start-6">
            <dl className="grid gap-x-10 sm:grid-cols-2">
              {district.points.map((point, index) => (
                <Rise key={point.title} delay={index * 70} className="border-t border-[var(--w-line)] py-6">
                  <dt className="font-[family-name:var(--w-display)] text-2xl">{point.title}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-[var(--w-muted)]">{point.text}</dd>
                </Rise>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Только в «Люксе»: из чего сделан дом. */}
      <section id="materials" className="scroll-mt-6 border-y border-[var(--w-line)] bg-[var(--w-paper)]">
        <div className="mx-auto w-full max-w-[1500px] px-5 py-20 sm:px-8">
          <Rise className="max-w-2xl">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">
              Материалы
            </p>
            <h2 className="mt-5 text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.08]">
              Из чего сделан дом
            </h2>
          </Rise>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {materials.map((item, index) => (
              <Rise as="figure" key={item.title} delay={index * 90}>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={item.photo}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[var(--w-ease)] hover:scale-[1.04] motion-reduce:transform-none"
                  />
                </div>
                <figcaption className="mt-5">
                  <h3 className="font-[family-name:var(--w-display)] text-2xl">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--w-muted)]">{item.text}</p>
                </figcaption>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* Только в «Люксе»: как проходит показ. */}
      <section className="mx-auto w-full max-w-[1500px] px-5 py-20 sm:px-8">
        <Rise className="max-w-2xl">
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">Показ</p>
          <h2 className="mt-5 text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.08]">{voice.steps.title}</h2>
          <p className="mt-5 text-lg leading-[1.7] text-[var(--w-muted)]">{voice.steps.note}</p>
        </Rise>

        <ol className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {voice.steps.items.map((step, index) => (
            <Rise as="li" key={step.title} delay={index * 80} className="border-t border-[var(--w-line)] pt-6">
              <span className="font-[family-name:var(--w-display)] text-sm text-[var(--w-accent)]">
                {index + 1}
              </span>
              <h3 className="mt-3 font-[family-name:var(--w-display)] text-2xl">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--w-muted)]">{step.text}</p>
            </Rise>
          ))}
        </ol>
      </section>

      {/* Цифры — редакционно, засечными. */}
      <section className="mx-auto w-full max-w-[1500px] px-5 py-20 sm:px-8">
        <Rise className="max-w-2xl">
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">
            {voice.stats.eyebrow}
          </p>
          <h2 className="mt-5 text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.08]">{voice.stats.title}</h2>
        </Rise>

        <dl className="mt-12 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Rise key={stat.label} delay={index * 70} className="border-t border-[var(--w-line)] pt-6">
              <dd className="font-[family-name:var(--w-display)] text-[clamp(2.4rem,4vw,3.4rem)] leading-none">
                {stat.value}
                {stat.suffix ? (
                  <span className="ml-2 text-base text-[var(--w-accent)]">{stat.suffix}</span>
                ) : null}
              </dd>
              <dt className="mt-3 text-sm text-[var(--w-muted)]">{stat.label}</dt>
            </Rise>
          ))}
        </dl>
      </section>

      {/* Допники «Отзывы» и «Новости» — перед купоном. */}
      <Addon id="reviews" as="section" className="border-t border-[var(--w-line)] bg-[var(--w-paper)]">
        <Reviews variant="lux" />
      </Addon>
      <Addon id="news" as="section" className="border-t border-[var(--w-line)]">
        <News variant="lux" />
      </Addon>

      {/* Запись на показ — купон в конце выпуска. */}
      <section id="coupon" className="scroll-mt-6 bg-[var(--w-paper)]">
        <div className="mx-auto w-full max-w-[1500px] px-5 py-20 sm:px-8">
          <Rise className="mx-auto max-w-3xl border-2 border-dashed border-[var(--w-accent)] bg-[var(--w-surface)] p-8 text-center sm:p-12">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">
              {voice.closing.eyebrow}
            </p>
            <h2 className="mt-5 text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.1]">
              {voice.closing.title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--w-muted)]">
              {voice.closing.text}
            </p>
            <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Телефон"
                className="flex-1 border border-[var(--w-line)] bg-[var(--w-bg)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--w-accent)]"
              />
              <DemoSubmit
                label={voice.closing.primary}
                done="Записали. Менеджер подтвердит время показа."
                className="bg-[var(--w-accent)] px-7 py-3 text-sm font-medium text-[var(--w-accent-ink)] transition-opacity hover:opacity-90"
              />
            </div>
          </Rise>
        </div>
      </section>

      <footer className="border-t border-[var(--w-line)]">
        <div className="mx-auto w-full max-w-[1500px] px-5 py-10 sm:px-8">
          <p className="text-center font-[family-name:var(--w-display)] text-2xl tracking-[0.3em]">
            MAVERA
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-t border-[var(--w-line)] pt-6 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--w-muted)]">
            <span>Ташкент, ул. ______, 00</span>
            <span>+998 (__) ___-__-__</span>
            <span>Instagram</span>
            <span>Telegram</span>
            <span>WhatsApp</span>
          </div>
        </div>
      </footer>
    </ConfiguratorProvider>
  );
}
