"use client";

import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";

import { useConfigurator } from "@/components/configurator/context";
import { adminSections, fmt, type AdminScreenId } from "@/components/mavera/admin/model";
import { useAdmin } from "@/components/mavera/admin/store";
import { cn } from "@/lib/cn";

export { adminSections, type AdminScreenId };

/**
 * Общие части панели: корпус окна, шапка экрана, карточка и поля.
 *
 * Корпус здесь настоящий, а не рамка вокруг картинки: боковое меню
 * переключает разделы, поиск в верхней полосе ищет по проектам, квартирам и
 * заявкам. Заказчик садится и работает так, как работал бы у себя.
 *
 * Все размеры в `em`: в рамке браузера кегль задан в единицах контейнера,
 * и панель целиком масштабируется под ширину кадра; на весь экран кегль
 * фиксированный (`appScale`), и та же разметка становится рабочим окном.
 */

/**
 * Масштаб панели на весь экран. Все размеры внутри в `em`, поэтому один
 * базовый кегль задаёт и текст, и отступы: на телефоне чуть плотнее.
 */
export const appScale = "text-[24px] sm:text-[26px]";

export function Chrome({
  active,
  badge,
  children,
}: {
  active: AdminScreenId;
  /** Счётчик в верхней полосе. Считается, а не написан. */
  badge?: string;
  children: React.ReactNode;
}) {
  const admin = useAdmin();
  const ctx = useConfigurator();
  const [menuOpen, setMenuOpen] = useState(false);
  const app = admin.app;
  const groups = [...new Set(adminSections.map((s) => s.group))];

  const pick = (id: AdminScreenId) => {
    admin.setScreen(id, ctx?.fresh?.at ?? 0);
    setMenuOpen(false);
  };

  const menu = (
    <>
      <div className="px-[1em] py-[1.1em]">
        <p className="text-[0.5em] font-semibold uppercase tracking-[0.18em] text-forest-600">MAVERA</p>
        <p className="mt-[0.2em] text-[0.62em] font-medium">Панель управления</p>
      </div>

      <nav className="flex-1 px-[0.6em] pb-[1em]">
        {groups.map((group) => (
          <div key={group} className="mb-[0.8em]">
            <p className="px-[0.7em] pb-[0.3em] text-[0.42em] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
              {group}
            </p>
            {adminSections
              .filter((s) => s.group === group)
              .map((section) => (
                <button
                  key={section.id}
                  type="button"
                  aria-current={section.id === active ? "page" : undefined}
                  onClick={() => pick(section.id)}
                  className={cn(
                    "mb-[0.12em] block w-full rounded-[0.4em] px-[0.7em] py-[0.42em] text-left text-[0.55em] transition-colors",
                    section.id === active
                      ? "bg-forest-800/10 font-medium text-forest-950"
                      : "text-forest-900/70 hover:bg-forest-900/5 hover:text-forest-950",
                  )}
                >
                  {section.label}
                </button>
              ))}
          </div>
        ))}
      </nav>

      <div className="border-t border-forest-900/10 px-[1em] py-[0.8em]">
        <p className="text-[0.5em] font-medium">Азиз Каримов</p>
        <p className="text-[0.45em] text-ink-subtle">Администратор</p>
        {app ? (
          <Link
            href={app.exitHref}
            prefetch={false}
            className="mt-[0.5em] inline-block text-[0.45em] font-medium text-forest-700 underline decoration-forest-700/40 underline-offset-2 transition-colors hover:text-forest-900"
          >
            Выйти → к презентации
          </Link>
        ) : null}
      </div>
    </>
  );

  return (
    <div className={cn("relative flex min-h-full bg-sand-100 text-forest-950", app && "min-h-screen")}>
      <aside
        className={cn(
          "hidden w-[11em] shrink-0 flex-col border-r border-forest-900/10 bg-white @min-[40rem]:flex",
          app &&
            "@min-[40rem]:sticky @min-[40rem]:top-0 @min-[40rem]:max-h-screen @min-[40rem]:self-start @min-[40rem]:overflow-y-auto",
        )}
      >
        {menu}
      </aside>

      <div className="min-w-0 flex-1">
        <TopBar badge={badge} onMenu={app ? () => setMenuOpen(true) : undefined} />
        <div className={cn("px-[1.4em] py-[1.2em]", app && "px-[0.8em] @min-[40rem]:px-[1.4em]")}>{children}</div>
      </div>

      {/*
        Шторка разделов на телефоне. Рисуется в корне документа: корпус
        панели — контейнер запросов, а он держит fixed-потомков внутри себя,
        и шторка уехала бы вместе с прокруткой.
      */}
      {app && menuOpen
        ? createPortal(
            <div
              role="dialog"
              aria-label="Разделы панели"
              className={cn("fixed inset-0 z-[70] flex text-forest-950", appScale)}
            >
              <div className="flex w-[13em] max-w-[85vw] flex-col overflow-y-auto bg-white shadow-2xl">{menu}</div>
              <button
                type="button"
                aria-label="Закрыть меню"
                onClick={() => setMenuOpen(false)}
                className="flex-1 bg-forest-950/45"
              />
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

/**
 * Верхняя полоса с поиском.
 *
 * Поиск ищет сразу по трём сущностям, потому что в панели застройщика
 * спрашивают именно так: «где там Чинор», «кто оставил заявку Азиз», «что с
 * сто двадцать четвёртой». Результат уводит на нужный экран.
 */
function TopBar({ badge, onMenu }: { badge?: string; onMenu?: () => void }) {
  const admin = useAdmin();
  const [open, setOpen] = useState(false);
  const query = admin.query.trim().toLowerCase();

  const projects = query
    ? admin.projects.filter((item) => item.name.RU.toLowerCase().includes(query)).slice(0, 3)
    : [];
  const leads = query
    ? admin.leads
        .filter((lead) => `${lead.name} ${lead.contact}`.toLowerCase().includes(query))
        .slice(0, 3)
    : [];
  const digits = query.replace(/\D/g, "");
  const flats = digits
    ? admin.flatsOf(admin.projectId).filter((flat) => String(flat.no) === digits).slice(0, 3)
    : [];
  const empty = query.length > 1 && !projects.length && !leads.length && !flats.length;

  const go = (screen: AdminScreenId) => {
    admin.setScreen(screen);
    admin.setQuery("");
    setOpen(false);
  };

  return (
    <div
      className={cn(
        "relative flex items-center gap-[0.6em] border-b border-forest-900/10 bg-white px-[0.8em] py-[0.7em] @min-[40rem]:gap-[0.8em] @min-[40rem]:px-[1.2em]",
        admin.app && "sticky top-0 z-30",
      )}
    >
      {onMenu ? (
        <button
          type="button"
          aria-label="Разделы панели"
          onClick={onMenu}
          className="flex h-[1.5em] w-[1.5em] shrink-0 flex-col items-center justify-center gap-[0.18em] rounded-[0.4em] bg-forest-900/5 @min-[40rem]:hidden"
        >
          <span className="block h-[0.09em] w-[0.75em] rounded-full bg-forest-900" />
          <span className="block h-[0.09em] w-[0.75em] rounded-full bg-forest-900" />
          <span className="block h-[0.09em] w-[0.75em] rounded-full bg-forest-900" />
        </button>
      ) : null}
      <input
        type="text"
        value={admin.query}
        aria-label="Поиск по проектам, квартирам и заявкам"
        placeholder="Поиск по проектам, квартирам и заявкам"
        onChange={(event) => {
          admin.setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="min-w-0 flex-1 rounded-[0.4em] bg-forest-900/5 px-[0.8em] py-[0.42em] text-[0.52em] text-forest-950 outline-none placeholder:text-ink-subtle focus:bg-forest-900/8"
      />
      <span className="shrink-0 rounded-full bg-harvest-100 px-[0.6em] py-[0.25em] text-[0.48em] font-medium text-harvest-800">
        {badge ?? "Панель"}
      </span>
      <span className="hidden h-[1.5em] w-[1.5em] shrink-0 rounded-full bg-forest-800 @min-[40rem]:block" />

      {open && query.length > 1 ? (
        <div className="absolute left-[0.8em] right-[0.8em] top-[2.6em] z-20 overflow-hidden rounded-[0.5em] border border-forest-900/12 bg-white shadow-lg @min-[40rem]:left-[1.2em] @min-[40rem]:right-auto @min-[40rem]:w-[22em]">
          {projects.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                admin.openProject(item.id);
                admin.setQuery("");
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-[0.6em] px-[0.8em] py-[0.45em] text-left text-[0.5em] hover:bg-forest-900/5"
            >
              <span>{item.name.RU}</span>
              <span className="text-[0.85em] text-ink-subtle">жилой комплекс</span>
            </button>
          ))}
          {flats.map((flat) => (
            <button
              key={flat.id}
              type="button"
              onClick={() => go("flats")}
              className="flex w-full items-center justify-between gap-[0.6em] px-[0.8em] py-[0.45em] text-left text-[0.5em] hover:bg-forest-900/5"
            >
              <span>
                Квартира №{flat.no} · корпус {flat.corpus}
              </span>
              <span className="text-[0.85em] text-ink-subtle">{fmt(flat.priceM2)} сум/м²</span>
            </button>
          ))}
          {leads.map((lead) => (
            <button
              key={lead.id}
              type="button"
              onClick={() => go("leads")}
              className="flex w-full items-center justify-between gap-[0.6em] px-[0.8em] py-[0.45em] text-left text-[0.5em] hover:bg-forest-900/5"
            >
              <span>{lead.name}</span>
              <span className="text-[0.85em] text-ink-subtle">заявка · {lead.state}</span>
            </button>
          ))}
          {empty ? (
            <p className="px-[0.8em] py-[0.5em] text-[0.48em] text-ink-subtle">Ничего не нашлось</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function Title({
  eyebrow,
  title,
  action,
  onAction,
  secondary,
  onSecondary,
}: {
  eyebrow?: string;
  title: string;
  action?: string;
  onAction?: () => void;
  secondary?: string;
  onSecondary?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-[1em] gap-y-[0.5em]">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[0.48em] uppercase tracking-[0.16em] text-ink-subtle">{eyebrow}</p>
        ) : null}
        <h1 className="mt-[0.2em] text-[1.05em] font-semibold">{title}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-[0.4em]">
        {secondary && onSecondary ? (
          <ScreenButton tone="outline" onClick={onSecondary}>
            {secondary}
          </ScreenButton>
        ) : null}
        {action ? (
          onAction ? (
            <button
              type="button"
              onClick={onAction}
              className="rounded-full bg-forest-800 px-[1em] py-[0.45em] text-[0.52em] font-medium text-sand-50 transition-opacity hover:opacity-90"
            >
              {action}
            </button>
          ) : (
            <span className="rounded-full bg-forest-800 px-[1em] py-[0.45em] text-[0.52em] font-medium text-sand-50">
              {action}
            </span>
          )
        ) : null}
      </div>
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-[0.5em] border border-forest-900/10 bg-white p-[1em]", className)}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Поля                                                                */
/* ------------------------------------------------------------------ */

const box =
  "mt-[0.3em] block w-full rounded-[0.4em] border border-forest-900/15 bg-white px-[0.7em] py-[0.45em] text-[0.52em] text-forest-950 outline-none focus:border-forest-700";

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[0.5em] font-medium text-forest-900">{label}</span>
      {multiline ? (
        <textarea
          aria-label={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={2}
          className={cn(box, "resize-none")}
        />
      ) : (
        <input
          type="text"
          aria-label={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={box}
        />
      )}
      {hint ? <span className="mt-[0.2em] block text-[0.42em] text-ink-subtle">{hint}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[0.5em] font-medium text-forest-900">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(box, "appearance-none")}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Компактный список внутри строки таблицы. */
export function RowSelect({
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

export function ScreenButton({
  children,
  onClick,
  tone = "solid",
  disabled = false,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone?: "solid" | "outline" | "danger";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full text-center font-medium transition-opacity",
        tone === "solid"
          ? "bg-forest-800 px-[1em] py-[0.45em] text-[0.5em] text-sand-50"
          : tone === "danger"
            ? "border border-red-500/40 px-[0.8em] py-[0.35em] text-[0.46em] text-red-700"
            : "border border-forest-900/15 px-[0.8em] py-[0.35em] text-[0.46em] text-forest-900",
        disabled ? "cursor-not-allowed opacity-40" : "hover:opacity-85",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex h-[0.8em] w-[1.4em] shrink-0 items-center rounded-full px-[0.12em] transition-colors",
        checked ? "bg-forest-700" : "bg-forest-900/20",
      )}
    >
      <span
        className={cn(
          "h-[0.5em] w-[0.5em] rounded-full bg-white transition-transform",
          checked ? "ml-auto" : "mr-auto",
        )}
      />
    </button>
  );
}

/** Галочка в матрице прав. */
export function Check({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "flex h-[0.9em] w-[0.9em] items-center justify-center rounded-[0.2em] border text-[0.5em] transition-colors",
        checked
          ? "border-forest-700 bg-forest-700 text-white"
          : "border-forest-900/25 bg-white text-transparent hover:border-forest-900/50",
      )}
    >
      ✓
    </button>
  );
}

/** Строка о том, что сейчас произошло. Живёт до следующего действия. */
export function Note({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <p role="status" className="mt-[0.5em] text-[0.46em] text-forest-700">
      {text}
    </p>
  );
}
