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
  countries: string[];
};

export const regions: Region[] = [
  {
    key: "europe",
    name: { en: "Europe", ru: "Европа", uz: "Yevropa" },
    countries: [
      "Netherlands",
      "Germany",
      "France",
      "United Kingdom",
      "Italy",
      "Spain",
      "Poland",
      "Türkiye",
    ],
  },
  {
    key: "asia",
    name: { en: "Asia & Pacific", ru: "Азия и Океания", uz: "Osiyo va Tinch okeani" },
    countries: ["China", "Japan", "South Korea", "India", "Vietnam", "Malaysia"],
  },
  {
    key: "mena",
    name: {
      en: "Middle East & North Africa",
      ru: "Ближний Восток и Северная Африка",
      uz: "Yaqin Sharq va Shimoliy Afrika",
    },
    countries: ["United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait", "Egypt"],
  },
  {
    key: "cis",
    name: { en: "CIS & Caucasus", ru: "СНГ и Кавказ", uz: "MDH va Kavkaz" },
    countries: ["Russia", "Kazakhstan", "Belarus", "Azerbaijan", "Armenia", "Georgia"],
  },
];

export const geographyNote: Localized = {
  en: "More than 95% of production is exported. Selected destinations shown — the full list of 55 countries is available on request.",
  ru: "Более 95% продукции идёт на экспорт. Показаны отдельные направления — полный список из 55 стран предоставляется по запросу.",
  uz: "Mahsulotning 95% dan ortig‘i eksportga chiqadi. Ayrim yo‘nalishlar ko‘rsatilgan — 55 mamlakatning to‘liq ro‘yxati so‘rov bo‘yicha taqdim etiladi.",
};
