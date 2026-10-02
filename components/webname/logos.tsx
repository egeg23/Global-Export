"use client";

import { useEffect, useId, useRef, useState } from "react";

import { useAddon } from "@/components/configurator/context";
import { ArsenalLogo } from "@/components/webname/logo";
import { whenDevuzIntroDone } from "@/lib/brand/intro";
import { cn } from "@/lib/cn";

/**
 * Новый логотип Arsenal D — два варианта на выбор, включаются в конструкторе
 * (допы «logo-a» и «logo-b», взаимоисключающие). Включённый вариант заменяет
 * старый знак в шапке, подвале и меню на всех страницах обеих версий макета,
 * а на главной появляется его презентация.
 *
 *  A «Адрес» — arsenal.d: имя компании записано как домен, точка и «d»
 *    красные. Знак — «.d» в красном квадрате со скруглением, как иконка
 *    приложения. Буквы — контуры Manrope ExtraBold (OFL).
 *  B «Щит» — щит, внутри белая «D», в углу — звезда из старого знака:
 *    регистратор и хранитель адреса (SSL, DNSSEC). Слово — ARSENAL D
 *    прописными Unbounded SemiBold (OFL), «D» красная.
 *
 * Слова — currentColor: тёмные на бумаге «Реестра», светлые на стекле
 * «Премиума». Появление — только transform и opacity (app/webname.css,
 * блок «Новый логотип»); при «уменьшить движение» знак просто стоит.
 */

/** Когда играть появление: после заставки студии или при въезде в экран. */
export function useLogoShown(trigger: "intro" | "view") {
  const ref = useRef<SVGSVGElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (trigger === "intro") return whenDevuzIntroDone(() => window.requestAnimationFrame(() => setShown(true)));
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setShown(true);
        observer.disconnect();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [trigger]);
  return [ref, shown] as const;
}

/* ------------------------------------------------------------------ */
/* A «Адрес» — arsenal.d                                               */
/* ------------------------------------------------------------------ */

