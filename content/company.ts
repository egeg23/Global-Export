import type {
  Advantage,
  Company,
  Contacts,
  Facility,
  ProcessStep,
  Stat,
} from "@/lib/content/types";
import type { Localized } from "@/lib/i18n";

/**
 * English copy in this file is quoted verbatim from globalex.uz; Russian and
 * Uzbek are translations of the same statements. Anything the company has not
 * published (phone numbers, legal details, facility addresses) is left empty
 * rather than invented — see README.md → "Что нужно от клиента".
 */

export const company: Company = {
  name: {
    en: "Global Export Company",
    ru: "Global Export Company",
    uz: "Global Export Company",
  },
  legalName: "Global Export Company LLC",
  founded: "",
  tagline: {
    en: "Agricultural products from Uzbekistan, delivered to 55 countries",
    ru: "Сельхозпродукция из Узбекистана — поставки в 55 стран",
    uz: "Oʻzbekistondan qishloq xoʻjaligi mahsulotlari — 55 mamlakatga yetkazamiz",
  },
  description: {
    en: "Global Export Company is an Uzbekistan-based producer, processor, and exporter of agricultural products, supplying pulses, dried fruits, nuts, frozen fruits, and organic products to customers worldwide.",
    ru: "Global Export Company — узбекский производитель, переработчик и экспортёр сельскохозяйственной продукции: бобовые, сухофрукты, орехи, замороженные фрукты и органическая продукция для покупателей по всему миру.",
    uz: "Global Export Company — Oʻzbekistonda joylashgan qishloq xoʻjaligi mahsulotlari ishlab chiqaruvchisi, qayta ishlovchisi va eksportyori: dukkaklilar, quritilgan mevalar, yongʻoqlar, muzlatilgan mevalar va organik mahsulotlarni dunyo boʻylab yetkazib beradi.",
  },
  mission: {
    en: "Our integrated supply chain covers raw material sourcing, processing, quality control, storage, and export logistics — so every shipment leaves Uzbekistan with the same guaranteed specification.",
    ru: "Наша интегрированная цепочка поставок охватывает закупку сырья, переработку, контроль качества, хранение и экспортную логистику — поэтому каждая отгрузка покидает Узбекистан с гарантированной спецификацией.",
    uz: "Bizning integratsiyalashgan taʼminot zanjirimiz xomashyo xaridi, qayta ishlash, sifat nazorati, saqlash va eksport logistikasini qamrab oladi — shu sababli har bir joʻnatma Oʻzbekistondan kafolatlangan spetsifikatsiya bilan chiqadi.",
  },
};

/** Headline figures published by the company on globalex.uz. */
export const stats: Stat[] = [
  {
    value: "50 000",
    suffix: { en: "T", ru: "т", uz: "t" },
    label: {
      en: "Annual production capacity",
      ru: "Производственная мощность в год",
      uz: "Yillik ishlab chiqarish quvvati",
    },
  },
  {
    value: "55",
    label: { en: "Export countries", ru: "Стран экспорта", uz: "Eksport mamlakatlari" },
  },
  {
    value: "4",
    label: {
      en: "Production facilities",
      ru: "Производственных объекта",
      uz: "Ishlab chiqarish obyekti",
    },
  },
  {
    value: "10 000",
    suffix: { en: "m²", ru: "м²", uz: "m²" },
    label: { en: "Warehouse area", ru: "Площадь складов", uz: "Ombor maydoni" },
  },
  {
    value: "15 000",
    suffix: { en: "T", ru: "т", uz: "t" },
    label: { en: "Warehouse capacity", ru: "Ёмкость хранения", uz: "Saqlash hajmi" },
  },
  {
    value: "1 000",
    suffix: { en: "T", ru: "т", uz: "t" },
    label: {
      en: "Cooling storage capacity",
      ru: "Ёмкость холодильного хранения",
      uz: "Sovutgichli saqlash hajmi",
    },
  },
];

