"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { useStage } from "@/components/showcase/depth";
import { Rise } from "@/components/mavera/reveal";
import { contacts, faq, nav, partners, steps, virtues } from "@/content/nm/company";
import { days } from "@/content/nm/calc";
import { compare, kinds, projects, type Kind } from "@/content/nm/projects";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/* Шапка                                                               */
/* ------------------------------------------------------------------ */

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--w-line)]/70 bg-[var(--w-bg)]/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-6 px-5 py-3.5 sm:px-8">
        <a href="#hero" aria-label="Namuna, наверх" className="shrink-0">
          <Image
            src="/images/nm/logo.webp"
            alt="Namuna — фабрика комфорта"
            width={718}
            height={127}
            priority
            className="h-[26px] w-auto sm:h-[30px]"
          />
        </a>

        <nav className="hidden gap-7 text-[0.84rem] text-[var(--w-muted)] xl:flex">
          {nav.map(([label, href]) => (
            <a key={href} href={href} className="transition-colors hover:text-[var(--w-ink)]">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href={contacts.branches[0].phoneHref}
            className="hidden text-sm font-medium sm:inline"
          >
            {contacts.branches[0].phone}
          </a>
          <Link
            href="/namuna/panel"
            className="rounded-[var(--w-radius)] border border-[var(--w-line)] px-4 py-2 text-[0.78rem] transition-colors hover:border-[var(--w-accent)]"
          >
            Войти
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Меню"
            className="cursor-pointer rounded-[var(--w-radius)] border border-[var(--w-line)] p-2.5 xl:hidden"
          >
            <span className="block h-px w-4 bg-current" />
            <span className="mt-1 block h-px w-4 bg-current" />
            <span className="mt-1 block h-px w-4 bg-current" />
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-[var(--w-line)] bg-[var(--w-surface)] px-5 py-4 sm:px-8 xl:hidden">
          <ul className="grid gap-1">
            {nav.map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block rounded-[var(--w-radius)] px-3 py-2.5 text-[0.92rem] hover:bg-[var(--w-paper)]"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Глава: общая обвязка раздела                                        */
/* ------------------------------------------------------------------ */

export function Chapter({
  id,
  number,
  title,
  lead,
  tone,
  children,
}: {
  id: string;
  number: string;
  title: React.ReactNode;
  lead?: string;
  /** «deep» — тёмная глава: токены переопределяются, компоненты те же. */
  tone?: "deep";
  children: React.ReactNode;
}) {
  const stage = useStage<HTMLElement>();

  return (
    <section
      ref={stage}
      id={id}
      data-tone={tone}
      className={cn(
        "relative isolate scroll-mt-24 overflow-x-clip py-20 sm:py-28",
        tone === "deep" && "py-24 sm:py-32",
      )}
    >
      {/* Номер главы водяным знаком в самой глубине: он и даёт понять,
          что страница не плоская, — цифра едет медленнее текста. */}
      <span
        aria-hidden
        className="w-layer pointer-events-none absolute -right-[3%] top-[6%] -z-10 hidden select-none font-[family-name:var(--w-display)] text-[16vw] leading-none text-[var(--nm-teal)] opacity-[0.045] md:block"
        style={{ "--w-depth": "190px", "--w-pull": "18px" } as React.CSSProperties}
      >
        {number.slice(0, 2)}
      </span>

      <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8">
        {/* Вход и глубина — на разных узлах: оба правят transform, и на
            одном узле побеждал бы тот, что описан ниже. */}
        <div
          className="w-layer max-w-3xl"
          style={{ "--w-depth": "-58px", "--w-pull": "-12px" } as React.CSSProperties}
        >
          <Rise>
            <p className="nm-chapter">{number}</p>
            <h2 className="nm-rule mt-5 text-[clamp(1.8rem,3.6vw,2.9rem)] leading-[1.08] text-[var(--nm-teal)]">
              {title}
            </h2>
            {lead ? (
              <p className="mt-6 text-[1rem] leading-relaxed text-[var(--w-muted)]">{lead}</p>
            ) : null}
          </Rise>
        </div>

        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

/* Тёмная глава красит заголовок не бирюзой, а бумагой. */
export function DeepTitle({ children }: { children: React.ReactNode }) {
  return <span className="text-[var(--w-ink)]">{children}</span>;
}

/* ------------------------------------------------------------------ */
/* Проекты: горизонтальная лента                                       */
/* ------------------------------------------------------------------ */

export function Projects() {
  const [kind, setKind] = useState<Kind | null>(null);
  const shown = kind ? projects.filter((p) => p.kind === kind) : projects;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Chip active={kind === null} onClick={() => setKind(null)}>
          Все работы
        </Chip>
        {kinds.map((item) => (
          <Chip key={item} active={kind === item} onClick={() => setKind(kind === item ? null : item)}>
            {item}
          </Chip>
        ))}
      </div>

      {/* Лента с прилипанием. На телефоне это естественный жест, на
          компьютере — колесо с shift и стрелки: фокус ходит по карточкам. */}
      <ul
        className="w-rail mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6"
        aria-label="Наши работы"
      >
        {shown.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </ul>

      <p className="text-[0.8rem] text-[var(--w-muted)]">
        Листайте вбок · {shown.length} из {projects.length} работ
      </p>
    </div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const stage = useStage<HTMLLIElement>();

  return (
    <li
      ref={stage}
      className={cn(
        "group relative w-[80vw] shrink-0 snap-start sm:w-[58vw] lg:w-[36vw] xl:w-[27vw]",
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-[var(--w-radius-lg)] bg-[var(--w-paper)]",
          project.tall ? "aspect-[3/4]" : "aspect-[4/3]",
        )}
      >
        <Image
          src={`/images/nm/${project.photo}.webp`}
          alt={project.title}
          fill
          loading={index < 2 ? "eager" : "lazy"}
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 58vw, 30vw"
          className="w-layer scale-[1.08] object-cover"
          style={{ "--w-depth": "-26px", "--w-pull": "10px" } as React.CSSProperties}
        />
      </div>

      <div className="mt-5">
        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--w-accent)]">
          {project.kind}
        </p>
        <h3 className="mt-2.5 text-[1.15rem] leading-snug text-[var(--nm-teal)]">
          {project.title}
        </h3>
        <p className="mt-2.5 text-[0.86rem] leading-relaxed text-[var(--w-muted)]">
          {project.note}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.materials.map((material) => (
            <li
              key={material}
              className="rounded-[var(--w-radius)] border border-[var(--w-line)] px-2.5 py-1 text-[0.74rem] text-[var(--w-muted)]"
            >
              {material}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "cursor-pointer rounded-[var(--w-radius)] border px-4 py-2 text-[0.82rem] transition-colors",
        active
          ? "border-[var(--nm-teal)] bg-[var(--nm-teal)] text-white"
          : "border-[var(--w-line)] text-[var(--w-muted)] hover:border-[var(--w-accent)]",
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Было / стало                                                        */
/* ------------------------------------------------------------------ */

/**
 * Шторка на ползунке, а не на перетаскивании.
 *
 * `input[type=range]` поверх кадра решает сразу три задачи: работает
 * пальцем, работает стрелками с клавиатуры и сам объявляет себя
 * скринридеру. Перетаскивание мышью пришлось бы писать отдельно — и
 * отдельно чинить для тех, у кого мыши нет.
 */
export function Compare() {
  const [split, setSplit] = useState(50);

  return (
    <figure>
      <div
        className="nm-compare aspect-[16/10] w-full rounded-[var(--w-radius-lg)] bg-[var(--w-paper)]"
        style={{ "--nm-split": split } as React.CSSProperties}
      >
        <Image
          src={`/images/nm/${compare.before}.webp`}
          alt={compare.beforeLabel}
          fill
          sizes="(max-width: 1024px) 100vw, 80vw"
          style={{ "--w-depth": "70px" } as React.CSSProperties}
          className="w-layer scale-110 object-cover"
        />
        <div className="nm-compare__after">
          <Image
            src={`/images/nm/${compare.after}.webp`}
            alt={compare.afterLabel}
            fill
            sizes="(max-width: 1024px) 100vw, 80vw"
            style={{ "--w-depth": "70px" } as React.CSSProperties}
            className="w-layer scale-110 object-cover"
          />
        </div>

        <div className="nm-compare__handle" aria-hidden>
          <span className="nm-compare__grip">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
              <path d="M9 6 4 12l5 6zM15 6l5 6-5 6z" />
            </svg>
          </span>
        </div>

        <span className="pointer-events-none absolute left-4 top-4 rounded-[var(--w-radius)] bg-[var(--nm-teal-deep)]/80 px-3 py-1.5 text-[0.72rem] text-[var(--nm-champagne)] backdrop-blur-sm">
          {compare.beforeLabel}
        </span>
        <span className="pointer-events-none absolute right-4 top-4 rounded-[var(--w-radius)] bg-[var(--nm-teal-deep)]/80 px-3 py-1.5 text-[0.72rem] text-[var(--nm-champagne)] backdrop-blur-sm">
          {compare.afterLabel}
        </span>

        <input
          type="range"
          min={0}
          max={100}
          value={split}
          onChange={(event) => setSplit(Number(event.target.value))}
          aria-label="Сдвиньте, чтобы сравнить: комната от застройщика и после нашей работы"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>

      <figcaption className="mt-4 text-[0.8rem] leading-relaxed text-[var(--w-muted)]">
        {compare.note}
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Производство: тёмная глава                                          */
/* ------------------------------------------------------------------ */

export function Production() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
      <ul className="grid gap-px overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-line)] sm:grid-cols-2">
        {virtues.map((item, index) => (
          <Rise
            as="li"
            key={item.title}
            delay={index * 70}
            className="bg-[var(--w-paper)] p-6"
          >
            <p className="text-[0.98rem] font-medium text-[var(--w-ink)]">{item.title}</p>
            <p className="mt-2.5 text-[0.84rem] leading-relaxed text-[var(--w-muted)]">
              {item.text}
            </p>
          </Rise>
        ))}
      </ul>

      <Rise className="relative aspect-[4/5] overflow-hidden rounded-[var(--w-radius-lg)] lg:sticky lg:top-28">
        <Image
          src="/images/nm/showroom.webp"
          alt="Салон фабрики: витрины, фурнитура и образцы материалов"
          fill
          sizes="(max-width: 1024px) 100vw, 46vw"
          style={{ "--w-depth": "90px", "--w-pull": "12px" } as React.CSSProperties}
          className="w-layer scale-110 object-cover"
        />
      </Rise>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Сроки: пять этапов с накоплением дней                               */
/* ------------------------------------------------------------------ */

export function Timeline() {
  // Даты пишутся прямо в узлы: часы во время отрисовки дали бы на сервере
  // и в браузере разные строки, а состояние ради пяти подписей — лишнюю
  // перерисовку всей ленты.
  const slots = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let passed = 0;
    steps.forEach((step, index) => {
      passed += step.days;
      const date = new Date();
      date.setDate(date.getDate() + passed);
      const node = slots.current[index];
      if (node) {
        node.textContent = `ориентировочно к ${date.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
        })}`;
      }
    });
  }, []);

  const total = steps.reduce((sum, step) => sum + step.days, 0);

  return (
    <div>
      <ol
        className="w-layer relative grid border-l border-[var(--w-line)] pl-7 sm:pl-9"
        style={{ "--w-depth": "-34px", "--w-pull": "-8px" } as React.CSSProperties}
      >
        {steps.map((step, index) => (
          <Rise as="li" key={step.title} delay={index * 80} className="relative pb-10 last:pb-0">
            <span className="absolute -left-[calc(1.75rem+4px)] top-2 size-2 rounded-full bg-[var(--w-accent)] sm:-left-[calc(2.25rem+4px)]" />
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--w-accent)]">
                Шаг {index + 1}
              </span>
              <h3 className="text-[1.1rem] text-[var(--nm-teal)]">{step.title}</h3>
              <span
                ref={(node) => {
                  slots.current[index] = node;
                }}
                className="text-[0.8rem] text-[var(--w-muted)]"
              />
            </div>
            <p className="mt-2.5 max-w-2xl text-[0.9rem] leading-relaxed text-[var(--w-muted)]">
              {step.text}
            </p>
          </Rise>
        ))}
      </ol>

      <p className="mt-8 border-t border-[var(--w-line)] pt-6 text-[0.86rem] text-[var(--w-muted)]">
        Всего около <b className="text-[var(--w-ink)]">{days(total)}</b> от заявки до
        установки при среднем объёме. Изготовление занимает 15–45 дней в
        зависимости от материалов; точный срок фиксируем вместе со сметой.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Бренды и жилые комплексы                                            */
/* ------------------------------------------------------------------ */

/**
 * Логотипов семнадцать, а сетка меняет число колонок: две, три, шесть.
 * Недобранный ряд показывает цвет линий насквозь, будто сетка сломалась,
 * поэтому добираем ряд пустыми ячейками того же фона. Считаем до
 * ближайшего кратного шести: оно делится и на два, и на три, так что
 * одного расчёта хватает на все три раскладки.
 */
function fillers(count: number) {
  const rest = (6 - (count % 6)) % 6;
  return Array.from({ length: rest }, (_, index) => `filler-${index}`);
}

/**
 * Волна: содержимое проявляется по очереди, а не всё разом.
 *
 * Наблюдатель один на всю сетку, а очередь держит CSS — каждой ячейке
 * достаётся свой номер в `--nm-i`, из него считается задержка. Двадцать
 * четыре наблюдателя ради двадцати четырёх логотипов были бы расточительством.
 */
function Wave({
  children,
  className,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  const [shown, setShown] = useState(false);

  const attach = useCallback((node: HTMLUListElement | null) => {
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <ul ref={attach} aria-label={label} data-wave={shown ? "in" : undefined} className={className}>
      {children}
    </ul>
  );
}

export function Partners() {
  return (
    <div className="grid gap-12">
      <div>
        <h3 className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--w-accent)]">
          Фурнитура, плита и техника
        </h3>
        <Wave className="nm-wave mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-line)] sm:grid-cols-3 lg:grid-cols-6">
          {partners.supply.map((brand, index) => (
            <li
              key={brand.file}
              style={{ "--nm-i": index } as React.CSSProperties}
              className="flex min-h-[6.5rem] items-center justify-center bg-[var(--w-surface)] p-5"
            >
              <Image
                src={`/images/nm/brands/${brand.file}.webp`}
                alt={brand.name}
                width={420}
                height={120}
                className="h-7 w-auto max-w-full object-contain sm:h-8"
              />
            </li>
          ))}
          {fillers(partners.supply.length).map((key, index) => (
            <li
              key={key}
              aria-hidden
              style={{ "--nm-i": partners.supply.length + index } as React.CSSProperties}
              className="bg-[var(--w-surface)]"
            />
          ))}
        </Wave>
      </div>

      <div>
        <h3 className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--w-accent)]">
          Меблированные жилые комплексы
        </h3>
        <Wave className="nm-wave mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-line)] sm:grid-cols-3 lg:grid-cols-6">
          {partners.housing.map((brand, index) => (
            <li
              key={brand.file}
              style={{ "--nm-i": index } as React.CSSProperties}
              className="flex min-h-[8rem] items-center justify-center bg-[var(--w-surface)] p-6"
            >
              <Image
                src={`/images/nm/brands/${brand.file}.webp`}
                alt={brand.name}
                width={420}
                height={210}
                className="h-11 w-auto max-w-full object-contain sm:h-12"
              />
            </li>
          ))}
        </Wave>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Вопросы                                                             */
/* ------------------------------------------------------------------ */

export function Faq() {
  return (
    <ul className="grid gap-px overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-line)]">
      {faq.map((item, index) => (
        <Rise as="li" key={item.q} delay={index * 50} className="bg-[var(--w-surface)]">
          <details className="group">
            <summary className="flex cursor-pointer items-center justify-between gap-6 p-6 text-[1rem] text-[var(--w-ink)]">
              {item.q}
              <span
                aria-hidden
                className="shrink-0 text-[var(--w-accent)] transition-transform group-open:rotate-45"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M11 5h2v14h-2z" />
                  <path d="M5 11h14v2H5z" />
                </svg>
              </span>
            </summary>
            <p className="px-6 pb-6 text-[0.9rem] leading-relaxed text-[var(--w-muted)]">
              {item.a}
            </p>
          </details>
        </Rise>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Контакты и подвал                                                   */
/* ------------------------------------------------------------------ */

export function Contacts() {
  const stage = useStage<HTMLDivElement>();

  return (
    <div ref={stage} className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-stretch">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
        {contacts.branches.map((branch) => (
          <Rise
            key={branch.city}
            className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-7"
          >
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--w-accent)]">
              {branch.city}
            </p>
            <a
              href={branch.phoneHref}
              className="mt-4 block text-[1.35rem] text-[var(--nm-teal)]"
            >
              {branch.phone}
            </a>
            <p className="mt-3 text-[0.92rem] leading-relaxed">{branch.address}</p>
            {branch.landmark ? (
              <p className="mt-1.5 text-[0.84rem] text-[var(--w-muted)]">{branch.landmark}</p>
            ) : null}
          </Rise>
        ))}
      </div>

      <div
        className="w-layer relative min-h-[20rem] overflow-hidden rounded-[var(--w-radius-lg)]"
        style={{ "--w-depth": "-22px", "--w-pull": "10px" } as React.CSSProperties}
      >
        <Image
          src="/images/nm/walk-in.webp"
          alt="Гардеробная, собранная фабрикой"
          fill
          sizes="(max-width: 1024px) 100vw, 52vw"
          className="scale-105 object-cover"
        />
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--w-line)] py-12">
      <div className="mx-auto flex w-full max-w-[1500px] flex-wrap items-start justify-between gap-8 px-5 sm:px-8">
        <div>
          <Image
            src="/images/nm/logo.webp"
            alt="Namuna"
            width={718}
            height={127}
            className="h-7 w-auto"
          />
          <p className="mt-4 max-w-md text-[0.78rem] leading-relaxed text-[var(--w-muted)]">
            Namuna — фабрика комфорта. Информация на странице носит
            ознакомительный характер и не является публичной офертой: точную
            стоимость называет отдел продаж после замера.
          </p>
        </div>

        <div className="text-[0.8rem] text-[var(--w-muted)]">
          <p>{contacts.social.join(" · ")}</p>
          <p className="mt-3">
            <Link href="/namuna/panel" className="underline underline-offset-4">
              Панель управления
            </Link>
          </p>
        </div>
      </div>

      <p className="mx-auto mt-10 w-full max-w-[1500px] px-5 text-[0.72rem] leading-relaxed text-[var(--w-muted)]/70 sm:px-8">
        Макет подготовлен студией DevUz для фабрики Namuna. Логотип,
        фотографии и тексты принадлежат Namuna.
      </p>
    </footer>
  );
}

/** Ссылка-якорь внизу тёмной главы — «мини-CTA» из схемы глав. */
export function DeepCta({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="mt-10 inline-flex cursor-pointer items-center gap-3 rounded-[var(--w-radius)] border border-[var(--w-accent)] px-6 py-3 text-sm text-[var(--w-accent)] transition-colors hover:bg-[var(--w-accent)] hover:text-[var(--w-accent-ink)]"
    >
      {children}
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M13 5l7 7-7 7v-5H4v-4h9z" />
      </svg>
    </a>
  );
}
