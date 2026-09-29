"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { Addon, useAddon } from "@/components/configurator/context";
import { In } from "@/components/cf/motion";
import { useSite, useT } from "@/components/cf/state";
import { categories, productById, products, sum, type ComfortCategory, type ComfortProduct } from "@/content/comfort/products";
import { cn } from "@/lib/cn";

/** Срок по умолчанию для строки «в месяц» в карточке. */
export const DEFAULT_MONTHS = 12;

/**
 * Цена в месяц: цена каталога, делённая поровну, с округлением вверх до
 * тысячи. Comfort пишет о рассрочке «без переплат» — так и считаем; точные
 * сроки и условия показывает банк при оформлении.
 */
export function perMonth(price: number, months: number): number {
  return Math.ceil(price / months / 1000) * 1000;
}

const maxPrice = Math.max(...products.map((product) => product.price));
const maxWidth = Math.max(...products.map((product) => product.width ?? 0));

/**
 * Каталог. Базовый — категории и карточки с их ценами. Допник «Каталог:
 * фильтры, избранное, сравнение» меняет этот же блок, а не добавляет
 * соседний, поэтому он `flag`: карточки на месте, появляются инструменты.
 */
export function Catalog() {
  return (
    <section id="catalog" aria-labelledby="catalog-title" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Addon id="catalog" flag>
          <CatalogBody />
        </Addon>
      </div>
    </section>
  );
}

function CatalogBody() {
  const t = useT();
  const pro = useAddon("catalog");
  const installment = useAddon("installment");
  const { favorites, toggleFavorite, compare, toggleCompare, clearCompare } = useSite();
  const [category, setCategory] = useState<ComfortCategory>("sofa");
  const [priceCap, setPriceCap] = useState(maxPrice);
  const [widthCap, setWidthCap] = useState(maxWidth);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const list = useMemo(
    () =>
      products.filter((product) => {
        if (product.category !== category) return false;
        if (!pro) return true;
        if (product.price > priceCap) return false;
        if (widthCap < maxWidth && (product.width ?? Infinity) > widthCap) return false;
        if (onlyFavorites && !favorites.has(product.id)) return false;
        return true;
      }),
    [category, pro, priceCap, widthCap, onlyFavorites, favorites],
  );

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="cf-eyebrow text-cf-accent">{products.length} моделей из 300 в их магазине</p>
          <h2 id="catalog-title" className="cf-display mt-4 text-[clamp(2rem,5vw,3.6rem)]">
            {t("catalogTitle")}
          </h2>
        </div>
        <p className="max-w-sm text-sm text-cf-muted">
          Цены и размеры — как в карточках comfort-mebel.uz. В панели их правит магазин, и сайт обновляется сам.
        </p>
      </div>

      <div role="group" aria-label="Категория" className="-mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {categories.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={category === item.id}
            onClick={() => setCategory(item.id)}
            className="cf-chip shrink-0"
          >
            {item.label}
          </button>
        ))}
      </div>

      {pro ? (
        <div className="cf-pop mt-6 grid grid-cols-1 gap-5 rounded-[1.5rem] bg-cf-ink-3 p-5 sm:grid-cols-3 sm:p-6">
          <label className="block text-sm">
            <span className="flex justify-between text-cf-muted">
              Цена до <b className="font-semibold text-cf-paper tabular-nums">{sum(priceCap)}</b>
            </span>
            <input
              type="range"
              className="cf-range mt-3"
              min={1_000_000}
              max={maxPrice}
              step={100_000}
              value={priceCap}
              onChange={(event) => setPriceCap(Number(event.target.value))}
            />
          </label>
          <label className="block text-sm">
            <span className="flex justify-between text-cf-muted">
              Ширина до{" "}
              <b className="font-semibold text-cf-paper tabular-nums">{widthCap >= maxWidth ? "любая" : `${widthCap} см`}</b>
            </span>
            <input
              type="range"
              className="cf-range mt-3"
              min={60}
              max={maxWidth}
              step={10}
              value={widthCap}
              onChange={(event) => setWidthCap(Number(event.target.value))}
            />
          </label>
          <div className="flex items-end">
            <button type="button" aria-pressed={onlyFavorites} onClick={() => setOnlyFavorites((value) => !value)} className="cf-chip w-full justify-center">
              ♥ Только избранное · {favorites.size}
            </button>
          </div>
        </div>
      ) : null}

      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((product, index) => (
          <In key={`${category}-${product.id}`} as="li" variant="rise" index={index % 3}>
            <Card
              product={product}
              installment={installment}
              pro={pro}
              favorite={favorites.has(product.id)}
              compared={compare.includes(product.id)}
              onFavorite={() => toggleFavorite(product.id)}
              onCompare={() => toggleCompare(product.id)}
            />
          </In>
        ))}
      </ul>
      {list.length === 0 ? <p className="mt-8 text-cf-muted">Под эти условия моделей нет — сдвиньте фильтр.</p> : null}

      {pro && compare.length > 0 ? <Compare ids={compare} onClear={clearCompare} /> : null}
    </>
  );
}

