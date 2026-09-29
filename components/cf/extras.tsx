"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

import { Addon } from "@/components/configurator/context";
import { DEFAULT_MONTHS, perMonth } from "@/components/cf/catalog";
import { In } from "@/components/cf/motion";
import { branches, productById, products, sum } from "@/content/comfort/products";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/* Цвет и ткань                                                         */
/* ------------------------------------------------------------------ */

/**
 * Цвета — только настоящие. Диван LOUNGE у Comfort есть в двух обивках, и
 * обе сняты: переключатель меняет фотографию, а не перекрашивает её
 * фильтром. Выдуманный оттенок на фото — это обещание, которого магазин
 * не давал. Новые цвета добавляются в панели вместе с их снимками.
 */
/** Товар 28099 в их магазине. */
const LOUNGE_PRICE = 2_200_000;

const lounge = [
  { id: "bordo", label: "Глубокий бордовый", swatch: "#6d1f2c", image: "/images/comfort/lounge-bordo.jpg" },
  { id: "yellow", label: "Жёлтый", swatch: "#c9a227", image: "/images/comfort/lounge-yellow.jpg" },
];

export function Colors() {
  const [active, setActive] = useState(lounge[0].id);
  return (
    <Addon id="colors" as="section" className="py-20 sm:py-28">
      <div className="mx-auto grid grid-cols-1 max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <In variant="slide">
          <p className="cf-eyebrow text-cf-accent">Цвет и ткань</p>
          <h2 className="cf-display mt-4 text-[clamp(2rem,5vw,3.4rem)]">Диван LOUNGE — в какой обивке?</h2>
          <p className="mt-5 max-w-md text-cf-muted">
            Турецкая премиум-обивка, форма без подлокотников, фанерная спинка. Цвет переключается на настоящих
            фотографиях модели — такой она и приедет.
          </p>
          <div role="radiogroup" aria-label="Цвет обивки" className="mt-8 flex flex-wrap gap-3">
            {lounge.map((option) => (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={active === option.id}
                onClick={() => setActive(option.id)}
                className={cn(
                  "flex min-h-12 items-center gap-3 rounded-full py-1.5 pl-1.5 pr-5 text-sm ring-1 transition-colors",
                  active === option.id ? "bg-cf-accent font-semibold text-cf-accent-ink ring-cf-accent" : "ring-cf-line hover:bg-cf-ink-3",
                )}
              >
                <span aria-hidden="true" className="h-9 w-9 rounded-full ring-2 ring-white/20" style={{ background: option.swatch }} />
                {option.label}
              </button>
            ))}
          </div>
          <dl className="cf-spec mt-8 max-w-sm">
            <dt>Цена в каталоге</dt>
            <dd className="font-semibold text-cf-accent">{sum(LOUNGE_PRICE)}</dd>
          </dl>
        </In>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] bg-white">
          {lounge.map((option) => (
            <Image
              key={option.id}
              src={option.image}
              alt={`Диван LOUNGE, ${option.label.toLowerCase()}`}
              fill
              sizes="(min-width: 1024px) 28rem, 92vw"
              className={cn(
                "object-contain transition-[opacity,transform] duration-700 ease-[var(--ease-cf)]",
                active === option.id ? "scale-[1.3] opacity-100" : "scale-[1.2] opacity-0",
              )}
            />
          ))}
        </div>
      </div>
    </Addon>
  );
}

/* ------------------------------------------------------------------ */
/* 3D / AR — пока по кадрам                                             */
/* ------------------------------------------------------------------ */

const frameSets = [
  { id: "prestige", frames: ["/images/comfort/prestige.jpg", "/images/comfort/prestige-2.jpg", "/images/comfort/prestige-3.jpg"] },
  { id: "transformer", frames: ["/images/comfort/transformer.jpg", "/images/comfort/transformer-2.jpg", "/images/comfort/transformer-3.jpg"] },
];

/**
 * Место под 3D и AR. Трёхмерных моделей мебели Comfort у нас нет, и
 * рисовать их «на глаз» мы не стали: здесь модель вращают по настоящим
 * кадрам из карточки — тянут пальцем или мышью. 3D-модели для одной–трёх
 * моделей делаются по фото и размерам фабрики, когда допник заказан.
 */
