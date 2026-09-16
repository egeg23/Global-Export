"use client";

import { Addon, useAddon } from "@/components/configurator/context";
import {
  FlatsScreen,
  LeadsScreen,
  ProjectFormScreen,
} from "@/components/mavera/admin/live-screens";
import { Card, Chrome, Title, adminSections, type AdminScreenId } from "@/components/mavera/admin/ui";
import { cn } from "@/lib/cn";

/**
 * Панель управления MAVERA — девять экранов.
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
 *
 * Три экрана из девяти работают по-настоящему и живут в live-screens.tsx:
 * шахматка, карточка ЖК и заявки. Остальные показывают вид — этого хватает,
 * чтобы понять устройство, и честно названо в подписи под кадром.
 */

export { adminSections, type AdminScreenId };

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

      {/* Допник «Роли и права»: без него роль — только подпись, с ним — матрица прав. */}
      <Addon id="roles" className="mt-[0.7em]">
      <Card>
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
          Права назначаются ролью, а не по одному: новый менеджер получает всё
          нужное одним переключателем.
        </p>
      </Card>
      </Addon>
    </Chrome>
  );
}

/** Журнал действий — допник «Журнал»: кто, когда и что поменял. */
function Audit() {
  const rows = [
    { when: "15.09, 14:40", who: "Нодира Юсупова", what: "Квартира 3-7-42 · статус", from: "Свободна", to: "Бронь" },
    { when: "15.09, 12:15", who: "Азиз Каримов", what: "Корпус 3 · цена за м²", from: "11 080 000", to: "11 412 050" },
    { when: "15.09, 09:02", who: "Камола Эргашева", what: "ЖК «Дарё» · текст EN", from: "черновик", to: "опубликован" },
    { when: "14.09, 18:31", who: "Бекзод Раимов", what: "Заявка #1042 · менеджер", from: "—", to: "Бекзод" },
    { when: "14.09, 10:07", who: "Азиз Каримов", what: "Пользователь agency@partner.uz", from: "—", to: "Наблюдатель" },
    { when: "13.09, 16:12", who: "Нодира Юсупова", what: "Квартира 1-12-08 · статус", from: "Бронь", to: "Продана" },
  ];

  return (
    <Chrome active="audit">
      <Title eyebrow="Настройки" title="Журнал действий" action="Выгрузить за месяц" />

      <Addon id="audit" className="mt-[0.9em]">
        <div className="flex flex-wrap items-center gap-[0.4em]">
          {["Все", "Цены", "Статусы", "Тексты", "Пользователи"].map((chip, index) => (
            <span
              key={chip}
              className={cn(
                "rounded-full px-[0.8em] py-[0.32em] text-[0.48em]",
                index === 0 ? "bg-forest-800 text-sand-50" : "border border-forest-900/15 text-ink-subtle",
              )}
            >
              {chip}
            </span>
          ))}
          <span className="ml-auto text-[0.48em] text-ink-subtle">Хранится 12 месяцев</span>
        </div>

        <div className="mt-[0.7em] overflow-hidden rounded-[0.5em] border border-forest-900/10 bg-white">
          <div className="grid grid-cols-[1fr_1.3fr_1.8fr_1fr_1fr] gap-[0.5em] border-b border-forest-900/10 px-[0.9em] py-[0.45em] text-[0.42em] uppercase tracking-[0.1em] text-ink-subtle">
            <span>Когда</span>
            <span>Кто</span>
            <span>Что</span>
            <span>Было</span>
            <span>Стало</span>
          </div>
          {rows.map((row) => (
            <div
              key={row.when + row.what}
              className="grid grid-cols-[1fr_1.3fr_1.8fr_1fr_1fr] items-center gap-[0.5em] border-b border-forest-900/6 px-[0.9em] py-[0.5em] text-[0.5em] last:border-b-0"
            >
              <span className="text-ink-subtle tabular-nums">{row.when}</span>
              <span>{row.who}</span>
              <span className="truncate text-ink-subtle">{row.what}</span>
              <span className="truncate text-ink-subtle line-through decoration-forest-900/30">{row.from}</span>
              <span className="truncate font-medium">{row.to}</span>
            </div>
          ))}
        </div>

        <p className="mt-[0.6em] text-[0.46em] leading-[1.6] text-ink-subtle">
          Спорные правки разбираются по записи, а не по памяти: любое изменение
          цены, статуса или текста можно откатить одной кнопкой.
        </p>
      </Addon>
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

  const metrika = useAddon("metrika");

  return (
    <Chrome active="analytics">
      <Title eyebrow="Продажи" title="Аналитика поведения" action={metrika ? "Открыть Метрику" : "Подключить Метрику"} />

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

      {/* Допник «Метрика в панели»: источники, цели и вебвизор — здесь, а не в отдельном сервисе. */}
      <Addon id="metrika" className="mt-[0.7em]">
      <div className="grid gap-[0.6em] @min-[40rem]:grid-cols-[1.4fr_1fr]">
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
      </Addon>
      {metrika ? null : (
        <p className="mt-[0.7em] text-[0.46em] leading-[1.6] text-ink-subtle">
          Счётчик на сайте стоит, отчёты — в интерфейсе Яндекс.Метрики. Источники,
          цели и вебвизор внутри панели — допник.
        </p>
      )}
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
  "project-form": ProjectFormScreen,
  flats: FlatsScreen,
  leads: LeadsScreen,
  users: Users,
  analytics: Analytics,
  media: Media,
  audit: Audit,
};

export function AdminScreen({ id }: { id: AdminScreenId }) {
  const Body = registry[id];

  return (
    <div className="flex min-h-full flex-col text-[2.6cqw] @min-[40rem]:text-[1.25cqw]">
      <Body />
    </div>
  );
}
