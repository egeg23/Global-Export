"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { SearchProvider } from "@/components/webname/hero";
import { Icon, type IconName } from "@/components/webname/icons";
import { LangPills, LangProvider, useT } from "@/components/webname/lang";
import { onScrollFrame, Parallax, reducedMotion } from "@/components/webname/motion";
import { contacts, tgHref } from "@/content/webname/facts";
import { cn } from "@/lib/cn";

export const PREMIUM = "/webname/premium";

/**
 * Каркас варианта «Премиум»: жидкий фон, стеклянная навигация, подвал.
 * Внутри — те же провайдеры, что у «Реестра» (языки, поиск), поэтому общие
 * блоки и пошаговые страницы работают без правок, а выглядят стеклом
 * (app/webname-premium.css).
 */
export function PremiumShell({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  // Преломление в стекле — только Chromium, мышь и широкий экран: Safari не
  // умеет url() в backdrop-filter, а телефону оно не по силам.
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const chromium = "chrome" in window && !/Edg\/|OPR\//.test(navigator.userAgent);
    const wide = window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches;
    if (chromium && wide && !reducedMotion()) node.classList.add("lg-refract");
  }, []);

  // Световое пятно за курсором на стекле — один обработчик на всю страницу.
  useEffect(() => {
    const node = root.current;
    if (!node || !window.matchMedia("(pointer: fine)").matches) return;
    let last: HTMLElement | null = null;
    const move = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(".lg-sheen");
      if (last && last !== target) last.style.setProperty("--lg-hover", "0");
      last = target ?? null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      target.style.setProperty("--my", `${event.clientY - rect.top}px`);
      target.style.setProperty("--lg-hover", "1");
    };
    node.addEventListener("pointermove", move, { passive: true });
    return () => node.removeEventListener("pointermove", move);
  }, []);

  return (
    <div ref={root} data-wn="premium" className="relative min-h-dvh overflow-x-clip">
      <LangProvider>
        <SearchProvider>
          <LiquidBackdrop />
          <GlassNav />
          {children}
          <PremiumFooter />
        </SearchProvider>
      </LangProvider>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Жидкий фон: три больших пятна плывут сами и с разной скоростью от
 * прокрутки. Фон закреплён за окном, поэтому стекло всегда есть что
 * преломлять. В разметке — фильтр преломления для стёкол.
 */
function LiquidBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#1d1430_0%,#0b0a10_60%)]" />
      <Parallax speed={0.05} className="absolute inset-0">
        <div className="lg-blob lg-drift-a left-[-12vw] top-[-8vh] h-[60vmax] w-[60vmax] bg-[radial-gradient(circle_at_center,rgb(200_48_74/0.55),transparent_62%)]" />
      </Parallax>
      <Parallax speed={-0.04} className="absolute inset-0">
        <div className="lg-blob lg-drift-b right-[-18vw] top-[18vh] h-[55vmax] w-[55vmax] bg-[radial-gradient(circle_at_center,rgb(217_168_92/0.38),transparent_62%)]" />
      </Parallax>
      <Parallax speed={0.08} className="absolute inset-0">
        <div className="lg-blob lg-drift-c bottom-[-25vh] left-[20vw] h-[50vmax] w-[50vmax] bg-[radial-gradient(circle_at_center,rgb(70_64_170/0.45),transparent_62%)]" />
      </Parallax>
      <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(rgb(255_255_255)_1px,transparent_1px)] [background-size:4px_4px]" />
      <svg width="0" height="0" className="absolute">
        <filter id="lg-refraction" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="4" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
          <feDisplacementMap in="SourceGraphic" in2="soft" scale="38" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */

type NavLink = { href: string; label: string; anchor?: string; icon: IconName };

function useLinks(): NavLink[] {
  const t = useT();
  return [
    { href: `${PREMIUM}/domains`, label: t("domains"), icon: "world" },
    { href: `${PREMIUM}/hosting`, label: t("hosting"), icon: "server-2" },
    { href: `${PREMIUM}#services`, label: "Услуги", anchor: "services", icon: "layout-dashboard" },
    { href: `${PREMIUM}#hosting`, label: "Тарифы", anchor: "hosting", icon: "database" },
    { href: `${PREMIUM}#pulse`, label: "Зоны", anchor: "pulse", icon: "world-www" },
    { href: `${PREMIUM}#contacts`, label: t("contacts"), anchor: "contacts", icon: "phone" },
  ];
}

/**
 * Навигация — стеклянная пилюля. Разделы подсвечиваются, пока их листают
 * (подложка переезжает к текущему пункту), полоса внизу показывает, сколько
 * страницы прочитано. На телефоне — кнопка «Меню» и шторка с крупными
 * пунктами, контактами и переключателем версий.
 */