export function View3d() {
  const [set, setSet] = useState(frameSets[0].id);
  const [frame, setFrame] = useState(0);
  const start = useRef<{ x: number; frame: number } | null>(null);
  const current = frameSets.find((item) => item.id === set) ?? frameSets[0];
  const product = productById(current.id);
  const count = current.frames.length;

  return (
    <Addon id="view3d" as="section" className="bg-cf-ink-2 py-20 sm:py-28">
      <div className="mx-auto grid grid-cols-1 max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div
          className="relative aspect-[4/5] w-full touch-pan-y select-none overflow-hidden rounded-[2rem] bg-cf-ink-3 active:cursor-grabbing sm:cursor-grab"
          onPointerDown={(event) => {
            start.current = { x: event.clientX, frame };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!start.current) return;
            const shift = Math.round((event.clientX - start.current.x) / 70);
            setFrame((((start.current.frame - shift) % count) + count) % count);
          }}
          onPointerUp={() => {
            start.current = null;
          }}
          onPointerCancel={() => {
            start.current = null;
          }}
        >
          {current.frames.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt={index === frame ? `${product.name}, ракурс ${index + 1} из ${count}` : ""}
              fill
              draggable={false}
              sizes="(min-width: 1024px) 40vw, 92vw"
              className={cn("pointer-events-none object-cover transition-opacity duration-300", index === frame ? "opacity-100" : "opacity-0")}
            />
          ))}
          <div className="cf-glass absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl px-4 py-3 text-sm">
            <span>⟵ тяните ⟶</span>
            <span className="tabular-nums text-cf-muted">
              {frame + 1} / {count}
            </span>
          </div>
        </div>
        <In variant="zoom">
          <p className="cf-eyebrow text-cf-accent">3D и AR</p>
          <h2 className="cf-display mt-4 text-[clamp(2rem,5vw,3.4rem)]">Модель со всех сторон</h2>
          <p className="mt-5 max-w-md text-cf-muted">
            Здесь — вращение по кадрам из карточки. В работе на месте кадров встаёт 3D-модель, а на телефоне — кнопка
            «Поставить у себя в комнате» (AR). Делаем для одной–трёх моделей по фото и размерам фабрики.
          </p>
          <div role="group" aria-label="Модель" className="mt-8 flex flex-wrap gap-2">
            {frameSets.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={set === item.id}
                onClick={() => {
                  setSet(item.id);
                  setFrame(0);
                }}
                className="cf-chip"
              >
                {productById(item.id).name}
              </button>
            ))}
          </div>
          <dl className="cf-spec mt-8 max-w-sm">
            <dt>Размер</dt>
            <dd>{product.size}</dd>
            <dt>Цена в каталоге</dt>
            <dd className="font-semibold text-cf-accent">{sum(product.price)}</dd>
          </dl>
        </In>
      </div>
    </Addon>
  );
}

/* ------------------------------------------------------------------ */
/* Рассрочка                                                            */
/* ------------------------------------------------------------------ */

const terms = [3, 6, 12];

/**
 * Калькулятор рассрочки по ценам их каталога. Comfort пишет: «платите
 * частями — без переплат», рассрочка через Uzum и Anor. Поэтому считаем
 * простым делением; доступные сроки и условия банк покажет при оформлении —
 * об этом подпись прямо под цифрой.
 */
