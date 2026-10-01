"use client";

import Image from "next/image";
import { useId, useMemo, useState } from "react";

import { Ico } from "@/components/medacademy/shared/icons";
import { courses, sum, teachers, tgHref, type Course } from "@/content/medacademy/facts";
import { cn } from "@/lib/cn";

/**
 * Блоки допников — одни на оба варианта. Вид им задаёт `data-ma` корня
 * (семантические классы `ma-*` в app/medacademy.css), а место на странице и
 * заголовок секции выбирает сам вариант.
 *
 * Всё, что в блоке условно (расписание групп, номер сертификата, заявки в
 * панели), подписано на странице как пример: данных центра у нас нет, и
 * выдавать их за факт нельзя (proto-master, правило 1).
 */

type V = { v: "a" | "b" };

/* ------------------------------------------------------------------ */
/* Подбор курса                                                        */
/* ------------------------------------------------------------------ */

const QUIZ = [
  {
    id: "goal",
    q: "Куда поступаете?",
    options: [
      ["uz", "Медвуз Узбекистана"],
      ["abroad", "Медвуз за рубежом"],
      ["cert", "Нужен сертификат по предмету"],
    ],
  },
  {
    id: "grade",
    q: "Когда экзамен?",
    options: [
      ["this", "В этом году"],
      ["next", "Через год"],
      ["later", "Через два года и позже"],
    ],
  },
  {
    id: "hard",
    q: "Что даётся тяжелее?",
    options: [
      ["chem", "Химия"],
      ["bio", "Биология"],
      ["both", "Оба предмета"],
    ],
  },
  {
    id: "format",
    q: "Как удобнее учиться?",
    options: [
      ["center", "В центре, в Ташкенте"],
      ["video", "Видеолекции и чат с наставником"],
      ["mix", "И так, и так"],
    ],
  },
] as const;

type Answers = Partial<Record<(typeof QUIZ)[number]["id"], string>>;

function recommend(answers: Answers): { course: Course; why: string } {
  const both = courses.find((course) => course.id === "both")!;
  const only = (id: "chem" | "bio") => courses.find((course) => course.id === id)!;
  if (answers.goal === "cert" && (answers.hard === "chem" || answers.hard === "bio")) {
    return { course: only(answers.hard), why: "Нужен один предмет на сертификат — берите его отдельным курсом и закрывайте темы с наставником." };
  }
  if (answers.hard === "both" || answers.goal === "uz") {
    return {
      course: both,
      why:
        answers.grade === "this"
          ? "Для медвуза нужны оба профильных предмета, а до экзамена меньше года — комплекс даёт 200+ часов и 140+ видеолекций одной программой."
          : "Биология весит 3,1 балла за ответ, химия — 2,1: комплекс ведёт оба предмета одной программой, и времени хватит пройти её спокойно.",
    };
  }
  const id = answers.hard === "bio" ? "bio" : "chem";
  return { course: only(id), why: `Начните с того, что тяжелее: курс «${only(id).name}» — 100+ часов и ${only(id).lectures} видеолекций.` };
}

