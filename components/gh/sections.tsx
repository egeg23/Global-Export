"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useDepth } from "@/components/gh/depth";
import { Rise } from "@/components/mavera/reveal";
import { awards, contacts, nav, news, progress, steps } from "@/content/gh/company";
import { photo } from "@/content/gh/photos";
import { projects, type Project } from "@/content/gh/projects";
import { cn } from "@/lib/cn";

/**
 * Разделы страницы.
 *
 * Порядок повторяет их сайт — квартиры, ипотека, коммерция, новости,
 * контакты, — потому что заказчик должен узнать свой сайт, а не изучать
 * новый. Меняется не состав, а глубина: каждый крупный кадр разложен на
 * слои, которые расходятся при прокрутке, а на компьютере ещё и уводятся
 * от курсора.
 */

/* ------------------------------------------------------------------ */
/* Шапка                                                               */
/* ------------------------------------------------------------------ */

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--w-line)]/70 bg-[var(--w-bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1560px] items-center justify-between gap-5 px-5 py-3.5 sm:px-8">
        <a href="#hero" className="shrink-0" aria-label="Golden House, наверх">
          <Image
            src="/images/gh/logo.svg"
            alt="Golden House"
            width={469}
            height={57}
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
          <a href={contacts.phoneHref} className="hidden text-sm font-medium sm:inline">
            {contacts.phone}
          </a>
          <Link
            href="/gh/panel"
            className="rounded-full border border-[var(--w-line)] px-4 py-2 text-[0.78rem] transition-colors hover:border-[var(--w-accent)]"
          >
            Войти
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Меню"
            className="rounded-full border border-[var(--w-line)] p-2.5 xl:hidden"
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
                  className="block rounded-lg px-3 py-2.5 text-[0.92rem] hover:bg-[var(--w-paper)]"
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
/* Общая обвязка раздела                                               */
/* ------------------------------------------------------------------ */

export function Section({
  id,
  eyebrow,
  title,
  note,
  tone = "bg",
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  note?: string;
  tone?: "bg" | "paper";
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 py-20 sm:py-28",
        tone === "paper" && "rounded-[var(--w-radius-xl)] bg-[var(--w-paper)]",
      )}
    >
      <div className="mx-auto w-full max-w-[1560px] px-5 sm:px-8">
        <Rise className="flex flex-wrap items-end justify-between gap-6">
          <div>
            {eyebrow ? (
              <p className="text-[0.66rem] uppercase tracking-[0.34em] text-[var(--w-accent)]">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="gh-rule mt-4 max-w-2xl text-[clamp(1.7rem,3.4vw,2.7rem)] leading-[1.08]">
              {title}
            </h2>
          </div>
          {note ? <p className="max-w-sm text-sm text-[var(--w-muted)]">{note}</p> : null}
        </Rise>

        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Награды                                                             */
/* ------------------------------------------------------------------ */

export function Awards() {
  return (
    <div className="mx-auto w-full max-w-[1560px] px-5 sm:px-8">
      <ul className="grid gap-px overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-line)] md:grid-cols-3">
        {awards.map((award, index) => (
          <Rise as="li" key={award.title} delay={index * 90} className="bg-[var(--w-surface)] p-7">
            <p className="text-[1.02rem] font-medium leading-snug text-[var(--w-ink)]">
              {award.title}
            </p>
            <p className="mt-3 text-[0.82rem] leading-relaxed text-[var(--w-muted)]">{award.note}</p>
          </Rise>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Жилые комплексы                                                     */
/* ------------------------------------------------------------------ */

export function Projects() {
  const [active, setActive] = useState(projects[0].slug);
  const current = projects.find((item) => item.slug === active) ?? projects[0];

  return (
    <div>
      <div className="w-rail -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
        {projects.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => setActive(item.slug)}
            aria-pressed={item.slug === active}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-[0.8rem] transition-colors",
              item.slug === active
                ? "border-[var(--w-accent)] bg-[var(--w-accent)] text-[var(--w-accent-ink)]"
                : "border-[var(--w-line)] text-[var(--w-muted)] hover:border-[var(--w-accent)]",
            )}
          >
            {item.name}
          </button>
        ))}
      </div>

      <ProjectCard key={current.slug} project={current} />
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const frame = useDepth<HTMLDivElement>(-34);

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_1fr]">
      <div
        ref={frame}
        className="relative aspect-[16/10] overflow-hidden rounded-[var(--w-radius-lg)] bg-[var(--w-paper)]"
        style={{ "--gh-pull": "12px" } as React.CSSProperties}
      >
        <Image
          src={photo(project.photo)}
          alt={`${project.kind} ${project.name}`}
          fill
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="gh-depth scale-[1.06] object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 bg-gradient-to-t from-black/55 to-transparent p-5">
          <Tag>{project.segment}</Tag>
          <Tag>{project.district} район</Tag>
          <Tag>{project.floors}</Tag>
          <Tag>{project.stage}</Tag>
        </div>
      </div>

      <div>
        <p className="text-[0.66rem] uppercase tracking-[0.3em] text-[var(--w-accent)]">
          {project.kind}
        </p>
        <h3 className="mt-3 text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight">{project.name}</h3>
        <p className="mt-3 text-[0.98rem] text-[var(--w-ink)]">{project.claim}</p>
        <p className="mt-4 text-[0.92rem] leading-relaxed text-[var(--w-muted)]">{project.about}</p>

        <ul className="mt-6 grid gap-2.5">
          {project.features.map((feature) => (
            <li key={feature} className="flex gap-3 text-[0.88rem] leading-snug">
              <span className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-[var(--gh-gold)]" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.near.map((place) => (
            <span
              key={place}
              className="rounded-full border border-[var(--w-line)] px-3 py-1.5 text-[0.76rem] text-[var(--w-muted)]"
            >
              {place}
            </span>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <a
            href="#picker"
            className="rounded-full bg-[var(--w-accent)] px-5 py-2.5 text-sm text-[var(--w-accent-ink)] transition-opacity hover:opacity-90"
          >
            Квартиры в комплексе
          </a>
          <span className="text-[0.82rem] text-[var(--w-muted)]">
            Площади {project.area[0]}–{project.area[1]} м²
          </span>
        </div>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-black/25 px-3 py-1.5 text-[0.72rem] text-white backdrop-blur-sm">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Коммерция                                                           */
/* ------------------------------------------------------------------ */

export function Commerce() {
  const frame = useDepth<HTMLDivElement>(-26);

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
      <div
        ref={frame}
        className="relative aspect-[4/3] overflow-hidden rounded-[var(--w-radius-lg)]"
        style={{ "--gh-pull": "14px" } as React.CSSProperties}
      >
        <Image
          src={photo("makon-street")}
          alt="Коммерческие помещения на первых этажах"
          fill
          sizes="(max-width: 1024px) 100vw, 46vw"
          className="gh-depth scale-[1.08] object-cover"
        />
      </div>

      <div>
        <p className="text-[0.98rem] leading-relaxed text-[var(--w-muted)]">
          Первые этажи кварталов отданы коммерции: аптеки, пекарни, кофейни, детские
          студии — то, за чем жильцы выходят из подъезда, а не садятся в машину.
          Помещения продаются и сдаются тем же отделом, что и квартиры, но по своему
          графику: Пн–Пт, 9:00–18:00.
        </p>

        <ul className="mt-7 grid gap-px overflow-hidden rounded-[var(--w-radius)] border border-[var(--w-line)] bg-[var(--w-line)] sm:grid-cols-2">
          {[
            ["Витрины в пол", "Высота потолков и остекление под вывеску"],
            ["Отдельный вход", "С улицы и с бульвара, без общего подъезда"],
            ["Готовая проходимость", "30 тысяч жителей в домах группы"],
            ["Эксклюзивные скидки", "По опросу отдела коммерции"],
          ].map(([title, note], index) => (
            <Rise as="li" key={title} delay={index * 70} className="bg-[var(--w-surface)] p-5">
              <p className="text-[0.92rem] font-medium">{title}</p>
              <p className="mt-1.5 text-[0.8rem] text-[var(--w-muted)]">{note}</p>
            </Rise>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ход строительства                                                   */
/* ------------------------------------------------------------------ */

export function Progress() {
  return (
    <ol className="relative grid gap-0 border-l border-[var(--w-line)] pl-6 sm:pl-8">
      {progress.map((item, index) => (
        <Rise as="li" key={item.quarter} delay={index * 80} className="relative pb-9 last:pb-0">
          <span
            className={cn(
              "absolute -left-[calc(1.5rem+5px)] top-1.5 size-2.5 rounded-full sm:-left-[calc(2rem+5px)]",
              item.done === 100 ? "bg-[var(--w-accent)]" : "bg-[var(--w-line)]",
            )}
          />
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="text-[0.76rem] uppercase tracking-[0.18em] text-[var(--w-accent)]">
              {item.quarter}
            </span>
            <h3 className="text-[1.05rem]">{item.title}</h3>
          </div>
          <p className="mt-2 text-[0.88rem] text-[var(--w-muted)]">{item.note}</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-[var(--w-line)]">
              <span
                className="block h-full rounded-full bg-[var(--gh-gold)]"
                style={{ width: `${item.done}%` }}
              />
            </span>
            <span className="text-[0.76rem] text-[var(--w-muted)]">{item.done}%</span>
          </div>
        </Rise>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Пять шагов покупки                                                  */
/* ------------------------------------------------------------------ */

export function Steps() {
  return (
    <ol className="grid gap-px overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-line)] md:grid-cols-5">
      {steps.map((step, index) => (
        <Rise as="li" key={step.title} delay={index * 70} className="bg-[var(--w-surface)] p-6">
          <span className="text-[2rem] font-semibold leading-none text-[var(--w-accent-soft)]">
            {index + 1}
          </span>
          <p className="mt-3 text-[0.98rem] font-medium leading-snug">{step.title}</p>
          <p className="mt-2.5 text-[0.82rem] leading-relaxed text-[var(--w-muted)]">{step.text}</p>
        </Rise>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Новости и акции                                                     */
/* ------------------------------------------------------------------ */

export function News() {
  return (
    <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {news.map((item, index) => (
        <Rise
          as="li"
          key={item.title}
          delay={index * 80}
          className="flex flex-col rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-6"
        >
          <div className="flex items-center gap-3 text-[0.72rem] text-[var(--w-muted)]">
            <span>{item.date}</span>
            <span className="rounded-full bg-[var(--w-accent-soft)] px-2.5 py-1 text-[var(--w-accent)]">
              {item.tag}
            </span>
          </div>
          <h3 className="mt-4 text-[1.02rem] leading-snug">{item.title}</h3>
          <p className="mt-3 text-[0.85rem] leading-relaxed text-[var(--w-muted)]">{item.text}</p>
        </Rise>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Контакты и подвал                                                   */
/* ------------------------------------------------------------------ */

export function Contacts() {
  const frame = useDepth<HTMLDivElement>(-22);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-stretch">
      <Rise className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-7 sm:p-9">
        <p className="text-[0.66rem] uppercase tracking-[0.3em] text-[var(--w-accent)]">
          Офис продаж
        </p>
        <p className="mt-4 text-[1.06rem] leading-relaxed">{contacts.address}</p>
        <p className="mt-2 text-[0.86rem] text-[var(--w-muted)]">{contacts.landmark}</p>
        <p className="mt-2 text-[0.8rem] text-[var(--w-muted)]">{contacts.geo.label}</p>

        <dl className="mt-7 grid gap-3 border-t border-[var(--w-line)] pt-6 text-[0.88rem]">
          {contacts.hours.map(([what, when]) => (
            <div key={what} className="flex flex-wrap justify-between gap-2">
              <dt className="text-[var(--w-muted)]">{what}</dt>
              <dd>{when}</dd>
            </div>
          ))}
        </dl>

        <a
          href={contacts.phoneHref}
          className="mt-7 inline-flex rounded-full bg-[var(--w-accent)] px-6 py-3 text-sm text-[var(--w-accent-ink)] transition-opacity hover:opacity-90"
        >
          {contacts.phone}
        </a>
      </Rise>

      <div
        ref={frame}
        className="relative min-h-[18rem] overflow-hidden rounded-[var(--w-radius-lg)]"
        style={{ "--gh-pull": "10px" } as React.CSSProperties}
      >
        <Image
          src={photo("aerial")}
          alt="Квартал Golden House с высоты"
          fill
          sizes="(max-width: 1024px) 100vw, 52vw"
          className="gh-depth scale-[1.08] object-cover"
        />
        <span className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--gh-gold)] shadow-lg" />
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--w-line)] py-12">
      <div className="mx-auto flex w-full max-w-[1560px] flex-wrap items-start justify-between gap-8 px-5 sm:px-8">
        <div>
          <Image
            src="/images/gh/logo.svg"
            alt="Golden House"
            width={469}
            height={57}
            className="h-6 w-auto"
          />
          <p className="mt-4 max-w-md text-[0.78rem] leading-relaxed text-[var(--w-muted)]">
            ООО «Golden House Development». Информация на странице носит
            ознакомительный характер и не является публичной офертой. Точную
            стоимость и условия уточняйте в отделе продаж.
          </p>
        </div>

        <div className="text-[0.8rem] text-[var(--w-muted)]">
          <p>
            По вопросам трудоустройства: {contacts.hr},{" "}
            <a href={`mailto:${contacts.hrEmail}`} className="underline underline-offset-4">
              {contacts.hrEmail}
            </a>
          </p>
          <p className="mt-2">
            <Link href="/gh/panel" className="underline underline-offset-4">
              Панель управления
            </Link>
          </p>
        </div>
      </div>

      <p className="mx-auto mt-10 w-full max-w-[1560px] px-5 text-[0.72rem] leading-relaxed text-[var(--w-muted)]/70 sm:px-8">
        Макет подготовлен студией DevUz для Golden House. Логотип, фотографии и
        тексты принадлежат Golden House; снимок планеты — мозаика NASA Blue Marble.
        Закрытый показ, копирование и передача третьим лицам запрещены.
      </p>
    </footer>
  );
}
