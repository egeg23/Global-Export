import { FoodmaxxHeader } from "@/components/foodmaxx/ui/header";
import { FoodmaxxHero } from "@/components/foodmaxx/hero";
import { JarOpening } from "@/components/foodmaxx/scenes/jar-opening";

/**
 * Сайт FOODMAXX.
 *
 * Одна страница со сквозным сценарием: от первого экрана к банке, которая
 * раскрывается, и дальше к производству, каталогу и заявке.
 */
export default function FoodmaxxPage() {
  return (
    <>
      <FoodmaxxHeader />
      <main id="content">
        <FoodmaxxHero />
        <JarOpening />
      </main>
    </>
  );
}
