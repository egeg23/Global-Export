"use client";

import { useEffect, useState } from "react";

import { Addon, useAddon } from "@/components/configurator/context";
import {
  Card,
  Chrome,
  ScreenButton,
  SelectField,
  Switch,
  TextField,
  Title,
} from "@/components/mavera/admin/ui";
import {
  area,
  buildFlats,
  corpuses as baseCorpuses,
  countByStatus,
  fmt,
  initialLeads,
  leadStates,
  managers,
  plans,
  slugify,
  statusLabel,
  statusTone,
  views,
  type Corpus,
  type Flat,
  type FlatStatus,
  type Lead,
  type LeadState,
} from "@/components/mavera/admin/model";
import { cn } from "@/lib/cn";

/**
 * Три экрана панели, которые работают по-настоящему.
 *
 * Остальные шесть остаются макетами — они показывают вид, и этого хватает.
 * Эти три заказчик обязательно попробует руками: шахматка, потому что это
 * его ежедневная работа с ценой и статусом; карточка ЖК, потому что там
 * живут три языка; заявки, потому что это деньги. Нажатие, которое ничего
 * не делает, на встрече стоит дороже, чем день работы.
 */

/* ------------------------------------------------------------------ */
/* Мелкие поля внутри таблиц                                           */
/* ------------------------------------------------------------------ */

function RowSelect({
  value,
  options,
  onChange,
  label,
  className,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  label: string;
  className?: string;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        "w-full appearance-none rounded-[0.3em] border border-transparent bg-transparent py-[0.1em] text-[1em] outline-none hover:border-forest-900/15 focus:border-forest-700",
        className,
      )}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

