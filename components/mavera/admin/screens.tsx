import { cn } from "@/lib/cn";

/**
 * Панель управления MAVERA — восемь экранов.
 *
 * За основу взята админка Global Export: те же приёмы, которые уже работают у
 * действующего клиента — язык переключается прямо в поле, точка на вкладке
 * показывает незаполненный перевод, файлы кидаются перетаскиванием, черновик
 * виден только в панели.
 *
 * Добавлено то, без чего застройщику нельзя: корпуса и квартиры с ценами и
 * статусами, планировки, роли сотрудников и аналитика поведения. Палитра
 * своя и тумблером вариантов не меняется: оформление сайта заказчик выбирает,
 * рабочий инструмент — нет.
 */

export type AdminScreenId =
  | "overview"
  | "projects"
  | "project-form"
  | "flats"
  | "leads"
  | "users"
  | "analytics"
  | "media";

export const adminSections: { id: AdminScreenId; label: string; group: string }[] = [
  { id: "overview", label: "Обзор", group: "Работа" },
  { id: "projects", label: "Жилые комплексы", group: "Каталог" },
  { id: "project-form", label: "Карточка ЖК", group: "Каталог" },
  { id: "flats", label: "Корпуса и квартиры", group: "Каталог" },
  { id: "media", label: "Медиатека", group: "Каталог" },
  { id: "leads", label: "Заявки", group: "Продажи" },
  { id: "analytics", label: "Аналитика", group: "Продажи" },
  { id: "users", label: "Пользователи и роли", group: "Настройки" },
];

/* ------------------------------------------------------------------ */
/* Каркас панели                                                       */
/* ------------------------------------------------------------------ */

function Chrome({ active, children }: { active: AdminScreenId; children: React.ReactNode }) {
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
            4 новые заявки
          </span>
          <span className="h-[1.5em] w-[1.5em] rounded-full bg-forest-800" />
        </div>

        <div className="px-[1.4em] py-[1.2em]">{children}</div>
      </div>
    </div>
  );
}

function Title({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: string }) {
  return (
    <div className="flex items-start justify-between gap-[1em]">
      <div>
        {eyebrow ? (
          <p className="text-[0.48em] uppercase tracking-[0.16em] text-ink-subtle">{eyebrow}</p>
        ) : null}
        <h1 className="mt-[0.2em] text-[1.05em] font-semibold">{title}</h1>
      </div>
      {action ? (
        <span className="shrink-0 rounded-full bg-forest-800 px-[1em] py-[0.45em] text-[0.52em] font-medium text-sand-50">
          {action}
        </span>
      ) : null}
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-[0.5em] border border-forest-900/10 bg-white p-[1em]", className)}>
      {children}
    </div>
  );
}

function Field({ label, value, hint }: { label: string; value?: string; hint?: string }) {
  return (
    <label className="block">
      <span className="text-[0.5em] font-medium text-forest-900">{label}</span>
      <span
        className={cn(
          "mt-[0.3em] block rounded-[0.4em] border border-forest-900/15 px-[0.7em] py-[0.45em] text-[0.52em]",
          value ? "text-forest-950" : "text-ink-subtle",
        )}
      >
        {value || hint}
      </span>
    </label>
  );
}

