"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { company } from "@/content/akbar/company";
import type { MenuCategory } from "@/lib/akbar/menu";
import { useCalmMotion } from "@/lib/calm-motion";

const NAV = [
  { label: "Двери", href: "/akbar/katalog/eksklyuziv" },
  { label: "Конструктор", href: "/akbar#konstruktor" },
  { label: "Панели", href: "/akbar/katalog/paneli-eksklyuziv" },
  { label: "Шоурум", href: "/akbar#shourum" },
];

const COMPANY = [
  { label: "О фабрике", href: "/akbar#fabrika" },
  { label: "Шоурум и контакты", href: "/akbar#shourum" },
  { label: "Дилерам", href: "/akbar#partneram" },
  { label: "Корпоративным клиентам", href: "/akbar#partneram" },
];

const SERVICES = [
  { label: "Конструктор двери", href: "/akbar#konstruktor" },
  { label: "Бесплатная консультация", href: "/akbar#zayavka" },
  { label: "Доставка и установка", href: "/akbar#servis" },
  { label: "Мебель на заказ", href: "/akbar#zayavka" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Шапка и полноэкранное меню.
 *
 * У фабрики в бургере шесть категорий и тридцать разделов, но половина
 * разделов пуста. Здесь меню — это витрина: у дверей девять разделов с
 * обложками, у остальных — список разделов с первыми позициями, чтобы
 * было видно, что внутри не пусто. Справа — компания, сервисы и телефоны.
 */
export function HeaderBar({ menu }: { menu: MenuCategory[] }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    trigger.current?.focus();
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled
            ? "bg-ak-ivory/85 shadow-[0_1px_0_rgb(22_18_14/0.08)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[110rem] items-center justify-between gap-4 px-4 sm:px-8 lg:h-20 lg:px-[4vw]">
          <div className="flex items-center gap-7">
            <button
              ref={trigger}
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
              className="flex h-11 items-center gap-3 rounded-full border border-ak-ink/25 px-3 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:border-ak-ink sm:px-4"
            >
              <svg aria-hidden="true" width="22" height="12" viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M0 1h22M0 6h22M0 11h14" />
              </svg>
              <span className="max-sm:sr-only">Меню</span>
            </button>
            <nav aria-label="Разделы" className="hidden gap-6 text-[0.8125rem] font-medium xl:flex">
              {NAV.map((item) => (
                <Link key={item.label} href={item.href} className="transition-colors hover:text-ak-gold-600">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link href="/akbar" className="absolute left-1/2 -translate-x-1/2 text-center" aria-label="Akbar Rich — на главную">
            <span className="block font-ak-display text-xl font-semibold tracking-[0.22em] sm:text-2xl lg:text-[1.75rem]">
              AKBAR RICH
            </span>
            <span className="mt-0.5 hidden text-[0.55rem] tracking-[0.42em] text-ak-gold-600 sm:block">
              KO‘NGIL TINCH · С {company.since}
            </span>
          </Link>

          <div className="flex items-center gap-5">
            <a
              href={company.phones[0].href}
              className="hidden text-sm font-semibold tabular-nums transition-colors hover:text-ak-gold-600 lg:block"
            >
              {company.phones[0].label}
            </a>
            <Link href="/akbar#zayavka" className="ak-btn ak-btn-ink hidden min-h-11 px-5 text-[0.8125rem] sm:inline-flex">
              Получить расчёт
            </Link>
            <a
              href={company.phones[0].href}
              aria-label={`Позвонить: ${company.phones[0].label}`}
              className="grid h-11 w-11 place-items-center rounded-full bg-ak-ink text-ak-ivory sm:hidden"
            >
              <PhoneIcon />
            </a>
          </div>
        </div>
      </header>

      <AnimatePresence>{open && <Menu menu={menu} onClose={close} />}</AnimatePresence>
    </>
  );
}

function Menu({ menu, onClose }: { menu: MenuCategory[]; onClose: () => void }) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const calm = useCalmMotion();
  const current = menu[active];

  useEffect(() => {
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const item = (order: number) =>
    calm
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay: 0.18 + order * 0.05, ease: EASE },
        };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Меню"
      data-ak-menu="open"
      initial={calm ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
      animate={calm ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
      exit={calm ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: calm ? 0.2 : 0.75, ease: EASE }}
      className="ak-grain fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ak-ink text-ak-ivory"
      onClick={(event) => {
        // Переход по ссылке внутри меню закрывает его.
        if ((event.target as HTMLElement).closest("a")) onClose();
      }}
    >
      <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-ak-ivory/10 bg-ak-ink px-4 sm:px-8 lg:h-20 lg:px-[4vw]">
        <button
          ref={closeButton}
          type="button"
          onClick={onClose}
          className="flex h-11 items-center gap-3 rounded-full border border-ak-ivory/30 px-4 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:border-ak-gold-300 hover:text-ak-gold-300"
        >
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M2 2l12 12M14 2L2 14" />
          </svg>
          Закрыть
        </button>
        <span className="font-ak-display text-xl font-semibold tracking-[0.22em] sm:text-2xl">AKBAR RICH</span>
        <span className="flex gap-3 text-xs font-semibold tracking-[0.14em]">
          <span className="text-ak-gold-300" aria-current="true">RU</span>
          <span className="text-ak-ivory/55">UZ</span>
          <span className="max-sm:hidden text-ak-ivory/55">EN</span>
        </span>
      </div>

      <div className="mx-auto grid w-full max-w-[110rem] flex-1 gap-10 px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)_14rem] lg:gap-14 lg:px-[4vw] lg:py-12">
        {/* Категории: на телефоне — раскрывающийся список, на широком экране — выбор. */}
        <nav aria-label="Каталог">
          <motion.p {...item(0)} className="ak-eyebrow text-ak-gold-300">
            Каталог
          </motion.p>
          <ul className="mt-5">
            {menu.map((category, index) => (
              <motion.li key={category.id} {...item(index + 1)} className="border-b border-ak-ivory/10">
                <button
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => {
                    setActive(index);
                    setExpanded((value) => (value === index ? null : index));
                  }}
                  aria-expanded={expanded === index}
                  className={`group flex w-full items-baseline gap-4 py-3.5 text-left transition-colors lg:py-3 ${
                    active === index ? "lg:text-ak-gold-300" : "hover:text-ak-gold-300"
                  }`}
                >
                  <span className="w-6 text-[0.7rem] font-semibold tracking-[0.1em] text-ak-muted-2">
                    0{index + 1}
                  </span>
                  <span className="flex-1 font-ak-display text-[1.75rem] font-medium leading-[1.05] lg:text-[2rem]">
                    {category.name}
                  </span>
                  <span className="text-xs text-ak-muted-2">{category.subs.length}</span>
                </button>
                {expanded === index && (
                  <ul className="grid gap-1 pb-4 pl-10 lg:hidden">
                    {category.subs.map((sub) => (
                      <li key={sub.href}>
                        <Link href={sub.href} className="flex justify-between gap-4 py-2 text-[0.9375rem]">
                          {sub.name}
                          <span className="text-xs text-ak-muted-2">{sub.count}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Разделы выбранной категории. */}
        <section aria-label={current.name} className="hidden lg:block">
          <div className="flex items-baseline justify-between gap-6">
            <h2 className="font-ak-display text-[2.75rem] font-medium leading-none">{current.name}</h2>
            <Link href={current.href} className="ak-eyebrow shrink-0 text-ak-gold-300 hover:text-ak-ivory">
              Все разделы →
            </Link>
          </div>

          {current.id === "1" ? (
            <ul key={current.id} className="mt-7 grid grid-cols-3 gap-4">
              {current.subs.map((sub, index) => (
                <motion.li key={sub.href} {...item(index)}>
                  <Link href={sub.href} className="group block">
                    <span className="relative block aspect-[16/11] overflow-hidden rounded-xl bg-ak-ink-2">
                      <Image
                        src={sub.cover}
                        alt=""
                        fill
                        sizes="16vw"
                        className="object-cover object-[50%_30%] transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </span>
                    <span className="mt-2.5 flex justify-between gap-3 text-[0.8125rem] font-semibold">
                      {sub.name}
                      <span className="font-medium text-ak-muted-2">{sub.count}</span>
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          ) : (
            <div key={current.id}>
              <motion.div {...item(0)} className="relative mt-7 aspect-[1200/400] overflow-hidden rounded-2xl bg-ak-ink-2">
                <Image src={current.cover} alt="" fill sizes="50vw" className="object-cover" />
              </motion.div>
              <ul className="mt-5 grid grid-cols-2 gap-x-10">
                {current.subs.map((sub, index) => (
                  <motion.li key={sub.href} {...item(index + 1)} className="border-b border-ak-ivory/10">
                    <Link href={sub.href} className="group flex items-center gap-4 py-3.5">
                      <span className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-ak-ink-2">
                        <Image src={sub.cover} alt="" fill sizes="48px" className="object-cover" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex justify-between gap-3 text-[0.9375rem] font-medium group-hover:text-ak-gold-300">
                          {sub.name}
                          <span className="shrink-0 text-xs font-normal text-ak-muted-2">{sub.count}</span>
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-ak-muted-2">{sub.sample.join(" · ")}</span>
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Компания, сервисы и связь. */}
        <aside className="grid gap-9 sm:grid-cols-3 lg:grid-cols-1 lg:content-start">
          <LinkGroup title="Компания" links={COMPANY} />
          <LinkGroup title="Сервисы" links={SERVICES} />
          <div>
            <p className="ak-eyebrow text-ak-gold-300">Отдел продаж</p>
            {company.phones.map((phone) => (
              <a key={phone.href} href={phone.href} className="mt-3 block text-lg font-semibold tabular-nums hover:text-ak-gold-300">
                {phone.label}
              </a>
            ))}
            <p className="mt-3 text-xs leading-relaxed text-ak-muted-2">
              {company.schedule[0].hours.join(", ")}
            </p>
            <p className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em]">
              {company.socials.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener" className="hover:text-ak-gold-300">
                  {social.label}
                </a>
              ))}
            </p>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}

function LinkGroup({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="ak-eyebrow text-ak-gold-300">{title}</p>
      <ul className="mt-3 grid gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-[0.9375rem] transition-colors hover:text-ak-gold-300">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PhoneIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  );
}
