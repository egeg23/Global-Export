"use client";

import { Unbounded } from "next/font/google";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { DEVUZ_INTRO_END } from "@/lib/brand/intro";

/**
 * Заставка студии перед главной страницей проекта.
 *
 * Сценарий один и тот же везде: из темноты собирается знак, рядом встаёт
 * имя, знак разлетается кодом, и сквозь разлёт открывается сайт. Полоса под
 * именем — не украшение: пока кадр держится, страница под ним успевает
 * дособрать шрифты, фотографии и первый экран, и посетитель видит её уже
 * целой, а не по частям.
 *
 * Почему не CSS-анимация. Здесь восемь слоёв, которые обязаны знать друг о
 * друге: кольцо расходится ровно тогда, когда гаснет знак, а вуаль уходит
 * ровно тогда, когда код долетает до краёв. Один requestAnimationFrame
 * считает время и раскладывает его по переменным узла — React за все
 * четыре с половиной секунды не перерисовывается ни разу.
 *
 * Решение «показывать или нет» принимается до первой отрисовки — скриптом,
 * который стоит в разметке перед самим слоем. Иначе на светлых сайтах
 * заказчиков успевала бы мигнуть страница, а у тех, кто заставку уже видел,
 * мигала бы заставка.
 */

/* Шрифт знака: имя студии набирается им же, что и на devuz.studio, и не
   зависит от того, какие шрифты подключил конкретный проект. */
const display = Unbounded({
  subsets: ["latin"],
  weight: ["800"],
  display: "block",
});

/* ------------------------------------------------------------------ */
/* Разметка знака                                                      */
/* ------------------------------------------------------------------ */

/** Восьмиконечная звезда «Руб-эль-Хизб» — знак студии. */
const STAR_PATH =
  "M0 -100 L29.29 -70.71 L70.71 -70.71 L70.71 -29.29 L100 0 L70.71 29.29 " +
  "L70.71 70.71 L29.29 70.71 L0 100 L-29.29 70.71 L-70.71 70.71 L-70.71 29.29 " +
  "L-100 0 L-70.71 -29.29 L-70.71 -70.71 L-29.29 -70.71 Z";

const WORD = [
  { char: "D", accent: false },
  { char: "e", accent: false },
  { char: "v", accent: false },
  { char: "U", accent: true },
  { char: "z", accent: true },
];

/* ------------------------------------------------------------------ */
/* Хронометраж                                                         */
/* ------------------------------------------------------------------ */

const BURST = 2500;
const OPEN = 3050;
const TOTAL = 4600;

/** Сцены — для чтения и для проверки, а не для кода. */
const SCENES = [
  [0, 1000, "знак собирается из темноты"],
  [1000, 1750, "имя встаёт буква за буквой"],
  [1750, BURST, "знак набирает свет"],
  [BURST, OPEN, "взрыв: код уходит в стороны"],
  [OPEN, TOTAL, "вуаль расходится, открывается страница"],
] as const;

/** Линейная доля внутри отрезка: 0 до начала, 1 после конца. */
const span = (t: number, from: number, to: number) =>
  Math.min(Math.max((t - from) / (to - from), 0), 1);

/** Плавный вход и выход. */
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);

/** Разгон: к концу отрезка быстрее, чем в начале. */
const accel = (x: number) => x * x;

/* ------------------------------------------------------------------ */
/* Разлетающийся код                                                   */
/* ------------------------------------------------------------------ */

const GLYPHS = [
  "</>", "{ }", "=>", "( )", "[ ]", "&&", "::", "/*", "*/", "<>",
  "01", "10", "#", ";", "|", "$", "~", "!=", "++", "·",
];

const SPARK = ["#22f0a0", "#5b9bff", "#e8b14c"];
const INK = ["#eaf0f7", "#22f0a0", "#5b9bff", "#8b97a8", "#e8b14c"];

type Bit = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Знак кода или, если null, искра. */
  text: string | null;
  size: number;
  color: string;
  rot: number;
  spin: number;
  /** Насколько знак «летит на зрителя»: растёт по дороге. */
  grow: number;
  life: number;
  age: number;
};

/** Сколько осколков поднимать: на телефоне меньше, чем на мониторе. */
function bitCount(width: number) {
  return Math.round(Math.min(190, Math.max(84, width / 8)));
}