function GlassNav() {
  const t = useT();
  const links = useLinks();
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  // Какой раздел сейчас на экране — для подсветки пункта.
  useEffect(() => {
    const ids = links.filter((link) => link.anchor).map((link) => link.anchor as string);
    const seen = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) seen.set(entry.target.id, entry.isIntersecting);
        setActive(ids.find((id) => seen.get(id)) ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ids) {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
    // Набор якорей один и тот же; пересобираем только при смене страницы.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Полоса прочитанного: scaleX, а не ширина.
  useEffect(
    () =>
      onScrollFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.current?.style.setProperty("--p", String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
      }),
    [],
  );

  const current = links.find((link) => (link.anchor ? link.anchor === active && pathname === PREMIUM : pathname === link.href));

  // Подложка под текущим пунктом переезжает (transform), а не прыгает.
  useEffect(() => {
    const nav = navRef.current;
    const frame = window.requestAnimationFrame(() => {
      const node = nav?.querySelector<HTMLElement>(`[data-key="${current?.href ?? ""}"]`);
      setPill(node && nav ? { x: node.offsetLeft, w: node.offsetWidth } : null);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [current?.href]);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", close);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <div data-refract className="lg-glass lg-sheen mx-auto flex min-h-16 max-w-7xl items-center gap-2 overflow-hidden rounded-full py-2 pl-5 pr-2">
        <Link href={PREMIUM} className="shrink-0 rounded-full" aria-label="Arsenal D — на главную">
          <Image src="/images/webname/arsenal-d-light.png" alt="Arsenal D" width={363} height={105} className="h-7 w-auto sm:h-8" preload />
        </Link>
        <nav ref={navRef} aria-label="Разделы" className="relative ml-4 hidden items-center text-sm xl:flex">
          {pill ? (
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 h-full rounded-full bg-white/10 ring-1 ring-white/15 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ width: pill.w, transform: `translate3d(${pill.x}px,0,0)` }}
            />
          ) : null}
          {links.map((link) => (
            <Link
              key={link.href}
              data-key={link.href}
              href={link.href}
              aria-current={current?.href === link.href ? "page" : undefined}
              className={cn("relative flex min-h-11 items-center rounded-full px-4 transition-colors", current?.href === link.href ? "text-wn-ink" : "text-wn-ink-2 hover:text-wn-ink")}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <LangPills className="ml-auto" />
        <a href={contacts.cabinet} target="_blank" rel="noopener noreferrer" className="hidden min-h-11 items-center gap-2 rounded-full px-3 text-sm text-wn-ink-2 hover:text-wn-ink lg:inline-flex">
          <Icon name="key" className="h-4 w-4" />
          {t("cabinet")}
        </a>
        <Link href={`${PREMIUM}/domains`} className="wn-btn hidden min-h-11 px-5 text-sm sm:inline-flex">
          Зарегистрировать домен
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="lg-menu"
          className="flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-bold ring-1 ring-white/15 xl:hidden"
        >
          <Icon name="menu-2" className="h-5 w-5" />
          Меню
        </button>
        <div ref={bar} aria-hidden="true" className="lg-progress pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-[#ecd09a] to-transparent" />
      </div>

      {open ? (
        <div id="lg-menu" role="dialog" aria-modal="true" aria-label="Меню" className="fixed inset-0 z-[80] overflow-y-auto bg-[#0b0a10]/70 p-3 backdrop-blur-md">
          <div className="lg-glass lg-sheet mx-auto max-w-lg p-5">
            <div className="flex items-center justify-between">
              <span className="wn-display text-2xl">Arsenal D</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Закрыть меню" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                <Icon name="x" className="h-5 w-5" />
              </button>
            </div>
            <nav aria-label="Разделы" className="mt-4 grid gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center gap-4 rounded-2xl px-4 text-lg transition-colors hover:bg-white/10"
                >
                  <Icon name={link.icon} className="h-5 w-5 text-[#ecd09a]" />
                  {link.label}
                  <Icon name="arrow-right" className="ml-auto h-4 w-4 opacity-50" />
                </Link>
              ))}
            </nav>
            <div className="mt-4 grid gap-2">
              <Link href={`${PREMIUM}/domains`} onClick={() => setOpen(false)} className="wn-btn min-h-14 text-base">
                Зарегистрировать домен
              </Link>
              <a href={tgHref("Здравствуйте! Вопрос по домену.")} target="_blank" rel="noopener noreferrer" className="wn-btn wn-btn-ink min-h-14 text-base">
                <Icon name="brand-telegram" className="h-5 w-5" />@{contacts.telegram}
              </a>
            </div>
            <VersionSwitch className="mt-5" />
          </div>
        </div>
      ) : null}
    </header>
  );
}

/** Переключатель версий макета — понятная дорога к «Реестру» и обратно. */
export function VersionSwitch({ className }: { className?: string }) {
  const pathname = usePathname();
  const premium = pathname.startsWith(PREMIUM);
  const tail = pathname.replace(PREMIUM, "").replace("/webname", "");
  return (
    <div role="group" aria-label="Версия макета" className={cn("inline-flex rounded-full bg-white/5 p-1 text-sm ring-1 ring-white/10", className)}>
      <Link href={`/webname${tail}`} aria-current={!premium ? "page" : undefined} className={cn("min-h-10 rounded-full px-4 leading-10", !premium ? "bg-white/15 text-wn-ink" : "text-wn-ink-2")}>
        Реестр
      </Link>
      <Link href={`${PREMIUM}${tail}`} aria-current={premium ? "page" : undefined} className={cn("min-h-10 rounded-full px-4 leading-10", premium ? "bg-[#ecd09a] text-[#1a1208]" : "text-wn-ink-2")}>
        Премиум
      </Link>
    </div>
  );
}

function PremiumFooter() {
  return (
    <footer className="relative mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6">
      <div className="lg-glass flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
        <Image src="/images/webname/arsenal-d-light.png" alt="Arsenal D" width={363} height={105} className="h-8 w-auto self-start sm:self-auto" />
        <p className="text-xs text-wn-muted sm:mx-auto sm:text-center">
          © Arsenal D. Макет — DevUz. Логотип, тарифы, цены и контакты — с webname.uz; цена .UZ — с registrars.uz.
        </p>
        <VersionSwitch />
      </div>
    </footer>
  );
}
