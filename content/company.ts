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
    uz: "O‘zbekistondan qishloq xo‘jaligi mahsulotlari — 55 mamlakatga yetkazamiz",
  },
  description: {
    en: "Global Export Company is an Uzbekistan-based producer, processor, and exporter of agricultural products, supplying pulses, dried fruits, nuts, frozen fruits, and organic products to customers worldwide.",
    ru: "Global Export Company — узбекский производитель, переработчик и экспортёр сельскохозяйственной продукции: бобовые, сухофрукты, орехи, замороженные фрукты и органическая продукция для покупателей по всему миру.",
    uz: "Global Export Company — O‘zbekistonda joylashgan qishloq xo‘jaligi mahsulotlari ishlab chiqaruvchisi, qayta ishlovchisi va eksportyori: dukkaklilar, quritilgan mevalar, yong‘oqlar, muzlatilgan mevalar va organik mahsulotlarni dunyo bo‘ylab yetkazib beradi.",
  },
  mission: {
    en: "Our integrated supply chain covers raw material sourcing, processing, quality control, storage, and export logistics — so every shipment leaves Uzbekistan with the same guaranteed specification.",
    ru: "Наша интегрированная цепочка поставок охватывает закупку сырья, переработку, контроль качества, хранение и экспортную логистику — поэтому каждая отгрузка покидает Узбекистан с гарантированной спецификацией.",
    uz: "Bizning integratsiyalashgan ta’minot zanjirimiz xomashyo xaridi, qayta ishlash, sifat nazorati, saqlash va eksport logistikasini qamrab oladi — shu sababli har bir jo‘natma O‘zbekistondan kafolatlangan spetsifikatsiya bilan chiqadi.",
  },
};

/** Headline figures published by the company on globalex.uz. */
export const stats: Stat[] = [
  {
    value: "50 000",
    suffix: "T",
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
    suffix: "m²",
    label: { en: "Warehouse area", ru: "Площадь складов", uz: "Ombor maydoni" },
  },
  {
    value: "15 000",
    suffix: "T",
    label: { en: "Warehouse capacity", ru: "Ёмкость хранения", uz: "Saqlash hajmi" },
  },
  {
    value: "1 000",
    suffix: "T",
    label: {
      en: "Cooling storage capacity",
      ru: "Ёмкость холодильного хранения",
      uz: "Sovutgichli saqlash hajmi",
    },
  },
  {
    value: "95",
    suffix: "%",
    label: {
      en: "Of products are exported",
      ru: "Продукции идёт на экспорт",
      uz: "Mahsulot eksportga chiqadi",
    },
  },
];

/** Processing capacity per product line, as published by the company. */
export const capacityLines: { label: Localized; value: string }[] = [
  {
    label: { en: "Pulses", ru: "Бобовые", uz: "Dukkaklilar" },
    value: "25 000 T",
  },
  {
    label: { en: "Dried fruits", ru: "Сухофрукты", uz: "Quritilgan mevalar" },
    value: "15 000 T",
  },
  {
    label: { en: "Nuts", ru: "Орехи", uz: "Yong‘oqlar" },
    value: "10 000 T",
  },
];