export function Quiz({ v, onDone }: V & { onDone?: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const done = step >= QUIZ.length;
  const result = done ? recommend(answers) : null;

  const pick = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    const next = step + 1;
    setStep(next);
    if (next >= QUIZ.length) onDone?.();
  };

  const summary = QUIZ.map((question) => {
    const answer = question.options.find(([value]) => value === answers[question.id]);
    return answer ? `${question.q} — ${answer[1]}` : null;
  })
    .filter(Boolean)
    .join("; ");

  return (
    <div className="ma-card p-5 sm:p-8">
      <div className="flex items-center gap-2" aria-hidden="true">
        {QUIZ.map((question, index) => (
          <span key={question.id} className="h-1.5 flex-1 overflow-hidden rounded-full bg-ma-surface-2">
            <span
              className="block h-full origin-left bg-ma-accent transition-transform duration-500"
              style={{ transform: `scaleX(${index < step ? 1 : 0})` }}
            />
          </span>
        ))}
      </div>

      {!done ? (
        <div key={step} className="ma-pop mt-6">
          <p className="ma-muted text-sm">
            Вопрос {step + 1} из {QUIZ.length}
          </p>
          <p className="ma-display mt-2 text-3xl sm:text-4xl">{QUIZ[step].q}</p>
          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            {QUIZ[step].options.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => pick(QUIZ[step].id, value)}
                className="ma-chip min-h-14 justify-between text-left text-base"
              >
                {label}
                <Ico v={v} name="arrow" className="h-5 w-5 shrink-0" />
              </button>
            ))}
          </div>
          {step > 0 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="ma-muted mt-4 min-h-11 text-sm underline underline-offset-4">
              Назад
            </button>
          ) : null}
        </div>
      ) : result ? (
        <div className="ma-pop mt-6 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="ma-muted text-sm">Вам подойдёт</p>
            <p className="ma-display mt-2 text-4xl sm:text-5xl">{result.course.name}</p>
            <p className="mt-3 max-w-xl">{result.why}</p>
            <p className="ma-num mt-3 font-bold">{sum(result.course.price)}</p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <a
              href={tgHref(`Здравствуйте! Прошёл(ла) подбор курса на сайте: ${summary}. Подходит «${result.course.name}». Хочу записаться.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="ma-btn"
            >
              <Ico v={v} name="tg" className="h-5 w-5" />
              Записаться в Telegram
            </a>
            <button
              type="button"
              onClick={() => {
                setStep(0);
                setAnswers({});
              }}
              className="ma-muted min-h-11 text-sm underline underline-offset-4"
            >
              Пройти заново
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Запись и расписание наборов                                         */
/* ------------------------------------------------------------------ */

const SLOTS = ["09:00", "11:00", "14:00", "16:00", "18:00"];

/** Пример расписания наборов: реальные даты центр задаёт в панели. */
const INTAKES = [
  { course: "Биология и химия", when: "Пн · Ср · Пт", time: "утро или вечер", seats: "группа набирается" },
  { course: "Химия", when: "Вт · Чт · Сб", time: "после школы", seats: "группа набирается" },
  { course: "Биология", when: "Вт · Чт · Сб", time: "утро", seats: "группа набирается" },
];

function nextDays(count: number) {
  const days: { key: string; week: string; day: string }[] = [];
  const now = new Date();
  for (let offset = 1; days.length < count; offset += 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    if (date.getDay() === 0) continue;
    days.push({
      key: date.toISOString().slice(0, 10),
      week: date.toLocaleDateString("ru-RU", { weekday: "short" }),
      day: date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
    });
  }
  return days;
}

export function Booking({ v }: V) {
  const days = useMemo(() => nextDays(6), []);
  const [subject, setSubject] = useState("Биология и химия");
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const nameId = useId();
  const chosen = days.find((entry) => entry.key === day);
  const text = `Здравствуйте! Хочу на консультацию или пробное занятие: ${subject}${chosen ? `, ${chosen.week} ${chosen.day}` : ""}${slot ? ` в ${slot}` : ""}.${name ? ` Меня зовут ${name}.` : ""}`;

  return (
    <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
      <div className="ma-card p-5 sm:p-8">
        <fieldset>
          <legend className="font-bold">Предмет</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {courses.map((course) => (
              <button key={course.id} type="button" aria-pressed={subject === course.name} onClick={() => setSubject(course.name)} className="ma-chip">
                {course.name}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="mt-6">
          <legend className="font-bold">День</legend>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {days.map((entry) => (
              <button
                key={entry.key}
                type="button"
                aria-pressed={day === entry.key}
                onClick={() => setDay(entry.key)}
                className="ma-chip min-h-16 flex-col justify-center gap-0 px-2"
              >
                <span className="text-xs uppercase">{entry.week}</span>
                <span className="ma-num font-bold">{entry.day}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="mt-6">
          <legend className="font-bold">Время</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {SLOTS.map((entry) => (
              <button key={entry} type="button" aria-pressed={slot === entry} onClick={() => setSlot(entry)} className="ma-chip ma-num">
                {entry}
              </button>
            ))}
          </div>
        </fieldset>
        <label htmlFor={nameId} className="mt-6 block font-bold">
          Как к вам обращаться
        </label>
        <input id={nameId} value={name} onChange={(event) => setName(event.target.value)} className="ma-field mt-2" autoComplete="given-name" placeholder="Имя" />
        <a href={tgHref(text)} target="_blank" rel="noopener noreferrer" className="ma-btn mt-6 w-full sm:w-auto">
          <Ico v={v} name="tg" className="h-5 w-5" />
          Отправить администратору
        </a>
        <p className="ma-muted mt-3 text-xs">Заявка открывается в Telegram центра с готовым текстом — администратор подтвердит время. Работаем 08:00–19:00.</p>
      </div>

      <div className="ma-card p-5 sm:p-8">
        <p className="font-bold">Расписание наборов</p>
        <p className="ma-muted mt-1 text-xs">Пример: дни и группы центр задаёт в панели управления.</p>
        <ul className="mt-5 divide-y divide-ma-line">
          {INTAKES.map((intake) => (
            <li key={intake.course} className="py-4">
              <p className="font-bold">{intake.course}</p>
              <p className="ma-muted mt-1 flex flex-wrap gap-x-3 text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <Ico v={v} name="calendar" className="h-4 w-4" />
                  {intake.when}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Ico v={v} name="clock" className="h-4 w-4" />
                  {intake.time}
                </span>
              </p>
              <p className="mt-1 text-sm text-ma-pop">{intake.seats}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Проверка сертификата                                                */
/* ------------------------------------------------------------------ */

const DEMO_CERT = "MA-2026-0142";

export function CertCheck({ v }: V) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<"idle" | "ok" | "none">("idle");
  const id = useId();

  const check = (event: React.FormEvent) => {
    event.preventDefault();
    setState(value.trim().toUpperCase() === DEMO_CERT ? "ok" : "none");
  };

  return (
    <div className="ma-card p-5 sm:p-8">
      <form onSubmit={check} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor={id} className="font-bold">
            Номер сертификата
          </label>
          <input
            id={id}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setState("idle");
            }}
            placeholder={DEMO_CERT}
            className="ma-field mt-2 uppercase"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <button type="submit" className="ma-btn">
          <Ico v={v} name="search" className="h-5 w-5" />
          Проверить
        </button>
      </form>
      <button type="button" onClick={() => setValue(DEMO_CERT)} className="ma-muted mt-3 min-h-11 text-sm underline underline-offset-4">
        Подставить номер-пример
      </button>
      <div aria-live="polite">
        {state === "ok" ? (
          <div className="ma-pop mt-4 flex gap-4 rounded-[var(--ma-radius)] bg-ma-bg p-5">
            <Ico v={v} name="seal" className="h-10 w-10 shrink-0 text-ma-pop" />
            <dl className="grid flex-1 grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              <dt className="ma-muted">Статус</dt>
              <dd className="font-bold">Действителен</dd>
              <dt className="ma-muted">Курс</dt>
              <dd>Биология и химия · 200+ ч</dd>
              <dt className="ma-muted">Выдан</dt>
              <dd className="ma-num">пример даты</dd>
              <dt className="ma-muted">Владелец</dt>
              <dd>имя выпускника — из базы центра</dd>
            </dl>
          </div>
        ) : state === "none" ? (
          <p className="ma-pop mt-4 rounded-[var(--ma-radius)] bg-ma-bg p-5 text-sm">
            Такого номера нет в базе. Проверьте буквы и цифры или напишите администратору.
          </p>
        ) : null}
      </div>
      <p className="ma-muted mt-4 text-xs">Работодатель или вуз проверяет сертификат выпускника сам — без звонка в центр. В макете база — пример.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Личный кабинет                                                      */
/* ------------------------------------------------------------------ */

const CABINET_TABS = ["Расписание", "Видеолекции", "Тесты", "Сертификаты"] as const;

export function Cabinet({ v }: V) {
  const [tab, setTab] = useState<(typeof CABINET_TABS)[number]>("Видеолекции");
  const chem = courses.find((course) => course.id === "chem")!;
  const bio = courses.find((course) => course.id === "bio")!;
  const progress = [
    { name: "Химия", done: 24, total: Number(chem.lectures) },
    { name: "Биология", done: 41, total: Number(bio.lectures) },
  ];

  return (
    <div className="ma-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-ma-line px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ma-accent text-ma-accent-ink">
            <Ico v={v} name="user" className="h-6 w-6" />
          </span>
          <div>
            <p className="font-bold">Кабинет ученика</p>
            <p className="ma-muted text-xs">пример ученика · комплекс</p>
          </div>
        </div>
        <Ico v={v} name="lock" className="ma-muted h-5 w-5" label="Вход по номеру телефона" />
      </div>
      <div role="tablist" aria-label="Разделы кабинета" className="flex gap-1 overflow-x-auto px-3 pt-3 sm:px-6">
        {CABINET_TABS.map((entry) => (
          <button key={entry} type="button" role="tab" aria-selected={tab === entry} onClick={() => setTab(entry)} className="ma-chip shrink-0">
            {entry}
          </button>
        ))}
      </div>
      <div key={tab} role="tabpanel" className="ma-pop p-5 sm:p-8">
        {tab === "Видеолекции" ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {progress.map((entry) => (
              <li key={entry.name} className="rounded-[var(--ma-radius)] bg-ma-bg p-5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 font-bold">
                    <Ico v={v} name={entry.name === "Химия" ? "flask" : "dna"} className="h-5 w-5" />
                    {entry.name}
                  </span>
                  <span className="ma-num text-sm">
                    {entry.done} / {entry.total}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-ma-surface-2">
                  <div className="h-full origin-left bg-ma-accent" style={{ transform: `scaleX(${entry.done / entry.total})` }} />
                </div>
                <p className="ma-muted mt-3 inline-flex items-center gap-2 text-sm">
                  <Ico v={v} name="play" className="h-4 w-4" />
                  Продолжить с лекции {entry.done + 1}
                </p>
              </li>
            ))}
          </ul>
        ) : tab === "Расписание" ? (
          <ul className="divide-y divide-ma-line">
            {[
              ["Пн", "Химия · органика, разбор задач"],
              ["Ср", "Биология · генетика"],
              ["Пт", "Пробный тест в формате DTM"],
            ].map(([day, what]) => (
              <li key={day} className="flex gap-4 py-3">
                <span className="ma-num w-8 font-bold">{day}</span>
                <span>{what}</span>
              </li>
            ))}
          </ul>
        ) : tab === "Тесты" ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Последний тест", "24 / 30"],
              ["Прогноз по биологии", "74,4 из 93"],
              ["Темы на повтор", "3"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[var(--ma-radius)] bg-ma-bg p-5">
                <p className="ma-muted text-sm">{label}</p>
                <p className="ma-display ma-num mt-2 text-3xl">{value}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-4 rounded-[var(--ma-radius)] bg-ma-bg p-5">
            <Ico v={v} name="cert" className="h-10 w-10 text-ma-pop" />
            <div className="flex-1">
              <p className="font-bold">Сертификат об окончании курса</p>
              <p className="ma-muted text-sm">PDF с номером для проверки на сайте</p>
            </div>
            <span className="ma-chip">Скачать</span>
          </div>
        )}
        <p className="ma-muted mt-5 text-xs">Данные ученика — пример. Количество видеолекций — с карточек курсов: химия {chem.lectures}, биология {bio.lectures}.</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Онлайн-оплата                                                       */
/* ------------------------------------------------------------------ */

const METHODS = ["Payme", "Click", "Uzum"];

export function Pay({ v }: V) {
  const [courseId, setCourseId] = useState<Course["id"]>("both");
  const [method, setMethod] = useState("Payme");
  const [sent, setSent] = useState(false);
  const course = courses.find((entry) => entry.id === courseId)!;

  return (
    <div className="ma-card grid gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
      <div>
        <p className="font-bold">Курс</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {courses.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-pressed={courseId === entry.id}
              onClick={() => {
                setCourseId(entry.id);
                setSent(false);
              }}
              className="ma-chip"
            >
              {entry.name}
            </button>
          ))}
        </div>
        <p className="mt-6 font-bold">Способ оплаты</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {METHODS.map((entry) => (
            <button
              key={entry}
              type="button"
              aria-pressed={method === entry}
              onClick={() => {
                setMethod(entry);
                setSent(false);
              }}
              className="ma-chip"
            >
              <Ico v={v} name="card" className="h-4 w-4" />
              {entry}
            </button>
          ))}
        </div>
      </div>
      <div className="lg:text-right">
        <p className="ma-muted text-sm">К оплате</p>
        <p className="ma-display ma-num mt-1 text-4xl">{sum(course.price)}</p>
        <button type="button" onClick={() => setSent(true)} className="ma-btn mt-4 w-full lg:w-auto">
          <Ico v={v} name="lock" className="h-5 w-5" />
          Оплатить через {method}
        </button>
        <p className="ma-muted mt-3 text-xs" aria-live="polite">
          {sent ? "В макете оплата не проводится — здесь откроется страница платёжной системы." : "Чек и доступ к видеолекциям приходят сразу после оплаты."}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Блог                                                                */
/* ------------------------------------------------------------------ */

const POSTS = [
  { tag: "Поступление", title: "Как считается балл DTM на медицинские направления", read: "6 мин", icon: "chart" as const },
  { tag: "Химия", title: "Сертификат по химии: что даёт каждый уровень", read: "5 мин", icon: "flask" as const },
  { tag: "Биология", title: "Генетика без зубрёжки: задачи, которые встречаются чаще всего", read: "8 мин", icon: "dna" as const },
];

export function Blog({ v }: V) {
  return (
    <div>
      <ul className="grid gap-4 md:grid-cols-3">
        {POSTS.map((post) => (
          <li key={post.title} className="ma-card flex flex-col p-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-[var(--ma-radius)] bg-ma-bg text-ma-pop">
              <Ico v={v} name={post.icon} className="h-7 w-7" />
            </span>
            <p className="ma-eyebrow ma-muted mt-6">{post.tag}</p>
            <p className="ma-display mt-2 text-2xl">{post.title}</p>
            <p className="ma-muted mt-auto pt-6 text-sm">{post.read} · пример статьи</p>
          </li>
        ))}
      </ul>
      <p className="ma-muted mt-4 text-xs">Темы — из поисковых запросов абитуриентов. В макете — заголовки-примеры.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Панель управления                                                   */
/* ------------------------------------------------------------------ */

export function AdminPreview({ v }: V) {
  const [prices, setPrices] = useState(() => Object.fromEntries(courses.map((course) => [course.id, course.price])) as Record<Course["id"], number>);
  const leads = [
    { what: "Подбор курса → комплекс", from: "сайт · тест", when: "сегодня" },
    { what: "Запись: химия, вт 16:00", from: "сайт · запись", when: "сегодня" },
    { what: "Вопрос про сертификат", from: "Telegram", when: "вчера" },
  ];

  return (
    <div className="ma-card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-ma-line px-5 py-4 sm:px-8">
        <Ico v={v} name="gear" className="h-5 w-5" />
        <p className="font-bold">Панель MedAcademy</p>
        <span className="ma-muted ml-auto text-xs">пример данных</span>
      </div>
      <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-2">
        <div>
          <p className="ma-eyebrow ma-muted">Заявки</p>
          <ul className="mt-3 divide-y divide-ma-line">
            {leads.map((lead) => (
              <li key={lead.what} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span>
                  <span className="block font-bold">{lead.what}</span>
                  <span className="ma-muted">{lead.from}</span>
                </span>
                <span className="ma-muted shrink-0">{lead.when}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="ma-eyebrow ma-muted">Цены курсов</p>
          <ul className="mt-3 space-y-3">
            {courses.map((course) => (
              <li key={course.id} className="flex items-center gap-3">
                <span className="flex-1 text-sm">{course.name}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  aria-label={`Цена: ${course.name}`}
                  value={prices[course.id]}
                  step={10000}
                  onChange={(event) => setPrices((prev) => ({ ...prev, [course.id]: Number(event.target.value) }))}
                  className="ma-field w-40 text-right"
                />
              </li>
            ))}
          </ul>
          <p className="ma-muted mt-3 text-xs">Цену меняют здесь — карточки курсов на сайте обновятся сами.</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-ma-line px-5 py-4 sm:px-8">
        {["Курсы", "Наборы", "Преподаватели", "Отзывы", "Сертификаты"].map((entry) => (
          <span key={entry} className="ma-chip text-xs">
            {entry}
          </span>
        ))}
        <span className="ma-muted ml-auto self-center text-xs">{teachers.length} преподавателя на сайте</span>
      </div>
    </div>
  );
}

/** Фото-«наклейка» для блоков — общие пропорции. */
export function Photo({ src, alt, className, sizes, priority }: { src: string; alt: string; className?: string; sizes: string; priority?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
