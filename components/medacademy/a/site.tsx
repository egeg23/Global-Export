"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { Addon } from "@/components/configurator/context";
import { AdminPreview, Blog, Booking, Cabinet, CertCheck, Pay, Quiz } from "@/components/medacademy/shared/addons";
import { DtmCalculator } from "@/components/medacademy/shared/calculator";
import { IconA, type IconNameA } from "@/components/medacademy/shared/icons";
import { LangPills, LangProvider, useT } from "@/components/medacademy/shared/lang";
import { In, onScrollFrame, reducedMotion } from "@/components/medacademy/shared/motion";
import { brand, contacts, courseFeatures, courses, mapHref, photos, reviews, sum, teachers, tgHref } from "@/content/medacademy/facts";
import { cn } from "@/lib/cn";

/**
 * Вариант A «Клиника» — строгий клинический премиум.
 *
 * Тёплая бумага, петрольные чернила, книжная антиква — страница читается как
 * хороший медицинский справочник, а не как реклама курсов. Единственный
 * громкий цвет — красный пульс из их логотипа: линия ЭКГ прочерчивает
 * первый экран и дальше ведёт по странице как шкала прогресса.
 *
 * Фирменный ход — калькулятор балла DTM с отметками баллов, с которыми
 * поступали сами преподаватели. Цифры, а не обещания.
 */