export const advantages: Advantage[] = [
  {
    icon: "chain",
    title: {
      en: "Integrated supply chain",
      ru: "Интегрированная цепочка поставок",
      uz: "Integratsiyalashgan ta’minot zanjiri",
    },
    description: {
      en: "Sourcing, processing, quality control, storage and export logistics sit under one roof — no intermediaries between the field and your container.",
      ru: "Закупка сырья, переработка, контроль качества, хранение и экспортная логистика — под одной крышей. Между полем и вашим контейнером нет посредников.",
      uz: "Xomashyo xaridi, qayta ishlash, sifat nazorati, saqlash va eksport logistikasi — bir tom ostida. Dala bilan konteyneringiz o‘rtasida vositachi yo‘q.",
    },
  },
  {
    icon: "lab",
    title: {
      en: "In-house laboratory",
      ru: "Собственная лаборатория",
      uz: "O‘z laboratoriyamiz",
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
      uz: "FSSC 22000, Sedex SMETA, Halal va organik sertifikatlash partiyalarimizning Yevropa Ittifoqi, Fors ko‘rfazi va Osiyo bozorlariga kirishini ta’minlaydi.",
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
      en: "More than 95% of what we produce is shipped abroad — to 55 countries across Europe, the Middle East, Asia and beyond.",
      ru: "Более 95% произведённого уходит на экспорт — в 55 стран Европы, Ближнего Востока, Азии и других регионов.",
      uz: "Ishlab chiqargan mahsulotimizning 95% dan ortig‘i eksportga ketadi — Yevropa, Yaqin Sharq, Osiyo va boshqa mintaqalardagi 55 mamlakatga.",
    },
  },
  {
    icon: "docs",
    title: {
      en: "Complete export documentation",
      ru: "Полный пакет экспортных документов",
      uz: "To‘liq eksport hujjatlari",
    },
    description: {
      en: "Phytosanitary certificates, certificates of origin, lab reports and customs paperwork are prepared in-house for every shipment.",
      ru: "Фитосанитарные сертификаты, сертификаты происхождения, протоколы лаборатории и таможенные документы готовятся своими силами по каждой отгрузке.",
      uz: "Fitosanitar sertifikatlar, kelib chiqish sertifikatlari, laboratoriya bayonnomalari va bojxona hujjatlari har bir jo‘natma uchun o‘zimizda tayyorlanadi.",
    },
  },
  {
    icon: "storage",
    title: {
      en: "Year-round availability",
      ru: "Наличие круглый год",
      uz: "Yil bo‘yi mavjudlik",
    },
    description: {
      en: "10 000 m² of warehousing, including 1 000 tonnes of cold storage, lets us hold season stock and ship against contracts all year.",
      ru: "10 000 м² складов, включая 1 000 тонн холодильного хранения, позволяют держать сезонный запас и отгружать по контрактам круглый год.",
      uz: "10 000 m² ombor, shu jumladan 1 000 tonna sovutgichli saqlash — mavsumiy zaxirani saqlash va yil bo‘yi shartnomalar bo‘yicha jo‘natish imkonini beradi.",
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
      uz: "Xomashyo O‘zbekistonning yetishtirish hududlaridagi xo‘jaliklar bilan bevosita shartnoma asosida olinadi.",
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
      uz: "Qadoqlashdan oldin xaridor spetsifikatsiyasi bo‘yicha laboratoriya sinovlari.",
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
    title: { en: "Shipping", ru: "Отгрузка", uz: "Jo‘natish" },
    description: {
      en: "Container loading and delivery on agreed Incoterms to your destination port.",
      ru: "Загрузка контейнера и доставка на согласованных условиях Incoterms до вашего порта назначения.",
      uz: "Konteynerni yuklash va kelishilgan Incoterms shartlarida yetkazib berish porti bo‘yicha yetkazish.",
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
    location: { en: "Uzbekistan", ru: "Узбекистан", uz: "O‘zbekiston" },
    capacity: "25 000 T",
    description: {
      en: "Cleaning, calibration and packing of mung beans, kidney beans, chickpeas and lentils.",
      ru: "Очистка, калибровка и упаковка маша, красной фасоли, нута и чечевицы.",
      uz: "Mosh, loviya, no‘xat va yasmiqni tozalash, kalibrlash va qadoqlash.",
    },
    image: "",
  },
  {
    name: { en: "Dried fruit facility", ru: "Площадка сухофруктов", uz: "Quritilgan mevalar maydonchasi" },
    location: { en: "Uzbekistan", ru: "Узбекистан", uz: "O‘zbekiston" },
    capacity: "15 000 T",
    description: {
      en: "Drying, sorting and packing of apricots, raisins and prunes, conventional and organic.",
      ru: "Сушка, сортировка и упаковка кураги, изюма и чернослива — обычных и органических.",
      uz: "O‘rik, mayiz va qoqi olxo‘rini quritish, saralash va qadoqlash — oddiy va organik.",
    },
    image: "",
  },
  {
    name: { en: "Nut processing line", ru: "Линия переработки орехов", uz: "Yong‘oq liniyasi" },
    location: { en: "Uzbekistan", ru: "Узбекистан", uz: "O‘zbekiston" },
    capacity: "10 000 T",
    description: {
      en: "Shelling, grading and packing of peanuts, walnuts and almonds.",
      ru: "Очистка, калибровка и упаковка арахиса, грецкого ореха и миндаля.",
      uz: "Yeryong‘oq, yong‘oq va bodomni po‘stlash, saralash va qadoqlash.",
    },
    image: "",
  },
  {
    name: { en: "Warehouse & cold storage", ru: "Склад и холодильное хранение", uz: "Ombor va sovutgich" },
    location: { en: "Uzbekistan", ru: "Узбекистан", uz: "O‘zbekiston" },
    capacity: "15 000 T + 1 000 T",
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
    uz: "Toshkent, O‘zbekiston",
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
      label: { en: "Export department", ru: "Отдел экспорта", uz: "Eksport bo‘limi" },
      value: "salim@globalex.uz",
      href: "mailto:salim@globalex.uz",
    },
    {
      label: { en: "Export department", ru: "Отдел экспорта", uz: "Eksport bo‘limi" },
      value: "bi@globalex.uz",
      href: "mailto:bi@globalex.uz",
    },
    {
      label: { en: "Export department", ru: "Отдел экспорта", uz: "Eksport bo‘limi" },
      value: "bekzod@globalex.uz",
      href: "mailto:bekzod@globalex.uz",
    },
    {
      label: { en: "Export department", ru: "Отдел экспорта", uz: "Eksport bo‘limi" },
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
  mapLink: "https://www.google.com/maps/place/Tashkent,+Uzbekistan",
  workingHours: {
    en: "Monday – Friday, 09:00 – 18:00 (GMT+5)",
    ru: "Понедельник – пятница, 09:00 – 18:00 (GMT+5)",
    uz: "Dushanba – juma, 09:00 – 18:00 (GMT+5)",
  },
};
