/**
 * Фотографии витрины Golden House.
 *
 * Все рендеры и снимки — их собственные, с gh.uz: показывать застройщику
 * стоковые дома вместо его же проектов бессмысленно. Файлы перегнаны в webp
 * и лежат в public/images/gh; исходные имена сохранены здесь, чтобы через
 * полгода было понятно, что откуда.
 *
 * Права на изображения принадлежат Golden House. Витрина закрыта кодом и
 * показывается только им.
 */

export const photo = (name: string) => `/images/gh/${name}.webp`;

export const credits: { file: string; source: string }[] = [
  { file: "ozmakon", source: "gh.uz · golden-house-ozmakon_res_view.jpg" },
  { file: "ozmakon-yard", source: "gh.uz · golden-house-ozmakon_courtyard-3_web-1.jpg" },
  { file: "ozmakon-lobby", source: "gh.uz · lobby-ozmakon-1.jpg" },
  { file: "infinity", source: "gh.uz · infinity-house-7.jpg" },
  { file: "infinity-facade", source: "gh.uz · infiniti2.jpg" },
  { file: "aerial", source: "gh.uz · infinity-house-bird.jpg" },
  { file: "zamin", source: "gh.uz · 000bez-l-wide-2.jpg" },
  { file: "boglar", source: "gh.uz · boglar-new-1.jpg" },
  { file: "boglar-yard", source: "gh.uz · assalom-boglar-1.jpg" },
  { file: "jomiy", source: "gh.uz · jomiy-renders-2.jpg" },
  { file: "jomiy-yard", source: "gh.uz · jomiy-render-dvor.jpg" },
  { file: "sohil", source: "gh.uz · asohil-new-1.jpg" },
  { file: "sohil-mop", source: "gh.uz · MOP-SOHIL-1.jpg" },
  { file: "havo", source: "gh.uz · Havo_cam01_post-JPEG.jpg" },
  { file: "makon-street", source: "gh.uz · new-oz-makon-4.jpg" },
  { file: "house", source: "gh.uz · golden-house-ozmakon_res_view.jpg, фон снят scripts/gh-cutout.py" },
  { file: "logo.svg", source: "gh.uz · new-logo-gh.svg" },
  {
    file: "globe",
    source:
      "NASA Blue Marble 2002 (общественное достояние), спроецировано на шар с центром в Ташкенте — scripts/gh-globe.py",
  },
];
