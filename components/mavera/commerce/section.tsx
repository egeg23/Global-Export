"use client";

import Image from "next/image";
import { useState } from "react";

import { Addon } from "@/components/configurator/context";
import { Rise } from "@/components/mavera/reveal";
import { money, type TierId } from "@/components/present/mavera/theme";
import {
  commerceBanks,
  commerceObjects,
  financingOf,
  rentalOf,
  type CommerceDeal,
  type CommerceObject,
} from "@/content/mavera/commerce";
import { cn } from "@/lib/cn";

/**
 * Коммерческая недвижимость: объекты в Ташкенте, доходность и заявка в банк.
 *
 * Покупатель коммерции спрашивает не «сколько комнат», а «что это принесёт»:
 * поэтому на каждой карточке сразу стоит примерный доход от сдачи в аренду и
 * доходность в процентах, а калькулятор ниже переводит это в сделку с банком —
 * взнос, срок, платёж и то, что остаётся в месяц после платежа. Заявка уходит
 * банку-партнёру с этим же расчётом: менеджер банка видит цифры, а не «хочу
 * купить помещение».
 *
 * Калькулятор и заявка — допник «commerce-calc»: в «Премиуме» и «Noir» в пакете,
 * в «Стандарте» и «Люксе» включается тумблером. Список объектов — база.
 */

const pct = (value: number) => `${value.toFixed(1).replace(".", ",")}%`;
const years = (value: number) => (value < 2 ? `${Math.round(value * 12)} мес` : `${value.toFixed(1).replace(".0", "").replace(".", ",")} лет`);

function radiusOf(variant: TierId) {
  return variant === "premium" || variant === "noir" ? "rounded-[var(--w-radius-lg)]" : variant === "lux" ? "rounded-[2px]" : "rounded-none";
}

function chipOf(variant: TierId, active: boolean) {
  return cn(
    "px-4 py-2 text-sm transition-colors duration-200",
    variant === "premium" || variant === "noir" ? "rounded-full" : variant === "lux" ? "rounded-[2px]" : "rounded-none",
    active
      ? "bg-[var(--w-accent)] text-[var(--w-accent-ink)]"
      : "border border-[var(--w-line)] text-[var(--w-muted)] hover:text-[var(--w-ink)]",
  );
}

