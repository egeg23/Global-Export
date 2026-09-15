import { cn } from "@/lib/cn";

import { Skyline } from "./skyline";
import type { ScreenId } from "./theme";

/**
 * Макеты страниц MAVERA.
 *
 * Не картинки: каждый экран — настоящая вёрстка, поэтому он перекрашивается
 * тумблером, остаётся чётким на любом экране и в развёрнутом виде листается,
 * как страница. Размеры заданы в `em` от корня, а корень — в `cqw`: один
 * множитель масштабирует макет целиком под ширину рамки, без JS-измерений.
 *
 * Цифры, названия ЖК и адреса — заглушки. Они заменяются данными MAVERA при
 * наполнении; выдумывать за застройщика его портфель мы не будем.
 */

type Device = "desktop" | "mobile";

type ScreenProps = { device: Device };

const nav = ["Главная", "О компании", "Проекты", "Коммерция", "Контакты"];

const projects = [
  { name: "Чинор", district: "Мирзо-Улугбекский", segment: "Комфорт", status: "Строится" },
  { name: "Дарё", district: "Яшнабадский", segment: "Бизнес", status: "Продаётся" },
  { name: "Бахор", district: "Сергелийский", segment: "Эконом", status: "Сдан" },
  { name: "Олтин Водий", district: "Юнусабадский", segment: "Комфорт", status: "Строится" },
  { name: "Нур", district: "Чиланзарский", segment: "Эконом", status: "Сдан" },
  { name: "Зарафшон", district: "Мирабадский", segment: "Бизнес", status: "Продаётся" },
];

const segments = [
  { name: "Эконом", note: "Практичные планировки, готовая инфраструктура" },
  { name: "Комфорт", note: "Закрытый двор, подземный паркинг, отделка" },
  { name: "Бизнес", note: "Панорамное остекление, консьерж, клубный формат" },
];

const figures = [
  { value: "48", label: "объектов сдано" },
  { value: "1,24", suffix: "млн м²", label: "построено" },
  { value: "12 400", label: "квартир" },
  { value: "14", label: "лет на рынке" },
];

/* ------------------------------------------------------------------ */
/* Примитивы макета                                                    */
/* ------------------------------------------------------------------ */

/** Строка «текста» — в макете она важна как ритм, а не как содержание. */
function Line({ w = "100%", dim = 1 }: { w?: string; dim?: number }) {
  return (
    <span
      className="block h-[0.4em] rounded-full bg-[var(--mv-text)]"
      style={{ width: w, opacity: 0.12 * dim }}
    />
  );
}

function Lines({ rows = 3, className }: { rows?: number; className?: string }) {
  const widths = ["100%", "92%", "78%", "86%", "64%"];
  return (
    <span className={cn("flex flex-col gap-[0.45em]", className)}>
      {Array.from({ length: rows }, (_, index) => (
        <Line key={index} w={widths[index % widths.length]} />
      ))}
    </span>
  );
}

function Pill({
  children,
  active,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-[0.9em] py-[0.35em] text-[0.62em] font-medium whitespace-nowrap transition-colors duration-500",
        active
          ? "bg-[var(--mv-accent)] text-[var(--mv-accent-ink)]"
          : "border border-[var(--mv-line)] text-[var(--mv-muted)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[0.4em] rounded-full bg-[var(--mv-accent-soft)] px-[0.7em] py-[0.3em] text-[0.55em] font-medium uppercase tracking-[0.12em] text-[var(--mv-accent)]">
      <span className="h-[0.35em] w-[0.35em] rounded-full bg-[var(--mv-accent)]" />
      {children}
    </span>
  );
}

