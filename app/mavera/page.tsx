import Image from "next/image";
import Link from "next/link";

import { ProjectSwitcher } from "@/components/adar/showcase/project-switcher";
import { tiers } from "@/components/present/mavera/theme";
import { VariantCards } from "@/components/mavera/hub/variants";
import { AdminGallery } from "@/components/mavera/admin/gallery";
import { photos } from "@/content/mavera/photos";
import { Container } from "@/components/ui/container";

/** Что подсмотрено у крупных девелоперов и зачем это здесь. */
const benchmarks = [
  {
    source: "Донстрой",
    taken: "Цифры масштаба на главной и отдельный поиск по параметрам с выходом на карту.",
  },
  {
    source: "Level Group",
    taken: "Стартовая цена и срок сдачи в карточке, статусы «сдан / скоро / IV кв. 2027», счётчик найденного.",
  },
  {
    source: "FORMA",
    taken: "Строка условий покупки поверх шапки: ипотека, рассрочка, скидка.",
  },
  {
    source: "Общая практика",
    taken: "Интерактивный генплан, шахматка этажей с планировкой, фотоотчёт о ходе работ по месяцам.",
  },
];

/**
 * Витрина MAVERA.
 *
 * Не галерея скриншотов, а четыре входа: каждый вариант — работающий сайт,
 * который листают, а не разглядывают. Здесь остаётся то, что к сайтам не
 * относится: смета, панель управления и честный список того, откуда взяты
 * фотографии.
 */
export default function MaveraHub() {
  return (
    <main className="pb-24 text-sand-50">
      <Container className="pt-10">
        <ProjectSwitcher active="mavera" tone="dark" />
      </Container>

      {/* Обложка. */}
      <section className="relative isolate mt-10 overflow-hidden border-y border-sand-50/10">
        <Image
          src="/images/mavera/park.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover opacity-40"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0b0d10] via-[#0b0d10]/85 to-[#0b0d10]/60" />

        <Container className="py-20 lg:py-28">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-harvest-300">
            Новый клиент · MAVERA
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.4rem,6vw,4.8rem)] leading-[1.02]">
            Четыре сайта, а не четыре палитры
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-sand-200/80 sm:text-lg">
            Каждый вариант открывается целиком: своя сетка, свой шрифт, свой
            характер движения и свой разговор с покупателем. Листайте, наводите,
            кликайте — в «Премиуме» и «Премиум Noir» генплан и шахматка работают
            по-настоящему.
          </p>
        </Container>
      </section>

      {/* Четыре входа со сметой. */}
      <Container className="pt-16 lg:pt-20">
        <VariantCards />
      </Container>

      {/* Панель управления — одна на все варианты. */}
      <Container className="pt-24">
        <section className="border-t border-sand-50/10 pt-14">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-harvest-300">
            Пункт 7 брифа · отдельно от вариантов
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-3xl leading-tight text-sand-50 sm:text-4xl">
            Панель управления
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-sand-200/75">
            За основу взята админка Global Export — она уже работает у действующего
            клиента. Под застройщика добавлено то, без чего нельзя: корпуса и
            квартиры с ценами и статусами, планировки, роли сотрудников и аналитика
            поведения посетителей.
          </p>

          <ul className="mt-8 grid gap-px overflow-hidden rounded-card bg-sand-50/12 sm:grid-cols-3">
            {[
              ["Каталог", "ЖК, корпуса, квартиры, планировки, цены и фотографии — без разработчика"],
              ["Продажи", "Заявки с источником до квартиры, выгрузка в CRM, цели и вебвизор Метрики"],
              ["Доступ", "Роли для продаж, контента и подрядчиков, журнал изменений цен и статусов"],
            ].map(([title, text]) => (
              <li key={title} className="bg-forest-950 p-6">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-harvest-300">
                  {title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-sand-200/75">{text}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <AdminGallery />
          </div>

          <p className="mt-8 text-sm leading-relaxed text-sand-300/60">
            Здесь панель показана целиком. Что из неё входит в пакет, а что —
            допник, видно в конструкторе на странице панели:{" "}
            {tiers.map((tier, index) => (
              <span key={tier.id}>
                {index ? " · " : null}
                <Link
                  href={`/mavera/${tier.id}/admin`}
                  prefetch={false}
                  className="text-harvest-300 underline decoration-dotted underline-offset-2 transition-colors hover:text-harvest-200"
                >
                  {tier.label}
                </Link>
              </span>
            ))}
            .
          </p>
        </section>
      </Container>

      {/* Ориентиры. */}
      <Container className="pt-24">
        <section className="border-t border-sand-50/10 pt-14">
          <h2 className="font-display text-3xl leading-tight text-sand-50">
            На что смотрели: рынок РФ
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-sand-200/75">
            «Премиум» собран не из головы. Разобрали, как устроены сайты крупных
            московских девелоперов, и взяли то, что у них работает на продажи.
          </p>

          <dl className="mt-10 grid gap-px overflow-hidden rounded-card bg-sand-50/12 lg:grid-cols-2">
            {benchmarks.map((item) => (
              <div key={item.source} className="bg-forest-950 p-6 sm:p-7">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-harvest-300">
                  {item.source}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-sand-200/75">{item.taken}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Container>

      {/* Честный статус. */}
      <Container className="pt-20">
        <section className="grid gap-10 border-t border-sand-50/10 pt-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="font-display text-2xl text-sand-50">
              Что здесь настоящее, а что — заглушка
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-sand-300/55">
              Сайты рабочие. Содержание — нет.
            </p>
          </div>

          <div className="space-y-5 text-sm leading-relaxed text-sand-200/75 lg:col-span-7">
            <p>
              Настоящие здесь структура, поведение и оформление: сетка, типографика,
              фильтры, генплан, шахматка, поведение при прокрутке и на телефоне.
            </p>
            <p>
              Заглушки — названия жилых комплексов, районы, цифры, цены, телефоны и
              адрес. Портфель MAVERA мы не знаем и выдумывать его за компанию не будем.
            </p>
            <p>
              Фотографии — настоящие здания, но чужие: сняты не в проектах MAVERA, а
              взяты со свободных источников под лицензиями Creative Commons. На их
              место встанут ваши рендеры и съёмка. Полный список авторов — ниже.
            </p>
          </div>
        </section>
      </Container>

      {/* Кому и на каких условиях показывается. */}
      <Container className="pt-16">
        <p className="border-t border-sand-50/10 pt-8 text-xs leading-relaxed text-sand-300/45">
          © 2026 Maximov Tech. Закрытый показ для MAVERA: макеты, тексты и код
          защищены авторским правом, копирование и передача третьим лицам без
          согласия студии запрещены.
        </p>
      </Container>

      {/* Авторы снимков. */}
      <Container className="pt-16">
        <details className="border-t border-sand-50/10 pt-8">
          <summary className="cursor-pointer text-sm text-sand-300/60 transition-colors hover:text-sand-50">
            Откуда фотографии — {photos.length} снимков, лицензии и авторы
          </summary>
          <ul className="mt-6 grid gap-x-10 gap-y-3 text-xs leading-relaxed text-sand-300/45 lg:grid-cols-2">
            {photos.map((photo) => (
              <li key={photo.file}>
                <a
                  href={photo.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:text-sand-200 hover:underline"
                >
                  {photo.title.replace(/\.(jpg|jpeg|png|JPG)$/i, "")}
                </a>
                {" — "}
                {photo.author}, {photo.license}
              </li>
            ))}
          </ul>
        </details>
      </Container>
    </main>
  );
}
