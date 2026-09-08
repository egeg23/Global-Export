import Image from "next/image";
import Link from "next/link";

import { ProjectSwitcher } from "@/components/adar/showcase/project-switcher";
import { Container } from "@/components/ui/container";
import { getNews, getProducts } from "@/lib/content/source";
import { isShowcase } from "@/lib/showcase";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type Stop = {
  href: string;
  eyebrow: string;
  title: string;
  text: string;
  note?: string;
  external?: boolean;
};

/**
 * The demo hub.
 *
 * A client opening a link should not have to be told where to click. Everything
 * built so far is listed once, in the order it makes sense to look at it, with
 * a sentence saying what each thing is for.
 */
export default async function PresentPage() {
  const [products, news] = await Promise.all([getProducts(), getNews()]);

  const stops: Stop[] = [
    {
      href: "/ru",
      eyebrow: "Основное",
      title: "Сайт целиком",
      text: `Главная, о компании, каталог из ${products.length} позиций, качество и сертификаты, команда, ${news.length} публикаций, контакты с формой заявки. Всё на трёх языках — переключатель в шапке.`,
      note: "Английская и узбекская версии: /en и /uz",
    },
    {
      href: "/motion.html",
      eyebrow: "Анимация",
      title: "Полёт урожая",
      text: "Ответ на вопрос про анимации уровня loeschs.de. Сухофрукты выходят в кадр, к ним подхватываются орехи, всё раскладывается по корзинам — и ниже разбор, сколько строк кода стоит каждый приём.",
      external: true,
    },
    {
      href: "/ru/concept-a",
      eyebrow: "Вариант оформления",
      title: "Концепция A — кинематографичная",
      text: "Тёмный фон, крупная типографика, горизонтальная лента товаров, поэтапный разбор производства. Направление, на которое указывает loeschs.de.",
    },
    {
      href: "/ru/concept-b",
      eyebrow: "Вариант оформления",
      title: "Концепция B — светлый каталог",
      text: "Светлый фон, мягкие скругления, счётчики и широкие строки категорий. Направление, на которое указывает hqdriedfruits.uz.",
    },
    {
      href: "/adar",
      eyebrow: "Второй проект",
      title: "ADAR — три концепции",
      text: "Подарочные наборы, adar.uz. Три варианта главной страницы со сметой по каждому: витрина, каталог с поиском по составу и премиальная версия. Отдельный проект — открывается в своём оформлении.",
      note: "Переключатель проектов — вверху страницы",
    },
    {
      href: isShowcase ? "/admin" : "/admin/login",
      eyebrow: "Управление",
      title: "Панель управления",
      text: "Новости, товары, категории, сертификаты, команда и медиатека. Тексты в трёх языках, фотографии перетаскиванием, черновики. Изменения появляются на сайте сразу — отдельной публикации нет.",
      note: isShowcase ? "Открывается сразу, без пароля" : "Доступ выдаётся отдельно",
    },
  ];

  return (
    <main className="pb-24">
      {/* Обложка */}
      <section className="relative isolate overflow-hidden border-b border-sand-50/10">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-950/70 via-forest-950/85 to-forest-950"
        />

        <Container className="pt-10">
          <ProjectSwitcher active="globalex" tone="dark" />
        </Container>

        <Container className="pb-20 pt-14 lg:pb-24 lg:pt-16">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-harvest-300">
            Прототип · Global Export Company
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-4xl leading-[1.05] text-sand-50 sm:text-5xl lg:text-6xl">
            Новый сайт — не в макетах, а рабочий
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-sand-200/80 sm:text-lg">
            По ссылкам ниже открывается не картинка, а работающий сайт: можно
            листать каталог, переключать язык, открывать карточки товаров,
            отправлять заявку. Наполнен вашими же материалами с globalex.uz.
          </p>

          {/* Единственное решение, которое нужно от заказчика после осмотра. */}
          <p className="mt-8 inline-flex flex-wrap items-center gap-x-3 gap-y-1 border-l-2 border-harvest-400 pl-4 text-sm text-sand-200/70">
            <span className="font-medium text-sand-50">Что нужно от вас:</span>
            выбрать одно из двух оформлений — в выбранном направлении сайт
            доводится до конца.
          </p>
        </Container>
      </section>

      {/* Что посмотреть */}
      <Container className="pt-16 lg:pt-20">
        <ul className="grid gap-px overflow-hidden rounded-card bg-sand-50/12">
          {stops.map((stop) => (
            <li key={stop.href}>
              <Link
                href={stop.href}
                prefetch={false}
                {...(stop.external ? { target: "_blank", rel: "noopener" } : {})}
                className="group grid gap-3 bg-forest-950 p-6 transition-colors duration-300 hover:bg-forest-900 sm:p-8 lg:grid-cols-12 lg:items-baseline lg:gap-8"
              >
                <div className="lg:col-span-4">
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-harvest-300">
                    {stop.eyebrow}
                  </span>
                  <h2 className="mt-2 font-display text-2xl leading-tight text-sand-50">
                    {stop.title}
                  </h2>
                </div>

                <p className="text-sm leading-relaxed text-sand-200/75 lg:col-span-6">
                  {stop.text}
                </p>

                <div className="lg:col-span-2 lg:text-right">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-sand-50">
                    Открыть
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                  {stop.note ? (
                    <span className="mt-1.5 block text-[0.7rem] text-sand-300/55">
                      {stop.note}
                    </span>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      {/* Честный статус */}
      <Container className="pt-16 lg:pt-20">
        <div className="grid gap-10 border-t border-sand-50/10 pt-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="font-display text-2xl text-sand-50">
              Что здесь настоящее, а что нужно подтвердить
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-sand-300/55">
              Прототип наполнялся без выдумок: где данных не было, поле осталось
              пустым, а не заполнилось правдоподобным.
            </p>
          </div>

          <div className="space-y-5 text-sm leading-relaxed text-sand-200/75 lg:col-span-7">
            <p>
              Названия товаров, тексты компании, публикации, состав команды,
              сертификаты и все фотографии перенесены с вашего действующего
              сайта — ничего не выдумано.
            </p>
            <p>
              Описания товаров, характеристики части позиций, коды ТН ВЭД и
              условия упаковки проставлены отраслевыми — у вас они нигде не
              опубликованы. Перед запуском их нужно сверить или заменить.
              Построчная сверка ведётся в проекте отдельным документом.
            </p>
            <p>
              Не хватает данных, которых нет в открытом доступе: телефоны и
              адрес офиса, фотографии сотрудников, сканы сертификатов,
              расположение производственных площадок. Отдельно нужно уточнить
              расхождение: на английской версии вашего сайта мощность по
              сухофруктам указана 15 000 тонн, на русской — 50 000.
            </p>
            <p className="text-sand-300/55">
              Узбекская версия — наш перевод: у вас её нет.
            </p>
          </div>
        </div>
      </Container>

      <Container className="pt-14">
        <p className="text-xs text-sand-300/45">
          Демонстрационная площадка. Заявки с формы{" "}
          {isSupabaseConfigured ? "сохраняются" : "не отправляются"} и в реальную
          работу не идут. Страница закрыта от индексации.
        </p>
      </Container>
    </main>
  );
}
