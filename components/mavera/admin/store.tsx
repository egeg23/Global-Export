"use client";

import { createContext, useContext, useMemo, useState } from "react";

import {
  buildFlats,
  countByStatus,
  fmt,
  initialAudit,
  initialLeads,
  initialMedia,
  initialProjects,
  initialRights,
  initialStaff,
  type AuditEntry,
  type Corpus,
  type Flat,
  type Lead,
  type MediaFile,
  type Project,
  type Rights,
  type Role,
  type Staff,
  type AdminScreenId,
  type Undo,
} from "@/components/mavera/admin/model";

/**
 * Состояние панели — одно на все экраны.
 *
 * Это и делает из набора картинок прототип: квартиру правят в шахматке,
 * остаток пересчитывается в обзоре и в списке ЖК, а строка о правке
 * появляется в журнале действий, откуда её можно откатить. Экраны ничего не
 * хранят у себя, кроме того, что набрано в полях прямо сейчас.
 *
 * Хранилище живёт в памяти вкладки: обновление страницы возвращает исходное
 * состояние. Так и задумано — за панелью нет базы, и обещать её видимость
 * было бы обманом. База и есть та работа, которая стоит в смете.
 */

/** Кто сидит в панели. От его имени пишутся строки журнала. */
export const currentUser = "Азиз Каримов";

let counter = 0;
const nextId = (prefix: string) => `${prefix}${(counter += 1)}`;

/** Отметка времени для журнала. Вызывается только из обработчиков. */
function stamp(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(now.getDate())}.${pad(now.getMonth() + 1)}, ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

/**
 * Панель на весь экран, а не в рамке презентации: корпус растягивается на
 * окно, меню на телефоне прячется в шторку, в подвале меню — выход обратно.
 */
export type AppMode = {
  /** Куда ведёт «Выйти» — на страницу презентации, откуда панель открыли. */
  exitHref: string;
  /** Название пакета для шапки: «Премиум». */
  tierLabel: string;
  /** Чья это панель: над меню. По умолчанию MAVERA. */
  brand?: string;
  /** Подпись выхода: у витрины без презентации она другая. */
  exitLabel?: string;
};

export type Admin = {
  /** Полноэкранный режим или null, если панель показана в рамке. */
  app: AppMode | null;
  screen: AdminScreenId;
  /**
   * Открыть раздел. `at` — отметка свежего допника на момент нажатия: по ней
   * галерея понимает, что человек выбрал раздел позже, чем конструктор
   * переключил его сам, и не перебивает выбор обратно.
   */
  setScreen: (id: AdminScreenId, at?: number) => void;
  /** Когда последний раз выбирали раздел руками. */
  pickedAt: number;

  projects: Project[];
  projectId: string;
  project: Project;
  openProject: (id: string) => void;
  patchProject: (id: string, patch: Partial<Project>, note?: string) => void;
  addProject: () => void;
  removeProject: (id: string) => void;
  setCorpuses: (id: string, corpuses: Corpus[], note: string) => void;

  flats: Flat[];
  flatsOf: (projectId: string) => Flat[];
  patchFlats: (ids: Set<string>, change: (flat: Flat) => Flat, note: string, target: string) => void;
  addFlat: (flat: Flat) => void;

  leads: Lead[];
  patchLead: (id: string, patch: Partial<Lead>, note?: string) => void;
  syncLeads: () => void;

  staff: Staff[];
  patchStaff: (id: string, patch: Partial<Staff>, note: string) => void;
  addStaff: (name: string, email: string, role: Role) => void;
  rights: Rights;
  toggleRight: (role: Role, right: string) => void;

  media: MediaFile[];
  addMedia: (count: number) => void;
  removeMedia: (ids: string[]) => void;

  audit: AuditEntry[];
  revert: (entryId: string) => void;

  /** Поиск из верхней полосы: проекты, квартиры и заявки разом. */
  query: string;
  setQuery: (value: string) => void;
};

const Context = createContext<Admin | null>(null);

export function useAdmin(): Admin {
  const value = useContext(Context);
  if (!value) throw new Error("useAdmin вызван вне AdminProvider");
  return value;
}

/**
 * Чем наполнить панель. По умолчанию — данные MAVERA; витрина Golden House
 * передаёт свои, потому что панель у неё та же, а жилые комплексы другие.
 */
export type AdminSeed = {
  projects?: Project[];
  leads?: Lead[];
  media?: MediaFile[];
  audit?: AuditEntry[];
};

