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
      en: "Mung beans, kidney beans, chickpeas and lentils — cleaned, calibrated and packed to importer specification. 25 000 tonnes of annual processing capacity.",
      ru: "Маш, красная фасоль, нут и чечевица — очищенные, откалиброванные и упакованные по спецификации импортёра. Мощность переработки — 25 000 тонн в год.",
      uz: "Mosh, loviya, no‘xat va yasmiq — tozalangan, kalibrlangan va importchi spetsifikatsiyasi bo‘yicha qadoqlangan. Yillik qayta ishlash quvvati — 25 000 tonna.",
    },
    image: "/images/categories/beans.jpg",
  },
  {
    slug: "dried-fruits",
    name: {
      en: "Dried Fruits & Nuts",
      ru: "Сухофрукты и Орехи",
      uz: "Quritilgan mevalar va yong‘oqlar",
    },
    shortName: { en: "Dried fruits", ru: "Сухофрукты", uz: "Quritilgan mevalar" },
    description: {
      en: "Apricots, raisins, prunes, peanuts, walnuts and almonds from Uzbekistan's growing regions — 15 000 tonnes of dried fruit and 10 000 tonnes of nut capacity.",
      ru: "Курага, изюм, чернослив, арахис, грецкий орех и миндаль из регионов выращивания Узбекистана — мощность 15 000 тонн сухофруктов и 10 000 тонн орехов.",
      uz: "O‘zbekistonning yetishtirish hududlaridan o‘rik, mayiz, qoqi olxo‘ri, yeryong‘oq, yong‘oq va bodom — 15 000 tonna quritilgan meva va 10 000 tonna yong‘oq quvvati.",
    },
    image: "/images/categories/dried-fruits.jpg",
  },
  {
    slug: "organic",
    name: { en: "Organic Products", ru: "Органические продукты", uz: "Organik mahsulotlar" },
    shortName: { en: "Organic", ru: "Органика", uz: "Organik" },
    description: {
      en: "Certified organic dried fruits and pulses for buyers who need documented organic status all the way back to the field.",
      ru: "Сертифицированные органические сухофрукты и бобовые для покупателей, которым нужен документально подтверждённый органический статус вплоть до поля.",
      uz: "Daladan boshlab hujjatlashtirilgan organik maqomni talab qiladigan xaridorlar uchun sertifikatlangan organik quritilgan mevalar va dukkaklilar.",
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
      uz: "Oziq-ovqat sanoati uchun quritilgan pomidor, qalampir, piyoz va sabzi — bo‘laklar, parrakchalar yoki kukun shaklida.",
    },
    image: "/images/categories/dried-vegetables.jpg",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