function Header({ device }: ScreenProps) {
  return (
    <header className="flex items-center justify-between border-b border-[var(--mv-line)] px-[2em] py-[1.1em] transition-colors duration-500">
      <span className="text-[0.95em] font-semibold tracking-[0.34em] text-[var(--mv-text)]">
        MAVERA
      </span>

      {device === "desktop" ? (
        <nav className="flex items-center gap-[1.6em] text-[0.62em] text-[var(--mv-muted)]">
          {nav.map((item, index) => (
            <span key={item} className={index === 0 ? "text-[var(--mv-text)]" : undefined}>
              {item}
            </span>
          ))}
        </nav>
      ) : null}

      <span className="flex items-center gap-[0.5em]">
        <span className="rounded-full border border-[var(--mv-line)] px-[0.7em] py-[0.25em] text-[0.55em] tracking-[0.1em] text-[var(--mv-muted)]">
          RU <span className="text-[var(--mv-faint)]">/ EN / UZ</span>
        </span>
        {device === "mobile" ? (
          <span className="flex flex-col gap-[0.22em]">
            <span className="block h-[0.12em] w-[1.1em] rounded-full bg-[var(--mv-text)]" />
            <span className="block h-[0.12em] w-[1.1em] rounded-full bg-[var(--mv-text)]" />
            <span className="block h-[0.12em] w-[1.1em] rounded-full bg-[var(--mv-text)]" />
          </span>
        ) : null}
      </span>
    </header>
  );
}

/** Карточка проекта — общая для главной, списка и похожих объектов. */
function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <div className="overflow-hidden rounded-[0.7em] border border-[var(--mv-line)] bg-[var(--mv-surface)] transition-colors duration-500">
      <div className="relative h-[6.5em] overflow-hidden">
        <Skyline depth={0.35} />
        <span className="absolute left-[0.8em] top-[0.8em]">
          <Badge>{project.status}</Badge>
        </span>
      </div>
      <div className="px-[1em] pb-[1.1em] pt-[0.9em]">
        <p className="text-[0.85em] font-medium text-[var(--mv-text)]">ЖК «{project.name}»</p>
        <p className="mt-[0.3em] text-[0.6em] text-[var(--mv-muted)]">{project.district}</p>
        <div className="mt-[0.9em] flex items-center justify-between border-t border-[var(--mv-line)] pt-[0.7em]">
          <span className="text-[0.58em] text-[var(--mv-muted)]">{project.segment}</span>
          <span className="text-[0.58em] text-[var(--mv-accent)]">Подробнее →</span>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--mv-line)] px-[2em] py-[1.4em] transition-colors duration-500">
      <div className="flex items-center justify-between">
        <span className="text-[0.7em] tracking-[0.3em] text-[var(--mv-text)]">MAVERA</span>
        <span className="flex gap-[0.5em]">
          {["IG", "TG", "WA"].map((item) => (
            <span
              key={item}
              className="flex h-[1.6em] w-[1.6em] items-center justify-center rounded-full border border-[var(--mv-line)] text-[0.5em] text-[var(--mv-muted)]"
            >
              {item}
            </span>
          ))}
        </span>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Экраны                                                              */
/* ------------------------------------------------------------------ */

