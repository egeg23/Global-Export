"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { contentsOf } from "@/lib/adar/catalog";
import { formatPrice, formatWeight } from "@/lib/adar/format";
import { cn } from "@/lib/cn";
import type { GiftSet } from "@/lib/adar/types";

/** Событие «хочу этот набор» — его слушает форма заявки. */
export const ORDER_EVENT = "adar:order";

/**
 * Карточка набора поверх страницы.
 *
 * Собрана на теге `<dialog>`, а не на своём оверлее: браузер сам запирает
 * фокус внутри, закрывает по Esc и возвращает фокус туда, откуда открыли.
 * Своя реализация всего этого — полсотни строк, которые нечем оправдать.
 *
 * Внутри — полный состав набора. Это единственное место, где видно, за что
 * платят: на нынешнем сайте состав спрятан в таблицу под описанием, и до неё
 * никто не долистывает.
 */
export function SetDialog({ set, onClose }: { set: GiftSet | null; onClose: () => void }) {
  const node = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = node.current;
    if (!dialog) return;

    if (set && !dialog.open) dialog.showModal();
    if (!set && dialog.open) dialog.close();
  }, [set]);

  const contents = set ? contentsOf(set) : [];

  return (
    <dialog
      ref={node}
      onClose={onClose}
      // Клик мимо карточки закрывает. Цель события — сам <dialog> только
      // тогда, когда попали в подложку: содержимое лежит во вложенном узле.
      onClick={(event) => {
        if (event.target === node.current) onClose();
      }}
      className={cn(
        "m-auto w-[min(56rem,calc(100vw-2rem))] rounded-adar-lg bg-adar-cream-50 p-0",
        "backdrop:bg-adar-green-950/70 backdrop:backdrop-blur-sm",
      )}
    >
      {set ? (
        <article className="grid max-h-[85vh] gap-0 overflow-hidden sm:grid-cols-2">
          <div className="relative bg-adar-cream-100 p-6">
            <Image
              src={set.image}
              alt={set.name}
              width={720}
              height={720}
              className="mx-auto h-full max-h-[26rem] w-auto object-contain"
            />
          </div>

          <div className="flex min-h-0 flex-col p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <span className="rounded-full bg-adar-green-900/8 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-adar-green-700">
                {set.lineLabel}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="-mr-1 -mt-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-adar-ink-subtle transition-colors hover:bg-adar-cream-100 hover:text-adar-ink"
              >
                <span className="sr-only">Закрыть</span>
                <span aria-hidden="true" className="text-lg leading-none">
                  ×
                </span>
              </button>
            </div>

            <h2 className="mt-4 font-adar-display text-3xl leading-tight text-adar-green-950">
              {set.name}
            </h2>

            <p className="mt-3 text-2xl font-medium tabular-nums text-adar-green-800">
              {formatPrice(set.price)}
            </p>

            <dl className="mt-5 grid grid-cols-3 gap-3 border-y border-adar-green-900/10 py-4 text-sm">
              <div>
                <dt className="text-xs text-adar-ink-subtle">Вес</dt>
                <dd className="mt-1 tabular-nums text-adar-ink">{formatWeight(set.weight)}</dd>
              </div>
              <div>
                <dt className="text-xs text-adar-ink-subtle">Состав</dt>
                <dd className="mt-1 tabular-nums text-adar-ink">{set.count}</dd>
              </div>
              <div>
                <dt className="text-xs text-adar-ink-subtle">Упаковка</dt>
                <dd className="mt-1 text-adar-ink">
                  {set.pack === "bag" ? "мешок" : "коробка"}
                </dd>
              </div>
            </dl>

            <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-adar-ink-subtle">
              Что внутри
            </p>

            <ul className="mt-3 min-h-0 flex-1 overflow-y-auto pr-2 text-sm">
              {contents.map((item, index) => (
                <li
                  key={`${item.name}-${index}`}
                  className="flex items-baseline justify-between gap-4 border-b border-adar-green-900/6 py-2 last:border-b-0"
                >
                  <span className="text-adar-ink">
                    {item.name}
                    {item.qty > 1 ? (
                      <span className="ml-1.5 text-adar-ink-subtle">× {item.qty}</span>
                    ) : null}
                  </span>
                  <span className="shrink-0 tabular-nums text-adar-ink-subtle">
                    {item.grams} г
                  </span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent(ORDER_EVENT, { detail: set.name }));
                onClose();
              }}
              className="mt-6 cursor-pointer rounded-full bg-adar-green-900 px-7 py-3.5 text-sm font-medium text-adar-cream-50 transition-colors duration-300 hover:bg-adar-green-800"
            >
              Заказать этот набор
            </button>
          </div>
        </article>
      ) : null}
    </dialog>
  );
}

/**
 * Состояние карточки и сама карточка одним вызовом — чтобы каталог и лента
 * не заводили по три строки состояния каждый.
 */
export function useSetDialog() {
  const [set, setSet] = useState<GiftSet | null>(null);
  return {
    open: setSet,
    dialog: <SetDialog set={set} onClose={() => setSet(null)} />,
  };
}
