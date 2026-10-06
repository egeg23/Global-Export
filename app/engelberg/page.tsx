import { DevuzIntro } from "@/components/brand/devuz-intro";
import { Wordmark } from "@/components/engelberg/art";
import { After } from "@/components/engelberg/after";
import { StaticStory } from "@/components/engelberg/static";
import { Story } from "@/components/engelberg/story";

/**
 * Engelberg — макет главной: одна непрерывная история на прокрутке.
 *
 * Задача заказчика — «вау-анимации со скроллом и непрерывной веткой
 * повествования», по мотивам mont-fort.com и bentleymotors.com. Камера
 * спускается с Альп к дому, где загораются окна в пол, подлетает к раме,
 * проходит сквозь три контура профиля, выходит в комнату и останавливается
 * на ручке; дальше — тишина за окном, раздвижная BKH 65, фасад FS 50,
 * отделка и портфолио. Товары и характеристики — только с их сайта
 * (content/engelberg/site.ts).
 *
 * Для тех, кто попросил систему не двигать интерфейс, вместо истории —
 * те же главы стопкой (StaticStory).
 */
export default function EngelbergPage() {
  return (
    <>
      <DevuzIntro project="engelberg" />
      <header className="eb-header">
        <a href="#top" className="eb-logo" aria-label="Engelberg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/engelberg/crest.svg" alt="" />
          <Wordmark />
        </a>
        <nav className="eb-nav">
          <a href="https://engelberg-window.com/catalog/" target="_blank" rel="noreferrer">
            Каталог
          </a>
          <a href="https://engelberg-window.com/portfolio/" target="_blank" rel="noreferrer">
            Портфолио
          </a>
          <a href="#eb-contact" className="eb-cta">
            Консультация
          </a>
        </nav>
      </header>
      <main id="top">
        <Story />
        <StaticStory />
        <After />
      </main>
    </>
  );
}