export function SiteA() {
  return (
    <div data-ma="a" className="min-h-dvh">
      <LangProvider>
        <Header />
        <main>
          <Hero />
          <Section id="quiz" eyebrow="Подбор курса" title="Какой курс нужен именно вам — за четыре вопроса">
            <Addon id="quiz">
              <Quiz v="a" />
            </Addon>
          </Section>
          <Method />
          <Section id="score" eyebrow="Калькулятор" title="Посчитайте свой балл DTM — и сравните с теми, кто вас будет учить" tone="surface">
            <DtmCalculator v="a" />
          </Section>
          <Courses />
          <Section id="cabinet" eyebrow="После записи" title="Кабинет ученика: лекции, тесты и сертификат в одном месте">
            <Addon id="cabinet">
              <Cabinet v="a" />
            </Addon>
          </Section>
          <Teachers />
          <Section id="cert" eyebrow="Для вузов и работодателей" title="Проверить сертификат выпускника по номеру">
            <Addon id="cert">
              <CertCheck v="a" />
            </Addon>
          </Section>
          <Reviews />
          <Gallery />
          <Section id="booking" eyebrow="Запись" title="Консультация или пробное занятие — выберите день и время" tone="surface">
            <Addon id="booking">
              <Booking v="a" />
            </Addon>
          </Section>
          <Section id="blog" eyebrow="Блог" title="Разборы для абитуриентов">
            <Addon id="blog">
              <Blog v="a" />
            </Addon>
          </Section>
          <Section id="admin" eyebrow="Для центра" title="Сайт, который администратор правит сам">
            <Addon id="admin">
              <AdminPreview v="a" />
            </Addon>
          </Section>
          <Contacts />
        </main>
        <Footer />
      </LangProvider>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Header() {
  const t = useT();
  const nav: [string, string][] = [
    ["#courses", t("courses")],
    ["#teachers", t("teachers")],
    ["#score", t("score")],
    ["#contacts", t("contacts")],
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-ma-line bg-ma-bg/95">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-4 px-4 py-2 sm:min-h-20 sm:px-6">
        <a href="#top" className="shrink-0" aria-label="MedAcademy — наверх">
          <Image src="/images/medacademy/logo-ink.png" alt="MedAcademy" width={485} height={323} className="h-10 w-auto sm:h-12" priority />
        </a>
        <nav aria-label="Разделы" className="ml-6 hidden items-center gap-6 text-sm lg:flex">
          {nav.map(([href, label]) => (
            <a key={href} href={href} className="text-ma-ink-2 transition-colors hover:text-ma-accent">
              {label}
            </a>
          ))}
        </nav>
        <LangPills pill="ma-chip min-h-11" className="ml-auto" />
        <a
          href={tgHref("Здравствуйте! Хочу записаться на курс MedAcademy.")}
          target="_blank"
          rel="noopener noreferrer"
          className="ma-btn hidden min-h-11 px-4 text-sm sm:inline-flex"
        >
          {t("cta")}
        </a>
      </div>
    </header>
  );
}

const ECG = "M0 60 H330 L352 60 L362 44 L374 60 L400 60 L414 8 L432 112 L446 60 L478 60 L494 46 L512 60 H1200";

/** Линия ЭКГ из логотипа. Открывается шторкой, которая уезжает вбок. */
function Ecg({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none relative overflow-hidden", className)}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-full">
        <path d={ECG} fill="none" stroke="var(--ma-accent)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
      <div className="ma-ecg-wipe absolute inset-0 bg-ma-bg" />
    </div>
  );
}

function Hero() {
  const t = useT();
  const stats: [string, string][] = [
    [brand.graduates, "выпускников стали студентами медвузов"],
    [`с ${brand.since}`, "готовим к поступлению"],
    ["140+", "видеолекций в комплексном курсе"],
    ["180,5", "из 189 — балл автора курса химии"],
  ];
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-10 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:pb-20 lg:pt-16">
        <div className="lg:col-span-7">
          <p className="ma-eyebrow text-ma-accent">{t("tag")} · Ташкент</p>
          <h1 className="ma-display mt-6 text-5xl sm:text-6xl lg:text-7xl">{t("aTitle")}</h1>
          <p className="mt-6 max-w-xl text-lg text-ma-ink-2">{t("aSub")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={tgHref("Здравствуйте! Хочу записаться на курс MedAcademy.")} target="_blank" rel="noopener noreferrer" className="ma-btn">
              <IconA name="tg" className="h-5 w-5" />
              {t("cta")} в Telegram
            </a>
            <a href="#score" className="ma-btn ma-btn-ghost">
              Посчитать балл DTM
            </a>
          </div>
        </div>
        <div className="relative lg:col-span-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--ma-radius)] lg:aspect-[4/5]">
            <Image
              src={photos.team}
              alt="Преподаватели MedAcademy"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 92vw"
              className="object-cover object-[50%_30%]"
            />
          </div>
          <p className="ma-muted mt-3 text-xs">Команда MedAcademy. Фото с сайта центра.</p>
        </div>
      </div>
      <Ecg className="h-16 w-full sm:h-24" />
      <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-px border-y border-ma-line bg-ma-line px-0 lg:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="bg-ma-bg px-4 py-6 sm:px-6">
            <dt className="ma-display ma-num text-4xl sm:text-5xl">{value}</dt>
            <dd className="ma-muted mt-2 text-sm">{label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Section({
  id,
  eyebrow,
  title,
  tone,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  tone?: "surface";
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-20", tone === "surface" && "bg-ma-surface")}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <In variant="fade">
          <p className="ma-eyebrow text-ma-accent">{eyebrow}</p>
          <h2 className="ma-display mt-4 max-w-3xl text-4xl sm:text-5xl">{title}</h2>
        </In>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

const METHOD: { icon: IconNameA; title: string; text: string }[] = [
  { icon: "file", title: "Авторская программа", text: "Все ключевые темы химии и биологии, сложное — доступно и по системе, а не поверхностно." },
  { icon: "video", title: "Видеолекции и записи уроков", text: "140+ лекций в комплексе: 67 по химии и 78 по биологии. Пропущенное можно пересмотреть." },
  { icon: "list", title: "Практика и разборы", text: "Экзаменационные задачи разного уровня. Ученики в отзывах отмечают: «много практики и тестов»." },
  { icon: "chat", title: "Чат с наставником", text: "Вопрос по теме не ждёт следующего занятия. Поддержка — 24/7, как написано в каждом курсе." },
  { icon: "pin", title: "Центр Ташкента", text: "Шахрисабз, 16А — «легко добираться из разных районов города», пишет ученица." },
];

/** «Из чего состоит подготовка»: пульс идёт по шкале вместе с прокруткой. */
function Method() {
  const line = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = line.current;
    if (!node || reducedMotion()) {
      if (node) node.style.transform = "scaleY(1)";
      return;
    }
    return onScrollFrame(() => {
      const rect = node.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const progress = Math.min(Math.max((window.innerHeight * 0.6 - rect.top) / rect.height, 0), 1);
      node.style.transform = `scaleY(${progress.toFixed(3)})`;
    });
  }, []);

  return (
    <section id="method" className="scroll-mt-20 bg-ma-deep text-ma-on-deep">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="ma-eyebrow text-[#ff9b93]">Как устроена подготовка</p>
            <h2 className="ma-display mt-4 text-4xl sm:text-5xl">Без давления. С дисциплиной.</h2>
            <p className="mt-6 max-w-md text-[#c7d2d6]">
              Так ученица Мадина описала MedAcademy в отзыве — и это точнее любого слогана. Пять вещей, из которых складывается курс.
            </p>
          </div>
        </div>
        <div className="relative lg:col-span-7">
          <div aria-hidden="true" className="absolute bottom-0 left-5 top-0 w-px bg-white/15">
            <div ref={line} className="h-full w-full origin-top bg-[#ff6f66]" style={{ transform: "scaleY(0)" }} />
          </div>
          <ol className="space-y-10">
            {METHOD.map((item, index) => (
              <In key={item.title} as="li" variant={index % 2 ? "slide" : "rise"} className="relative pl-16">
                <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#1d3a48] ring-1 ring-white/15">
                  <IconA name={item.icon} className="h-5 w-5 text-[#ff9b93]" />
                </span>
                <h3 className="ma-display text-3xl">{item.title}</h3>
                <p className="mt-2 max-w-lg text-[#c7d2d6]">{item.text}</p>
              </In>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Courses() {
  return (
    <section id="courses" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <In variant="fade">
          <p className="ma-eyebrow text-ma-accent">Курсы и цены</p>
          <h2 className="ma-display mt-4 max-w-3xl text-4xl sm:text-5xl">Три курса. Цены — открыто, как на их сайте.</h2>
        </In>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {courses.map((course, index) => (
            <In key={course.id} as="article" variant="tilt" index={index} className={cn("ma-card flex flex-col p-6 sm:p-8", course.id === "both" && "lg:ring-2 lg:ring-ma-accent")}>
              <div className="flex items-start justify-between gap-3">
                <IconA name={course.id === "chem" ? "flask" : course.id === "bio" ? "dna" : "stethoscope"} className="h-9 w-9 text-ma-accent" />
                {course.id === "both" ? <span className="ma-eyebrow rounded-full bg-ma-accent px-3 py-1 text-ma-accent-ink">Для медвуза</span> : null}
              </div>
              <h3 className="ma-display mt-6 text-3xl">{course.name}</h3>
              <p className="ma-muted mt-3">{course.intro}</p>
              <dl className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-[var(--ma-radius)] bg-ma-line text-center">
                {[
                  ["часов", course.hours],
                  ["лекций", course.lectures],
                  ["файлов", course.files],
                ].map(([label, value]) => (
                  <div key={label} className="bg-ma-bg px-2 py-3">
                    <dd className="ma-num font-bold">{value}</dd>
                    <dt className="ma-muted text-xs">{label}</dt>
                  </div>
                ))}
              </dl>
              <ul className="mt-6 space-y-2 text-sm">
                {course.learn.map((item) => (
                  <li key={item} className="flex gap-2">
                    <IconA name="check" className="mt-0.5 h-4 w-4 shrink-0 text-ma-pop" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <p className="ma-display ma-num text-3xl">{sum(course.price)}</p>
                <a
                  href={tgHref(`Здравствуйте! Хочу записаться на курс «${course.name}».`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("ma-btn mt-4 w-full", course.id !== "both" && "ma-btn-ghost")}
                >
                  Записаться на «{course.short}»
                </a>
              </div>
            </In>
          ))}
        </div>
        <p className="ma-muted mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          В каждом курсе:
          {courseFeatures.map((feature) => (
            <span key={feature} className="inline-flex items-center gap-1.5 text-ma-ink-2">
              <IconA name="check" className="h-4 w-4 text-ma-pop" />
              {feature}
            </span>
          ))}
        </p>
        <div className="mt-12">
          <Addon id="pay">
            <Pay v="a" />
          </Addon>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Teachers() {
  return (
    <section id="teachers" className="scroll-mt-20 bg-ma-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <In variant="fade">
          <p className="ma-eyebrow text-ma-accent">Преподаватели</p>
          <h2 className="ma-display mt-4 max-w-3xl text-4xl sm:text-5xl">Учат те, кто сам сдавал этот экзамен — и сдал сильно</h2>
        </In>
        <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {teachers.map((teacher, index) => (
            <In key={teacher.id} as="li" variant={index % 2 ? "rise" : "zoom"} index={index}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--ma-radius)] bg-ma-surface-2">
                <Image src={teacher.photo} alt={teacher.name} fill sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw" className="object-cover object-top" />
              </div>
              <p className="ma-eyebrow ma-muted mt-5">{teacher.subject}</p>
              <h3 className="ma-display mt-1 text-2xl">{teacher.name}</h3>
              <p className="text-sm text-ma-ink-2">{teacher.role}</p>
              {teacher.score ? (
                <p className="mt-4 border-t border-ma-line pt-4">
                  <span className="ma-display ma-num text-4xl text-ma-accent">{teacher.score.split(" / ")[0]}</span>
                  <span className="ma-muted text-sm"> {teacher.score.includes("/") ? "из 189 при поступлении" : "балл при поступлении"}</span>
                </p>
              ) : null}
              <ul className="ma-muted mt-3 space-y-1 text-sm">
                {teacher.facts.map((fact) => (
                  <li key={fact}>— {fact}</li>
                ))}
              </ul>
            </In>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Reviews() {
  const [lead, ...rest] = reviews;
  return (
    <section id="reviews" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <In variant="fade">
          <p className="ma-eyebrow text-ma-accent">Отзывы</p>
        </In>
        <In variant="rise">
          <blockquote className="mt-6 max-w-5xl">
            <p className="ma-display text-3xl sm:text-5xl">«{lead.text.split(". ").slice(0, 3).join(". ")}.»</p>
            <footer className="ma-muted mt-6 text-sm">
              {lead.name} · {lead.date}
            </footer>
          </blockquote>
        </In>
        <ul className="mt-14 grid gap-px overflow-hidden rounded-[var(--ma-radius)] bg-ma-line sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((review, index) => (
            <In key={review.name} as="li" variant="fade" index={index} className="flex flex-col bg-ma-bg p-6">
              <p className="ma-display text-xl text-ma-accent">«{review.quote}»</p>
              <p className="ma-muted mt-3 text-sm">{review.text}</p>
              <p className="mt-auto pt-5 text-sm font-bold">
                {review.name} <span className="ma-muted font-normal">· {review.date}</span>
              </p>
            </In>
          ))}
        </ul>
        <p className="ma-muted mt-4 text-xs">Отзывы — с сайта medacademy.uz, без правок по смыслу.</p>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section aria-label="Фотографии центра" className="mx-auto grid max-w-7xl gap-4 px-4 pb-16 sm:grid-cols-12 sm:px-6 lg:pb-24">
      <In variant="zoom" className="relative aspect-[4/3] overflow-hidden rounded-[var(--ma-radius)] sm:col-span-7">
        <Image src={photos.lesson} alt="Последний урок группы в MedAcademy" fill sizes="(min-width: 640px) 58vw, 92vw" className="object-cover" />
      </In>
      <In variant="rise" index={1} className="relative aspect-[4/3] overflow-hidden rounded-[var(--ma-radius)] sm:col-span-5 sm:aspect-auto">
        <Image src={photos.duo} alt="Преподаватели химии MedAcademy" fill sizes="(min-width: 640px) 40vw, 92vw" className="object-cover object-top" />
      </In>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Contacts() {
  const t = useT();
  return (
    <section id="contacts" className="scroll-mt-20 bg-ma-deep text-ma-on-deep">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="ma-eyebrow text-[#ff9b93]">{t("contacts")}</p>
          <h2 className="ma-display mt-4 text-4xl sm:text-6xl">Начните с одного сообщения</h2>
          <p className="mt-6 max-w-md text-[#c7d2d6]">
            Администратор ответит на вопросы, поможет выбрать курс и расскажет подробности обучения.
          </p>
          <a href={tgHref("Здравствуйте! Хочу узнать про курсы MedAcademy.")} target="_blank" rel="noopener noreferrer" className="ma-btn mt-8">
            <IconA name="tg" className="h-5 w-5" />
            Написать в Telegram
          </a>
        </div>
        <dl className="grid content-start gap-px overflow-hidden rounded-[var(--ma-radius)] bg-white/15">
          {[
            ["pin", "Адрес", contacts.address, mapHref],
            ["phone", "Телефон", contacts.phone, contacts.phoneHref],
            ["clock", "Часы работы", contacts.hours, null],
            ["envelope", "Почта", contacts.email, `mailto:${contacts.email}`],
          ].map(([icon, label, value, href]) => (
            <div key={label} className="flex items-start gap-4 bg-ma-deep p-5">
              <IconA name={icon === "envelope" ? "mail" : (icon as IconNameA)} className="mt-0.5 h-6 w-6 shrink-0 text-[#ff9b93]" />
              <div>
                <dt className="text-sm text-[#c7d2d6]">{label}</dt>
                <dd className="mt-1 text-lg">
                  {href ? (
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-ma-deep text-ma-on-deep">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-white/15 px-4 py-10 sm:flex-row sm:items-center sm:px-6">
        <Image src="/images/medacademy/logo-white.png" alt="MedAcademy" width={485} height={323} className="h-12 w-auto" />
        <div className="flex gap-2 sm:ml-auto">
          {[
            ["tg", `https://t.me/${contacts.telegram}`, "Telegram"],
            ["ig", contacts.instagram, "Instagram"],
            ["yt", contacts.youtube, "YouTube"],
          ].map(([icon, href, label]) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-white/20 hover:bg-white/10">
              <IconA name={icon as IconNameA} className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
      <p className="mx-auto max-w-7xl px-4 pb-10 text-xs text-[#9fb0b6] sm:px-6">
        © MedAcademy. Макет сайта — DevUz. Логотип, фотографии, цены и отзывы — с medacademy.uz.
      </p>
    </footer>
  );
}