/** «arsenal.d», Manrope ExtraBold, 100 единиц на кегль, базовая линия 80. */
const ADDRESS = [
  "M22 81.50L22 81.50Q16.20 81.50 12.18 79.28Q8.15 77.05 6.08 73.33Q4 69.60 4 65.10L4 65.10Q4 61.35 5.15 58.25Q6.30 55.15 8.88 52.77Q11.45 50.40 15.80 48.80L15.80 48.80Q18.80 47.70 22.95 46.85Q27.10 46 32.35 45.20L32.35 45.20Q35.45 44.75 38.90 44.25L38.90 44.25Q38.50 40.90 36.70 39.15L36.70 39.15Q34.40 36.90 29 36.90L29 36.90Q26 36.90 22.75 38.35Q19.50 39.80 18.20 43.50L18.20 43.50L5.90 39.60Q7.95 32.90 13.60 28.70Q19.25 24.50 29 24.50L29 24.50Q36.15 24.50 41.70 26.70Q47.25 28.90 50.10 34.30L50.10 34.30Q51.70 37.30 52 40.30Q52.30 43.30 52.30 47L52.30 47L52.30 80L40.40 80L40.40 73.35Q37.20 77.15 33.60 79.05L33.60 79.05Q29 81.50 22 81.50ZM24.90 70.80L24.90 70.80Q28.65 70.80 31.23 69.47Q33.80 68.15 35.33 66.45Q36.85 64.75 37.40 63.60L37.40 63.60Q38.45 61.40 38.65 58.45L38.65 58.45Q38.75 56.70 38.75 55.25L38.75 55.25Q35.40 55.85 33 56.25L33 56.25Q29.25 56.95 26.95 57.50Q24.65 58.05 22.90 58.70L22.90 58.70Q20.90 59.50 19.68 60.42Q18.45 61.35 17.88 62.45Q17.30 63.55 17.30 64.90L17.30 64.90Q17.30 66.75 18.23 68.08Q19.15 69.40 20.85 70.10Q22.55 70.80 24.90 70.80Z",
  "M78 80L64.30 80L64.30 26L76.30 26L76.30 34.70Q76.95 33.50 77.80 32.40L77.80 32.40Q79.55 30.10 82.10 28.60L82.10 28.60Q84.05 27.40 86.35 26.72Q88.65 26.05 91.10 25.88Q93.55 25.70 96 26L96 26L96 38.70Q93.75 38 90.78 38.22Q87.80 38.45 85.40 39.60L85.40 39.60Q83 40.70 81.35 42.52Q79.70 44.35 78.85 46.82Q78 49.30 78 52.40L78 52.40L78 80Z",
  "M123.60 81.50L123.60 81.50Q113.40 81.50 107.13 76.88Q100.85 72.25 99.50 63.80L99.50 63.80L113.40 61.70Q114.25 65.50 117.17 67.65Q120.10 69.80 124.60 69.80L124.60 69.80Q128.30 69.80 130.30 68.38Q132.30 66.95 132.30 64.40L132.30 64.40Q132.30 62.80 131.50 61.83Q130.70 60.85 127.93 59.90Q125.15 58.95 119.30 57.40L119.30 57.40Q112.70 55.70 108.75 53.60Q104.80 51.50 103.05 48.58Q101.30 45.65 101.30 41.50L101.30 41.50Q101.30 36.30 103.95 32.47Q106.60 28.65 111.42 26.57Q116.25 24.50 122.80 24.50L122.80 24.50Q129.15 24.50 134.05 26.45Q138.95 28.40 141.97 32Q145 35.60 145.70 40.50L145.70 40.50L131.80 43Q131.45 40 129.20 38.25Q126.95 36.50 123.10 36.20L123.10 36.20Q119.35 35.95 117.08 37.20Q114.80 38.45 114.80 40.80L114.80 40.80Q114.80 42.20 115.78 43.15Q116.75 44.10 119.83 45.10Q122.90 46.10 129.20 47.70L129.20 47.70Q135.35 49.30 139.07 51.42Q142.80 53.55 144.50 56.52Q146.20 59.50 146.20 63.70L146.20 63.70Q146.20 72 140.20 76.75Q134.20 81.50 123.60 81.50Z",
  "M181.30 81.50L181.30 81.50Q173 81.50 166.67 77.92Q160.35 74.35 156.77 68.08Q153.20 61.80 153.20 53.70L153.20 53.70Q153.20 44.85 156.70 38.30Q160.20 31.75 166.35 28.13Q172.50 24.50 180.50 24.50L180.50 24.50Q189 24.50 194.95 28.50Q200.90 32.50 203.75 39.75Q206.60 47 205.75 56.80L205.75 56.80L167.85 56.80Q168.50 61.65 170.90 64.65L170.90 64.65Q174.15 68.80 180.50 68.80L180.50 68.80Q184.50 68.80 187.35 67.05Q190.20 65.30 191.70 62L191.70 62L205.30 65.90Q202.25 73.30 195.67 77.40Q189.10 81.50 181.30 81.50ZM168.20 46.70L192 46.70Q191.40 42.30 189.70 39.90L189.70 39.90Q187.05 36.30 181.10 36.30L181.10 36.30Q174.15 36.30 170.90 40.50L170.90 40.50Q169 42.95 168.20 46.70L168.20 46.70Z",
  "M265.10 80L251.30 80L251.30 54.50Q251.30 52.65 251.10 49.77Q250.90 46.90 249.85 44Q248.80 41.10 246.43 39.15Q244.05 37.20 239.70 37.20L239.70 37.20Q237.95 37.20 235.95 37.75Q233.95 38.30 232.20 39.88Q230.45 41.45 229.32 44.50Q228.20 47.55 228.20 52.60L228.20 52.60L228.20 80L214.40 80L214.40 26L226.50 26L226.50 31.55Q228.35 29.45 230.85 27.85L230.85 27.85Q236.05 24.40 244 24.40L244 24.40Q250.35 24.40 254.35 26.55Q258.35 28.70 260.57 32Q262.80 35.30 263.75 38.88Q264.70 42.45 264.90 45.40Q265.10 48.35 265.10 49.70L265.10 49.70L265.10 80Z",
  "M292.10 81.50L292.10 81.50Q286.30 81.50 282.28 79.28Q278.25 77.05 276.18 73.33Q274.10 69.60 274.10 65.10L274.10 65.10Q274.10 61.35 275.25 58.25Q276.40 55.15 278.98 52.77Q281.55 50.40 285.90 48.80L285.90 48.80Q288.90 47.70 293.05 46.85Q297.20 46 302.45 45.20L302.45 45.20Q305.55 44.75 309 44.25L309 44.25Q308.60 40.90 306.80 39.15L306.80 39.15Q304.50 36.90 299.10 36.90L299.10 36.90Q296.10 36.90 292.85 38.35Q289.60 39.80 288.30 43.50L288.30 43.50L276 39.60Q278.05 32.90 283.70 28.70Q289.35 24.50 299.10 24.50L299.10 24.50Q306.25 24.50 311.80 26.70Q317.35 28.90 320.20 34.30L320.20 34.30Q321.80 37.30 322.10 40.30Q322.40 43.30 322.40 47L322.40 47L322.40 80L310.50 80L310.50 73.35Q307.30 77.15 303.70 79.05L303.70 79.05Q299.10 81.50 292.10 81.50ZM295 70.80L295 70.80Q298.75 70.80 301.33 69.47Q303.90 68.15 305.43 66.45Q306.95 64.75 307.50 63.60L307.50 63.60Q308.55 61.40 308.75 58.45L308.75 58.45Q308.85 56.70 308.85 55.25L308.85 55.25Q305.50 55.85 303.10 56.25L303.10 56.25Q299.35 56.95 297.05 57.50Q294.75 58.05 293 58.70L293 58.70Q291 59.50 289.78 60.42Q288.55 61.35 287.98 62.45Q287.40 63.55 287.40 64.90L287.40 64.90Q287.40 66.75 288.33 68.08Q289.25 69.40 290.95 70.10Q292.65 70.80 295 70.80Z",
  "M349.00 80L335.40 80L335.40 6.50L349.00 6.50L349.00 80Z",
  "M378.80 80L365.20 80L365.20 66.40L378.80 66.40L378.80 80Z",
  "M415.90 81.50L415.90 81.50Q408.45 81.50 402.85 77.75Q397.25 74 394.13 67.55Q391.00 61.10 391.00 53L391.00 53Q391.00 44.75 394.18 38.32Q397.35 31.90 403.10 28.20Q408.85 24.50 416.60 24.50L416.60 24.50Q423.75 24.50 428.80 27.75L428.80 27.75L428.80 8L442.50 8L442.50 80L430.50 80L430.50 76.90Q429.95 77.35 429.35 77.75L429.35 77.75Q423.95 81.50 415.90 81.50ZM418.10 69.40L418.10 69.40Q422.65 69.40 425.38 67.35Q428.10 65.30 429.30 61.60Q430.50 57.90 430.50 53Q430.50 48.10 429.30 44.40Q428.10 40.70 425.48 38.65Q422.85 36.60 418.60 36.60L418.60 36.60Q414.05 36.60 411.13 38.82Q408.20 41.05 406.80 44.77Q405.40 48.50 405.40 53L405.40 53Q405.40 57.55 406.75 61.27Q408.10 65 410.90 67.20Q413.70 69.40 418.10 69.40Z"
];