export function Installment() {
  const [id, setId] = useState("monet");
  const [months, setMonths] = useState(DEFAULT_MONTHS);
  const [extra, setExtra] = useState<string[]>([]);
  const product = productById(id);
  const total = useMemo(() => product.price + extra.reduce((acc, item) => acc + productById(item).price, 0), [product, extra]);
  const companions = products.filter((item) => item.category !== product.category && item.price < 4_000_000).slice(0, 4);

  return (
    <Addon id="installment" as="section" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <In variant="rise">
          <p className="cf-eyebrow text-cf-accent">Рассрочка Uzum · Anor</p>
          <h2 className="cf-display mt-4 max-w-3xl text-[clamp(2rem,5vw,3.4rem)]">Сколько это в месяц?</h2>
        </In>
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-6 rounded-[1.75rem] bg-cf-ink-3 p-5 sm:p-7 lg:col-span-7">
            <label className="block text-sm">
              <span className="text-cf-muted">Модель</span>
              <select value={id} onChange={(event) => setId(event.target.value)} className="cf-field mt-2 appearance-none">
                {products.map((item) => (
                  <option key={item.id} value={item.id} className="bg-cf-ink text-cf-paper">
                    {item.name} — {sum(item.price)}
                  </option>
                ))}
              </select>
            </label>
            <div>
              <p className="text-sm text-cf-muted">Добавить к заказу</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {companions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={extra.includes(item.id)}
                    onClick={() => setExtra((list) => (list.includes(item.id) ? list.filter((value) => value !== item.id) : [...list, item.id]))}
                    className="cf-chip"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-cf-muted">Срок</p>
              <div role="group" aria-label="Срок рассрочки" className="mt-2 flex gap-2">
                {terms.map((term) => (
                  <button key={term} type="button" aria-pressed={months === term} onClick={() => setMonths(term)} className="cf-chip min-w-20 justify-center">
                    {term} мес
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="cf-glass flex flex-col justify-between rounded-[1.75rem] p-6 sm:p-8 lg:col-span-5">
            <div>
              <p className="text-sm text-cf-muted">Платёж в месяц</p>
              <p key={`${total}-${months}`} aria-live="polite" className="cf-pop cf-display mt-3 text-[clamp(2.4rem,6vw,3.6rem)] text-cf-accent tabular-nums">
                {sum(perMonth(total, months))}
              </p>
              <dl className="cf-spec mt-6">
                <dt>Сумма по каталогу</dt>
                <dd>{sum(total)}</dd>
                <dt>Срок</dt>
                <dd>{months} месяцев</dd>
              </dl>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-cf-muted">
              Делим цену каталога поровну — Comfort пишет «без переплат». Доступные сроки и условия покажут Uzum Nasiya и
              Anorbank при оформлении, это займёт около 5 минут.
            </p>
          </div>
        </div>
      </div>
    </Addon>
  );
}

/* ------------------------------------------------------------------ */
/* Запись в шоурум                                                      */
/* ------------------------------------------------------------------ */

const slots = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
const weekday = new Intl.DateTimeFormat("ru-RU", { weekday: "short" });
const dayMonth = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" });

/**
 * Запись на визит. В прототипе заявка никуда не уходит — так и написано
 * после отправки; в работе она падает менеджеру филиала в Telegram и в
 * панель.
 */
export function Booking() {
  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 10 }, (_, index) => {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index + 1);
      return { key: date.toISOString().slice(0, 10), top: weekday.format(date), bottom: dayMonth.format(date) };
    });
  }, []);
  const [branch, setBranch] = useState<string>(branches[0].id);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const chosen = branches.find((item) => item.id === branch) ?? branches[0];
  const chosenDay = days.find((item) => item.key === day);

  return (
    <Addon id="booking" as="div" className="mt-14">
      <div className="rounded-[1.75rem] bg-cf-ink-3 p-5 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="cf-eyebrow text-cf-accent">Запись в шоурум</p>
            <h3 className="cf-display mt-3 text-[clamp(1.6rem,3.6vw,2.4rem)]">Выберите день — подготовим модели к приходу</h3>
          </div>
        </div>

        {sent ? (
          <div className="cf-pop mt-8 rounded-2xl bg-cf-ink-2 p-6">
            <p className="text-lg font-semibold">
              {chosen.name}, {chosenDay?.top} {chosenDay?.bottom}, {slot}
            </p>
            <p className="mt-2 text-sm text-cf-muted">
              Это прототип: заявка никуда не ушла. На сайте она приходит менеджеру филиала в Telegram и в панель, а вам —
              подтверждение.
            </p>
            <button type="button" onClick={() => setSent(false)} className="cf-btn cf-btn-ghost mt-5">
              Изменить
            </button>
          </div>
        ) : (
          <form
            className="mt-8 grid grid-cols-1 gap-7 lg:grid-cols-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (day && slot) setSent(true);
            }}
          >
            <fieldset>
              <legend className="text-sm text-cf-muted">Шоурум</legend>
              <div className="mt-3 grid grid-cols-1 gap-2">
                {branches.map((item) => (
                  <button key={item.id} type="button" aria-pressed={branch === item.id} onClick={() => setBranch(item.id)} className="cf-chip justify-between">
                    {item.name}
                    <span className="text-xs opacity-70">{item.note}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm text-cf-muted">День</legend>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {days.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    aria-pressed={day === item.key}
                    onClick={() => setDay(item.key)}
                    className="cf-chip min-h-14 flex-col justify-center px-1 text-xs leading-tight"
                  >
                    <span className="capitalize">{item.top}</span>
                    <span className="font-semibold">{item.bottom}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm text-cf-muted">Время</legend>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {slots.map((item) => (
                  <button key={item} type="button" aria-pressed={slot === item} onClick={() => setSlot(item)} className="cf-chip justify-center px-1 text-xs tabular-nums">
                    {item}
                  </button>
                ))}
              </div>
              <button type="submit" disabled={!day || !slot} className="cf-btn mt-5 w-full disabled:cursor-not-allowed disabled:opacity-40">
                Записаться
              </button>
            </fieldset>
          </form>
        )}
      </div>
    </Addon>
  );
}

