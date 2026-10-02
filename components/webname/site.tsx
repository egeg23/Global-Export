"use client";

import Image from "next/image";
import Link from "next/link";

import { Addon } from "@/components/configurator/context";
import { FreeBoard } from "@/components/webname/board";
import { Calculator } from "@/components/webname/calculator";
import { Pulse } from "@/components/webname/globe";
import { Hero, SearchProvider } from "@/components/webname/hero";
import { Hosting } from "@/components/webname/hosting";
import { Icon, type IconName } from "@/components/webname/icons";
import { LangPills, LangProvider, useT } from "@/components/webname/lang";
import { In } from "@/components/webname/motion";
import { Cabinet, Dns, Pay, Transfer } from "@/components/webname/tools";
import { clientSites, contacts, mapHref, ssl, sum, tgHref } from "@/content/webname/facts";
import { cn } from "@/lib/cn";

/**
 * Макет сайта Arsenal D (webname.uz) — «реестр».
 *
 * Первый экран — адресная строка: имя печатается само, марки зон
 * показывают, где оно свободно, и на свидетельство падает печать. Дальше —
 * табло освободившихся доменов, реестр услуг, тарифы в сумах, глобус зон,
 * перенос, DNS, жизненный цикл домена, кабинет. Блоки допов включает
 * конструктор (док справа внизу).
 */
/**
 * Каркас всех страниц макета: мир «реестра», языки, общее состояние поиска,
 * шапка и подвал. Главная и пошаговые страницы (домены, хостинг) — в нём.
 */
export function WebnameShell({ children }: { children: React.ReactNode }) {
  return (
    <div data-wn className="min-h-dvh overflow-x-clip">
      <LangProvider>
        <SearchProvider>
          <Header />
          {children}
          <Footer />
        </SearchProvider>
      </LangProvider>
    </div>
  );
}

export function WebnameSite() {
  return (
    <WebnameShell>
      <main>
        <Hero />
        <Addon id="board">
          <FreeBoard />
        </Addon>
        <Services />
        <Hosting />
        <Addon id="calc">
          <Block id="calc" title="Домен, хостинг и сайт — одним счётом" lead="Выберите зону, тариф и сертификат — итог в сумах сразу. Расчёт уходит менеджеру одним нажатием.">
            <Calculator />
          </Block>
        </Addon>
        <Pulse />
        <Addon id="transfer">
          <Block id="transfer" title="Перенос домена — три шага" lead="Домен у другого регистратора? Заберём его вместе с сайтом, без простоя.">
            <Transfer />
          </Block>
        </Addon>
        <Addon id="dns">
          <Block id="dns" title="DNS — без звонка в поддержку" lead="Сайт, почта Google или Яндекс — готовым набором. DNSSEC — одним тумблером." tone="paper-2">
            <Dns />
          </Block>
        </Addon>
        <Lifecycle />
        <Addon id="cabinet">
          <Block id="cabinet" title="Кабинет, который помнит сроки" lead="Домены, хостинг и сертификаты — карточками. Что скоро истечёт, видно красным.">
            <Cabinet />
          </Block>
        </Addon>
        <Addon id="pay" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <Pay />
        </Addon>
        <Sites />
        <Contacts />
      </main>
    </WebnameShell>
  );
}

/* ------------------------------------------------------------------ */

