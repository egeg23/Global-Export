import Image from "next/image";
import Link from "next/link";

import { DevuzIntro } from "@/components/brand/devuz-intro";
import { In } from "@/components/medacademy/shared/motion";
import { photos } from "@/content/medacademy/facts";

const variants = [
  {
    id: "a",
    name: "A · Клиника",
    mood: "Строгий клинический премиум",
    photo: photos.team,
    bg: "#f7f5f1",
    ink: "#122833",
    accent: "#ac1f1b",
    colors: ["#F7F5F1", "#122833", "#AC1F1B", "#709087"],
    fonts: "Literata + Onest · Phosphor Light",
    title: "Поступить в медицинский — по системе.",
    note: "Тёплая бумага, книжная антиква, красная линия ЭКГ из их логотипа ведёт по странице. Читается как хороший медицинский справочник.",
  },
  {
    id: "b",
    name: "B · Лаборатория",
    mood: "Живой и смелый, как сильные онлайн-школы",
    photo: photos.chem,
    bg: "#191337",
    ink: "#e5e4ee",
    accent: "#cff846",
    colors: ["#191337", "#CFF846", "#8D66FF", "#E995BE"],
    fonts: "Dela Gothic One + Commissioner · Hugeicons",
    title: "Химия + биология = медвуз",
    note: "Ультрафиолет и кислотный лайм, таблица элементов и живые молекулы на первом экране, экспресс-тест с конфетти, карточки-перевёртыши преподавателей.",
  },
] as const;

const wow = [
  ["Калькулятор балла DTM", "Ученик вводит число верных ответов или уровень сертификата — и видит балл из 189 рядом с баллами, с которыми поступали его будущие преподаватели (180,5 и 179,2). У центров Ташкента такого нет ни у кого."],
  ["Регалии вместо «опытных преподавателей»", "На их сайте баллы, USMLE и IELTS спрятаны в карточках, которые открываются через раз. Мы вынесли их на первый экран: это самый сильный аргумент центра."],
  ["Одно действие — Telegram", "Каждая кнопка открывает чат администратора @medacademy_admin с готовым текстом: какой курс, что выбрал в тесте, какой день удобен."],
  ["Конструктор как у MAVERA", "Внизу справа — тумблеры: подбор курса, запись, проверка сертификата, кабинет, оплата, языки. Блок появляется на странице сразу, у нового — переключатель «было / стало»."],
];

const found = [
  ["Кто", "Центр подготовки абитуриентов в медицинские вузы, Ташкент, ул. Шахрисабз 16А. С 2017 года; по их словам, 350+ выпускников стали студентами медвузов."],
  ["Курсы", "Химия и биология — по 870 000 сум, комплекс — 1 640 000 сум. 100+ и 200+ часов, 67 и 78 видеолекций, чат с наставником, поддержка 24/7."],
  ["Преподаватели", "Азамат Исламбеков (ТМА, 180,5/189, USMLE Step 1–2), Рашид Валиулин (ТМА, 179,2/189, IELTS 7,5), Самира Рахматова (164,7), Хонзода Шахобиддинова."],
  ["Сайт сейчас", "Конструктор Sitehub: главная весит 9,7 МБ и грузится 8 с; заголовки без кириллицы в шрифте; в исходном HTML карточки трёх из четырёх преподавателей показывают данные Азамата; открыт листинг каталогов; только русский язык."],
];

/**
 * Витрина MedAcademy: выбор варианта.
 *
 * Два входа — два разных сайта: своя палитра, шрифты, иконки, композиция и
 * свой фирменный ход. Здесь — то, что к сайту не относится: что нашли у
 * клиента и конкурентов, в чём «вау» и что в макете настоящее. Цен студии
 * на витрине нет — это портфолио.
 */
