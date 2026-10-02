"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { Addon } from "@/components/configurator/context";
import { Calculator } from "@/components/webname/calculator";
import { Pulse } from "@/components/webname/globe";
import { isFree, useDemoSearch, useSearch, Whois } from "@/components/webname/hero";
import { Hosting } from "@/components/webname/hosting";
import { Icon, type IconName } from "@/components/webname/icons";
import { useT } from "@/components/webname/lang";
import { In, reducedMotion } from "@/components/webname/motion";
import { PREMIUM, PremiumShell } from "@/components/webname/premium/shell";
import { Block, Contacts, Lifecycle, Sites } from "@/components/webname/site";
import { Cabinet, Dns, Pay, Transfer } from "@/components/webname/tools";
import { freedDomains, ssl, sum, zones } from "@/content/webname/facts";
import { whenDevuzIntroDone } from "@/lib/brand/intro";
import { cn } from "@/lib/cn";

/**
 * Вариант «Премиум» — тот же сайт Arsenal D в жидком стекле.
 *
 * Свои здесь: первый экран (линза поиска с преломлением и голографическая
 * карта домена), лента освободившихся доменов и услуги «бенто». Тарифы,
 * калькулятор, глобус, перенос, DNS, жизненный цикл, кабинет и контакты —
 * общие блоки «Реестра», которые тема варианта превращает в стекло.
 */
export function PremiumSite() {
  return (
    <PremiumShell>
      <main className="relative">
        <PremiumHero />
        <Addon id="board">
          <FreedRibbon />
        </Addon>
        <ServicesBento />
        <Hosting base={PREMIUM} />
        <Addon id="calc">
          <Block id="calc" title="Домен, хостинг и сайт — одним счётом" lead="Выберите зону, тариф и сертификат — итог в сумах сразу. Расчёт уходит менеджеру одним нажатием.">
            <Calculator />
          </Block>
        </Addon>
        <Pulse premium />
        <Addon id="transfer">
          <Block id="transfer" title="Перенос домена — три шага" lead="Домен у другого регистратора? Заберём его вместе с сайтом, без простоя.">
            <Transfer />
          </Block>
        </Addon>
        <Addon id="dns">
          <Block id="dns" title="DNS — без звонка в поддержку" lead="Сайт, почта Google или Яндекс — готовым набором. DNSSEC — одним тумблером.">
            <Dns />
          </Block>
        </Addon>
        <Lifecycle />
        <Addon id="cabinet">
          <Block id="cabinet" title="Кабинет, который помнит сроки" lead="Домены, хостинг и сертификаты — карточками. Что скоро истечёт, видно сразу.">
            <Cabinet />
          </Block>
        </Addon>
        <Addon id="pay" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <Pay />
        </Addon>
        <Sites />
        <Contacts />
      </main>
    </PremiumShell>
  );
}

/* ------------------------------------------------------------------ */
/* Первый экран                                                        */
/* ------------------------------------------------------------------ */

/**
 * Заголовок проявляется по словам — когда заставка студии освободит кадр.
 *
 * Расстояние между словами — отступ самого слова, а не пробел между ними:
 * в Safari на iPhone и во встроенном браузере Telegram пробел между
 * блоками-словами схлопывался, и заголовок читался «своёимяв.UZ».
 */
function Words({ text, className }: { text: string; className?: string }) {
  const [shown, setShown] = useState(false);
  useEffect(() => whenDevuzIntroDone(() => window.requestAnimationFrame(() => setShown(true))), []);
  // Фраза целиком — для скринридеров и поиска; слова-блоки — только глазу.
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={cn("lg-words", shown && "is-in", className)}>
        {text.split(" ").map((word, index) => (
          <span key={`${word}-${index}`} className="lg-word" style={{ "--w": index } as React.CSSProperties}>
            <span>{word}</span>
          </span>
        ))}
      </span>
    </>
  );
}

