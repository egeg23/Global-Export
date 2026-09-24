"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";

import type { Item } from "@/lib/akbar/catalog";
import { useCalmMotion } from "@/lib/calm-motion";

const subscribe = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};
const readHash = () => window.location.hash;
const noHash = () => "";

const unique = <T,>(list: T[]) => list.filter((value, index) => list.indexOf(value) === index);

/**
 * Сетка моделей раздела и карточка модели.
 *
 * Карточка открывается по адресу `#m-<id>` — ссылку на конкретную модель
 * можно переслать, а кнопка «назад» закрывает её, как на обычном сайте.
 */
export function CatalogGrid({ items, sub }: { items: Item[]; sub: string }) {
  const hash = useSyncExternalStore(subscribe, readHash, noHash);
  const openId = hash.startsWith("#m-") ? hash.slice(3) : null;
  const current = items.find((item) => item.id === openId) ?? null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {items.map((item) => {
          const colors = unique(item.variants.map((variant) => variant.swatch));
          return (
            <li key={item.id}>
              <a href={`#m-${item.id}`} className="group block">
                <span className="relative block aspect-[420/512] overflow-hidden rounded-[1.25rem] bg-[#dcdcdc]">
                  <Image
                    src={item.variants[0].thumb}
                    alt={`${item.name}, ${item.variants[0].color.toLowerCase()}`}
                    fill
                    sizes="(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </span>
                <span className="mt-4 block font-ak-display text-2xl font-semibold leading-tight group-hover:text-ak-walnut-500">
                  {item.name}
                </span>
                <span className="mt-2 flex items-center gap-1.5">
                  {colors.slice(0, 6).map((swatch) => (
                    <span key={swatch} className="h-3.5 w-3.5 rounded-full border border-ak-ink/15" style={{ background: swatch }} />
                  ))}
                  <span className="ml-1 text-xs text-ak-muted">
                    {item.variants.length > 1 ? `${item.variants.length} вариантов` : item.variants[0].material}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <AnimatePresence>{current && <ModelSheet key={current.id} item={current} sub={sub} />}</AnimatePresence>
    </>
  );
}

function closeSheet() {
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

function ModelSheet({ item, sub }: { item: Item; sub: string }) {
  const calm = useCalmMotion();
  const [variantId, setVariantId] = useState(item.variants[0].id);
  const closeButton = useRef<HTMLButtonElement>(null);
  const variant = item.variants.find((entry) => entry.id === variantId) ?? item.variants[0];
  const materials = unique(item.variants.map((entry) => entry.material));

  useEffect(() => {
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSheet();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const glazing = variant.glazing === "glass" ? "со стеклом" : variant.glazing === "solid" ? "глухая" : "";
  const request = [item.name, variant.color, glazing].filter(Boolean).join(", ");

  return (
    <div className="fixed inset-0 z-50" data-ak-menu="open">
      <motion.button
        type="button"
        aria-label="Закрыть карточку"
        onClick={closeSheet}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-ak-ink/55 backdrop-blur-sm"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        initial={calm ? { opacity: 0 } : { x: "100%" }}
        animate={calm ? { opacity: 1 } : { x: 0 }}
        exit={calm ? { opacity: 0 } : { x: "100%" }}
        transition={{ duration: calm ? 0.2 : 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-y-0 right-0 flex w-full max-w-[56rem] flex-col overflow-y-auto bg-ak-ivory md:flex-row"
      >
        <div className="relative min-h-[60svh] bg-[#dcdcdc] md:min-h-0 md:w-1/2">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={variant.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image
                src={variant.image ?? variant.thumb}
                alt={`${item.name}, ${variant.color.toLowerCase()}`}
                fill
                sizes="(min-width: 768px) 28rem, 100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-9">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="ak-eyebrow text-ak-gold-600">{sub}</p>
              <h2 className="mt-3 font-ak-display text-5xl font-medium leading-none">{item.name}</h2>
            </div>
            <button
              ref={closeButton}
              type="button"
              onClick={closeSheet}
              aria-label="Закрыть"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ak-ink/25 hover:border-ak-ink"
            >
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M2 2l12 12M14 2L2 14" />
              </svg>
            </button>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-5 border-y border-ak-ink/10 py-6 text-sm">
            <div>
              <dt className="text-ak-muted">Покрытие</dt>
              <dd className="mt-1 font-semibold">{variant.material}</dd>
            </div>
            <div>
              <dt className="text-ak-muted">Цвет</dt>
              <dd className="mt-1 font-semibold">{variant.color}</dd>
            </div>
            {glazing && (
              <div>
                <dt className="text-ak-muted">Полотно</dt>
                <dd className="mt-1 font-semibold first-letter:uppercase">{glazing}</dd>
              </div>
            )}
            <div>
              <dt className="text-ak-muted">Стоимость</dt>
              <dd className="mt-1 font-semibold">Рассчитает менеджер</dd>
            </div>
          </dl>

          {item.variants.length > 1 && (
            <div className="mt-6 grid gap-5">
              {materials.map((material) => (
                <fieldset key={material} className="min-w-0">
                  <legend className="ak-eyebrow text-ak-muted">{material}</legend>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {item.variants
                      .filter((entry) => entry.material === material)
                      .map((entry) => (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() => setVariantId(entry.id)}
                          aria-pressed={entry.id === variant.id}
                          title={`${entry.color}${entry.glazing === "glass" ? ", со стеклом" : ""}`}
                          className={`relative h-12 w-12 rounded-full border-2 border-ak-ivory transition-shadow ${
                            entry.id === variant.id ? "shadow-[0_0_0_2px_var(--color-ak-gold-600)]" : "shadow-[0_0_0_1px_rgb(22_18_14/0.2)]"
                          }`}
                          style={{ background: entry.swatch }}
                        >
                          <span className="sr-only">
                            {entry.color}
                            {entry.glazing === "glass" ? ", со стеклом" : ""}
                          </span>
                          {entry.glazing === "glass" && (
                            <span aria-hidden="true" className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-ak-ink text-[0.55rem] font-semibold text-ak-ivory">
                              С
                            </span>
                          )}
                        </button>
                      ))}
                  </div>
                </fieldset>
              ))}
            </div>
          )}

          <div className="mt-auto grid gap-3 pt-10 sm:flex">
            <Link href={`/akbar?model=${encodeURIComponent(request)}#zayavka`} className="ak-btn ak-btn-ink">
              Получить расчёт
            </Link>
            <Link href="/akbar#konstruktor" className="ak-btn ak-btn-line">
              Конструктор
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
