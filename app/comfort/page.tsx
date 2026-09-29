import Image from "next/image";
import Link from "next/link";

import { DevuzIntro } from "@/components/brand/devuz-intro";
import { In } from "@/components/cf/motion";

const palettes = [
  {
    id: "a",
    name: "Wine Ash + Turquoise",
    colors: ["#32292F", "#99E1D9"],
    ink: "#32292f",
    texture: "/images/comfort/tex-fabric.jpg",
    accent: "#99e1d9",
    note: "Тёплый винный пепел и прохладная бирюза: спокойно, дорого, фотографии мебели теплеют.",
  },
  {
    id: "b",
    name: "Cosmic + Vanilla",
    colors: ["#23212C", "#F1FEC8"],
    ink: "#23212c",
    texture: "/images/comfort/tex-quilt.jpg",
    accent: "#f1fec8",
    note: "Глубокий космос и ванильный акцент: контрастнее и моложе, цифры цен и рассрочки видны издалека.",
  },
] as const;

const wow = [
  ["Линза «под тканью — диван»", "Первый экран — макро их ткани во весь экран. Стеклянная линза под курсором (на телефоне — под пальцем) показывает ту же модель целиком."],
  ["От фактуры к вещи", "Сцена прокрутки: кадр начинается с подлокотника с зарядкой и отъезжает до модульного ВЕЛЬМОНТа. Прокрутка не перехватывается."],
  ["Влезет ли", "Стена, глубина, дверь, потолок — и план комнаты в масштабе по их реальным габаритам. Шкаф проверяется даже на подъём при сборке. В Ташкенте такого нет ни у кого."],
  ["Цена в месяц", "«от N сум в месяц» прямо в карточке — по их ценам, рассрочка Uzum и Anor. У конкурентов на главных этого нет."],
];

const found = [
  ["Кто", "Фабрика и сеть магазинов с 2007 года, Ташкент. Средний сегмент: «доступная мебель без компромиссов»."],
  ["Что", "300 моделей в магазине: 101 диван, 61 обеденная группа, 28 спальных гарнитуров, 27 шкафов, кровати, комоды, ТВ-зоны. Цены в сумах у 299 из 300."],
  ["Условия", "Доставка и сборка по Ташкенту бесплатно, гарантия 6–24 месяца, индивидуальные размеры, рассрочка Uzum и Anor за 5 минут."],
  ["Сайт сейчас", "WordPress + Elementor: первый байт 2,5–3,2 с, 108 файлов стилей и 83 скрипта, 4,2 МБ картинок на главной. Остатки демо-темы на английском, пустые счётчики, заказ — через Telegram."],
];

/**
 * Витрина Comfort Mebel: выбор палитры.
 *
 * Два входа в один и тот же рабочий сайт — различаются палитрой, не
 * составом. Здесь остаётся то, что к сайту не относится: что нашли у
 * клиента и конкурентов, в чём «вау» и что в прототипе настоящее. Цен
 * студии на витрине нет — это портфолио; смета — в панели devuz.studio.
 */