/* ------------------------------------------------------------------ */
/* Панель управления — превью                                           */
/* ------------------------------------------------------------------ */

/**
 * Превью панели. Цифры в таблице — товары и цены их каталога; редактировать
 * здесь нельзя, это витрина того, что увидит менеджер магазина.
 */
export function AdminPreview() {
  const rows = ["velmont", "monet", "kupe", "fenix", "lift-bed"].map(productById);
  return (
    <Addon id="admin" as="section" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <In variant="tilt">
          <p className="cf-eyebrow text-cf-accent">Панель управления</p>
          <h2 className="cf-display mt-4 max-w-3xl text-[clamp(2rem,5vw,3.4rem)]">Цены, фото и филиалы — сами, без разработчика</h2>
          <p className="mt-5 max-w-2xl text-cf-muted">
            Поменяли цену — она сразу на сайте, в строке «в месяц» и в калькуляторе размеров. Габариты — отдельными полями,
            а не текстом в описании: поэтому работает подбор «Влезет ли».
          </p>
        </In>
        <In variant="zoom" className="mt-10 overflow-hidden rounded-[1.75rem] bg-[#f6f5f7] text-[#23212c] shadow-2xl">
          <div className="flex items-center gap-2 border-b border-black/10 px-5 py-3 text-xs text-black/50">
            <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
            <span className="ml-3">admin.comfort-mebel.uz / Товары</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[13rem_1fr]">
            <nav aria-label="Разделы панели" className="hidden border-r border-black/10 p-4 text-sm md:block">
              {["Товары", "Категории", "Цвета и ткани", "Филиалы", "Заявки и записи", "Рассрочка"].map((item, index) => (
                <p key={item} className={cn("rounded-lg px-3 py-2", index === 0 ? "bg-black text-white" : "text-black/60")}>
                  {item}
                </p>
              ))}
            </nav>
            <div className="overflow-x-auto p-4 sm:p-6">
              <table className="w-full min-w-[34rem] text-sm">
                <thead className="text-left text-xs text-black/50">
                  <tr>
                    <th className="py-2 font-normal">Модель</th>
                    <th className="py-2 font-normal">Ширина × глубина</th>
                    <th className="py-2 font-normal">Цена</th>
                    <th className="py-2 font-normal">Витрина</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((item) => (
                    <tr key={item.id} className="border-t border-black/10">
                      <td className="flex items-center gap-3 py-2.5">
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                          <Image src={item.image} alt="" fill sizes="40px" className="object-cover" />
                        </span>
                        {item.name}
                      </td>
                      <td className="py-2.5 tabular-nums">
                        {item.width} × {item.depth} см
                      </td>
                      <td className="py-2.5 tabular-nums">{sum(item.price)}</td>
                      <td className="py-2.5">
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs text-emerald-800">на сайте</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </In>
      </div>
    </Addon>
  );
}