function Header() {
  const t = useT();
  // «Домены» и «Хостинг» ведут на пошаговые страницы: заказчик видит, что
  // идёт после первого экрана. Остальное — якоря главной.
  const links: [string, string][] = [
    ["/webname/domains", t("domains")],
    ["/webname/hosting", t("hosting")],
    ["/webname#services", t("ssl")],
    ["/webname#contacts", t("contacts")],
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-wn-line bg-wn-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/webname" className="shrink-0" aria-label="Arsenal D — на главную">
          <Image src="/images/webname/arsenal-d.png" alt="Arsenal D" width={363} height={105} className="h-8 w-auto sm:h-9" preload />
        </Link>
        <nav aria-label="Разделы" className="ml-6 hidden items-center gap-6 text-sm lg:flex">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="text-wn-ink-2 transition-colors hover:text-wn-stamp">
              {label}
            </Link>
          ))}
        </nav>
        <LangPills className="ml-auto" />
        <a href={contacts.cabinet} target="_blank" rel="noopener noreferrer" className="hidden min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-bold text-wn-ink-2 hover:text-wn-ink md:inline-flex">
          <Icon name="key" className="h-4 w-4" />
          {t("cabinet")}
        </a>
        <a
          href={tgHref("Здравствуйте! Вопрос по домену.")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("write")}
          className="flex h-11 w-11 items-center justify-center rounded-lg bg-wn-stamp text-white sm:hidden"
        >
          <Icon name="brand-telegram" className="h-5 w-5" />
        </a>
        <a href={tgHref("Здравствуйте! Вопрос по домену.")} target="_blank" rel="noopener noreferrer" className="wn-btn hidden min-h-11 px-4 text-sm sm:inline-flex">
          <Icon name="brand-telegram" className="h-4 w-4" />
          {t("write")}
        </a>
      </div>
      <nav aria-label="Разделы" className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 pb-2 text-sm lg:hidden">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="flex min-h-11 shrink-0 items-center rounded-lg px-3 text-wn-ink-2 hover:bg-wn-card hover:text-wn-stamp">
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function Block({
  id,
  title,
  lead,
  tone,
  children,
}: {
  id: string;
  title: string;
  lead?: string;
  tone?: "paper-2";
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-20", tone === "paper-2" && "bg-wn-paper-2")}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <In variant="unfold">
          <h2 className="wn-display max-w-3xl text-4xl sm:text-5xl">{title}</h2>
          {lead ? <p className="wn-muted mt-4 max-w-2xl">{lead}</p> : null}
        </In>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const SERVICES: { icon: IconName; name: string; text: string; price: string }[] = [
  { icon: "world", name: "Домены .UZ", text: "Регистрация и продление на 1–10 лет, смена владельца, аннулирование", price: `${sum(35_000)} / год` },
  { icon: "world-www", name: "1000+ зон мира", text: ".com, .org, .kz, .ae, .io — с договором и счётом в сумах", price: `от ${sum(205_000)}` },
  { icon: "server-2", name: "Хостинг", text: "23 тарифа: почта на домене, MySQL, FTP, восстановление из копии", price: `от ${sum(3_000)} / мес` },
  { icon: "cpu", name: "VDS / VPS", text: "Свой сервер под магазин, CRM или 1С — с администрированием", price: "по конфигурации" },
  { icon: "lock", name: "SSL-сертификаты", text: `Sectigo, GeoTrust, Thawte, RapidSSL — DV, OV, EV и Wildcard`, price: `от ${sum(ssl[0].price)}` },
  { icon: "shield-check", name: "DNSSEC", text: "Подпись зоны домена — защита от подмены адреса", price: "по прайсу" },
  { icon: "certificate", name: "NFT-сертификат домена", text: "Цифровое свидетельство на домен второго уровня", price: "по прайсу" },
  { icon: "rocket", name: "Быстрая бронь", text: "Домен, хостинг или SSL без регистрации — менеджер оформит сам", price: "без кабинета" },
  { icon: "layout-dashboard", name: "Сайты под ключ", text: "Студия Arsenal D: сайты и программные разработки любого масштаба", price: "по смете" },
];

/** Реестр услуг — строки журнала, а не одинаковые карточки. */
function Services() {
  return (
    <section id="services" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <In variant="unfold">
          <h2 className="wn-display max-w-3xl text-4xl sm:text-5xl">Весь арсенал — от имени до сервера</h2>
          <p className="wn-muted mt-4 max-w-2xl">Всё, что нужно сайту, — у одного аккредитованного регистратора, с договором и закрывающими документами.</p>
        </In>
        <ul className="mt-10 border-t-2 border-wn-ink">
          {SERVICES.map((service, index) => (
            <In key={service.name} as="li" variant="ledger" index={index % 4}>
              <div className="group grid grid-cols-[2.5rem_1fr] items-start gap-x-4 gap-y-1 border-b border-wn-line py-5 transition-colors hover:bg-wn-card sm:grid-cols-[3rem_16rem_1fr_auto] sm:items-center sm:px-3">
                <Icon name={service.icon} className="h-8 w-8 text-wn-stamp transition-transform duration-300 group-hover:-rotate-6 motion-reduce:transform-none" />
                <h3 className="wn-display text-xl sm:text-2xl">{service.name}</h3>
                <p className="col-start-2 text-wn-ink-2 sm:col-start-3">{service.text}</p>
                <p className="wn-mono col-start-2 text-sm font-bold sm:col-start-4 sm:text-right">{service.price}</p>
              </div>
            </In>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const LIFE = [
  { title: "Активен", text: "Сайт и почта работают. Кабинет напоминает о сроке по почте и SMS.", tone: "bg-wn-mint" },
  { title: "Срок истёк", text: "Сайт останавливается. Продлить ещё можно по обычной цене.", tone: "bg-wn-amber" },
  { title: "REDEMPTION", text: "Домен на удержании. Вернуть — только по договору восстановления.", tone: "bg-wn-stamp" },
  { title: "Освобождён", text: "Имя снова свободно — и попадает на табло и в канал.", tone: "bg-wn-sky" },
  { title: "У нового владельца", text: "Кто успел — тот и занял. Поэтому мы и напоминаем заранее.", tone: "bg-wn-ink" },
];

/**
 * Жизненный цикл домена — тема, которую сами Arsenal D разбирают у себя
 * («Схема жизненного цикла домена»). Линия дорисовывается scaleX, этапы
 * встают по очереди. Сроков в днях на макете нет: их на сайте не называют.
 */
function Lifecycle() {
  return (
    <section id="life" className="scroll-mt-20 bg-wn-paper-2">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <In variant="unfold">
          <h2 className="wn-display max-w-3xl text-4xl sm:text-5xl">Что будет с доменом, если забыть продлить</h2>
        </In>
        <In variant="rise" className="relative mt-12">
          <div aria-hidden="true" className="absolute left-[0.6875rem] top-0 h-full w-0.5 bg-wn-line lg:left-0 lg:top-[0.6875rem] lg:h-0.5 lg:w-full" />
          <div aria-hidden="true" className="wn-grow absolute left-0 top-[0.6875rem] hidden h-0.5 w-full bg-wn-stamp lg:block" />
          <ol className="relative grid gap-8 lg:grid-cols-5 lg:gap-6">
            {LIFE.map((stage, index) => (
              <li key={stage.title} className="relative grid grid-cols-[1.5rem_1fr] gap-4 lg:block">
                <span className={cn("relative z-10 block h-6 w-6 rounded-full ring-4 ring-wn-paper-2", stage.tone)} />
                <div className="lg:mt-5">
                  <p className="wn-mono text-xs text-wn-muted">этап {index + 1}</p>
                  <h3 className="wn-display mt-1 text-xl">{stage.title}</h3>
                  <p className="mt-2 text-sm text-wn-ink-2">{stage.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </In>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/** Сайты: SitePad бесплатно и студия под ключ. Адреса — их перечень клиентов. */
function Sites() {
  const row = [...clientSites, ...clientSites];
  return (
    <section id="sites" className="scroll-mt-20 overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <In variant="stamp" className="wn-card flex flex-col p-6 sm:p-10">
          <Icon name="palette" className="h-10 w-10 text-wn-sky" />
          <h2 className="wn-display mt-6 text-3xl sm:text-4xl">Сайт сами — бесплатно</h2>
          <p className="mt-4 text-wn-ink-2">Конструктор SitePad входит в хостинг: больше 270 готовых шаблонов, редактор без кода и публикация на свой домен в пару кликов.</p>
          <a href="https://sitepad.com/themes" target="_blank" rel="noopener noreferrer" className="wn-btn wn-btn-ghost mt-8 self-start lg:mt-auto">
            Шаблоны SitePad
            <Icon name="arrow-up-right" className="h-4 w-4" />
          </a>
        </In>
        <In variant="stamp" index={1} className="wn-dark flex flex-col rounded-[1.25rem] p-6 sm:p-10">
          <Icon name="code" className="h-10 w-10 text-wn-amber" />
          <h2 className="wn-display mt-6 text-3xl sm:text-4xl">Или под ключ — студией Arsenal D</h2>
          <p className="wn-muted mt-4">Сайт компании, магазин, госпортал или программа на заказ: дизайн, разработка, хостинг и домен — у одного подрядчика.</p>
          <a href={tgHref("Здравствуйте! Хочу сайт под ключ.")} target="_blank" rel="noopener noreferrer" className="wn-btn mt-8 self-start">
            <Icon name="brand-telegram" className="h-5 w-5" />
            Обсудить сайт
          </a>
        </In>
      </div>
      <div className="pb-16 lg:pb-24">
        <p className="wn-muted mx-auto max-w-7xl px-4 text-sm sm:px-6">Сайты из перечня клиентов на webname.uz</p>
        <div className="mt-4 overflow-hidden motion-reduce:overflow-x-auto">
          <ul className="wn-marquee flex w-max gap-3 px-4">
            {row.map((site, index) => (
              <li key={index} aria-hidden={index >= clientSites.length} className="wn-mono shrink-0 rounded-xl bg-wn-card px-5 py-3 text-lg ring-1 ring-wn-line">
                {site.replace(/\.uz$/, "")}
                <span className="text-wn-stamp">.uz</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Contacts() {
  return (
    <section id="contacts" className="scroll-mt-20 px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="wn-dark mx-auto grid max-w-7xl gap-10 overflow-hidden rounded-[1.5rem] p-6 sm:p-10 lg:grid-cols-12 lg:p-14">
        <div className="lg:col-span-6">
          <h2 className="wn-display text-4xl sm:text-5xl">Ответим и оформим за вас</h2>
          <p className="wn-muted mt-4 max-w-md">Пишите в Telegram или звоните — менеджер подберёт домен, тариф и пришлёт договор.</p>
          <a
            href={tgHref("Здравствуйте! Хочу зарегистрировать домен.")}
            target="_blank"
            rel="noopener noreferrer"
            className="wn-btn mt-8 min-h-14 px-7 text-lg"
          >
            <Icon name="brand-telegram" className="h-6 w-6" />@{contacts.telegram}
          </a>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-6">
          <Card icon="phone" label="Телефоны">
            {contacts.phones.map((phone) => (
              <a key={phone.href} href={phone.href} className="block underline-offset-4 hover:underline">
                {phone.label}
              </a>
            ))}
          </Card>
          <Card icon="clock" label="Часы работы">
            {contacts.hours}
          </Card>
          <Card icon="map-pin" label="Адрес">
            <a href={mapHref} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
              {contacts.address}
            </a>
          </Card>
          <Card icon="mail" label="Почта">
            <a href={`mailto:${contacts.email}`} className="underline-offset-4 hover:underline">
              {contacts.email}
            </a>
          </Card>
          <Card icon="brand-android" label="Приложение" wide>
            <a href={contacts.app} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
              webname.uz в Google Play — домены и продление с телефона
            </a>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Card({ icon, label, wide, children }: { icon: IconName; label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-2xl bg-white/5 p-5 ring-1 ring-white/10", wide && "sm:col-span-2")}>
      <Icon name={icon} className="h-6 w-6 text-wn-amber" />
      <p className="wn-muted mt-3 text-sm">{label}</p>
      <div className="mt-1 break-words font-bold">{children}</div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-6">
      <Image src="/images/webname/arsenal-d.png" alt="Arsenal D" width={363} height={105} className="h-9 w-auto self-start sm:self-auto" />
      <p className="wn-muted text-xs sm:mx-auto sm:text-center">
        © Arsenal D. Макет — DevUz. Логотип, тарифы, цены и контакты — с webname.uz; цена .UZ — с registrars.uz.
      </p>
      <a href={`https://t.me/${contacts.telegram}`} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-wn-line hover:bg-wn-card">
        <Icon name="brand-telegram" className="h-5 w-5" />
      </a>
    </footer>
  );
}