export default function MedacademyHub() {
  return (
    <div data-ma="hub" className="min-h-dvh pb-24">
      <DevuzIntro project="medacademy" />

      <section className="mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 sm:pb-20 sm:pt-20">
        <span className="inline-flex rounded-xl bg-white px-4 py-2">
          <Image src="/images/medacademy/logo-ink.png" alt="MedAcademy" width={485} height={323} className="h-12 w-auto" priority />
        </span>
        <p className="ma-eyebrow mt-10 text-ma-accent">Новый клиент · medacademy.uz</p>
        <h1 className="ma-display mt-5 max-w-4xl text-5xl sm:text-6xl lg:text-7xl">Подготовка в медвуз, которую видно в баллах</h1>
        <p className="mt-7 max-w-2xl text-lg text-ma-ink-2">
          Макет нового сайта MedAcademy — курсы биологии и химии для поступления в медицинские вузы. Два совершенно разных
          варианта: откройте любой, посчитайте свой балл DTM и включите дополнительные блоки в конструкторе внизу справа.
        </p>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {variants.map((variant, index) => (
            <In key={variant.id} as="li" variant="rise" index={index}>
              <Link href={`/medacademy/${variant.id}`} className="group block overflow-hidden rounded-[1.5rem] ring-1 ring-white/10" style={{ background: variant.bg, color: variant.ink }}>
                <div className="grid grid-cols-[1fr_40%] gap-4 p-6 sm:p-8">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: variant.accent }}>
                      Вариант {variant.name}
                    </p>
                    <p
                      className="mt-4 text-3xl leading-tight sm:text-4xl"
                      style={{ fontFamily: variant.id === "a" ? "var(--font-ma-literata)" : "var(--font-ma-dela)", textTransform: variant.id === "b" ? "uppercase" : undefined }}
                    >
                      {variant.title}
                    </p>
                    <span
                      className="mt-6 inline-flex min-h-11 items-center rounded-full px-5 text-sm font-bold transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
                      style={{ background: variant.accent, color: variant.id === "a" ? "#fff" : "#191337" }}
                    >
                      Открыть вариант →
                    </span>
                  </div>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                    <Image src={variant.photo} alt="" fill sizes="(min-width: 768px) 18vw, 36vw" className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none" />
                  </div>
                </div>
                <div className="border-t p-6 sm:px-8" style={{ borderColor: variant.id === "a" ? "#c4cbce" : "rgb(229 228 238 / 0.14)" }}>
                  <p className="font-bold">{variant.mood}</p>
                  <p className="mt-2 text-sm opacity-80">{variant.note}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                    {variant.colors.map((color) => (
                      <span key={color} className="inline-flex items-center gap-1.5 tabular-nums">
                        <span className="h-5 w-5 rounded-full ring-1 ring-black/15" style={{ background: color }} />
                        {color}
                      </span>
                    ))}
                    <span className="opacity-80">· {variant.fonts}</span>
                  </div>
                </div>
              </Link>
            </In>
          ))}
        </ul>

        <section className="mt-24 border-t border-ma-line pt-14">
          <p className="ma-eyebrow text-ma-accent">В чём «вау»</p>
          <h2 className="ma-display mt-4 max-w-3xl text-4xl sm:text-5xl">Цифры вместо обещаний — то, чего не хватает центрам подготовки</h2>
          <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[1.25rem] bg-ma-line md:grid-cols-2">
            {wow.map(([title, text]) => (
              <div key={title} className="bg-ma-surface p-6 sm:p-7">
                <dt className="text-lg font-bold">{title}</dt>
                <dd className="ma-muted mt-2 text-sm leading-relaxed">{text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-24 grid grid-cols-1 gap-10 border-t border-ma-line pt-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="ma-display text-3xl">Что нашли у клиента</h2>
            <p className="ma-muted mt-4 text-sm">Только из их источников: medacademy.uz, карточки курсов и преподавателей, их соцсети.</p>
          </div>
          <dl className="space-y-6 lg:col-span-8">
            {found.map(([title, text]) => (
              <div key={title} className="border-t border-ma-line pt-5">
                <dt className="ma-eyebrow ma-muted">{title}</dt>
                <dd className="mt-2 leading-relaxed">{text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-24 grid grid-cols-1 gap-10 border-t border-ma-line pt-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="ma-display text-3xl">На кого смотрели</h2>
          </div>
          <div className="ma-muted space-y-5 text-sm leading-relaxed lg:col-span-8">
            <p>
              <b className="text-ma-ink">Ташкент:</b> Bunker School, Chemical Science, «Галактика», подкурсы ТМА, Euromed Study, TOP
              EDUCATION. Открытые цены — только у Bunker, бесплатное первое занятие — у «Галактики». Баллов конкретных
              преподавателей и учеников, калькулятора DTM и онлайн-теста с результатом нет ни у кого.
            </p>
            <p>
              <b className="text-ma-ink">СНГ:</b> Умскул, Вебиум, MAXIMUM, Юнилогия — подбор курса вопросами, «попробовать за 0 ₽»,
              прогноз балла, сравнение с репетитором. <b className="text-ma-ink">Мир:</b> Brilliant и AMBOSS — интерактив прямо на
              странице; The Online School (Awwwards Honorable Mention) и IntegratedBio (Awwwards SOTD, 2026) — один сильный
              момент движения вместо анимации на каждой секции.
            </p>
          </div>
        </section>

        <section className="mt-24 grid grid-cols-1 gap-10 border-t border-ma-line pt-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="ma-display text-3xl">Что здесь настоящее</h2>
          </div>
          <div className="ma-muted space-y-4 text-sm leading-relaxed lg:col-span-8">
            <p>
              Настоящие: логотип, фотографии (съёмка с их сайта), имена и баллы преподавателей, курсы, цены в сумах, часы и
              число лекций, отзывы с датами, адрес, телефон, почта, Telegram, Instagram и YouTube. Формула DTM — официальная
              (90 вопросов, максимум 189).
            </p>
            <p>
              Условные и помеченные на странице: баллы за сертификат (ориентир testmakon.uz), расписание наборов, номер
              сертификата для проверки, данные кабинета и панели, заголовки статей, вопросы экспресс-теста. Перевод на
              узбекский и английский сделан для шапки и первого экрана.
            </p>
          </div>
        </section>

        <p className="mt-16 border-t border-ma-line pt-8 text-xs leading-relaxed text-ma-muted">
          © 2026 Maximov Tech · DevUz. Макет для MedAcademy: вёрстка, тексты и код защищены авторским правом. Логотип и
          фотографии принадлежат MedAcademy и взяты с их сайта для показа макета.
        </p>
      </div>
    </div>
  );
}
