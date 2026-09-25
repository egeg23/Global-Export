"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";

import { company } from "@/content/akbar/company";
import { whenDevuzIntroDone } from "@/lib/brand/intro";
import { useCalmMotion } from "@/lib/calm-motion";

/**
 * Проём в кадре двери: где в картинке рамы лежит полотно (доли от её
 * ширины и высоты). Сняты с исходника 1300×1584 — полотно вырезано из рамы
 * по контуру, петли справа.
 */
const HOLE = { left: 0.3008, top: 0.0991, width: 0.3992, height: 0.8567 };
const HOLE_CX = HOLE.left + HOLE.width / 2;
const HOLE_CY = HOLE.top + HOLE.height / 2;

type Geo = {
  vw: number;
  vh: number;
  /** Центр проёма и его размер в покое — в координатах экрана сцены. */
  cx: number;
  cy: number;
  hw: number;
  hh: number;
  /** Во сколько раз вырасти, чтобы проём накрыл экран. */
  zoom: number;
};

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/**
 * Первый экран — дверь, которая открывается прокруткой.
 *
 * Три слоя: стена с рамой, полотно на петлях справа и комната за проёмом.
 * Сначала полотно уходит внутрь, потом камера входит в проём: рама растёт
 * от центра проёма, пока он не накроет экран, и страница оказывается в
 * комнате. Комната — отдельный слой во весь экран, обрезанный по проёму:
 * так она остаётся резкой, сколько бы ни выросла рама.
 *
 * Без движения (системная настройка) — обычный первый экран с приоткрытой
 * дверью, без закрепления и без входа в комнату.
 */