function makeBits(cx: number, cy: number, width: number): Bit[] {
  const total = bitCount(width);
  const bits: Bit[] = [];
  // Разлёт считается от радиуса экрана: на широком мониторе код обязан
  // долететь до краёв за то же время, что и на телефоне.
  const reach = Math.hypot(width, typeof window === "undefined" ? 800 : window.innerHeight) / 2;

  for (let i = 0; i < total; i++) {
    const glyph = i % 5 !== 0;
    // Углы раскладываются по кругу с разбросом: ровная спица читалась бы
    // как салют, а не как взрыв.
    const angle = (i / total) * Math.PI * 2 + (Math.random() - 0.5) * 0.9;
    const speed = reach * (0.8 + Math.random() ** 1.4 * 1.9);

    bits.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed * 0.86,
      text: glyph ? GLYPHS[i % GLYPHS.length] : null,
      size: glyph ? 13 + Math.random() * 16 : 1.8 + Math.random() * 2.6,
      color: glyph ? INK[i % INK.length] : SPARK[i % SPARK.length],
      rot: (Math.random() - 0.5) * 0.8,
      spin: (Math.random() - 0.5) * 2.4,
      grow: glyph ? Math.random() * 0.6 : 0,
      life: 1100 + Math.random() * 1300,
      age: 0,
    });
  }

  return bits;
}

/* ------------------------------------------------------------------ */
/* Решение до первой отрисовки                                         */
/* ------------------------------------------------------------------ */

/** Идентификатор служебного стиля, которым распоряжается заставка. */
const GUARD = "dz-guard";

/** Заставку убрать — этой странице и следующим в этой вкладке. */
const HIDE = ".dz-intro{display:none!important}";

/** Прокрутка заперта: под кино страница стоит на месте. */
const LOCK = "body{overflow:hidden!important}";

/**
 * Скрипт стоит в разметке перед самим слоем и решает, показывать ли кино.
 * Слой при этом открыт с самого начала — стилем прямо на узле, — а скрипт
 * при отказе его закрывает. Наоборот не выходит: правило из <head>
 * применяется позже первой отрисовки, и на светлых сайтах между ними
 * успевает мигнуть страница.
 *
 * Правило в <head>, а не отметка на <html>: разметку страницы держит React,
 * и чужой атрибут на её корне при гидратации читается как расхождение.
 *
 * Отложенная страховка — на случай, если разметка доехала, а сценарий нет:
 * через девять секунд слой уходит сам, и страница не остаётся запертой.
 */
const guard = (key: string) => `(function(){try{
var p=true;
try{if(sessionStorage.getItem('dz:${key}')==='1')p=false}catch(e){}
if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)p=false;
var s=document.createElement('style');s.id='${GUARD}';s.textContent=p?'${LOCK}':'${HIDE}';
document.head.appendChild(s);
window.__dz=p;
if(p)setTimeout(function(){if(document.querySelector('.dz-intro'))s.textContent='${HIDE}'},9000);
}catch(e){}})();`;

/** Переписать служебное правило. Если его нет — заставка и не играла. */
function setGuard(css: string) {
  const found = document.getElementById(GUARD);
  if (found instanceof HTMLStyleElement) found.textContent = css;
}

/** Играет ли заставка прямо сейчас — по отметке, оставленной скриптом. */
function playing(): boolean {
  return (window as unknown as { __dz?: boolean }).__dz === true;
}

/**
 * Слой разбирается до отрисовки, а не после: при переходе внутри сайта
 * скрипт из разметки не выполняется, и заставка, закрытая только эффектом,
 * успела бы мигнуть чернотой на один кадр.
 */
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* ------------------------------------------------------------------ */
/* Сама заставка                                                       */
/* ------------------------------------------------------------------ */