function Card({
  product,
  installment,
  pro,
  favorite,
  compared,
  onFavorite,
  onCompare,
}: {
  product: ComfortProduct;
  installment: boolean;
  pro: boolean;
  favorite: boolean;
  compared: boolean;
  onFavorite: () => void;
  onCompare: () => void;
}) {
  const t = useT();
  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] bg-cf-ink-3">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          className="object-cover transition-transform duration-[900ms] ease-[var(--ease-cf)] group-hover:scale-[1.06]"
        />
        {pro ? (
          <div className="absolute right-3 top-3 flex gap-2">
            <button
              type="button"
              onClick={onFavorite}
              aria-pressed={favorite}
              aria-label={favorite ? `Убрать из избранного: ${product.name}` : `В избранное: ${product.name}`}
              className={cn("cf-glass flex h-11 w-11 items-center justify-center rounded-full text-lg", favorite && "text-cf-accent")}
            >
              {favorite ? "♥" : "♡"}
            </button>
            <button
              type="button"
              onClick={onCompare}
              aria-pressed={compared}
              className={cn("cf-glass h-11 rounded-full px-4 text-xs font-semibold", compared && "text-cf-accent")}
            >
              {compared ? "✓ сравнение" : "+ сравнить"}
            </button>
          </div>
        ) : null}
        <div className="cf-glass absolute inset-x-3 bottom-3 rounded-2xl p-4">
          <p className="text-[0.95rem] font-semibold leading-snug">{product.name}</p>
          <p className="mt-1 text-xs text-cf-muted">{product.size}</p>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="text-base font-semibold tabular-nums text-cf-accent">{sum(product.price)}</p>
            {installment ? (
              <p className="text-xs tabular-nums text-cf-muted">
                от {sum(perMonth(product.price, DEFAULT_MONTHS))} {t("perMonth")}
              </p>
            ) : null}
          </div>
        </div>
      </div>
      <p className="px-4 py-3 text-xs text-cf-muted">{product.facts.join(" · ")}</p>
    </article>
  );
}

function Compare({ ids, onClear }: { ids: string[]; onClear: () => void }) {
  const items = ids.map(productById);
  const rows: [string, (product: ComfortProduct) => string][] = [
    ["Цена", (product) => sum(product.price)],
    ["Размер", (product) => product.size],
    ["Ширина", (product) => (product.width ? `${product.width} см` : "—")],
    ["Особенности", (product) => product.facts.join(", ")],
  ];
  return (
    <div className="cf-pop mt-10 overflow-hidden rounded-[1.75rem] bg-cf-ink-3">
      <div className="flex items-center justify-between gap-4 border-b border-cf-line px-5 py-4">
        <p className="font-semibold">Сравнение · {items.length} из 3</p>
        <button type="button" onClick={onClear} className="text-sm text-cf-muted hover:text-cf-paper">
          Очистить
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] text-sm">
          <thead>
            <tr>
              <th className="w-32 px-5 py-3 text-left font-normal text-cf-muted" scope="col">
                Модель
              </th>
              {items.map((product) => (
                <th key={product.id} scope="col" className="px-5 py-3 text-left font-semibold">
                  {product.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label} className="border-t border-cf-line">
                <th scope="row" className="px-5 py-3 text-left font-normal text-cf-muted">
                  {label}
                </th>
                {items.map((product) => (
                  <td key={product.id} className="px-5 py-3 tabular-nums">
                    {value(product)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
