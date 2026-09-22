"use client";

import { useMemo, useState } from "react";

import { Rise } from "@/components/mavera/reveal";
import { mortgage } from "@/content/gh/company";
import { flats, priceRange, roomOptions, select, statusLabel, sums, type Flat } from "@/content/gh/flats";
import { projects } from "@/content/gh/projects";
import { cn } from "@/lib/cn";

/**
 * Две вещи, которых на gh.uz нет: подбор квартиры и расчёт платежа.
 *
 * Сегодня и то и другое делает менеджер по телефону — и делает это восемь
 * часов в сутки, пять дней в неделю. Здесь на оба вопроса отвечает страница:
 * фильтр показывает свободные лоты сразу, калькулятор считает платёж по их
 * же условиям (взнос от 15%, ставка 20%) и отдаёт заявку уже с квартирой
 * внутри, а не «перезвоните мне».
 *
 * Обе цифры считаются на клиенте: заказчик двигает ползунок на встрече и
 * видит ответ, а не ждёт ответа сервера.
 */

/* ------------------------------------------------------------------ */
/* Подбор квартиры                                                     */
/* ------------------------------------------------------------------ */

export function Picker() {
  const [project, setProject] = useState<string | null>(null);
  const [rooms, setRooms] = useState<number | null>(null);
  const [budget, setBudget] = useState(priceRange[1]);
  const [onlyFree, setOnlyFree] = useState(true);
  const [picked, setPicked] = useState<Flat | null>(null);

  const found = useMemo(
    () => select({ project, rooms, budget, onlyFree }),
    [project, rooms, budget, onlyFree],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
      {/* Условия */}
      <Rise className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-6 shadow-[var(--w-shadow)]">
        <Group label="Жилой комплекс">
          <Chip active={project === null} onClick={() => setProject(null)}>
            Все
          </Chip>
          {projects.map((item) => (
            <Chip
              key={item.slug}
              active={project === item.slug}
              onClick={() => setProject(project === item.slug ? null : item.slug)}
            >
              {item.name}
            </Chip>
          ))}
        </Group>

        <Group label="Комнат">
          <Chip active={rooms === null} onClick={() => setRooms(null)}>
            Любое
          </Chip>
          {roomOptions.map((count) => (
            <Chip
              key={count}
              active={rooms === count}
              onClick={() => setRooms(rooms === count ? null : count)}
            >
              {count}
            </Chip>
          ))}
        </Group>

        <div className="mt-7">
          <div className="flex items-baseline justify-between">
            <span className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--w-muted)]">
              Бюджет
            </span>
            <span className="text-sm font-medium">до {sums(budget)} млн сум</span>
          </div>
          <input
            type="range"
            min={priceRange[0]}
            max={priceRange[1]}
            step={10}
            value={budget}
            onChange={(event) => setBudget(Number(event.target.value))}
            aria-label="Бюджет, млн сум"
            className="mt-3 w-full accent-[var(--w-accent)]"
          />
        </div>

        <label className="mt-6 flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={onlyFree}
            onChange={(event) => setOnlyFree(event.target.checked)}
            className="size-4 accent-[var(--w-accent)]"
          />
          Только свободные
        </label>

        <p className="mt-7 border-t border-[var(--w-line)] pt-5 text-[0.78rem] leading-relaxed text-[var(--w-muted)]">
          Нашлось <b className="text-[var(--w-ink)]">{found.length}</b> из {flats.length} квартир.
          Цены в подборе условные: в рабочем сайте они приходят из панели управления.
        </p>
      </Rise>

      {/* Результат */}
      <div>
        {found.length === 0 ? (
          <Rise className="rounded-[var(--w-radius-lg)] border border-dashed border-[var(--w-line)] p-10 text-center text-sm text-[var(--w-muted)]">
            Под эти условия ничего не нашлось. Поднимите бюджет или снимите галочку
            «только свободные» — часть лотов в брони освобождается.
          </Rise>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {found.slice(0, 8).map((flat, index) => (
              <Rise as="li" key={flat.id} delay={index * 45}>
                <button
                  type="button"
                  onClick={() => setPicked(flat)}
                  className={cn(
                    "w-full rounded-[var(--w-radius)] border bg-[var(--w-surface)] p-5 text-left transition-colors",
                    picked?.id === flat.id
                      ? "border-[var(--w-accent)]"
                      : "border-[var(--w-line)] hover:border-[var(--w-accent)]",
                  )}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-medium">
                      {flat.rooms}-комн. · {flat.area} м²
                    </span>
                    <Status status={flat.status} />
                  </div>
                  <p className="mt-2 text-[0.8rem] text-[var(--w-muted)]">
                    {projects.find((item) => item.slug === flat.project)?.name} · {flat.floor} из{" "}
                    {flat.floors} этажа · {flat.view.toLowerCase()}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-[var(--w-accent)]">
                    {sums(flat.price)} <span className="text-sm font-normal">млн сум</span>
                  </p>
                </button>
              </Rise>
            ))}
          </ul>
        )}

        {found.length > 8 ? (
          <p className="mt-4 text-[0.8rem] text-[var(--w-muted)]">
            Показаны восемь самых доступных. Остальные {found.length - 8} — на странице
            жилого комплекса.
          </p>
        ) : null}

        {picked ? <Mortgage flat={picked} /> : null}
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 first:mt-0">
      <span className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--w-muted)]">{label}</span>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-[0.78rem] transition-colors",
        active
          ? "border-[var(--w-accent)] bg-[var(--w-accent)] text-[var(--w-accent-ink)]"
          : "border-[var(--w-line)] text-[var(--w-muted)] hover:border-[var(--w-accent)]",
      )}
    >
      {children}
    </button>
  );
}

