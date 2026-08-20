import type { Category } from "@/lib/content/types";

/**
 * The four product lines the company sells, matching the navigation of
 * globalex.uz. Imagery is filled in from `public/images/products/`.
 */
export const categories: Category[] = [
  {
    slug: "beans",
    name: { en: "Beans & Pulses", ru: "Бобовые", uz: "Dukkaklilar" },
    shortName: { en: "Beans", ru: "Бобовые", uz: "Dukkaklilar" },
    description: {
      en: "Mung beans, kidney beans and chickpeas — cleaned, calibrated and packed to importer specification. 25 000 tonnes of annual processing capacity.",
      ru: "Маш, красная фасоль и нут — очищенные, откалиброванные и упакованные по спецификации импортёра. Мощность переработки — 25 000 тонн в год.",
      uz: "Mosh, loviya va noʻxat — tozalangan, kalibrlangan va importchi spetsifikatsiyasi boʻyicha qadoqlangan. Yillik qayta ishlash quvvati — 25 000 tonna.",
    },
    image: "/images/categories/beans.jpg",
  },
  {
    slug: "dried-fruits",
    name: {
      en: "Dried Fruits & Nuts",
      ru: "Сухофрукты и Орехи",
      uz: "Quritilgan mevalar va yongʻoqlar",
    },
    shortName: { en: "Dried fruits", ru: "Сухофрукты", uz: "Quritilgan mevalar" },
    description: {
      en: "Apricots, raisins, prunes, peanuts, walnuts and almonds from Uzbekistan's growing regions — 15 000 tonnes of dried fruit and 10 000 tonnes of nut capacity.",
      ru: "Курага, изюм, чернослив, арахис, грецкий орех и миндаль из регионов выращивания Узбекистана — мощность 15 000 тонн сухофруктов и 10 000 тонн орехов.",
      uz: "Oʻzbekistonning yetishtirish hududlaridan oʻrik, mayiz, qoqi olxoʻri, yeryongʻoq, yongʻoq va bodom — 15 000 tonna quritilgan meva va 10 000 tonna yongʻoq quvvati.",
    },
    image: "/images/categories/dried-fruits.jpg",
  },
  {
    slug: "organic",
    name: { en: "Organic Products", ru: "Органические продукты", uz: "Organik mahsulotlar" },
    shortName: { en: "Organic", ru: "Органика", uz: "Organik" },
    description: {
      en: "An organic line of dried fruits, pulses and seeds, shown annually at BIOFACH. The range is announced and not yet shipping — certification documents are supplied on request.",
      ru: "Органическая линейка сухофруктов, бобовых и семян, ежегодно представляемая на BIOFACH. Линейка анонсирована и пока не отгружается — сертификационные документы предоставляются по запросу.",
      uz: "Har yili BIOFACH’da taqdim etiladigan quritilgan mevalar, dukkaklilar va urugʻlarning organik liniyasi. Liniya eʼlon qilingan va hozircha joʻnatilmaydi — sertifikat hujjatlari soʻrov boʻyicha beriladi.",
    },
    image: "/images/categories/organic.jpg",
  },
  {
    slug: "dried-vegetables",
    name: { en: "Dried Vegetables", ru: "Сушёные овощи", uz: "Quritilgan sabzavotlar" },
    shortName: { en: "Vegetables", ru: "Овощи", uz: "Sabzavotlar" },
    description: {
      en: "Dehydrated tomatoes, peppers, onions and carrots for the food-processing industry, supplied in slices, flakes or powder.",
      ru: "Сушёные томаты, перец, лук и морковь для пищевой промышленности — ломтиками, хлопьями или в виде порошка.",
      uz: "Oziq-ovqat sanoati uchun quritilgan pomidor, qalampir, piyoz va sabzi — boʻlaklar, parrakchalar yoki kukun shaklida.",
    },
    image: "/images/categories/dried-vegetables.jpg",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