export function Commerce({
  variant,
  title,
  note,
  className,
}: {
  variant: TierId;
  title: string;
  note: string;
  className?: string;
}) {
  const [deal, setDeal] = useState<CommerceDeal | "Все">("Все");
  const forSale = commerceObjects.filter((item) => item.deal === "Продажа");
  const [selectedId, setSelectedId] = useState(forSale[0].id);
  const shown = commerceObjects.filter((item) => deal === "Все" || item.deal === deal);
  const radius = radiusOf(variant);
  const night = variant === "noir";

  const pick = (id: string) => {
    setSelectedId(id);
    document.getElementById("commerce-calc")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={cn("mx-auto w-full max-w-[1500px] px-5 py-24 sm:px-8", className)}>
      <Rise className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">Коммерческая недвижимость · Ташкент</p>
          <h2 className="mt-4 text-[clamp(1.8rem,3.4vw,2.8rem)] leading-[1.08]">{title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-[var(--w-muted)]">{note}</p>
        </div>
        <div role="group" aria-label="Тип сделки" className="flex flex-wrap gap-2">
          {(["Все", "Продажа", "Аренда"] as const).map((item) => (
            <button key={item} type="button" aria-pressed={deal === item} onClick={() => setDeal(item)} className={chipOf(variant, deal === item)}>
              {item}
            </button>
          ))}
        </div>
      </Rise>

      <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((item, index) => {
          const rental = rentalOf(item);
          const sale = item.deal === "Продажа";
          return (
            <Rise
              as="li"
              key={item.id}
              delay={index * 60}
              className={cn("flex flex-col overflow-hidden border border-[var(--w-line)] bg-[var(--w-surface)]", radius)}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={night && item.photoNight ? item.photoNight : item.photo}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-[var(--w-ease)] hover:scale-[1.04] motion-reduce:transform-none"
                />
                <span className="absolute left-4 top-4 bg-[var(--w-bg)]/80 px-3 py-1 text-[0.66rem] uppercase tracking-[0.16em] text-[var(--w-ink)] backdrop-blur-sm">
                  {item.kind} · {item.deal}
                </span>
                <span
                  className={cn(
                    "absolute right-4 top-4 px-2.5 py-1 text-[0.66rem] uppercase tracking-[0.12em]",
                    item.status === "Свободно" ? "bg-[var(--w-accent)] text-[var(--w-accent-ink)]" : "bg-[var(--w-bg)]/80 text-[var(--w-muted)]",
                  )}
                >
                  {item.status}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="text-xl leading-snug">{item.name}</h3>
                <p className="mt-1.5 text-sm text-[var(--w-muted)]">
                  {item.district} район · {item.address}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--w-muted)]">{item.note}</p>

                <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[var(--w-line)] pt-4 text-sm">
                  <div>
                    <dt className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--w-muted)]">Площадь</dt>
                    <dd className="mt-1 tabular-nums">{item.area.toLocaleString("ru-RU")} м²</dd>
                  </div>
                  <div>
                    <dt className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--w-muted)]">{sale ? "Цена" : "Аренда"}</dt>
                    <dd className="mt-1 tabular-nums">
                      {sale ? money(item.priceUsd ?? 0, "uzs") : `${money(item.rentUsdMonth ?? 0, "uzs")} / мес`}
                    </dd>
                  </div>
                  {sale ? (
                    <>
                      <div>
                        <dt className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--w-muted)]">При сдаче в аренду</dt>
                        <dd className="mt-1 tabular-nums">≈ {money(Math.round(rental.netMonth), "uzs")} / мес</dd>
                      </div>
                      <div>
                        <dt className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--w-muted)]">Доходность</dt>
                        <dd className="mt-1 tabular-nums text-[var(--w-accent)]">
                          {pct(rental.yieldPct)} · окупаемость {years(rental.paybackYears)}
                        </dd>
                      </div>
                    </>
                  ) : (
                    <div className="col-span-2">
                      <dt className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--w-muted)]">Ставка</dt>
                      <dd className="mt-1 tabular-nums">{money(item.rateUsdM2, "uzs")} за м² в месяц · {item.floor}</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-auto pt-5">
                  {sale ? (
                    <button
                      type="button"
                      onClick={() => pick(item.id)}
                      className={cn(
                        "w-full bg-[var(--w-accent)] px-5 py-3 text-sm font-medium text-[var(--w-accent-ink)] transition-opacity hover:opacity-90",
                        variant === "premium" || variant === "noir" ? "rounded-full" : radius,
                      )}
                    >
                      Рассчитать покупку
                    </button>
                  ) : (
                    <RequestButton variant={variant} label="Запросить условия аренды" done="Запрос принят. Менеджер по коммерции пришлёт условия и назначит показ." />
                  )}
                </div>
              </div>
            </Rise>
          );
        })}
      </ul>

      {/* Допник: калькулятор и заявка в банк. */}
      <Addon id="commerce-calc" anchor="commerce-calc" className="mt-12 scroll-mt-24">
        <Calculator variant={variant} selectedId={selectedId} onSelect={setSelectedId} />
      </Addon>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Калькулятор покупки и заявка в банк                                 */
/* ------------------------------------------------------------------ */