function PremiumHero() {
  const t = useT();
  const { search, value, name, settled, auto, setAuto, focused, setFocused, input } = useDemoSearch();
  const free = settled && isFree(name, ".uz");

  return (
    <section id="top" className="relative">
      <div className="mx-auto grid max-w-7xl items-center gap-x-12 gap-y-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-12 lg:pb-28 lg:pt-20">
        <div className="min-w-0 lg:col-span-7">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-wn-ink-2 ring-1 ring-white/10">
            <Icon name="diamond" className="h-4 w-4 text-[#ecd09a]" />
            Аккредитованный регистратор .UZ
          </p>
          <h1 className="wn-display mt-6 text-5xl sm:text-7xl lg:text-[5.25rem]">
            <Words text={t("heroTitle")} />
          </h1>
          <p className="mt-6 max-w-xl text-lg text-wn-ink-2">{t("heroSub")}</p>

          <form
            role="search"
            className="mt-10"
            onSubmit={(event) => {
              event.preventDefault();
              setAuto(false);
              search.set(input.current?.value ?? "");
            }}
          >
            <label htmlFor="wn-q" className="sr-only">
              Имя домена
            </label>
            <div data-refract className="lg-glass lg-sheen flex min-h-20 items-center gap-2 rounded-full p-2 pl-5 focus-within:ring-2 focus-within:ring-[#ecd09a] sm:gap-3 sm:pl-7">
              <Icon name="lock" className="h-5 w-5 shrink-0 text-wn-mint" />
              <span className="wn-mono hidden text-wn-muted sm:inline">https://</span>
              <div className="relative min-w-0 flex-1">
                <input
                  ref={input}
                  id="wn-q"
                  value={value}
                  onChange={(event) => {
                    setAuto(false);
                    search.set(event.target.value);
                  }}
                  onFocus={() => {
                    setFocused(true);
                    if (auto) {
                      setAuto(false);
                      search.set("");
                    }
                  }}
                  onBlur={() => setFocused(false)}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  placeholder={t("placeholder")}
                  className="wn-mono min-h-14 w-full bg-transparent text-xl text-wn-ink outline-none placeholder:text-wn-muted sm:text-3xl"
                  style={{ caretColor: "#ecd09a" }}
                />
                {!focused && auto ? (
                  <span aria-hidden="true" className="wn-mono pointer-events-none absolute inset-y-0 left-0 flex items-center text-xl sm:text-3xl">
                    <span className="invisible whitespace-pre">{value}</span>
                    <span className="wn-caret ml-0.5 h-8 w-0.5 bg-[#ecd09a]" />
                  </span>
                ) : null}
              </div>
              <span className="wn-mono text-xl text-[#ecd09a] sm:text-3xl">.uz</span>
              <button type="submit" className="wn-btn min-h-14 shrink-0 px-5 sm:px-7">
                <Icon name="search" className="h-5 w-5" />
                <span className="hidden sm:inline">{t("check")}</span>
                <span className="sr-only sm:hidden">{t("check")}</span>
              </button>
            </div>
          </form>

          <ul key={settled ? name : "idle"} className="mt-5 flex flex-wrap gap-2" aria-live="polite" aria-label="Зоны">
            {zones.slice(0, 8).map((zone, index) => {
              const ok = settled && isFree(name, zone.zone);
              return (
                <li
                  key={zone.zone}
                  className={cn("flex min-h-11 items-center gap-2 rounded-full px-4 text-sm ring-1 backdrop-blur-md", index >= 6 && "hidden sm:flex", settled && "wn-tick", ok ? "bg-wn-mint-bg ring-[#6fe7b6]/40" : "bg-white/5 ring-white/10")}
                  style={{ "--i": index } as React.CSSProperties}
                >
                  <span className={cn("h-2 w-2 rounded-full", !settled ? "bg-white/30" : ok ? "bg-wn-mint" : "bg-wn-stamp")} />
                  <b className={cn("wn-mono", settled && !ok && "text-wn-muted line-through")}>{zone.zone}</b>
                  <span className="wn-mono text-xs text-wn-muted">{zone.price ? (zone.price >= 1_000_000 ? `${(zone.price / 1_000_000).toLocaleString("ru-RU")} млн` : `${zone.price / 1000} тыс.`) : ""}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-sm text-wn-muted">Демо: ответ считается на странице, без запроса к реестру. Цены — прайс webname.uz, .UZ — по каталогу registrars.uz.</p>
        </div>

        <div className="min-w-0 lg:col-span-5">
          <DomainCard name={name} settled={settled} free={free} />
        </div>
      </div>
      <Addon id="whois" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <Whois name={name || "ваше-имя"} />
      </Addon>
    </section>
  );
}

/**
 * Карта домена — главный приём варианта. Стекло с голографическим
 * переливом; на новый ответ карта переворачивается на место, за курсором
 * наклоняется и ловит свет. Наклон — только transform, только на мыши и
 * не при «уменьшить движение».
 */
function DomainCard({ name, settled, free }: { name: string; settled: boolean; free: boolean }) {
  const tilt = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const shown = name || "ваше-имя";
  const alternatives = useMemo(() => {
    if (!settled || free) return [];
    return [`${name}-uz`, `${name}group`, `my${name}`].filter((alt) => isFree(alt, ".uz")).slice(0, 2);
  }, [settled, free, name]);

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || reducedMotion()) return;
    const node = tilt.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    window.cancelAnimationFrame(frame.current);
    frame.current = window.requestAnimationFrame(() => {
      node.style.transform = `perspective(1100px) rotateX(${((0.5 - y) * 12).toFixed(2)}deg) rotateY(${((x - 0.5) * 14).toFixed(2)}deg)`;
      node.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      node.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      node.style.setProperty("--hx", x.toFixed(3));
    });
  };
  const leave = () => {
    window.cancelAnimationFrame(frame.current);
    if (tilt.current) tilt.current.style.transform = "";
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div onPointerMove={move} onPointerLeave={leave} className="[perspective:1100px]">
        <div ref={tilt} className="transition-transform duration-300 ease-out will-change-transform">
          <div key={settled ? `${name}-${free}` : "idle"} className={cn("lg-glass relative aspect-[1.586] overflow-hidden rounded-[1.75rem] p-6 sm:p-7", settled && "lg-flip")}>
            <span aria-hidden="true" className="lg-holo" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="wn-mono text-xs tracking-[0.3em] text-wn-ink-2">ARSENAL D · .UZ</span>
                <Icon name="diamond" className="h-7 w-7 text-[#ecd09a]" />
              </div>
              <p className="wn-mono break-all text-2xl leading-tight sm:text-3xl">
                {shown}
                <span className="text-[#ecd09a]">.uz</span>
              </p>
              <div className="flex items-end justify-between gap-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ring-1",
                    !settled ? "bg-white/5 text-wn-ink-2 ring-white/10" : free ? "bg-wn-mint-bg text-wn-ink ring-[#6fe7b6]/50" : "bg-[#c8304a]/25 text-wn-ink ring-[#ff6b7f]/50",
                  )}
                >
                  <span className={cn("h-2 w-2 rounded-full", !settled ? "bg-white/40" : free ? "bg-wn-mint" : "bg-wn-stamp")} />
                  {!settled ? "Наберите имя" : free ? "Свободен" : "Занят"}
                </span>
                <span className="text-right">
                  <span className="block text-xs text-wn-muted">год в .UZ</span>
                  <b className="wn-mono">{sum(35_000)}</b>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex min-h-14 flex-wrap items-center justify-center gap-3 text-center">
        {free ? (
          <Link href={`${PREMIUM}/domains?name=${encodeURIComponent(name)}`} className="wn-btn min-h-14 px-7 text-lg">
            Занять {name}.uz
            <Icon name="arrow-right" className="h-5 w-5" />
          </Link>
        ) : settled ? (
          <p className="text-sm text-wn-ink-2">
            {alternatives.length ? (
              <>
                Свободны рядом:{" "}
                {alternatives.map((alt, index) => (
                  <b key={alt} className="wn-mono text-wn-ink">
                    {index ? ", " : ""}
                    {alt}.uz
                  </b>
                ))}
              </>
            ) : (
              "Попробуйте другое имя или зону .com"
            )}
          </p>
        ) : (
          <p className="text-sm text-wn-muted">Карта перевернётся, как только имя будет проверено.</p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Освободившиеся домены                                               */
/* ------------------------------------------------------------------ */

/**
 * Лента освободившихся доменов: два ряда стеклянных пилюль плывут навстречу
 * друг другу (transform), под курсором и при фокусе встают. «Занять» ставит
 * имя в поиск первого экрана. Список — настоящий, с их главной.
 */
function FreedRibbon() {
  const search = useSearch();
  const half = Math.ceil(freedDomains.length / 2);
  const rows = [freedDomains.slice(0, half), freedDomains.slice(half)];
  return (
    <section id="board" className="relative scroll-mt-28 py-14 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
        <In variant="glass">
          <h2 className="wn-display text-4xl sm:text-5xl">Только что освободились</h2>
          <p className="mt-3 max-w-lg text-wn-ink-2">Домены, которые владельцы не продлили. Нажмите на имя — оно встанет в поиск.</p>
        </In>
        <a href="https://t.me/webname_free_domains" target="_blank" rel="noopener noreferrer" className="wn-btn wn-btn-ink self-start lg:self-auto">
          <Icon name="brand-telegram" className="h-5 w-5" />
          Канал @webname_free_domains
        </a>
      </div>
      <div className="lg-marquee-wrap mt-10 space-y-3 overflow-hidden motion-reduce:overflow-x-auto">
        {rows.map((row, rowIndex) => (
          <ul key={rowIndex} className={cn("flex w-max gap-3 px-4", rowIndex ? "lg-marquee-rev" : "lg-marquee")}>
            {[...row, ...row].map((domain, index) => (
              <li key={`${domain}-${index}`} aria-hidden={index >= row.length}>
                <button
                  type="button"
                  tabIndex={index >= row.length ? -1 : 0}
                  onClick={() => search.set(domain.replace(/\.uz$/, ""), "board")}
                  className="lg-glass lg-sheen flex min-h-14 items-center gap-3 rounded-full py-2 pl-5 pr-2 transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
                >
                  <span className="wn-mono text-lg">
                    {domain.replace(/\.uz$/, "")}
                    <span className="text-[#ecd09a]">.uz</span>
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-bold">Занять</span>
                </button>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Услуги                                                              */
/* ------------------------------------------------------------------ */

const BENTO: { icon: IconName; name: string; text: string; price: string; span: string; href?: string }[] = [
  { icon: "world", name: "Домены .UZ", text: "Регистрация и продление на 1–10 лет, смена владельца, аннулирование — у аккредитованного регистратора.", price: `${sum(35_000)} / год`, span: "lg:col-span-7 lg:row-span-2", href: `${PREMIUM}/domains` },
  { icon: "server-2", name: "Хостинг", text: "23 тарифа в сумах: почта на домене, MySQL, FTP, восстановление из копии.", price: `от ${sum(3_000)} / мес`, span: "lg:col-span-5", href: `${PREMIUM}/hosting` },
  { icon: "world-www", name: "1000+ зон мира", text: ".com, .org, .kz, .ae, .io — с договором и счётом в сумах.", price: `от ${sum(205_000)}`, span: "lg:col-span-5" },
  { icon: "lock", name: "SSL", text: "Sectigo, GeoTrust, Thawte, RapidSSL — DV, OV, EV и Wildcard.", price: `от ${sum(ssl[0].price)}`, span: "lg:col-span-4" },
  { icon: "cpu", name: "VDS / VPS", text: "Свой сервер под магазин, CRM или 1С.", price: "по конфигурации", span: "lg:col-span-4" },
  { icon: "shield-check", name: "DNSSEC и NFT", text: "Подпись зоны и цифровое свидетельство на домен.", price: "по прайсу", span: "lg:col-span-4" },
  { icon: "rocket", name: "Быстрая бронь", text: "Домен, хостинг или SSL без регистрации — менеджер оформит сам.", price: "без кабинета", span: "lg:col-span-6" },
  { icon: "layout-dashboard", name: "Сайты под ключ", text: "Студия Arsenal D: сайты и программные разработки любого масштаба.", price: "по смете", span: "lg:col-span-6" },
];

function ServicesBento() {
  return (
    <section id="services" className="relative scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <In variant="glass">
          <h2 className="wn-display max-w-3xl text-4xl sm:text-6xl">Весь арсенал — от имени до сервера</h2>
          <p className="mt-4 max-w-2xl text-wn-ink-2">Всё, что нужно сайту, — у одного аккредитованного регистратора, с договором и закрывающими документами.</p>
        </In>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {BENTO.map((item, index) => {
            const big = index === 0;
            const inner = (
              <>
                <span className={cn("flex items-center justify-center rounded-2xl bg-gradient-to-br from-white/20 to-white/5 ring-1 ring-white/20", big ? "h-16 w-16" : "h-12 w-12")}>
                  <Icon name={item.icon} className={cn("text-[#ecd09a]", big ? "h-8 w-8" : "h-6 w-6")} />
                </span>
                <span className="mt-auto block pt-8">
                  <span className={cn("wn-display block", big ? "text-4xl sm:text-5xl" : "text-2xl")}>{item.name}</span>
                  <span className={cn("mt-2 block text-wn-ink-2", big && "max-w-md text-lg")}>{item.text}</span>
                  <span className="mt-4 flex items-center justify-between gap-3">
                    <b className="wn-mono text-sm">{item.price}</b>
                    {item.href ? (
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-[#ecd09a]">
                        Оформить
                        <Icon name="arrow-right" className="h-4 w-4" />
                      </span>
                    ) : null}
                  </span>
                </span>
              </>
            );
            const box = cn("lg-glass lg-sheen flex h-full flex-col p-6 transition-transform duration-500 sm:p-8", big ? "min-h-[22rem]" : "min-h-[15rem]", item.href && "hover:-translate-y-1 motion-reduce:transform-none");
            return (
              <In key={item.name} as="li" variant={index % 2 ? "lift" : "glass"} index={index % 4} className={cn(item.span, big && "sm:col-span-2 lg:col-span-7")}>
                {item.href ? (
                  <Link href={item.href} className={box}>
                    {inner}
                  </Link>
                ) : (
                  <div className={box}>{inner}</div>
                )}
              </In>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