function Home({ device }: ScreenProps) {
  const mobile = device === "mobile";

  return (
    <>
      <Header device={device} />

      {/* Первый экран: карусель рендеров во всю ширину. */}
      <section className={cn("relative overflow-hidden", mobile ? "h-[20em]" : "h-[17em]")}>
        <div className="absolute inset-0">
          <Skyline />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--mv-bg)] via-[var(--mv-bg)]/45 to-transparent" />

        <div className="relative flex h-full flex-col justify-end px-[2em] pb-[1.8em]">
          <span className="text-[0.55em] uppercase tracking-[0.3em] text-[var(--mv-accent)]">
            Девелопер полного цикла
          </span>
          <h1
            className={cn(
              "mt-[0.5em] font-semibold leading-[1.05] text-[var(--mv-text)]",
              mobile ? "text-[2em]" : "text-[2.6em]",
            )}
          >
            Дом, который
            <br />
            держит слово
          </h1>
          <div className="mt-[1.2em] flex items-center gap-[0.6em]">
            <Pill active>Купить</Pill>
            <Pill>Арендовать</Pill>
          </div>

          <span className="mt-[1.4em] flex items-center gap-[0.4em]">
            {[0, 1, 2, 3].map((dot) => (
              <span
                key={dot}
                className={cn(
                  "h-[0.3em] rounded-full transition-all duration-500",
                  dot === 0 ? "w-[1.6em] bg-[var(--mv-accent)]" : "w-[0.3em] bg-[var(--mv-faint)]",
                )}
              />
            ))}
          </span>
        </div>
      </section>

      {/* Инфографика по построенному. */}
      <section
        className={cn(
          "grid gap-[1.2em] border-b border-[var(--mv-line)] px-[2em] py-[1.8em] transition-colors duration-500",
          mobile ? "grid-cols-2" : "grid-cols-4",
        )}
      >
        {figures.map((figure) => (
          <div key={figure.label}>
            <p className="text-[1.5em] font-semibold leading-none text-[var(--mv-text)]">
              {figure.value}
              {figure.suffix ? (
                <span className="ml-[0.2em] text-[0.45em] text-[var(--mv-accent)]">
                  {figure.suffix}
                </span>
              ) : null}
            </p>
            <p className="mt-[0.5em] text-[0.58em] text-[var(--mv-muted)]">{figure.label}</p>
          </div>
        ))}
      </section>

      {/* История компании. */}
      <section className={cn("px-[2em] py-[1.8em]", mobile ? "" : "grid grid-cols-2 gap-[2em]")}>
        <div>
          <span className="text-[0.55em] uppercase tracking-[0.28em] text-[var(--mv-accent)]">
            История компании
          </span>
          <p className="mt-[0.6em] text-[1.15em] leading-[1.25] text-[var(--mv-text)]">
            Четырнадцать лет мы строим жильё, в которое возвращаются за вторым
            домом.
          </p>
        </div>
        <Lines rows={4} className={mobile ? "mt-[1em]" : "mt-[0.4em]"} />
      </section>

      {/* Сегментация ЖК. */}
      <section className="px-[2em] pb-[1.8em]">
        <div className={cn("grid gap-[0.9em]", mobile ? "grid-cols-1" : "grid-cols-3")}>
          {segments.map((segment) => (
            <div
              key={segment.name}
              className="rounded-[0.7em] border border-[var(--mv-line)] bg-[var(--mv-surface)] p-[1.1em] transition-colors duration-500"
            >
              <p className="text-[0.85em] font-medium text-[var(--mv-text)]">{segment.name}</p>
              <p className="mt-[0.4em] text-[0.58em] leading-[1.5] text-[var(--mv-muted)]">
                {segment.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Проекты с переходом на карточку. */}
      <section className="px-[2em] pb-[2em]">
        <div className="mb-[1em] flex items-end justify-between">
          <h2 className="text-[1.1em] font-medium text-[var(--mv-text)]">Наши проекты</h2>
          <span className="text-[0.58em] text-[var(--mv-accent)]">Все проекты →</span>
        </div>
        <div className={cn("grid gap-[0.9em]", mobile ? "grid-cols-1" : "grid-cols-3")}>
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

function Projects({ device }: ScreenProps) {
  const mobile = device === "mobile";

  return (
    <>
      <Header device={device} />

      <section className="px-[2em] pb-[1.2em] pt-[1.8em]">
        <span className="text-[0.55em] uppercase tracking-[0.3em] text-[var(--mv-accent)]">
          Портфолио
        </span>
        <h1 className="mt-[0.4em] text-[2em] font-semibold leading-[1.1] text-[var(--mv-text)]">
          Проекты
        </h1>

        <div className="mt-[1.3em] flex flex-wrap items-center gap-[0.5em]">
          <Pill active>Все</Pill>
          {segments.map((segment) => (
            <Pill key={segment.name}>{segment.name}</Pill>
          ))}
          <span className="ml-auto text-[0.58em] text-[var(--mv-muted)]">
            Найдено: {projects.length}
          </span>
        </div>
      </section>

      <section className="px-[2em] pb-[2em]">
        <div className={cn("grid gap-[0.9em]", mobile ? "grid-cols-1" : "grid-cols-3")}>
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

function Project({ device }: ScreenProps) {
  const mobile = device === "mobile";
  const specs = [
    { label: "Площадь", value: "84 600 м²" },
    { label: "Блоков", value: "6" },
    { label: "Этажность", value: "9–16" },
    { label: "Квартир", value: "1 248" },
    { label: "Сегмент", value: "Комфорт" },
    { label: "Сдача", value: "IV кв. 2027" },
  ];

  return (
    <>
      <Header device={device} />

      {/* Галерея: крупный рендер и превью. */}
      <section className="px-[2em] pt-[1.4em]">
        <p className="text-[0.58em] text-[var(--mv-muted)]">
          Проекты <span className="text-[var(--mv-faint)]">/</span> ЖК «Чинор»
        </p>
        <div className={cn("mt-[0.8em] grid gap-[0.6em]", mobile ? "" : "grid-cols-4")}>
          <div
            className={cn(
              "relative overflow-hidden rounded-[0.7em]",
              mobile ? "h-[11em]" : "col-span-3 h-[13em]",
            )}
          >
            <Skyline depth={0.6} />
            <span className="absolute left-[1em] top-[1em]">
              <Badge>Строится</Badge>
            </span>
          </div>
          <div className={cn("grid gap-[0.6em]", mobile ? "mt-[0.6em] grid-cols-3" : "grid-rows-3")}>
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={cn(
                  "relative overflow-hidden rounded-[0.5em]",
                  mobile ? "h-[3.4em]" : "",
                )}
              >
                <Skyline depth={0.2} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={cn("px-[2em] py-[1.6em]", mobile ? "" : "grid grid-cols-3 gap-[2em]")}>
        <div className="col-span-2">
          <h1 className="text-[1.9em] font-semibold leading-[1.1] text-[var(--mv-text)]">
            ЖК «Чинор»
          </h1>
          <p className="mt-[0.5em] text-[0.65em] text-[var(--mv-muted)]">
            Ташкент, Мирзо-Улугбекский район
          </p>
          <Lines rows={3} className="mt-[1.1em]" />

          <div
            className={cn(
              "mt-[1.4em] grid gap-y-[1em] border-t border-[var(--mv-line)] pt-[1.2em]",
              mobile ? "grid-cols-2" : "grid-cols-3",
            )}
          >
            {specs.map((spec) => (
              <div key={spec.label}>
                <p className="text-[0.55em] uppercase tracking-[0.14em] text-[var(--mv-muted)]">
                  {spec.label}
                </p>
                <p className="mt-[0.3em] text-[0.95em] font-medium text-[var(--mv-text)]">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Заявка по конкретному объекту. */}
        <aside
          className={cn(
            "rounded-[0.7em] border border-[var(--mv-line)] bg-[var(--mv-surface)] p-[1.2em] transition-colors duration-500",
            mobile ? "mt-[1.4em]" : "",
          )}
        >
          <p className="text-[0.8em] font-medium text-[var(--mv-text)]">Отдел продаж проекта</p>
          <p className="mt-[0.5em] text-[1.05em] text-[var(--mv-text)]">+998 (__) ___-__-__</p>
          <p className="mt-[0.3em] text-[0.58em] text-[var(--mv-muted)]">
            Ежедневно, 09:00 — 19:00
          </p>
          <span className="mt-[1.1em] flex w-full items-center justify-center rounded-full bg-[var(--mv-accent)] py-[0.7em] text-[0.62em] font-medium text-[var(--mv-accent-ink)]">
            Оставить заявку
          </span>
          <span className="mt-[0.6em] flex w-full items-center justify-center rounded-full border border-[var(--mv-line)] py-[0.7em] text-[0.62em] text-[var(--mv-muted)]">
            Написать в Telegram
          </span>
        </aside>
      </section>

      <Footer />
    </>
  );
}

function Commercial({ device }: ScreenProps) {
  const mobile = device === "mobile";
  const objects = [
    { name: "Бизнес-центр на Амира Темура", area: "4 200 м²", kind: "Бизнес-центр", status: "Свободно" },
    { name: "Торговая галерея «Чинор»", area: "1 850 м²", kind: "Торговый центр", status: "Бронь" },
    { name: "Отдельно стоящее здание", area: "960 м²", kind: "Здание", status: "Свободно" },
    { name: "Помещение в ЖК «Дарё»", area: "310 м²", kind: "Помещение в ЖК", status: "Свободно" },
  ];

  return (
    <>
      <Header device={device} />

      <section className="px-[2em] pb-[1.2em] pt-[1.8em]">
        <span className="text-[0.55em] uppercase tracking-[0.3em] text-[var(--mv-accent)]">
          Коммерческая недвижимость
        </span>

        {/* Продажа / Аренда — отдельными вкладками, как в брифе. */}
        <div className="mt-[0.9em] flex items-center gap-[1.4em] border-b border-[var(--mv-line)]">
          {["Продажа", "Аренда"].map((tab, index) => (
            <span
              key={tab}
              className={cn(
                "relative pb-[0.7em] text-[0.9em] transition-colors duration-500",
                index === 0
                  ? "font-medium text-[var(--mv-text)]"
                  : "text-[var(--mv-muted)]",
              )}
            >
              {tab}
              {index === 0 ? (
                <span className="absolute inset-x-0 bottom-[-0.06em] h-[0.12em] rounded-full bg-[var(--mv-accent)]" />
              ) : null}
            </span>
          ))}
        </div>

        <div className="mt-[1.1em] flex flex-wrap gap-[0.5em]">
          <Pill active>Все категории</Pill>
          <Pill>Отдельно стоящие здания</Pill>
          <Pill>Бизнес-центры</Pill>
          <Pill>Торговые центры</Pill>
          <Pill>Помещения в ЖК</Pill>
        </div>
      </section>

      <section className="px-[2em] pb-[1.6em]">
        <div className={cn("grid gap-[0.9em]", mobile ? "grid-cols-1" : "grid-cols-2")}>
          {objects.map((object) => (
            <div
              key={object.name}
              className="flex gap-[1em] rounded-[0.7em] border border-[var(--mv-line)] bg-[var(--mv-surface)] p-[0.8em] transition-colors duration-500"
            >
              <div className="relative h-[5em] w-[7em] shrink-0 overflow-hidden rounded-[0.5em]">
                <Skyline depth={0.25} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-[0.6em]">
                  <p className="text-[0.75em] font-medium leading-[1.3] text-[var(--mv-text)]">
                    {object.name}
                  </p>
                  <Badge>{object.status}</Badge>
                </div>
                <p className="mt-[0.4em] text-[0.58em] text-[var(--mv-muted)]">{object.kind}</p>
                <p className="mt-[0.6em] text-[0.85em] font-medium text-[var(--mv-text)]">
                  {object.area}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Свой канал связи у раздела. */}
      <section className="px-[2em] pb-[2em]">
        <div
          className={cn(
            "rounded-[0.7em] bg-[var(--mv-accent-soft)] p-[1.3em] transition-colors duration-500",
            mobile ? "" : "flex items-center justify-between gap-[2em]",
          )}
        >
          <div>
            <p className="text-[0.95em] font-medium text-[var(--mv-text)]">
              Отдел коммерческой недвижимости
            </p>
            <p className="mt-[0.4em] text-[0.6em] text-[var(--mv-muted)]">
              Заявки из этого раздела идут отдельной линией, мимо общего отдела продаж.
            </p>
          </div>
          <span
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[var(--mv-accent)] px-[1.4em] py-[0.7em] text-[0.62em] font-medium text-[var(--mv-accent-ink)]",
              mobile ? "mt-[1em] w-full" : "",
            )}
          >
            Запросить подборку
          </span>
        </div>
      </section>

      <Footer />
    </>
  );
}

function About({ device }: ScreenProps) {
  const mobile = device === "mobile";
  const years = [
    { year: "2012", height: "22%" },
    { year: "2015", height: "38%" },
    { year: "2018", height: "54%" },
    { year: "2021", height: "72%" },
    { year: "2024", height: "88%" },
    { year: "2026", height: "100%" },
  ];

  return (
    <>
      <Header device={device} />

      <section className="relative h-[11em] overflow-hidden">
        <div className="absolute inset-0">
          <Skyline depth={0.5} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--mv-bg)] to-transparent" />
        <div className="relative flex h-full items-end px-[2em] pb-[1.4em]">
          <h1 className="text-[2em] font-semibold leading-[1.05] text-[var(--mv-text)]">
            О компании
          </h1>
        </div>
      </section>

      <section className={cn("px-[2em] py-[1.8em]", mobile ? "" : "grid grid-cols-2 gap-[2.4em]")}>
        <div>
          <span className="text-[0.55em] uppercase tracking-[0.28em] text-[var(--mv-accent)]">
            Миссия
          </span>
          <p className="mt-[0.6em] text-[1.15em] leading-[1.3] text-[var(--mv-text)]">
            Строить жильё, которое остаётся современным через двадцать лет после
            сдачи.
          </p>
        </div>
        <Lines rows={5} className={mobile ? "mt-[1.2em]" : ""} />
      </section>

      <section
        className={cn(
          "grid gap-[1.2em] border-y border-[var(--mv-line)] px-[2em] py-[1.6em] transition-colors duration-500",
          mobile ? "grid-cols-2" : "grid-cols-4",
        )}
      >
        {figures.map((figure) => (
          <div key={figure.label}>
            <p className="text-[1.5em] font-semibold leading-none text-[var(--mv-text)]">
              {figure.value}
              {figure.suffix ? (
                <span className="ml-[0.2em] text-[0.45em] text-[var(--mv-accent)]">
                  {figure.suffix}
                </span>
              ) : null}
            </p>
            <p className="mt-[0.5em] text-[0.58em] text-[var(--mv-muted)]">{figure.label}</p>
          </div>
        ))}
      </section>

      {/* Инфографика по объёму строительства. */}
      <section className="px-[2em] py-[1.8em]">
        <h2 className="text-[1.05em] font-medium text-[var(--mv-text)]">
          Объём строительства по годам
        </h2>
        <div className="mt-[1.2em] flex h-[7em] items-end gap-[0.8em]">
          {years.map((entry) => (
            <div key={entry.year} className="flex flex-1 flex-col items-center gap-[0.5em]">
              <span
                className="w-full rounded-t-[0.3em] bg-[var(--mv-accent)] transition-colors duration-500"
                style={{ height: entry.height, opacity: 0.35 + parseInt(entry.height, 10) / 160 }}
              />
              <span className="text-[0.52em] text-[var(--mv-muted)]">{entry.year}</span>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

function Contacts({ device }: ScreenProps) {
  const mobile = device === "mobile";

  return (
    <>
      <Header device={device} />

      <section className={cn("px-[2em] py-[1.8em]", mobile ? "" : "grid grid-cols-2 gap-[2em]")}>
        <div>
          <span className="text-[0.55em] uppercase tracking-[0.3em] text-[var(--mv-accent)]">
            Контакты
          </span>
          <h1 className="mt-[0.4em] text-[2em] font-semibold leading-[1.1] text-[var(--mv-text)]">
            Приезжайте в офис
          </h1>

          <dl className="mt-[1.4em] flex flex-col gap-[1em]">
            {[
              { label: "Телефон", value: "+998 (__) ___-__-__" },
              { label: "Почта", value: "info@mavera.uz" },
              { label: "Адрес", value: "Ташкент, ул. ______, 00" },
            ].map((row) => (
              <div key={row.label} className="border-b border-[var(--mv-line)] pb-[0.8em]">
                <dt className="text-[0.55em] uppercase tracking-[0.14em] text-[var(--mv-muted)]">
                  {row.label}
                </dt>
                <dd className="mt-[0.3em] text-[0.95em] text-[var(--mv-text)]">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-[1.2em] flex gap-[0.5em]">
            <Pill>Instagram</Pill>
            <Pill>Telegram</Pill>
            <Pill>WhatsApp</Pill>
          </div>
        </div>

        {/* Форма обратной связи. */}
        <div
          className={cn(
            "rounded-[0.7em] border border-[var(--mv-line)] bg-[var(--mv-surface)] p-[1.3em] transition-colors duration-500",
            mobile ? "mt-[1.6em]" : "",
          )}
        >
          <p className="text-[0.9em] font-medium text-[var(--mv-text)]">Написать нам</p>
          <div className="mt-[1em] flex flex-col gap-[0.7em]">
            {["Имя", "Телефон", "Комментарий"].map((field) => (
              <div
                key={field}
                className={cn(
                  "flex items-start rounded-[0.5em] border border-[var(--mv-line)] px-[0.9em] py-[0.7em] text-[0.6em] text-[var(--mv-muted)]",
                  field === "Комментарий" ? "h-[3.4em]" : "",
                )}
              >
                {field}
              </div>
            ))}
          </div>
          <span className="mt-[1em] flex w-full items-center justify-center rounded-full bg-[var(--mv-accent)] py-[0.75em] text-[0.62em] font-medium text-[var(--mv-accent-ink)]">
            Отправить
          </span>
          <p className="mt-[0.7em] text-[0.52em] leading-[1.5] text-[var(--mv-muted)]">
            Заявка уходит на почту и в Telegram отдела продаж одновременно.
          </p>
        </div>
      </section>

      {/* Интерактивная карта. */}
      <section className="px-[2em] pb-[2em]">
        <div className="relative h-[9em] overflow-hidden rounded-[0.7em] border border-[var(--mv-line)] bg-[var(--mv-raised)] transition-colors duration-500">
          <svg
            viewBox="0 0 400 140"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="h-full w-full"
          >
            <g stroke="var(--mv-line)" strokeWidth="1">
              {[20, 60, 100, 140, 180, 220, 260, 300, 340, 380].map((x) => (
                <path key={x} d={`M${x} 0 V140`} />
              ))}
              {[20, 55, 90, 125].map((y) => (
                <path key={y} d={`M0 ${y} H400`} />
              ))}
            </g>
            <path d="M0 92 L160 92 L200 40 L400 40" stroke="var(--mv-accent)" strokeWidth="3" fill="none" opacity="0.5" />
          </svg>
          <span className="absolute left-[46%] top-[38%] flex h-[1.6em] w-[1.6em] items-center justify-center rounded-full bg-[var(--mv-accent)] text-[0.6em] text-[var(--mv-accent-ink)]">
            ●
          </span>
        </div>
      </section>

      <Footer />
    </>
  );
}

const registry: Record<ScreenId, (props: ScreenProps) => React.ReactNode> = {
  home: Home,
  projects: Projects,
  project: Project,
  commercial: Commercial,
  about: About,
  contacts: Contacts,
};

/**
 * Один макет. Корневой `font-size` в `cqw` — всё внутри задано в `em`, поэтому
 * экран одинаково собирается и в карточке шириной 320 px, и развёрнутым на
 * весь экран.
 */
export function Screen({ id, device }: { id: ScreenId; device: Device }) {
  const Body = registry[id];

  return (
    <div
      className="flex min-h-full flex-col bg-[var(--mv-bg)] text-[var(--mv-text)] transition-colors duration-500"
      style={{ fontSize: device === "mobile" ? "3.4cqw" : "1.15cqw" }}
    >
      <Body device={device} />
    </div>
  );
}