export function AdminProvider({
  app = null,
  seed,
  children,
}: {
  app?: AppMode | null;
  seed?: AdminSeed;
  children: React.ReactNode;
}) {
  const start = seed?.projects ?? initialProjects;
  const [screen, setScreenState] = useState<AdminScreenId>("overview");
  const [pickedAt, setPickedAt] = useState(0);
  const [projects, setProjects] = useState<Project[]>(start);
  const [projectId, setProjectId] = useState(start[0].id);
  const [flats, setFlats] = useState<Flat[]>(() => buildFlats(start));
  const [leads, setLeads] = useState<Lead[]>(seed?.leads ?? initialLeads);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [rights, setRights] = useState<Rights>(initialRights);
  const [media, setMedia] = useState<MediaFile[]>(seed?.media ?? initialMedia);
  const [audit, setAudit] = useState<AuditEntry[]>(seed?.audit ?? initialAudit);
  const [query, setQuery] = useState("");

  const value = useMemo<Admin>(() => {
    const log = (section: string, what: string, target: string, undo?: Undo) => {
      setAudit((all) => [
        { id: nextId("a-"), at: stamp(), who: currentUser, section, what, target, undo },
        ...all,
      ]);
    };

    const project = projects.find((item) => item.id === projectId) ?? projects[0];
    const nameOf = (id: string) => projects.find((item) => item.id === id)?.name.RU ?? id;

    const setScreen = (id: AdminScreenId, at = 0) => {
      setScreenState(id);
      setPickedAt(at);
    };

    return {
      app,
      screen,
      setScreen,
      pickedAt,

      projects,
      projectId,
      project,
      openProject: (id) => {
        setProjectId(id);
        setScreenState("project-form");
      },
      patchProject: (id, patch, note) => {
        const before = projects.find((item) => item.id === id);
        setProjects((all) => all.map((item) => (item.id === id ? { ...item, ...patch } : item)));
        if (note && before) {
          const keys = Object.keys(patch) as (keyof Project)[];
          const rollback: Partial<Project> = {};
          for (const key of keys) rollback[key] = before[key] as never;
          log("Карточка ЖК", note, before.name.RU, { kind: "project", id, before: rollback });
        }
      },
      addProject: () => {
        const id = `novyy-${projects.length + 1}`;
        const created: Project = {
          id,
          name: { RU: "Новый проект", EN: "", UZ: "" },
          desc: { RU: "", EN: "", UZ: "" },
          district: "Не указан",
          segment: "Комфорт",
          published: false,
          order: projects.length + 1,
          corpuses: [{ id: 1, floors: 9, perFloor: 12, due: "Срок не задан", state: "Строится" }],
        };
        setProjects((all) => [...all, created]);
        setFlats((all) => [...all, ...buildFlats([created])]);
        setProjectId(id);
        setScreenState("project-form");
        log("Жилые комплексы", "Создан проект — черновик", created.name.RU);
      },
      removeProject: (id) => {
        const name = nameOf(id);
        setProjects((all) => all.filter((item) => item.id !== id));
        setFlats((all) => all.filter((flat) => flat.project !== id));
        setLeads((all) => all.map((lead) => (lead.project === id ? { ...lead, project: "" } : lead)));
        log("Жилые комплексы", "Проект удалён", name);
      },
      setCorpuses: (id, corpuses, note) => {
        const next = projects.map((item) => (item.id === id ? { ...item, corpuses } : item));
        setProjects(next);
        // Квартиры пересобираются под новый набор корпусов: этажность меняли
        // ради них, и оставить старую шахматку значило бы соврать. Но уже
        // сделанные правки переживают пересборку — иначе смена этажности
        // молча стирала бы работу с ценами и статусами.
        const fresh = buildFlats(next).filter((flat) => flat.project === id);
        setFlats((all) => {
          const kept = new Map(all.filter((flat) => flat.project === id).map((flat) => [flat.id, flat]));
          return [
            ...all.filter((flat) => flat.project !== id),
            ...fresh.map((flat) => kept.get(flat.id) ?? flat),
          ];
        });
        log("Карточка ЖК", note, nameOf(id));
      },

      flats,
      flatsOf: (id) => flats.filter((flat) => flat.project === id),
      patchFlats: (ids, change, note, target) => {
        const before: Record<string, Partial<Flat>> = {};
        for (const flat of flats) {
          if (!ids.has(flat.id)) continue;
          before[flat.id] = { status: flat.status, priceM2: flat.priceM2, plan: flat.plan, view: flat.view };
        }
        setFlats((all) => all.map((flat) => (ids.has(flat.id) ? change(flat) : flat)));
        log("Квартиры", note, target, { kind: "flats", before });
      },
      addFlat: (flat) => {
        setFlats((all) => [...all, flat]);
        log("Квартиры", `Добавлена квартира №${flat.no}`, `${nameOf(flat.project)}, корпус ${flat.corpus}`);
      },

      leads,
      patchLead: (id, patch, note) => {
        const before = leads.find((lead) => lead.id === id);
        setLeads((all) => all.map((lead) => (lead.id === id ? { ...lead, ...patch } : lead)));
        if (note && before) {
          const rollback: Partial<Lead> = {};
          for (const key of Object.keys(patch) as (keyof Lead)[]) rollback[key] = before[key] as never;
          log("Заявки", note, before.name, { kind: "lead", id, before: rollback });
        }
      },
      syncLeads: () => {
        const waiting = leads.filter((lead) => !lead.synced).length;
        setLeads((all) => all.map((lead) => ({ ...lead, synced: true })));
        if (waiting) log("Заявки", `Выгружено в amoCRM: ${waiting}`, "Отдел продаж");
      },

      staff,
      patchStaff: (id, patch, note) => {
        const before = staff.find((item) => item.id === id);
        setStaff((all) => all.map((item) => (item.id === id ? { ...item, ...patch } : item)));
        if (before) log("Пользователи", note, before.name);
      },
      addStaff: (name, email, role) => {
        const created: Staff = { id: nextId("s-"), name, email, role, active: true };
        setStaff((all) => [...all, created]);
        log("Пользователи", `Заведён сотрудник · роль «${role}»`, name);
      },
      rights,
      toggleRight: (role, right) => {
        setRights((all) => ({
          ...all,
          [role]: { ...all[role], [right]: !all[role][right as keyof (typeof all)[Role]] },
        }));
        const was = rights[role][right as keyof (typeof rights)[Role]];
        log("Пользователи", `Право «${right}»: ${was ? "снято" : "выдано"}`, `Роль «${role}»`);
      },

      media,
      addMedia: (count) => {
        const created: MediaFile[] = Array.from({ length: count }, (_, index) => ({
          id: nextId("m-"),
          name: `${project.id}-${media.length + index + 1}.jpg`,
          kind: "Фото",
          size: "2,1 МБ",
          used: 0,
        }));
        setMedia((all) => [...created, ...all]);
        log("Медиатека", `Загружено файлов: ${count}`, project.name.RU);
      },
      removeMedia: (ids) => {
        const names = media.filter((file) => ids.includes(file.id)).map((file) => file.name);
        setMedia((all) => all.filter((file) => !ids.includes(file.id)));
        log("Медиатека", `Удалено файлов: ${names.length}`, names.join(", ").slice(0, 60));
      },

      audit,
      revert: (entryId) => {
        const entry = audit.find((item) => item.id === entryId);
        if (!entry?.undo || entry.reverted) return;
        const undo = entry.undo;

        if (undo.kind === "flats") {
          setFlats((all) =>
            all.map((flat) => (undo.before[flat.id] ? { ...flat, ...undo.before[flat.id] } : flat)),
          );
        } else if (undo.kind === "lead") {
          setLeads((all) => all.map((lead) => (lead.id === undo.id ? { ...lead, ...undo.before } : lead)));
        } else {
          setProjects((all) => all.map((item) => (item.id === undo.id ? { ...item, ...undo.before } : item)));
        }

        setAudit((all) => [
          {
            id: nextId("a-"),
            at: stamp(),
            who: currentUser,
            section: entry.section,
            what: `Откат: ${entry.what}`,
            target: entry.target,
          },
          ...all.map((item) => (item.id === entryId ? { ...item, reverted: true } : item)),
        ]);
      },

      query,
      setQuery,
    };
  }, [app, screen, pickedAt, projects, projectId, flats, leads, staff, rights, media, audit, query]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

/* ------------------------------------------------------------------ */
/* Производные цифры, нужные сразу нескольким экранам                  */
/* ------------------------------------------------------------------ */

export function useTotals() {
  const { flats, leads, projects } = useAdmin();
  const counts = countByStatus(flats);
  return {
    counts,
    flats: flats.length,
    published: projects.filter((item) => item.published).length,
    projects: projects.length,
    newLeads: leads.filter((lead) => lead.state === "Новая").length,
    deals: leads.filter((lead) => lead.state === "Сделка").length,
    /** Конверсия сайта: сделки к заявкам, одной цифрой с запятой. */
    conversion:
      leads.length === 0
        ? "0,0%"
        : `${((leads.filter((lead) => lead.state === "Сделка").length / leads.length) * 100).toFixed(1).replace(".", ",")}%`,
    money: fmt(
      flats
        .filter((flat) => flat.status === "free")
        .reduce((sum, flat) => sum + flat.priceM2 * flat.area, 0),
    ),
  };
}
