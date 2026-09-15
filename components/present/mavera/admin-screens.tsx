import { cn } from "@/lib/cn";

import type { AdminScreenId } from "./theme";

/**
 * Макеты панели управления.
 *
 * За основу взята админка Global Export: те же приёмы, что уже работают у
 * действующего клиента — язык переключается прямо в поле, точка на вкладке
 * показывает незаполненный перевод, фотографии кидаются перетаскиванием,
 * черновик виден только в панели.
 *
 * Палитра здесь своя и намеренно не меняется тумблером: оформление сайта —
 * предмет выбора заказчика, панель управления — рабочий инструмент, один на
 * все три варианта.
 */

const sections = [
  { label: "Обзор" },
  { label: "Проекты", active: true },
  { label: "Коммерция" },
  { label: "Страницы" },
  { label: "Заявки" },
  { label: "Медиа" },
];

const rows = [
  { title: "ЖК «Чинор»", meta: "Мирзо-Улугбекский · комфорт", published: true },
  { title: "ЖК «Дарё»", meta: "Яшнабадский · бизнес", published: true },
  { title: "ЖК «Бахор»", meta: "Сергелийский · эконом", published: true },
  { title: "ЖК «Олтин Водий»", meta: "Юнусабадский · комфорт", published: false },
  { title: "ЖК «Нур»", meta: "Чиланзарский · эконом", published: true },
];

const leads = [
  { date: "15.09, 14:32", name: "Азиз Р.", source: "ЖК «Чинор»", state: "Новая" },
  { date: "15.09, 11:04", name: "Дилноза К.", source: "Главная", state: "В работе" },
  { date: "14.09, 18:20", name: "Сергей М.", source: "Коммерция · аренда", state: "В работе" },
  { date: "14.09, 09:47", name: "Нилуфар А.", source: "ЖК «Дарё»", state: "Обработана" },
];

function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full bg-sand-100 text-forest-950">
      {/* Боковое меню панели. */}
      <aside
        className="w-[6.5em] shrink-0 border-r border-forest-900/10 bg-white @min-[40rem]:w-[10em]"
      >
        <div className="px-[1em] py-[1.1em]">
          <p className="text-[0.5em] font-semibold uppercase tracking-[0.18em] text-forest-600">
            MAVERA
          </p>
          <p className="mt-[0.2em] text-[0.62em] font-medium text-forest-950">Панель управления</p>
        </div>

        <nav className="px-[0.6em] pb-[1em]">
          {sections.map((section) => (
            <span
              key={section.label}
              className={cn(
                "mb-[0.15em] block rounded-[0.4em] px-[0.7em] py-[0.45em] text-[0.58em]",
                section.active
                  ? "bg-forest-800/10 font-medium text-forest-950"
                  : "text-forest-900/70",
              )}
            >
              {section.label}
            </span>
          ))}
        </nav>

        <div className="mt-auto border-t border-forest-900/10 px-[1em] py-[0.9em]">
          <p className="text-[0.5em] text-ink-subtle">admin@mavera.uz</p>
        </div>
      </aside>

      <div className="min-w-0 flex-1 px-[1.4em] py-[1.2em]">{children}</div>
    </div>
  );
}

function Toggle({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[0.35em] rounded-full px-[0.6em] py-[0.25em] text-[0.5em] font-medium",
        published ? "bg-forest-800/10 text-forest-800" : "bg-harvest-100 text-harvest-800",
      )}
    >
      <span
        className={cn(
          "h-[0.35em] w-[0.35em] rounded-full",
          published ? "bg-forest-600" : "bg-harvest-500",
        )}
      />
      {published ? "Опубликовано" : "Черновик"}
    </span>
  );
}

function Entries() {
  return (
    <Chrome>
      <div className="flex items-center justify-between gap-[1em]">
        <div>
          <h1 className="text-[1.1em] font-semibold text-forest-950">Проекты</h1>
          <p className="mt-[0.2em] text-[0.55em] text-ink-subtle">
            {rows.length} записей · 1 черновик
          </p>
        </div>
        <span className="rounded-full bg-forest-800 px-[1em] py-[0.5em] text-[0.55em] font-medium text-sand-50">
          Добавить проект
        </span>
      </div>

      <div className="mt-[1em] flex items-center gap-[0.5em]">
        <span className="flex-1 rounded-[0.4em] border border-forest-900/15 bg-white px-[0.8em] py-[0.5em] text-[0.55em] text-ink-subtle">
          Поиск по названию
        </span>
        <span className="rounded-[0.4em] border border-forest-900/15 px-[0.8em] py-[0.5em] text-[0.55em] text-ink-subtle">
          Все сегменты
        </span>
      </div>

      <ul className="mt-[1em] divide-y divide-forest-900/8 overflow-hidden rounded-[0.5em] border border-forest-900/10 bg-white">
        {rows.map((row) => (
          <li key={row.title} className="flex items-center gap-[0.8em] px-[0.9em] py-[0.7em]">
            <span className="h-[1.8em] w-[2.6em] shrink-0 rounded-[0.3em] bg-forest-900/10" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.62em] font-medium text-forest-950">
                {row.title}
              </span>
              <span className="mt-[0.15em] block truncate text-[0.52em] text-ink-subtle">
                {row.meta}
              </span>
            </span>
            <Toggle published={row.published} />
            <span className="text-[0.52em] text-ink-subtle">Изменить</span>
          </li>
        ))}
      </ul>
    </Chrome>
  );
}