/** Processing capacity per product line, as published by the company. */
export const capacityLines: { label: Localized; value: Localized }[] = [
  {
    label: { en: "Pulses", ru: "Бобовые", uz: "Dukkaklilar" },
    value: { en: "25 000 T", ru: "25 000 т", uz: "25 000 t" },
  },
  {
    label: { en: "Dried fruits", ru: "Сухофрукты", uz: "Quritilgan mevalar" },
    value: { en: "15 000 T", ru: "15 000 т", uz: "15 000 t" },
  },
  {
    label: { en: "Nuts", ru: "Орехи", uz: "Yongʻoqlar" },
    value: { en: "10 000 T", ru: "10 000 т", uz: "10 000 t" },
  },
];

export const advantages: Advantage[] = [
  {
    icon: "chain",
    title: {
      en: "Integrated supply chain",
      ru: "Интегрированная цепочка поставок",
      uz: "Integratsiyalashgan taʼminot zanjiri",
    },
    description: {
      en: "Sourcing, processing, quality control, storage and export logistics sit under one roof — no intermediaries between the field and your container.",
      ru: "Закупка сырья, переработка, контроль качества, хранение и экспортная логистика — под одной крышей. Между полем и вашим контейнером нет посредников.",
      uz: "Xomashyo xaridi, qayta ishlash, sifat nazorati, saqlash va eksport logistikasi — bir tom ostida. Dala bilan konteyneringiz oʻrtasida vositachi yoʻq.",
    },
  },
  {
    icon: "lab",
    title: {
      en: "In-house laboratory",
      ru: "Собственная лаборатория",
      uz: "Oʻz laboratoriyamiz",
    },
    description: {
      en: "Every lot is tested before it is packed: moisture, foreign matter, calibration and food-safety parameters are checked on site.",
      ru: "Каждая партия проверяется до упаковки: влажность, посторонние примеси, калибровка и параметры пищевой безопасности контролируются на месте.",
      uz: "Har bir partiya qadoqlashdan oldin tekshiriladi: namlik, begona aralashmalar, kalibrlash va oziq-ovqat xavfsizligi parametrlari joyida nazorat qilinadi.",
    },
  },
  {
    icon: "shield",
    title: {
      en: "Certified food safety",
      ru: "Сертифицированная пищевая безопасность",
      uz: "Sertifikatlangan oziq-ovqat xavfsizligi",
    },
    description: {
      en: "FSSC 22000, Sedex SMETA, Halal and organic certification keep our lots admissible in the EU, the Gulf and Asia.",
      ru: "FSSC 22000, Sedex SMETA, Halal и органическая сертификация обеспечивают допуск партий на рынки ЕС, стран Залива и Азии.",
      uz: "FSSC 22000, Sedex SMETA, Halal va organik sertifikatlash partiyalarimizning Yevropa Ittifoqi, Fors koʻrfazi va Osiyo bozorlariga kirishini taʼminlaydi.",
    },
  },
  {
    icon: "globe",
    title: {
      en: "Proven export geography",
      ru: "Подтверждённая география экспорта",
      uz: "Isbotlangan eksport geografiyasi",
    },
    description: {
      en: "The company ships to 55 countries across Europe, the Middle East, Asia and beyond.",
      ru: "Компания поставляет продукцию в 55 стран Европы, Ближнего Востока, Азии и других регионов.",
      uz: "Kompaniya Yevropa, Yaqin Sharq, Osiyo va boshqa mintaqalardagi 55 mamlakatga mahsulot yetkazadi.",
    },
  },
  {
    icon: "docs",
    title: {
      en: "Complete export documentation",
      ru: "Полный пакет экспортных документов",
      uz: "Toʻliq eksport hujjatlari",
    },
    description: {
      en: "Complete export documentation is prepared in-house for every shipment, so nothing waits on a third party.",
      ru: "Полный пакет экспортных документов готовится своими силами по каждой отгрузке — ничего не ждёт подрядчика.",
      uz: "Har bir joʻnatma uchun toʻliq eksport hujjatlari oʻzimizda tayyorlanadi — hech narsa uchinchi tomonni kutmaydi.",
    },
  },
  {
    icon: "storage",
    title: {
      en: "Year-round availability",
      ru: "Наличие круглый год",
      uz: "Yil boʻyi mavjudlik",
    },
    description: {
      en: "10 000 m² of warehousing, including 1 000 tonnes of cold storage, lets us hold season stock and ship against contracts all year.",
      ru: "10 000 м² складов, включая 1 000 тонн холодильного хранения, позволяют держать сезонный запас и отгружать по контрактам круглый год.",
      uz: "10 000 m² ombor, shu jumladan 1 000 tonna sovutgichli saqlash — mavsumiy zaxirani saqlash va yil boʻyi shartnomalar boʻyicha joʻnatish imkonini beradi.",
    },
  },
];

