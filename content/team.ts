import type { TeamMember } from "@/lib/content/types";

/**
 * Names and roles as published by the company on globalex.uz. Photographs are
 * not reproduced here — request the originals from the client.
 */
export const team: TeamMember[] = [
  {
    name: "Davron Dadakhonov",
    group: "board",
    email: "dd@globalex.uz",
    position: {
      en: "Chief Executive Officer",
      ru: "Генеральный директор",
      uz: "Bosh direktor",
    },
  },
  {
    name: "Jasur Berdiyev",
    group: "board",
    position: {
      en: "Chief Commercial Officer",
      ru: "Коммерческий директор",
      uz: "Bosh tijorat direktori",
    },
  },
  {
    name: "Sardor Abaskhanov",
    group: "board",
    email: "sa@globalex.uz",
    position: {
      en: "Chief Strategic Officer",
      ru: "Директор по стратегии",
      uz: "Strategiya boʻyicha direktor",
    },
  },
  {
    name: "Maja Medak",
    group: "directors",
    email: "maja@globalex.uz",
    position: {
      en: "Commercial Director",
      ru: "Коммерческий директор",
      uz: "Tijorat direktori",
    },
  },
  {
    name: "Ikhtiyor Normatov",
    group: "directors",
    position: { en: "Finance Director", ru: "Финансовый директор", uz: "Moliya direktori" },
  },
  {
    name: "Javokhir Okhunov",
    group: "directors",
    position: {
      en: "Operations Director",
      ru: "Операционный директор",
      uz: "Operatsion direktor",
    },
  },
  {
    name: "Lola Artykova",
    group: "directors",
    position: {
      en: "Head of Human Resources",
      ru: "Руководитель отдела кадров",
      uz: "Kadrlar boʻlimi boshligʻi",
    },
  },
  {
    name: "Akmal Buriev",
    group: "directors",
    position: {
      en: "Head of Import Department",
      ru: "Руководитель отдела импорта",
      uz: "Import boʻlimi boshligʻi",
    },
  },
  {
    name: "Natalya Fazylova",
    group: "directors",
    position: { en: "Head of Accounting", ru: "Главный бухгалтер", uz: "Bosh hisobchi" },
  },
  {
    name: "Salim Kakhramonov",
    group: "export",
    email: "salim@globalex.uz",
    position: { en: "Export manager", ru: "Менеджер по экспорту", uz: "Eksport menejeri" },
  },
  {
    name: "Bobur Ilyasov",
    group: "export",
    email: "bi@globalex.uz",
    position: { en: "Export manager", ru: "Менеджер по экспорту", uz: "Eksport menejeri" },
  },
  {
    name: "Bekzod Bozorov",
    group: "export",
    email: "bekzod@globalex.uz",
    position: { en: "Export manager", ru: "Менеджер по экспорту", uz: "Eksport menejeri" },
  },
  {
    name: "Mukhammad Sharofov",
    group: "export",
    email: "mukhammad@globalex.uz",
    position: { en: "Export manager", ru: "Менеджер по экспорту", uz: "Eksport menejeri" },
  },
];

export const teamGroups = ["board", "directors", "export"] as const;