export default function ComfortHub() {
  return (
    <div data-cf="hub" className="min-h-screen pb-24">
      <DevuzIntro project="comfort" />

      <section className="relative isolate overflow-hidden">
        <Image src="/images/comfort/tex-boucle.jpg" alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-45" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(29_26_32/0.4),var(--cf-ink))]" />
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24">
          <span className="inline-flex rounded-full bg-white px-3 py-1.5">
            <Image src="/images/comfort/logo.png" alt="Comfort Mebel" width={1084} height={635} className="h-8 w-auto" priority />
          </span>
          <p className="cf-eyebrow mt-10 text-cf-accent">Новый клиент · comfort-mebel.uz</p>
          <h1 className="cf-display mt-5 max-w-4xl text-[clamp(2.6rem,8vw,6rem)]">Мебель, которую видно на ощупь</h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-cf-muted sm:text-lg">
            Прототип нового сайта мебельной фабрики Comfort Mebel. Один рабочий сайт в двух палитрах — листайте,
            тяните линзу, подбирайте диван по размерам комнаты. Внизу справа — конструктор: тумблеры включают
            дополнительные блоки прямо на странице.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {palettes.map((palette, index) => (
            <In key={palette.id} as="li" variant="rise" index={index}>
              <Link
                href={`/comfort/${palette.id}`}
                className="group relative block overflow-hidden rounded-[2rem]"
                style={{ background: palette.ink }}
              >
                <div className="relative aspect-[16/11] overflow-hidden">
                  <Image
                    src={palette.texture}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 45vw, 92vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-cf)] group-hover:scale-105"
                  />
                  <div
                    className="cf-glass absolute bottom-5 left-5 right-5 rounded-[1.5rem] p-5 sm:right-auto sm:w-72"
                    style={{ background: `color-mix(in srgb, ${palette.ink} 45%, transparent)` }}
                  >
                    <p className="cf-eyebrow" style={{ color: palette.accent }}>
                      Палитра {palette.id.toUpperCase()}
                    </p>
                    <p className="cf-display mt-2 text-2xl text-white">Доступная мебель без компромиссов</p>
                    <span
                      className="mt-4 inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold"
                      style={{ background: palette.accent, color: palette.ink }}
                    >
                      Смотреть каталог
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 p-6 text-white">
                  <div>
                    <p className="text-xl font-semibold">{palette.name}</p>
                    <p className="mt-2 max-w-sm text-sm text-white/65">{palette.note}</p>
                  </div>
                  <span className="flex items-center gap-2 text-xs tabular-nums text-white/70">
                    {palette.colors.map((color) => (
                      <span key={color} className="flex items-center gap-1.5">
                        <span className="h-5 w-5 rounded-full ring-1 ring-white/30" style={{ background: color }} />
                        {color}
                      </span>
                    ))}
                  </span>
                </div>
              </Link>
            </In>
          ))}
        </ul>

        <section className="mt-24 border-t border-cf-line pt-14">
          <p className="cf-eyebrow text-cf-accent">В чём «вау»</p>
          <h2 className="cf-display mt-4 max-w-3xl text-[clamp(2rem,5vw,3.4rem)]">Фактура и размеры — то, чего не хватает мебельным сайтам Ташкента</h2>
          <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[1.75rem] bg-cf-line md:grid-cols-2">
            {wow.map(([title, text]) => (
              <div key={title} className="bg-cf-ink-2 p-6 sm:p-7">
                <dt className="text-lg font-semibold">{title}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-cf-muted">{text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-24 grid grid-cols-1 gap-10 border-t border-cf-line pt-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="cf-display text-3xl">Что нашли у клиента</h2>
            <p className="mt-4 text-sm text-cf-muted">Только из их источников: comfort-mebel.uz, каталог магазина, их соцсети.</p>
          </div>
          <dl className="space-y-6 lg:col-span-8">
            {found.map(([title, text]) => (
              <div key={title} className="border-t border-cf-line pt-5">
                <dt className="cf-eyebrow text-cf-muted">{title}</dt>
                <dd className="mt-2 leading-relaxed">{text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-24 grid grid-cols-1 gap-10 border-t border-cf-line pt-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="cf-display text-3xl">На кого смотрели</h2>
          </div>
          <div className="space-y-5 text-sm leading-relaxed text-cf-muted lg:col-span-8">
            <p>
              <b className="text-cf-paper">Ташкент:</b> homedit.uz, divan.uz, mhome.uz, ashleyhomestore.uz, smebel.uz. Цены
              показывают почти все, рассрочку пишут текстом, подбора по размерам и цены в месяц в карточке нет ни у кого;
              AR — только у Ashley, и тот уводит на внешнюю ссылку.
            </p>
            <p>
              <b className="text-cf-paper">Мир, награды Awwwards:</b> Oakâme и Props Furniture (Site of the Day) — фактура,
              две тонировки и появление товара при прокрутке; Vitra Chair Finder (SOTD + Developer Award) — подбор
              вопросами; TERRANEST и Format Furniture (Honorable Mention) — параллакс и «сделано под вас». У IKEA и
              Castlery взяли идею примерки по размеру и платежа в месяц в карточке.
            </p>
          </div>
        </section>

        <section className="mt-24 grid grid-cols-1 gap-10 border-t border-cf-line pt-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="cf-display text-3xl">Что здесь настоящее</h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-cf-muted lg:col-span-8">
            <p>
              Настоящие: логотип, фотографии, названия моделей, цены в сумах, габариты, адреса и телефоны шоурумов,
              условия доставки, гарантии и рассрочки — всё с comfort-mebel.uz. Калькуляторы работают на этих данных.
            </p>
            <p>
              Условные: сроки рассрочки 3/6/12 месяцев (их покажет банк), ориентиры проходов в «Влезет ли», 3D на месте
              кадров, запись в шоурум — в прототипе никуда не уходит.
            </p>
          </div>
        </section>

        <p className="mt-16 border-t border-cf-line pt-8 text-xs leading-relaxed text-cf-muted/70">
          © 2026 Maximov Tech · DevUz. Прототип для Comfort Mebel: макет, тексты и код защищены авторским правом.
          Фотографии и логотип принадлежат Comfort Mebel и взяты с их сайта для показа прототипа.
        </p>
      </div>
    </div>
  );
}