function LangTabs({ empty = "UZ" }: { empty?: string }) {
  return (
    <span className="flex gap-[0.2em]">
      {["RU", "EN", "UZ"].map((code, index) => (
        <span
          key={code}
          className={cn(
            "flex items-center gap-[0.25em] rounded-[0.3em] px-[0.45em] py-[0.18em] text-[0.45em] font-medium",
            index === 0 ? "bg-forest-800 text-sand-50" : "text-forest-800/70",
          )}
        >
          {code}
          <span
            className={cn(
              "h-[0.28em] w-[0.28em] rounded-full",
              code === empty ? "bg-harvest-400" : "bg-forest-500",
            )}
          />
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Экраны                                                              */
/* ------------------------------------------------------------------ */

function Overview() {
  const kpis = [
    { label: "Заявки за неделю", value: "38", delta: "+12%" },
    { label: "Забронировано", value: "14", delta: "+3" },
    { label: "Квартир в продаже", value: "1 284", delta: "−26" },
    { label: "Конверсия сайта", value: "3,1%", delta: "+0,4" },
  ];
  const week = [42, 55, 38, 61, 74, 49, 66];

  return (
    <Chrome active="overview">
      <Title title="Обзор" action="Выгрузить отчёт" />

      <div className="mt-[1em] grid grid-cols-2 gap-[0.6em] @min-[40rem]:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <p className="text-[0.46em] uppercase tracking-[0.12em] text-ink-subtle">{kpi.label}</p>
            <p className="mt-[0.35em] text-[1.1em] font-semibold tabular-nums">{kpi.value}</p>
            <p className="mt-[0.15em] text-[0.45em] text-forest-600">{kpi.delta} к прошлой неделе</p>
          </Card>
        ))}
      </div>

      <div className="mt-[0.8em] grid gap-[0.6em] @min-[40rem]:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="flex items-baseline justify-between">
            <p className="text-[0.55em] font-medium">Визиты и заявки</p>
            <p className="text-[0.45em] text-ink-subtle">Яндекс.Метрика · 7 дней</p>
          </div>
          <div className="mt-[0.8em] flex h-[5em] items-end gap-[0.4em]">
            {week.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-[0.25em]">
                <span
                  className="w-full rounded-t-[0.2em] bg-forest-700"
                  style={{ height: `${value}%` }}
                />
                <span className="w-full rounded-b-[0.2em] bg-harvest-400" style={{ height: `${value / 6}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-[0.6em] flex gap-[0.9em] text-[0.45em] text-ink-subtle">
            <span className="flex items-center gap-[0.3em]">
              <span className="h-[0.35em] w-[0.35em] rounded-[0.1em] bg-forest-700" /> визиты
            </span>
            <span className="flex items-center gap-[0.3em]">
              <span className="h-[0.35em] w-[0.35em] rounded-[0.1em] bg-harvest-400" /> заявки
            </span>
          </div>
        </Card>

        <Card>
          <p className="text-[0.55em] font-medium">Последние заявки</p>
          <ul className="mt-[0.7em] space-y-[0.5em]">
            {[
              ["Азиз Р.", "ЖК «Чинор», 3-комн."],
              ["Дилноза К.", "Главная, обратный звонок"],
              ["Сергей М.", "Коммерция, аренда"],
            ].map(([name, source]) => (
              <li key={name} className="flex items-start justify-between gap-[0.5em] border-b border-forest-900/6 pb-[0.45em] last:border-b-0">
                <span>
                  <span className="block text-[0.52em] font-medium">{name}</span>
                  <span className="block text-[0.45em] text-ink-subtle">{source}</span>
                </span>
                <span className="rounded-full bg-harvest-100 px-[0.5em] py-[0.15em] text-[0.42em] text-harvest-800">
                  новая
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Chrome>
  );
}

function Projects() {
  const rows = [
    { name: "ЖК «Чинор»", meta: "Мирзо-Улугбекский · комфорт", flats: "1 248", free: "86", published: true },
    { name: "ЖК «Дарё»", meta: "Яшнабадский · бизнес", flats: "640", free: "24", published: true },
    { name: "ЖК «Бахор»", meta: "Сергелийский · эконом", flats: "864", free: "12", published: true },
    { name: "ЖК «Олтин Водий»", meta: "Юнусабадский · комфорт", flats: "1 020", free: "410", published: false },
    { name: "ЖК «Нур»", meta: "Чиланзарский · эконом", flats: "1 116", free: "0", published: true },
  ];

  return (
    <Chrome active="projects">
      <Title eyebrow="Каталог" title="Жилые комплексы" action="+ Добавить ЖК" />

      <div className="mt-[0.9em] flex flex-wrap items-center gap-[0.4em]">
        {["Все", "Строятся", "Сданы", "Черновики"].map((chip, index) => (
          <span
            key={chip}
            className={cn(
              "rounded-full px-[0.8em] py-[0.35em] text-[0.5em]",
              index === 0 ? "bg-forest-800 text-sand-50" : "border border-forest-900/15 text-ink-subtle",
            )}
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="mt-[0.8em] overflow-hidden rounded-[0.5em] border border-forest-900/10 bg-white">
        <div className="grid grid-cols-[2.2fr_1fr_0.8fr_1fr_0.8fr] gap-[0.6em] border-b border-forest-900/10 px-[0.9em] py-[0.5em] text-[0.44em] uppercase tracking-[0.1em] text-ink-subtle">
          <span>Проект</span>
          <span>Квартир</span>
          <span>Свободно</span>
          <span>Публикация</span>
          <span>Порядок</span>
        </div>
        {rows.map((row, index) => (
          <div
            key={row.name}
            className="grid grid-cols-[2.2fr_1fr_0.8fr_1fr_0.8fr] items-center gap-[0.6em] border-b border-forest-900/6 px-[0.9em] py-[0.6em] last:border-b-0"
          >
            <span className="flex items-center gap-[0.6em]">
              <span className="h-[1.7em] w-[2.4em] shrink-0 rounded-[0.3em] bg-forest-900/10" />
              <span className="min-w-0">
                <span className="block truncate text-[0.55em] font-medium">{row.name}</span>
                <span className="block truncate text-[0.45em] text-ink-subtle">{row.meta}</span>
              </span>
            </span>
            <span className="text-[0.52em] tabular-nums">{row.flats}</span>
            <span className="text-[0.52em] tabular-nums">{row.free}</span>
            <span>
              <span
                className={cn(
                  "inline-flex items-center gap-[0.3em] rounded-full px-[0.55em] py-[0.2em] text-[0.45em] font-medium",
                  row.published ? "bg-forest-800/10 text-forest-800" : "bg-harvest-100 text-harvest-800",
                )}
              >
                <span className={cn("h-[0.3em] w-[0.3em] rounded-full", row.published ? "bg-forest-600" : "bg-harvest-500")} />
                {row.published ? "Опубликован" : "Черновик"}
              </span>
            </span>
            <span className="text-[0.5em] text-ink-subtle tabular-nums">{index + 1}</span>
          </div>
        ))}
      </div>
    </Chrome>
  );
}

function ProjectForm() {
  return (
    <Chrome active="project-form">
      <Title eyebrow="Каталог / Жилые комплексы" title="ЖК «Чинор»" action="Сохранить" />

      <div className="mt-[0.9em] grid gap-[0.7em] @min-[40rem]:grid-cols-[1.7fr_1fr]">
        <div className="space-y-[0.7em]">
          <Card>
            <p className="text-[0.55em] font-medium">Основное</p>
            <div className="mt-[0.7em] space-y-[0.6em]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[0.5em] font-medium text-forest-900">Название</span>
                  <LangTabs />
                </div>
                <span className="mt-[0.3em] block rounded-[0.4em] border border-forest-900/15 px-[0.7em] py-[0.45em] text-[0.52em]">
                  ЖК «Чинор»
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[0.5em] font-medium text-forest-900">Описание</span>
                  <LangTabs />
                </div>
                <span className="mt-[0.3em] block h-[2.6em] rounded-[0.4em] border border-forest-900/15 px-[0.7em] py-[0.45em] text-[0.52em] text-ink-subtle">
                  Текст на русском
                </span>
              </div>
              <div className="grid grid-cols-2 gap-[0.5em]">
                <Field label="Район" value="Мирзо-Улугбекский" />
                <Field label="Сегмент" value="Комфорт" />
              </div>
            </div>
          </Card>

          {/* Корпуса — то, чего нет в админке сайта-визитки. */}
          <Card>
            <div className="flex items-center justify-between">
              <p className="text-[0.55em] font-medium">Корпуса</p>
              <span className="rounded-full border border-forest-900/15 px-[0.7em] py-[0.28em] text-[0.45em]">
                + Добавить корпус
              </span>
            </div>
            <div className="mt-[0.6em] overflow-hidden rounded-[0.4em] border border-forest-900/10">
              <div className="grid grid-cols-[0.6fr_1fr_1fr_1.2fr_1fr] gap-[0.5em] border-b border-forest-900/10 bg-forest-900/4 px-[0.7em] py-[0.35em] text-[0.42em] uppercase tracking-[0.1em] text-ink-subtle">
                <span>№</span>
                <span>Этажей</span>
                <span>Квартир</span>
                <span>Срок сдачи</span>
                <span>Статус</span>
              </div>
              {[
                ["1", "9", "108", "Сдан в 2024", "Сдан"],
                ["2", "12", "144", "Сдан в 2025", "Сдан"],
                ["3", "16", "192", "IV кв. 2026", "Продаётся"],
                ["4", "16", "192", "IV кв. 2026", "Продаётся"],
                ["5", "9", "120", "II кв. 2027", "Строится"],
              ].map((row) => (
                <div
                  key={row[0]}
                  className="grid grid-cols-[0.6fr_1fr_1fr_1.2fr_1fr] gap-[0.5em] border-b border-forest-900/6 px-[0.7em] py-[0.4em] text-[0.5em] last:border-b-0"
                >
                  {row.map((cell, index) => (
                    <span key={index} className={index === 4 ? "text-ink-subtle" : "tabular-nums"}>
                      {cell}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <p className="text-[0.55em] font-medium">Характеристики</p>
            <div className="mt-[0.6em] grid grid-cols-3 gap-[0.5em]">
              {[
                ["Площадь", "84 600 м²"],
                ["Этажность", "9–16"],
                ["Квартир", "1 248"],
                ["Паркинг", "подземный"],
                ["Отделка", "3 варианта"],
                ["Сдача", "IV кв. 2027"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[0.4em] border border-forest-900/12 px-[0.6em] py-[0.4em]">
                  <span className="block text-[0.42em] uppercase tracking-[0.1em] text-ink-subtle">{label}</span>
                  <span className="mt-[0.1em] block text-[0.5em]">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-[0.7em]">
          <Card>
            <p className="text-[0.55em] font-medium">Публикация</p>
            <div className="mt-[0.5em] flex items-center gap-[0.4em]">
              <span className="flex h-[0.8em] w-[1.4em] items-center rounded-full bg-forest-700 px-[0.12em]">
                <span className="ml-auto h-[0.5em] w-[0.5em] rounded-full bg-white" />
              </span>
              <span className="text-[0.5em] text-ink-subtle">Опубликован</span>
            </div>
            <p className="mt-[0.5em] text-[0.45em] leading-[1.5] text-ink-subtle">
              Адрес: /projects/chinor — составлен из названия, кириллица
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
              {["1-комн. 38,4 м²", "2-комн. 56,2 м²", "3-комн. 78,5 м²", "4-комн. 104,6 м²"].map((plan) => (
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

function Flats() {
  const floors = [16, 15, 14, 13, 12, 11, 10, 9, 8];

  return (
    <Chrome active="flats">
      <Title eyebrow="ЖК «Чинор» / Корпус 3" title="Корпуса и квартиры" action="Импорт из Excel" />

      <div className="mt-[0.9em] flex flex-wrap items-center gap-[0.4em]">
        {["Корпус 1", "Корпус 2", "Корпус 3", "Корпус 4", "Корпус 5"].map((chip, index) => (
          <span
            key={chip}
            className={cn(
              "rounded-full px-[0.8em] py-[0.32em] text-[0.48em]",
              index === 2 ? "bg-forest-800 text-sand-50" : "border border-forest-900/15 text-ink-subtle",
            )}
          >
            {chip}
          </span>
        ))}
        <span className="ml-auto text-[0.48em] text-ink-subtle">Выбрано: 6 квартир</span>
      </div>

      <div className="mt-[0.7em] grid gap-[0.6em] @min-[40rem]:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-[0.55em] font-medium">Шахматка</p>
            <span className="text-[0.44em] text-ink-subtle">Клик — выделить, двойной — открыть</span>
          </div>
          <div className="mt-[0.6em] space-y-[0.22em]">
            {floors.map((floor, row) => (
              <div key={floor} className="flex items-center gap-[0.35em]">
                <span className="w-[1.1em] text-right text-[0.42em] tabular-nums text-ink-subtle">{floor}</span>
                <div className="flex flex-1 gap-[0.22em]">
                  {Array.from({ length: 12 }, (_, cell) => {
                    const state = (row * 7 + cell * 3) % 10;
                    return (
                      <span
                        key={cell}
                        className={cn(
                          "h-[0.75em] flex-1 rounded-[0.12em]",
                          state < 5 ? "bg-forest-600" : state < 7 ? "bg-harvest-400" : "bg-forest-900/12",
                          row === 4 && cell > 5 && cell < 9 ? "outline outline-[0.1em] outline-offset-[0.06em] outline-forest-900" : "",
                        )}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-[0.6em] flex flex-wrap gap-[0.7em] border-t border-forest-900/8 pt-[0.5em] text-[0.42em] text-ink-subtle">
            {[
              ["Свободна", "bg-forest-600"],
              ["Бронь", "bg-harvest-400"],
              ["Продана", "bg-forest-900/12"],
            ].map(([label, tone]) => (
              <span key={label} className="flex items-center gap-[0.3em]">
                <span className={cn("h-[0.35em] w-[0.5em] rounded-[0.1em]", tone)} />
                {label}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-[0.55em] font-medium">Изменить выбранные</p>
          <div className="mt-[0.6em] space-y-[0.5em]">
            <Field label="Статус" value="Свободна" />
            <Field label="Цена за м²" value="11 412 050 сум" />
            <Field label="Планировка" value="3-комн. 78,5 м² · PDF" />
            <Field label="Вид из окон" value="Во двор" />
          </div>
          <span className="mt-[0.8em] block rounded-full bg-forest-800 py-[0.45em] text-center text-[0.5em] font-medium text-sand-50">
            Применить к 6 квартирам
          </span>
          <p className="mt-[0.5em] text-[0.44em] leading-[1.5] text-ink-subtle">
            Цены можно поднять сразу по корпусу или этажу — например, на 3% после
            выхода на монтаж фасада.
          </p>
        </Card>
      </div>
    </Chrome>
  );
}

function Leads() {
  const leads = [
    { date: "15.09, 14:32", name: "Азиз Р.", source: "ЖК «Чинор» · 3-комн.", owner: "Нодира", state: "Новая" },
    { date: "15.09, 11:04", name: "Дилноза К.", source: "Главная · обратный звонок", owner: "Нодира", state: "В работе" },
    { date: "14.09, 18:20", name: "Сергей М.", source: "Коммерция · аренда", owner: "Бекзод", state: "В работе" },
    { date: "14.09, 09:47", name: "Нилуфар А.", source: "ЖК «Дарё» · калькулятор", owner: "Бекзод", state: "Обработана" },
    { date: "13.09, 16:12", name: "Тимур Х.", source: "ЖК «Чинор» · бронь", owner: "Нодира", state: "Сделка" },
  ];

  return (
    <Chrome active="leads">
      <Title eyebrow="Продажи" title="Заявки" action="Выгрузить в CRM" />

      <div className="mt-[0.9em] grid grid-cols-4 gap-[0.5em]">
        {[
          ["Новые", "4"],
          ["В работе", "11"],
          ["Обработаны", "23"],
          ["Сделки", "6"],
        ].map(([label, value]) => (
          <Card key={label}>
            <p className="text-[0.44em] uppercase tracking-[0.1em] text-ink-subtle">{label}</p>
            <p className="mt-[0.2em] text-[0.95em] font-semibold tabular-nums">{value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-[0.7em] overflow-hidden rounded-[0.5em] border border-forest-900/10 bg-white">
        <div className="grid grid-cols-[1fr_1fr_1.6fr_0.8fr_0.9fr] gap-[0.5em] border-b border-forest-900/10 px-[0.9em] py-[0.45em] text-[0.42em] uppercase tracking-[0.1em] text-ink-subtle">
          <span>Дата</span>
          <span>Имя</span>
          <span>Источник</span>
          <span>Менеджер</span>
          <span>Статус</span>
        </div>
        {leads.map((lead) => (
          <div
            key={lead.date}
            className="grid grid-cols-[1fr_1fr_1.6fr_0.8fr_0.9fr] items-center gap-[0.5em] border-b border-forest-900/6 px-[0.9em] py-[0.5em] text-[0.5em] last:border-b-0"
          >
            <span className="text-ink-subtle tabular-nums">{lead.date}</span>
            <span>{lead.name}</span>
            <span className="truncate text-ink-subtle">{lead.source}</span>
            <span className="text-ink-subtle">{lead.owner}</span>
            <span
              className={cn(
                "w-fit rounded-full px-[0.55em] py-[0.18em] text-[0.85em]",
                lead.state === "Новая"
                  ? "bg-harvest-100 text-harvest-800"
                  : lead.state === "Сделка"
                    ? "bg-forest-700 text-sand-50"
                    : lead.state === "В работе"
                      ? "bg-forest-800/10 text-forest-800"
                      : "bg-forest-900/6 text-ink-subtle",
              )}
            >
              {lead.state}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-[0.6em] text-[0.46em] leading-[1.6] text-ink-subtle">
        Источник сохраняется автоматически: страница, проект, квартира и UTM-метка.
        Заявка одновременно уходит на почту, в Telegram отдела продаж и в CRM.
      </p>
    </Chrome>
  );
}

function Users() {
  const people = [
    { name: "Азиз Каримов", mail: "admin@mavera.uz", role: "Администратор", last: "сейчас" },
    { name: "Нодира Юсупова", mail: "sales1@mavera.uz", role: "Отдел продаж", last: "14 минут назад" },
    { name: "Бекзод Раимов", mail: "sales2@mavera.uz", role: "Отдел продаж", last: "вчера" },
    { name: "Камола Эргашева", mail: "content@mavera.uz", role: "Контент-менеджер", last: "2 дня назад" },
    { name: "Агентство «Маркет»", mail: "agency@partner.uz", role: "Наблюдатель", last: "неделю назад" },
  ];

  const rights = [
    ["Правка сайта", "✓", "—", "✓", "—"],
    ["Цены и статусы квартир", "✓", "✓", "—", "—"],
    ["Заявки", "✓", "✓", "—", "просмотр"],
    ["Пользователи", "✓", "—", "—", "—"],
    ["Аналитика", "✓", "просмотр", "просмотр", "просмотр"],
  ];

  return (
    <Chrome active="users">
      <Title eyebrow="Настройки" title="Пользователи и роли" action="+ Пригласить" />

      <div className="mt-[0.9em] overflow-hidden rounded-[0.5em] border border-forest-900/10 bg-white">
        <div className="grid grid-cols-[1.6fr_1.4fr_1.2fr_1fr] gap-[0.5em] border-b border-forest-900/10 px-[0.9em] py-[0.45em] text-[0.42em] uppercase tracking-[0.1em] text-ink-subtle">
          <span>Сотрудник</span>
          <span>Почта</span>
          <span>Роль</span>
          <span>Был в системе</span>
        </div>
        {people.map((person) => (
          <div
            key={person.mail}
            className="grid grid-cols-[1.6fr_1.4fr_1.2fr_1fr] items-center gap-[0.5em] border-b border-forest-900/6 px-[0.9em] py-[0.5em] text-[0.5em] last:border-b-0"
          >
            <span className="flex items-center gap-[0.45em]">
              <span className="h-[1.3em] w-[1.3em] shrink-0 rounded-full bg-forest-800/15" />
              {person.name}
            </span>
            <span className="truncate text-ink-subtle">{person.mail}</span>
            <span>
              <span className="rounded-full bg-forest-800/10 px-[0.55em] py-[0.18em] text-[0.85em] text-forest-800">
                {person.role}
              </span>
            </span>
            <span className="text-ink-subtle">{person.last}</span>
          </div>
        ))}
      </div>

      <Card className="mt-[0.7em]">
        <p className="text-[0.55em] font-medium">Что может каждая роль</p>
        <div className="mt-[0.6em] overflow-hidden rounded-[0.4em] border border-forest-900/10">
          <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-[0.4em] border-b border-forest-900/10 bg-forest-900/4 px-[0.7em] py-[0.35em] text-[0.42em] uppercase tracking-[0.08em] text-ink-subtle">
            <span>Право</span>
            <span>Админ</span>
            <span>Продажи</span>
            <span>Контент</span>
            <span>Наблюдатель</span>
          </div>
          {rights.map((row) => (
            <div
              key={row[0]}
              className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-[0.4em] border-b border-forest-900/6 px-[0.7em] py-[0.38em] text-[0.48em] last:border-b-0"
            >
              {row.map((cell, index) => (
                <span key={index} className={index === 0 ? "" : cell === "✓" ? "text-forest-700" : "text-ink-subtle"}>
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>
        <p className="mt-[0.5em] text-[0.44em] leading-[1.6] text-ink-subtle">
          Журнал действий пишет, кто и когда поменял цену или статус квартиры —
          спорные правки разбираются по записи, а не по памяти.
        </p>
      </Card>
    </Chrome>
  );
}

function Analytics() {
  const sources = [
    { name: "Яндекс · поиск", visits: "4 120", leads: "38", share: 46 },
    { name: "Instagram", visits: "2 340", leads: "21", share: 26 },
    { name: "Прямые заходы", visits: "1 180", leads: "14", share: 13 },
    { name: "Telegram", visits: "760", leads: "9", share: 9 },
    { name: "Google · поиск", visits: "520", leads: "4", share: 6 },
  ];

  return (
    <Chrome active="analytics">
      <Title eyebrow="Продажи" title="Аналитика поведения" action="Открыть Метрику" />

      <div className="mt-[0.9em] grid grid-cols-2 gap-[0.5em] @min-[40rem]:grid-cols-4">
        {[
          ["Визиты за 7 дней", "8 920"],
          ["Глубина просмотра", "4,3 стр."],
          ["Время на сайте", "3:12"],
          ["Отказы", "18%"],
        ].map(([label, value]) => (
          <Card key={label}>
            <p className="text-[0.44em] uppercase tracking-[0.1em] text-ink-subtle">{label}</p>
            <p className="mt-[0.2em] text-[0.95em] font-semibold tabular-nums">{value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-[0.7em] grid gap-[0.6em] @min-[40rem]:grid-cols-[1.4fr_1fr]">
        <Card>
          <p className="text-[0.55em] font-medium">Источники и заявки</p>
          <div className="mt-[0.7em] space-y-[0.45em]">
            {sources.map((source) => (
              <div key={source.name}>
                <div className="flex items-baseline justify-between text-[0.48em]">
                  <span>{source.name}</span>
                  <span className="text-ink-subtle tabular-nums">
                    {source.visits} визитов · {source.leads} заявок
                  </span>
                </div>
                <span className="mt-[0.2em] block h-[0.3em] rounded-full bg-forest-900/8">
                  <span className="block h-full rounded-full bg-forest-700" style={{ width: `${source.share * 2}%` }} />
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-[0.55em] font-medium">Цели Метрики</p>
          <ul className="mt-[0.6em] space-y-[0.4em]">
            {[
              ["Заявка отправлена", "86"],
              ["Бронь квартиры", "14"],
              ["Открыт калькулятор", "412"],
              ["Клик по телефону", "193"],
              ["Скачан прайс", "77"],
            ].map(([goal, count]) => (
              <li key={goal} className="flex items-baseline justify-between border-b border-forest-900/6 pb-[0.35em] text-[0.48em] last:border-b-0">
                <span>{goal}</span>
                <span className="tabular-nums text-ink-subtle">{count}</span>
              </li>
            ))}
          </ul>
          <p className="mt-[0.6em] text-[0.44em] leading-[1.6] text-ink-subtle">
            Вебвизор и карта скроллов включены: видно, до какого блока дочитывают
            карточку проекта и где бросают калькулятор.
          </p>
        </Card>
      </div>
    </Chrome>
  );
}

function Media() {
  return (
    <Chrome active="media">
      <Title eyebrow="Каталог" title="Медиатека" action="Загрузить" />

      <div className="mt-[0.9em] rounded-[0.5em] border border-dashed border-forest-900/25 bg-white px-[1em] py-[1.1em] text-center">
        <p className="text-[0.55em] font-medium">Перетащите файлы в эту область</p>
        <p className="mt-[0.2em] text-[0.46em] text-ink-subtle">
          JPG, PNG, WebP, AVIF и PDF до 10 МБ · 84 файла в библиотеке
        </p>
      </div>

      <div className="mt-[0.7em] grid grid-cols-3 gap-[0.45em] @min-[40rem]:grid-cols-6">
        {Array.from({ length: 12 }, (_, tile) => (
          <div key={tile} className="overflow-hidden rounded-[0.4em] border border-forest-900/10 bg-white">
            <span className="block h-[2.8em] bg-forest-900/10" />
            <span className="block truncate px-[0.4em] py-[0.3em] text-[0.4em] text-ink-subtle">
              chinor-{tile + 1}.jpg
            </span>
          </div>
        ))}
      </div>
    </Chrome>
  );
}

const registry: Record<AdminScreenId, () => React.ReactNode> = {
  overview: Overview,
  projects: Projects,
  "project-form": ProjectForm,
  flats: Flats,
  leads: Leads,
  users: Users,
  analytics: Analytics,
  media: Media,
};

export function AdminScreen({ id }: { id: AdminScreenId }) {
  const Body = registry[id];

  return (
    <div className="flex min-h-full flex-col text-[2.6cqw] @min-[40rem]:text-[1.25cqw]">
      <Body />
    </div>
  );
}
