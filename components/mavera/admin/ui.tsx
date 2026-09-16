"use client";

import { cn } from "@/lib/cn";

/**
 * Общие части панели управления MAVERA.
 *
 * Здесь корпус окна, шапка экрана, карточка и поля — то, из чего собраны и
 * нарисованные экраны, и живые. Вынесено отдельно, чтобы рабочие экраны не
 * тянули за собой весь файл с макетами и наоборот.
 *
 * Все размеры в `em`: экран лежит в рамке браузера с размером шрифта в
 * единицах контейнера, поэтому панель целиком масштабируется под ширину
 * кадра, а не ломается на узком.
 */

export type AdminScreenId =
  | "overview"
  | "projects"
  | "project-form"
  | "flats"
  | "leads"
  | "users"
  | "analytics"
  | "media"
  | "audit";

export const adminSections: { id: AdminScreenId; label: string; group: string }[] = [
  { id: "overview", label: "Обзор", group: "Работа" },
  { id: "projects", label: "Жилые комплексы", group: "Каталог" },
  { id: "project-form", label: "Карточка ЖК", group: "Каталог" },
  { id: "flats", label: "Корпуса и квартиры", group: "Каталог" },
  { id: "media", label: "Медиатека", group: "Каталог" },
  { id: "leads", label: "Заявки", group: "Продажи" },
  { id: "analytics", label: "Аналитика", group: "Продажи" },
  { id: "users", label: "Пользователи и роли", group: "Настройки" },
  { id: "audit", label: "Журнал действий", group: "Настройки" },
];

export function Chrome({
  active,
  badge,
  children,
}: {
  active: AdminScreenId;
  /** Счётчик в верхней полосе. На живых экранах он считается, а не написан. */
  badge?: string;
  children: React.ReactNode;
}) {
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
                  <span
                    key={section.id}
                    className={cn(
                      "mb-[0.12em] block rounded-[0.4em] px-[0.7em] py-[0.42em] text-[0.55em]",
                      section.id === active
                        ? "bg-forest-800/10 font-medium text-forest-950"
                        : "text-forest-900/70",
                    )}
                  >
                    {section.label}
                  </span>
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
        {/* Верхняя полоса: поиск, уведомления, профиль. */}
        <div className="flex items-center gap-[0.8em] border-b border-forest-900/10 bg-white px-[1.2em] py-[0.7em]">
          <span className="flex-1 rounded-[0.4em] bg-forest-900/5 px-[0.8em] py-[0.42em] text-[0.52em] text-ink-subtle">
            Поиск по проектам, квартирам и заявкам
          </span>
          <span className="rounded-full bg-harvest-100 px-[0.6em] py-[0.25em] text-[0.48em] font-medium text-harvest-800">
            {badge ?? "4 новые заявки"}
          </span>
          <span className="h-[1.5em] w-[1.5em] rounded-full bg-forest-800" />
        </div>

        <div className="px-[1.4em] py-[1.2em]">{children}</div>
      </div>
    </div>
  );
}

export function Title({
  eyebrow,
  title,
  action,
  onAction,
}: {
  eyebrow?: string;
  title: string;
  action?: string;
  /** Есть обработчик — кнопка настоящая; нет — нарисованная, как было. */
  onAction?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-[1em]">
      <div>
        {eyebrow ? (
          <p className="text-[0.48em] uppercase tracking-[0.16em] text-ink-subtle">{eyebrow}</p>
        ) : null}
        <h1 className="mt-[0.2em] text-[1.05em] font-semibold">{title}</h1>
      </div>
      {action ? (
        onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="shrink-0 rounded-full bg-forest-800 px-[1em] py-[0.45em] text-[0.52em] font-medium text-sand-50 transition-opacity hover:opacity-90"
          >
            {action}
          </button>
        ) : (
          <span className="shrink-0 rounded-full bg-forest-800 px-[1em] py-[0.45em] text-[0.52em] font-medium text-sand-50">
            {action}
          </span>
        )
      ) : null}
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
/* Рабочие поля — для живых экранов                                    */
/* ------------------------------------------------------------------ */

/**
 * Единая рамка поля.
 *
 * Нарисованное поле и рабочее должны выглядеть одинаково: заказчик
 * переключается между экранами и не должен замечать, где макет кончился.
 */
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

/** Кнопка внутри экрана: основная тёмная или обводкой. */
export function ScreenButton({
  children,
  onClick,
  tone = "solid",
  disabled = false,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone?: "solid" | "outline";
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