export function DevuzIntro({
  /**
   * Ключ проекта. По нему заставка помнит, что её уже показывали: заказчик
   * ходит по макету десятками переходов, и кино на каждый из них перестаёт
   * быть подписью и становится помехой.
   */
  project,
}: {
  project: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const mark = useRef<SVGSVGElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const ended = useRef(false);
  const [gone, setGone] = useState(false);

  /**
   * Кадр свободен: страница под заставкой уже собрана, прокрутка отпирается,
   * и те, у кого есть свой пролог, начинают его. Слой при этом остаётся —
   * сквозь него ещё летит код.
   */
  const release = useCallback(() => {
    if (ended.current) return;
    ended.current = true;
    setGuard("");
    (window as unknown as { __dz?: boolean }).__dz = false;
    window.dispatchEvent(new Event(DEVUZ_INTRO_END));
  }, []);

  /**
   * Слой уходит совсем — и остаётся закрытым: переход внутри сайта не
   * должен затемнить кадр на те доли секунды, пока не отработает эффект.
   */
  const close = useCallback(() => {
    release();
    setGuard(HIDE);
    setGone(true);
  }, [release]);

  const skip = useCallback(() => {
    root.current?.setAttribute("data-skip", "true");
    release();
    window.setTimeout(close, 360);
  }, [close, release]);

  useBeforePaint(() => {
    const node = root.current;
    if (!node) return;

    // Показывать или нет, решил скрипт в разметке — здесь остаётся только
    // прочитать его ответ. При переходе внутри сайта разметка не
    // перечитывается и скрипт не выполняется: ответ там остаётся с прошлой
    // страницы, «уже показывали», — ровно то, что и нужно.
    if (!playing()) {
      node.setAttribute("data-off", "true");
      release();
      setGuard(HIDE);
      return;
    }

    try {
      sessionStorage.setItem(`dz:${project}`, "1");
    } catch {
      // Приватная вкладка: заставка просто покажется ещё раз.
    }

    const set = (name: string, value: number) => node.style.setProperty(name, value.toFixed(4));

    /* --- холст под разлёт ------------------------------------------ */

    const surface = canvas.current;
    const ctx = surface?.getContext("2d") ?? null;
    let dpr = 1;

    const resize = () => {
      if (!surface || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      surface.width = Math.round(window.innerWidth * dpr);
      surface.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let bits: Bit[] = [];

    const paint = (dt: number) => {
      if (!surface || !ctx) return;
      ctx.clearRect(0, 0, surface.width / dpr, surface.height / dpr);

      for (const bit of bits) {
        bit.age += dt;
        if (bit.age > bit.life) continue;

        // Сопротивление: код вылетает резко и замедляется, а не летит
        // по прямой до самого конца. Степень считается от кадра в 1/60
        // секунды, иначе на быстром экране торможение выходит мгновенным.
        const drag = 0.992 ** (dt / 16.67);
        bit.vx *= drag;
        bit.vy *= drag;
        bit.x += (bit.vx * dt) / 1000;
        bit.y += (bit.vy * dt) / 1000;
        bit.rot += (bit.spin * dt) / 1000;

        const k = bit.age / bit.life;
        const alpha = Math.min(1, bit.age / 70) * (k < 0.5 ? 1 : 1 - (k - 0.5) / 0.5);
        if (alpha <= 0.01) continue;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(bit.x, bit.y);
        ctx.rotate(bit.rot);

        if (bit.text) {
          const size = bit.size * (1 + bit.grow * k);
          ctx.font = `600 ${size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = bit.color;
          ctx.fillText(bit.text, 0, 0);
        } else {
          ctx.globalCompositeOperation = "lighter";
          ctx.fillStyle = bit.color;
          ctx.beginPath();
          ctx.arc(0, 0, bit.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    };

    /* --- время ------------------------------------------------------ */

    let frame = 0;
    let last = performance.now();
    // Сколько посетитель уже прождал. Слой накрывает кадр с первой
    // отрисовки, а сценарий заводится только после гидратации: на медленной
    // связи это секунды, которые уже отняты у человека. Поэтому сценарий
    // начинается не с нуля, а со сборки знака ближе к концу — заставка
    // прикрывает загрузку, а не добавляет к ней свои четыре секунды.
    const head = Math.min(Math.max(last - 900, 0), 1800);
    const start = last - head;

    const draw = (now: number) => {
      const t = now - start;
      const dt = Math.min(now - last, 48);
      last = now;

      // Сетка: приходит из-за кадра и сжимается к знаку перед взрывом.
      set("--dz-grid", span(t, 80, 900) * (1 - span(t, BURST, BURST + 420)));
      set("--dz-grid-s", 1.34 - ease(span(t, 80, 2000)) * 0.3 - span(t, 2050, BURST) * 0.05);

      // Знак: обводка вычерчивается, заливка догоняет, курсор проступает.
      const born = ease(span(t, 140, 980));
      const charge = span(t, 1900, BURST);
      const blast = span(t, BURST, BURST + 380);
      set("--dz-draw", born);
      set("--dz-fill", span(t, 620, 1180));
      set("--dz-mark", Math.min(span(t, 100, 420), 1) * (1 - blast));
      set("--dz-mark-s", 0.88 + born * 0.12 - ease(charge) * 0.09 + accel(blast) * 0.9);
      set("--dz-mark-blur", accel(blast) * 16);
      set("--dz-caret", span(t, 760, 1060) * (1 - blast));

      // Свет: ровный ореол на сборке и вспышка в момент взрыва.
      set(
        "--dz-glow",
        span(t, 700, 1200) * 0.42 + accel(charge) * 0.5 - span(t, BURST + 120, BURST + 900) * 0.92,
      );
      set("--dz-glow-s", 0.5 + ease(span(t, 700, 1400)) * 0.3 + accel(blast) * 1.4);

      // Имя: буква за буквой, и вместе с кадром — в стороны.
      set("--dz-type", span(t, 980, 1720) * 5.4);
      set("--dz-domain", span(t, 1720, 2060) * (1 - span(t, BURST, BURST + 300)));
      set("--dz-name", 1 - span(t, BURST + 40, BURST + 420));
      set("--dz-bar", span(t, 520, OPEN));

      // Ударная волна и вспышка: кадр на мгновение выбеливает.
      set("--dz-ring-on", t >= BURST ? 1 : 0);
      set("--dz-ring", ease(span(t, BURST, BURST + 900)));
      set("--dz-flash", span(t, BURST - 50, BURST + 20) * (1 - span(t, BURST + 20, BURST + 300)));

      // Кнопка пропуска: появляется, когда смотреть уже есть что, и
      // уходит перед взрывом — дальше жать всё равно не на что.
      set("--dz-skip", span(t, 620, 1000) * (1 - span(t, BURST, BURST + 260)));

      // Вуаль: уходит последней, уже поверх собранной страницы.
      set("--dz-veil", 1 - span(t, OPEN, 4250));

      if (t >= BURST && bits.length === 0) {
        const rect = mark.current?.getBoundingClientRect();
        const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
        const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
        bits = makeBits(cx, cy, window.innerWidth);
      }
      if (bits.length > 0) paint(dt);

      // Страница открывается раньше, чем кончается кино: пока код долетает
      // до краёв, первый экран уже стоит под ним.
      if (t >= OPEN) {
        node.setAttribute("data-open", "true");
        release();
      }

      if (t < TOTAL) {
        frame = requestAnimationFrame(draw);
        return;
      }
      close();
    };

    frame = requestAnimationFrame(draw);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
    };
  }, [close, project, release, skip]);

  return (
    <>
      {/* Решение принимается до первой отрисовки — скрипт обязан стоять
          перед слоем и выполниться синхронно. */}
      <script dangerouslySetInnerHTML={{ __html: guard(project) }} />

      {gone ? null : (
        <div
          ref={root}
          className="dz-intro"
          // Открыт с первого кадра: правило из <head> применилось бы позже.
          style={{ display: "grid" }}
          data-testid="devuz-intro"
          onClick={skip}
          role="presentation"
        >
          <div className="dz-intro__layers" aria-hidden>
            <div className="dz-intro__void" />
            <div className="dz-intro__grid" />
            <div className="dz-intro__glow" />
            <div className="dz-intro__ring" />
            <div className="dz-intro__flash" />
          </div>

          <div className="dz-intro__stage">
            <svg
              ref={mark}
              className="dz-intro__mark"
              viewBox="-112 -112 224 224"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <linearGradient id="dz-grad" x1="0" y1="-1" x2="1" y2="1">
                  <stop offset="0" stopColor="#5B9BFF" />
                  <stop offset="55%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#22F0A0" />
                </linearGradient>
                <mask id="dz-cut">
                  <rect x="-112" y="-112" width="224" height="224" fill="#fff" />
                  <path
                    d="M-22 -34 L-58 0 L-22 34"
                    stroke="#000"
                    strokeWidth="15"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 -34 L58 0 L22 34"
                    stroke="#000"
                    strokeWidth="15"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </mask>
              </defs>

              {/* Заливка догоняет обводку: сначала знак вычерчен линией,
                  потом наливается цветом. */}
              <path
                d={STAR_PATH}
                fill="url(#dz-grad)"
                mask="url(#dz-cut)"
                style={{ opacity: "var(--dz-fill, 0)" }}
              />
              <path
                className="dz-intro__stroke"
                d={STAR_PATH}
                pathLength={1000}
                fill="none"
                stroke="url(#dz-grad)"
                strokeWidth="4"
                strokeLinejoin="round"
                mask="url(#dz-cut)"
              />
              <rect
                className="dz-intro__caret"
                x="-5"
                y="-27"
                width="10"
                height="54"
                rx="5"
                fill="#e8b14c"
              />
            </svg>

            <div className="dz-intro__name">
              <p className={`dz-intro__word ${display.className}`} aria-hidden>
                {WORD.map((letter, index) => (
                  <span
                    key={letter.char + index}
                    data-accent={letter.accent}
                    style={{ "--i": index } as React.CSSProperties}
                  >
                    {letter.char}
                  </span>
                ))}
              </p>
              <p className="dz-intro__domain" aria-hidden>
                devuz.studio
              </p>
            </div>

            <div className="dz-intro__bar" aria-hidden />
            <p className="dz-intro__sr">DevUz Studio</p>
          </div>

          <canvas ref={canvas} className="dz-intro__code" aria-hidden />

          <button
            type="button"
            className="dz-intro__skip"
            onClick={(event) => {
              event.stopPropagation();
              skip();
            }}
          >
            Пропустить
          </button>
        </div>
      )}
    </>
  );
}

/** Отрезки сцены — читает проверка, чтобы не выписывать числа второй раз. */
export const devuzIntroScenes = SCENES;
export const devuzIntroDuration = TOTAL;
