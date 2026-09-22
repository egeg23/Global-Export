import { FoodmaxxHeader } from "@/components/foodmaxx/ui/header";
import { FoodmaxxHero } from "@/components/foodmaxx/hero";
import { JarOpening } from "@/components/foodmaxx/scenes/jar-opening";
import { CanRolling } from "@/components/foodmaxx/scenes/can-rolling";
import { FoodmaxxCatalog } from "@/components/foodmaxx/catalog";
import { FoodmaxxAbout } from "@/components/foodmaxx/about";
import { FoodmaxxClients } from "@/components/foodmaxx/clients";
import { FoodmaxxContact } from "@/components/foodmaxx/contact";
import { FoodmaxxFooter } from "@/components/foodmaxx/ui/footer";

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
        <CanRolling />
        <FoodmaxxCatalog />
        <FoodmaxxClients />
        <FoodmaxxAbout />
        <FoodmaxxContact />
      </main>
      <FoodmaxxFooter />
    </>
  );
}
