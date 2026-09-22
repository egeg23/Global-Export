import type { Product, Shelf } from "@/lib/foodmaxx/types";

/**
 * Каталог FOODMAXX.
 *
 * Перенесён с foodmaxx.uz: названия и снимки — их, приписки взяты с этикеток
 * на самих банках. Состава, веса и цен компания не публикует, поэтому их
 * здесь нет: пустое поле честнее правдоподобной выдумки, а заполнить его
 * заказчик сможет в один проход, когда пришлёт спецификации.
 */
export const products: Product[] = [
  // ─── Овощная консервация ────────────────────────────────────────────────
  { slug: "ogurcy", name: "Огурцы маринованные", shelf: "ovoshi", image: "jar-ogurcy", pack: "steklo", note: "фирменная банка 1,7 л" },
  { slug: "kornishony", name: "Корнишоны маринованные", shelf: "ovoshi", image: "kornishony", pack: "steklo" },
  { slug: "ogurcy-slaysy", name: "Огурцы нарезанные слайсами", shelf: "ovoshi", image: "ogurcy-slaysy", pack: "steklo" },
  { slug: "assorti", name: "Ассорти маринованное", shelf: "ovoshi", image: "jar-assorti", pack: "steklo", note: "огурцы и томаты в одной банке" },
  { slug: "assorti-2", name: "Ассорти маринованное №2", shelf: "ovoshi", image: "jar-assorti-2", pack: "steklo" },
  { slug: "assorti-3", name: "Ассорти маринованное №3", shelf: "ovoshi", image: "jar-assorti-3", pack: "steklo" },
  { slug: "lecho", name: "Лечо в томатном соусе", shelf: "ovoshi", image: "lecho", pack: "steklo" },
  { slug: "gribnoe-assorti", name: "Грибное ассорти", shelf: "ovoshi", image: "gribnoe-assorti", pack: "steklo" },
  { slug: "opyata", name: "Опята маринованные", shelf: "ovoshi", image: "opyata", pack: "steklo" },
  { slug: "gruzdi", name: "Грузди маринованные", shelf: "ovoshi", image: "gruzdi", pack: "steklo" },
  { slug: "veselyj-gribnik", name: "Весёлый грибник", shelf: "ovoshi", image: "veselyj-gribnik", pack: "steklo" },
  { slug: "ikra-kabachkovaya", name: "Икра кабачковая", shelf: "ovoshi", image: "ikra-kabachkovaya", pack: "steklo" },
  { slug: "ikra-ovoshnaya", name: "Икра овощная", shelf: "ovoshi", image: "ikra-ovoshnaya", pack: "steklo" },
  { slug: "pomidorro", name: "«Помидорро» томатная паста", shelf: "ovoshi", image: "pomidorro", pack: "steklo" },

  // ─── Мясная консервация ─────────────────────────────────────────────────
  { slug: "myaso-byka", name: "Мясо быка «Экстра»", shelf: "myaso", image: "myaso-byka", pack: "zhest", note: "тушёное кусковое" },
  { slug: "govyadina", name: "Говядина тушёная", shelf: "myaso", image: "govyadina", pack: "zhest", note: "кусковая" },
  { slug: "govyadina-elit", name: "Говядина элитная", shelf: "myaso", image: "govyadina-elit", pack: "zhest", note: "тушёная кусковая" },
  { slug: "govyadina-premium", name: "Говядина премиум", shelf: "myaso", image: "govyadina-premium", pack: "zhest" },
  { slug: "govyadina-orig", name: "Говядина оригинальная", shelf: "myaso", image: "govyadina-orig", pack: "zhest" },
  { slug: "govyadina-halal", name: "Говядина тушёная халяль", shelf: "myaso", image: "govyadina-halal", pack: "zhest", note: "100% halal" },
  { slug: "govyadina-dachnaya", name: "Говядина дачная", shelf: "myaso", image: "govyadina-dachnaya", pack: "zhest" },
  { slug: "govyadina-lyub", name: "Говядина любительская", shelf: "myaso", image: "govyadina-lyub", pack: "zhest" },
  { slug: "govyadina-2", name: "Говядина тушёная кусковая", shelf: "myaso", image: "govyadina-2", pack: "zhest" },
  { slug: "govyadina-3", name: "Говядина тушёная", shelf: "myaso", image: "govyadina-3", pack: "zhest" },
  { slug: "baranina", name: "Баранина тушёная", shelf: "myaso", image: "baranina", pack: "zhest", note: "кусковая" },
  { slug: "baranina-elit", name: "Баранина элитная", shelf: "myaso", image: "baranina-elit", pack: "zhest" },
  { slug: "konina", name: "Конина тушёная", shelf: "myaso", image: "konina", pack: "zhest", note: "кусковая" },
  { slug: "konina-elit", name: "Конина элитная", shelf: "myaso", image: "konina-elit", pack: "zhest" },
  { slug: "krolik", name: "Мясо кролика", shelf: "myaso", image: "krolik", pack: "zhest", note: "тушёное кусковое" },
  { slug: "kazy", name: "Казы к бешбармаку", shelf: "myaso", image: "kazy", pack: "zhest", note: "конина тушёная" },
  { slug: "kavurdak", name: "Кавурдак", shelf: "myaso", image: "kavurdak", pack: "zhest", note: "национальное блюдо" },
  { slug: "zhiz", name: "Жиз", shelf: "myaso", image: "zhiz", pack: "zhest", note: "национальное блюдо" },
  { slug: "chuponcha", name: "Чупонча", shelf: "myaso", image: "chuponcha", pack: "zhest", note: "национальное блюдо" },

  // ─── Готовые блюда ──────────────────────────────────────────────────────
  { slug: "plov", name: "Узбекский плов", shelf: "blyuda", image: "plov", pack: "zhest" },
  { slug: "plov-kuraga", name: "Плов с курагой", shelf: "blyuda", image: "plov-kuraga", pack: "zhest" },
  { slug: "plov-izyum", name: "Плов с мясом и изюмом", shelf: "blyuda", image: "plov-izyum", pack: "zhest" },
  { slug: "plov-chernosliv", name: "Плов с мясом и черносливом", shelf: "blyuda", image: "plov-chernosliv", pack: "zhest" },
  { slug: "plov-kuraga2", name: "Плов с мясом и курагой", shelf: "blyuda", image: "plov-kuraga2", pack: "zhest" },
  { slug: "halim", name: "Халим узбекский", shelf: "blyuda", image: "halim", pack: "zhest" },
  { slug: "gulyash", name: "Гуляш говяжий", shelf: "blyuda", image: "gulyash", pack: "zhest" },
  { slug: "zapravka-lagman", name: "Заправка к лагману", shelf: "blyuda", image: "zapravka-lagman", pack: "zhest" },
  { slug: "zapravka-makarony", name: "Заправка к макаронам", shelf: "blyuda", image: "zapravka-makarony", pack: "zhest", note: "по-флотски" },
  { slug: "makarony", name: "Макароны по-флотски", shelf: "blyuda", image: "makarony", pack: "zhest" },
  { slug: "vetchina", name: "Домашняя ветчина", shelf: "blyuda", image: "vetchina", pack: "zhest" },
  { slug: "vetchina-2", name: "Домашняя ветчина", shelf: "blyuda", image: "vetchina-2", pack: "zhest" },
  { slug: "uksus-yabloko", name: "Уксус яблочный 6%", shelf: "blyuda", image: "uksus-yabloko", pack: "butylka" },
  { slug: "uksus-stolovyj", name: "Уксус столовый 9%", shelf: "blyuda", image: "uksus-stolovyj", pack: "butylka" },
];