export const process: ProcessStep[] = [
  {
    step: "01",
    title: { en: "Sourcing", ru: "Закупка сырья", uz: "Xomashyo xaridi" },
    description: {
      en: "Raw material is contracted directly with farms in the growing regions of Uzbekistan.",
      ru: "Сырьё законтрактовано напрямую с хозяйствами в регионах выращивания Узбекистана.",
      uz: "Xomashyo Oʻzbekistonning yetishtirish hududlaridagi xoʻjaliklar bilan bevosita shartnoma asosida olinadi.",
    },
  },
  {
    step: "02",
    title: { en: "Processing", ru: "Переработка", uz: "Qayta ishlash" },
    description: {
      en: "Cleaning, sorting, calibration and drying on modern production lines.",
      ru: "Очистка, сортировка, калибровка и сушка на современных производственных линиях.",
      uz: "Zamonaviy ishlab chiqarish liniyalarida tozalash, saralash, kalibrlash va quritish.",
    },
  },
  {
    step: "03",
    title: { en: "Quality control", ru: "Контроль качества", uz: "Sifat nazorati" },
    description: {
      en: "In-house laboratory testing against the buyer's specification before packing.",
      ru: "Лабораторные испытания по спецификации покупателя до упаковки.",
      uz: "Qadoqlashdan oldin xaridor spetsifikatsiyasi boʻyicha laboratoriya sinovlari.",
    },
  },
  {
    step: "04",
    title: { en: "Packing", ru: "Упаковка", uz: "Qadoqlash" },
    description: {
      en: "Bulk or retail packing to the importer's format, with lot marking and traceability.",
      ru: "Упаковка навалом или в розничном формате импортёра, с маркировкой партии и прослеживаемостью.",
      uz: "Importchining formatida yoki yirik hajmda qadoqlash, partiya markirovkasi va kuzatuvchanlik bilan.",
    },
  },
  {
    step: "05",
    title: { en: "Documentation", ru: "Документы", uz: "Hujjatlar" },
    description: {
      en: "Phytosanitary certificate, certificate of origin, lab report and customs clearance.",
      ru: "Фитосанитарный сертификат, сертификат происхождения, протокол лаборатории и таможенное оформление.",
      uz: "Fitosanitar sertifikat, kelib chiqish sertifikati, laboratoriya bayonnomasi va bojxona rasmiylashtiruvi.",
    },
  },
  {
    step: "06",
    title: { en: "Shipping", ru: "Отгрузка", uz: "Joʻnatish" },
    description: {
      en: "Container loading and delivery on agreed Incoterms to your destination port.",
      ru: "Загрузка контейнера и доставка на согласованных условиях Incoterms до вашего порта назначения.",
      uz: "Konteynerni yuklash va kelishilgan Incoterms shartlarida yetkazib berish porti boʻyicha yetkazish.",
    },
  },
];

/**
 * The company states four production locations but has not published their
 * addresses; descriptions below are derived from the capacity figures it does
 * publish. Confirm names and locations with the client before launch.
 */