function Status({ status }: { status: Flat["status"] }) {
  const tone =
    status === "free"
      ? "bg-[var(--w-accent-soft)] text-[var(--w-accent)]"
      : status === "booked"
        ? "bg-[#f3efe6] text-[var(--w-muted)]"
        : "bg-[#efe9df] text-[var(--w-muted)]";
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[0.66rem] tracking-wide", tone)}>
      {statusLabel[status]}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Ипотека по выбранной квартире                                       */
/* ------------------------------------------------------------------ */

export function Mortgage({ flat }: { flat: Flat }) {
  const [share, setShare] = useState(mortgage.down);
  const [years, setYears] = useState(10);

  const plan = useMemo(() => {
    const price = flat.price;
    const down = (price * share) / 100;
    const loan = price - down;
    const months = years * 12;
    const rate = mortgage.rate / 100 / 12;
    // Аннуитет: платёж один и тот же все месяцы — так считают в их же банках.
    const monthly = (loan * rate) / (1 - (1 + rate) ** -months);
    return { down, loan, monthly, total: monthly * months, over: monthly * months - loan };
  }, [flat.price, share, years]);

  return (
    <Rise
      as="section"
      className="mt-6 rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-paper)] p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-lg">
          Ипотека: {flat.rooms}-комн. {flat.area} м²
        </h3>
        <span className="text-sm text-[var(--w-muted)]">
          {projects.find((item) => item.slug === flat.project)?.name}
        </span>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="flex items-baseline justify-between text-[0.78rem] text-[var(--w-muted)]">
            Первоначальный взнос
            <b className="text-[var(--w-ink)]">
              {share}% · {sums(Math.round(plan.down))} млн
            </b>
          </span>
          <input
            type="range"
            min={mortgage.down}
            max={70}
            step={5}
            value={share}
            onChange={(event) => setShare(Number(event.target.value))}
            className="mt-2 w-full accent-[var(--w-accent)]"
          />
        </label>

        <label className="block">
          <span className="flex items-baseline justify-between text-[0.78rem] text-[var(--w-muted)]">
            Срок
            <b className="text-[var(--w-ink)]">{years} лет</b>
          </span>
          <input
            type="range"
            min={3}
            max={20}
            step={1}
            value={years}
            onChange={(event) => setYears(Number(event.target.value))}
            className="mt-2 w-full accent-[var(--w-accent)]"
          />
        </label>
      </div>

      <dl className="mt-7 grid gap-px overflow-hidden rounded-[var(--w-radius)] border border-[var(--w-line)] bg-[var(--w-line)] sm:grid-cols-3">
        <Cell label="Платёж в месяц" value={`${sums(Math.round(plan.monthly * 10) / 10)} млн сум`} strong />
        <Cell label="Сумма кредита" value={`${sums(Math.round(plan.loan))} млн сум`} />
        <Cell label="Переплата" value={`${sums(Math.round(plan.over))} млн сум`} />
      </dl>

      <p className="mt-4 text-[0.76rem] leading-relaxed text-[var(--w-muted)]">
        {mortgage.note} Расчёт ориентировочный и не является публичной офертой; точную
        сумму называет отдел продаж. Партнёр по ипотеке — {mortgage.partner}.
      </p>
    </Rise>
  );
}

function Cell({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="bg-[var(--w-surface)] px-5 py-4">
      <dt className="text-[0.72rem] text-[var(--w-muted)]">{label}</dt>
      <dd
        className={cn(
          "mt-1.5 font-semibold",
          strong ? "text-xl text-[var(--w-accent)]" : "text-lg text-[var(--w-ink)]",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