/** Строка о том, что сейчас произошло. Живёт до следующего действия. */
function Note({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <p role="status" className="mt-[0.5em] text-[0.46em] text-forest-700">
      {text}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Корпуса и квартиры                                                  */
/* ------------------------------------------------------------------ */

export function FlatsScreen() {
  const [flats, setFlats] = useState<Flat[]>(buildFlats);
  const [corpus, setCorpus] = useState(3);
  const [picked, setPicked] = useState<Set<string>>(() => new Set());
  const [status, setStatus] = useState("");
  const [price, setPrice] = useState("");
  const [plan, setPlan] = useState("");
  const [view, setView] = useState("");
  const [note, setNote] = useState<string | null>(null);

  const canImport = useAddon("import");

  const inCorpus = flats.filter((flat) => flat.corpus === corpus);
  const counts = countByStatus(inCorpus);
  const floors = [...new Set(inCorpus.map((flat) => flat.floor))].sort((a, b) => b - a);
  const chosen = inCorpus.filter((flat) => picked.has(flat.id));
  const only = chosen.length === 1 ? chosen[0] : null;

  const patch = (ids: Set<string>, change: (flat: Flat) => Flat) => {
    setFlats((all) => all.map((flat) => (ids.has(flat.id) ? change(flat) : flat)));
  };

  const toggleFlat = (id: string) => {
    setPicked((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleFloor = (floor: number) => {
    const ids = inCorpus.filter((flat) => flat.floor === floor).map((flat) => flat.id);
    const allPicked = ids.every((id) => picked.has(id));
    setPicked((current) => {
      const next = new Set(current);
      for (const id of ids) {
        if (allPicked) next.delete(id);
        else next.add(id);
      }
      return next;
    });
  };

  const apply = () => {
    const priceValue = Number(price.replace(/\D/g, ""));
    const changed: string[] = [];
    if (status) changed.push(`статус «${statusLabel[status as FlatStatus]}»`);
    if (priceValue) changed.push(`цена ${fmt(priceValue)} сум`);
    if (plan) changed.push("планировка");
    if (view) changed.push("вид из окон");
    if (!changed.length || !chosen.length) return;

    patch(picked, (flat) => ({
      ...flat,
      status: status ? (status as FlatStatus) : flat.status,
      priceM2: priceValue || flat.priceM2,
      plan: plan || flat.plan,
      view: view || flat.view,
    }));
    setNote(`Изменено квартир: ${chosen.length} · ${changed.join(", ")}`);
    setStatus("");
    setPrice("");
    setPlan("");
    setView("");
  };

  /** Поднять цену: выделенным, а если ничего не выделено — всему корпусу. */
  const bump = (percent: number) => {
    const target = chosen.length ? picked : new Set(inCorpus.map((flat) => flat.id));
    patch(target, (flat) => ({ ...flat, priceM2: Math.round((flat.priceM2 * (100 + percent)) / 100 / 1000) * 1000 }));
    setNote(
      `Цена ${percent > 0 ? "поднята" : "снижена"} на ${Math.abs(percent)}% · квартир: ${target.size}`,
    );
  };

  const addFlat = () => {
    const top = Math.max(...inCorpus.map((flat) => flat.floor));
    const slot = inCorpus.filter((flat) => flat.floor === top).length + 1;
    const sample = inCorpus[inCorpus.length - 1];
    const created: Flat = {
      ...sample,
      id: `k${corpus}-${top}-${slot}-new`,
      floor: top,
      slot,
      no: Math.max(...inCorpus.map((flat) => flat.no)) + 1,
      status: "free",
    };
    setFlats((all) => [...all, created]);
    setPicked(new Set([created.id]));
    setNote(`Добавлена квартира №${created.no} на ${top} этаже — статус «Свободна»`);
  };

  /** Допник «Импорт из Excel»: прайс применяется одной кнопкой. */
  const applyImport = () => {
    const free = inCorpus.filter((flat) => flat.status === "free");
    const ids = new Set(free.map((flat) => flat.id));
    patch(ids, (flat) => ({ ...flat, priceM2: Math.round((flat.priceM2 * 103) / 100 / 1000) * 1000 }));
    const toBook = new Set(free.slice(0, 3).map((flat) => flat.id));
    patch(toBook, (flat) => ({ ...flat, status: "booked" }));
    setNote(`Прайс применён: ${free.length} цен обновлено, 3 квартиры переведены в бронь`);
  };

  return (
    <Chrome active="flats" badge={`Свободно ${counts.free}`}>
      <Title
        eyebrow={`ЖК «Чинор» / Корпус ${corpus}`}
        title="Корпуса и квартиры"
        action={canImport ? "Импорт из Excel" : "+ Квартира"}
        onAction={canImport ? applyImport : addFlat}
      />

      {/* Допник «Импорт из Excel»: прайс загружается файлом, изменения видны до применения. */}
      <Addon id="import" compact className="mt-[0.9em]">
        <Card className="flex flex-wrap items-center gap-[0.8em] border-forest-700/30 bg-forest-700/5">
          <span className="flex h-[2em] w-[2em] shrink-0 items-center justify-center rounded-[0.4em] bg-forest-700 text-[0.5em] font-semibold text-sand-50">
            XLSX
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[0.55em] font-medium">
              chinor-korpus-{corpus}.xlsx · {inCorpus.length} строк
            </span>
            <span className="block text-[0.46em] text-ink-subtle">
              {counts.free} изменений цены · 3 новых статуса · 1 квартира не найдена в корпусе
            </span>
          </span>
          <ScreenButton tone="outline" onClick={applyImport}>
            Проверить и применить
          </ScreenButton>
        </Card>
      </Addon>

      <div className="mt-[0.9em] flex flex-wrap items-center gap-[0.4em]">
        {baseCorpuses.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setCorpus(item.id);
              setPicked(new Set());
              setNote(null);
            }}
            className={cn(
              "rounded-full px-[0.8em] py-[0.32em] text-[0.48em] transition-colors",
              item.id === corpus
                ? "bg-forest-800 text-sand-50"
                : "border border-forest-900/15 text-ink-subtle hover:border-forest-900/40",
            )}
          >
            Корпус {item.id}
          </button>
        ))}
        <span className="ml-auto text-[0.48em] text-ink-subtle">
          Выбрано: {chosen.length} {chosen.length === 1 ? "квартира" : "квартир"}
          {chosen.length ? (
            <button
              type="button"
              onClick={() => setPicked(new Set())}
              className="ml-[0.6em] underline decoration-dotted underline-offset-2 hover:text-forest-800"
            >
              снять
            </button>
          ) : null}
        </span>
      </div>

      <div className="mt-[0.7em] grid gap-[0.6em] @min-[40rem]:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-[0.55em] font-medium">Шахматка</p>
            <span className="text-[0.44em] text-ink-subtle">
              Клик — выделить квартиру, клик по этажу — весь этаж
            </span>
          </div>

          <div className="mt-[0.6em] space-y-[0.22em]">
            {floors.map((floor) => (
              <div key={floor} className="flex items-center gap-[0.35em]">
                <button
                  type="button"
                  onClick={() => toggleFloor(floor)}
                  aria-label={`Выделить ${floor} этаж`}
                  className="w-[1.3em] shrink-0 rounded-[0.15em] text-right text-[0.42em] tabular-nums text-ink-subtle hover:bg-forest-900/8 hover:text-forest-900"
                >
                  {floor}
                </button>
                <div className="flex flex-1 gap-[0.22em]">
                  {inCorpus
                    .filter((flat) => flat.floor === floor)
                    .map((flat) => {
                      const on = picked.has(flat.id);
                      return (
                        <button
                          key={flat.id}
                          type="button"
                          aria-pressed={on}
                          aria-label={`Квартира ${flat.no}, ${flat.rooms}-комн., ${statusLabel[flat.status]}`}
                          title={`№${flat.no} · ${flat.rooms}-комн. ${area(flat.area)} м² · ${statusLabel[flat.status]} · ${fmt(flat.priceM2)} сум/м²`}
                          onClick={() => toggleFlat(flat.id)}
                          className={cn(
                            "h-[0.75em] flex-1 rounded-[0.12em] transition-transform hover:scale-y-125",
                            statusTone[flat.status],
                            on ? "outline outline-[0.1em] outline-offset-[0.06em] outline-forest-900" : "",
                          )}
                        />
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-[0.6em] flex flex-wrap items-center gap-[0.7em] border-t border-forest-900/8 pt-[0.5em] text-[0.42em] text-ink-subtle">
            {(["free", "booked", "sold"] as FlatStatus[]).map((state) => (
              <span key={state} className="flex items-center gap-[0.3em]">
                <span className={cn("h-[0.35em] w-[0.5em] rounded-[0.1em]", statusTone[state])} />
                {statusLabel[state]} · {counts[state]}
              </span>
            ))}
            <span className="ml-auto tabular-nums">Всего {inCorpus.length}</span>
          </div>
        </Card>

        <Card>
          <p className="text-[0.55em] font-medium">Изменить выбранные</p>

          {only ? (
            <p className="mt-[0.3em] text-[0.44em] leading-[1.5] text-ink-subtle">
              №{only.no} · {only.floor} этаж · {only.rooms}-комн. {area(only.area)} м² ·{" "}
              {fmt(only.priceM2)} сум/м² · {fmt(only.priceM2 * only.area)} сум
            </p>
          ) : (
            <p className="mt-[0.3em] text-[0.44em] leading-[1.5] text-ink-subtle">
              {chosen.length ? `Выбрано ${chosen.length} — изменения применятся ко всем` : "Выделите квартиры на шахматке"}
            </p>
          )}

          <div className="mt-[0.5em] space-y-[0.5em]">
            <SelectField
              label="Статус"
              value={status}
              onChange={setStatus}
              options={[
                { value: "", label: "— не менять" },
                ...(["free", "booked", "sold"] as FlatStatus[]).map((state) => ({
                  value: state,
                  label: statusLabel[state],
                })),
              ]}
            />
            <TextField
              label="Цена за м²"
              value={price}
              onChange={setPrice}
              placeholder={only ? `${fmt(only.priceM2)} сум` : "— не менять"}
            />
            <SelectField
              label="Планировка"
              value={plan}
              onChange={setPlan}
              options={[{ value: "", label: "— не менять" }, ...plans.map((item) => ({ value: item, label: item }))]}
            />
            <SelectField
              label="Вид из окон"
              value={view}
              onChange={setView}
              options={[{ value: "", label: "— не менять" }, ...views.map((item) => ({ value: item, label: item }))]}
            />
          </div>

          <ScreenButton
            onClick={apply}
            disabled={!chosen.length}
            className="mt-[0.8em] block w-full"
          >
            Применить к {chosen.length} квартирам
          </ScreenButton>

          <div className="mt-[0.6em] flex flex-wrap items-center gap-[0.4em] border-t border-forest-900/8 pt-[0.5em]">
            <span className="text-[0.44em] text-ink-subtle">Цена {chosen.length ? "выбранных" : "по корпусу"}:</span>
            <ScreenButton tone="outline" onClick={() => bump(3)}>
              +3%
            </ScreenButton>
            <ScreenButton tone="outline" onClick={() => bump(-3)}>
              −3%
            </ScreenButton>
          </div>

          <Note text={note} />
        </Card>
      </div>
    </Chrome>
  );
}

/* ------------------------------------------------------------------ */
/* Карточка ЖК                                                         */
/* ------------------------------------------------------------------ */

type Lang = "RU" | "EN" | "UZ";

export function ProjectFormScreen() {
  const [lang, setLang] = useState<Lang>("RU");
  const [text, setText] = useState<Record<Lang, { name: string; desc: string }>>({
    RU: {
      name: "ЖК «Чинор»",
      desc: "Квартал на 1 248 квартир в Мирзо-Улугбекском районе: пять корпусов, закрытый двор и школа на территории.",
    },
    EN: { name: "Chinor Residence", desc: "" },
    UZ: { name: "", desc: "" },
  });
  const [rows, setRows] = useState<Corpus[]>(baseCorpuses);
  const [published, setPublished] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 2200);
    return () => clearTimeout(timer);
  }, [saved]);

  const current = text[lang];
  const totalFlats = rows.reduce((sum, row) => sum + row.floors * row.perFloor, 0);
  const slug = slugify(text.RU.name) || "proekt";
  const filled = (code: Lang) => Boolean(text[code].name.trim() && text[code].desc.trim());

  const setCurrent = (patch: Partial<{ name: string; desc: string }>) => {
    setText((all) => ({ ...all, [lang]: { ...all[lang], ...patch } }));
  };

  const setRow = (id: number, patch: Partial<Corpus>) => {
    setRows((all) => all.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const addRow = () => {
    const id = Math.max(0, ...rows.map((row) => row.id)) + 1;
    setRows((all) => [...all, { id, floors: 9, perFloor: 12, due: "Срок не задан", state: "Строится" }]);
  };

  return (
    <Chrome active="project-form">
      <Title
        eyebrow="Каталог / Жилые комплексы"
        title={text.RU.name || "Новый проект"}
        action={saved ? "Сохранено ✓" : "Сохранить"}
        onAction={() => setSaved(true)}
      />

      <div className="mt-[0.9em] grid gap-[0.7em] @min-[40rem]:grid-cols-[1.7fr_1fr]">
        <div className="space-y-[0.7em]">
          <Card>
            <div className="flex items-center justify-between">
              <p className="text-[0.55em] font-medium">Основное</p>
              <span className="flex gap-[0.2em]">
                {(["RU", "EN", "UZ"] as Lang[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    aria-pressed={code === lang}
                    onClick={() => setLang(code)}
                    className={cn(
                      "flex items-center gap-[0.25em] rounded-[0.3em] px-[0.45em] py-[0.18em] text-[0.45em] font-medium transition-colors",
                      code === lang ? "bg-forest-800 text-sand-50" : "text-forest-800/70 hover:bg-forest-900/8",
                    )}
                  >
                    {code}
                    <span
                      className={cn(
                        "h-[0.28em] w-[0.28em] rounded-full",
                        filled(code) ? "bg-forest-500" : "bg-harvest-400",
                      )}
                    />
                  </button>
                ))}
              </span>
            </div>

            <div className="mt-[0.7em] space-y-[0.6em]">
              <TextField
                label="Название"
                value={current.name}
                onChange={(value) => setCurrent({ name: value })}
                placeholder={`Название на ${lang}`}
              />
              <TextField
                label="Описание"
                multiline
                value={current.desc}
                onChange={(value) => setCurrent({ desc: value })}
                placeholder={`Текст на ${lang}`}
              />
              <p className="text-[0.44em] leading-[1.5] text-ink-subtle">
                Точка у языка горит жёлтым, пока перевод не заполнен. Сейчас пусто:{" "}
                {(["RU", "EN", "UZ"] as Lang[]).filter((code) => !filled(code)).join(", ") || "нигде"}.
              </p>
            </div>
          </Card>

          {/* Корпуса — то, чего нет в админке сайта-визитки. */}
          <Card>
            <div className="flex items-center justify-between">
              <p className="text-[0.55em] font-medium">Корпуса</p>
              <ScreenButton tone="outline" onClick={addRow}>
                + Добавить корпус
              </ScreenButton>
            </div>
            <div className="mt-[0.6em] overflow-hidden rounded-[0.4em] border border-forest-900/10">
              <div className="grid grid-cols-[0.5fr_0.8fr_0.8fr_1.2fr_1fr_0.4fr] gap-[0.5em] border-b border-forest-900/10 bg-forest-900/4 px-[0.7em] py-[0.35em] text-[0.42em] uppercase tracking-[0.1em] text-ink-subtle">
                <span>№</span>
                <span>Этажей</span>
                <span>Квартир</span>
                <span>Срок сдачи</span>
                <span>Статус</span>
                <span />
              </div>
              {rows.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[0.5fr_0.8fr_0.8fr_1.2fr_1fr_0.4fr] items-center gap-[0.5em] border-b border-forest-900/6 px-[0.7em] py-[0.32em] text-[0.5em] last:border-b-0"
                >
                  <span className="tabular-nums">{row.id}</span>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={row.floors}
                    aria-label={`Этажей в корпусе ${row.id}`}
                    onChange={(event) =>
                      setRow(row.id, { floors: Math.max(1, Math.min(40, Number(event.target.value) || 1)) })
                    }
                    className="w-full rounded-[0.3em] border border-transparent bg-transparent py-[0.1em] tabular-nums outline-none hover:border-forest-900/15 focus:border-forest-700"
                  />
                  <span className="tabular-nums text-ink-subtle">{row.floors * row.perFloor}</span>
                  <input
                    type="text"
                    value={row.due}
                    aria-label={`Срок сдачи корпуса ${row.id}`}
                    onChange={(event) => setRow(row.id, { due: event.target.value })}
                    className="w-full rounded-[0.3em] border border-transparent bg-transparent py-[0.1em] outline-none hover:border-forest-900/15 focus:border-forest-700"
                  />
                  <RowSelect
                    label={`Статус корпуса ${row.id}`}
                    value={row.state}
                    options={["Сдан", "Продаётся", "Строится"]}
                    onChange={(value) => setRow(row.id, { state: value as Corpus["state"] })}
                    className="text-ink-subtle"
                  />
                  <button
                    type="button"
                    aria-label={`Удалить корпус ${row.id}`}
                    onClick={() => setRows((all) => all.filter((item) => item.id !== row.id))}
                    className="justify-self-end rounded-full px-[0.4em] text-ink-subtle hover:bg-forest-900/8 hover:text-forest-900"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <p className="text-[0.55em] font-medium">Характеристики</p>
            <div className="mt-[0.6em] grid grid-cols-3 gap-[0.5em]">
              {[
                ["Площадь", "84 600 м²"],
                ["Этажность", rows.length ? `${Math.min(...rows.map((r) => r.floors))}–${Math.max(...rows.map((r) => r.floors))}` : "—"],
                ["Квартир", fmt(totalFlats)],
                ["Паркинг", "подземный"],
                ["Отделка", "3 варианта"],
                ["Корпусов", String(rows.length)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[0.4em] border border-forest-900/12 px-[0.6em] py-[0.4em]">
                  <span className="block text-[0.42em] uppercase tracking-[0.1em] text-ink-subtle">{label}</span>
                  <span className="mt-[0.1em] block text-[0.5em] tabular-nums">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-[0.7em]">
          <Card>
            <p className="text-[0.55em] font-medium">Публикация</p>
            <div className="mt-[0.5em] flex items-center gap-[0.4em]">
              <Switch checked={published} onChange={setPublished} label="Опубликован" />
              <span className="text-[0.5em] text-ink-subtle">
                {published ? "Опубликован" : "Черновик — виден только в панели"}
              </span>
            </div>
            <p className="mt-[0.5em] text-[0.45em] leading-[1.5] text-ink-subtle">
              Адрес: /projects/{slug} — составлен из названия, кириллица
              транслитерирована.
            </p>
          </Card>

          <Card className="border-dashed text-center">
            <p className="text-[0.52em] font-medium">Фотографии и рендеры</p>
            <p className="mt-[0.25em] text-[0.44em] text-ink-subtle">
              Перетащите файлы или выберите из медиатеки
            </p>
            <div className="mt-[0.6em] grid grid-cols-3 gap-[0.3em]">
              {[0, 1, 2, 3, 4, 5].map((tile) => (
                <span key={tile} className="block h-[1.6em] rounded-[0.25em] bg-forest-900/10" />
              ))}
            </div>
          </Card>

          <Card>
            <p className="text-[0.55em] font-medium">Планировки</p>
            <p className="mt-[0.25em] text-[0.44em] text-ink-subtle">
              Загружаются PDF или PNG, привязываются к типу квартиры
            </p>
            <div className="mt-[0.5em] space-y-[0.3em]">
              {plans.map((plan) => (
                <div
                  key={plan}
                  className="flex items-center justify-between rounded-[0.35em] border border-forest-900/12 px-[0.5em] py-[0.32em] text-[0.46em]"
                >
                  <span>{plan}</span>
                  <span className="text-forest-600">PDF ✓</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Chrome>
  );
}

/* ------------------------------------------------------------------ */
/* Заявки                                                              */
/* ------------------------------------------------------------------ */

export function LeadsScreen() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [filter, setFilter] = useState<LeadState | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const crm = useAddon("crm");

  const countOf = (state: LeadState) => leads.filter((lead) => lead.state === state).length;
  const shown = filter ? leads.filter((lead) => lead.state === filter) : leads;
  const waiting = leads.filter((lead) => !lead.synced).length;

  const setLead = (id: string, patch: Partial<Lead>) => {
    setLeads((all) => all.map((lead) => (lead.id === id ? { ...lead, ...patch } : lead)));
  };

  const columns = crm
    ? "grid-cols-[1fr_1fr_1.6fr_0.9fr_1fr_0.8fr]"
    : "grid-cols-[1fr_1fr_1.6fr_0.9fr_1fr]";

  return (
    <Chrome active="leads" badge={`${countOf("Новая")} новые заявки`}>
      <Title
        eyebrow="Продажи"
        title="Заявки"
        action={crm ? "Настройки amoCRM" : "Выгрузить в CSV"}
        onAction={() =>
          setNote(
            crm
              ? "Воронка «Продажи квартир» · менеджер назначается по очереди"
              : `Файл собран: ${shown.length} строк, колонки — дата, имя, источник, статус`,
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
              setLeads((all) => all.map((lead) => ({ ...lead, synced: true })));
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
            <span>{lead.name}</span>
            <span className="truncate text-ink-subtle">{lead.source}</span>
            <RowSelect
              label={`Менеджер заявки ${lead.name}`}
              value={lead.owner}
              options={managers}
              onChange={(value) => setLead(lead.id, { owner: value })}
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
                  setLead(lead.id, { state: value as LeadState, synced: false });
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
          <p className="px-[0.9em] py-[0.8em] text-[0.48em] text-ink-subtle">
            В этом статусе заявок нет.
          </p>
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