export function AkbarHero() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const geo = useRef<Geo | null>(null);
  const [ready, setReady] = useState(false);
  const calm = useCalmMotion();

  const { scrollYProgress: progress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });

  // Приоткрыта при загрузке — и распахивается прокруткой.
  const ajar = useMotionValue(0);
  const open = useTransform(progress, [0, 0.03, 0.4, 1], [0, 0, 1, 1]);
  const rotateY = useTransform([open, ajar], ([o, a]: number[]) => -(14 * a + (98 - 14 * a) * smooth(o)));
  const leafShade = useTransform(open, [0, 1], [0.12, 0.6]);
  const glow = useTransform([open, ajar], ([o, a]: number[]) => 0.2 + 0.25 * a + 0.55 * o);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const clip = useMotionValue("inset(50% 50% 50% 50%)");
  const roomScale = useMotionValue(1.18);

  // Крайние точки 0 и 1 заданы явно: прокрутку эти значения играют
  // средствами браузера, и без последнего ключа он возвращает свойство к
  // исходному — текст «проявлялся» бы обратно в конце сцены.
  const textOpacity = useTransform(progress, [0, 0.04, 0.26, 1], [1, 1, 0, 0]);
  const textY = useTransform(progress, [0, 0.04, 0.3, 1], [0, 0, -90, -90]);
  const captionOpacity = useTransform(progress, [0, 0.8, 0.93, 1], [0, 0, 1, 1]);
  const captionY = useTransform(progress, [0, 0.8, 0.95, 1], [40, 40, 0, 0]);

  /** Раскладка входа в проём для текущей прокрутки. */
  const apply = (value: number) => {
    const g = geo.current;
    if (!g) return;
    const k = smooth(clamp01((value - 0.38) / 0.5));
    const s = 1 + (g.zoom - 1) * k * k;
    const tx = (g.vw / 2 - g.cx) * k;
    const ty = (g.vh / 2 - g.cy) * k;
    x.set(tx);
    y.set(ty);
    scale.set(s);
    roomScale.set(1.18 - 0.18 * k);

    const cx = g.cx + tx;
    const cy = g.cy + ty;
    const hw = (g.hw * s) / 2;
    const hh = (g.hh * s) / 2;
    const top = Math.max(0, cy - hh);
    const bottom = Math.max(0, g.vh - (cy + hh));
    const left = Math.max(0, cx - hw);
    const right = Math.max(0, g.vw - (cx + hw));
    clip.set(`inset(${top}px ${right}px ${bottom}px ${left}px)`);
  };

  useMotionValueEvent(progress, "change", apply);

  useEffect(() => {
    if (calm) return;
    const stageNode = stage.current;
    const slotNode = slot.current;
    if (!stageNode || !slotNode) return;

    const measure = () => {
      const box = stageNode.getBoundingClientRect();
      const door = slotNode.getBoundingClientRect();
      const hw = door.width * HOLE.width;
      const hh = door.height * HOLE.height;
      geo.current = {
        vw: box.width,
        vh: box.height,
        cx: door.left - box.left + door.width * HOLE_CX,
        cy: door.top - box.top + door.height * HOLE_CY,
        hw,
        hh,
        zoom: Math.max(box.width / hw, box.height / hh) * 1.12,
      };
      apply(progress.get());
      setReady(true);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(stageNode);
    observer.observe(slotNode);
    return () => observer.disconnect();
    // apply и progress стабильны на всё время жизни компонента.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calm]);

  // Дверь приоткрывается, когда заставка студии освободит кадр.
  useEffect(() => {
    if (calm) {
      ajar.set(1);
      return;
    }
    let stop: (() => void) | undefined;
    const cancel = whenDevuzIntroDone(() => {
      const controls = animate(ajar, 1, { duration: 1.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] });
      stop = () => controls.stop();
    });
    return () => {
      cancel();
      stop?.();
    };
  }, [ajar, calm]);

  const live = ready && !calm;

  return (
    <section
      ref={section}
      aria-label="Akbar Rich — фабрика дверей"
      className={calm ? "relative" : "relative h-[270svh] lg:h-[320vh]"}
    >
      <div
        ref={stage}
        className={
          calm
            ? "relative h-svh min-h-[40rem] overflow-hidden"
            : "sticky top-0 h-svh min-h-[36rem] overflow-hidden"
        }
      >
        {/* Стена, на которой фабрика снимает свои модели. */}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-ak-wall via-[#e2dcd8] to-ak-wall-2" />

        {/* Тёплый свет из-за двери ложится на пол перед проёмом. */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: glow }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(ellipse_at_68%_100%,rgb(255_226_170/0.55),transparent_60%)] max-lg:bg-[radial-gradient(ellipse_at_50%_100%,rgb(255_226_170/0.55),transparent_62%)]"
        />

        {/* Комната — во весь экран, но видна только в проёме. */}
        {live && (
          <motion.div aria-hidden="true" style={{ clipPath: clip }} className="absolute inset-0 bg-ak-walnut">
            <motion.div style={{ scale: roomScale }} className="absolute inset-0">
              <Image src="/akbar/hero/room.webp" alt="" fill priority sizes="100vw" className="object-cover" />
            </motion.div>
            <motion.div
              style={{ opacity: captionOpacity }}
              className="absolute inset-0 bg-gradient-to-t from-ak-ink/75 via-ak-ink/15 to-transparent"
            />
          </motion.div>
        )}

        {/* Дверь: место в покое и сама сборка, которая растёт от центра проёма. */}
        <div className="absolute inset-x-0 bottom-[12svh] top-[38svh] flex items-end justify-center lg:inset-y-0 lg:left-auto lg:right-[3vw] lg:top-20 lg:w-[52vw] lg:items-center">
          <div ref={slot} className="relative aspect-[1300/1584] h-full max-h-[34rem] lg:h-[min(80svh,54rem)] lg:max-h-none">
            <motion.div
              style={live ? { x, y, scale, originX: HOLE_CX, originY: HOLE_CY } : undefined}
              className="absolute inset-0 will-change-transform"
            >
              <div
                className={`absolute overflow-hidden ${live ? "" : "bg-ak-walnut"}`}
                style={{
                  left: `${HOLE.left * 100}%`,
                  top: `${HOLE.top * 100}%`,
                  width: `${HOLE.width * 100}%`,
                  height: `${HOLE.height * 100}%`,
                }}
              >
                {!live && (
                  <Image
                    src="/akbar/hero/room.webp"
                    alt=""
                    fill
                    sizes="30vw"
                    className="scale-[1.6] object-cover object-[40%_50%]"
                  />
                )}
                {/* Полотно на петлях справа уходит внутрь комнаты. */}
                <div className="absolute inset-0 [perspective:1600px]">
                  <motion.div
                    style={{ rotateY, originX: 1, originY: 0.5 }}
                    className="absolute inset-0 [transform-style:preserve-3d]"
                  >
                    <Image
                      src="/akbar/hero/leaf.webp"
                      alt=""
                      fill
                      priority
                      sizes="(min-width: 1024px) 22vw, 40vw"
                      className="object-fill"
                    />
                    <motion.div
                      style={{ opacity: leafShade }}
                      className="absolute inset-0 bg-gradient-to-r from-ak-ink to-ak-ink/30"
                    />
                  </motion.div>
                </div>
              </div>
              <Image
                src="/akbar/hero/frame.webp"
                alt="Межкомнатная дверь Akbar Rich, модель № 45 «Классика» в американском орехе"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="pointer-events-none select-none [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,#000_16%,#000_84%,transparent),linear-gradient(to_bottom,transparent,#000_3%,#000_93%,transparent)] [-webkit-mask-composite:source-in]"
              />
            </motion.div>

            <motion.div
              style={{ opacity: textOpacity }}
              className="ak-glass absolute -right-2 bottom-[16%] hidden w-48 rounded-2xl p-4 shadow-[0_24px_60px_-20px_rgb(22_18_14/0.4)] lg:block xl:-right-6"
            >
              <p className="ak-eyebrow text-[0.6rem] text-ak-gold-600">Популярная модель</p>
              <p className="mt-1.5 font-ak-display text-2xl font-semibold leading-tight">№ 45 Классика</p>
              <p className="mt-1 text-xs text-ak-muted">Американский орех · ещё 2 покрытия</p>
            </motion.div>
          </div>
        </div>

        {/* Заголовок и главное действие. */}
        <motion.div
          style={calm ? undefined : { opacity: textOpacity, y: textY }}
          className="absolute inset-x-4 top-24 sm:inset-x-8 lg:left-[6vw] lg:right-auto lg:top-1/2 lg:w-[min(40rem,44vw)] lg:-translate-y-[46%]"
        >
          <p className="ak-eyebrow text-ak-gold-600">Фабрика дверей · Ташкент · с {company.since}</p>
          <h1 className="mt-4 font-ak-display text-[2.9rem] font-medium leading-[0.95] tracking-[-0.01em] sm:text-6xl lg:mt-6 lg:text-[5.6rem]">
            Двери, которые <em className="font-normal text-ak-walnut-500">открывают</em> дом
          </h1>
          <p className="mt-6 hidden max-w-md text-base leading-relaxed text-ak-muted lg:block">
            {company.models} моделей из МДФ — в эмали, ясене и американском орехе, от классики до
            hi-tech. Любая высота до трёх метров. Собственный завод на {company.plant.replace(" га", " гектарах")}.
          </p>
          <div className="mt-8 hidden flex-wrap gap-3 lg:flex">
            <a href="#konstruktor" className="ak-btn ak-btn-gold">
              Собрать свою дверь
              <Arrow />
            </a>
            <Link href="/akbar/katalog" className="ak-btn ak-btn-line">
              Каталог
            </Link>
          </div>
        </motion.div>

        <motion.dl
          style={calm ? undefined : { opacity: textOpacity }}
          className="absolute bottom-10 left-[6vw] hidden grid-cols-4 gap-10 lg:grid"
        >
          {[
            [String(company.since), "год основания"],
            [company.plant, "собственный завод"],
            [company.dealers, "дилерских сетей"],
            [company.tallHeight, "высота двери"],
          ].map(([value, label]) => (
            <div key={label}>
              <dt className="sr-only">{label}</dt>
              <dd className="font-ak-display text-4xl font-medium leading-none">{value}</dd>
              <dd className="mt-2 text-xs text-ak-muted">{label}</dd>
            </div>
          ))}
        </motion.dl>

        {!calm && (
          <motion.div
            aria-hidden="true"
            style={{ opacity: textOpacity }}
            className="absolute bottom-10 right-[3vw] hidden items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-ak-muted lg:flex"
          >
            Прокрутите — дверь откроется
            <span className="relative block h-10 w-px overflow-hidden bg-ak-ink/15">
              <motion.span
                animate={{ y: ["-100%", "100%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-ak-gold-600"
              />
            </span>
          </motion.div>
        )}

        {/* На телефоне кнопки — под дверью, одной строкой. */}
        <motion.div
          style={calm ? undefined : { opacity: textOpacity }}
          className="absolute inset-x-4 bottom-[3svh] flex gap-2.5 sm:inset-x-8 lg:hidden"
        >
          <a href="#konstruktor" className="ak-btn ak-btn-gold min-h-13 flex-1 px-4">
            Собрать дверь
          </a>
          <Link href="/akbar/katalog" className="ak-btn ak-btn-line min-h-13 flex-1 bg-ak-wall/60 px-4">
            Каталог
          </Link>
        </motion.div>

        {/* Подпись в комнате — когда камера вошла. */}
        {live && (
          <motion.div
            style={{ opacity: captionOpacity, y: captionY }}
            className="absolute inset-x-4 bottom-[12svh] text-center text-ak-ivory sm:inset-x-8"
          >
            <p className="ak-eyebrow text-ak-gold-300">Добро пожаловать</p>
            <p className="mx-auto mt-4 max-w-3xl font-ak-display text-4xl font-medium leading-[1.05] sm:text-6xl">
              Дом, в котором каждая дверь сделана по его размеру
            </p>
          </motion.div>
        )}
      </div>

    </section>
  );
}

function Arrow() {
  return (
    <svg aria-hidden="true" width="18" height="10" viewBox="0 0 18 10" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M0 5h16M12 1l4 4-4 4" />
    </svg>
  );
}
