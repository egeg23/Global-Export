"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Addon } from "@/components/configurator/context";
import { onScrollFrame, reducedMotion } from "@/components/cf/motion";
import { useSite, useT } from "@/components/cf/state";
import { contacts, productById, sum } from "@/content/comfort/products";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/* Шапка                                                               */
/* ------------------------------------------------------------------ */

export function Header({ palette }: { palette: "a" | "b" }) {
  const t = useT();
  const { lang, setLang } = useSite();

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="cf-glass mx-auto flex max-w-7xl items-center gap-3 rounded-full py-2 pl-2 pr-2 sm:pl-3">
        <a href="#top" className="flex shrink-0 items-center rounded-full bg-white px-3 py-1.5" aria-label="Comfort Mebel — наверх">
          <Image src="/images/comfort/logo.png" alt="Comfort Mebel" width={1084} height={635} className="h-7 w-auto" priority />
        </a>

        <nav aria-label="Разделы" className="hidden flex-1 items-center justify-center gap-1 text-sm text-cf-muted lg:flex">
          {(
            [
              ["#catalog", t("navCatalog")],
              ["#fit", t("navFit")],
              ["#showrooms", t("navShowrooms")],
              ["#faq", t("navFaq")],
            ] as const
          ).map(([href, label]) => (
            <a key={href} href={href} className="rounded-full px-3.5 py-2 transition-colors hover:bg-white/8 hover:text-cf-paper">
              {label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex min-w-0 items-center gap-2">
          <Addon id="uz" inline scroll={false}>
            <span role="group" aria-label="Язык" className="inline-flex rounded-full p-0.5 ring-1 ring-cf-line">
              {(["ru", "uz"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  aria-pressed={lang === code}
                  onClick={() => setLang(code)}
                  className={cn(
                    "min-h-9 rounded-full px-3 text-xs font-semibold uppercase transition-colors",
                    lang === code ? "bg-cf-accent text-cf-accent-ink" : "text-cf-muted hover:text-cf-paper",
                  )}
                >
                  {code}
                </button>
              ))}
            </span>
          </Addon>

          <a
            href={palette === "a" ? "/comfort/b" : "/comfort/a"}
            title="Другая палитра"
            aria-label={`Открыть палитру ${palette === "a" ? "B" : "A"}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ring-cf-line"
          >
            <span aria-hidden="true" className="flex h-5 w-5 overflow-hidden rounded-full">
              <span className={cn("h-full w-1/2", palette === "a" ? "bg-[#23212c]" : "bg-[#32292f]")} />
              <span className={cn("h-full w-1/2", palette === "a" ? "bg-[#f1fec8]" : "bg-[#99e1d9]")} />
            </span>
          </a>

          <a href={contacts.callCenterHref} className="cf-btn hidden min-h-10 px-4 text-sm sm:inline-flex">
            {contacts.callCenter}
          </a>
          <a href={contacts.callCenterHref} aria-label={t("call")} className="cf-btn h-10 w-10 min-h-10 shrink-0 px-0 sm:hidden">
            <PhoneIcon />
          </a>
        </div>
      </div>
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Первый экран                                                        */
/* ------------------------------------------------------------------ */

const heroProduct = productById("corner-280");

/**
 * Первый экран — подача из референса владельца студии: макро ткани во весь
 * экран и поверх неё скруглённая карточка из матового стекла с крупным
 * гротеском и табличкой характеристик.
 *
 * «Вау» — линза. Фон — фактура их углового дивана крупным планом, а в
 * стеклянном круге под курсором тот же кадр уже «отъехал»: видно сам диван.
 * Ткань и вещь — одна и та же модель (товар 28061 в их магазине). На
 * телефоне линзу тянут пальцем; без движения она стоит на месте.
 *
 * Двигается только transform: фон при прокрутке уходит медленнее страницы,
 * линза — через translate3d в одном кадре анимации.
 */
export function Hero() {
  const t = useT();
  const section = useRef<HTMLElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [touch, setTouch] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Размер кадра — от него считается, где внутри линзы стоит второй снимок.
  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const measure = () => setSize({ w: node.clientWidth, h: node.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    setTouch(window.matchMedia("(hover: none)").matches);
    return () => observer.disconnect();
  }, []);

  // Фон уходит медленнее страницы.
  useEffect(() => {
    const node = backdrop.current;
    if (!node || reducedMotion()) return;
    return onScrollFrame(() => {
      const y = Math.min(window.scrollY, window.innerHeight * 1.2);
      node.style.transform = `translate3d(0, ${(y * 0.35).toFixed(1)}px, 0) scale(${(1.06 + y * 0.00012).toFixed(4)})`;
    });
  }, []);

  // Линза.
  useEffect(() => {
    const root = section.current;
    const node = lens.current;
    const photo = inner.current;
    if (!root || !node || !photo || !size.w) return;

    const radius = node.offsetWidth / 2;
    let x = size.w * (size.w < 768 ? 0.7 : 0.72);
    let y = size.h * (size.w < 768 ? 0.19 : 0.42);
    let tx = x;
    let ty = y;
    let raf = 0;
    const reduce = reducedMotion();

    // На узком экране линза стоит над карточкой, у верхнего края, а диван
    // на снимке — внизу кадра. Снимок под линзой сдвинут на постоянную
    // величину: в покое в круге диван, а не стена над ним.
    const lift = size.w < 768 ? size.h * 0.36 : 0;

    const place = () => {
      node.style.transform = `translate3d(${(x - radius).toFixed(1)}px, ${(y - radius).toFixed(1)}px, 0)`;
      photo.style.transform = `translate3d(${(radius - x).toFixed(1)}px, ${(radius - y - lift).toFixed(1)}px, 0)`;
    };

    const step = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      place();
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(step) : 0;
    };

    const aim = (clientX: number, clientY: number) => {
      const rect = root.getBoundingClientRect();
      tx = Math.min(Math.max(clientX - rect.left, radius * 0.4), rect.width - radius * 0.4);
      ty = Math.min(Math.max(clientY - rect.top, radius * 0.4), rect.height - radius * 0.4);
      if (reduce) {
        x = tx;
        y = ty;
        place();
      } else if (!raf) {
        raf = requestAnimationFrame(step);
      }
    };

    place();

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse") aim(event.clientX, event.clientY);
    };
    let dragging = false;
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      dragging = true;
      node.setPointerCapture(event.pointerId);
      aim(event.clientX, event.clientY);
    };
    const onDrag = (event: PointerEvent) => {
      if (dragging) aim(event.clientX, event.clientY);
    };
    const onUp = () => {
      dragging = false;
    };

    root.addEventListener("pointermove", onMove);
    node.addEventListener("pointerdown", onDown);
    node.addEventListener("pointermove", onDrag);
    node.addEventListener("pointerup", onUp);
    node.addEventListener("pointercancel", onUp);
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerdown", onDown);
      node.removeEventListener("pointermove", onDrag);
      node.removeEventListener("pointerup", onUp);
      node.removeEventListener("pointercancel", onUp);
    };
  }, [size]);

  return (
    <section ref={section} id="top" className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
      {/* Фактура во весь экран. */}
      <div ref={backdrop} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 will-change-transform">
        <Image src="/images/comfort/tex-fabric.jpg" alt="" fill priority sizes="100vw" className="object-cover object-[50%_40%]" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(0_0_0/0.35)_0%,transparent_28%,transparent_45%,var(--cf-ink)_100%)]"
      />

      {/* Линза: под тканью — сам диван. */}
      <div
        ref={lens}
        role="img"
        aria-label={`${heroProduct.name} целиком — под линзой`}
        className="absolute left-0 top-0 z-10 h-40 w-40 touch-none select-none overflow-hidden rounded-full will-change-transform sm:h-60 sm:w-60"
        style={{ boxShadow: "0 0 0 1px rgb(255 255 255 / 0.5), 0 25px 60px -15px rgb(0 0 0 / 0.6), inset 0 2px 0 rgb(255 255 255 / 0.5)" }}
      >
        <div ref={inner} className="pointer-events-none absolute left-0 top-0" style={{ width: size.w || "100vw", height: size.h || "100svh" }}>
          <Image src={heroProduct.image} alt="" fill sizes="100vw" className="object-cover object-[50%_60%]" />
        </div>
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_22%,rgb(255_255_255/0.35),transparent_45%)]" />
      </div>

      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 pb-6 pt-[40svh] sm:px-6 sm:pb-10 sm:pt-28 lg:pb-14">
        <div className="cf-glass max-w-xl overflow-hidden rounded-[2rem] p-6 sm:rounded-[2.5rem] sm:p-9">
          <span aria-hidden="true" className="cf-sheen pointer-events-none absolute -top-1/2 left-0 h-[200%] w-1/2 -rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <p className="cf-eyebrow text-cf-accent">{t("heroEyebrow")}</p>
          <h1 className="cf-display mt-4 text-[clamp(2.4rem,7.2vw,4.6rem)]">{t("heroTitle")}</h1>
          <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-cf-muted">{t("heroLead")}</p>

          <dl className="cf-spec mt-6">
            <dt>Модель</dt>
            <dd>{heroProduct.name}</dd>
            <dt>Обивка</dt>
            <dd>Турецкая ткань, 100% моющаяся</dd>
            <dt>Механизм</dt>
            <dd>«Дельфин» + ящик «Аллигатор»</dd>
            <dt>Цена в каталоге</dt>
            <dd className="font-semibold text-cf-accent">{sum(heroProduct.price)}</dd>
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#catalog" className="cf-btn">
              {t("heroCta")}
            </a>
            <a href="#showrooms" className="cf-btn cf-btn-ghost">
              {t("heroVisit")}
            </a>
          </div>
        </div>
        <p className="mt-4 text-xs text-cf-paper/70">{touch ? t("lensHintTouch") : t("lensHintPointer")}</p>
      </div>
    </section>
  );
}
