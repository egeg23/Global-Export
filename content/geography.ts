import type { Localized } from "@/lib/i18n";

/**
 * Export markets.
 *
 * The company states it ships to 55 countries but has never published the
 * list. Only countries its own newsroom names — a first shipment, a signed
 * partnership, a trade fair it exhibited at — appear below; nothing here is
 * inferred from "probably also sells there". Ask the client for the full list
 * and replace this file wholesale.
 */
export type Region = {
  key: string;
  name: Localized;
  countries: Localized[];
};

export const regions: Region[] = [
  {
    key: "europe",
    name: { en: "Europe", ru: "Европа", uz: "Yevropa" },
    countries: [
      { en: "Netherlands", ru: "Нидерланды", uz: "Niderlandiya" },
      { en: "Belgium", ru: "Бельгия", uz: "Belgiya" },
      { en: "Germany", ru: "Германия", uz: "Germaniya" },
      { en: "France", ru: "Франция", uz: "Fransiya" },
      { en: "United Kingdom", ru: "Великобритания", uz: "Buyuk Britaniya" },
      { en: "Italy", ru: "Италия", uz: "Italiya" },
      { en: "Türkiye", ru: "Турция", uz: "Turkiya" },
    ],
  },
  {
    key: "asia",
    name: { en: "Asia & Pacific", ru: "Азия и Океания", uz: "Osiyo va Tinch okeani" },
    countries: [
      { en: "China", ru: "Китай", uz: "Xitoy" },
      { en: "Japan", ru: "Япония", uz: "Yaponiya" },
    ],
  },
  {
    key: "mena",
    name: {
      en: "Middle East",
      ru: "Ближний Восток",
      uz: "Yaqin Sharq",
    },
    countries: [{ en: "United Arab Emirates", ru: "ОАЭ", uz: "BAA" }],
  },
  {
    key: "cis",
    name: { en: "CIS & Caucasus", ru: "СНГ и Кавказ", uz: "MDH va Kavkaz" },
    countries: [
      { en: "Russia", ru: "Россия", uz: "Rossiya" },
      { en: "Azerbaijan", ru: "Азербайджан", uz: "Ozarbayjon" },
      { en: "Armenia", ru: "Армения", uz: "Armaniston" },
    ],
  },
];

export const geographyNote: Localized = {
  en: "Selected markets named in the company's own announcements. The full list of 55 destination countries is available on request.",
  ru: "Отдельные рынки, названные в собственных публикациях компании. Полный список из 55 стран назначения предоставляется по запросу.",
  uz: "Kompaniyaning oʻz eʼlonlarida nomi keltirilgan ayrim bozorlar. 55 ta yetkazib berish mamlakatining toʻliq roʻyxati soʻrov boʻyicha taqdim etiladi.",
};