export function Calculator({
  variant,
  selectedId,
  onSelect,
}: {
  variant: TierId;
  selectedId?: string;
  onSelect?: (id: string) => void;
}) {
  const forSale = commerceObjects.filter((item) => item.deal === "Продажа");
  const [ownId, setOwnId] = useState(forSale[0].id);
  const id = selectedId ?? ownId;
  const setId = onSelect ?? setOwnId;
  const object = forSale.find((item) => item.id === id) ?? forSale[0];

  const [bankId, setBankId] = useState(commerceBanks[0].id);
  const bank = commerceBanks.find((item) => item.id === bankId) ?? commerceBanks[0];
  const [downShare, setDownShare] = useState(0.3);
  const [term, setTerm] = useState(5);

  const deal = financingOf(object, bank, downShare, term);
  const radius = radiusOf(variant);
  const pill = variant === "premium" || variant === "noir" ? "rounded-full" : variant === "lux" ? "rounded-[2px]" : "rounded-none";

  const pickBank = (next: (typeof commerceBanks)[number]) => {
    setBankId(next.id);
    setDownShare((prev) => Math.max(prev, next.down));
    setTerm((prev) => Math.min(prev, next.years));
  };

  return (
    <div className={cn("grid gap-6 border border-[var(--w-line)] bg-[var(--w-surface)] p-6 sm:p-8 lg:grid-cols-12 lg:gap-10", radius)}>
      <div className="lg:col-span-7">
        <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">Расчёт покупки</p>
        <h3 className="mt-3 text-2xl leading-snug">Взнос, срок и что останется после платежа банку</h3>

        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Объект">
          {forSale.map((item) => (
            <button key={item.id} type="button" aria-pressed={item.id === object.id} onClick={() => setId(item.id)} className={chipOf(variant, item.id === object.id)}>
              {item.short}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Банк">
          {commerceBanks.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === bank.id}
              onClick={() => pickBank(item)}
              className={cn(
                "px-3 py-1.5 text-xs transition-colors duration-200",
                pill,
                item.id === bank.id ? "bg-[var(--w-accent)] text-[var(--w-accent-ink)]" : "border border-[var(--w-line)] text-[var(--w-muted)] hover:text-[var(--w-ink)]",
              )}
            >
              {item.name}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-[var(--w-muted)]">
          {bank.note} · ставка {bank.rate === 0 ? "0%" : `${bank.rate}%`} · взнос от {Math.round(bank.down * 100)}% · до {years(bank.years)}
        </p>

        <label className="mt-6 block">
          <span className="flex items-baseline justify-between text-sm">
            <span className="text-[var(--w-muted)]">Первоначальный взнос</span>
            <span className="tabular-nums">
              {Math.round(deal.share * 100)}% · {money(deal.down, "uzs")}
            </span>
          </span>
          <input
            type="range"
            aria-label="Первоначальный взнос"
            min={Math.round(bank.down * 100)}
            max={90}
            value={Math.round(deal.share * 100)}
            onChange={(event) => setDownShare(Number(event.target.value) / 100)}
            className="mt-2 w-full accent-[var(--w-accent)]"
          />
        </label>

        <label className="mt-4 block">
          <span className="flex items-baseline justify-between text-sm">
            <span className="text-[var(--w-muted)]">Срок</span>
            <span className="tabular-nums">{years(deal.term)}</span>
          </span>
          <input
            type="range"
            aria-label="Срок кредита"
            min={1}
            max={bank.years}
            step={bank.years < 2 ? 0.5 : 1}
            value={deal.term}
            onChange={(event) => setTerm(Number(event.target.value))}
            className="mt-2 w-full accent-[var(--w-accent)]"
          />
        </label>

        <dl className="mt-6 grid gap-x-6 gap-y-3 border-t border-[var(--w-line)] pt-5 text-sm sm:grid-cols-2">
          {[
            ["Цена объекта", money(object.priceUsd ?? 0, "uzs")],
            ["Сумма кредита", money(deal.loan, "uzs")],
            ["Платёж банку в месяц", money(Math.round(deal.monthly), "uzs")],
            ["Аренда после эксплуатации", `≈ ${money(Math.round(deal.rental.netMonth), "uzs")} / мес`],
            ["Остаётся после платежа", `${deal.cashflow < 0 ? "−" : "+"}${money(Math.round(Math.abs(deal.cashflow)), "uzs")} / мес`],
            ["Доходность · окупаемость", `${pct(deal.rental.yieldPct)} · ${years(deal.rental.paybackYears)}`],
          ].map(([label, value], index) => (
            <div key={label} className="flex items-baseline justify-between gap-4">
              <dt className="text-[var(--w-muted)]">{label}</dt>
              <dd className={cn("text-right tabular-nums", index === 4 && (deal.cashflow < 0 ? "text-[var(--w-muted)]" : "text-[var(--w-accent)]"))}>
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-[var(--w-muted)]">
          Аренда считается по рыночной ставке {money(object.rateUsdM2, "uzs")} за м² с заполняемостью {Math.round(object.occupancy * 100)}% минус
          эксплуатация. Ставки банков условные, заданы для примера — в готовом сайте правятся в панели управления. Точные условия
          подтверждает банк.
        </p>
      </div>

      <BankRequest variant={variant} object={object} bankName={bank.name} down={deal.down} term={deal.term} className="lg:col-span-5" />
    </div>
  );
}

/** Заявка в банк: уходит с расчётом, а не с «хочу купить». */
function BankRequest({
  variant,
  object,
  bankName,
  down,
  term,
  className,
}: {
  variant: TierId;
  object: CommerceObject;
  bankName: string;
  down: number;
  term: number;
  className?: string;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const radius = radiusOf(variant);
  const field = cn(
    "mt-1 w-full border border-[var(--w-line)] bg-[var(--w-bg)] px-3.5 py-2.5 text-sm text-[var(--w-ink)] outline-none placeholder:text-[var(--w-muted)] focus:border-[var(--w-accent)]",
    variant === "lux" ? "rounded-[2px]" : variant === "standard" ? "rounded-none" : "rounded-[var(--w-radius)]",
  );

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || contact.replace(/\D/g, "").length < 7) {
      setError("Нужны название компании или имя и телефон — по ним банк перезвонит.");
      return;
    }
    setError(null);
    setSent(true);
  };

  return (
    <div className={cn("border-t border-[var(--w-line)] pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0", className)}>
      <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">Заявка в банк</p>
      <h3 className="mt-3 text-2xl leading-snug">{bankName}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--w-muted)]">
        Уйдёт с расчётом: объект, взнос {money(down, "uzs")}, срок {years(term)}. Предварительный ответ — до двух рабочих дней, показ объекта
        назначает менеджер MAVERA.
      </p>

      {sent ? (
        <p role="status" className={cn("mv-fade mt-6 border border-[var(--w-accent)] bg-[var(--w-accent-soft)] px-5 py-4 text-sm", radius)}>
          Заявка отправлена в {bankName}. Копия с расчётом по объекту «{object.name}» — у вашего менеджера. Демонстрация: на витрине заявка
          никуда не уходит.
        </p>
      ) : (
        <form onSubmit={submit} noValidate className="mt-6">
          <label className="block text-xs text-[var(--w-muted)]">
            Компания или имя
            <input type="text" aria-label="Компания или имя" value={name} onChange={(event) => setName(event.target.value)} placeholder="ООО «Ташкент Ритейл» или Азиз" className={field} />
          </label>
          <label className="mt-3 block text-xs text-[var(--w-muted)]">
            Телефон
            <input type="tel" aria-label="Телефон" value={contact} onChange={(event) => setContact(event.target.value)} placeholder="+998 __ ___ __ __" className={field} />
          </label>
          <dl className="mt-4 space-y-1.5 text-xs text-[var(--w-muted)]">
            <div className="flex justify-between gap-4"><dt>Объект</dt><dd className="text-right text-[var(--w-ink)]">{object.short}</dd></div>
            <div className="flex justify-between gap-4"><dt>Взнос</dt><dd className="tabular-nums text-[var(--w-ink)]">{money(down, "uzs")}</dd></div>
            <div className="flex justify-between gap-4"><dt>Срок</dt><dd className="tabular-nums text-[var(--w-ink)]">{years(term)}</dd></div>
          </dl>
          {error ? <p role="alert" className="mt-3 text-xs text-[var(--w-accent)]">{error}</p> : null}
          <button
            type="submit"
            className={cn(
              "mt-5 w-full bg-[var(--w-accent)] px-5 py-3.5 text-sm font-medium text-[var(--w-accent-ink)] transition-opacity hover:opacity-90",
              variant === "premium" || variant === "noir" ? "w-glow rounded-full" : radius,
            )}
          >
            Отправить заявку в банк
          </button>
          <p className="mt-3 text-xs leading-relaxed text-[var(--w-muted)]">Нажимая, вы соглашаетесь на передачу данных банку-партнёру для предварительного решения.</p>
        </form>
      )}
    </div>
  );
}

/** Кнопка запроса условий аренды: отвечает, как ответит готовый сайт. */
function RequestButton({ variant, label, done }: { variant: TierId; label: string; done: string }) {
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <p role="status" className="mv-fade border border-[var(--w-accent)] bg-[var(--w-accent-soft)] px-4 py-3 text-sm">
        {done}
      </p>
    );
  }
  return (
    <button
      type="button"
      onClick={() => setSent(true)}
      className={cn(
        "w-full border border-[var(--w-line)] px-5 py-3 text-sm transition-colors hover:border-[var(--w-accent)]",
        variant === "premium" || variant === "noir" ? "rounded-full" : radiusOf(variant),
      )}
    >
      {label}
    </button>
  );
}
