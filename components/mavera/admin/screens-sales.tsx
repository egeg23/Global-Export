"use client";

import { useState } from "react";

import { Addon, useAddon } from "@/components/configurator/context";
import { fmt, leadStates, plural, type LeadState } from "@/components/mavera/admin/model";
import { useAdmin, useTotals } from "@/components/mavera/admin/store";
import {
  Card,
  Chrome,
  Note,
  RowSelect,
  ScreenButton,
  Title,
} from "@/components/mavera/admin/ui";
import { cn } from "@/lib/cn";

/**
 * Продажи: обзор, заявки, аналитика.
 *
 * Цифры здесь не написаны в разметке, а считаются по тому же состоянию, что
 * правят в каталоге. Поменяли статус квартиры в шахматке — остаток в обзоре
 * поехал следом; это и отличает прототип от набора картинок.
 */

/* ------------------------------------------------------------------ */
/* Обзор                                                               */
/* ------------------------------------------------------------------ */

/** Столбики недели: те же при каждой отрисовке, зависят только от периода. */
function bars(days: number): number[] {
  return Array.from({ length: days }, (_, index) => 30 + ((index * 37 + days * 11) % 60));
}

export function OverviewScreen() {
  const admin = useAdmin();
  const totals = useTotals();
  const [period, setPeriod] = useState(7);

  const tiles: { label: string; value: string; hint: string; go: Parameters<typeof admin.setScreen>[0] }[] = [
    { label: "Заявки", value: String(admin.leads.length), hint: `новых ${totals.newLeads}`, go: "leads" },
    { label: "Забронировано", value: fmt(totals.counts.booked), hint: "квартир", go: "flats" },
    { label: "Квартир в продаже", value: fmt(totals.counts.free), hint: `из ${fmt(totals.flats)}`, go: "flats" },
    { label: "Заявок в сделку", value: totals.conversion, hint: `${totals.deals} из ${admin.leads.length}`, go: "analytics" },
  ];

  const week = bars(period);

  return (
    <Chrome active="overview" badge={plural(totals.newLeads, ["новая заявка", "новые заявки", "новых заявок"])}>
      <Title eyebrow="Работа" title="Обзор" />

      <div className="mt-[0.9em] grid grid-cols-2 gap-[0.5em] @min-[40rem]:grid-cols-4">
        {tiles.map((tile) => (
          <button
            key={tile.label}
            type="button"
            onClick={() => admin.setScreen(tile.go)}
            className="rounded-[0.5em] border border-forest-900/10 bg-white p-[1em] text-left transition-colors hover:border-forest-900/30"
          >
            <p className="text-[0.44em] uppercase tracking-[0.1em] text-ink-subtle">{tile.label}</p>
            <p className="mt-[0.2em] text-[0.95em] font-semibold tabular-nums">{tile.value}</p>
            <p className="mt-[0.1em] text-[0.42em] text-ink-subtle">{tile.hint}</p>
          </button>
        ))}
      </div>

      <div className="mt-[0.7em] grid gap-[0.6em] @min-[40rem]:grid-cols-[1.5fr_1fr]">
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-[0.55em] font-medium">Визиты и заявки</p>
            <span className="flex gap-[0.2em]">
              {[7, 30].map((days) => (
                <button
                  key={days}
                  type="button"
                  aria-pressed={period === days}
                  onClick={() => setPeriod(days)}
                  className={cn(
                    "rounded-[0.3em] px-[0.5em] py-[0.15em] text-[0.45em] transition-colors",
                    period === days ? "bg-forest-800 text-sand-50" : "text-ink-subtle hover:bg-forest-900/8",
                  )}
                >
                  {days} дней
                </button>
              ))}
            </span>
          </div>

          <div className="mt-[0.8em] flex h-[4em] items-end gap-[0.12em]">
            {week.map((height, index) => (
              <span
                key={index}
                className="flex-1 rounded-t-[0.1em] bg-forest-600/80 transition-all duration-500"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <p className="mt-[0.5em] text-[0.44em] text-ink-subtle">
            Данные Яндекс.Метрики за {period} дней — открывать её отдельно не нужно.
          </p>
        </Card>

        <Card>
          <p className="text-[0.55em] font-medium">Последние действия</p>
          <div className="mt-[0.5em] space-y-[0.4em]">
            {admin.audit.slice(0, 4).map((entry) => (
              <div key={entry.id} className="border-b border-forest-900/6 pb-[0.35em] last:border-b-0">
                <p className="text-[0.46em] leading-[1.4]">{entry.what}</p>
                <p className="text-[0.42em] text-ink-subtle">
                  {entry.who} · {entry.at} · {entry.target}
                </p>
              </div>
            ))}
          </div>
          <ScreenButton tone="outline" className="mt-[0.6em]" onClick={() => admin.setScreen("audit")}>
            Весь журнал
          </ScreenButton>
        </Card>
      </div>

      <Card className="mt-[0.6em]">
        <div className="flex flex-wrap items-baseline justify-between gap-[0.5em]">
          <p className="text-[0.55em] font-medium">Свободные квартиры по проектам</p>
          <p className="text-[0.46em] text-ink-subtle">
            В остатке на <span className="tabular-nums text-forest-800">{totals.money}</span> сум
          </p>
        </div>
        <div className="mt-[0.5em] space-y-[0.35em]">
          {admin.projects.map((project) => {
            const flats = admin.flatsOf(project.id);
            const free = flats.filter((flat) => flat.status === "free").length;
            const share = flats.length ? Math.round((free / flats.length) * 100) : 0;
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => admin.openProject(project.id)}
                className="flex w-full items-center gap-[0.6em] text-left"
              >
                <span className="w-[6em] shrink-0 truncate text-[0.48em]">{project.name.RU}</span>
                <span className="h-[0.5em] flex-1 overflow-hidden rounded-full bg-forest-900/8">
                  <span className="block h-full rounded-full bg-forest-600" style={{ width: `${share}%` }} />
                </span>
                <span className="w-[4em] shrink-0 text-right text-[0.46em] tabular-nums text-ink-subtle">
                  {fmt(free)} из {fmt(flats.length)}
                </span>
              </button>
            );
          })}
        </div>
      </Card>
    </Chrome>
  );
}

/* ------------------------------------------------------------------ */
/* Заявки                                                              */
/* ------------------------------------------------------------------ */

export function LeadsScreen() {
  const admin = useAdmin();
  const [filter, setFilter] = useState<LeadState | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const crm = useAddon("crm");
  const managers = [...new Set(admin.staff.filter((item) => item.active).map((item) => item.name.split(" ")[0]))];

  const countOf = (state: LeadState) => admin.leads.filter((lead) => lead.state === state).length;
  const shown = filter ? admin.leads.filter((lead) => lead.state === filter) : admin.leads;
  const waiting = admin.leads.filter((lead) => !lead.synced).length;

  const columns = crm
    ? "grid-cols-[0.9fr_0.9fr_1.4fr_1.3fr_0.9fr_1fr_0.7fr]"
    : "grid-cols-[0.9fr_0.9fr_1.4fr_1.3fr_0.9fr_1fr]";

  return (
    <Chrome active="leads" badge={plural(countOf("Новая"), ["новая заявка", "новые заявки", "новых заявок"])}>
      <Title
        eyebrow="Продажи"
        title="Заявки"
        action={crm ? "Настройки amoCRM" : "Выгрузить в CSV"}
        onAction={() =>
          setNote(
            crm
              ? "Воронка «Продажи квартир» · менеджер назначается по очереди"
              : `Файл собран: ${shown.length} строк — дата, имя, контакт, источник, статус`,
          )
        }
      />

      {/* Допник «Интеграция с CRM»: заявки уходят сами, статус синхронизации — в списке. */}
      <Addon id="crm" compact className="mt-[0.9em]">
        <Card className="flex flex-wrap items-center gap-[0.8em] border-forest-700/30 bg-forest-700/5">
          <span className={cn("h-[0.6em] w-[0.6em] shrink-0 rounded-full", waiting ? "bg-harvest-400" : "bg-forest-600")} />
          <span className="min-w-0 flex-1">
            <span className="block text-[0.55em] font-medium">amoCRM подключена · воронка «Продажи квартир»</span>
            <span className="block text-[0.46em] text-ink-subtle">
              {waiting
                ? `Ждут выгрузки: ${waiting} — статус поменяли после последней синхронизации`
                : "Всё выгружено · менеджер назначается по очереди"}
            </span>
          </span>
          <ScreenButton
            tone="outline"
            disabled={!waiting}
            onClick={() => {
              admin.syncLeads();
              setNote(`Выгружено в amoCRM: ${waiting}`);
            }}
          >
            Синхронизировать
          </ScreenButton>
        </Card>
      </Addon>

      <div className="mt-[0.9em] grid grid-cols-4 gap-[0.5em]">
        {leadStates.map((state) => {
          const on = filter === state;
          return (
            <button
              key={state}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(on ? null : state)}
              className={cn(
                "rounded-[0.5em] border p-[1em] text-left transition-colors",
                on ? "border-forest-800 bg-forest-800/8" : "border-forest-900/10 bg-white hover:border-forest-900/30",
              )}
            >
              <p className="text-[0.44em] uppercase tracking-[0.1em] text-ink-subtle">{state}</p>
              <p className="mt-[0.2em] text-[0.95em] font-semibold tabular-nums">{countOf(state)}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-[0.7em] overflow-hidden rounded-[0.5em] border border-forest-900/10 bg-white">
        <div
          className={cn(
            "grid gap-[0.5em] border-b border-forest-900/10 px-[0.9em] py-[0.45em] text-[0.42em] uppercase tracking-[0.1em] text-ink-subtle",
            columns,
          )}
        >
          <span>Дата</span>
          <span>Имя</span>
          <span>Контакт</span>
          <span>Источник</span>
          <span>Менеджер</span>
          <span>Статус</span>
          {crm ? <span>CRM</span> : null}
        </div>

        {shown.map((lead) => (
          <div
            key={lead.id}
            className={cn(
              "grid items-center gap-[0.5em] border-b border-forest-900/6 px-[0.9em] py-[0.4em] text-[0.5em] last:border-b-0",
              columns,
            )}
          >
            <span className="tabular-nums text-ink-subtle">{lead.date}</span>
            <span className="truncate">{lead.name}</span>
            <span className="truncate text-ink-subtle">{lead.contact}</span>
            <span className="truncate text-ink-subtle">{lead.source}</span>
            <RowSelect
              label={`Менеджер заявки ${lead.name}`}
              value={lead.owner}
              options={managers}
              onChange={(value) =>
                admin.patchLead(lead.id, { owner: value }, `Менеджер: ${lead.owner} → ${value}`)
              }
              className="text-ink-subtle"
            />
            <span
              className={cn(
                "w-fit rounded-full px-[0.3em]",
                lead.state === "Новая"
                  ? "bg-harvest-100 text-harvest-800"
                  : lead.state === "Сделка"
                    ? "bg-forest-700 text-sand-50"
                    : lead.state === "В работе"
                      ? "bg-forest-800/10 text-forest-800"
                      : "bg-forest-900/6 text-ink-subtle",
              )}
            >
              <RowSelect
                label={`Статус заявки ${lead.name}`}
                value={lead.state}
                options={leadStates}
                onChange={(value) => {
                  admin.patchLead(
                    lead.id,
                    { state: value as LeadState, synced: false },
                    `Статус: ${lead.state} → ${value}`,
                  );
                  setNote(`${lead.name}: статус «${value}» · записано в журнал действий`);
                }}
                className="text-[0.85em]"
              />
            </span>
            {crm ? (
              <span className={cn("text-[0.85em]", lead.synced ? "text-forest-700" : "text-harvest-800")}>
                {lead.synced ? "✓ amoCRM" : "ждёт"}
              </span>
            ) : null}
          </div>
        ))}

        {shown.length === 0 ? (
          <p className="px-[0.9em] py-[0.8em] text-[0.48em] text-ink-subtle">В этом статусе заявок нет.</p>
        ) : null}
      </div>

      <Note text={note} />

      <p className="mt-[0.5em] text-[0.46em] leading-[1.6] text-ink-subtle">
        Источник сохраняется автоматически: страница, проект, квартира и UTM-метка.
        Заявка одновременно уходит на почту и в Telegram отдела продаж
        {crm ? " и в CRM — без ручной выгрузки" : "; в CRM — выгрузкой CSV"}.
      </p>
    </Chrome>
  );
}

/* ------------------------------------------------------------------ */
/* Аналитика                                                           */
/* ------------------------------------------------------------------ */

export function AnalyticsScreen() {
  const admin = useAdmin();
  const [period, setPeriod] = useState(7);
  const [goals, setGoals] = useState<Record<string, boolean>>({
    "Отправлена заявка": true,
    "Открыт калькулятор": true,
    "Выбрана квартира": true,
    "Скачан буклет": false,
  });

  // Источники считаются по самим заявкам: цифры не расходятся с их списком.
  const sources = [...new Set(admin.leads.map((lead) => lead.source.split(" · ")[0]))].map((name) => {
    const leads = admin.leads.filter((lead) => lead.source.startsWith(name));
    const deals = leads.filter((lead) => lead.state === "Сделка").length;
    return { name, leads: leads.length, deals };
  });
  const maxLeads = Math.max(1, ...sources.map((item) => item.leads));

  return (
    <Chrome active="analytics" badge={plural(admin.leads.length, ["заявка", "заявки", "заявок"])}>
      <Title eyebrow="Продажи" title="Аналитика" />

      <div className="mt-[0.9em] flex items-center gap-[0.4em]">
        {[7, 30, 90].map((days) => (
          <button
            key={days}
            type="button"
            aria-pressed={period === days}
            onClick={() => setPeriod(days)}
            className={cn(
              "rounded-full px-[0.8em] py-[0.32em] text-[0.48em] transition-colors",
              period === days
                ? "bg-forest-800 text-sand-50"
                : "border border-forest-900/15 text-ink-subtle hover:border-forest-900/40",
            )}
          >
            {days} дней
          </button>
        ))}
        <span className="ml-auto text-[0.46em] text-ink-subtle">
          Вебвизор и карта скроллов — внутри панели
        </span>
      </div>

      <div className="mt-[0.7em] grid gap-[0.6em] @min-[40rem]:grid-cols-[1.4fr_1fr]">
        <Card>
          <p className="text-[0.55em] font-medium">Откуда приходят заявки</p>
          <div className="mt-[0.6em] space-y-[0.45em]">
            {sources.map((source) => (
              <div key={source.name} className="flex items-center gap-[0.6em]">
                <span className="w-[7em] shrink-0 truncate text-[0.48em]">{source.name}</span>
                <span className="h-[0.5em] flex-1 overflow-hidden rounded-full bg-forest-900/8">
                  <span
                    className="block h-full rounded-full bg-forest-600 transition-all duration-500"
                    style={{ width: `${(source.leads / maxLeads) * 100}%` }}
                  />
                </span>
                <span className="w-[5em] shrink-0 text-right text-[0.46em] tabular-nums text-ink-subtle">
                  {source.leads} → {source.deals}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-[0.6em] text-[0.44em] text-ink-subtle">
            Слева заявки, справа дошедшие до сделки. Считается по тем же заявкам,
            что в разделе «Заявки», — расхождений между экранами нет.
          </p>
        </Card>

        <Card>
          <p className="text-[0.55em] font-medium">Цели Метрики</p>
          <div className="mt-[0.5em] space-y-[0.35em]">
            {Object.entries(goals).map(([goal, on]) => (
              <label key={goal} className="flex items-center justify-between gap-[0.5em] text-[0.48em]">
                <span className={on ? "" : "text-ink-subtle"}>{goal}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-label={`Цель «${goal}»`}
                  onClick={() => setGoals((all) => ({ ...all, [goal]: !all[goal] }))}
                  className={cn(
                    "flex h-[0.8em] w-[1.4em] shrink-0 items-center rounded-full px-[0.12em] transition-colors",
                    on ? "bg-forest-700" : "bg-forest-900/20",
                  )}
                >
                  <span
                    className={cn(
                      "h-[0.5em] w-[0.5em] rounded-full bg-white transition-transform",
                      on ? "ml-auto" : "mr-auto",
                    )}
                  />
                </button>
              </label>
            ))}
          </div>
          <p className="mt-[0.6em] text-[0.44em] leading-[1.5] text-ink-subtle">
            Выключенная цель перестаёт считаться, но история остаётся — её видно
            за прошлые {period} дней.
          </p>
        </Card>
      </div>
    </Chrome>
  );
}
