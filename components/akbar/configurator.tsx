"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import type { ConfiguratorModel, Variant } from "@/lib/akbar/catalog";
import { useCalmMotion } from "@/lib/calm-motion";

const MATERIALS = ["Эмаль", "Ясень", "Американский орех"] as const;
const HEIGHTS = [
  { id: "2", label: "2 м", m: 2 },
  { id: "2.4", label: "2,4 м", m: 2.4 },
  { id: "2.7", label: "2,7 м", m: 2.7 },
  { id: "3", label: "3 м", m: 3 },
];
const KIT = ["Коробка", "Наличники", "Фурнитура"] as const;

export const PICK_EVENT = "akbar:pick";

type Kit = Record<(typeof KIT)[number], boolean>;

const unique = <T,>(list: T[]) => list.filter((value, index) => list.indexOf(value) === index);

/**
 * Конструктор двери.
 *
 * Модели, покрытия и цвета — из их каталога: у каждой модели ровно те
 * сочетания, что фабрика реально делает, и картинка — их же рендер. Высота
 * и комплект — параметры заявки: цену по ним считает менеджер, сайт её не
 * выдумывает. «Получить расчёт» переносит собранное в форму заявки.
 */
export function Configurator({ models }: { models: ConfiguratorModel[] }) {
  const calm = useCalmMotion();
  const [modelId, setModelId] = useState(models[0].id);
  const [material, setMaterial] = useState<string>(models[0].variants[0].material);
  const [color, setColor] = useState<string>(models[0].variants[0].color);
  const [glass, setGlass] = useState(false);
  const [height, setHeight] = useState(HEIGHTS[0].id);
  const [kit, setKit] = useState<Kit>({ Коробка: true, Наличники: true, Фурнитура: false });

  const model = models.find((entry) => entry.id === modelId) ?? models[0];

  const view = useMemo(() => {
    const materials = unique(model.variants.map((variant) => variant.material));
    const activeMaterial = materials.includes(material) ? material : materials[0];
    const inMaterial = model.variants.filter((variant) => variant.material === activeMaterial);
    const colors = unique(inMaterial.map((variant) => variant.color));
    const activeColor = colors.includes(color) ? color : colors[0];
    const inColor = inMaterial.filter((variant) => variant.color === activeColor);
    const glazing = unique(inColor.map((variant) => variant.glazing));
    const canGlass = glazing.includes("glass") && glazing.some((value) => value !== "glass");
    const onlyGlass = glazing.length === 1 && glazing[0] === "glass";
    const variant: Variant & { image: string } =
      (canGlass ? inColor.find((entry) => (entry.glazing === "glass") === glass) : undefined) ?? inColor[0];
    return { materials, activeMaterial, inMaterial, activeColor, canGlass, onlyGlass, variant };
  }, [model, material, color, glass]);

  const heightInfo = HEIGHTS.find((entry) => entry.id === height) ?? HEIGHTS[0];
  const kitList = KIT.filter((part) => kit[part]);
  const glazingLabel = view.onlyGlass || (view.canGlass && glass) ? "со стеклом" : "глухая";

  const summary = [
    model.name,
    `${view.variant.color} (${view.variant.material.toLowerCase()})`,
    glazingLabel,
    `высота ${heightInfo.label}`,
    ["полотно", ...kitList.map((part) => part.toLowerCase())].join(" + "),
  ].join(" · ");

  const request = () => {
    window.dispatchEvent(new CustomEvent(PICK_EVENT, { detail: summary }));
    document.getElementById("zayavka")?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
  };

  return (
    <section id="konstruktor" className="scroll-mt-16 bg-ak-ivory px-4 py-20 sm:px-8 lg:px-[4vw] lg:py-28">
      <div className="mx-auto max-w-[100rem]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="ak-eyebrow text-ak-gold-600">Конструктор</p>
            <h2 className="mt-4 max-w-3xl font-ak-display text-5xl font-medium leading-[0.98] sm:text-6xl">
              Соберите свою дверь за минуту
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-ak-muted">
            Модель, покрытие, цвет и высота — ровно те сочетания, что делает фабрика. Цену по вашему
            набору рассчитает менеджер.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          {/* Сцена: рендер модели на стене и сравнение высоты с человеком. */}
          <div className="relative overflow-hidden rounded-[2rem] bg-[#dcdcdc] lg:sticky lg:top-24 lg:h-[min(80svh,50rem)]">
            <div className="relative aspect-[900/1000] w-full lg:absolute lg:inset-0 lg:aspect-auto">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={view.variant.id}
                  initial={calm ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: calm ? 0.2 : 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={view.variant.image}
                    alt={`${model.name}, ${view.variant.color.toLowerCase()}`}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover object-[50%_40%]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="ak-glass absolute left-4 top-4 rounded-2xl px-4 py-3 sm:left-6 sm:top-6">
              <p className="ak-eyebrow text-[0.6rem] text-ak-gold-600">{view.variant.material}</p>
              <p className="mt-1 font-ak-display text-2xl font-semibold leading-tight">{model.name}</p>
              <p className="text-xs text-ak-muted">{view.variant.color}</p>
            </div>

            <HeightGauge meters={heightInfo.m} label={heightInfo.label} calm={calm} />
          </div>

          {/* Параметры. */}
          <div className="grid content-start gap-9">
            <Step n={1} title="Модель">
              <ul className="ak-rail -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
                {models.map((entry) => {
                  const selected = entry.id === model.id;
                  return (
                    <li key={entry.id} className="w-24 shrink-0 lg:w-auto">
                      <button
                        type="button"
                        onClick={() => setModelId(entry.id)}
                        aria-pressed={selected}
                        className="group w-full text-left"
                      >
                        <span
                          className={`relative block aspect-[420/512] overflow-hidden rounded-xl bg-[#dcdcdc] ring-2 ring-offset-2 ring-offset-ak-ivory transition ${
                            selected ? "ring-ak-gold" : "ring-transparent group-hover:ring-ak-ink/20"
                          }`}
                        >
                          <Image src={entry.variants[0].thumb} alt="" fill sizes="120px" className="object-cover" />
                        </span>
                        <span className={`mt-2 block text-xs leading-snug ${selected ? "font-semibold" : "text-ak-muted"}`}>
                          {entry.name}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Step>

            <Step n={2} title="Покрытие">
              <div className="flex flex-wrap gap-2.5">
                {MATERIALS.map((name) => {
                  const available = view.materials.includes(name);
                  const selected = view.activeMaterial === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      disabled={!available}
                      aria-pressed={selected}
                      onClick={() => setMaterial(name)}
                      className={`min-h-12 rounded-full border px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
                        selected
                          ? "border-ak-ink bg-ak-ink text-ak-ivory"
                          : "border-ak-ink/25 hover:border-ak-ink"
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </Step>

            <Step n={3} title="Цвет" aside={view.activeColor}>
              <div className="flex flex-wrap gap-3.5">
                {unique(view.inMaterial.map((variant) => variant.color)).map((name) => {
                  const swatch = view.inMaterial.find((variant) => variant.color === name)?.swatch ?? "#ccc";
                  const selected = view.activeColor === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setColor(name)}
                      aria-pressed={selected}
                      aria-label={name}
                      title={name}
                      className={`h-12 w-12 rounded-full border-2 border-ak-ivory transition-shadow ${
                        selected ? "shadow-[0_0_0_2px_var(--color-ak-gold-600)]" : "shadow-[0_0_0_1px_rgb(22_18_14/0.18)] hover:shadow-[0_0_0_2px_rgb(22_18_14/0.35)]"
                      }`}
                      style={{ background: swatch }}
                    />
                  );
                })}
              </div>
            </Step>

            {view.canGlass && (
              <Step n={4} title="Остекление">
                <div className="flex gap-2.5">
                  {[
                    { value: false, label: "Глухая" },
                    { value: true, label: "Со стеклом" },
                  ].map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      aria-pressed={glass === option.value}
                      onClick={() => setGlass(option.value)}
                      className={`min-h-12 rounded-full border px-5 text-sm font-semibold transition-colors ${
                        glass === option.value ? "border-ak-ink bg-ak-ink text-ak-ivory" : "border-ak-ink/25 hover:border-ak-ink"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </Step>
            )}

            <Step n={view.canGlass ? 5 : 4} title="Высота полотна" aside="Любая модель — до 3 м">
              <div className="flex flex-wrap gap-2.5">
                {HEIGHTS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={height === option.id}
                    onClick={() => setHeight(option.id)}
                    className={`min-h-12 min-w-20 rounded-full border px-5 text-sm font-semibold transition-colors ${
                      height === option.id ? "border-ak-ink bg-ak-ink text-ak-ivory" : "border-ak-ink/25 hover:border-ak-ink"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </Step>

            <Step n={view.canGlass ? 6 : 5} title="Комплект" aside="Полотно — всегда">
              <div className="grid grid-cols-3 gap-2.5">
                {KIT.map((part) => (
                  <button
                    key={part}
                    type="button"
                    aria-pressed={kit[part]}
                    onClick={() => setKit((value) => ({ ...value, [part]: !value[part] }))}
                    className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-medium transition-colors ${
                      kit[part] ? "border-ak-gold bg-ak-cream" : "border-ak-ink/20 hover:border-ak-ink/50"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`grid h-4 w-4 place-items-center rounded-full border ${kit[part] ? "border-ak-gold-600 bg-ak-gold-600 text-ak-ivory" : "border-ak-ink/30"}`}
                    >
                      {kit[part] && (
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M2 5.2l2 2L8 3" />
                        </svg>
                      )}
                    </span>
                    {part}
                  </button>
                ))}
              </div>
            </Step>

            <div className="rounded-[1.75rem] bg-ak-ink p-6 text-ak-ivory sm:p-7">
              <p className="ak-eyebrow text-ak-gold-300">Ваш набор</p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ak-ivory/85">{summary}</p>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-ak-ivory/70">Цену по этому набору назовёт менеджер</p>
                <button type="button" onClick={request} className="ak-btn ak-btn-gold">
                  Получить расчёт
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({
  n,
  title,
  aside,
  children,
}: {
  n: number;
  title: string;
  aside?: string;
  children: React.ReactNode;
}) {
  return (
    // min-w-0: у fieldset минимальная ширина — по содержимому, и лента
    // моделей растянула бы страницу вширь на телефоне.
    <fieldset className="min-w-0">
      <legend className="flex w-full items-baseline justify-between gap-4">
        <span className="ak-eyebrow text-ak-muted">
          {n} · {title}
        </span>
        {aside && <span className="text-xs text-ak-muted">{aside}</span>}
      </legend>
      <div className="mt-4">{children}</div>
    </fieldset>
  );
}

/** Высота полотна рядом с человеком ростом 1,75 м — чтобы три метра было видно. */
function HeightGauge({ meters, label, calm }: { meters: number; label: string; calm: boolean }) {
  const unit = 42;
  const floor = 150;
  const door = meters * unit;
  return (
    <div className="ak-glass absolute bottom-4 right-4 w-32 rounded-2xl p-2.5 sm:bottom-6 sm:right-6 sm:w-44 sm:p-3">
      <svg viewBox="0 0 150 160" className="w-full" role="img" aria-label={`Высота полотна ${label} рядом с человеком ростом 1,75 м`}>
        {[1, 2, 3].map((m) => (
          <g key={m}>
            <line x1="14" x2="140" y1={floor - m * unit} y2={floor - m * unit} stroke="#16120e" strokeOpacity="0.1" strokeDasharray="2 3" />
            <text x="2" y={floor - m * unit + 3} fontSize="8" fill="#5d544b">
              {m} м
            </text>
          </g>
        ))}
        <line x1="14" x2="140" y1={floor} y2={floor} stroke="#16120e" strokeOpacity="0.4" />
        <motion.rect
          x="34"
          width={0.9 * unit}
          fill="#7a4a2a"
          fillOpacity="0.85"
          stroke="#8a6a33"
          initial={false}
          animate={{ y: floor - door, height: door }}
          transition={{ duration: calm ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Человек 1,75 м. */}
        <g fill="#16120e" fillOpacity="0.55" transform={`translate(100 ${floor - 1.75 * unit})`}>
          <circle cx="9" cy="6" r="6" />
          <path d="M2 16c0-3 3-4 7-4s7 1 7 4v25h-3v32H9.8V47H8.2v26H5V41H2z" />
        </g>
      </svg>
      <p className="mt-1 text-center text-xs font-semibold">
        Полотно {label} · человек 1,75 м
      </p>
    </div>
  );
}
