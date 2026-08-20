import type { IconName } from "@/components/ui/icon";
import type { Certificate } from "@/lib/content/types";
import type { Localized } from "@/lib/i18n";

/**
 * Only certifications the company has publicly announced in its own newsroom
 * are listed. Certificate numbers, issue dates and scans are not published —
 * request the PDFs from the client and link them from this file.
 */
export const certificates: Certificate[] = [
  {
    slug: "fssc-22000",
    name: "FSSC 22000",
    issuer: "Food Safety System Certification",
    description: {
      en: "Food safety management certified to the GFSI-recognised FSSC 22000 scheme, audited across processing, storage and dispatch.",
      ru: "Система менеджмента пищевой безопасности сертифицирована по признанной GFSI схеме FSSC 22000 — аудит охватывает переработку, хранение и отгрузку.",
      uz: "Oziq-ovqat xavfsizligini boshqarish GFSI tomonidan tan olingan FSSC 22000 sxemasi boʻyicha sertifikatlangan — audit qayta ishlash, saqlash va joʻnatishni qamrab oladi.",
    },
  },
  {
    slug: "sedex-smeta",
    name: "Sedex SMETA",
    issuer: "Sedex Members Ethical Trade Audit",
    description: {
      en: "Ethical trade audit covering labour standards, health and safety, environment and business ethics — the social compliance proof European retailers ask for.",
      ru: "Аудит этичной торговли: трудовые стандарты, охрана труда, экология и деловая этика — подтверждение социального соответствия, которое запрашивают европейские сети.",
      uz: "Axloqiy savdo auditi: mehnat standartlari, mehnat muhofazasi, ekologiya va biznes axloqi — Yevropa tarmoqlari soʻraydigan ijtimoiy muvofiqlik isboti.",
    },
  },
  {
    slug: "halal",
    name: "Halal",
    issuer: "",
    description: {
      en: "Halal certification, renewed annually, giving direct access to buyers in the Gulf, Türkiye, Malaysia and Indonesia.",
      ru: "Halal-сертификация, продлеваемая ежегодно, — прямой доступ к покупателям в странах Залива, Турции, Малайзии и Индонезии.",
      uz: "Har yili yangilanadigan Halal sertifikati — Fors koʻrfazi mamlakatlari, Turkiya, Malayziya va Indoneziyadagi xaridorlarga toʻgʻridan-toʻgʻri kirish.",
    },
  },
  {
    slug: "organic",
    name: "Organic",
    issuer: "",
    description: {
      en: "Certified organic production line for dried fruits and pulses, presented annually at BIOFACH — the world's leading organic food trade fair.",
      ru: "Сертифицированная органическая линия сухофруктов и бобовых, ежегодно представляемая на BIOFACH — крупнейшей мировой выставке органических продуктов.",
      uz: "Quritilgan mevalar va dukkaklilar uchun sertifikatlangan organik liniya, har yili BIOFACH — dunyodagi yetakchi organik oziq-ovqat koʻrgazmasida taqdim etiladi.",
    },
  },
];

/** Institutional recognition, drawn from the company's own announcements. */
export const recognitions: { title: Localized; description: Localized }[] = [
  {
    title: {
      en: "EBRD Blue Ribbon Programme",
      ru: "Программа EBRD Blue Ribbon",
      uz: "EBRD Blue Ribbon dasturi",
    },
    description: {
      en: "Selected for the European Bank for Reconstruction and Development's programme for high-potential companies.",
      ru: "Отобраны в программу Европейского банка реконструкции и развития для компаний с высоким потенциалом.",
      uz: "Yevropa Tiklanish va Taraqqiyot Banki tomonidan yuqori salohiyatli kompaniyalar dasturiga tanlangan.",
    },
  },
  {
    title: {
      en: "€10 million EBRD facility",
      ru: "Кредит EBRD на €10 млн",
      uz: "EBRDʼning €10 million krediti",
    },
    description: {
      en: "A €10 million loan from the EBRD to expand processing capacity and working capital.",
      ru: "Кредит EBRD на €10 млн для расширения перерабатывающих мощностей и оборотного капитала.",
      uz: "Qayta ishlash quvvatlari va aylanma mablagʻni kengaytirish uchun EBRDʼdan €10 million kredit.",
    },
  },
];

/** Stages shown on the Quality page. */
export const qualityStages: {
  title: Localized;
  description: Localized;
  icon: IconName;
}[] = [
  {
    icon: "leaf",
    title: { en: "Incoming raw material", ru: "Входной контроль сырья", uz: "Xomashyo qabuli" },
    description: {
      en: "Each delivery from the farms is sampled and checked for moisture, damage and foreign matter before it is accepted.",
      ru: "Каждая поставка с хозяйств выборочно проверяется на влажность, повреждения и посторонние примеси до приёмки.",
      uz: "Xoʻjaliklardan kelgan har bir yetkazma qabul qilinishidan oldin namlik, shikastlanish va begona aralashmalarga tekshiriladi.",
    },
  },
  {
    icon: "chain",
    title: { en: "In-line control", ru: "Контроль на линии", uz: "Liniyadagi nazorat" },
    description: {
      en: "Cleaning, sorting and calibration are monitored continuously, with operators pulling samples at fixed intervals.",
      ru: "Очистка, сортировка и калибровка контролируются непрерывно, операторы отбирают пробы через заданные интервалы.",
      uz: "Tozalash, saralash va kalibrlash uzluksiz nazorat qilinadi, operatorlar belgilangan oraliqlarda namuna oladi.",
    },
  },
  {
    icon: "lab",
    title: { en: "Laboratory testing", ru: "Лабораторные испытания", uz: "Laboratoriya sinovlari" },
    description: {
      en: "The in-house laboratory tests every lot against the buyer's specification before it is released for packing.",
      ru: "Собственная лаборатория проверяет каждую партию по спецификации покупателя до выпуска на упаковку.",
      uz: "Oʻz laboratoriyamiz har bir partiyani qadoqlashga chiqarishdan oldin xaridor spetsifikatsiyasi boʻyicha tekshiradi.",
    },
  },
  {
    icon: "docs",
    title: { en: "Lot traceability", ru: "Прослеживаемость партии", uz: "Partiya kuzatuvchanligi" },
    description: {
      en: "Every packed lot carries a code that traces back to the growing region, the processing date and the lab report.",
      ru: "Каждая упакованная партия имеет код, по которому прослеживается регион выращивания, дата переработки и протокол лаборатории.",
      uz: "Har bir qadoqlangan partiyada kod boʻladi — u yetishtirish hududi, qayta ishlash sanasi va laboratoriya bayonnomasiga olib boradi.",
    },
  },
  {
    icon: "shield",
    title: { en: "Pre-shipment check", ru: "Проверка перед отгрузкой", uz: "Joʻnatishdan oldingi tekshiruv" },
    description: {
      en: "Container loading is inspected and documented, with retained samples kept for the shelf life of the lot.",
      ru: "Загрузка контейнера инспектируется и документируется, арбитражные пробы хранятся весь срок годности партии.",
      uz: "Konteynerni yuklash tekshiriladi va hujjatlashtiriladi, saqlanadigan namunalar partiyaning yaroqlilik muddati davomida saqlanadi.",
    },
  },
];
