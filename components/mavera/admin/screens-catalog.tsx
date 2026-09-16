"use client";

import { useEffect, useState } from "react";

import { Addon, useAddon } from "@/components/configurator/context";
import {
  area,
  corpusStates,
  countByStatus,
  fmt,
  langs,
  plural,
  mediaKinds,
  plans,
  segments,
  slugify,
  statusLabel,
  statusTone,
  views,
  type Corpus,
  type Flat,
  type FlatStatus,
  type Lang,
  type MediaKind,
} from "@/components/mavera/admin/model";
import { useAdmin } from "@/components/mavera/admin/store";
import {
  Card,
  Chrome,
  Note,
  RowSelect,
  ScreenButton,
  SelectField,
  Switch,
  TextField,
  Title,
} from "@/components/mavera/admin/ui";
import { cn } from "@/lib/cn";

/**
 * Каталог: жилые комплексы, карточка ЖК, корпуса с квартирами и медиатека.
 *
 * Экраны связаны между собой через общее состояние: проект, открытый из
 * списка, становится текущим в карточке и в шахматке, а любая правка уходит
 * в журнал действий и оттуда откатывается.
 */

/* ------------------------------------------------------------------ */
/* Жилые комплексы                                                     */
/* ------------------------------------------------------------------ */

export function ProjectsScreen() {
  const admin = useAdmin();
  const [note, setNote] = useState<string | null>(null);

  const rows = [...admin.projects].sort((a, b) => a.order - b.order);

  return (
    <Chrome active="projects" badge={plural(admin.projects.length, ["проект", "проекта", "проектов"])}>
      <Title
        eyebrow="Каталог"
        title="Жилые комплексы"
        action="+ Проект"
        onAction={() => admin.addProject()}
      />

      <div className="mt-[0.9em] overflow-hidden rounded-[0.5em] border border-forest-900/10 bg-white">
        <div className="grid grid-cols-[0.5fr_2fr_1.2fr_1fr_1fr_1fr_1.4fr] gap-[0.5em] border-b border-forest-900/10 bg-forest-900/4 px-[0.9em] py-[0.4em] text-[0.42em] uppercase tracking-[0.1em] text-ink-subtle">
          <span>№</span>
          <span>Название</span>
          <span>Район</span>
          <span>Сегмент</span>
          <span>Квартир</span>
          <span>Свободно</span>
          <span>На сайте</span>
        </div>

        {rows.map((project) => {
          const flats = admin.flatsOf(project.id);
          const counts = countByStatus(flats);
          return (
            <div
              key={project.id}
              className="grid grid-cols-[0.5fr_2fr_1.2fr_1fr_1fr_1fr_1.4fr] items-center gap-[0.5em] border-b border-forest-900/6 px-[0.9em] py-[0.42em] text-[0.5em] last:border-b-0"
            >
              <input
                type="number"
                min={1}
                max={99}
                aria-label={`Порядок ${project.name.RU}`}
                value={project.order}
                onChange={(event) =>
                  admin.patchProject(project.id, { order: Number(event.target.value) || 1 })
                }
                className="w-full rounded-[0.3em] border border-transparent bg-transparent py-[0.1em] tabular-nums outline-none hover:border-forest-900/15 focus:border-forest-700"
              />
              <button
                type="button"
                onClick={() => admin.openProject(project.id)}
                className="truncate text-left font-medium underline decoration-dotted underline-offset-2 hover:text-forest-700"
              >
                {project.name.RU}
              </button>
              <span className="truncate text-ink-subtle">{project.district}</span>
              <RowSelect
                label={`Сегмент ${project.name.RU}`}
                value={project.segment}
                options={segments}
                onChange={(value) =>
                  admin.patchProject(project.id, { segment: value as typeof project.segment })
                }
                className="text-ink-subtle"
              />
              <span className="tabular-nums">{fmt(flats.length)}</span>
              <span className="tabular-nums text-forest-700">{fmt(counts.free)}</span>
              <span className="flex items-center gap-[0.4em]">
                <Switch
                  checked={project.published}
                  label={`Публикация ${project.name.RU}`}
                  onChange={(next) =>
                    admin.patchProject(
                      project.id,
                      { published: next },
                      next ? "Опубликован" : "Снят с публикации",
                    )
                  }
                />
                <span className="text-[0.85em] text-ink-subtle">
                  {project.published ? "виден" : "черновик"}
                </span>
                <button
                  type="button"
                  aria-label={`Удалить ${project.name.RU}`}
                  onClick={() => {
                    admin.removeProject(project.id);
                    setNote(`Проект «${project.name.RU}» удалён вместе с квартирами`);
                  }}
                  className="ml-auto rounded-full px-[0.35em] text-ink-subtle hover:bg-forest-900/8 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            </div>
          );
        })}
      </div>

      <Note text={note} />

      <p className="mt-[0.6em] text-[0.46em] leading-[1.6] text-ink-subtle">
        Порядок задаётся числом — так проект поднимают на главной, не трогая
        вёрстку. Черновик виден только в панели: адрес уже работает, поиск его
        не индексирует.
      </p>
    </Chrome>
  );
}