export function LogoAddress({ className, trigger = "intro", mark = false }: { className?: string; trigger?: "intro" | "view"; mark?: boolean }) {
  const id = useId().replace(/:/g, "");
  const [ref, shown] = useLogoShown(trigger);
  const width = mark ? 80 : 552;
  return (
    <svg
      ref={ref}
      viewBox={`-2 0 ${width} 84`}
      role="img"
      aria-label="arsenal.d"
      className={cn("nl-logo nl-a", shown && "is-in", className)}
      style={{ aspectRatio: `${width} / 84` }}
    >
      <defs>
        <linearGradient id={`${id}-r`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff3b3b" />
          <stop offset="1" stopColor="#b3121f" />
        </linearGradient>
      </defs>
      <g className="nl-mark">
        <rect x="0" y="4" width="76" height="76" rx="20" fill={`url(#${id}-r)`} />
        <circle className="nl-ring" cx="40" cy="52" r="15.5" fill="none" stroke="#fff" strokeWidth="9" />
        <rect className="nl-stem" x="51" y="17" width="9" height="55" rx="4.5" fill="#fff" />
        <circle className="nl-dot" cx="14" cy="66" r="6" fill="#fff" />
      </g>
      {mark ? null : (
        <g transform="translate(96 0)">
          {ADDRESS.map((d, index) => (
            <path key={index} d={d} className={index >= 7 ? "nl-tld" : "nl-ch"} fill={index >= 7 ? "#e1121b" : "currentColor"} style={{ "--c": index } as React.CSSProperties} />
          ))}
          <rect className="nl-caret" x="352" y="22" width="5" height="60" rx="2.5" fill="#e1121b" />
        </g>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* B «Щит» — ARSENAL D                                                 */
/* ------------------------------------------------------------------ */

/** «ARSENAL», Unbounded SemiBold, 44 единицы на кегль, разрядка 5. */
const SHIELD_WORD = [
  "M15.36 27L26.14 27L41.36 60L32.52 60L29.57 53.36L11.92 53.36L8.98 60L0.09 60L15.36 27ZM14.87 46.62L26.58 46.62L20.72 33.38L14.87 46.62Z",
  "M63.30 47.81L58.02 47.81L58.02 60L49.70 60L49.70 27L68.93 27Q72.63 27 75.40 28.32Q78.17 29.64 79.71 31.97Q81.25 34.30 81.25 37.43L81.25 37.43Q81.25 40.51 79.71 42.84Q78.17 45.17 75.40 46.49L75.40 46.49Q74.04 47.15 72.45 47.46L72.45 47.46L82.31 60L72.67 60L63.30 47.81ZM58.02 33.34L58.02 41.52L67.83 41.52Q70.16 41.52 71.53 40.44Q72.89 39.36 72.89 37.43Q72.89 35.49 71.53 34.41Q70.16 33.34 67.83 33.34L67.83 33.34L58.02 33.34Z",
  "M90.08 49.22L90.08 49.22L98.48 49.22Q98.70 50.72 99.85 51.86Q100.99 53.00 102.91 53.62Q104.82 54.24 107.37 54.24L107.37 54.24Q111.02 54.24 113.11 53.22Q115.20 52.21 115.20 50.36L115.20 50.36Q115.20 48.96 113.99 48.19Q112.78 47.42 109.48 47.06L109.48 47.06L103.10 46.40Q96.46 45.74 93.49 43.32Q90.52 40.90 90.52 36.72L90.52 36.72Q90.52 33.42 92.48 31.09Q94.44 28.76 97.98 27.53Q101.52 26.30 106.27 26.30L106.27 26.30Q110.98 26.30 114.59 27.66Q118.20 29.02 120.35 31.44Q122.51 33.86 122.68 37.12L122.68 37.12L114.28 37.12Q114.10 35.76 113.07 34.81Q112.04 33.86 110.30 33.31Q108.56 32.76 106.14 32.76L106.14 32.76Q102.80 32.76 100.84 33.71Q98.88 34.66 98.88 36.42L98.88 36.42Q98.88 37.74 100.05 38.48Q101.21 39.23 104.20 39.58L104.20 39.58L110.94 40.33Q115.56 40.82 118.33 41.87Q121.10 42.93 122.33 44.78Q123.56 46.62 123.56 49.44L123.56 49.44Q123.56 52.83 121.52 55.36Q119.47 57.89 115.80 59.30Q112.12 60.70 107.24 60.70L107.24 60.70Q102.18 60.70 98.37 59.25Q94.57 57.80 92.39 55.23Q90.21 52.65 90.08 49.22Z",
  "M142.34 40.42L161.08 40.42L161.08 46.58L142.34 46.58L141.28 53.18L162.49 53.18L162.49 60L132.30 60L134.86 43.50L132.30 27L162.27 27L162.27 33.82L141.28 33.82L142.34 40.42Z",
  "M183.72 27L200.84 50.63L200.84 27L208.89 27L208.89 60L198.42 60L181.00 35.89L181.00 60L172.94 60L172.94 27L183.72 27Z",
  "M232.46 27L243.24 27L258.46 60L249.62 60L246.67 53.36L229.03 53.36L226.08 60L217.19 60L232.46 27ZM231.98 46.62L243.68 46.62L237.83 33.38L231.98 46.62Z",
  "M266.81 27L275.12 27L275.12 52.65L296.11 52.65L296.11 60L266.81 60L266.81 27Z"
];
const SHIELD_D = "M3.21 27L19.32 27Q25.12 27 29.48 29.07Q33.84 31.14 36.28 34.83Q38.72 38.53 38.72 43.50L38.72 43.50Q38.72 48.43 36.28 52.15Q33.84 55.86 29.48 57.93Q25.12 60 19.32 60L19.32 60L3.21 60L3.21 27ZM11.48 34.35L11.48 52.65L19.93 52.65Q23.10 52.65 25.43 51.51Q27.76 50.36 29.04 48.32Q30.32 46.27 30.32 43.50L30.32 43.50Q30.32 40.68 29.04 38.66Q27.76 36.64 25.43 35.49Q23.10 34.35 19.93 34.35L19.93 34.35L11.48 34.35Z";
const SHIELD_D_X = 396.90;

export function LogoShield({ className, trigger = "intro", mark = false }: { className?: string; trigger?: "intro" | "view"; mark?: boolean }) {
  const id = useId().replace(/:/g, "");
  const [ref, shown] = useLogoShown(trigger);
  const width = mark ? 80 : 441;
  return (
    <svg
      ref={ref}
      viewBox={`-6 -8 ${width} 92`}
      role="img"
      aria-label="Arsenal D"
      className={cn("nl-logo nl-b", shown && "is-in", className)}
      style={{ aspectRatio: `${width} / 92` }}
    >
      <defs>
        <linearGradient id={`${id}-r`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff3b3b" />
          <stop offset="1" stopColor="#a30a16" />
        </linearGradient>
      </defs>
      <g className="nl-shield">
        <path d="M0 6Q0 0 6 0H58Q64 0 64 6V36C64 56 48 70 32 76C16 70 0 56 0 36Z" fill={`url(#${id}-r)`} />
        <path className="nl-letter" fill="#fff" fillRule="evenodd" d="M18 18H30C42 18 48 27 48 37C48 47 42 56 30 56H18Z M26 26H30C36 26 40 31 40 37C40 43 36 48 30 48H26Z" />
      </g>
      <path className="nl-spark" d="M54 -3L56.6 7.4L67 10L56.6 12.6L54 23L51.4 12.6L41 10L51.4 7.4Z" fill="#fff" stroke="#b3121f" strokeWidth="1.6" strokeLinejoin="round" />
      {mark ? null : (
        <g transform="translate(86 -5)">
          {SHIELD_WORD.map((d, index) => (
            <path key={index} d={d} className="nl-ch" fill="currentColor" style={{ "--c": index } as React.CSSProperties} />
          ))}
          {/* Сдвиг — на группе: CSS-анимация буквы задаёт свой transform и
              перетёрла бы атрибут на самом контуре. */}
          <g transform={`translate(${SHIELD_D_X - 86} 0)`}>
            <path d={SHIELD_D} className="nl-tld" fill="#e1121b" />
          </g>
        </g>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Логотип в шапке и подвале: какой вариант включён в конструкторе — тот и
 * стоит; ни один — их нынешний знак. Смена варианта перемонтирует знак, и
 * его появление играет заново.
 */
export function BrandLogo({ className, trigger = "intro" }: { className?: string; trigger?: "intro" | "view" }) {
  const a = useAddon("logo-a");
  const b = useAddon("logo-b");
  if (a) return <LogoAddress key="a" className={className} trigger={trigger} />;
  if (b) return <LogoShield key="b" className={className} trigger={trigger} />;
  return <ArsenalLogo key="old" className={className} trigger={trigger} />;
}

/* ------------------------------------------------------------------ */
/* Презентация нового логотипа — блок допа на главной                  */
/* ------------------------------------------------------------------ */

const IDEA = {
  a: {
    name: "«Адрес»",
    title: "arsenal.d — имя, записанное как домен",
    text: "Точка — то, с чего начинается любой адрес в интернете, «d» — их буква. Компания, которая выдаёт адреса, сама подписывается адресом. Знак «.d» в красном квадрате сразу работает иконкой приложения и фавиконом.",
    tab: "arsenal.d — домены .UZ",
  },
  b: {
    name: "«Щит»",
    title: "Щит с буквой D — хранитель вашего адреса",
    text: "Регистратор отвечает за то, чтобы адрес был вашим: договор, SSL, DNSSEC. Отсюда щит. В углу — звезда из нынешнего знака, чтобы старые клиенты узнали своих. ARSENAL D — широкими прописными, как на табличке у входа.",
    tab: "Arsenal D — домены .UZ",
  },
} as const;

export function LogoShowcase({ kind }: { kind: "a" | "b" }) {
  const [round, setRound] = useState(0);
  const idea = IDEA[kind];
  const Logo = kind === "a" ? LogoAddress : LogoShield;
  return (
    <section id={`logo-${kind}`} className="scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-wn-muted">Новый логотип · вариант {kind.toUpperCase()} {idea.name}</p>
            <h2 className="wn-display mt-2 max-w-3xl text-3xl sm:text-5xl">{idea.title}</h2>
            <p className="mt-4 max-w-2xl text-wn-ink-2">{idea.text}</p>
          </div>
          <button type="button" onClick={() => setRound(round + 1)} className="wn-btn wn-btn-ghost shrink-0 self-start lg:self-auto">
            Повторить появление
          </button>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          <div className="flex min-h-56 items-center justify-center rounded-[1.5rem] bg-[#edf2ef] p-8 text-[#111b3b] ring-1 ring-black/5 lg:col-span-7">
            <Logo key={`l-${round}`} trigger="view" className="h-14 w-auto max-w-full sm:h-20" />
          </div>
          <div className="flex min-h-56 items-center justify-center rounded-[1.5rem] bg-[#0b0a10] p-8 text-[#f5f0ea] ring-1 ring-white/10 lg:col-span-5">
            <Logo key={`d-${round}`} trigger="view" className="h-12 w-auto max-w-full sm:h-16" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:col-span-12">
            <figure className="wn-card flex flex-col items-center justify-center gap-3 p-5">
              <span className="flex h-24 w-24 items-center justify-center rounded-[1.6rem] bg-gradient-to-br from-[#2a2438] to-[#0b0a10] p-3 shadow-lg">
                <Logo mark key={`m-${round}`} trigger="view" className="h-full w-auto" />
              </span>
              <figcaption className="text-xs text-wn-muted">Иконка приложения</figcaption>
            </figure>
            <figure className="wn-card flex flex-col items-center justify-center gap-3 p-5">
              <span className="flex w-full max-w-[13rem] items-center gap-2 rounded-t-xl bg-[#dfe3e8] px-3 py-2 text-[#1f2328]">
                <Logo mark trigger="view" className="h-4 w-auto" />
                <span className="truncate text-xs">{idea.tab}</span>
              </span>
              <figcaption className="text-xs text-wn-muted">Вкладка браузера, 16 px</figcaption>
            </figure>
            <figure className="wn-card flex flex-col justify-center gap-2 p-5">
              {[
                ["#e1121b", "Красный «D»"],
                ["#111b3b", "Чернила"],
                ["#edf2ef", "Бумага"],
              ].map(([color, label]) => (
                <span key={color} className="flex items-center gap-2 text-xs">
                  <span className="h-6 w-6 shrink-0 rounded-full ring-1 ring-black/10" style={{ background: color }} />
                  <span className="text-wn-ink-2">{label}</span>
                  <b className="wn-mono ml-auto">{color}</b>
                </span>
              ))}
              <figcaption className="mt-1 text-xs text-wn-muted">Цвета знака</figcaption>
            </figure>
            <figure className="wn-card flex flex-col items-center justify-center gap-3 p-5">
              <span className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#edf2ef] px-3 py-3 text-[#111b3b]">
                <ArsenalLogo trigger="view" className="aspect-[480/92] h-5 w-auto" />
              </span>
              <span className="text-xs text-wn-muted">было → стало</span>
              <span className="flex w-full items-center justify-center rounded-xl bg-[#edf2ef] px-3 py-3 text-[#111b3b]">
                <Logo trigger="view" className="h-5 w-auto max-w-full" />
              </span>
            </figure>
          </div>
        </div>
        <p className="mt-4 text-xs text-wn-muted">Включённый вариант уже стоит в шапке и подвале на всех страницах. Шрифты знака — Manrope и Unbounded (OFL), знак рисуется кодом — файлы для печати отдаются в SVG.</p>
      </div>
    </section>
  );
}
