import type { Localized } from "@/lib/i18n";

/**
 * Export regions. The company states it ships to 55 countries but has not
 * published the full list — every country named here appears in its own
 * newsroom (exhibitions, first shipments, partnerships). Ask the client for
 * the complete list before launch.
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
      { en: "Germany", ru: "Германия", uz: "Germaniya" },
      { en: "France", ru: "Франция", uz: "Fransiya" },
      { en: "United Kingdom", ru: "Великобритания", uz: "Buyuk Britaniya" },
      { en: "Italy", ru: "Италия", uz: "Italiya" },
      { en: "Spain", ru: "Испания", uz: "Ispaniya" },
      { en: "Poland", ru: "Польша", uz: "Polsha" },
      { en: "Türkiye", ru: "Турция", uz: "Turkiya" },
    ],
  },
  {
    key: "asia",
    name: { en: "Asia & Pacific", ru: "Азия и Океания", uz: "Osiyo va Tinch okeani" },
    countries: [
      { en: "China", ru: "Китай", uz: "Xitoy" },
      { en: "Japan", ru: "Япония", uz: "Yaponiya" },
      { en: "South Korea", ru: "Южная Корея", uz: "Janubiy Koreya" },
      { en: "India", ru: "Индия", uz: "Hindiston" },
      { en: "Vietnam", ru: "Вьетнам", uz: "Vyetnam" },
      { en: "Malaysia", ru: "Малайзия", uz: "Malayziya" },
    ],
  },
  {
    key: "mena",
    name: {
      en: "Middle East & North Africa",
      ru: "Ближний Восток и Северная Африка",
      uz: "Yaqin Sharq va Shimoliy Afrika",
    },
    countries: [
      { en: "United Arab Emirates", ru: "ОАЭ", uz: "BAA" },
      { en: "Saudi Arabia", ru: "Саудовская Аравия", uz: "Saudiya Arabistoni" },
      { en: "Qatar", ru: "Катар", uz: "Qatar" },
      { en: "Kuwait", ru: "Кувейт", uz: "Quvayt" },
      { en: "Egypt", ru: "Египет", uz: "Misr" },
    ],
  },
  {
    key: "cis",
    name: { en: "CIS & Caucasus", ru: "СНГ и Кавказ", uz: "MDH va Kavkaz" },
    countries: [
      { en: "Russia", ru: "Россия", uz: "Rossiya" },
      { en: "Kazakhstan", ru: "Казахстан", uz: "Qozogʻiston" },
      { en: "Belarus", ru: "Беларусь", uz: "Belarus" },
      { en: "Azerbaijan", ru: "Азербайджан", uz: "Ozarbayjon" },
      { en: "Armenia", ru: "Армения", uz: "Armaniston" },
      { en: "Georgia", ru: "Грузия", uz: "Gruziya" },
    ],
  },
];

export const geographyNote: Localized = {
  en: "More than 95% of production is exported. Selected destinations shown — the full list of 55 countries is available on request.",
  ru: "Более 95% продукции идёт на экспорт. Показаны отдельные направления — полный список из 55 стран предоставляется по запросу.",
  uz: "Mahsulotning 95% dan ortigʻi eksportga chiqadi. Ayrim yoʻnalishlar koʻrsatilgan — 55 mamlakatning toʻliq roʻyxati soʻrov boʻyicha taqdim etiladi.",
};
