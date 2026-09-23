"use client";

import { useState } from "react";

import { Addon, useAddon } from "@/components/configurator/context";
import { plural, rightRows, roles, type Right, type Role } from "@/components/mavera/admin/model";
import { useAdmin } from "@/components/mavera/admin/store";
import {
  Card,
  Check,
  Chrome,
  Note,
  RowSelect,
  ScreenButton,
  Switch,
  Title,
} from "@/components/mavera/admin/ui";
import { cn } from "@/lib/cn";

/**
 * Настройки: сотрудники с правами и журнал действий.
 *
 * Журнал здесь не украшение: в него пишет каждый экран панели, и из него же
 * правка откатывается. Это то место, где видно, что панель — одна система,
 * а не девять отдельных картинок.
 */

/* ------------------------------------------------------------------ */
/* Пользователи и роли                                                 */
/* ------------------------------------------------------------------ */

export function UsersScreen() {
  const admin = useAdmin();
  const showRights = useAddon("roles");
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Менеджер продаж");
  const [note, setNote] = useState<string | null>(null);

  const active = admin.staff.filter((item) => item.active).length;

  const submit = () => {
    if (!name.trim()) {
      setNote("Впишите имя — по нему сотрудника ищут в заявках");
      return;
    }
    admin.addStaff(name.trim(), email.trim() || "—", role);
    setNote(`${name.trim()} заведён · роль «${role}» · приглашение отправлено`);
    setName("");
    setEmail("");
    setAdding(false);
  };

  return (
    <Chrome active="users" badge={`${active} в работе`}>
      <Title
        eyebrow="Настройки"
        title="Пользователи и роли"
        action={adding ? "Отмена" : "+ Сотрудник"}
        onAction={() => setAdding((value) => !value)}
      />

      {adding ? (
        <Card className="mt-[0.9em] flex flex-wrap items-end gap-[0.5em] border-forest-700/30 bg-forest-700/5">
          <label className="min-w-[8em] flex-1">
            <span className="text-[0.46em] font-medium text-forest-900">Имя</span>
            <input
              type="text"
              aria-label="Имя сотрудника"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Имя и фамилия"
              className="mt-[0.2em] block w-full rounded-[0.4em] border border-forest-900/15 bg-white px-[0.6em] py-[0.35em] text-[0.5em] outline-none focus:border-forest-700"
            />
          </label>
          <label className="min-w-[8em] flex-1">
            <span className="text-[0.46em] font-medium text-forest-900">Почта</span>
            <input
              type="text"
              aria-label="Почта сотрудника"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@mavera.uz"
              className="mt-[0.2em] block w-full rounded-[0.4em] border border-forest-900/15 bg-white px-[0.6em] py-[0.35em] text-[0.5em] outline-none focus:border-forest-700"
            />
          </label>
          <label className="min-w-[7em]">
            <span className="text-[0.46em] font-medium text-forest-900">Роль</span>
            <select
              aria-label="Роль нового сотрудника"
              value={role}
              onChange={(event) => setRole(event.target.value as Role)}
              className="mt-[0.2em] block w-full appearance-none rounded-[0.4em] border border-forest-900/15 bg-white px-[0.6em] py-[0.35em] text-[0.5em] outline-none focus:border-forest-700"
            >
              {roles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <ScreenButton onClick={submit}>Пригласить</ScreenButton>
        </Card>
      ) : null}

      <div className="mt-[0.9em] overflow-x-auto rounded-[0.5em] border border-forest-900/10 bg-white">
        <div className="min-w-[22em]">
          <div className="grid grid-cols-[1.4fr_1.6fr_1.4fr_1fr] gap-[0.5em] border-b border-forest-900/10 bg-forest-900/4 px-[0.9em] py-[0.4em] text-[0.42em] uppercase tracking-[0.1em] text-ink-subtle">
            <span>Имя</span>
            <span>Почта</span>
            <span>Роль</span>
            <span>Доступ</span>
          </div>
          {admin.staff.map((person) => (
            <div
              key={person.id}
              className="grid grid-cols-[1.4fr_1.6fr_1.4fr_1fr] items-center gap-[0.5em] border-b border-forest-900/6 px-[0.9em] py-[0.42em] text-[0.5em] last:border-b-0"
            >
              <span className={cn("truncate", person.active ? "" : "text-ink-subtle line-through")}>
                {person.name}
              </span>
              <span className="truncate text-ink-subtle">{person.email}</span>
              <RowSelect
                label={`Роль ${person.name}`}
                value={person.role}
                options={roles}
                onChange={(value) =>
                  admin.patchStaff(person.id, { role: value as Role }, `Роль: ${person.role} → ${value}`)
                }
                className="text-ink-subtle"
              />
              <span className="flex items-center gap-[0.4em]">
                <Switch
                  checked={person.active}
                  label={`Доступ ${person.name}`}
                  onChange={(next) =>
                    admin.patchStaff(
                      person.id,
                      { active: next },
                      next ? "Доступ восстановлен" : "Доступ отключён",
                    )
                  }
                />
                <span className="text-[0.85em] text-ink-subtle">
                  {person.active ? "в работе" : "отключён"}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <Note text={note} />

      {/* Допник «Роли и права»: матрица, кто что может. */}
      <Addon id="roles" compact className="mt-[0.9em]">
        <Card>
          <p className="text-[0.55em] font-medium">Права по ролям</p>
          <p className="mt-[0.2em] text-[0.44em] text-ink-subtle">
            Галочка меняется на месте. Снимете «Менять цены» у менеджера — он
            увидит шахматку, но не сможет тронуть прайс.
          </p>

          <div className="mt-[0.6em] overflow-x-auto">
            <table className="w-full min-w-[22em] border-collapse text-[0.46em]">
              <thead>
                <tr className="text-ink-subtle">
                  <th className="pb-[0.4em] text-left font-medium">Что можно</th>
                  {roles.map((item) => (
                    <th key={item} className="pb-[0.4em] px-[0.3em] text-center font-medium">
                      {item.split(" ")[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rightRows.map((right) => (
                  <tr key={right} className="border-t border-forest-900/8">
                    <td className="py-[0.35em] pr-[0.5em]">{right}</td>
                    {roles.map((item) => (
                      <td key={item} className="py-[0.35em] text-center">
                        <span className="inline-flex justify-center">
                          <Check
                            checked={admin.rights[item][right as Right]}
                            label={`${item}: ${right}`}
                            onChange={() => admin.toggleRight(item, right)}
                          />
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Addon>

      {showRights ? null : (
        <p className="mt-[0.6em] text-[0.46em] leading-[1.6] text-ink-subtle">
          Без блока «Роли и права» доступ простой: есть вход в панель или нет.
          Матрица прав включается тумблером в конструкторе.
        </p>
      )}
    </Chrome>
  );
}

/* ------------------------------------------------------------------ */
/* Журнал действий                                                     */
/* ------------------------------------------------------------------ */

export function AuditScreen() {
  const admin = useAdmin();
  const [section, setSection] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const sections = [...new Set(admin.audit.map((entry) => entry.section))];
  const shown = section ? admin.audit.filter((entry) => entry.section === section) : admin.audit;
  const undoable = admin.audit.filter((entry) => entry.undo && !entry.reverted).length;

  return (
    <Chrome active="audit" badge={plural(admin.audit.length, ["запись", "записи", "записей"])}>
      <Title eyebrow="Настройки" title="Журнал действий" />

      <div className="mt-[0.9em] flex flex-wrap items-center gap-[0.4em]">
        <button
          type="button"
          aria-pressed={section === null}
          onClick={() => setSection(null)}
          className={cn(
            "rounded-full px-[0.8em] py-[0.32em] text-[0.48em] transition-colors",
            section === null
              ? "bg-forest-800 text-sand-50"
              : "border border-forest-900/15 text-ink-subtle hover:border-forest-900/40",
          )}
        >
          Всё
        </button>
        {sections.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={section === item}
            onClick={() => setSection(item)}
            className={cn(
              "rounded-full px-[0.8em] py-[0.32em] text-[0.48em] transition-colors",
              section === item
                ? "bg-forest-800 text-sand-50"
                : "border border-forest-900/15 text-ink-subtle hover:border-forest-900/40",
            )}
          >
            {item}
          </button>
        ))}
        <span className="ml-auto text-[0.46em] text-ink-subtle">
          Можно откатить: {undoable}
        </span>
      </div>

      <div className="mt-[0.7em] overflow-x-auto rounded-[0.5em] border border-forest-900/10 bg-white">
        <div className="min-w-[32em]">
          <div className="grid grid-cols-[1fr_1.3fr_1fr_2fr_1.4fr_0.9fr] gap-[0.5em] border-b border-forest-900/10 bg-forest-900/4 px-[0.9em] py-[0.4em] text-[0.42em] uppercase tracking-[0.1em] text-ink-subtle">
            <span>Когда</span>
            <span>Кто</span>
            <span>Раздел</span>
            <span>Что изменилось</span>
            <span>Где</span>
            <span />
          </div>

          {shown.slice(0, 14).map((entry) => (
            <div
              key={entry.id}
              className="grid grid-cols-[1fr_1.3fr_1fr_2fr_1.4fr_0.9fr] items-center gap-[0.5em] border-b border-forest-900/6 px-[0.9em] py-[0.42em] text-[0.5em] last:border-b-0"
            >
              <span className="tabular-nums text-ink-subtle">{entry.at}</span>
              <span className="truncate">{entry.who}</span>
              <span className="truncate text-ink-subtle">{entry.section}</span>
              <span className={cn("truncate", entry.reverted ? "text-ink-subtle line-through" : "")}>
                {entry.what}
              </span>
              <span className="truncate text-ink-subtle">{entry.target}</span>
              <span className="justify-self-end">
                {entry.undo && !entry.reverted ? (
                  <ScreenButton
                    tone="outline"
                    onClick={() => {
                      admin.revert(entry.id);
                      setNote(`Откат применён: ${entry.what}`);
                    }}
                  >
                    Откатить
                  </ScreenButton>
                ) : entry.reverted ? (
                  <span className="text-[0.85em] text-ink-subtle">откачено</span>
                ) : null}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Note text={note} />

      <p className="mt-[0.6em] text-[0.46em] leading-[1.6] text-ink-subtle">
        Пишется всё, что меняет сайт: цена, статус квартиры, тексты карточки,
        роли сотрудников. Спорную правку видно поимённо и с точным временем, а
        цену или статус можно вернуть одной кнопкой — без разговора «кто это
        сделал».
      </p>
    </Chrome>
  );
}
