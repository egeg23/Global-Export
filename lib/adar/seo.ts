import type { Metadata } from "next";

import { company } from "@/content/adar/company";
import { showcaseChrome } from "@/lib/adar/showcase";
import type { GiftSet } from "@/lib/adar/types";

/**
 * Канонический адрес сайта компании.
 *
 * На сервере заказчика задаётся в `.env.local` строкой `ADAR_SITE_URL`.
 * Значение по умолчанию — их нынешний домен: адреса в карте сайта и в
 * разметке должны указывать на сайт компании, а не на нашу площадку.
 */
export const adarSiteUrl = (process.env.ADAR_SITE_URL ?? "https://adar.uz").replace(/\/$/, "");

/**
 * Пускать ли поисковики.
 *
 * На нашей демонстрационной площадке — нет: два одинаковых сайта в выдаче
 * отбирают показы друг у друга, и проигрывает тот, что настоящий. Признак
 * тот же, что у витринной обвязки, так что отдельной настройки не нужно.
 */
export const adarIndexable = !showcaseChrome;

/** Разделы одностраничника — они же записи карты сайта. */
export const adarSections = [
  { hash: "", title: "Главная" },
  { hash: "o-kompanii", title: "О компании" },
  { hash: "arhiv", title: "Архив сезонов" },
  { hash: "podbor", title: "Подбор по бюджету" },
  { hash: "katalog", title: "Каталог наборов" },
  { hash: "korporativnym", title: "Корпоративным заказчикам" },
  { hash: "tematiki", title: "Тематические наборы" },
  { hash: "kontakty", title: "Контакты" },
] as const;

/** Страница сайта у заказчика — одна, вся навигация внутри неё. */
export const adarHome = `${adarSiteUrl}/`;

/** Адрес карточки набора: по нему карточка открывается сама. */
export function setUrl(slug: string): string {
  return `${adarHome}#nabor-${slug}`;
}

const TITLE = "Подарочные наборы ADAR — новогодние подарки в Ташкенте";

const DESCRIPTION =
  "80 готовых подарочных наборов от 50 000 сум: состав и вес каждого, подбор " +
  "по бюджету и партии с вашим логотипом. Ташкент, работаем с 2011 года.";

/**
 * Метаданные сайта.
 *
 * Заголовок и описание написаны для выдачи, а не для страницы: в них те
 * слова, которыми подарочные наборы ищут, и цифры, по которым выбирают, —
 * сколько наборов, от какой цены, какой город. На самой странице от этого
 * ничего не меняется.
 */
export function adarMetadata(): Metadata {
  return {
    // absolute, а не обычный заголовок: главную не надо подписывать «· ADAR»
    // поверх названия, в котором ADAR уже есть.
    title: { absolute: TITLE },
    description: DESCRIPTION,
    alternates: { canonical: adarHome },
    openGraph: {
      type: "website",
      siteName: company.name,
      locale: "ru_RU",
      url: adarHome,
      title: TITLE,
      description: DESCRIPTION,
      images: [
        {
          url: "/adar/og.jpg",
          width: 1200,
          height: 630,
          alt: "Подарочные наборы ADAR",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: ["/adar/og.jpg"],
    },
  };
}

/** Часы работы разбираются из той же строки, что показана на странице. */
const OPENING_HOURS = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  opens: "08:00",
  closes: "23:00",
};

/**
 * Карточка компании для поиска.
 *
 * Здесь то, что Google показывает рядом с выдачей по названию: адрес,
 * телефоны, часы работы, год основания. Все значения — со страницы контактов,
 * ничего не дописано: разметка, расходящаяся с видимым текстом, для Google
 * нарушение, а не оптимизация.
 */
export function businessJsonLd() {
  // «Ташкент, Якасарайский район, ул. Кушбеги, 10Б» → улица с домом отдельно
  // от города и района: у PostalAddress это разные поля, и дом без улицы в
  // streetAddress ломает сопоставление с картами.
  const parts = company.contacts.address.split(",").map((part) => part.trim());
  const street = parts.slice(-2).join(", ");

  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${adarSiteUrl}/#company`,
    name: company.name,
    legalName: "ADAR",
    url: adarHome,
    description: company.about,
    slogan: company.tagline,
    foundingDate: String(company.since),
    logo: `${adarSiteUrl}/adar/brand/lockup.png`,
    image: `${adarSiteUrl}/adar/og.jpg`,
    telephone: [...company.contacts.phones],
    email: company.contacts.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: street.trim(),
      addressLocality: "Ташкент",
      addressRegion: "Якасарайский район",
      addressCountry: "UZ",
    },
    openingHoursSpecification: OPENING_HOURS,
    priceRange: "50 000–1 500 000 UZS",
    currenciesAccepted: "UZS",
    areaServed: { "@type": "Country", name: "Узбекистан" },
  };
}

/** Сайт целиком — чтобы в выдаче стояло название компании, а не домен. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${adarSiteUrl}/#website`,
    url: adarHome,
    name: company.name,
    inLanguage: "ru",
    publisher: { "@id": `${adarSiteUrl}/#company` },
  };
}

/**
 * Каталог как список товаров.
 *
 * У каждого набора есть цена, вес и свой адрес — тот самый, по которому на
 * странице открывается карточка. Без адреса список для Google безымянный, а
 * с ним из него можно попасть сразу в нужный набор.
 */
export function catalogJsonLd(sets: GiftSet[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${adarSiteUrl}/#katalog`,
    name: "Каталог подарочных наборов ADAR",
    numberOfItems: sets.length,
    itemListElement: sets.map((set, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: set.name,
        url: setUrl(set.slug),
        image: `${adarSiteUrl}${set.image}`,
        category: set.lineLabel,
        weight: { "@type": "QuantitativeValue", value: set.weight, unitCode: "GRM" },
        offers: {
          "@type": "Offer",
          price: set.price,
          priceCurrency: "UZS",
          availability: "https://schema.org/InStock",
          seller: { "@id": `${adarSiteUrl}/#company` },
        },
      },
    })),
  };
}
