/**
 * Пропуск к содержимому.
 *
 * До главного на этих страницах — шапка с меню: тому, кто ходит с клавиатуры
 * или экранным диктором, иначе приходится проходить её на каждой странице.
 * Ссылка не спрятана в `sr-only` насовсем — она появляется, как только на неё
 * встал фокус, и это единственный способ узнать о ней.
 */
export function SkipLink() {
  return (
    <a
      href="#content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-adar-gold-500 focus:px-6 focus:py-3 focus:text-sm focus:font-medium focus:text-adar-green-950"
    >
      Пропустить к содержимому
    </a>
  );
}