function Editor() {
  return (
    <Chrome>
      <div className="flex items-center justify-between gap-[1em]">
        <div>
          <p className="text-[0.5em] uppercase tracking-[0.16em] text-ink-subtle">
            Проекты / Изменить
          </p>
          <h1 className="mt-[0.2em] text-[1.1em] font-semibold text-forest-950">ЖК «Чинор»</h1>
        </div>
        <span className="rounded-full bg-forest-800 px-[1em] py-[0.5em] text-[0.55em] font-medium text-sand-50">
          Сохранить
        </span>
      </div>

      <div className="mt-[1em] flex flex-col gap-[1em] @min-[40rem]:grid @min-[40rem]:grid-cols-3">
        <div className="col-span-2 rounded-[0.5em] border border-forest-900/10 bg-white p-[1em]">
          {/* Одно значение в трёх языках — вкладки с точкой заполненности. */}
          {[
            { label: "Название", value: "ЖК «Чинор»" },
            { label: "Описание", value: "", area: true },
          ].map((field) => (
            <div key={field.label} className="mb-[0.9em]">
              <div className="flex items-center justify-between">
                <span className="text-[0.55em] font-medium text-forest-900">{field.label}</span>
                <span className="flex gap-[0.2em]">
                  {["RU", "EN", "UZ"].map((code, index) => (
                    <span
                      key={code}
                      className={cn(
                        "flex items-center gap-[0.25em] rounded-[0.3em] px-[0.45em] py-[0.2em] text-[0.48em] font-medium",
                        index === 0 ? "bg-forest-800 text-sand-50" : "text-forest-800/70",
                      )}
                    >
                      {code}
                      <span
                        className={cn(
                          "h-[0.3em] w-[0.3em] rounded-full",
                          index === 2 ? "bg-harvest-400" : "bg-forest-500",
                        )}
                      />
                    </span>
                  ))}
                </span>
              </div>
              <div
                className={cn(
                  "mt-[0.4em] rounded-[0.4em] border border-forest-900/15 px-[0.7em] py-[0.5em] text-[0.55em]",
                  field.value ? "text-forest-950" : "text-ink-subtle",
                  field.area ? "h-[3.4em]" : "",
                )}
              >
                {field.value || "Текст на русском"}
              </div>
            </div>
          ))}

          {/* Характеристики — те же поля, что видны в карточке на сайте. */}
          <p className="mt-[1em] text-[0.55em] font-medium text-forest-900">Характеристики</p>
          <div className="mt-[0.5em] grid grid-cols-3 gap-[0.5em]">
            {[
              ["Площадь", "84 600 м²"],
              ["Блоков", "6"],
              ["Этажность", "9–16"],
              ["Квартир", "1 248"],
              ["Сегмент", "Комфорт"],
              ["Сдача", "IV кв. 2027"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[0.4em] border border-forest-900/12 px-[0.6em] py-[0.45em]"
              >
                <span className="block text-[0.45em] uppercase tracking-[0.1em] text-ink-subtle">
                  {label}
                </span>
                <span className="mt-[0.15em] block text-[0.55em] text-forest-950">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[0.8em]">
          <div className="rounded-[0.5em] border border-forest-900/10 bg-white p-[0.9em]">
            <p className="text-[0.55em] font-medium text-forest-900">Публикация</p>
            <div className="mt-[0.5em] flex items-center gap-[0.4em]">
              <span className="flex h-[0.8em] w-[1.4em] items-center rounded-full bg-forest-700 px-[0.15em]">
                <span className="ml-auto h-[0.5em] w-[0.5em] rounded-full bg-white" />
              </span>
              <span className="text-[0.52em] text-ink-subtle">Опубликовано</span>
            </div>
            <p className="mt-[0.6em] text-[0.48em] leading-[1.5] text-ink-subtle">
              Адрес страницы: /projects/chinor — составлен из названия, кириллица
              транслитерирована.
            </p>
          </div>

          {/* Загрузка рендеров перетаскиванием. */}
          <div className="rounded-[0.5em] border border-dashed border-forest-900/25 bg-white p-[0.9em] text-center">
            <p className="text-[0.55em] font-medium text-forest-900">Фотографии и рендеры</p>
            <p className="mt-[0.3em] text-[0.48em] text-ink-subtle">
              Перетащите файлы сюда или выберите из медиатеки
            </p>
            <div className="mt-[0.6em] grid grid-cols-3 gap-[0.35em]">
              {[0, 1, 2, 3, 4, 5].map((tile) => (
                <span key={tile} className="block h-[1.6em] rounded-[0.25em] bg-forest-900/10" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Chrome>
  );
}

function Media() {
  return (
    <Chrome>
      <div className="flex items-center justify-between gap-[1em]">
        <div>
          <h1 className="text-[1.1em] font-semibold text-forest-950">Медиатека</h1>
          <p className="mt-[0.2em] text-[0.55em] text-ink-subtle">
            84 файла · JPG, PNG, WebP, AVIF, PDF до 10 МБ
          </p>
        </div>
        <span className="rounded-full bg-forest-800 px-[1em] py-[0.5em] text-[0.55em] font-medium text-sand-50">
          Загрузить
        </span>
      </div>

      <div className="mt-[1em] rounded-[0.5em] border border-dashed border-forest-900/25 bg-white px-[1em] py-[1.2em] text-center">
        <p className="text-[0.58em] font-medium text-forest-900">
          Перетащите файлы в эту область
        </p>
        <p className="mt-[0.25em] text-[0.5em] text-ink-subtle">
          Или нажмите, чтобы выбрать — то же самое доступно с клавиатуры
        </p>
      </div>

      <div className="mt-[1em] grid grid-cols-3 gap-[0.5em] @min-[40rem]:grid-cols-5">
        {Array.from({ length: 10 }, (_, tile) => (
          <div key={tile} className="overflow-hidden rounded-[0.4em] border border-forest-900/10 bg-white">
            <span className="block h-[3.2em] bg-forest-900/10" />
            <span className="block truncate px-[0.4em] py-[0.35em] text-[0.45em] text-ink-subtle">
              chinor-{tile + 1}.jpg
            </span>
          </div>
        ))}
      </div>
    </Chrome>
  );
}

function Leads() {
  return (
    <Chrome>
      <div className="flex items-center justify-between gap-[1em]">
        <div>
          <h1 className="text-[1.1em] font-semibold text-forest-950">Заявки</h1>
          <p className="mt-[0.2em] text-[0.55em] text-ink-subtle">
            4 новые за сутки · источник сохраняется автоматически
          </p>
        </div>
        <span className="rounded-full border border-forest-900/15 px-[1em] py-[0.5em] text-[0.55em] text-forest-900">
          Выгрузить
        </span>
      </div>

      <div className="mt-[1em] overflow-hidden rounded-[0.5em] border border-forest-900/10 bg-white">
        <div className="grid grid-cols-[1.1fr_1fr_1.3fr_0.9fr] gap-[0.6em] border-b border-forest-900/10 px-[0.9em] py-[0.5em] text-[0.48em] uppercase tracking-[0.1em] text-ink-subtle">
          <span>Дата</span>
          <span>Имя</span>
          <span>Источник</span>
          <span>Статус</span>
        </div>
        {leads.map((lead) => (
          <div
            key={lead.date}
            className="grid grid-cols-[1.1fr_1fr_1.3fr_0.9fr] items-center gap-[0.6em] border-b border-forest-900/6 px-[0.9em] py-[0.6em] text-[0.55em] text-forest-950 last:border-b-0"
          >
            <span className="text-ink-subtle">{lead.date}</span>
            <span>{lead.name}</span>
            <span className="truncate text-ink-subtle">{lead.source}</span>
            <span
              className={cn(
                "w-fit rounded-full px-[0.6em] py-[0.2em] text-[0.85em]",
                lead.state === "Новая"
                  ? "bg-harvest-100 text-harvest-800"
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

      <p className="mt-[0.8em] text-[0.5em] leading-[1.6] text-ink-subtle">
        Заявка одновременно уходит на почту и в Telegram отдела продаж. В «Премиуме»
        она же попадает в CRM с сохранением источника и UTM-меток.
      </p>
    </Chrome>
  );
}

const registry: Record<AdminScreenId, () => React.ReactNode> = {
  entries: Entries,
  editor: Editor,
  media: Media,
  leads: Leads,
};

export function AdminScreen({ id }: { id: AdminScreenId }) {
  const Body = registry[id];

  return (
    <div className="flex min-h-full flex-col text-[2.6cqw] @min-[40rem]:text-[1.25cqw]">
      <Body />
    </div>
  );
}