/* ------------------------------------------------------------------ */
/* Карточка ЖК                                                         */
/* ------------------------------------------------------------------ */

export function ProjectFormScreen() {
  const admin = useAdmin();
  const project = admin.project;
  const [lang, setLang] = useState<Lang>("RU");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 2200);
    return () => clearTimeout(timer);
  }, [saved]);

  if (!project) {
    return (
      <Chrome active="project-form">
        <Title eyebrow="Каталог" title="Проект не выбран" />
        <p className="mt-[0.8em] text-[0.5em] text-ink-subtle">
          Откройте жилой комплекс из списка — или заведите новый.
        </p>
      </Chrome>
    );
  }

  const flats = admin.flatsOf(project.id);
  const filled = (code: Lang) => Boolean(project.name[code].trim() && project.desc[code].trim());
  const slug = slugify(project.name.RU) || "proekt";
  const empty = langs.filter((code) => !filled(code));

  const setCorpus = (id: number, patch: Partial<Corpus>) => {
    admin.setCorpuses(
      project.id,
      project.corpuses.map((row) => (row.id === id ? { ...row, ...patch } : row)),
      `Корпус ${id}: ${Object.keys(patch).includes("floors") ? "этажность" : Object.keys(patch).includes("state") ? "статус" : "срок сдачи"} изменён`,
    );
  };

  return (
    <Chrome active="project-form" badge={project.published ? "Опубликован" : "Черновик"}>
      <Title
        eyebrow="Каталог / Жилые комплексы"
        title={project.name.RU || "Новый проект"}
        secondary="К списку"
        onSecondary={() => admin.setScreen("projects")}
        action={saved ? "Сохранено ✓" : "Сохранить"}
        onAction={() => {
          setSaved(true);
          admin.patchProject(project.id, {}, "Карточка сохранена");
        }}
      />

      <div className="mt-[0.9em] grid gap-[0.7em] @min-[40rem]:grid-cols-[1.7fr_1fr]">
        <div className="space-y-[0.7em]">
          <Card>
            <div className="flex items-center justify-between">
              <p className="text-[0.55em] font-medium">Основное</p>
              <span className="flex gap-[0.2em]">
                {langs.map((code) => (
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
                value={project.name[lang]}
                onChange={(value) =>
                  admin.patchProject(project.id, { name: { ...project.name, [lang]: value } })
                }
                placeholder={`Название на ${lang}`}
              />
              <TextField
                label="Описание"
                multiline
                value={project.desc[lang]}
                onChange={(value) =>
                  admin.patchProject(project.id, { desc: { ...project.desc, [lang]: value } })
                }
                placeholder={`Текст на ${lang}`}
              />
              <div className="grid grid-cols-2 gap-[0.5em]">
                <TextField
                  label="Район"
                  value={project.district}
                  onChange={(value) => admin.patchProject(project.id, { district: value })}
                />
                <SelectField
                  label="Сегмент"
                  value={project.segment}
                  options={segments.map((item) => ({ value: item, label: item }))}
                  onChange={(value) =>
                    admin.patchProject(project.id, { segment: value as typeof project.segment })
                  }
                />
              </div>
              <p className="text-[0.44em] leading-[1.5] text-ink-subtle">
                Точка у языка горит жёлтым, пока перевод не заполнен. Сейчас пусто:{" "}
                {empty.length ? empty.join(", ") : "нигде"}.
              </p>
            </div>
          </Card>

          {/* Корпуса — то, чего нет в админке сайта-визитки. */}
          <Card>
            <div className="flex items-center justify-between">
              <p className="text-[0.55em] font-medium">Корпуса</p>
              <ScreenButton
                tone="outline"
                onClick={() =>
                  admin.setCorpuses(
                    project.id,
                    [
                      ...project.corpuses,
                      {
                        id: Math.max(0, ...project.corpuses.map((row) => row.id)) + 1,
                        floors: 9,
                        perFloor: 12,
                        due: "Срок не задан",
                        state: "Строится",
                      },
                    ],
                    "Добавлен корпус",
                  )
                }
              >
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
              {project.corpuses.map((row) => (
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
                      setCorpus(row.id, {
                        floors: Math.max(1, Math.min(40, Number(event.target.value) || 1)),
                      })
                    }
                    className="w-full rounded-[0.3em] border border-transparent bg-transparent py-[0.1em] tabular-nums outline-none hover:border-forest-900/15 focus:border-forest-700"
                  />
                  <span className="tabular-nums text-ink-subtle">{row.floors * row.perFloor}</span>
                  <input
                    type="text"
                    value={row.due}
                    aria-label={`Срок сдачи корпуса ${row.id}`}
                    onChange={(event) => setCorpus(row.id, { due: event.target.value })}
                    className="w-full rounded-[0.3em] border border-transparent bg-transparent py-[0.1em] outline-none hover:border-forest-900/15 focus:border-forest-700"
                  />
                  <RowSelect
                    label={`Статус корпуса ${row.id}`}
                    value={row.state}
                    options={corpusStates}
                    onChange={(value) => setCorpus(row.id, { state: value as Corpus["state"] })}
                    className="text-ink-subtle"
                  />
                  <button
                    type="button"
                    aria-label={`Удалить корпус ${row.id}`}
                    onClick={() =>
                      admin.setCorpuses(
                        project.id,
                        project.corpuses.filter((item) => item.id !== row.id),
                        `Корпус ${row.id} удалён`,
                      )
                    }
                    className="justify-self-end rounded-full px-[0.4em] text-ink-subtle hover:bg-forest-900/8 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <ScreenButton
              tone="outline"
              className="mt-[0.6em]"
              onClick={() => admin.setScreen("flats")}
            >
              Открыть шахматку →
            </ScreenButton>
          </Card>

          <Card>
            <p className="text-[0.55em] font-medium">Характеристики</p>
            <div className="mt-[0.6em] grid grid-cols-3 gap-[0.5em]">
              {[
                ["Корпусов", String(project.corpuses.length)],
                [
                  "Этажность",
                  project.corpuses.length
                    ? `${Math.min(...project.corpuses.map((r) => r.floors))}–${Math.max(...project.corpuses.map((r) => r.floors))}`
                    : "—",
                ],
                ["Квартир", fmt(flats.length)],
                ["Свободно", fmt(countByStatus(flats).free)],
                ["Отделка", "3 варианта"],
                ["Паркинг", "подземный"],
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
              <Switch
                checked={project.published}
                label="Опубликован"
                onChange={(next) =>
                  admin.patchProject(
                    project.id,
                    { published: next },
                    next ? "Опубликован" : "Снят с публикации",
                  )
                }
              />
              <span className="text-[0.5em] text-ink-subtle">
                {project.published ? "Опубликован" : "Черновик — виден только в панели"}
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
              {admin.media.slice(0, 6).map((file) => (
                <span
                  key={file.id}
                  title={file.name}
                  className="block h-[1.6em] rounded-[0.25em] bg-forest-900/10"
                />
              ))}
            </div>
            <ScreenButton tone="outline" className="mt-[0.6em]" onClick={() => admin.setScreen("media")}>
              Открыть медиатеку
            </ScreenButton>
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
/* Корпуса и квартиры                                                  */
/* ------------------------------------------------------------------ */

export function FlatsScreen() {
  const admin = useAdmin();
  const project = admin.project;
  const [corpusId, setCorpusId] = useState(1);
  const [picked, setPicked] = useState<Set<string>>(() => new Set());
  const [status, setStatus] = useState("");
  const [price, setPrice] = useState("");
  const [plan, setPlan] = useState("");
  const [view, setView] = useState("");
  const [note, setNote] = useState<string | null>(null);

  const canImport = useAddon("import");

  const all = project ? admin.flatsOf(project.id) : [];
  const corpus = project?.corpuses.find((item) => item.id === corpusId) ?? project?.corpuses[0];
  const inCorpus = all.filter((flat) => flat.corpus === (corpus?.id ?? 0));
  const counts = countByStatus(inCorpus);
  const floors = [...new Set(inCorpus.map((flat) => flat.floor))].sort((a, b) => b - a);
  const chosen = inCorpus.filter((flat) => picked.has(flat.id));
  const only = chosen.length === 1 ? chosen[0] : null;
  const where = `${project?.name.RU ?? ""}, корпус ${corpus?.id ?? ""}`;

  if (!project || !corpus) {
    return (
      <Chrome active="flats">
        <Title eyebrow="Каталог" title="Корпуса и квартиры" />
        <p className="mt-[0.8em] text-[0.5em] text-ink-subtle">
          У проекта нет корпусов — добавьте их в карточке ЖК.
        </p>
      </Chrome>
    );
  }

  const apply = () => {
    const priceValue = Number(price.replace(/\D/g, ""));
    const changed: string[] = [];
    if (status) changed.push(`статус «${statusLabel[status as FlatStatus]}»`);
    if (priceValue) changed.push(`цена ${fmt(priceValue)} сум`);
    if (plan) changed.push("планировка");
    if (view) changed.push("вид из окон");
    if (!changed.length || !chosen.length) return;

    admin.patchFlats(
      picked,
      (flat) => ({
        ...flat,
        status: status ? (status as FlatStatus) : flat.status,
        priceM2: priceValue || flat.priceM2,
        plan: plan || flat.plan,
        view: view || flat.view,
      }),
      `${changed.join(", ")} · квартир: ${chosen.length}`,
      where,
    );
    setNote(`Изменено квартир: ${chosen.length} · ${changed.join(", ")}`);
    setStatus("");
    setPrice("");
    setPlan("");
    setView("");
  };

  /** Поднять цену: выделенным, а если ничего не выделено — всему корпусу. */
  const bump = (percent: number) => {
    const target = chosen.length ? picked : new Set(inCorpus.map((flat) => flat.id));
    admin.patchFlats(
      target,
      (flat) => ({ ...flat, priceM2: Math.round((flat.priceM2 * (100 + percent)) / 100 / 1000) * 1000 }),
      `Цена ${percent > 0 ? "поднята" : "снижена"} на ${Math.abs(percent)}% · квартир: ${target.size}`,
      where,
    );
    setNote(`Цена ${percent > 0 ? "поднята" : "снижена"} на ${Math.abs(percent)}% · квартир: ${target.size}`);
  };

  const addFlat = () => {
    const top = Math.max(...inCorpus.map((flat) => flat.floor));
    const slot = inCorpus.filter((flat) => flat.floor === top).length + 1;
    const sample = inCorpus[inCorpus.length - 1];
    const created: Flat = {
      ...sample,
      id: `${project.id}-${corpus.id}-${top}-${slot}-new`,
      floor: top,
      slot,
      no: Math.max(...inCorpus.map((flat) => flat.no)) + 1,
      status: "free",
    };
    admin.addFlat(created);
    setPicked(new Set([created.id]));
    setNote(`Добавлена квартира №${created.no} на ${top} этаже — статус «Свободна»`);
  };

  /** Допник «Импорт из Excel»: прайс применяется одной кнопкой. */
  const applyImport = () => {
    const free = inCorpus.filter((flat) => flat.status === "free");
    admin.patchFlats(
      new Set(free.map((flat) => flat.id)),
      (flat) => ({
        ...flat,
        priceM2: Math.round((flat.priceM2 * 103) / 100 / 1000) * 1000,
        status: free.slice(0, 3).some((item) => item.id === flat.id) ? "booked" : flat.status,
      }),
      `Импорт прайса: ${free.length} цен, 3 брони`,
      where,
    );
    setNote(`Прайс применён: ${free.length} цен обновлено, 3 квартиры переведены в бронь`);
  };

  return (
    <Chrome active="flats" badge={`Свободно ${counts.free}`}>
      <Title
        eyebrow={`${project.name.RU} / Корпус ${corpus.id}`}
        title="Корпуса и квартиры"
        secondary="Карточка ЖК"
        onSecondary={() => admin.setScreen("project-form")}
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
              {project.id}-korpus-{corpus.id}.xlsx · {inCorpus.length} строк
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
        {project.corpuses.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setCorpusId(item.id);
              setPicked(new Set());
              setNote(null);
            }}
            className={cn(
              "rounded-full px-[0.8em] py-[0.32em] text-[0.48em] transition-colors",
              item.id === corpus.id
                ? "bg-forest-800 text-sand-50"
                : "border border-forest-900/15 text-ink-subtle hover:border-forest-900/40",
            )}
          >
            Корпус {item.id}
          </button>
        ))}
        <span className="ml-auto text-[0.48em] text-ink-subtle">
          Выбрано: {plural(chosen.length, ["квартира", "квартиры", "квартир"])}
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
                  onClick={() => {
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
                  }}
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
                          onClick={() =>
                            setPicked((current) => {
                              const next = new Set(current);
                              if (next.has(flat.id)) next.delete(flat.id);
                              else next.add(flat.id);
                              return next;
                            })
                          }
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
              {chosen.length
                ? `Выбрано ${chosen.length} — изменения применятся ко всем`
                : "Выделите квартиры на шахматке"}
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

          <ScreenButton onClick={apply} disabled={!chosen.length} className="mt-[0.8em] block w-full">
            Применить к {chosen.length} квартирам
          </ScreenButton>

          <div className="mt-[0.6em] flex flex-wrap items-center gap-[0.4em] border-t border-forest-900/8 pt-[0.5em]">
            <span className="text-[0.44em] text-ink-subtle">
              Цена {chosen.length ? "выбранных" : "по корпусу"}:
            </span>
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
/* Медиатека                                                           */
/* ------------------------------------------------------------------ */

export function MediaScreen() {
  const admin = useAdmin();
  const [kind, setKind] = useState<MediaKind | "Все">("Все");
  const [picked, setPicked] = useState<Set<string>>(() => new Set());
  const [note, setNote] = useState<string | null>(null);

  const shown = kind === "Все" ? admin.media : admin.media.filter((file) => file.kind === kind);
  const chosen = admin.media.filter((file) => picked.has(file.id));
  const busy = chosen.filter((file) => file.used > 0);

  return (
    <Chrome active="media" badge={plural(admin.media.length, ["файл", "файла", "файлов"])}>
      <Title
        eyebrow="Каталог"
        title="Медиатека"
        action="Загрузить файлы"
        onAction={() => {
          admin.addMedia(3);
          setNote("Загружено 3 файла — они уже доступны во всех карточках");
        }}
      />

      <div className="mt-[0.9em] flex flex-wrap items-center gap-[0.4em]">
        {(["Все", ...mediaKinds] as (MediaKind | "Все")[]).map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={item === kind}
            onClick={() => setKind(item)}
            className={cn(
              "rounded-full px-[0.8em] py-[0.32em] text-[0.48em] transition-colors",
              item === kind
                ? "bg-forest-800 text-sand-50"
                : "border border-forest-900/15 text-ink-subtle hover:border-forest-900/40",
            )}
          >
            {item}
          </button>
        ))}
        <span className="ml-auto flex items-center gap-[0.5em] text-[0.48em] text-ink-subtle">
          Выбрано: {plural(chosen.length, ["файл", "файла", "файлов"])}
          <ScreenButton
            tone="danger"
            disabled={!chosen.length || busy.length > 0}
            onClick={() => {
              admin.removeMedia([...picked]);
              setNote(`Удалено файлов: ${chosen.length}`);
              setPicked(new Set());
            }}
          >
            Удалить
          </ScreenButton>
        </span>
      </div>

      {busy.length ? (
        <p className="mt-[0.5em] text-[0.46em] text-harvest-800">
          {busy.length === 1 ? "Файл используется" : "Файлы используются"} в карточках:{" "}
          {busy.map((file) => file.name).join(", ")}. Сначала отвяжите, потом удаляйте.
        </p>
      ) : null}

      <div className="mt-[0.7em] grid grid-cols-2 gap-[0.5em] @min-[40rem]:grid-cols-4">
        {shown.map((file) => {
          const on = picked.has(file.id);
          return (
            <button
              key={file.id}
              type="button"
              aria-pressed={on}
              onClick={() =>
                setPicked((current) => {
                  const next = new Set(current);
                  if (next.has(file.id)) next.delete(file.id);
                  else next.add(file.id);
                  return next;
                })
              }
              className={cn(
                "overflow-hidden rounded-[0.4em] border bg-white text-left transition-colors",
                on ? "border-forest-800 ring-[0.08em] ring-forest-800/40" : "border-forest-900/12 hover:border-forest-900/30",
              )}
            >
              <span className="flex h-[3em] items-center justify-center bg-forest-900/8 text-[0.44em] text-ink-subtle">
                {file.kind}
              </span>
              <span className="block px-[0.6em] py-[0.4em]">
                <span className="block truncate text-[0.46em] font-medium">{file.name}</span>
                <span className="mt-[0.1em] block text-[0.42em] text-ink-subtle">
                  {file.size} · {file.used ? `в ${file.used} карточках` : "не используется"}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <p className="mt-[0.8em] text-[0.48em] text-ink-subtle">Файлов этого типа нет.</p>
      ) : null}

      <Note text={note} />

      <p className="mt-[0.6em] text-[0.46em] leading-[1.6] text-ink-subtle">
        Библиотека общая: файл загружается один раз и переиспользуется во всех
        карточках. Панель не даёт удалить то, что стоит на сайте.
      </p>
    </Chrome>
  );
}
