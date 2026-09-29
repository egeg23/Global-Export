"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { In, onScrollFrame, Parallax, reducedMotion } from "@/components/cf/motion";
import { useT } from "@/components/cf/state";
import { branches, contacts, faq, productById, sum } from "@/content/comfort/products";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/* Полоса доверия — только то, что компания пишет о себе сама          */
/* ------------------------------------------------------------------ */

const trust = [
  ["2007", "работаем с этого года"],
  ["3", "шоурума в Ташкенте"],
  ["0 сум", "доставка и сборка по Ташкенту"],
  ["6–24", "месяца гарантии"],
  ["5 мин", "оформление рассрочки Uzum / Anor"],
] as const;

export function Trust() {
  return (
    <section aria-label="Коротко о Comfort Mebel" className="border-y border-cf-line bg-cf-ink-2">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-5">
        {trust.map(([value, label], index) => (
          <In key={label} as="li" variant="zoom" index={index} className={cn("px-5 py-6 sm:px-6", index === 4 && "col-span-2 sm:col-span-1")}>
            <p className="cf-display text-3xl text-cf-accent sm:text-4xl">{value}</p>
            <p className="mt-2 text-sm text-cf-muted">{label}</p>
          </In>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* От фактуры к вещи                                                    */
/* ------------------------------------------------------------------ */

const velmont = productById("velmont");

const steps = [
  { key: "Деталь", title: "Зарядка прямо в подлокотнике", text: "Встроенный модуль и беспроводная зарядка: телефон заряжается, пока вы отдыхаете." },
  { key: "Материал", title: "Моющаяся ткань и усиленный каркас", text: "Спинки и подлокотники регулируются: сидя, полулёжа или лёжа." },
  { key: "Целиком", title: `${velmont.name}`, text: `${velmont.size} — модули заносятся по отдельности и собираются в гостиной.` },
];

/**
 * Сцена прокрутки: кадр начинается с фактуры подлокотника крупным планом и
 * отъезжает до дивана целиком. Прокрутку никто не перехватывает — сцена
 * просто длиннее экрана, а кадр внутри «прилипает» (sticky) и читает, где
 * он сейчас. Два настоящих снимка из карточки ВЕЛЬМОНТ сменяют друг друга
 * через прозрачность и масштаб: увеличивать мелкий снимок в три раза мы не
 * стали — фактура поплыла бы.
 */
export function FromTexture() {
  const scene = useRef<HTMLElement>(null);
  const near = useRef<HTMLDivElement>(null);
  const far = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const node = scene.current;
    if (!node) return;
    const still = reducedMotion();
    return onScrollFrame(() => {
      const rect = node.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = Math.min(Math.max(-rect.top / (total || 1), 0), 1);
      setStep(p < 0.34 ? 0 : p < 0.67 ? 1 : 2);
      if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(3)})`;
      if (still || !near.current || !far.current) return;
      const out = Math.min(p / 0.7, 1);
      near.current.style.transform = `scale(${(1 + out * 0.5).toFixed(3)})`;
      near.current.style.opacity = (1 - Math.max((p - 0.35) / 0.3, 0)).toFixed(3);
      far.current.style.transform = `scale(${(1.35 - Math.max((p - 0.3) / 0.7, 0) * 0.35).toFixed(3)})`;
      far.current.style.opacity = Math.min(Math.max((p - 0.3) / 0.3, 0), 1).toFixed(3);
    });
  }, []);

  return (
    <section ref={scene} aria-label="От фактуры к вещи" className="relative h-[240svh] sm:h-[280svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div ref={far} aria-hidden="true" className="absolute inset-0 opacity-0 will-change-transform">
          <Image src={velmont.image} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div ref={near} aria-hidden="true" className="absolute inset-0 will-change-transform">
          <Image src="/images/comfort/tex-charge.jpg" alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,var(--cf-ink)_0%,rgb(0_0_0/0.15)_55%,transparent_100%)] opacity-80" />

        <div className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-10 sm:items-center sm:px-6 sm:pb-0">
          <div className="cf-glass w-full max-w-md rounded-[2rem] p-6 sm:p-8">
            <p className="cf-eyebrow text-cf-accent">От фактуры к вещи · {steps[step].key}</p>
            <div aria-live="polite">
              <h2 key={step} className="cf-pop cf-display mt-4 text-[clamp(1.9rem,4.4vw,3rem)]">
                {steps[step].title}
              </h2>
              <p key={`t${step}`} className="cf-pop mt-4 text-sm leading-relaxed text-cf-muted">
                {steps[step].text}
              </p>
            </div>
            <dl className="cf-spec mt-6">
              <dt>Размер</dt>
              <dd>{velmont.size}</dd>
              <dt>Цена в каталоге</dt>
              <dd className="font-semibold text-cf-accent">{sum(velmont.price)}</dd>
            </dl>
            <span className="mt-6 block h-px w-full overflow-hidden bg-cf-line">
              <span ref={bar} className="block h-full origin-left scale-x-0 bg-cf-accent" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Материалы — бегущая лента фактур                                    */
/* ------------------------------------------------------------------ */

const textures = [
  { image: "/images/comfort/tex-fabric.jpg", title: "Турецкая моющаяся ткань", note: "угловой диван 280 × 155" },
  { image: "/images/comfort/tex-veneer.jpg", title: "Шпон, Малайзия", note: "обеденный стол 180 × 90" },
  { image: "/images/comfort/tex-boucle.jpg", title: "Моющаяся обивка и орех", note: "скандинавский комплект Luxe" },
  { image: "/images/comfort/tex-quilt.jpg", title: "Стёжка, крутящиеся стулья", note: "комплект emely 6/1" },
  { image: "/images/comfort/tex-oak.jpg", title: "Открытые полки и шкафчики", note: "ТВ-подставка 320 см" },
  { image: "/images/comfort/tex-charge.jpg", title: "Зарядка в подлокотнике", note: "модульный ВЕЛЬМОНТ" },
];

export function Materials() {
  const row = [...textures, ...textures];
  return (
    <section aria-labelledby="materials-title" className="overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <In variant="slide">
          <p className="cf-eyebrow text-cf-accent">Материалы</p>
          <h2 id="materials-title" className="cf-display mt-4 max-w-3xl text-[clamp(2rem,5vw,3.6rem)]">
            Их хочется потрогать — поэтому показываем крупно
          </h2>
          <p className="mt-5 max-w-2xl text-cf-muted">
            ЛДСП, МДФ и массив от поставщиков из России, Турции и Китая, фурнитура Hettich. Каждый кадр — с фотографии
            настоящей модели из каталога.
          </p>
        </In>
      </div>
      <div className="mt-12 flex w-max gap-4 cf-marquee hover:[animation-play-state:paused]">
        {row.map((item, index) => (
          <figure key={index} aria-hidden={index >= textures.length} className="relative h-72 w-56 shrink-0 overflow-hidden rounded-[1.75rem] sm:h-96 sm:w-72">
            <Image src={item.image} alt="" fill sizes="(min-width: 640px) 18rem, 14rem" className="object-cover" />
            <figcaption className="cf-glass absolute inset-x-3 bottom-3 rounded-2xl p-4">
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-1 text-xs text-cf-muted">{item.note}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Как проходит покупка — их четыре шага                               */
/* ------------------------------------------------------------------ */

const process = [
  ["Выбор товара", "Онлайн через сайт или Telegram — не выходя из дома."],
  ["Подтверждение", "Менеджер свяжется, уточнит детали и подтвердит заказ."],
  ["Расчёт деталей", "Размеры, сроки и стоимость — прозрачно, без скрытых платежей."],
  ["Доставка и сборка", "Быстрая доставка, аккуратная установка — мебель готова."],
] as const;

export function Process() {
  return (
    <section aria-labelledby="process-title" className="relative overflow-hidden py-20 sm:py-28">
      <Parallax speed={-0.15} className="absolute -right-32 top-10 -z-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,var(--cf-glow),transparent_65%)]">
        <span />
      </Parallax>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <p className="cf-eyebrow text-cf-accent">Как проходит покупка</p>
        <h2 id="process-title" className="cf-display mt-4 max-w-2xl text-[clamp(2rem,5vw,3.6rem)]">
          Четыре шага от выбора до сборки
        </h2>
        <ol className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {process.map(([title, text], index) => (
            <In key={title} as="li" variant="tilt" index={index} className="rounded-[1.75rem] bg-cf-ink-3 p-6">
              <span className="cf-display text-5xl text-cf-accent/80">0{index + 1}</span>
              <p className="mt-6 text-lg font-semibold">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-cf-muted">{text}</p>
            </In>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Шоурумы                                                              */
/* ------------------------------------------------------------------ */

export function Showrooms({ children }: { children?: React.ReactNode }) {
  const t = useT();
  return (
    <section id="showrooms" aria-labelledby="showrooms-title" className="scroll-mt-24 bg-cf-ink-2 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="cf-eyebrow text-cf-accent">Посмотреть вживую</p>
        <h2 id="showrooms-title" className="cf-display mt-4 text-[clamp(2rem,5vw,3.6rem)]">
          {t("showroomsTitle")}
        </h2>
        <p className="mt-5 max-w-2xl text-cf-muted">Каждый день с 10:00. Колл-центр принимает звонки круглосуточно.</p>

        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {branches.map((branch, index) => (
            <In key={branch.id} as="article" variant="slide" index={index} className="group overflow-hidden rounded-[1.75rem] bg-cf-ink-3">
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={branch.image}
                  alt={`Шоурум Comfort Mebel — ${branch.name}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-cf)] group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="text-lg font-semibold">
                  {branch.name} <span className="text-sm font-normal text-cf-muted">· {branch.note}</span>
                </p>
                <p className="mt-2 text-sm text-cf-muted">{branch.address}</p>
                <ul className="mt-4 space-y-1 text-sm">
                  {branch.phones.map((phone) => (
                    <li key={phone}>
                      <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="tabular-nums hover:text-cf-accent">
                        {phone}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </In>
          ))}
        </div>

        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Вопросы                                                              */
/* ------------------------------------------------------------------ */

export function Faq() {
  const t = useT();
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="cf-eyebrow text-cf-accent">FAQ</p>
          <h2 id="faq-title" className="cf-display mt-4 text-[clamp(2rem,5vw,3.2rem)]">
            {t("faqTitle")}
          </h2>
        </div>
        <div className="divide-y divide-cf-line border-y border-cf-line lg:col-span-8">
          {faq.map(([question, answer], index) => (
            <In key={question} variant="fade" index={index}>
              <details className="group py-1">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-base font-medium [&::-webkit-details-marker]:hidden">
                  {question}
                  <span aria-hidden="true" className="text-xl text-cf-accent transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-5 text-sm leading-relaxed text-cf-muted">{answer}</p>
              </details>
            </In>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Подвал                                                               */
/* ------------------------------------------------------------------ */

export function Footer() {
  return (
    <footer className="border-t border-cf-line bg-cf-ink-2 pb-32 pt-14">
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-3">
        <div>
          <span className="inline-flex rounded-full bg-white px-3 py-1.5">
            <Image src="/images/comfort/logo.png" alt="Comfort Mebel" width={1084} height={635} className="h-7 w-auto" />
          </span>
          <p className="mt-5 max-w-xs text-sm text-cf-muted">Качественная и доступная мебель в Ташкенте. Собственное производство с 2007 года.</p>
        </div>
        <div className="text-sm">
          <p className="cf-eyebrow text-cf-muted">Колл-центр 24/7</p>
          <a href={contacts.callCenterHref} className="cf-display mt-3 block text-3xl hover:text-cf-accent">
            {contacts.callCenter}
          </a>
          <a href={`mailto:${contacts.email}`} className="mt-3 block text-cf-muted hover:text-cf-paper">
            {contacts.email}
          </a>
        </div>
        <div className="text-sm">
          <p className="cf-eyebrow text-cf-muted">Соцсети</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ["Telegram", contacts.telegram],
                ["Instagram", contacts.instagram],
                ["YouTube", contacts.youtube],
              ] as const
            ).map(([label, href]) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="cf-chip hover:text-cf-paper">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-7xl px-4 text-xs text-cf-muted/70 sm:px-6">
        Прототип сайта от студии DevUz для Comfort Mebel. Фотографии, цены и тексты о компании — с comfort-mebel.uz.
      </p>
    </footer>
  );
}