export const shelves: { id: Shelf; label: string; note: string }[] = [
  { id: "ovoshi", label: "Овощная консервация", note: "Огурцы, ассорти, грибы и икра в стекле" },
  { id: "myaso", label: "Мясная консервация", note: "Говядина, баранина, конина и национальные блюда" },
  { id: "blyuda", label: "Готовые блюда", note: "Плов, халим, заправки и ветчина" },
];

/**
 * Снимки для сцен: лежат в `/public/foodmaxx/scene`, а не среди товаров.
 *
 * Часть исходников заказчика сюда не попала намеренно: помидоры у него взяты
 * со стока и идут с водяными знаками «pngtree» поперёк кадра, а два снимка
 * огурцов — с остатками белого фона. Чужой водяной знак на сайте компании
 * читается как ворованная картинка, поэтому вместо них здесь то, что чисто.
 */
export const scene = {
  jarOgurcy: "/foodmaxx/scene/jar-ogurcy.webp",
  jarBody: "/foodmaxx/scene/jar-body.webp",
  jarLid: "/foodmaxx/scene/jar-lid.webp",
  jarAssorti: "/foodmaxx/scene/jar-assorti.webp",
  ogurec: "/foodmaxx/scene/ogurec.webp",
  tomatoBasil: "/foodmaxx/scene/tomato-basil.webp",
  perec: "/foodmaxx/sets/perec.webp",
  heart: "/foodmaxx/scene/heart-veg.webp",
  zavod: "/foodmaxx/scene/zavod.webp",
} as const;

export const byShelf = (shelf: Product["shelf"]) => products.filter((p) => p.shelf === shelf);