export const facilities: Facility[] = [
  {
    name: { en: "Pulses processing line", ru: "Линия переработки бобовых", uz: "Dukkaklilar liniyasi" },
    location: { en: "Uzbekistan", ru: "Узбекистан", uz: "Oʻzbekiston" },
    capacity: { en: "25 000 T", ru: "25 000 т", uz: "25 000 t" },
    description: {
      en: "Annual processing capacity for the pulses line, as published by the company.",
      ru: "Годовая мощность переработки по линии бобовых — по данным компании.",
      uz: "Dukkaklilar liniyasining yillik qayta ishlash quvvati — kompaniya maʼlumotlariga koʻra.",
    },
    image: "",
  },
  {
    name: { en: "Dried fruit facility", ru: "Площадка сухофруктов", uz: "Quritilgan mevalar maydonchasi" },
    location: { en: "Uzbekistan", ru: "Узбекистан", uz: "Oʻzbekiston" },
    capacity: { en: "15 000 T", ru: "15 000 т", uz: "15 000 t" },
    description: {
      en: "Annual processing capacity for the dried fruit line, as published by the company.",
      ru: "Годовая мощность переработки по линии сухофруктов — по данным компании.",
      uz: "Quritilgan mevalar liniyasining yillik qayta ishlash quvvati — kompaniya maʼlumotlariga koʻra.",
    },
    image: "",
  },
  {
    name: { en: "Nut processing line", ru: "Линия переработки орехов", uz: "Yongʻoq liniyasi" },
    location: { en: "Uzbekistan", ru: "Узбекистан", uz: "Oʻzbekiston" },
    capacity: { en: "10 000 T", ru: "10 000 т", uz: "10 000 t" },
    description: {
      en: "Annual processing capacity for the nut line, as published by the company.",
      ru: "Годовая мощность переработки по линии орехов — по данным компании.",
      uz: "Yongʻoqlar liniyasining yillik qayta ishlash quvvati — kompaniya maʼlumotlariga koʻra.",
    },
    image: "",
  },
  {
    name: { en: "Warehouse & cold storage", ru: "Склад и холодильное хранение", uz: "Ombor va sovutgich" },
    location: { en: "Uzbekistan", ru: "Узбекистан", uz: "Oʻzbekiston" },
    capacity: { en: "15 000 T + 1 000 T", ru: "15 000 т + 1 000 т", uz: "15 000 t + 1 000 t" },
    description: {
      en: "10 000 m² of warehousing with 1 000 tonnes of cold storage for season stock.",
      ru: "10 000 м² складов с холодильным хранением на 1 000 тонн для сезонного запаса.",
      uz: "Mavsumiy zaxira uchun 1 000 tonna sovutgichga ega 10 000 m² ombor.",
    },
    image: "",
  },
];

export const contacts: Contacts = {
  address: {
    en: "Tashkent, Uzbekistan",
    ru: "Ташкент, Узбекистан",
    uz: "Toshkent, Oʻzbekiston",
  },
  // The company publishes no phone number online — request it from the client.
  phones: [],
  emails: [
    {
      label: { en: "General enquiries", ru: "Общие вопросы", uz: "Umumiy savollar" },
      value: "info@globalex.uz",
      href: "mailto:info@globalex.uz",
    },
    {
      label: { en: "Export department", ru: "Отдел экспорта", uz: "Eksport boʻlimi" },
      value: "salim@globalex.uz",
      href: "mailto:salim@globalex.uz",
    },
    {
      label: { en: "Export department", ru: "Отдел экспорта", uz: "Eksport boʻlimi" },
      value: "bi@globalex.uz",
      href: "mailto:bi@globalex.uz",
    },
    {
      label: { en: "Export department", ru: "Отдел экспорта", uz: "Eksport boʻlimi" },
      value: "bekzod@globalex.uz",
      href: "mailto:bekzod@globalex.uz",
    },
    {
      label: { en: "Export department", ru: "Отдел экспорта", uz: "Eksport boʻlimi" },
      value: "mukhammad@globalex.uz",
      href: "mailto:mukhammad@globalex.uz",
    },
  ],
  socials: [
    { name: "Facebook", url: "https://www.facebook.com/GEC.LLC" },
    { name: "LinkedIn", url: "https://www.linkedin.com/company/38099307" },
    { name: "Instagram", url: "https://www.instagram.com/globalexportllc/" },
  ],
  mapEmbed:
    "https://www.google.com/maps?q=Tashkent,Uzbekistan&output=embed",
  // Not published by the company — ask the client. The UI hides the block
  // while this is empty.
  workingHours: { en: "" },
};
