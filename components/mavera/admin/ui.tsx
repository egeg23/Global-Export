"use client";

import { useState } from "react";

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
 * Все размеры в `em`: экран лежит в рамке браузера с размером шрифта в
 * единицах контейнера, поэтому панель целиком масштабируется под ширину
 * кадра, а не ломается на узком.
 */

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
  const groups = [...new Set(adminSections.map((s) => s.group))];

  return (
    <div className="flex min-h-full bg-sand-100 text-forest-950">
      <aside className="hidden w-[11em] shrink-0 flex-col border-r border-forest-900/10 bg-white @min-[40rem]:flex">
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
                    onClick={() => admin.setScreen(section.id, ctx?.fresh?.at ?? 0)}
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
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <TopBar badge={badge} />
        <div className="px-[1.4em] py-[1.2em]">{children}</div>
      </div>
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
function TopBar({ badge }: { badge?: string }) {
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
    <div className="relative flex items-center gap-[0.8em] border-b border-forest-900/10 bg-white px-[1.2em] py-[0.7em]">
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
        className="flex-1 rounded-[0.4em] bg-forest-900/5 px-[0.8em] py-[0.42em] text-[0.52em] text-forest-950 outline-none placeholder:text-ink-subtle focus:bg-forest-900/8"
      />
      <span className="rounded-full bg-harvest-100 px-[0.6em] py-[0.25em] text-[0.48em] font-medium text-harvest-800">
        {badge ?? "Панель"}
      </span>
      <span className="h-[1.5em] w-[1.5em] rounded-full bg-forest-800" />

      {open && query.length > 1 ? (
        <div className="absolute left-[1.2em] top-[2.6em] z-20 w-[22em] overflow-hidden rounded-[0.5em] border border-forest-900/12 bg-white shadow-lg">
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
    <div className="flex items-start justify-between gap-[1em]">
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
